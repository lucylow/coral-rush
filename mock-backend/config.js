// Coral Rush Mock Backend Configuration
module.exports = {
  server: {
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  coral: {
    apiUrl: process.env.CORAL_API_URL || 'http://localhost:8080',
    apiKey: process.env.CORAL_API_KEY || 'mock_api_key_for_demo',
    version: '2.1.0'
  },
  
  solana: {
    network: process.env.SOLANA_NETWORK || 'devnet',
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'
  },
  
  mock: {
    enableRealisticDelays: process.env.ENABLE_REALISTIC_DELAYS !== 'false',
    mockAgentProcessingTime: process.env.MOCK_AGENT_PROCESSING_TIME !== 'false',
    simulateNetworkLatency: process.env.SIMULATE_NETWORK_LATENCY !== 'false',
    
    // Demo configuration
    demoMode: process.env.DEMO_MODE !== 'false',
    autoGenerateTransactions: process.env.AUTO_GENERATE_TRANSACTIONS !== 'false',
    mockWalletCount: parseInt(process.env.MOCK_WALLET_COUNT) || 5,
    mockNftCollectionSize: parseInt(process.env.MOCK_NFT_COLLECTION_SIZE) || 100,
    
    // Processing time ranges (milliseconds)
    processingTimes: {
      voiceTranscription: { min: 500, max: 2000 },
      agentAnalysis: { min: 200, max: 800 },
      blockchainTransaction: { min: 1000, max: 3000 },
      multiAgentOrchestration: { min: 800, max: 2500 }
    }
  },
  
  agents: {
    maxConcurrentOperations: 10,
    defaultTimeout: 30000,
    retryAttempts: 3
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: true,
    enablePerformanceMetrics: true
  }
};
