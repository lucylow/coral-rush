import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from 'axios';
import FormData from 'form-data';

// Import Aethir GPU integration
import { aethirTranscribeSpeech, aethirGenerateSpeech } from '../services/aethirService.js';

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost?: boolean;
}

interface SpeechGenerationOptions {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: VoiceSettings;
}

interface TranscriptionOptions {
  audio_data: Buffer;
  model_id?: string;
  language?: string;
}

class ListenerAgent {
  private server: Server;
  private elevenLabsApiKey: string;
  private baseUrl: string = "https://api.elevenlabs.io/v1";
  private defaultVoiceId: string = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice
  private defaultModel: string = "eleven_multilingual_v1";

  constructor() {
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || "";
    if (!this.elevenLabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY environment variable is required");
    }

    this.server = new Server(
      {
        name: "listener-agent",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "transcribe_speech",
          description: "Convert speech audio to text using ElevenLabs STT",
          inputSchema: {
            type: "object",
            properties: {
              audio_data: {
                type: "string",
                description: "Base64 encoded audio data (webm, mp3, wav)"
              },
              model_id: {
                type: "string",
                description: "Speech-to-text model ID",
                default: this.defaultModel
              },
              language: {
                type: "string",
                description: "Language code (e.g., 'en', 'es', 'fr')",
                default: "en"
              }
            },
            required: ["audio_data"]
          }
        },
        {
          name: "generate_speech",
          description: "Convert text to speech using ElevenLabs TTS",
          inputSchema: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "Text to convert to speech"
              },
              voice_id: {
                type: "string",
                description: "Voice ID to use for generation",
                default: this.defaultVoiceId
              },
              model_id: {
                type: "string",
                description: "TTS model ID",
                default: this.defaultModel
              },
              voice_settings: {
                type: "object",
                description: "Voice generation settings",
                properties: {
                  stability: { type: "number", minimum: 0, maximum: 1, default: 0.5 },
                  similarity_boost: { type: "number", minimum: 0, maximum: 1, default: 0.75 },
                  style: { type: "number", minimum: 0, maximum: 1, default: 0.0 },
                  use_speaker_boost: { type: "boolean", default: true }
                }
              }
            },
            required: ["text"]
          }
        },
        {
          name: "get_available_voices",
          description: "Get list of available ElevenLabs voices",
          inputSchema: {
            type: "object",
            properties: {},
            required: []
          }
        },
        {
          name: "analyze_audio_quality",
          description: "Analyze audio quality and provide recommendations",
          inputSchema: {
            type: "object",
            properties: {
              audio_data: {
                type: "string",
                description: "Base64 encoded audio data"
              }
            },
            required: ["audio_data"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "transcribe_speech":
            return await this.handleTranscribeSpeech(args as any);
          
          case "generate_speech":
            return await this.handleGenerateSpeech(args as any);
          
          case "get_available_voices":
            return await this.handleGetVoices();
          
          case "analyze_audio_quality":
            return await this.handleAnalyzeAudioQuality(args as any);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  private async handleTranscribeSpeech(args: {
    audio_data: string;
    model_id?: string;
    language?: string;
  }) {
    try {
      // Try Aethir GPU-accelerated speech recognition first
      try {
        console.log("🚀 Using Aethir GPU for speech transcription...");
        
        const aethirResult = await aethirTranscribeSpeech(args.audio_data, args.language || 'en');
        
        if (!aethirResult.error) {
          console.log(`✅ Aethir GPU transcription completed: "${aethirResult.transcript}"`);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  transcript: aethirResult.transcript,
                  confidence: aethirResult.confidence,
                  language: aethirResult.language,
                  processing_time: aethirResult.processingTimeMs,
                  agent_type: "listener",
                  timestamp: new Date().toISOString(),
                  operation: "speech_to_text",
                  aethir_gpu_used: true,
                  processing_node: aethirResult.processingNode,
                  model: aethirResult.model
                }, null, 2)
              }
            ]
          };
        } else {
          console.warn(`⚠️ Aethir GPU transcription failed: ${aethirResult.error}, falling back to ElevenLabs`);
        }
      } catch (gpu_error: any) {
        console.warn(`⚠️ Aethir GPU unavailable: ${gpu_error.message}, using ElevenLabs`);
      }

      // Fallback to ElevenLabs API
      console.log("🔧 Using ElevenLabs API for transcription...");

      // Decode base64 audio data
      const audioBuffer = Buffer.from(args.audio_data, 'base64');
      
      // Create form data for ElevenLabs API
      const formData = new FormData();
      formData.append('audio', audioBuffer, {
        filename: 'audio.webm',
        contentType: 'audio/webm'
      });
      formData.append('model_id', args.model_id || this.defaultModel);
      
      if (args.language) {
        formData.append('language', args.language);
      }

      const response = await axios.post(
        `${this.baseUrl}/speech-to-text`,
        formData,
        {
          headers: {
            'xi-api-key': this.elevenLabsApiKey,
            ...formData.getHeaders()
          }
        }
      );

      const transcript = response.data.text;
      const confidence = response.data.confidence || 0.95;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              transcript,
              confidence,
              language: args.language || 'en',
              processing_time: response.data.processing_time || null,
              agent_type: "listener",
              timestamp: new Date().toISOString(),
              operation: "speech_to_text",
              aethir_gpu_used: false,
              fallback_mode: true,
              api_provider: "elevenlabs"
            }, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Speech transcription failed: ${error.message}`,
              agent_type: "listener",
              timestamp: new Date().toISOString(),
              operation: "speech_to_text"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleGenerateSpeech(args: SpeechGenerationOptions) {
    try {
      // Try Aethir GPU-accelerated text-to-speech first
      try {
        console.log("🚀 Using Aethir GPU for speech generation...");
        
        const aethirResult = await aethirGenerateSpeech(args.text, args.voice_id || 'default');
        
        if (!aethirResult.error) {
          console.log(`✅ Aethir GPU speech generation completed`);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  audio_data: aethirResult.audioData,
                  format: aethirResult.format,
                  sample_rate: aethirResult.sampleRate,
                  duration_ms: aethirResult.durationMs,
                  voice_id: aethirResult.voiceId,
                  quality: aethirResult.quality,
                  agent_type: "listener",
                  timestamp: new Date().toISOString(),
                  operation: "text_to_speech",
                  aethir_gpu_used: true,
                  processing_node: aethirResult.processingNode,
                  model: aethirResult.model
                }, null, 2)
              }
            ]
          };
        } else {
          console.warn(`⚠️ Aethir GPU speech generation failed: ${aethirResult.error}, falling back to ElevenLabs`);
        }
      } catch (gpu_error: any) {
        console.warn(`⚠️ Aethir GPU unavailable: ${gpu_error.message}, using ElevenLabs`);
      }

      // Fallback to ElevenLabs API
      console.log("🔧 Using ElevenLabs API for speech generation...");
    try {
      const requestBody = {
        text: args.text,
        model_id: args.model_id || this.defaultModel,
        voice_settings: args.voice_settings || {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${args.voice_id || this.defaultVoiceId}`,
        requestBody,
        {
          headers: {
            'xi-api-key': this.elevenLabsApiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      // Convert audio buffer to base64 for transmission
      const audioBase64 = Buffer.from(response.data).toString('base64');
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              audio_data: audioBase64,
              audio_format: "mp3",
              text_length: args.text.length,
              voice_id: args.voice_id || this.defaultVoiceId,
              model_id: args.model_id || this.defaultModel,
              agent_type: "listener",
              timestamp: new Date().toISOString(),
              operation: "text_to_speech"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Speech generation failed: ${error.message}`,
              agent_type: "listener",
              timestamp: new Date().toISOString(),
              operation: "text_to_speech"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleGetVoices() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/voices`,
        {
          headers: {
            'xi-api-key': this.elevenLabsApiKey
          }
        }
      );

      const voices = response.data.voices.map((voice: any) => ({
        voice_id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description,
        preview_url: voice.preview_url,
        available_for_tiers: voice.available_for_tiers
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              voices,
              total_count: voices.length,
              agent_type: "listener",
              timestamp: new Date().toISOString(),
              operation: "get_voices"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Failed to fetch voices: ${error.message}`,
              agent_type: "listener",
              timestamp: new Date().toISOString(),
              operation: "get_voices"
            }, null, 2)
          }
        ]
      };
    }
  }

  private async handleAnalyzeAudioQuality(args: { audio_data: string }) {
    try {
      // Decode and analyze audio buffer
      const audioBuffer = Buffer.from(args.audio_data, 'base64');
      const audioSize = audioBuffer.length;
      
      // Basic audio quality analysis
      const quality = {
        file_size: audioSize,
        estimated_duration: Math.round(audioSize / 16000), // Rough estimate
        format_detected: this.detectAudioFormat(audioBuffer),
        quality_score: this.calculateQualityScore(audioBuffer),
        recommendations: this.generateQualityRecommendations(audioBuffer)
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              quality_analysis: quality,
              agent_type: "listener",
              timestamp: new Date().toISOString(),
              operation: "analyze_audio_quality"
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: `Audio quality analysis failed: ${error.message}`,
              agent_type: "listener",
              timestamp: new Date().toISOString(),
              operation: "analyze_audio_quality"
            }, null, 2)
          }
        ]
      };
    }
  }

  private detectAudioFormat(buffer: Buffer): string {
    const header = buffer.subarray(0, 12);
    
    if (header.includes(Buffer.from('WEBM', 'ascii'))) return 'webm';
    if (header.includes(Buffer.from('ID3', 'ascii')) || 
        (header[0] === 0xFF && (header[1] & 0xE0) === 0xE0)) return 'mp3';
    if (header.includes(Buffer.from('RIFF', 'ascii'))) return 'wav';
    if (header.includes(Buffer.from('ftyp', 'ascii'))) return 'm4a';
    
    return 'unknown';
  }

  private calculateQualityScore(buffer: Buffer): number {
    const size = buffer.length;
    let score = 0.5; // Base score

    // Size-based scoring
    if (size > 100000) score += 0.2; // Large file likely better quality
    if (size < 10000) score -= 0.2; // Very small file likely poor quality

    // Format-based scoring (simplified)
    const format = this.detectAudioFormat(buffer);
    switch (format) {
      case 'wav': score += 0.2; break;
      case 'mp3': score += 0.1; break;
      case 'webm': score += 0.1; break;
      default: score -= 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  private generateQualityRecommendations(buffer: Buffer): string[] {
    const recommendations: string[] = [];
    const format = this.detectAudioFormat(buffer);
    const size = buffer.length;

    if (format === 'unknown') {
      recommendations.push("Consider using a standard audio format like WAV or MP3");
    }

    if (size < 10000) {
      recommendations.push("Audio file seems very small - ensure adequate recording duration");
    }

    if (size > 10000000) {
      recommendations.push("Large audio file - consider compression for faster processing");
    }

    recommendations.push("Ensure clear speech with minimal background noise");
    recommendations.push("Record in a quiet environment for best transcription results");

    return recommendations;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Export for use with Coral Protocol
export default ListenerAgent;

// If running as standalone MCP server
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new ListenerAgent();
  agent.run().catch(console.error);
}
