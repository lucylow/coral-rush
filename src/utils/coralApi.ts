/**
 * Coral Protocol API Integration
 * Handles communication with Coral Protocol backend
 */

export interface CoralSession {
  id: string;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  timestamp: string;
}

export interface CoralResponse {
  transcription: string;
  intent: string;
  confidence: number;
  response: string;
  actions: string[];
  audio_response?: string;
}

export interface CoralAgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  capabilities: string[];
}

export interface CoralAgentRegistry {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  endpoint: string;
  version: string;
  category: 'payment' | 'voice' | 'fraud-detection' | 'analytics';
  isActive: boolean;
  metrics?: {
    total_uses: number;
    success_rate: number;
    avg_response_time: number;
    last_used: string;
  };
  integration_code?: string;
}

class CoralApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_CORAL_API_URL || 'http://localhost:8080';
    this.apiKey = import.meta.env.VITE_CORAL_API_KEY || 'mock_api_key_for_demo';
  }

  /**
   * Connect to Coral Protocol server
   */
  async connect(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coral/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to connect to Coral Protocol:', error);
      return false;
    }
  }

  /**
   * Process voice input through Coral Protocol
   */
  async processVoiceInput(audioBlob: Blob, sessionId: string): Promise<CoralResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_input.wav');
      formData.append('session_id', sessionId);

      const response = await fetch(`${this.baseUrl}/api/coral/process-voice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw error;
    }
  }

  /**
   * Get agent status from Coral Protocol
   */
  async getAgentStatus(): Promise<CoralAgentStatus[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coral/agents/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching agent status:', error);
      return [];
    }
  }

  /**
   * Send text message to Coral Protocol
   */
  async sendMessage(message: string, sessionId: string): Promise<CoralResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coral/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get session history from Coral Protocol
   */
  async getSessionHistory(sessionId: string): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coral/sessions/${sessionId}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching session history:', error);
      return [];
    }
  }

  /**
   * Register agents with Coral Protocol Registry
   */
  async registerAgents(agents: CoralAgentRegistry[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coral/agents/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ agents }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to register agents:', error);
      return false;
    }
  }

  /**
   * Get available agents from Coral Registry
   */
  async getAvailableAgents(): Promise<CoralAgentRegistry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coral/agents/registry`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available agents:', error);
      return [];
    }
  }

  /**
   * Discover agents by category
   */
  async discoverAgents(category: string): Promise<CoralAgentRegistry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coral/agents/discover?category=${category}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error discovering agents:', error);
      return [];
    }
  }

  /**
   * Mint NFTs using Solana integration
   */
  async mintNFT(options: {
    recipientWallet?: string;
    quantity?: number;
    collectionId?: string;
  }): Promise<{
    success: boolean;
    mintResults?: Array<{
      mintAddress: string;
      txSignature: string;
      status: string;
      explorerUrl: string;
      metadata: any;
    }>;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/solana/mint-nft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          recipient_wallet: options.recipientWallet,
          quantity: options.quantity || 1,
          collection_id: options.collectionId || 'coral-conservation'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success,
        mintResults: data.mint_results?.map((result: any) => ({
          mintAddress: result.mint_address,
          txSignature: result.tx_signature,
          status: result.status,
          explorerUrl: result.explorer_url,
          metadata: result.metadata
        })),
        error: data.error
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'NFT minting failed'
      };
    }
  }

  /**
   * Get wallet information
   */
  async getWalletInfo(walletAddress: string): Promise<{
    success: boolean;
    wallet?: {
      address: string;
      balances: Record<string, number>;
      nftCount: number;
      transactionCount: number;
      recentNfts: any[];
    };
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/solana/wallet/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success,
        wallet: data.wallet,
        error: data.error
      };
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch wallet info'
      };
    }
  }

  /**
   * Get DAO treasury information
   */
  async getTreasuryInfo(): Promise<{
    success: boolean;
    treasury?: {
      totalValueUsd: number;
      assets: Record<string, { amount: number; valueUsd: number }>;
      healthScore: number;
    };
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dao/treasury`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success,
        treasury: {
          totalValueUsd: data.treasury?.total_value_usd,
          assets: data.treasury?.assets,
          healthScore: data.treasury?.health_score
        },
        error: data.error
      };
    } catch (error) {
      console.error('Error fetching treasury info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch treasury info'
      };
    }
  }

  /**
   * Vote on DAO proposal
   */
  async voteOnProposal(proposalId: number, vote: 'approve' | 'reject' | 'abstain', walletAddress: string): Promise<{
    success: boolean;
    voteRecord?: {
      proposalId: number;
      vote: string;
      txSignature: string;
      explorerUrl: string;
    };
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dao/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          vote,
          wallet_address: walletAddress,
          voting_power: 1500
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success,
        voteRecord: {
          proposalId: data.vote_record?.proposal_id,
          vote: data.vote_record?.vote,
          txSignature: data.vote_record?.tx_signature,
          explorerUrl: data.explorer_url
        },
        error: data.error
      };
    } catch (error) {
      console.error('Error voting on proposal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to vote on proposal'
      };
    }
  }

  /**
   * Get full demo scenario for hackathon presentation
   */
  async getFullDemoScenario(): Promise<{
    success: boolean;
    demoScenario?: {
      userWallet: string;
      voiceCommand: string;
      detectedIntent: string;
      agents: Array<{
        name: string;
        status: string;
        result: string;
        processingTime: number;
      }>;
      nftMintResults: Array<{
        mintAddress: string;
        txSignature: string;
        explorerUrl: string;
      }>;
      anchorLogs: Array<{
        logId: string;
        result: string;
        timestamp: string;
      }>;
      summary: {
        totalProcessingTime: number;
        successRate: number;
        environmentalImpact: string;
        cost: string;
      };
    };
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/demo/full-scenario`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.success,
        demoScenario: data.demo_scenario,
        error: data.error
      };
    } catch (error) {
      console.error('Error fetching demo scenario:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch demo scenario'
      };
    }
  }

  /**
   * Disconnect from Coral Protocol
   */
  async disconnect(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/coral/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to disconnect from Coral Protocol:', error);
      return false;
    }
  }
}

// Export singleton instance
export const coralApi = new CoralApiClient();
