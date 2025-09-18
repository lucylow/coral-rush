import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIAssistantRequest {
  message: string;
  context?: string;
  use_voice_response?: boolean;
  conversation_history?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
  user_preferences?: {
    response_style?: 'concise' | 'detailed' | 'technical' | 'friendly';
    expertise_level?: 'beginner' | 'intermediate' | 'advanced';
    language?: string;
  };
}

interface AIAssistantResponse {
  response: string;
  audio?: string;
  api_used: string;
  has_voice: boolean;
  processing_time: number;
  success: boolean;
  conversation_id?: string;
  suggestions?: string[];
  confidence_score?: number;
}

// Enhanced system prompts for different contexts
const SYSTEM_PROMPTS = {
  default: `You are RUSH Support Agent, an expert Web3 customer support assistant. You help users with:
- NFT minting and trading issues
- DeFi transaction problems  
- Wallet connection troubles
- Smart contract interactions
- Blockchain explorers and transaction tracking
- Token swaps and liquidity provision
- Staking and yield farming
- Cross-chain transactions
- Security best practices

Be helpful, empathetic, and provide actionable solutions. Keep responses concise but comprehensive.`,
  
  technical: `You are RUSH Technical Support Agent, specializing in advanced Web3 technical issues. You help with:
- Smart contract debugging and interactions
- Gas optimization strategies
- MEV protection and transaction ordering
- Advanced DeFi protocols and integrations
- Blockchain development and testing
- Security audits and vulnerability assessments

Provide technical depth while remaining accessible. Include code examples when relevant.`,
  
  beginner: `You are RUSH Friendly Support Agent, helping newcomers to Web3. You explain:
- Basic blockchain concepts in simple terms
- Step-by-step wallet setup and security
- Simple transaction processes
- Common pitfalls and how to avoid them
- Educational resources and tutorials

Use simple language, avoid jargon, and be very patient and encouraging.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const requestBody: AIAssistantRequest = await req.json();
    const { 
      message, 
      context = '', 
      use_voice_response = false,
      conversation_history = [],
      user_preferences = {}
    } = requestBody;
    
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string');
    }

    if (message.length > 2000) {
      throw new Error('Message too long. Maximum 2000 characters allowed');
    }

    console.log(`Processing AI assistant request: ${message.length} characters, voice: ${use_voice_response}`);

    const AIMLAPI_API_KEY = Deno.env.get('aimlapi_api_key');
    const NEBIUS_API_KEY = Deno.env.get('Nebius_api_key');
    
    if (!AIMLAPI_API_KEY && !NEBIUS_API_KEY) {
      throw new Error('No AI API keys found in environment variables');
    }

    let aiResponse = '';
    let apiUsed = '';
    let confidenceScore = 0.8;

    // Build conversation context
    const systemPrompt = getSystemPrompt(user_preferences.expertise_level, context);
    const messages = [
      {
        role: 'system' as const,
        content: `${systemPrompt}\n\nContext: ${context || 'General support inquiry'}\nResponse Style: ${user_preferences.response_style || 'concise'}`
      }
    ];

    // Add conversation history (last 10 messages to avoid token limits)
    const recentHistory = conversation_history.slice(-10);
    messages.push(...recentHistory);

    // Add current message
    messages.push({
      role: 'user' as const,
      content: message
    });

    // Try AIML API first (preferred for GPT-4o)
    if (AIMLAPI_API_KEY) {
      try {
        const response = await fetch('https://api.aimlapi.com/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AIMLAPI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1200,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
          }),
        });

        if (response.ok) {
          const result = await response.json();
          aiResponse = result.choices[0].message.content;
          apiUsed = 'AIML API (GPT-4o)';
          confidenceScore = 0.95;
          console.log('Successfully used AIML API');
        } else {
          console.log('AIML API failed with status:', response.status);
        }
      } catch (error) {
        console.log('AIML API failed with error:', error.message);
      }
    }

    // Fallback to Nebius API
    if (!aiResponse && NEBIUS_API_KEY) {
      try {
        const response = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NEBIUS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1200,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
          }),
        });

        if (response.ok) {
          const result = await response.json();
          aiResponse = result.choices[0].message.content;
          apiUsed = 'Nebius API (Llama-3.1-70B)';
          confidenceScore = 0.9;
          console.log('Successfully used Nebius API');
        } else {
          console.log('Nebius API failed with status:', response.status);
        }
      } catch (error) {
        console.log('Nebius API failed with error:', error.message);
      }
    }

    // If both APIs fail, provide a contextual fallback response
    if (!aiResponse) {
      aiResponse = generateFallbackResponse(message, context);
      apiUsed = 'Fallback Response';
      confidenceScore = 0.3;
    }

    // Generate voice response if requested
    let audioResponse = null;
    if (use_voice_response && aiResponse) {
      try {
        const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
        const ELEVENLABS_VOICE_ID = Deno.env.get('ELEVENLABS_VOICE_ID');
        
        if (ELEVENLABS_API_KEY) {
          const voiceId = ELEVENLABS_VOICE_ID || 'TxGEqnHWrfWFTfGW9XjX'; // Support voice
          
          const voiceResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text: aiResponse,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.6,
                similarity_boost: 0.8,
                style: 0.2,
                use_speaker_boost: true
              }
            }),
          });

          if (voiceResponse.ok) {
            const audioBuffer = await voiceResponse.arrayBuffer();
            audioResponse = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
          }
        }
      } catch (voiceError) {
        console.log('Voice synthesis failed:', voiceError.message);
      }
    }

    // Generate helpful suggestions
    const suggestions = generateSuggestions(message, aiResponse);
    
    const processingTime = Date.now() - startTime;
    
    const responseData: AIAssistantResponse = {
      response: aiResponse,
      audio: audioResponse,
      api_used: apiUsed,
      has_voice: !!audioResponse,
      processing_time: processingTime,
      success: true,
      conversation_id: generateConversationId(),
      suggestions: suggestions,
      confidence_score: confidenceScore
    };

    console.log(`AI assistant completed in ${processingTime}ms using ${apiUsed}`);
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error in ai-assistant function:', {
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

function getSystemPrompt(expertiseLevel?: string, context?: string): string {
  if (expertiseLevel === 'beginner') {
    return SYSTEM_PROMPTS.beginner;
  } else if (expertiseLevel === 'advanced' || context?.includes('technical')) {
    return SYSTEM_PROMPTS.technical;
  }
  return SYSTEM_PROMPTS.default;
}

function generateFallbackResponse(message: string, context?: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('transaction') || lowerMessage.includes('tx')) {
    return "I apologize for the technical difficulties. For transaction-related issues, please check your transaction hash on a blockchain explorer like Solscan or Etherscan. If your transaction is stuck, you may need to increase gas fees or wait for network congestion to clear.";
  }
  
  if (lowerMessage.includes('wallet') || lowerMessage.includes('connect')) {
    return "I'm experiencing technical issues right now. For wallet connection problems, try refreshing the page, clearing your browser cache, or using a different browser. Make sure you're using the latest version of your wallet extension.";
  }
  
  if (lowerMessage.includes('nft') || lowerMessage.includes('token')) {
    return "I apologize for the temporary service interruption. For NFT or token issues, please verify the contract address, check if you have sufficient gas fees, and ensure you're interacting with the correct network. Our support team can help with specific contract interactions.";
  }
  
  return `I apologize, but I'm currently experiencing technical difficulties with our AI services. Your inquiry about "${message.substring(0, 50)}..." has been logged for follow-up. For immediate assistance, please contact our support team directly or try again in a few moments.`;
}

function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const suggestions = [];
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('transaction')) {
    suggestions.push("Check transaction status on blockchain explorer");
    suggestions.push("Verify gas fees and network settings");
  }
  
  if (lowerMessage.includes('wallet')) {
    suggestions.push("Try reconnecting your wallet");
    suggestions.push("Check wallet extension updates");
  }
  
  if (lowerMessage.includes('defi') || lowerMessage.includes('swap')) {
    suggestions.push("Review slippage tolerance settings");
    suggestions.push("Check liquidity availability");
  }
  
  // Always add general suggestions
  if (suggestions.length === 0) {
    suggestions.push("Browse our documentation");
    suggestions.push("Join our Discord community");
    suggestions.push("Contact support team");
  }
  
  return suggestions.slice(0, 3); // Return max 3 suggestions
}

function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}