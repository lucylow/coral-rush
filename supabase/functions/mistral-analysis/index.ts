import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, context } = await req.json();
    
    const MISTRAL_API_KEY = Deno.env.get('MISTRAL_API_KEY');
    if (!MISTRAL_API_KEY) {
      throw new Error('MISTRAL_API_KEY not found');
    }

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
            content: `You are an expert Web3 support analyst. Analyze user messages for:
1. Intent (technical issue, transaction problem, general inquiry, complaint)
2. Emotion (frustrated, confused, angry, neutral, happy)
3. Urgency (low, medium, high, critical)
4. Technical context (NFT, DeFi, smart contract, wallet, etc.)
5. Recommended action

Respond in JSON format with these fields: intent, emotion, urgency, technical_area, recommended_action, confidence_score (0-1).`
          },
          {
            role: 'user',
            content: `User message: "${text}"\nContext: ${context || 'No additional context'}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Mistral API error:', error);
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const result = await response.json();
    const analysis = result.choices[0].message.content;
    
    try {
      const parsedAnalysis = JSON.parse(analysis);
      return new Response(JSON.stringify({
        analysis: parsedAnalysis,
        raw_response: analysis,
        model: 'mistral-large-latest',
        processing_time: Date.now()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      // If JSON parsing fails, return the raw analysis
      return new Response(JSON.stringify({
        analysis: { raw_text: analysis },
        raw_response: analysis,
        model: 'mistral-large-latest',
        processing_time: Date.now()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in mistral-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});