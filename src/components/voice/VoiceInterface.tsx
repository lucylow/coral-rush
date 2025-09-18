import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Volume2, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'agent', message: string, timestamp: Date}>>([]);
  
  const audioVisualizerRef = useRef<HTMLDivElement>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const [audioLevel, setAudioLevel] = useState(0);

  const handleVoiceToggle = async () => {
    if (!isListening) {
      await startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Set up audio analysis for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start audio level monitoring
      monitorAudioLevel();

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = handleRecordingStop;
      mediaRecorderRef.current.start(100);
      
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // Fallback to demo mode
      simulateDemoInteraction();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      setAudioLevel(0);
      setIsListening(false);
    }
  };

  const handleRecordingStop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    processVoiceInput(audioBlob);
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(average / 255);

    if (isListening) {
      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    // Simulate processing or integrate with ElevenLabs
    simulateDemoInteraction();
  };

  const simulateDemoInteraction = () => {
    // Enhanced demo interaction
    setTimeout(() => {
      const userMessage = "My NFT mint transaction failed and I lost 0.5 ETH. Can you help me get my money back?";
      setTranscript(userMessage);
      setConversationHistory(prev => [...prev, {
        role: 'user',
        message: userMessage,
        timestamp: new Date()
      }]);
      
      setTimeout(() => {
        const agentResponse = "I understand your frustration. I've analyzed your failed transaction and found the issue. I'm processing a compensation NFT and initiating a refund to your wallet right now.";
        setConversationHistory(prev => [...prev, {
          role: 'agent',
          message: agentResponse,
          timestamp: new Date()
        }]);
      }, 5000);
    }, 2000);
  };

  const handlePlayResponse = () => {
    setIsPlaying(!isPlaying);
    // Simulate audio playback
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  // Audio visualizer animation
  useEffect(() => {
    if (isListening && audioVisualizerRef.current) {
      const bars = audioVisualizerRef.current.children;
      const interval = setInterval(() => {
        Array.from(bars).forEach((bar) => {
          const height = Math.random() * 40 + 10;
          (bar as HTMLElement).style.height = `${height}px`;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <div className="space-y-4 h-full">
      {/* Voice Control Card */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Volume2 className="h-5 w-5" />
            Voice Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {/* Audio level visualization rings */}
              {isListening && (
                <>
                  <div 
                    className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"
                    style={{
                      transform: `scale(${1 + audioLevel * 0.5})`,
                      animationDuration: '1s'
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"
                    style={{
                      transform: `scale(${1 + audioLevel * 0.3})`,
                      animationDuration: '2s'
                    }}
                  />
                </>
              )}
              
              <Button
                size="lg"
                className={cn(
                  "w-20 h-20 rounded-full transition-all duration-300 relative z-10",
                  isListening 
                    ? "voice-button-recording" 
                    : "voice-button-idle"
                )}
                onClick={handleVoiceToggle}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            </div>
            
            <Badge 
              variant={isListening ? "destructive" : "secondary"}
              className={cn(
                "animate-pulse",
                isListening ? "bg-red-600" : "bg-gray-700"
              )}
            >
              {isListening ? "🎤 Listening..." : "Push to Talk"}
            </Badge>

            {/* Enhanced Audio Visualizer */}
            <div className="space-y-2 w-full">
              {isListening && (
                <>
                  <p className="text-xs text-center text-gray-400">Audio Level</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-100"
                      style={{ width: `${audioLevel * 100}%` }}
                    />
                  </div>
                </>
              )}
              
              <div 
                ref={audioVisualizerRef}
                className="flex items-end justify-center space-x-1 h-16 w-full"
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "audio-bar w-1 transition-all duration-75",
                      isListening ? "animate-pulse" : "h-2"
                    )}
                    style={{ 
                      animationDelay: `${i * 25}ms`,
                      height: isListening ? `${8 + (audioLevel * 30)}px` : '8px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Current Transcript */}
          <div>
            <h4 className="font-medium mb-2 text-white">Current Input</h4>
            <div className="min-h-[60px] p-3 bg-gray-800/50 rounded-md border border-gray-700">
              <p className="text-sm text-gray-300">
                {transcript || "Your voice input will appear here..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation History */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm flex-1">
        <CardHeader>
          <CardTitle className="text-white">Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {conversationHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Start a conversation to see the history...
                </div>
              ) : (
                conversationHistory.map((entry, index) => (
                  <div key={index} className={cn(
                    "p-3 rounded-lg",
                    entry.role === 'user' 
                      ? "bg-blue-900/30 border border-blue-700/50 ml-4" 
                      : "bg-gray-800/50 border border-gray-600/50 mr-4"
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={entry.role === 'user' ? "default" : "secondary"}>
                        {entry.role === 'user' ? 'You' : 'Support Agent'}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">{entry.message}</p>
                    {entry.role === 'agent' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={handlePlayResponse}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Playing...
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Play Audio
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceInterface;