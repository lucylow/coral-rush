import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceToTextRequest {
  audio: File;
  language?: string;
  model?: string;
  enable_diarization?: boolean;
  diarization_speakers_count?: number;
}

interface VoiceToTextResponse {
  transcript: string;
  detected_language?: string;
  confidence?: number;
  words?: Array<{
    word: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  speakers?: Array<{
    speaker: string;
    words: string[];
  }>;
  processing_time: number;
  model_used: string;
  success: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not found in environment variables');
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'auto';
    const model = formData.get('model') as string || 'eleven_multilingual_v2';
    const enableDiarization = formData.get('enable_diarization') === 'true';
    const speakerCount = parseInt(formData.get('diarization_speakers_count') as string || '2');
    
    if (!audioFile) {
      throw new Error('No audio file provided in request');
    }

    // Validate audio file size (max 25MB for ElevenLabs)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      throw new Error(`Audio file too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
    }

    console.log(`Processing audio file: ${audioFile.size} bytes, model: ${model}, language: ${language}`);

    // Prepare request for ElevenLabs Speech-to-Text
    const speechToTextFormData = new FormData();
    speechToTextFormData.append('audio', audioFile);
    speechToTextFormData.append('model_id', model);
    
    if (language !== 'auto') {
      speechToTextFormData.append('language', language);
    }
    
    if (enableDiarization) {
      speechToTextFormData.append('diarization', 'true');
      speechToTextFormData.append('diarization_speakers_count', speakerCount.toString());
    }

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: speechToTextFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      let errorMessage = `ElevenLabs API error: ${response.status}`;
      if (response.status === 401) {
        errorMessage = 'Invalid API key for ElevenLabs';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded for ElevenLabs API';
      } else if (response.status === 413) {
        errorMessage = 'Audio file too large for processing';
      } else if (response.status >= 500) {
        errorMessage = 'ElevenLabs service temporarily unavailable';
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    const processingTime = Date.now() - startTime;
    
    const responseData: VoiceToTextResponse = {
      transcript: result.text || '',
      detected_language: result.detected_language,
      confidence: result.confidence,
      words: result.words,
      speakers: result.speakers,
      processing_time: processingTime,
      model_used: model,
      success: true
    };
    
    console.log(`Voice-to-text completed in ${processingTime}ms, transcript length: ${result.text?.length || 0} characters`);
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error in voice-to-text function:', {
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