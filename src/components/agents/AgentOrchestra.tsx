import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Headphones, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentLog {
  id: string;
  agent: 'listener' | 'brain' | 'executor';
  message: string;
  timestamp: Date;
  status: 'processing' | 'complete' | 'error';
  details?: string;
}

const AgentOrchestra = () => {
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const agentConfig = {
    listener: { 
      color: "border-l-blue-500", 
      bg: "bg-blue-900/20", 
      icon: Headphones, 
      name: "Listener Agent",
      tech: "ElevenLabs"
    },
    brain: { 
      color: "border-l-orange-500", 
      bg: "bg-orange-900/20", 
      icon: Brain, 
      name: "Brain Agent",
      tech: "Mistral AI"
    },
    executor: { 
      color: "border-l-green-500", 
      bg: "bg-green-900/20", 
      icon: Zap, 
      name: "Executor Agent",
      tech: "Crossmint"
    }
  };

  const addAgentLog = (
    agent: 'listener' | 'brain' | 'executor', 
    message: string, 
    status: 'processing' | 'complete' | 'error' = 'processing',
    details?: string
  ) => {
    const newLog: AgentLog = {
      id: Date.now().toString() + Math.random(),
      agent,
      message,
      timestamp: new Date(),
      status,
      details
    };
    setAgentLogs(prev => [newLog, ...prev]);
    
    // Auto-complete after delay for demo
    if (status === 'processing') {
      setTimeout(() => {
        setAgentLogs(prev => prev.map(log => 
          log.id === newLog.id ? { ...log, status: 'complete' } : log
        ));
      }, 2000 + Math.random() * 1000);
    }
  };

  const simulateAgentWorkflow = () => {
    setIsProcessing(true);
    setAgentLogs([]); // Clear previous logs
    
    // Listener Agent workflow
    setTimeout(() => {
      addAgentLog('listener', 'Receiving voice input from user...', 'processing');
    }, 500);

    setTimeout(() => {
      addAgentLog('listener', 'Converting speech to text using ElevenLabs API...', 'processing', 
        'Audio quality: 95%\nLanguage detected: English\nConfidence: 0.94\nDuration: 8.2s');
    }, 1500);

    setTimeout(() => {
      addAgentLog('listener', 'Speech transcription completed successfully', 'complete',
        'Transcript: "My NFT mint transaction failed and I lost 0.5 ETH. Can you help me get my money back?"');
    }, 3000);

    // Brain Agent workflow
    setTimeout(() => {
      addAgentLog('brain', 'Analyzing user intent and emotional state...', 'processing',
        'Intent: Transaction support\nEmotion: Frustrated (0.82)\nComplexity: Medium\nPriority: High\nKeywords: NFT, failed, transaction, refund');
    }, 3500);

    setTimeout(() => {
      addAgentLog('brain', 'Generating solution strategy using Mistral AI...', 'processing',
        'Model: Mistral-7B-Instruct\nTokens: 1,247\nConfidence: 0.94\nProcessing time: 1.2s');
    }, 5000);

    setTimeout(() => {
      addAgentLog('brain', 'Solution identified: Failed transaction compensation', 'complete',
        'Action Plan:\n1. Verify transaction status on-chain\n2. Analyze gas usage and failure reason\n3. Generate compensation NFT\n4. Process automated refund\n5. Provide clear explanation to user');
    }, 6500);

    // Executor Agent workflow
    setTimeout(() => {
      addAgentLog('executor', 'Connecting to blockchain via Crossmint API...', 'processing',
        'Network: Ethereum Mainnet\nRPC Endpoint: Responsive\nGas Price: 23 gwei');
    }, 7000);

    setTimeout(() => {
      addAgentLog('executor', 'Verifying transaction hash: 0x7f2d...af83', 'processing',
        'Block: 18,542,391\nGas Used: 21,000 / 50,000\nStatus: Failed\nReason: Insufficient gas limit\nActual Cost: 0 ETH (reverted)');
    }, 8500);

    setTimeout(() => {
      addAgentLog('executor', 'Minting compensation NFT to user wallet...', 'processing',
        'Collection: Support Resolution NFTs\nRecipient: 0x742d...35f8\nMetadata: Generated\nEstimated Gas: 84,523');
    }, 10000);

    setTimeout(() => {
      addAgentLog('executor', 'Transaction completed successfully!', 'complete',
        'NFT Minted: Support Resolution #12847\nTx Hash: 0x9a1b...c3d4\nGas Used: 84,523\nTotal Cost: 0.0019 ETH\nCompensation: Processed');
      
      // Trigger NFT minting event for blockchain panel
      const compensationNFT = {
        mintAddress: 'Comp' + Math.random().toString(36).substring(2, 10),
        name: 'Support Resolution NFT #12847',
        image: '/placeholder-nft.png',
        description: 'Compensation for failed transaction. Thank you for your patience.',
        isNew: true
      };
      
      window.dispatchEvent(new CustomEvent('agent-nft-mint', { detail: compensationNFT }));
      
      setIsProcessing(false);
    }, 12000);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5" />
              Agent Orchestra - Live Coordination
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={simulateAgentWorkflow}
              disabled={isProcessing}
              className="border-gray-600"
            >
              {isProcessing ? "Processing..." : "Start Demo"}
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Watch multi-agent AI coordination in real-time
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Agent Status Bar */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(agentConfig).map(([key, config]) => {
              const recentLog = agentLogs.find(log => log.agent === key);
              const isActive = recentLog?.status === 'processing';
              
              return (
                <div key={key} className={cn(
                  "p-3 rounded-lg border transition-all duration-300",
                  config.bg,
                  isActive ? "ring-2 ring-opacity-50" : "",
                  key === 'listener' && isActive && "ring-blue-500",
                  key === 'brain' && isActive && "ring-orange-500", 
                  key === 'executor' && isActive && "ring-green-500"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <config.icon className={cn(
                      "h-4 w-4",
                      isActive && "animate-pulse"
                    )} />
                    <span className="font-medium text-sm text-white">{config.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {config.tech}
                  </Badge>
                  <div className="mt-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isActive ? "bg-yellow-400 animate-pulse" : 
                      recentLog?.status === 'complete' ? "bg-green-400" :
                      recentLog?.status === 'error' ? "bg-red-400" : "bg-gray-600"
                    )} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Activity Log */}
          <div className="px-6 pb-6 flex-1">
            <ScrollArea className="h-full">
              <div className="space-y-3">
              {agentLogs.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Start Demo" to watch agents coordinate</p>
                </div>
              ) : (
                agentLogs.map((log) => {
                  const config = agentConfig[log.agent];
                  const Icon = config.icon;
                  const isExpanded = expandedLog === log.id;
                  
                  return (
                    <Card key={log.id} className={cn(
                      "border-l-4 transition-all duration-300",
                      config.color,
                      config.bg,
                      "border-gray-600"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className={cn(
                              "h-4 w-4 flex-shrink-0",
                              log.status === 'processing' && "animate-pulse"
                            )} />
                            <Badge variant="outline" className="text-xs">
                              {config.name}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{log.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400">
                                {log.timestamp.toLocaleTimeString()}
                              </span>
                              <Badge 
                                variant={
                                  log.status === 'complete' ? 'default' :
                                  log.status === 'error' ? 'destructive' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {log.status === 'processing' && (
                                  <div className="animate-spin h-2 w-2 border border-current border-t-transparent rounded-full mr-1" />
                                )}
                                {log.status}
                              </Badge>
                              {log.details && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                                >
                                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  Details
                                </Button>
                              )}
                            </div>
                            {isExpanded && log.details && (
                              <div className="mt-3 p-3 bg-gray-800/50 rounded-md border border-gray-600">
                                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                                  {log.details}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentOrchestra;