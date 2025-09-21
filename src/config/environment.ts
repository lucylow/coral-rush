// Environment configuration for RUSH MCP Agents
export const environment = {
  // ElevenLabs API Configuration (for Listener Agent)
  elevenLabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || "",
    baseUrl: "https://api.elevenlabs.io/v1",
    defaultVoiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
    defaultModel: "eleven_multilingual_v1"
  },

  // Mistral AI API Configuration (for Brain Agent)
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY || "",
    defaultModel: "mistral-large-latest"
  },

  // Crossmint API Configuration (for Executor Agent)
  crossmint: {
    apiKey: process.env.CROSSMINT_API_KEY || "",
    projectId: process.env.CROSSMINT_PROJECT_ID || "",
    baseUrl: "https://staging.crossmint.com/api",
    defaultCollectionId: process.env.DEFAULT_COLLECTION_ID || "default-collection-id"
  },

  // Solana Network Configuration
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
    network: "devnet"
  },

  // Coral Protocol Configuration
  coral: {
    endpoint: process.env.CORAL_PROTOCOL_ENDPOINT || "https://api.coral-protocol.com"
  },

  // LiveKit Configuration
  livekit: {
    url: process.env.LIVEKIT_URL || "wss://raise-your-hack-9k3tuu5l.livekit.cloud",
    apiKey: process.env.LIVEKIT_API_KEY || "APIcANBcgWHCySX",
    apiSecret: process.env.LIVEKIT_API_SECRET || "0z18eeeT8GZNWebcLtHkp5Rz7cKpMY1ntd3DRUjMNXUB"
  },

  // Application Configuration
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "5173"),
    corsOrigins: ["https://rush-support.com", "http://localhost:3000", "http://localhost:5173"]
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || "default-jwt-secret-change-in-production",
    encryptionKey: process.env.ENCRYPTION_KEY || "default-encryption-key-change-in-production"
  },

  // Rate Limiting Configuration
  rateLimits: {
    voiceSupportWorkflow: {
      requestsPerMinute: 10,
      requestsPerHour: 100
    }
  }
};

// Validation function to check required environment variables
export function validateEnvironment(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    'ELEVENLABS_API_KEY',
    'MISTRAL_API_KEY',
    'CROSSMINT_API_KEY',
    'CROSSMINT_PROJECT_ID'
  ];

  // Optional vars with defaults (LiveKit has defaults provided)
  const optionalVars = [
    'LIVEKIT_URL',
    'LIVEKIT_API_KEY', 
    'LIVEKIT_API_SECRET'
  ];

  const missingVars: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars
  };
}

// Helper function to get environment variable with default
export function getEnvVar(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue;
}

// Helper function to get boolean environment variable
export function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

// Helper function to get number environment variable
export function getNumberEnvVar(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Helper function to get LiveKit configuration
export function getLiveKitConfig() {
  return {
    url: getEnvVar('LIVEKIT_URL', 'wss://raise-your-hack-9k3tuu5l.livekit.cloud'),
    apiKey: getEnvVar('LIVEKIT_API_KEY', 'APIcANBcgWHCySX'),
    apiSecret: getEnvVar('LIVEKIT_API_SECRET', '0z18eeeT8GZNWebcLtHkp5Rz7cKpMY1ntd3DRUjMNXUB')
  };
}
