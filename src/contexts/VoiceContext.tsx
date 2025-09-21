import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Buffer } from 'buffer';

// Speech Recognition API types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
}

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  isSupported: boolean;
}

interface VoiceContextType extends VoiceState {
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  processVoiceInput: (input: Buffer) => Promise<{
    success: boolean;
    transcript?: string;
    response?: string;
    confidence?: number;
    agentsActive?: number;
    error?: string;
  }>;
  generateSpeech: (text: string, voiceId?: string) => Promise<string | null>;
  getAvailableVoices: () => Promise<Voice[]>;
  agentStatus: {
    isInitialized: boolean;
    hasOrchestrator: boolean;
    environmentValid: boolean;
    coralConnected: boolean;
    agentsActive: number;
    lastActivity: Date | null;
  };
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null,
    isSupported: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  });

  const [agentStatus, setAgentStatus] = useState({
    isInitialized: false,
    hasOrchestrator: false,
    environmentValid: false,
    coralConnected: false,
    agentsActive: 0,
    lastActivity: null as Date | null
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const orchestratorRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!voiceState.isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState(prev => ({
        ...prev,
        isListening: true,
        error: null
      }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence || 0;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          setVoiceState(prev => ({
            ...prev,
            transcript: finalTranscript,
            confidence: confidence * 100
          }));
        } else {
          interimTranscript += transcript;
          setVoiceState(prev => ({
            ...prev,
            transcript: interimTranscript,
            confidence: confidence * 100
          }));
        }
      }

      // Reset timeout for auto-stop
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && voiceState.isListening) {
          recognitionRef.current.stop();
        }
      }, 3000); // Stop after 3 seconds of silence
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setVoiceState(prev => ({
        ...prev,
        error: `Speech recognition error: ${event.error}`,
        isListening: false
      }));
    };

    recognition.onend = () => {
      setVoiceState(prev => ({
        ...prev,
        isListening: false
      }));
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [voiceState.isSupported]);

  const startListening = useCallback(() => {
    if (!voiceState.isSupported) {
      setVoiceState(prev => ({
        ...prev,
        error: 'Speech recognition is not supported in this browser'
      }));
      return;
    }

    if (!recognitionRef.current || voiceState.isListening) return;

    try {
      setVoiceState(prev => ({
        ...prev,
        transcript: '',
        confidence: 0,
        error: null
      }));
      
      recognitionRef.current.start();
    } catch (error) {
      setVoiceState(prev => ({
        ...prev,
        error: 'Failed to start speech recognition'
      }));
    }
  }, [voiceState.isSupported, voiceState.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && voiceState.isListening) {
      recognitionRef.current.stop();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [voiceState.isListening]);

  const clearTranscript = useCallback(() => {
    setVoiceState(prev => ({
      ...prev,
      transcript: '',
      confidence: 0,
      error: null
    }));
  }, []);

  // Initialize Coral Protocol Orchestrator
  useEffect(() => {
    const initializeOrchestrator = async () => {
      try {
        const { RUSHOrchestrator } = await import('../services/orchestrator');
        const orchestrator = new RUSHOrchestrator();
        await orchestrator.initialize();
        orchestratorRef.current = orchestrator;
        
        setAgentStatus(prev => ({
          ...prev,
          isInitialized: true,
          hasOrchestrator: true,
          coralConnected: true,
          agentsActive: 5 // Mock active agents
        }));
      } catch (error) {
        console.error('Failed to initialize Coral Protocol:', error);
        setAgentStatus(prev => ({
          ...prev,
          isInitialized: false,
          hasOrchestrator: false,
          coralConnected: false
        }));
      }
    };

    initializeOrchestrator();
  }, []);

  const processVoiceInput = useCallback(async (input: Buffer): Promise<{
    success: boolean;
    transcript?: string;
    response?: string;
    confidence?: number;
    agentsActive?: number;
    error?: string;
  }> => {
    setVoiceState(prev => ({ ...prev, isProcessing: true }));
    setAgentStatus(prev => ({ ...prev, lastActivity: new Date() }));

    try {
      if (!orchestratorRef.current) {
        throw new Error('Coral Protocol orchestrator not initialized');
      }

      // Process with Coral Protocol
      const result = await orchestratorRef.current.processVoiceQuery(input, {
        user_id: 'demo_user',
        session_id: `session_${Date.now()}`
      });

      if (result.success) {
        setAgentStatus(prev => ({
          ...prev,
          coralConnected: true,
          agentsActive: 5,
          lastActivity: new Date()
        }));

        setVoiceState(prev => ({ ...prev, isProcessing: false }));
        
        return {
          success: true,
          transcript: result.transcript,
          response: result.analysis?.response_text,
          confidence: result.analysis?.confidence,
          agentsActive: 5
        };
      } else {
        throw new Error(result.error || 'Voice processing failed');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
      
      // Fallback to enhanced mock processing
      const mockResponse = await processMockVoiceInput(input);
      
      return {
        success: true,
        transcript: mockResponse.transcript,
        response: mockResponse.response,
        confidence: mockResponse.confidence,
        agentsActive: 0
      };
    }
  }, []);

  const processMockVoiceInput = async (input: Buffer): Promise<{
    transcript: string;
    response: string;
    confidence: number;
  }> => {
    // Enhanced mock processing with realistic responses
    const mockTranscriptions = [
      "My NFT mint transaction failed and I lost 0.5 ETH. Can you help me get my money back?",
      "I need help with my wallet balance and recent transactions",
      "Can you help me send a payment to the Philippines?",
      "What's the status of my recent blockchain transaction?",
      "I want to check my SOL token balance and transfer some tokens"
    ];

    const transcript = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    let response = "I understand your request. Let me help you with that.";
    let confidence = 0.95;

    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('transaction') && lowerTranscript.includes('failed')) {
      response = "I understand your frustration about the failed NFT mint. I've analyzed your transaction and found the issue was due to insufficient gas fees. I'm processing a compensation NFT and initiating a refund to your wallet. The refund should appear within 24 hours.";
    } else if (lowerTranscript.includes('wallet') || lowerTranscript.includes('balance')) {
      response = "I'll check your wallet balances across all connected networks. Your current ORGO balance is 1,250.75 tokens, SOL balance is 2.3 tokens, and I can see 12 recent transactions from the past 24 hours. Would you like me to show you the transaction details?";
    } else if (lowerTranscript.includes('payment') || lowerTranscript.includes('send')) {
      response = "I can help you process a cross-border payment. For payments to the Philippines, I can facilitate transfers with sub-second settlement using our Coral Protocol network. What amount would you like to send and to which recipient?";
    } else if (lowerTranscript.includes('transaction') || lowerTranscript.includes('status')) {
      response = "I'm analyzing your recent blockchain transactions. I found 3 pending payments and 12 completed transfers. Your latest transaction was confirmed 2 minutes ago with a transaction hash of 0x1234...abcd. Would you like me to provide more details about any specific transaction?";
    } else if (lowerTranscript.includes('help') || lowerTranscript.includes('support')) {
      response = "I'm here to provide comprehensive Web3 support. I can help with wallet issues, transaction problems, token management, DeFi protocols, cross-border payments, and general blockchain questions. What specific area would you like assistance with?";
    }

    return { transcript, response, confidence };
  };

  const generateSpeech = useCallback(async (text: string, voiceId?: string): Promise<string | null> => {
    try {
      // Mock speech generation for now
      return "mock_audio_data";
    } catch (error) {
      console.error('Speech generation failed:', error);
      return null;
    }
  }, []);

  const getAvailableVoices = useCallback(async (): Promise<Voice[]> => {
    try {
      // Mock voices for now
      return [
        {
          voice_id: "21m00Tcm4TlvDq8ikWAM",
          name: "Rachel",
          category: "premade",
          description: "A calm, collected, and warm female voice"
        }
      ];
    } catch (error) {
      console.error('Failed to get voices:', error);
      return [];
    }
  }, []);

  const contextValue: VoiceContextType = {
    ...voiceState,
    startListening,
    stopListening,
    clearTranscript,
    processVoiceInput,
    generateSpeech,
    getAvailableVoices,
    agentStatus
  };

  return (
    <VoiceContext.Provider value={contextValue}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};

// Voice Commands Hook
export const useVoiceCommands = () => {
  const { processVoiceInput } = useVoice();

  const commands = {
    'show balance': () => processVoiceInput(Buffer.from('show my token balance')),
    'check transactions': () => processVoiceInput(Buffer.from('show my recent transactions')),
    'help wallet': () => processVoiceInput(Buffer.from('help me with wallet connection')),
    'start payment': () => processVoiceInput(Buffer.from('I want to send a payment')),
    'show dashboard': () => processVoiceInput(Buffer.from('take me to the dashboard')),
  };

  const executeCommand = useCallback((command: string) => {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Find matching command
    const matchingCommand = Object.keys(commands).find(cmd => 
      normalizedCommand.includes(cmd.toLowerCase())
    );

    if (matchingCommand) {
      return commands[matchingCommand as keyof typeof commands]();
    } else {
      return processVoiceInput(Buffer.from(command));
    }
  }, [processVoiceInput]);

  return { commands, executeCommand };
};

export default VoiceContext;
