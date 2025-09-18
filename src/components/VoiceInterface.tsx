import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
  onTranscriptChange?: (transcript: string) => void;
  onAnalysisChange?: (analysis: any) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  onSpeakingChange, 
  onTranscriptChange,
  onAnalysisChange 
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [conversation, setConversation] = useState<string[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      onSpeakingChange?.(true);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      onSpeakingChange?.(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Step 1: Convert speech to text
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const { data: speechData, error: speechError } = await supabase.functions.invoke('voice-to-text', {
        body: formData
      });
      
      if (speechError) throw speechError;
      
      const userTranscript = speechData.transcript;
      setTranscript(userTranscript);
      onTranscriptChange?.(userTranscript);
      
      // Step 2: Analyze with Mistral AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('mistral-analysis', {
        body: { 
          text: userTranscript,
          context: 'Web3 support conversation'
        }
      });
      
      if (analysisError) throw analysisError;
      
      setAnalysis(analysisData.analysis);
      onAnalysisChange?.(analysisData.analysis);
      
      // Step 3: Generate AI response with voice
      const { data: assistantData, error: assistantError } = await supabase.functions.invoke('ai-assistant', {
        body: { 
          message: userTranscript,
          context: `Previous analysis: ${JSON.stringify(analysisData.analysis)}`,
          use_voice_response: true
        }
      });
      
      if (assistantError) throw assistantError;
      
      // Update conversation
      setConversation(prev => [
        ...prev,
        `User: ${userTranscript}`,
        `Assistant: ${assistantData.response}`
      ]);
      
      // Play audio response if available
      if (assistantData.audio) {
        const audioData = `data:audio/mpeg;base64,${assistantData.audio}`;
        const audio = new Audio(audioData);
        audio.play().catch(console.error);
      }
      
      toast({
        title: "Voice Processing Complete",
        description: `Used ${assistantData.api_used} for analysis`,
      });
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: error.message || "Failed to process voice input",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateDemoInteraction = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const demoTranscript = "My NFT transaction failed and I lost 0.5 ETH. Can you help me?";
      setTranscript(demoTranscript);
      onTranscriptChange?.(demoTranscript);
      
      const demoAnalysis = {
        intent: "transaction_problem",
        emotion: "frustrated",
        urgency: "high",
        technical_area: "NFT",
        recommended_action: "investigate_transaction",
        confidence_score: 0.95
      };
      setAnalysis(demoAnalysis);
      onAnalysisChange?.(demoAnalysis);
      
      setConversation(prev => [
        ...prev,
        `User: ${demoTranscript}`,
        "Assistant: I understand your frustration with the failed NFT transaction. Let me investigate this immediately and help you recover your ETH."
      ]);
      
      setIsProcessing(false);
      
      toast({
        title: "Demo Mode Active",
        description: "Simulated voice processing complete",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Voice Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={cn(
                "w-20 h-20 rounded-full transition-all duration-300",
                isRecording && "animate-pulse",
                isProcessing && "opacity-50"
              )}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            
            <Badge variant={isRecording ? "destructive" : isProcessing ? "secondary" : "outline"}>
              {isProcessing ? "Processing..." : isRecording ? "Listening..." : "Push to Talk"}
            </Badge>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={simulateDemoInteraction}
              disabled={isProcessing || isRecording}
            >
              Demo Mode
            </Button>
          </div>

          {transcript && (
            <div>
              <h4 className="font-medium mb-2">Latest Transcript</h4>
              <div className="p-3 border rounded-md bg-muted">
                <p className="text-sm">{transcript}</p>
              </div>
            </div>
          )}

          {analysis && (
            <div>
              <h4 className="font-medium mb-2">AI Analysis</h4>
              <div className="p-3 border rounded-md bg-muted space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Intent: {analysis.intent}</Badge>
                  <Badge variant="outline">Emotion: {analysis.emotion}</Badge>
                  <Badge variant="outline">Urgency: {analysis.urgency}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Recommended: {analysis.recommended_action}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {conversation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {conversation.map((message, index) => (
                  <div key={index} className={cn(
                    "p-2 rounded text-sm",
                    message.startsWith('User:') ? "bg-blue-50 text-blue-900" : "bg-green-50 text-green-900"
                  )}>
                    {message}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceInterface;