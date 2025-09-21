import { CoralClient } from '../lib/coral-protocol-mock';
import { coralConfig } from '../coral-config';

export class RUSHOrchestrator {
  private coral: CoralClient;
  private isInitialized = false;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.coral = new CoralClient(coralConfig);
  }

  async initialize() {
    try {
      await this.coral.start();
      this.isInitialized = true;
      this.retryCount = 0;
      console.log('RUSH Multi-Agent System initialized with Coral Protocol');
    } catch (error) {
      console.error('Failed to initialize Coral Protocol:', error);
      throw error;
    }
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
        
        if (attempt < maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`${operationName} failed after ${maxRetries + 1} attempts: ${lastError.message}`);
  }

  async processVoiceQuery(audioData: Buffer, userContext?: Record<string, unknown>) {
    if (!this.isInitialized) {
      throw new Error('Orchestrator not initialized');
    }

    const startTime = Date.now();
    let session: any = null;

    try {
      // Create session with retry logic
      session = await this.withRetry(
        () => this.coral.createSession('voice-support-workflow'),
        'Session creation'
      );
      
      // Step 1: Transcribe speech with retry
      const transcription = await this.withRetry(
        () => session.callAgent('listener-agent', 'transcribe_speech', {
          audio_data: audioData.toString('base64')
        }),
        'Speech transcription'
      ) as any;
      
      if (!transcription.success) {
        throw new Error(`Speech transcription failed: ${transcription.error || 'Unknown error'}`);
      }

      // Step 2: Analyze query with retry
      const analysis = await this.withRetry(
        () => session.callAgent('brain-agent', 'analyze_support_query', {
          user_query: transcription.transcript,
          context: userContext,
          session_id: session.id
        }),
        'Query analysis'
      ) as any;

      if (!analysis.success) {
        throw new Error(`Query analysis failed: ${analysis.error || 'Unknown error'}`);
      }

      // Step 3: Execute actions based on analysis with parallel processing where possible
      const executionResults = await this.executeActions(session, analysis.analysis, userContext);

      // Step 4: Generate voice response with retry
      const voiceResponse = await this.withRetry(
        () => session.callAgent('listener-agent', 'generate_speech', {
          text: analysis.analysis.response_text
        }),
        'Voice response generation'
      ) as any;

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        transcript: transcription.transcript,
        analysis: analysis.analysis,
        execution_results: executionResults,
        voice_response: voiceResponse.audio_data,
        session_id: session.id,
        processing_time,
        agents_active: 5 // Mock active agents count
      };

    } catch (error) {
      console.error('Voice query processing failed:', error);
      return {
        success: false,
        error: error.message,
        processing_time: Date.now() - startTime
      };
    } finally {
      // Ensure session is closed
      if (session) {
        try {
          await session.close();
        } catch (closeError) {
          console.warn('Failed to close session:', closeError);
        }
      }
    }
  }

  private async executeActions(session: any, analysis: any, userContext?: Record<string, unknown>) {
    const executionResults = [];
    const action = analysis.action;
    
    try {
      switch (action.type) {
        case 'check_transaction': {
          const txResult = await this.withRetry(
            () => session.callAgent('executor-agent', 'check_transaction_status', {
              transaction_hash: analysis.entities.transaction_hash
            }),
            'Transaction status check'
          );
          executionResults.push(txResult);
          break;
        }

        case 'mint_compensation_nft': {
          const nftResult = await this.withRetry(
            () => session.callAgent('executor-agent', 'mint_compensation_nft', {
              recipient: userContext?.user_wallet || userContext?.user_email,
              issue_type: analysis.entities.issue_type,
              compensation_amount: analysis.entities.amount_lost
            }),
            'NFT compensation minting'
          );
          executionResults.push(nftResult);
          break;
        }

        case 'get_wallet_info': {
          const walletResult = await this.withRetry(
            () => session.callAgent('executor-agent', 'get_wallet_info', {
              wallet_address: analysis.entities.wallet_address || userContext?.user_wallet
            }),
            'Wallet information retrieval'
          );
          executionResults.push(walletResult);
          break;
        }

        case 'process_payment': {
          // For payment processing, we might want to run fraud detection in parallel
          const [fraudResult, paymentResult] = await Promise.allSettled([
            this.withRetry(
              () => session.callAgent('fraud-detection-agent', 'detect_fraud', {
                amount: analysis.entities.amount,
                destination: analysis.entities.destination,
                user_context: userContext
              }),
              'Fraud detection'
            ),
            this.withRetry(
              () => session.callAgent('payment-agent', 'process_payment', {
                amount: analysis.entities.amount,
                destination: analysis.entities.destination,
                purpose: analysis.entities.purpose
              }),
              'Payment processing'
            )
          ]);

          if (fraudResult.status === 'fulfilled') {
            executionResults.push(fraudResult.value);
          }
          if (paymentResult.status === 'fulfilled') {
            executionResults.push(paymentResult.value);
          }
          break;
        }

        default: {
          console.warn(`Unknown action type: ${action.type}`);
          executionResults.push({
            success: false,
            error: `Unknown action type: ${action.type}`
          });
        }
      }
    } catch (error) {
      console.error('Action execution failed:', error);
      executionResults.push({
        success: false,
        error: error.message
      });
    }

    return executionResults;
  }

  async shutdown() {
    await this.coral.stop();
    console.log('RUSH Multi-Agent System shutdown');
  }
}
