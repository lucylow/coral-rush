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
    this.apiKey = import.meta.env.VITE_CORAL_API_KEY || '';
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
  async getSessionHistory(sessionId: string): Promise<any[]> {
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
