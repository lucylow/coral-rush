import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Volume2, Wallet, Activity, Brain, Headphones, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentLog {
  id: string;
  agent: 'listener' | 'brain' | 'executor';
  message: string;
  timestamp: Date;
  status: 'processing' | 'complete' | 'error';
}

interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  isNew?: boolean;
}

const VoiceAgentTheater = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [connectedWallet, setConnectedWallet] = useState("0x742...6634");
  const [walletBalance, setWalletBalance] = useState("2.456 ETH");
  const [userNFTs, setUserNFTs] = useState<NFT[]>([
    { id: "1", name: "Bored Ape #1234", image: "/placeholder.svg", collection: "BAYC" },
    { id: "2", name: "Punk #5678", image: "/placeholder.svg", collection: "CryptoPunks" },
    { id: "3", name: "Support Ticket #9999", image: "/placeholder.svg", collection: "OrgoRush", isNew: true }
  ]);

  const audioVisualizerRef = useRef<HTMLDivElement>(null);

  const agentConfig = {
    listener: { color: "border-l-blue-500", bg: "bg-blue-50", icon: Headphones, name: "Listener Agent" },
    brain: { color: "border-l-purple-500", bg: "bg-purple-50", icon: Brain, name: "Brain Agent" },
    executor: { color: "border-l-green-500", bg: "bg-green-50", icon: Zap, name: "Executor Agent" }
  };

  const addAgentLog = (agent: 'listener' | 'brain' | 'executor', message: string, status: 'processing' | 'complete' | 'error' = 'processing') => {
    const newLog: AgentLog = {
      id: Date.now().toString(),
      agent,
      message,
      timestamp: new Date(),
      status
    };
    setAgentLogs(prev => [newLog, ...prev]);
    
    // Auto-complete after 2 seconds for demo
    if (status === 'processing') {
      setTimeout(() => {
        setAgentLogs(prev => prev.map(log => 
          log.id === newLog.id ? { ...log, status: 'complete' } : log
        ));
      }, 2000);
    }
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      setIsListening(true);
      setIsProcessing(true);
      
      // Simulate voice processing workflow
      setTimeout(() => {
        addAgentLog('listener', 'Transcribing voice input with ElevenLabs...');
        setTranscript("User: My NFT mint transaction failed and I lost 0.5 ETH. Can you help me?");
      }, 500);

      setTimeout(() => {
        addAgentLog('brain', 'Analyzing user intent and emotional state with Mistral AI...');
      }, 1500);

      setTimeout(() => {
        addAgentLog('brain', 'Intent: Failed transaction support. Emotion: Frustrated. Recommended action: Investigate and compensate.', 'complete');
      }, 3000);

      setTimeout(() => {
        addAgentLog('executor', 'Checking transaction hash on blockchain via Crossmint...');
      }, 3500);

      setTimeout(() => {
        addAgentLog('executor', 'Transaction found: 0x7f2d...af83. Status: Failed. Gas used: 21,000. Initiating compensation...', 'complete');
      }, 5000);

      setTimeout(() => {
        addAgentLog('executor', 'Minting apology NFT to user wallet... ✅ Success!', 'complete');
        setUserNFTs(prev => [...prev, {
          id: Date.now().toString(),
          name: "Apology NFT #001",
          image: "/placeholder.svg",
          collection: "OrgoRush Support",
          isNew: true
        }]);
      }, 6000);

      setTimeout(() => {
        setIsListening(false);
        setIsProcessing(false);
        setTranscript(prev => prev + "\n\nSupport Agent: I'm sorry about your failed transaction. I've investigated the issue and found your transaction did fail due to network congestion. As compensation, I've minted an exclusive apology NFT to your wallet and initiated a 0.5 ETH refund. Is there anything else I can help you with?");
      }, 7000);
    } else {
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  // Audio visualizer animation
  useEffect(() => {
    if (isListening && audioVisualizerRef.current) {
      const bars = audioVisualizerRef.current.children;
      const interval = setInterval(() => {
        Array.from(bars).forEach((bar, index) => {
          const height = Math.random() * 40 + 10;
          (bar as HTMLElement).style.height = `${height}px`;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        
        {/* Left Sidebar - Voice Interaction */}
        <div className="lg:col-span-3 space-y-6">
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
                  variant={isListening ? "destructive" : "default"}
                  className={cn(
                    "w-20 h-20 rounded-full transition-all duration-300",
                    isListening && "animate-pulse"
                  )}
                  onClick={handleVoiceToggle}
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                
                <Badge variant={isListening ? "destructive" : "secondary"}>
                  {isListening ? "Listening..." : "Push to Talk"}
                </Badge>

                {/* Audio Visualizer */}
                <div 
                  ref={audioVisualizerRef}
                  className="flex items-end justify-center space-x-1 h-12"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 bg-primary transition-all duration-100 rounded-full",
                        isListening ? "animate-pulse" : "h-2"
                      )}
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Live Transcript</h4>
                <ScrollArea className="h-40 w-full border rounded-md p-3">
                  <div className="text-sm whitespace-pre-wrap">
                    {transcript || "Conversation will appear here..."}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Stage - Agent Activity Log */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Agent Orchestra
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time multi-agent workflow visualization
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {agentLogs.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Start a voice conversation to see agent activity...
                    </div>
                  ) : (
                    agentLogs.map((log) => {
                      const config = agentConfig[log.agent];
                      const Icon = config.icon;
                      
                      return (
                        <Card key={log.id} className={cn("border-l-4", config.color, config.bg)}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                <Badge variant="outline" className="text-xs">
                                  {config.name}
                                </Badge>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm">{log.message}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {log.timestamp.toLocaleTimeString()}
                                  </span>
                                  <Badge 
                                    variant={
                                      log.status === 'complete' ? 'default' :
                                      log.status === 'error' ? 'destructive' : 'secondary'
                                    }
                                    className="text-xs"
                                  >
                                    {log.status === 'processing' && isProcessing && (
                                      <div className="animate-spin h-2 w-2 border border-current border-t-transparent rounded-full mr-1" />
                                    )}
                                    {log.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Blockchain & Wallet */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Connected Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-mono text-sm">{connectedWallet}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="font-semibold">{walletBalance}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Disconnect Wallet
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your NFTs</CardTitle>
              <p className="text-sm text-muted-foreground">
                Collection overview with live updates
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-60">
                <div className="space-y-3">
                  {userNFTs.map((nft) => (
                    <Card key={nft.id} className={cn(
                      "relative transition-all duration-300",
                      nft.isNew && "ring-2 ring-primary animate-pulse"
                    )}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-xs">NFT</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{nft.name}</p>
                            <p className="text-xs text-muted-foreground">{nft.collection}</p>
                          </div>
                          {nft.isNew && (
                            <Badge variant="default" className="text-xs">NEW</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentTheater;