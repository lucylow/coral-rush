# Voice Context Provider

```tsx
import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

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
  processVoiceInput: (input: string) => Promise<string>;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null,
    isSupported: typeof window !== 'undefined' && 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    recognition.onresult = (event: any) => {
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

    recognition.onerror = (event: any) => {
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

  const processVoiceInput = useCallback(async (input: string): Promise<string> => {
    setVoiceState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response based on input
      let response = "I understand your request. Let me help you with that.";
      
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('wallet') || lowerInput.includes('connect')) {
        response = "I can see you're having wallet connection issues. Let me check your account status and guide you through the connection process. Please ensure your wallet is unlocked and try connecting again.";
      } else if (lowerInput.includes('balance') || lowerInput.includes('token')) {
        response = "I'll check your token balances across all connected wallets. Your current ORGO balance is 1,250.75 tokens, and I can see recent transactions from the past 24 hours.";
      } else if (lowerInput.includes('transaction') || lowerInput.includes('payment')) {
        response = "I'm analyzing your recent transactions. I found 3 pending payments and 12 completed transfers. Would you like me to provide details about any specific transaction?";
      } else if (lowerInput.includes('help') || lowerInput.includes('support')) {
        response = "I'm here to provide comprehensive Web3 support. I can help with wallet issues, transaction problems, token management, DeFi protocols, and general blockchain questions. What specific area would you like assistance with?";
      }

      return response;
    } catch (error) {
      throw new Error('Failed to process voice input');
    } finally {
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
    }
  }, []);

  const contextValue: VoiceContextType = {
    ...voiceState,
    startListening,
    stopListening,
    clearTranscript,
    processVoiceInput
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
    'show balance': () => processVoiceInput('show my token balance'),
    'check transactions': () => processVoiceInput('show my recent transactions'),
    'help wallet': () => processVoiceInput('help me with wallet connection'),
    'start payment': () => processVoiceInput('I want to send a payment'),
    'show dashboard': () => processVoiceInput('take me to the dashboard'),
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
      return processVoiceInput(command);
    }
  }, [processVoiceInput]);

  return { commands, executeCommand };
};

export default VoiceContext;
```

// Add this to handle browser compatibility
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
```