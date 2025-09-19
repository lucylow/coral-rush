# Voice Support Interface - Main Voice Page

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MicrophoneIcon,
  StopIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useVoice } from '../../contexts/VoiceContext';
import { useAppState } from '../../contexts/AppStateContext';
import VoiceWaveform from '../../components/voice/VoiceWaveform';
import AgentActivity from '../../components/voice/AgentActivity';
import BlockchainResults from '../../components/voice/BlockchainResults';
import SupportChat from '../../components/voice/SupportChat';

const VoiceInterface: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'idle' | 'listening' | 'processing' | 'responding' | 'completed'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [agentResponse, setAgentResponse] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  
  const { 
    isListening, 
    transcript: voiceTranscript, 
    startListening, 
    stopListening,
    isProcessing 
  } = useVoice();
  
  const { agents, supportSession } = useAppState();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (voiceTranscript) {
      setTranscript(voiceTranscript);
    }
  }, [voiceTranscript]);

  useEffect(() => {
    if (isListening) {
      setCurrentStep('listening');
    } else if (isProcessing) {
      setCurrentStep('processing');
    } else if (transcript && !isProcessing && !isListening) {
      setCurrentStep('responding');
    }
  }, [isListening, isProcessing, transcript]);

  const handleStartListening = () => {
    setCurrentStep('listening');
    setTranscript('');
    setAgentResponse('');
    setShowResults(false);
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
    if (transcript) {
      setCurrentStep('processing');
      // Simulate processing
      setTimeout(() => {
        setCurrentStep('responding');
        setAgentResponse('I understand you need help with your wallet connection. Let me check your account status and guide you through the process.');
        setShowResults(true);
        setTimeout(() => {
          setCurrentStep('completed');
        }, 3000);
      }, 2000);
    }
  };

  const steps = [
    { id: 'idle', label: 'Ready', description: 'Click to start voice support' },
    { id: 'listening', label: 'Listening', description: 'Speak your question clearly' },
    { id: 'processing', label: 'Processing', description: 'AI agents analyzing your request' },
    { id: 'responding', label: 'Responding', description: 'Generating personalized solution' },
    { id: 'completed', label: 'Completed', description: 'Support session finished' }
  ];

  return (
    <div className="h-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Voice Support Interface</h1>
        <p className="text-slate-400">Speak naturally and let our AI agents solve your Web3 problems</p>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Voice Interface Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Voice Control */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="text-center">
              {/* Voice Button */}
              <div className="relative mb-6">
                <button
                  onClick={isListening ? handleStopListening : handleStartListening}
                  disabled={isProcessing}
                  className={`relative group mx-auto flex items-center justify-center w-32 h-32 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/25' 
                      : currentStep === 'processing'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/25'
                      : currentStep === 'responding'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25'
                      : currentStep === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/25'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/25'
                  }`}
                >
                  {isListening ? (
                    <StopIcon className="w-12 h-12 text-white" />
                  ) : currentStep === 'processing' ? (
                    <SparklesIcon className="w-12 h-12 text-white animate-spin" />
                  ) : currentStep === 'responding' ? (
                    <SpeakerWaveIcon className="w-12 h-12 text-white animate-pulse" />
                  ) : currentStep === 'completed' ? (
                    <CheckCircleIcon className="w-12 h-12 text-white" />
                  ) : (
                    <MicrophoneIcon className="w-12 h-12 text-white" />
                  )}
                  
                  {(isListening || isProcessing) && (
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                  )}
                </button>
                
                {/* Voice Waveform */}
                {isListening && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <VoiceWaveform className="w-24 h-6 text-purple-400" />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {steps.find(s => s.id === currentStep)?.label}
                </h3>
                <p className="text-slate-400">
                  {steps.find(s => s.id === currentStep)?.description}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-center space-x-2 mb-6">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      steps.findIndex(s => s.id === currentStep) >= index
                        ? 'bg-purple-500'
                        : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Transcript Display */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 min-h-[200px]">
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="w-5 h-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Live Transcript</h3>
            </div>
            
            <div className="space-y-4">
              {transcript && (
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">You</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed">{transcript}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {agentResponse && (
                <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <SparklesIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-100 text-sm leading-relaxed">{agentResponse}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {!transcript && !agentResponse && (
                <div className="text-center py-8">
                  <MicrophoneIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">Your conversation will appear here...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agent Activity Theater */}
        <div className="lg:col-span-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full">
            <div className="flex items-center mb-6">
              <SparklesIcon className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Agent Activity</h3>
            </div>
            
            <AgentActivity 
              agents={agents} 
              currentStep={currentStep}
              transcript={transcript}
            />
          </div>
        </div>

        {/* Blockchain Results Panel */}
        <div className="lg:col-span-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full">
            <div className="flex items-center mb-6">
              <CheckCircleIcon className="w-5 h-5 text-emerald-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Results & Actions</h3>
            </div>
            
            <BlockchainResults 
              showResults={showResults}
              session={supportSession}
            />
          </div>
        </div>
      </div>

      {/* Support Chat */}
      <div className="mt-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <SupportChat 
            ref={chatRef}
            transcript={transcript}
            agentResponse={agentResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
```