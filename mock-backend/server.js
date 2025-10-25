const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for audio uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Mock Data Store
const mockData = {
  sessions: new Map(),
  agents: new Map(),
  transactions: new Map(),
  nfts: new Map(),
  wallets: new Map(),
  aiLogs: []
};

// Initialize mock agents
const initializeMockAgents = () => {
  const agents = [
    {
      id: 'brain-agent',
      name: 'Brain Agent',
      description: 'AI reasoning and intent detection agent',
      capabilities: ['intent_detection', 'query_analysis', 'decision_making'],
      status: 'idle',
      category: 'ai',
      isActive: true,
      version: '1.0.0',
      endpoint: '/agents/brain',
      metrics: {
        total_uses: 1247,
        success_rate: 0.96,
        avg_response_time: 234,
        last_used: new Date().toISOString()
      }
    },
    {
      id: 'executor-agent',
      name: 'Executor Agent',
      description: 'Blockchain transaction execution agent',
      capabilities: ['transaction_execution', 'nft_minting', 'wallet_operations'],
      status: 'idle',
      category: 'blockchain',
      isActive: true,
      version: '1.0.0',
      endpoint: '/agents/executor',
      metrics: {
        total_uses: 856,
        success_rate: 0.94,
        avg_response_time: 567,
        last_used: new Date().toISOString()
      }
    },
    {
      id: 'listener-agent',
      name: 'Listener Agent',
      description: 'Voice processing and speech synthesis agent',
      capabilities: ['speech_recognition', 'text_to_speech', 'audio_processing'],
      status: 'idle',
      category: 'voice',
      isActive: true,
      version: '1.0.0',
      endpoint: '/agents/listener',
      metrics: {
        total_uses: 2341,
        success_rate: 0.98,
        avg_response_time: 178,
        last_used: new Date().toISOString()
      }
    },
    {
      id: 'fraud-detection-agent',
      name: 'Fraud Detection Agent',
      description: 'Transaction security and fraud analysis agent',
      capabilities: ['fraud_detection', 'risk_analysis', 'security_scoring'],
      status: 'idle',
      category: 'security',
      isActive: true,
      version: '1.0.0',
      endpoint: '/agents/fraud-detection',
      metrics: {
        total_uses: 445,
        success_rate: 0.99,
        avg_response_time: 145,
        last_used: new Date().toISOString()
      }
    },
    {
      id: 'payment-agent',
      name: 'Payment Agent',
      description: 'Cross-border payment processing agent',
      capabilities: ['payment_processing', 'currency_conversion', 'settlement'],
      status: 'idle',
      category: 'payment',
      isActive: true,
      version: '1.0.0',
      endpoint: '/agents/payment',
      metrics: {
        total_uses: 1789,
        success_rate: 0.97,
        avg_response_time: 892,
        last_used: new Date().toISOString()
      }
    }
  ];

  agents.forEach(agent => {
    mockData.agents.set(agent.id, agent);
  });
};

// Initialize mock wallets
const initializeMockWallets = () => {
  const wallets = [
    {
      address: 'Fz7r8L5y6M4nH3P9aXc1vB8eQ2R3tY6uW1ZxP0aD9fK2',
      balance: {
        SOL: 12.35,
        USDC: 2456.78,
        ORGO: 15678.90
      },
      nftCount: 23,
      transactionCount: 145,
      lastActivity: new Date()
    },
    {
      address: 'Hj9r7F6e2K1nL8Q3bXc5vA2pJ6R4tZ7uW9VxM1bC0dE',
      balance: {
        SOL: 8.67,
        USDC: 1234.56,
        ORGO: 9876.54
      },
      nftCount: 18,
      transactionCount: 89,
      lastActivity: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ];

  wallets.forEach(wallet => {
    mockData.wallets.set(wallet.address, wallet);
  });
};

// Generate realistic mock data
const generateMockTransactionHash = () => {
  return Math.random().toString(16).substr(2, 8) + 'Q' + Math.random().toString(16).substr(2, 8) + 
         'x' + Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8);
};

const generateMockNFTMetadata = (type = 'coral') => {
  const coralTypes = ['Staghorn', 'Brain', 'Elkhorn', 'Fire', 'Mushroom'];
  const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
  
  const coralType = coralTypes[Math.floor(Math.random() * coralTypes.length)];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const tokenId = Math.floor(Math.random() * 10000);

  return {
    name: `${coralType} Coral #${tokenId}`,
    description: `A beautiful ${rarity.toLowerCase()} ${coralType.toLowerCase()} coral NFT from the Coral Rush conservation collection.`,
    image: `https://mock-api.coralrush.io/nft/images/${type}_${tokenId}.png`,
    external_url: `https://coralrush.io/nft/${tokenId}`,
    attributes: [
      { trait_type: 'Coral Type', value: coralType },
      { trait_type: 'Rarity', value: rarity },
      { trait_type: 'Conservation Impact', value: `${Math.floor(Math.random() * 100) + 1}%` },
      { trait_type: 'Location', value: 'Great Barrier Reef' },
      { trait_type: 'Minted Date', value: new Date().toISOString().split('T')[0] }
    ],
    collection: {
      name: 'Coral Rush Conservation NFTs',
      family: 'Coral Rush'
    },
    properties: {
      files: [
        {
          uri: `https://mock-api.coralrush.io/nft/images/${type}_${tokenId}.png`,
          type: 'image/png'
        }
      ],
      category: 'image'
    }
  };
};

// Mock voice command processing
const processVoiceCommand = (transcript) => {
  const lowerTranscript = transcript.toLowerCase();
  
  if (lowerTranscript.includes('mint') && lowerTranscript.includes('nft')) {
    return {
      intent: 'mint_nft',
      confidence: 0.95,
      entities: {
        action: 'mint',
        asset_type: 'nft',
        quantity: lowerTranscript.includes('3') || lowerTranscript.includes('three') ? 3 : 1
      },
      action: {
        type: 'mint_nft',
        priority: 2,
        parameters: {
          quantity: lowerTranscript.includes('3') || lowerTranscript.includes('three') ? 3 : 1,
          collection: 'coral-conservation'
        }
      },
      response_text: "I'll help you mint coral conservation NFTs. Processing your request through our AI agents..."
    };
  }
  
  if (lowerTranscript.includes('balance') || lowerTranscript.includes('wallet')) {
    return {
      intent: 'check_balance',
      confidence: 0.98,
      entities: {
        action: 'check',
        asset_type: 'balance'
      },
      action: {
        type: 'get_wallet_info',
        priority: 1,
        parameters: {}
      },
      response_text: "Let me check your wallet balances across all connected networks..."
    };
  }
  
  if (lowerTranscript.includes('proposal') && lowerTranscript.includes('vote')) {
    return {
      intent: 'vote_proposal',
      confidence: 0.92,
      entities: {
        action: 'vote',
        proposal_id: 42,
        vote_type: 'approve'
      },
      action: {
        type: 'vote_proposal',
        priority: 2,
        parameters: {
          proposal_id: 42,
          vote: 'approve'
        }
      },
      response_text: "I'll help you vote on proposal #42. Analyzing the proposal details..."
    };
  }
  
  if (lowerTranscript.includes('treasury')) {
    return {
      intent: 'check_treasury',
      confidence: 0.94,
      entities: {
        action: 'check',
        target: 'treasury'
      },
      action: {
        type: 'check_treasury',
        priority: 1,
        parameters: {}
      },
      response_text: "Checking DAO treasury status and available funds..."
    };
  }
  
  // Default response
  return {
    intent: 'general_support',
    confidence: 0.85,
    entities: {
      action: 'help',
      domain: 'general'
    },
    action: {
      type: 'provide_information',
      priority: 1,
      parameters: {}
    },
    response_text: "I'm here to help with your Web3 and coral conservation needs. How can I assist you today?"
  };
};

// Multi-agent orchestration simulation
const simulateMultiAgentResponse = (intent, parameters = {}) => {
  const agents = [];
  
  switch (intent) {
    case 'mint_nft':
      agents.push(
        {
          name: 'ProposalAgent',
          status: 'success',
          processing_time: 234,
          result: `Proposal analysis complete. NFT minting approved for ${parameters.quantity || 1} coral conservation NFT(s).`,
          details: {
            proposal_id: 42,
            approval_status: 'approved',
            environmental_impact_score: 85
          }
        },
        {
          name: 'TreasuryAgent',
          status: 'success', 
          processing_time: 156,
          result: 'Treasury check passed. Sufficient funds available for minting operation.',
          details: {
            current_balance: {
              SOL: 567.89,
              USDC: 12345.67
            },
            required_amount: {
              SOL: 0.015 * (parameters.quantity || 1),
              USDC: 0
            },
            transaction_fee: 0.000005
          }
        },
        {
          name: 'VotingAgent',
          status: 'success',
          processing_time: 189,
          result: 'Governance check complete. Community voting recommends approval.',
          details: {
            community_vote: {
              approve: 89,
              reject: 11
            },
            voting_power_used: '2.3M ORGO',
            quorum_reached: true
          }
        }
      );
      break;
      
    case 'check_balance':
      agents.push(
        {
          name: 'WalletAgent',
          status: 'success',
          processing_time: 145,
          result: 'Wallet analysis complete. All balances retrieved successfully.',
          details: {
            total_portfolio_value: '$3,456.78',
            assets_tracked: 3,
            nft_collections: 5
          }
        },
        {
          name: 'DeFiAgent',
          status: 'success',
          processing_time: 298,
          result: 'DeFi positions analyzed. Yield farming opportunities identified.',
          details: {
            active_positions: 2,
            total_yield: '12.3% APY',
            pending_rewards: '$45.67'
          }
        }
      );
      break;
      
    case 'vote_proposal':
      agents.push(
        {
          name: 'GovernanceAgent',
          status: 'success',
          processing_time: 189,
          result: 'Proposal #42 analysis complete. Voting power calculated.',
          details: {
            proposal_id: 42,
            voting_power: '1,500 ORGO',
            time_remaining: '2 days, 14 hours'
          }
        },
        {
          name: 'SecurityAgent',
          status: 'success',
          processing_time: 156,
          result: 'Security audit passed. No malicious proposals detected.',
          details: {
            security_score: 96,
            risk_level: 'low',
            audit_timestamp: new Date().toISOString()
          }
        }
      );
      break;
      
    case 'check_treasury':
      agents.push(
        {
          name: 'TreasuryAgent',
          status: 'success',
          processing_time: 223,
          result: 'Treasury analysis complete. All funds accounted for.',
          details: {
            total_value: '$1,234,567.89',
            asset_breakdown: {
              SOL: '45.2%',
              USDC: '32.1%',
              ORGO: '22.7%'
            },
            last_audit: new Date(Date.now() - 86400000).toISOString()
          }
        },
        {
          name: 'AnalyticsAgent',
          status: 'success',
          processing_time: 167,
          result: 'Financial analytics complete. Treasury health is excellent.',
          details: {
            growth_rate: '+12.5% (30 days)',
            sustainability_score: 94,
            burn_rate: '2.1% monthly'
          }
        }
      );
      break;
      
    default:
      agents.push(
        {
          name: 'GeneralAgent',
          status: 'success',
          processing_time: 123,
          result: 'General assistance provided. Ready to help with specific requests.',
          details: {
            capabilities: ['voice_processing', 'transaction_help', 'information_retrieval'],
            response_quality: 'high'
          }
        }
      );
  }
  
  const aggregatedResult = agents.map(agent => agent.result).join(' ');
  
  return {
    agents,
    aggregatedResult,
    total_processing_time: Math.max(...agents.map(a => a.processing_time)),
    success_rate: agents.filter(a => a.status === 'success').length / agents.length,
    timestamp: new Date().toISOString()
  };
};

// Initialize mock data
initializeMockAgents();
initializeMockWallets();

// CORAL PROTOCOL API ENDPOINTS

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      coral_protocol: 'online',
      solana_network: 'online',
      ai_agents: 'online'
    }
  });
});

// Connect to Coral Protocol
app.post('/api/coral/connect', (req, res) => {
  const sessionId = uuidv4();
  const session = {
    id: sessionId,
    status: 'connected',
    timestamp: new Date().toISOString(),
    agents_active: 5,
    coral_version: '2.1.0'
  };
  
  mockData.sessions.set(sessionId, session);
  
  res.json({
    success: true,
    session_id: sessionId,
    message: 'Connected to Coral Protocol successfully',
    capabilities: [
      'voice_processing',
      'multi_agent_orchestration', 
      'solana_integration',
      'nft_minting',
      'dao_governance'
    ]
  });
});

// Process voice input
app.post('/api/coral/process-voice', upload.single('audio'), (req, res) => {
  const sessionId = req.body.session_id || uuidv4();
  const audioData = req.file;
  
  // Simulate processing delay
  setTimeout(() => {
    // Mock voice transcription
    const mockTranscripts = [
      "Mint 3 coral NFTs for my wallet",
      "Check my wallet balance and recent transactions", 
      "I want to vote on proposal 42 to approve coral funding",
      "Show me the DAO treasury status",
      "Help me with my Solana transactions"
    ];
    
    const transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    const analysis = processVoiceCommand(transcript);
    const multiAgentResponse = simulateMultiAgentResponse(analysis.intent, analysis.action.parameters);
    
    // Log AI interaction
    const aiLog = {
      id: uuidv4(),
      session_id: sessionId,
      transcript,
      intent: analysis.intent,
      confidence: analysis.confidence,
      agents_used: multiAgentResponse.agents.map(a => a.name),
      processing_time: multiAgentResponse.total_processing_time,
      timestamp: new Date().toISOString(),
      success: true
    };
    
    mockData.aiLogs.push(aiLog);
    
    res.json({
      success: true,
      session_id: sessionId,
      transcription: transcript,
      intent: analysis.intent,
      confidence: analysis.confidence,
      response: analysis.response_text,
      actions: [analysis.action.type],
      audio_response: "mock_audio_base64_data",
      analysis: analysis,
      multi_agent_response: multiAgentResponse,
      processing_time: multiAgentResponse.total_processing_time
    });
  }, 1000 + Math.random() * 2000); // 1-3 second delay
});

// Send text message
app.post('/api/coral/message', (req, res) => {
  const { message, session_id } = req.body;
  const sessionId = session_id || uuidv4();
  
  const analysis = processVoiceCommand(message);
  const multiAgentResponse = simulateMultiAgentResponse(analysis.intent, analysis.action.parameters);
  
  res.json({
    success: true,
    session_id: sessionId,
    transcription: message,
    intent: analysis.intent,
    confidence: analysis.confidence,
    response: analysis.response_text,
    actions: [analysis.action.type],
    analysis: analysis,
    multi_agent_response: multiAgentResponse
  });
});

// Get agent status
app.get('/api/coral/agents/status', (req, res) => {
  const agents = Array.from(mockData.agents.values()).map(agent => ({
    id: agent.id,
    name: agent.name,
    status: agent.status,
    capabilities: agent.capabilities
  }));
  
  res.json(agents);
});

// Get available agents from registry
app.get('/api/coral/agents/registry', (req, res) => {
  const agents = Array.from(mockData.agents.values());
  res.json(agents);
});

// Register agents
app.post('/api/coral/agents/register', (req, res) => {
  const { agents } = req.body;
  
  agents.forEach(agent => {
    mockData.agents.set(agent.id, {
      ...agent,
      status: 'idle',
      isActive: true,
      metrics: {
        total_uses: 0,
        success_rate: 1.0,
        avg_response_time: 200,
        last_used: new Date().toISOString()
      }
    });
  });
  
  res.json({
    success: true,
    registered_count: agents.length,
    message: 'Agents registered successfully'
  });
});

// Discover agents by category
app.get('/api/coral/agents/discover', (req, res) => {
  const { category } = req.query;
  const agents = Array.from(mockData.agents.values())
    .filter(agent => !category || agent.category === category);
  
  res.json(agents);
});

// SOLANA INTEGRATION ENDPOINTS

// Mint NFT
app.post('/api/solana/mint-nft', (req, res) => {
  const { 
    recipient_wallet, 
    metadata_uri, 
    quantity = 1,
    collection_id = 'coral-conservation'
  } = req.body;
  
  const mintResults = [];
  
  for (let i = 0; i < quantity; i++) {
    const txSignature = generateMockTransactionHash();
    const nftMetadata = generateMockNFTMetadata();
    const mintAddress = `NFT${Math.random().toString(36).substr(2, 10)}`;
    
    const nftResult = {
      mint_address: mintAddress,
      tx_signature: txSignature,
      status: 'confirmed',
      recipient: recipient_wallet || 'Fz7r8L5y6M4nH3P9aXc1vB8eQ2R3tY6uW1ZxP0aD9fK2',
      metadata: nftMetadata,
      explorer_url: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
      block_height: Math.floor(Math.random() * 1000000) + 200000000,
      slot: Math.floor(Math.random() * 1000000) + 250000000,
      timestamp: new Date().toISOString(),
      fees: {
        transaction_fee: 0.000005,
        rent_exempt_minimum: 0.00203928
      }
    };
    
    mockData.nfts.set(mintAddress, nftResult);
    mintResults.push(nftResult);
  }
  
  // Log transaction
  const logEntry = {
    id: uuidv4(),
    operation: 'mint_nft',
    results: mintResults,
    total_quantity: quantity,
    recipient: recipient_wallet,
    timestamp: new Date().toISOString(),
    status: 'completed'
  };
  
  mockData.aiLogs.push(logEntry);
  
  res.json({
    success: true,
    mint_results: mintResults,
    total_minted: quantity,
    batch_status: 'all_confirmed',
    explorer_urls: mintResults.map(r => r.explorer_url),
    estimated_confirmation_time: '30-60 seconds'
  });
});

// Get wallet info
app.get('/api/solana/wallet/:address', (req, res) => {
  const { address } = req.params;
  const wallet = mockData.wallets.get(address);
  
  if (!wallet) {
    return res.status(404).json({
      success: false,
      error: 'Wallet not found'
    });
  }
  
  // Get NFTs for this wallet
  const walletNFTs = Array.from(mockData.nfts.values())
    .filter(nft => nft.recipient === address)
    .slice(0, 10); // Last 10 NFTs
  
  res.json({
    success: true,
    wallet: {
      address,
      balances: wallet.balance,
      nft_count: wallet.nftCount,
      transaction_count: wallet.transactionCount,
      last_activity: wallet.lastActivity,
      recent_nfts: walletNFTs
    },
    network_info: {
      cluster: 'devnet',
      epoch: 445,
      slot_height: 250789123
    }
  });
});

// Check transaction status
app.get('/api/solana/transaction/:hash', (req, res) => {
  const { hash } = req.params;
  
  // Mock transaction status
  const statuses = ['confirmed', 'finalized', 'pending'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  res.json({
    success: true,
    transaction: {
      signature: hash,
      status: status,
      block_height: Math.floor(Math.random() * 1000000) + 200000000,
      slot: Math.floor(Math.random() * 1000000) + 250000000,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      fee: 0.000005,
      confirmations: status === 'confirmed' ? Math.floor(Math.random() * 32) + 1 : 0,
      error: null
    },
    explorer_url: `https://explorer.solana.com/tx/${hash}?cluster=devnet`
  });
});

// DAO GOVERNANCE ENDPOINTS

// Get treasury status
app.get('/api/dao/treasury', (req, res) => {
  res.json({
    success: true,
    treasury: {
      total_value_usd: 1234567.89,
      assets: {
        SOL: {
          amount: 567.89,
          value_usd: 12345.67
        },
        USDC: {
          amount: 12345.67,
          value_usd: 12345.67
        },
        ORGO: {
          amount: 987654.32,
          value_usd: 98765.43
        }
      },
      last_updated: new Date().toISOString(),
      health_score: 94,
      monthly_burn_rate: 0.021
    }
  });
});

// Get proposals
app.get('/api/dao/proposals', (req, res) => {
  const proposals = [
    {
      id: 42,
      title: 'Allocate 5% of treasury to coral conservation NFTs',
      description: 'Proposal to fund the creation and distribution of educational coral conservation NFTs to raise awareness about ocean health.',
      status: 'active',
      voting_period: {
        start: new Date(Date.now() - 86400000).toISOString(),
        end: new Date(Date.now() + 172800000).toISOString()
      },
      votes: {
        approve: 89,
        reject: 11,
        abstain: 3
      },
      voting_power_used: 2300000,
      quorum_reached: true,
      created_by: 'CoralConservationDAO'
    },
    {
      id: 43,
      title: 'Increase validator rewards by 15%',
      description: 'Proposal to increase rewards for network validators to improve security and decentralization.',
      status: 'pending',
      voting_period: {
        start: new Date(Date.now() + 86400000).toISOString(),
        end: new Date(Date.now() + 345600000).toISOString()
      },
      votes: {
        approve: 0,
        reject: 0,
        abstain: 0
      },
      voting_power_used: 0,
      quorum_reached: false,
      created_by: 'ValidatorNetwork'
    }
  ];
  
  res.json({
    success: true,
    proposals,
    total_count: proposals.length
  });
});

// Vote on proposal
app.post('/api/dao/proposals/:id/vote', (req, res) => {
  const { id } = req.params;
  const { vote, wallet_address, voting_power } = req.body;
  
  const voteRecord = {
    proposal_id: parseInt(id),
    voter: wallet_address || 'Fz7r8L5y6M4nH3P9aXc1vB8eQ2R3tY6uW1ZxP0aD9fK2',
    vote: vote, // 'approve', 'reject', 'abstain'
    voting_power: voting_power || 1500,
    timestamp: new Date().toISOString(),
    tx_signature: generateMockTransactionHash()
  };
  
  res.json({
    success: true,
    vote_record: voteRecord,
    message: `Vote "${vote}" recorded for proposal #${id}`,
    explorer_url: `https://explorer.solana.com/tx/${voteRecord.tx_signature}?cluster=devnet`
  });
});

// AI LOGS AND ANALYTICS

// Get AI interaction logs
app.get('/api/ai/logs', (req, res) => {
  const { limit = 50, session_id } = req.query;
  
  let logs = mockData.aiLogs;
  
  if (session_id) {
    logs = logs.filter(log => log.session_id === session_id);
  }
  
  logs = logs.slice(-limit);
  
  res.json({
    success: true,
    logs,
    total_count: logs.length
  });
});

// Get session history
app.get('/api/coral/sessions/:sessionId/history', (req, res) => {
  const { sessionId } = req.params;
  
  const sessionLogs = mockData.aiLogs.filter(log => log.session_id === sessionId);
  
  res.json(sessionLogs);
});

// COMPREHENSIVE DEMO ENDPOINT

// Get full demo data
app.get('/api/demo/full-scenario', (req, res) => {
  const demoScenario = {
    user_wallet: 'Fz7r8L5y6M4nH3P9aXc1vB8eQ2R3tY6uW1ZxP0aD9fK2',
    voice_command: 'Mint 3 coral NFTs for conservation',
    detected_intent: 'mint_nft',
    confidence: 0.95,
    
    // Multi-agent response
    agents: [
      {
        name: 'ProposalAgent',
        status: 'success',
        result: 'Proposal analysis complete. Environmental impact: +85 points',
        processing_time: 234,
        details: { proposal_id: 42, approval_status: 'approved' }
      },
      {
        name: 'TreasuryAgent', 
        status: 'success',
        result: 'Treasury check passed. Sufficient SOL: 567.89 available',
        processing_time: 156,
        details: { required_sol: 0.045, available_sol: 567.89 }
      },
      {
        name: 'VotingAgent',
        status: 'success', 
        result: 'Community vote: 89% approval, quorum reached',
        processing_time: 189,
        details: { approve_votes: 89, reject_votes: 11 }
      }
    ],
    
    aggregated_result: 'All systems go! Minting approved by community governance.',
    
    // Solana transactions
    nft_mint_results: [
      {
        mint_address: 'NFTCoral001xyz',
        tx_signature: generateMockTransactionHash(),
        status: 'confirmed',
        metadata_uri: 'https://mock-api.coralrush.io/nft/metadata/coral001.json',
        explorer_url: `https://explorer.solana.com/tx/${generateMockTransactionHash()}?cluster=devnet`
      },
      {
        mint_address: 'NFTCoral002xyz',
        tx_signature: generateMockTransactionHash(),
        status: 'confirmed', 
        metadata_uri: 'https://mock-api.coralrush.io/nft/metadata/coral002.json',
        explorer_url: `https://explorer.solana.com/tx/${generateMockTransactionHash()}?cluster=devnet`
      },
      {
        mint_address: 'NFTCoral003xyz',
        tx_signature: generateMockTransactionHash(),
        status: 'confirmed',
        metadata_uri: 'https://mock-api.coralrush.io/nft/metadata/coral003.json', 
        explorer_url: `https://explorer.solana.com/tx/${generateMockTransactionHash()}?cluster=devnet`
      }
    ],
    
    // AI logs stored on-chain
    anchor_logs: [
      {
        log_id: `log_${Date.now()}`,
        result: 'Intent: mint_nft | Agents: ProposalAgent OK, TreasuryAgent OK, VotingAgent OK',
        stored_by_wallet: 'Fz7r8L5y6M4nH3P9aXc1vB8eQ2R3tY6uW1ZxP0aD9fK2',
        timestamp: new Date().toISOString(),
        on_chain: true,
        program_id: 'CoralRushAILogger123xyz'
      }
    ],
    
    // Conversation flow
    eliza_conversation: {
      user_input: 'Mint 3 coral NFTs for conservation',
      eliza_response: 'Perfect! I understand you want to support coral conservation by minting 3 NFTs. This will contribute to ocean health research. Shall I proceed?',
      intent_detected: 'mint_nft',
      parameters: {
        quantity: 3,
        conservation_impact: true,
        metadata_uris: [
          'https://mock-api.coralrush.io/nft/metadata/coral001.json',
          'https://mock-api.coralrush.io/nft/metadata/coral002.json', 
          'https://mock-api.coralrush.io/nft/metadata/coral003.json'
        ]
      }
    },
    
    summary: {
      total_processing_time: 589,
      success_rate: 1.0,
      environmental_impact: '+255 conservation points',
      cost: '0.045 SOL (~$2.34)',
      timestamp: new Date().toISOString()
    }
  };
  
  res.json({
    success: true,
    demo_scenario: demoScenario,
    message: 'Full hackathon demo scenario generated successfully'
  });
});

// Disconnect from Coral Protocol
app.post('/api/coral/disconnect', (req, res) => {
  res.json({
    success: true,
    message: 'Disconnected from Coral Protocol successfully'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /health',
      'POST /api/coral/connect',
      'POST /api/coral/process-voice',
      'GET /api/coral/agents/status',
      'POST /api/solana/mint-nft',
      'GET /api/dao/treasury',
      'GET /api/demo/full-scenario'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Coral Rush Mock Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Demo endpoint: http://localhost:${PORT}/api/demo/full-scenario`);
  console.log(`🤖 AI Agents: ${mockData.agents.size} registered`);
  console.log(`💰 Mock wallets: ${mockData.wallets.size} initialized`);
});

module.exports = app;
