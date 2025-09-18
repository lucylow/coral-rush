import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface CoralRequest {
  message?: string;
  session_id: string;
  audio_data?: string;
}

interface CoralResponse {
  transcription?: string;
  intent: string;
  confidence: number;
  response: string;
  actions: string[];
  audio_response?: string;
  session_id: string;
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  capabilities: string[];
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

// Coral Protocol configuration
const CORAL_API_KEY = Deno.env.get('CORAL_API_KEY')
const CORAL_SERVER_URL = Deno.env.get('CORAL_SERVER_URL') || 'http://localhost:8080'

serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    switch (path) {
      case '/api/coral/connect':
        return await handleConnect(req, corsHeaders)
      
      case '/api/coral/process-voice':
        return await handleProcessVoice(req, corsHeaders)
      
      case '/api/coral/message':
        return await handleMessage(req, corsHeaders)
      
      case '/api/coral/agents/status':
        return await handleAgentStatus(req, corsHeaders)
      
      case '/api/coral/sessions':
        return await handleSessions(req, corsHeaders)
      
      default:
        return new Response('Not Found', { 
          status: 404, 
          headers: corsHeaders 
        })
    }
  } catch (error) {
    console.error('Coral Protocol API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleConnect(req: Request, corsHeaders: Record<string, string>) {
  try {
    // Simulate connection to Coral Protocol server
    const sessionId = `coral_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Store session in Supabase
    const { error } = await supabase
      .from('coral_sessions')
      .insert({
        id: sessionId,
        status: 'connected',
        created_at: new Date().toISOString(),
        metadata: {
          coral_server_url: CORAL_SERVER_URL,
          connected_at: new Date().toISOString()
        }
      })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        connected: true, 
        session_id: sessionId,
        coral_server_url: CORAL_SERVER_URL
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Connection error:', error)
    return new Response(
      JSON.stringify({ connected: false, error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleProcessVoice(req: Request, corsHeaders: Record<string, string>) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const sessionId = formData.get('session_id') as string

    if (!audioFile || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing audio file or session ID' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Process audio through Coral Protocol
    const coralResponse = await processAudioWithCoral(audioFile, sessionId)

    // Store interaction in Supabase
    await supabase
      .from('coral_interactions')
      .insert({
        session_id: sessionId,
        type: 'voice_input',
        input_data: { audio_size: audioFile.size, audio_type: audioFile.type },
        output_data: coralResponse,
        created_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify(coralResponse), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Voice processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process voice input' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleMessage(req: Request, corsHeaders: Record<string, string>) {
  try {
    const { message, session_id }: CoralRequest = await req.json()

    if (!message || !session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing message or session ID' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Process message through Coral Protocol
    const coralResponse = await processMessageWithCoral(message, session_id)

    // Store interaction in Supabase
    await supabase
      .from('coral_interactions')
      .insert({
        session_id: session_id,
        type: 'text_input',
        input_data: { message },
        output_data: coralResponse,
        created_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify(coralResponse), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Message processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process message' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleAgentStatus(req: Request, corsHeaders: Record<string, string>) {
  try {
    // Get agent status from Coral Protocol
    const agents: AgentStatus[] = [
      {
        id: 'listener',
        name: 'Voice Listener Agent',
        status: 'idle',
        capabilities: ['speech-to-text', 'text-to-speech', 'voice-synthesis']
      },
      {
        id: 'brain',
        name: 'Intent Analysis Brain',
        status: 'idle',
        capabilities: ['intent-analysis', 'problem-solving', 'natural-language-understanding']
      },
      {
        id: 'executor',
        name: 'Blockchain Executor',
        status: 'idle',
        capabilities: ['nft-minting', 'transaction-checking', 'wallet-operations']
      }
    ]

    return new Response(
      JSON.stringify(agents), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Agent status error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to get agent status' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleSessions(req: Request, corsHeaders: Record<string, string>) {
  try {
    const url = new URL(req.url)
    const sessionId = url.pathname.split('/').pop()

    if (sessionId && sessionId !== 'sessions') {
      // Get specific session history
      const { data, error } = await supabase
        .from('coral_interactions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Get all sessions
      const { data, error } = await supabase
        .from('coral_sessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify(data), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error('Sessions error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to get sessions' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function processAudioWithCoral(audioFile: File, sessionId: string): Promise<CoralResponse> {
  // Simulate Coral Protocol audio processing
  // In a real implementation, this would:
  // 1. Send audio to Coral Protocol server
  // 2. Get transcription from STT service
  // 3. Process intent with AI
  // 4. Execute actions
  // 5. Generate voice response

  const mockTranscriptions = [
    "My NFT transaction failed and I lost 0.5 ETH",
    "I need help with my wallet balance",
    "Can you help me mint a new NFT?",
    "What's the status of my recent transaction?",
    "I want to check my SOL token balance"
  ]

  const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]

  // Simulate intent analysis
  let intent = 'general_inquiry'
  let response = "I'm here to help with your Web3 needs. How can I assist you?"
  let actions: string[] = ['general_support']

  if (transcription.includes('transaction') && transcription.includes('failed')) {
    intent = 'failed_transaction'
    response = "I understand your frustration. I've processed a compensation NFT and initiated a refund to your wallet."
    actions = ['check_transaction', 'mint_compensation_nft', 'initiate_refund']
  } else if (transcription.includes('wallet') || transcription.includes('balance')) {
    intent = 'wallet_inquiry'
    response = "I can help you check your wallet balance and transaction history."
    actions = ['check_wallet_balance', 'get_transaction_history']
  } else if (transcription.includes('nft') || transcription.includes('mint')) {
    intent = 'nft_operations'
    response = "I can help you with NFT operations including minting, transferring, and checking ownership."
    actions = ['nft_operations', 'check_nft_ownership']
  }

  return {
    transcription,
    intent,
    confidence: 95,
    response,
    actions,
    audio_response: 'mock_audio_data',
    session_id: sessionId
  }
}

async function processMessageWithCoral(message: string, sessionId: string): Promise<CoralResponse> {
  // Similar to processAudioWithCoral but for text input
  return await processAudioWithCoral({} as File, sessionId)
}
