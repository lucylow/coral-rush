/**
 * Coral Protocol Thread Manager
 * Handles advanced thread-based communication and multi-agent orchestration
 */

import { coralServerClient, CoralThread, CoralMessage } from './CoralServerClient';

export interface ThreadSession {
  id: string;
  threadId: string;
  participants: string[];
  status: 'active' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  messages: ThreadMessage[];
  metadata: {
    userQuery: string;
    sessionType: 'voice_support' | 'payment_processing' | 'fraud_detection';
    priority: 'low' | 'medium' | 'high';
  };
}

export interface ThreadMessage {
  id: string;
  agent: string;
  content: any;
  timestamp: Date;
  type: 'request' | 'response' | 'coordination' | 'error';
  metadata?: Record<string, any>;
}

export interface SessionMetrics {
  sessionId: string;
  duration: number;
  messageCount: number;
  participantCount: number;
  status: string;
  successRate: number;
  avgResponseTime: number;
}

export class CoralThreadManager {
  private coralClient: typeof coralServerClient;
  private activeThreads: Map<string, ThreadSession> = new Map();
  private sessionMetrics: Map<string, SessionMetrics> = new Map();

  constructor(coralClient: typeof coralServerClient) {
    this.coralClient = coralClient;
  }

  /**
   * Start a new support session with coordinated multi-agent workflow
   */
  async startSupportSession(userQuery: string, sessionId: string): Promise<ThreadSession> {
    try {
      console.log(`🚀 Starting support session: ${sessionId}`);
      
      // Create thread for this support session
      const threadResult = await this.coralClient.createThread(
        `support-session-${sessionId}`,
        ['rush-voice-listener', 'rush-brain-agent', 'rush-executor-agent', 'rush-fraud-detector']
      );

      const threadId = threadResult.thread_id;
      
      // Initialize session tracking
      const session: ThreadSession = {
        id: sessionId,
        threadId,
        participants: ['rush-voice-listener', 'rush-brain-agent', 'rush-executor-agent', 'rush-fraud-detector'],
        status: 'active',
        startTime: new Date(),
        messages: [],
        metadata: {
          userQuery,
          sessionType: this.determineSessionType(userQuery),
          priority: this.determinePriority(userQuery)
        }
      };

      this.activeThreads.set(sessionId, session);

      // Start coordinated support workflow
      await this.orchestrateSupport(session, userQuery);
      
      return session;
    } catch (error) {
      console.error('❌ Failed to start support session:', error);
      throw error;
    }
  }

  /**
   * Orchestrate the multi-agent support workflow
   */
  private async orchestrateSupport(session: ThreadSession, userQuery: string): Promise<void> {
    const { threadId } = session;

    try {
      // Step 1: Voice Listener processes input
      console.log('🎤 Step 1: Voice Listener processing...');
      await this.coralClient.sendMessage(
        threadId,
        `New voice support request: "${userQuery}"`,
        ['rush-voice-listener']
      );

      const voiceResult = await this.coralClient.waitForMentions(threadId, 15000);
      session.messages.push({
        id: `msg_${Date.now()}`,
        agent: 'rush-voice-listener',
        content: voiceResult,
        timestamp: new Date(),
        type: 'response'
      });

      // Step 2: Brain agent analyzes intent
      console.log('🧠 Step 2: Brain Agent analyzing...');
      await this.coralClient.sendMessage(
        threadId,
        `Analyze this voice processing result: ${JSON.stringify(voiceResult)}`,
        ['rush-brain-agent']
      );

      const analysisResult = await this.coralClient.waitForMentions(threadId, 20000);
      session.messages.push({
        id: `msg_${Date.now()}`,
        agent: 'rush-brain-agent',
        content: analysisResult,
        timestamp: new Date(),
        type: 'response'
      });

      // Step 3: Fraud detection if needed
      if (this.requiresFraudDetection(userQuery, analysisResult)) {
        console.log('🛡️ Step 3: Fraud Detection analyzing...');
        await this.coralClient.sendMessage(
          threadId,
          `Perform fraud detection on: ${JSON.stringify(analysisResult)}`,
          ['rush-fraud-detector']
        );

        const fraudResult = await this.coralClient.waitForMentions(threadId, 15000);
        session.messages.push({
          id: `msg_${Date.now()}`,
          agent: 'rush-fraud-detector',
          content: fraudResult,
          timestamp: new Date(),
          type: 'response'
        });
      }

      // Step 4: Executor performs blockchain actions if approved
      if (this.requiresBlockchainAction(analysisResult)) {
        console.log('⚡ Step 4: Executor Agent processing...');
        await this.coralClient.sendMessage(
          threadId,
          `Execute blockchain resolution: ${JSON.stringify(analysisResult)}`,
          ['rush-executor-agent']
        );

        const executionResult = await this.coralClient.waitForMentions(threadId, 30000);
        session.messages.push({
          id: `msg_${Date.now()}`,
          agent: 'rush-executor-agent',
          content: executionResult,
          timestamp: new Date(),
          type: 'response'
        });
      }

      // Mark session complete
      session.status = 'completed';
      session.endTime = new Date();
      
      console.log('✅ Support session completed successfully');
      
    } catch (error) {
      console.error('❌ Support session failed:', error);
      session.status = 'failed';
      session.endTime = new Date();
      session.messages.push({
        id: `msg_${Date.now()}`,
        agent: 'system',
        content: { error: error.message },
        timestamp: new Date(),
        type: 'error'
      });
    }
  }

  /**
   * Get session metrics for analytics
   */
  getSessionMetrics(sessionId: string): SessionMetrics | null {
    const session = this.activeThreads.get(sessionId);
    if (!session) return null;

    const duration = session.endTime 
      ? session.endTime.getTime() - session.startTime.getTime()
      : Date.now() - session.startTime.getTime();

    const successfulMessages = session.messages.filter(msg => msg.type !== 'error').length;
    const successRate = session.messages.length > 0 ? successfulMessages / session.messages.length : 0;

    const avgResponseTime = this.calculateAverageResponseTime(session.messages);

    return {
      sessionId,
      duration,
      messageCount: session.messages.length,
      participantCount: session.participants.length,
      status: session.status,
      successRate,
      avgResponseTime
    };
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): ThreadSession[] {
    return Array.from(this.activeThreads.values()).filter(session => session.status === 'active');
  }

  /**
   * Get session history
   */
  getSessionHistory(limit = 10): ThreadSession[] {
    return Array.from(this.activeThreads.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  /**
   * Cancel an active session
   */
  async cancelSession(sessionId: string): Promise<boolean> {
    const session = this.activeThreads.get(sessionId);
    if (!session) return false;

    try {
      await this.coralClient.sendMessage(
        session.threadId,
        'Session cancelled by user',
        session.participants
      );

      session.status = 'failed';
      session.endTime = new Date();
      
      console.log(`❌ Session ${sessionId} cancelled`);
      return true;
    } catch (error) {
      console.error('❌ Failed to cancel session:', error);
      return false;
    }
  }

  /**
   * Add a participant to an active session
   */
  async addParticipant(sessionId: string, agentId: string): Promise<boolean> {
    const session = this.activeThreads.get(sessionId);
    if (!session) return false;

    try {
      await this.coralClient.addParticipant(session.threadId, agentId);
      session.participants.push(agentId);
      
      console.log(`➕ Added participant ${agentId} to session ${sessionId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add participant:', error);
      return false;
    }
  }

  // Helper methods
  private determineSessionType(userQuery: string): 'voice_support' | 'payment_processing' | 'fraud_detection' {
    const query = userQuery.toLowerCase();
    
    if (query.includes('payment') || query.includes('transfer') || query.includes('send money')) {
      return 'payment_processing';
    } else if (query.includes('fraud') || query.includes('scam') || query.includes('suspicious')) {
      return 'fraud_detection';
    } else {
      return 'voice_support';
    }
  }

  private determinePriority(userQuery: string): 'low' | 'medium' | 'high' {
    const query = userQuery.toLowerCase();
    
    if (query.includes('urgent') || query.includes('emergency') || query.includes('fraud')) {
      return 'high';
    } else if (query.includes('payment') || query.includes('transaction')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private requiresFraudDetection(userQuery: string, analysisResult: any): boolean {
    const query = userQuery.toLowerCase();
    return query.includes('fraud') || 
           query.includes('scam') || 
           query.includes('suspicious') ||
           (analysisResult && analysisResult.risk_score > 0.7);
  }

  private requiresBlockchainAction(analysisResult: any): boolean {
    return analysisResult && 
           analysisResult.requires_blockchain_action && 
           analysisResult.approved !== false;
  }

  private calculateAverageResponseTime(messages: ThreadMessage[]): number {
    if (messages.length < 2) return 0;

    let totalTime = 0;
    let responseCount = 0;

    for (let i = 1; i < messages.length; i++) {
      const current = messages[i];
      const previous = messages[i - 1];
      
      if (current.type === 'response' && previous.type === 'request') {
        totalTime += current.timestamp.getTime() - previous.timestamp.getTime();
        responseCount++;
      }
    }

    return responseCount > 0 ? totalTime / responseCount : 0;
  }

  /**
   * Get comprehensive analytics for all sessions
   */
  getAnalytics(): {
    totalSessions: number;
    activeSessions: number;
    completedSessions: number;
    failedSessions: number;
    averageDuration: number;
    averageSuccessRate: number;
    totalMessages: number;
  } {
    const sessions = Array.from(this.activeThreads.values());
    
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const failedSessions = sessions.filter(s => s.status === 'failed').length;
    
    const totalDuration = sessions.reduce((sum, session) => {
      const duration = session.endTime 
        ? session.endTime.getTime() - session.startTime.getTime()
        : Date.now() - session.startTime.getTime();
      return sum + duration;
    }, 0);
    
    const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
    
    const totalMessages = sessions.reduce((sum, session) => sum + session.messages.length, 0);
    
    const successfulMessages = sessions.reduce((sum, session) => {
      return sum + session.messages.filter(msg => msg.type !== 'error').length;
    }, 0);
    
    const averageSuccessRate = totalMessages > 0 ? successfulMessages / totalMessages : 0;

    return {
      totalSessions,
      activeSessions,
      completedSessions,
      failedSessions,
      averageDuration,
      averageSuccessRate,
      totalMessages
    };
  }
}

// Export singleton instance
export const threadManager = new CoralThreadManager(coralServerClient);
