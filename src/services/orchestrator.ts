import { CoralClient } from '../lib/coral-protocol-mock';
import { coralConfig } from '../coral-config';

export class RUSHOrchestrator {
  private coral: CoralClient;

  constructor() {
    this.coral = new CoralClient(coralConfig);
  }

  async initialize() {
    await this.coral.start();
    console.log('RUSH Multi-Agent System initialized with Coral Protocol');
  }

  async processVoiceQuery(audioData: Buffer, userContext?: any) {
    try {
      const session = await this.coral.createSession('voice-support-workflow');
      
      // Step 1: Transcribe speech
      const transcription = await session.callAgent('listener-agent', 'transcribe_speech', {
        audio_data: audioData.toString('base64')
      });
      
      if (!transcription.success) {
        throw new Error('Speech transcription failed');
      }

      // Step 2: Analyze query
      const analysis = await session.callAgent('brain-agent', 'analyze_support_query', {
        user_query: transcription.transcript,
        context: userContext,
        session_id: session.id
      });

      if (!analysis.success) {
        throw new Error('Query analysis failed');
      }

      // Step 3: Execute actions based on analysis
      let executionResults = [];
      const action = analysis.analysis.action;
      
      switch (action.type) {
        case 'check_transaction':
          const txResult = await session.callAgent('executor-agent', 'check_transaction_status', {
            transaction_hash: analysis.analysis.entities.transaction_hash
          });
          executionResults.push(txResult);
          break;

        case 'mint_apology':
          const nftResult = await session.callAgent('executor-agent', 'mint_compensation_nft', {
            recipient: userContext?.user_wallet || userContext?.user_email,
            issue_type: analysis.analysis.entities.issue_type
          });
          executionResults.push(nftResult);
          break;

        case 'get_wallet_info':
          const walletResult = await session.callAgent('executor-agent', 'get_wallet_info', {
            wallet_address: analysis.analysis.entities.wallet_address
          });
          executionResults.push(walletResult);
          break;
      }

      // Step 4: Generate voice response
      const voiceResponse = await session.callAgent('listener-agent', 'generate_speech', {
        text: analysis.analysis.response_text
      });

      await session.close();

      return {
        success: true,
        transcript: transcription.transcript,
        analysis: analysis.analysis,
        execution_results: executionResults,
        voice_response: voiceResponse.audio_data,
        session_id: session.id
      };

    } catch (error) {
      console.error('Voice query processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async shutdown() {
    await this.coral.stop();
    console.log('RUSH Multi-Agent System shutdown');
  }
}
