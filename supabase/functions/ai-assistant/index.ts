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
    const { message, context, use_voice_response } = await req.json();
    
    const AIMLAPI_API_KEY = Deno.env.get('aimlapi_api_key');
    const NEBIUS_API_KEY = Deno.env.get('Nebius_api_key');
    
    if (!AIMLAPI_API_KEY && !NEBIUS_API_KEY) {
      throw new Error('No AI API keys found');
    }

    let aiResponse;
    let apiUsed = '';

    // Try AIML API first, fallback to Nebius
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
            messages: [
              {
                role: 'system',
                content: `You are OrgoRush Support Agent, an expert Web3 customer support assistant. You help users with:
- NFT minting and trading issues
- DeFi transaction problems  
- Wallet connection troubles
- Smart contract interactions
- Blockchain explorers and transaction tracking

Be helpful, empathetic, and provide actionable solutions. Keep responses concise but comprehensive.
Context: ${context || 'General support inquiry'}`
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          }),
        });

        if (response.ok) {
          const result = await response.json();
          aiResponse = result.choices[0].message.content;
          apiUsed = 'AIML API (GPT-4o)';
        }
      } catch (error) {
        console.log('AIML API failed, trying Nebius:', error.message);
      }
    }

    // Fallback to Nebius API if AIML failed
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
            messages: [
              {
                role: 'system',
                content: `You are OrgoRush Support Agent, an expert Web3 customer support assistant. Context: ${context || 'General support inquiry'}`
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          }),
        });

        if (response.ok) {
          const result = await response.json();
          aiResponse = result.choices[0].message.content;
          apiUsed = 'Nebius API (Llama-3.1-70B)';
        }
      } catch (error) {
        console.log('Nebius API also failed:', error.message);
      }
    }

    if (!aiResponse) {
      throw new Error('All AI APIs failed to respond');
    }

    // If voice response is requested, also convert to speech
    let audioResponse = null;
    if (use_voice_response) {
      try {
        const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
        const ELEVENLABS_VOICE_ID = Deno.env.get('ELEVENLABS_VOICE_ID');
        
        if (ELEVENLABS_API_KEY) {
          const voiceId = ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
          
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
                stability: 0.5,
                similarity_boost: 0.5
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
    
    return new Response(JSON.stringify({
      response: aiResponse,
      audio: audioResponse,
      api_used: apiUsed,
      has_voice: !!audioResponse,
      processing_time: Date.now()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});