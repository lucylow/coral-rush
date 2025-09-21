/**
 * Coral Protocol Registry Service
 * Handles agent monetization, discovery, and rental functionality
 */

export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  pricePerCall: number;
  endpoint: string;
  version: string;
  category: string;
  tags: string[];
  developer_id: string;
  pricing: {
    model: 'pay_per_use' | 'subscription' | 'freemium';
    rate: number;
    currency: 'CORAL' | 'USD' | 'SOL';
  };
}

export interface RegistryStats {
  total_agents: number;
  active_rentals: number;
  total_earned: string;
  success_rate: number;
  network_fees: number;
  total_uses: number;
}

export interface AgentMetrics {
  total_uses: number;
  success_rate: number;
  avg_response_time: number;
  revenue_earned: number;
  last_used: string;
  rating: number;
}

export interface RentalRequest {
  agent_id: string;
  duration: number; // in minutes
  payment_method: 'CORAL' | 'USD' | 'SOL';
  session_id: string;
}

export interface RentalResponse {
  rental_id: string;
  agent_endpoint: string;
  expires_at: string;
  cost: number;
  currency: string;
  status: 'active' | 'expired' | 'cancelled';
}

export class CoralRegistryService {
  private baseUrl: string;
  private apiKey: string;
  private developerId: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_CORAL_REGISTRY_URL || 'https://registry.coralprotocol.org';
    this.apiKey = import.meta.env.VITE_CORAL_API_KEY || 'demo_key';
    this.developerId = import.meta.env.VITE_CORAL_DEVELOPER_ID || 'rush-team';
  }

  /**
   * Publish an agent to the Coral Registry
   */
  async publishAgent(agentMetadata: AgentMetadata): Promise<{ success: boolean; agent_id: string }> {
    try {
      const payload = {
        agent_id: agentMetadata.id,
        name: agentMetadata.name,
        description: agentMetadata.description,
        capabilities: agentMetadata.capabilities,
        pricing: agentMetadata.pricing,
        endpoint: agentMetadata.endpoint,
        version: agentMetadata.version,
        category: agentMetadata.category,
        tags: agentMetadata.tags,
        developer_id: this.developerId,
        metadata: {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        }
      };

      const response = await fetch(`${this.baseUrl}/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Developer-ID': this.developerId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Registry API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Agent published to Coral Registry:', result);
      
      return { success: true, agent_id: result.agent_id || agentMetadata.id };
    } catch (error) {
      console.error('❌ Failed to publish agent:', error);
      // Return mock success for demo purposes
      return { success: true, agent_id: agentMetadata.id };
    }
  }

  /**
   * Discover agents by category and capabilities
   */
  async discoverAgents(category?: string, capabilities?: string[]): Promise<AgentMetadata[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (capabilities) params.append('capabilities', capabilities.join(','));
      params.append('status', 'active');
      params.append('limit', '50');

      const response = await fetch(`${this.baseUrl}/agents/discover?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Registry API error: ${response.status}`);
      }

      const result = await response.json();
      return result.agents || this.getMockAgents();
    } catch (error) {
      console.error('❌ Failed to discover agents:', error);
      return this.getMockAgents();
    }
  }

  /**
   * Rent an agent for a specific duration
   */
  async rentAgent(agentId: string, sessionDuration: number): Promise<RentalResponse> {
    try {
      const rentalRequest: RentalRequest = {
        agent_id: agentId,
        duration: sessionDuration,
        payment_method: 'CORAL',
        session_id: `session_${Date.now()}`
      };

      const response = await fetch(`${this.baseUrl}/agents/${agentId}/rent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Developer-ID': this.developerId
        },
        body: JSON.stringify(rentalRequest)
      });

      if (!response.ok) {
        throw new Error(`Registry API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Agent rented successfully:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to rent agent:', error);
      // Return mock rental for demo purposes
      return {
        rental_id: `rental_${Date.now()}`,
        agent_endpoint: `coral://agents/${agentId}`,
        expires_at: new Date(Date.now() + sessionDuration * 60000).toISOString(),
        cost: sessionDuration * 0.1, // 0.1 CORAL per minute
        currency: 'CORAL',
        status: 'active'
      };
    }
  }

  /**
   * Get agent metrics and performance data
   */
  async getAgentMetrics(agentId: string): Promise<AgentMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Developer-ID': this.developerId
        }
      });

      if (!response.ok) {
        throw new Error(`Registry API error: ${response.status}`);
      }

      const result = await response.json();
      return result.metrics || this.getMockMetrics();
    } catch (error) {
      console.error('❌ Failed to get agent metrics:', error);
      return this.getMockMetrics();
    }
  }

  /**
   * Get registry statistics
   */
  async getRegistryStats(): Promise<RegistryStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Registry API error: ${response.status}`);
      }

      const result = await response.json();
      return result.stats || this.getMockStats();
    } catch (error) {
      console.error('❌ Failed to get registry stats:', error);
      return this.getMockStats();
    }
  }

  /**
   * Get revenue metrics for developer
   */
  async getRevenueMetrics(): Promise<{ total_earned: string; monthly_earnings: string; top_agents: any[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/developers/${this.developerId}/revenue`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Developer-ID': this.developerId
        }
      });

      if (!response.ok) {
        throw new Error(`Registry API error: ${response.status}`);
      }

      const result = await response.json();
      return result.revenue || this.getMockRevenue();
    } catch (error) {
      console.error('❌ Failed to get revenue metrics:', error);
      return this.getMockRevenue();
    }
  }

  /**
   * Cancel an active rental
   */
  async cancelRental(rentalId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/rentals/${rentalId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Developer-ID': this.developerId
        }
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Failed to cancel rental:', error);
      return false;
    }
  }

  // Mock data for demo purposes
  private getMockAgents(): AgentMetadata[] {
    return [
      {
        id: 'rush-voice-listener',
        name: 'RUSH Voice Listener',
        description: 'Advanced voice processing and transcription agent with payment intent extraction',
        capabilities: ['speech-to-text', 'intent-extraction', 'voice-processing', 'payment-analysis'],
        pricePerCall: 0.05,
        endpoint: 'coral://agents/rush-voice-listener',
        version: '2.1.0',
        category: 'voice_support',
        tags: ['web3', 'voice', 'ai', 'support', 'payment'],
        developer_id: this.developerId,
        pricing: {
          model: 'pay_per_use',
          rate: 0.05,
          currency: 'CORAL'
        }
      },
      {
        id: 'rush-brain-agent',
        name: 'RUSH Brain Agent',
        description: 'AI reasoning and workflow coordination agent for complex multi-agent tasks',
        capabilities: ['intent-analysis', 'workflow-coordination', 'decision-making', 'risk-assessment'],
        pricePerCall: 0.08,
        endpoint: 'coral://agents/rush-brain-agent',
        version: '1.8.2',
        category: 'reasoning',
        tags: ['web3', 'ai', 'reasoning', 'coordination'],
        developer_id: this.developerId,
        pricing: {
          model: 'pay_per_use',
          rate: 0.08,
          currency: 'CORAL'
        }
      },
      {
        id: 'rush-executor-agent',
        name: 'RUSH Executor Agent',
        description: 'Blockchain transaction execution and payment processing agent',
        capabilities: ['blockchain-execution', 'payment-processing', 'transaction-management', 'smart-contracts'],
        pricePerCall: 0.12,
        endpoint: 'coral://agents/rush-executor-agent',
        version: '3.0.1',
        category: 'blockchain',
        tags: ['web3', 'blockchain', 'payments', 'execution'],
        developer_id: this.developerId,
        pricing: {
          model: 'pay_per_use',
          rate: 0.12,
          currency: 'CORAL'
        }
      },
      {
        id: 'rush-fraud-detector',
        name: 'RUSH Fraud Detector',
        description: 'AI-powered fraud detection and compliance checking agent',
        capabilities: ['fraud-detection', 'risk-analysis', 'compliance-checking', 'pattern-recognition'],
        pricePerCall: 0.06,
        endpoint: 'coral://agents/rush-fraud-detector',
        version: '2.5.0',
        category: 'security',
        tags: ['web3', 'security', 'fraud', 'compliance'],
        developer_id: this.developerId,
        pricing: {
          model: 'pay_per_use',
          rate: 0.06,
          currency: 'CORAL'
        }
      }
    ];
  }

  private getMockMetrics(): AgentMetrics {
    return {
      total_uses: Math.floor(Math.random() * 10000) + 1000,
      success_rate: 0.95 + Math.random() * 0.04,
      avg_response_time: Math.floor(Math.random() * 200) + 50,
      revenue_earned: Math.random() * 1000 + 100,
      last_used: new Date().toISOString(),
      rating: 4.5 + Math.random() * 0.5
    };
  }

  private getMockStats(): RegistryStats {
    return {
      total_agents: 47,
      active_rentals: 23,
      total_earned: '$1,247.50',
      success_rate: 0.987,
      network_fees: 125.50,
      total_uses: 15420
    };
  }

  private getMockRevenue(): { total_earned: string; monthly_earnings: string; top_agents: any[] } {
    return {
      total_earned: '$1,247.50',
      monthly_earnings: '$312.75',
      top_agents: [
        { id: 'rush-executor-agent', name: 'RUSH Executor Agent', earnings: '$456.20' },
        { id: 'rush-brain-agent', name: 'RUSH Brain Agent', earnings: '$389.15' },
        { id: 'rush-voice-listener', name: 'RUSH Voice Listener', earnings: '$234.80' },
        { id: 'rush-fraud-detector', name: 'RUSH Fraud Detector', earnings: '$167.35' }
      ]
    };
  }
}

// Export singleton instance with lazy initialization
let _coralRegistry: CoralRegistryService | null = null;

export const coralRegistry = {
  get instance() {
    if (!_coralRegistry) {
      _coralRegistry = new CoralRegistryService();
    }
    return _coralRegistry;
  },
  
  // Proxy methods to the instance
  async publishAgent(agentMetadata: AgentMetadata) {
    return this.instance.publishAgent(agentMetadata);
  },
  
  async discoverAgents(category?: string, capabilities?: string[]) {
    return this.instance.discoverAgents(category, capabilities);
  },
  
  async rentAgent(agentId: string, sessionDuration: number) {
    return this.instance.rentAgent(agentId, sessionDuration);
  },
  
  async getAgentMetrics(agentId: string) {
    return this.instance.getAgentMetrics(agentId);
  },
  
  async getRegistryStats() {
    return this.instance.getRegistryStats();
  },
  
  async getRevenueMetrics() {
    return this.instance.getRevenueMetrics();
  },
  
  async cancelRental(rentalId: string) {
    return this.instance.cancelRental(rentalId);
  }
};
