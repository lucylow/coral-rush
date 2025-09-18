import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TextToVoiceRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  output_format?: 'mp3_22050_32' | 'mp3_44100_32' | 'mp3_44100_64' | 'mp3_44100_96' | 'mp3_44100_128' | 'mp3_44100_192' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100' | 'ulaw_8000';
}

interface TextToVoiceResponse {
  audio: string;
  voice_id: string;
  model_id: string;
  text_length: number;
  processing_time: number;
  output_format: string;
  success: boolean;
}

// Available voices for RUSH
const AVAILABLE_VOICES = {
  'default': 'pNInz6obpgDQGcFmaJgB', // Adam
  'professional': 'EXAVITQu4vr4xnSDxMaL', // Bella
  'friendly': 'VR6AewLTigWG4xSOukaG', // Arnold
  'support': 'TxGEqnHWrfWFTfGW9XjX', // Josh
  'technical': 'CYw3kZ02Hs0563khs1Fj', // Domi
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const requestBody: TextToVoiceRequest = await req.json();
    const { 
      text, 
      voice_id, 
      model_id = 'eleven_multilingual_v2',
      voice_settings,
      output_format = 'mp3_44100_32'
    } = requestBody;
    
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string');
    }

    if (text.length > 5000) {
      throw new Error('Text too long. Maximum 5000 characters allowed');
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const ELEVENLABS_VOICE_ID = Deno.env.get('ELEVENLABS_VOICE_ID');
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not found in environment variables');
    }

    // Determine voice ID with fallback chain
    let selectedVoiceId = voice_id;
    if (!selectedVoiceId && ELEVENLABS_VOICE_ID) {
      selectedVoiceId = ELEVENLABS_VOICE_ID;
    }
    if (!selectedVoiceId) {
      selectedVoiceId = AVAILABLE_VOICES.default;
    }

    // Validate voice ID format
    if (!/^[a-zA-Z0-9]{20}$/.test(selectedVoiceId)) {
      // Try to find voice by name in available voices
      const voiceByName = AVAILABLE_VOICES[selectedVoiceId as keyof typeof AVAILABLE_VOICES];
      if (voiceByName) {
        selectedVoiceId = voiceByName;
      } else {
        selectedVoiceId = AVAILABLE_VOICES.default;
      }
    }

    console.log(`Generating speech for text: ${text.length} characters, voice: ${selectedVoiceId}, model: ${model_id}`);

    // Default voice settings optimized for support conversations
    const defaultVoiceSettings = {
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.2,
      use_speaker_boost: true
    };

    const finalVoiceSettings = { ...defaultVoiceSettings, ...voice_settings };

    // Generate speech using ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: model_id,
        voice_settings: finalVoiceSettings,
        output_format: output_format
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      let errorMessage = `ElevenLabs TTS error: ${response.status}`;
      if (response.status === 401) {
        errorMessage = 'Invalid API key for ElevenLabs';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded for ElevenLabs API';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request parameters for text-to-speech';
      } else if (response.status >= 500) {
        errorMessage = 'ElevenLabs service temporarily unavailable';
      }
      
      throw new Error(errorMessage);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
    
    const processingTime = Date.now() - startTime;
    
    const responseData: TextToVoiceResponse = {
      audio: base64Audio,
      voice_id: selectedVoiceId,
      model_id: model_id,
      text_length: text.length,
      processing_time: processingTime,
      output_format: output_format,
      success: true
    };

    console.log(`Text-to-speech completed in ${processingTime}ms, audio size: ${audioBuffer.byteLength} bytes`);
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error in text-to-voice function:', {
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