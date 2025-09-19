import { CoralConfig } from './lib/coral-protocol-mock';

export const coralConfig: CoralConfig = {
  agents: [
    {
      name: "listener-agent",
      type: "mcp",
      executable: "node",
      args: ["./dist/agents/listener-agent.js"],
      env: {
        ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY
      },
      capabilities: ["speech-to-text", "text-to-speech", "voice-processing"],
      description: "Handles voice input/output using ElevenLabs API"
    },
    {
      name: "brain-agent", 
      type: "mcp",
      executable: "node",
      args: ["./dist/agents/brain-agent.js"],
      env: {
        MISTRAL_API_KEY: process.env.MISTRAL_API_KEY
      },
      capabilities: ["natural-language-understanding", "intent-analysis", "response-generation"],
      description: "Analyzes queries and formulates responses using Mistral AI"
    },
    {
      name: "executor-agent",
      type: "mcp", 
      executable: "node",
      args: ["./dist/agents/executor-agent.js"],
      env: {
        CROSSMINT_API_KEY: process.env.CROSSMINT_API_KEY,
        CROSSMINT_PROJECT_ID: process.env.CROSSMINT_PROJECT_ID,
        SOLANA_RPC_URL: process.env.SOLANA_RPC_URL
      },
      capabilities: ["blockchain-interaction", "nft-minting", "transaction-verification"],
      description: "Executes blockchain operations using Crossmint and Solana"
    }
  ],
  workflows: {
    "voice-support-workflow": {
      description: "Complete voice-first Web3 support workflow",
      steps: [
        {
          agent: "listener-agent",
          tool: "transcribe_speech",
          inputs: ["audio_data"],
          outputs: ["transcript", "confidence"]
        },
        {
          agent: "brain-agent", 
          tool: "analyze_support_query",
          inputs: ["transcript", "context"],
          outputs: ["analysis", "action"]
        },
        {
          agent: "executor-agent",
          tool: ["check_transaction_status", "mint_compensation_nft", "get_wallet_info"],
          inputs: ["action.parameters"],
          outputs: ["execution_result"]
        },
        {
          agent: "listener-agent",
          tool: "generate_speech", 
          inputs: ["analysis.response_text"],
          outputs: ["audio_response"]
        }
      ]
    }
  },
  security: {
    require_authentication: true,
    rate_limits: {
      "voice-support-workflow": {
        requests_per_minute: 10,
        requests_per_hour: 100
      }
    },
    allowed_origins: ["https://rush-support.com", "http://localhost:3000"]
  }
};
