import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  text: string;
  context?: string;
  analysis_type?: 'comprehensive' | 'quick' | 'sentiment' | 'technical';
  user_profile?: {
    experience_level?: 'beginner' | 'intermediate' | 'advanced';
    previous_issues?: string[];
  };
}

interface AnalysisResponse {
  analysis: {
    intent: string;
    emotion: string;
    urgency: string;
    technical_area: string;
    recommended_action: string;
    confidence_score: number;
    sentiment_score?: number;
    complexity_level?: string;
    keywords?: string[];
    suggested_resources?: string[];
  };
  raw_response: string;
  model: string;
  processing_time: number;
  analysis_type: string;
  success: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const requestBody: AnalysisRequest = await req.json();
    const { 
      text, 
      context = '',
      analysis_type = 'comprehensive',
      user_profile = {}
    } = requestBody;
    
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string');
    }

    if (text.length > 1000) {
      throw new Error('Text too long. Maximum 1000 characters allowed for analysis');
    }

    console.log(`Processing Mistral analysis: ${text.length} characters, type: ${analysis_type}`);

    const MISTRAL_API_KEY = Deno.env.get('MISTRAL_API_KEY');
    if (!MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY not found in environment variables');
    }

    // Build enhanced system prompt based on analysis type
    const systemPrompt = buildSystemPrompt(analysis_type, user_profile);

    // Analyze user intent and emotion using Mistral AI
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `User message: "${text}"\nContext: ${context || 'No additional context'}\nUser Experience Level: ${user_profile.experience_level || 'unknown'}`
          }
        ],
        temperature: 0.2,
        max_tokens: 800,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      let errorMessage = `Mistral API error: ${response.status}`;
      if (response.status === 401) {
        errorMessage = 'Invalid API key for Mistral AI';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded for Mistral AI API';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request parameters for Mistral AI';
      } else if (response.status >= 500) {
        errorMessage = 'Mistral AI service temporarily unavailable';
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    const analysis = result.choices[0].message.content;
    
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the raw text
      parsedAnalysis = parseRawAnalysis(analysis, text);
    }

    // Enhance analysis with additional insights
    const enhancedAnalysis = enhanceAnalysis(parsedAnalysis, text, user_profile);
    
    const processingTime = Date.now() - startTime;
    
    const responseData: AnalysisResponse = {
      analysis: enhancedAnalysis,
      raw_response: analysis,
      model: 'mistral-large-latest',
      processing_time: processingTime,
      analysis_type: analysis_type,
      success: true
    };

    console.log(`Mistral analysis completed in ${processingTime}ms`);
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error in mistral-analysis function:', {
      error: error.message,
      stack: error.stack,
      processingTime
    });
    
    return new Response(JSON.stringify({ 
      error: error.message,
      processing_time: processingTime,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildSystemPrompt(analysisType: string, userProfile: any): string {
  const basePrompt = `You are an expert Web3 support analyst. Analyze user messages for:
1. Intent (technical_issue, transaction_problem, general_inquiry, complaint, feature_request, bug_report)
2. Emotion (frustrated, confused, angry, neutral, happy, concerned, excited)
3. Urgency (low, medium, high, critical)
4. Technical context (NFT, DeFi, smart_contract, wallet, blockchain, token, staking, yield_farming)
5. Recommended action
6. Confidence score (0-1)

Respond in JSON format with these exact fields: intent, emotion, urgency, technical_area, recommended_action, confidence_score.`;

  if (analysisType === 'comprehensive') {
    return `${basePrompt}

Additional analysis:
- sentiment_score (-1 to 1, where -1 is very negative, 1 is very positive)
- complexity_level (simple, moderate, complex)
- keywords (extract key technical terms)
- suggested_resources (relevant documentation or tools)

Include all fields in your JSON response.`;
  } else if (analysisType === 'sentiment') {
    return `${basePrompt}

Focus heavily on emotional analysis:
- Provide detailed sentiment_score (-1 to 1)
- Identify emotional triggers
- Suggest empathy strategies for support agents`;
  } else if (analysisType === 'technical') {
    return `${basePrompt}

Focus on technical aspects:
- Identify specific blockchain protocols mentioned
- Assess technical complexity
- Suggest technical resources and documentation
- Identify potential security concerns`;
  }

  return basePrompt;
}

function parseRawAnalysis(rawText: string, originalText: string): any {
  // Extract information from raw text using patterns
  const analysis: any = {
    intent: 'general_inquiry',
    emotion: 'neutral',
    urgency: 'medium',
    technical_area: 'general',
    recommended_action: 'provide_general_support',
    confidence_score: 0.5
  };

  const lowerText = rawText.toLowerCase();
  const lowerOriginal = originalText.toLowerCase();

  // Intent detection
  if (lowerOriginal.includes('error') || lowerOriginal.includes('failed')) {
    analysis.intent = 'technical_issue';
  } else if (lowerOriginal.includes('transaction') || lowerOriginal.includes('tx')) {
    analysis.intent = 'transaction_problem';
  } else if (lowerOriginal.includes('complaint') || lowerOriginal.includes('angry')) {
    analysis.intent = 'complaint';
  }

  // Emotion detection
  if (lowerOriginal.includes('frustrated') || lowerOriginal.includes('angry')) {
    analysis.emotion = 'frustrated';
  } else if (lowerOriginal.includes('confused') || lowerOriginal.includes('help')) {
    analysis.emotion = 'confused';
  }

  // Urgency detection
  if (lowerOriginal.includes('urgent') || lowerOriginal.includes('asap')) {
    analysis.urgency = 'high';
  } else if (lowerOriginal.includes('critical') || lowerOriginal.includes('emergency')) {
    analysis.urgency = 'critical';
  }

  // Technical area detection
  if (lowerOriginal.includes('nft')) {
    analysis.technical_area = 'NFT';
  } else if (lowerOriginal.includes('defi') || lowerOriginal.includes('swap')) {
    analysis.technical_area = 'DeFi';
  } else if (lowerOriginal.includes('wallet')) {
    analysis.technical_area = 'wallet';
  }

  return analysis;
}

function enhanceAnalysis(analysis: any, text: string, userProfile: any): any {
  // Add sentiment score if not present
  if (!analysis.sentiment_score) {
    analysis.sentiment_score = calculateSentimentScore(text);
  }

  // Add complexity level if not present
  if (!analysis.complexity_level) {
    analysis.complexity_level = assessComplexity(text, userProfile.experience_level);
  }

  // Add keywords if not present
  if (!analysis.keywords) {
    analysis.keywords = extractKeywords(text);
  }

  // Add suggested resources if not present
  if (!analysis.suggested_resources) {
    analysis.suggested_resources = generateResourceSuggestions(analysis.technical_area, analysis.intent);
  }

  return analysis;
}

function calculateSentimentScore(text: string): number {
  const positiveWords = ['good', 'great', 'excellent', 'helpful', 'working', 'thanks', 'thank you'];
  const negativeWords = ['bad', 'terrible', 'awful', 'broken', 'error', 'failed', 'frustrated', 'angry'];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 0.2;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 0.2;
  });
  
  return Math.max(-1, Math.min(1, score));
}

function assessComplexity(text: string, experienceLevel?: string): string {
  const technicalTerms = ['smart contract', 'gas fee', 'blockchain', 'protocol', 'liquidity', 'staking', 'yield'];
  const technicalCount = technicalTerms.filter(term => text.toLowerCase().includes(term)).length;
  
  if (technicalCount >= 3 || experienceLevel === 'beginner') {
    return 'complex';
  } else if (technicalCount >= 1) {
    return 'moderate';
  }
  return 'simple';
}

function extractKeywords(text: string): string[] {
  const keywords = [];
  const lowerText = text.toLowerCase();
  
  const web3Terms = ['nft', 'defi', 'wallet', 'transaction', 'token', 'swap', 'staking', 'yield', 'liquidity', 'gas', 'blockchain', 'smart contract'];
  
  web3Terms.forEach(term => {
    if (lowerText.includes(term)) {
      keywords.push(term);
    }
  });
  
  return keywords.slice(0, 5); // Return max 5 keywords
}

function generateResourceSuggestions(technicalArea: string, intent: string): string[] {
  const suggestions = [];
  
  if (technicalArea === 'NFT') {
    suggestions.push('NFT marketplace documentation');
    suggestions.push('ERC-721/ERC-1155 standards guide');
  } else if (technicalArea === 'DeFi') {
    suggestions.push('DeFi protocol documentation');
    suggestions.push('Yield farming best practices');
  } else if (technicalArea === 'wallet') {
    suggestions.push('Wallet setup guide');
    suggestions.push('Security best practices');
  }
  
  if (intent === 'transaction_problem') {
    suggestions.push('Transaction troubleshooting guide');
  } else if (intent === 'technical_issue') {
    suggestions.push('Technical support documentation');
  }
  
  return suggestions.slice(0, 3); // Return max 3 suggestions
}