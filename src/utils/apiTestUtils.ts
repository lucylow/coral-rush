import { supabase } from '@/integrations/supabase/client';

export interface APITestResult {
  api: string;
  success: boolean;
  responseTime: number;
  error?: string;
  details?: any;
}

export interface APIHealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  apis: APITestResult[];
  lastChecked: string;
}

export class APITester {
  private static instance: APITester;
  
  public static getInstance(): APITester {
    if (!APITester.instance) {
      APITester.instance = new APITester();
    }
    return APITester.instance;
  }

  async testAllAPIs(): Promise<APIHealthStatus> {
    const results: APITestResult[] = [];
    
    // Test voice-to-text API
    results.push(await this.testVoiceToText());
    
    // Test text-to-voice API
    results.push(await this.testTextToVoice());
    
    // Test Mistral analysis API
    results.push(await this.testMistralAnalysis());
    
    // Test AI assistant API
    results.push(await this.testAIAssistant());
    
    // Determine overall health
    const failedAPIs = results.filter(r => !r.success);
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    
    if (failedAPIs.length === 0) {
      overall = 'healthy';
    } else if (failedAPIs.length <= results.length / 2) {
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }
    
    return {
      overall,
      apis: results,
      lastChecked: new Date().toISOString()
    };
  }

  private async testVoiceToText(): Promise<APITestResult> {
    const startTime = Date.now();
    
    try {
      // Create a small test audio file (silence)
      const audioBlob = new Blob([new ArrayBuffer(1024)], { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('model', 'eleven_multilingual_v2');
      
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: formData
      });
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          api: 'voice-to-text',
          success: false,
          responseTime,
          error: error.message
        };
      }
      
      return {
        api: 'voice-to-text',
        success: data.success !== false,
        responseTime,
        details: {
          model: data.model_used,
          processing_time: data.processing_time
        }
      };
    } catch (error) {
      return {
        api: 'voice-to-text',
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  private async testTextToVoice(): Promise<APITestResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-voice', {
        body: {
          text: 'Hello, this is a test of the text-to-speech API.',
          voice_id: 'support',
          model_id: 'eleven_multilingual_v2'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          api: 'text-to-voice',
          success: false,
          responseTime,
          error: error.message
        };
      }
      
      return {
        api: 'text-to-voice',
        success: data.success !== false && !!data.audio,
        responseTime,
        details: {
          voice_id: data.voice_id,
          model_id: data.model_id,
          audio_size: data.audio?.length || 0,
          processing_time: data.processing_time
        }
      };
    } catch (error) {
      return {
        api: 'text-to-voice',
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  private async testMistralAnalysis(): Promise<APITestResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('mistral-analysis', {
        body: {
          text: 'My NFT transaction failed and I need help',
          context: 'API test',
          analysis_type: 'quick',
          user_profile: {
            experience_level: 'intermediate'
          }
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          api: 'mistral-analysis',
          success: false,
          responseTime,
          error: error.message
        };
      }
      
      return {
        api: 'mistral-analysis',
        success: data.success !== false && !!data.analysis,
        responseTime,
        details: {
          model: data.model,
          analysis_type: data.analysis_type,
          intent: data.analysis?.intent,
          emotion: data.analysis?.emotion,
          confidence: data.analysis?.confidence_score,
          processing_time: data.processing_time
        }
      };
    } catch (error) {
      return {
        api: 'mistral-analysis',
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  private async testAIAssistant(): Promise<APITestResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: 'Hello, I need help with my wallet',
          context: 'API test',
          use_voice_response: false,
          user_preferences: {
            response_style: 'concise',
            expertise_level: 'intermediate'
          }
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          api: 'ai-assistant',
          success: false,
          responseTime,
          error: error.message
        };
      }
      
      return {
        api: 'ai-assistant',
        success: data.success !== false && !!data.response,
        responseTime,
        details: {
          api_used: data.api_used,
          response_length: data.response?.length || 0,
          confidence_score: data.confidence_score,
          suggestions_count: data.suggestions?.length || 0,
          processing_time: data.processing_time
        }
      };
    } catch (error) {
      return {
        api: 'ai-assistant',
        success: false,
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  async testSpecificAPI(apiName: string): Promise<APITestResult> {
    switch (apiName) {
      case 'voice-to-text':
        return this.testVoiceToText();
      case 'text-to-voice':
        return this.testTextToVoice();
      case 'mistral-analysis':
        return this.testMistralAnalysis();
      case 'ai-assistant':
        return this.testAIAssistant();
      default:
        throw new Error(`Unknown API: ${apiName}`);
    }
  }

  getHealthStatusColor(status: 'healthy' | 'degraded' | 'unhealthy'): string {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
        return 'text-red-600';
    }
  }

  getHealthStatusIcon(status: 'healthy' | 'degraded' | 'unhealthy'): string {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'degraded':
        return '⚠️';
      case 'unhealthy':
        return '❌';
    }
  }
}
