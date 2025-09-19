import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Mic, Brain, Zap, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentStep {
  agent: 'listener' | 'brain' | 'executor';
  status: 'idle' | 'processing' | 'success' | 'error';
  message: string;
  timestamp: string;
}

interface Session {
  id: string;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  steps: AgentStep[];
  result?: any;
}

const CoralOrchestrator = () => {
  const [session, setSession] = useState<Session>({
    id: '',
    status: 'idle',
    steps: [],
  });
  const [progress, setProgress] = useState(0);

  const agents = [
    {
      id: 'listener',
      name: 'Voice Listener Agent',
      description: 'ElevenLabs STT/TTS Processing',
      icon: Mic,
      color: 'bg-blue-500',
      capabilities: ['speech-to-text', 'text-to-speech', 'voice-synthesis']
    },
    {
      id: 'brain',
      name: 'Intent Analysis Brain',
      description: 'Mistral AI Intent Processing',
      icon: Brain,
      color: 'bg-purple-500',  
      capabilities: ['intent-analysis', 'problem-solving', 'natural-language-understanding']
    },
    {
      id: 'executor',
      name: 'Blockchain Executor',
      description: 'Crossmint NFT Operations',
      icon: Zap,
      color: 'bg-green-500',
      capabilities: ['nft-minting', 'transaction-checking', 'wallet-operations']
    }
  ];

  const startOrchestration = async () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setSession({
      id: sessionId,
      status: 'processing',
      steps: []
    });
    setProgress(0);

    // Simulate multi-agent workflow
    await simulateAgentFlow(sessionId);
  };

  const simulateAgentFlow = async (sessionId: string) => {
    const steps = [
      {
        agent: 'listener' as const,
        message: 'Processing audio with ElevenLabs STT...',
        delay: 2000
      },
      {
        agent: 'listener' as const,
        message: 'Transcription: "My NFT transaction failed and I lost 0.5 ETH"',
        delay: 1000
      },
      {
        agent: 'brain' as const,
        message: 'Analyzing intent with Mistral AI...',
        delay: 2500
      },
      {
        agent: 'brain' as const,
        message: 'Intent: failed_transaction (95% confidence)',
        delay: 1000
      },
      {
        agent: 'executor' as const,
        message: 'Executing check_transaction_and_compensate via Crossmint...',
        delay: 3000
      },
      {
        agent: 'executor' as const,
        message: 'Action completed: Compensation NFT minted successfully',
        delay: 1000
      },
      {
        agent: 'listener' as const,
        message: 'Generating voice response...',
        delay: 2000
      },
      {
        agent: 'listener' as const,
        message: 'Voice response generated - Session completed',
        delay: 1000
      }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Add processing step
      setSession(prev => ({
        ...prev,
        steps: [...prev.steps, {
          agent: step.agent,
          status: 'processing',
          message: step.message,
          timestamp: new Date().toISOString()
        }]
      }));

      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      // Update to success
      setSession(prev => ({
        ...prev,
        steps: prev.steps.map((s, idx) => 
          idx === prev.steps.length - 1 
            ? { ...s, status: 'success' }
            : s
        )
      }));

      setProgress(((i + 1) / steps.length) * 100);
    }

    // Complete session
    setSession(prev => ({
      ...prev,
      status: 'completed',
      result: {
        nftMinted: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        audioResponse: 'I understand your frustration. I\'ve processed a compensation NFT and initiated a refund to your wallet.'
      }
    }));
  };

  const getAgentStatus = (agentId: string) => {
    const lastStep = [...session.steps].reverse().find(step => step.agent === agentId);
    return lastStep?.status || 'idle';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Orchestrator Header */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            🌊 Coral Protocol Multi-Agent Orchestrator
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
              Session: {session.id || 'None'}
            </Badge>
            <Badge variant={session.status === 'processing' ? 'destructive' : 'secondary'}>
              Status: {session.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Button 
              onClick={startOrchestration}
              disabled={session.status === 'processing'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {session.status === 'processing' ? 'Processing...' : 'Start Demo Orchestration'}
            </Button>
            
            {session.status === 'processing' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Progress:</span>
                <Progress value={progress} className="w-32" />
                <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const status = getAgentStatus(agent.id);
          const Icon = agent.icon;
          
          return (
            <Card key={agent.id} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", agent.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm text-white">{agent.name}</CardTitle>
                    <p className="text-xs text-gray-400">{agent.description}</p>
                  </div>
                  <div className={cn("flex items-center gap-1", getStatusColor(status))}>
                    {getStatusIcon(status)}
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(status))}>
                      {status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {agent.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-xs text-gray-300">{capability}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Execution Log */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Agent Coordination Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {session.steps.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Start orchestration to see agent coordination...
                </div>
              ) : (
                session.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded border border-gray-700/50">
                    <div className={cn("p-2 rounded", 
                      step.agent === 'listener' ? 'bg-blue-500/20' :
                      step.agent === 'brain' ? 'bg-purple-500/20' : 'bg-green-500/20'
                    )}>
                      {step.agent === 'listener' && <Mic className="h-4 w-4" />}
                      {step.agent === 'brain' && <Brain className="h-4 w-4" />}
                      {step.agent === 'executor' && <Zap className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {step.agent.toUpperCase()}
                        </Badge>
                        <div className={cn("flex items-center gap-1", getStatusColor(step.status))}>
                          {getStatusIcon(step.status)}
                          <span className="text-xs">{step.status}</span>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-200">{step.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Results Display */}
      {session.result && (
        <Card className="bg-green-900/20 border-green-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-green-400">Orchestration Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">NFT Minted</label>
                <p className="text-green-400">{session.result.nftMinted ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Transaction Hash</label>
                <p className="text-gray-200 font-mono text-xs break-all">{session.result.transactionHash}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">AI Response</label>
              <p className="text-gray-200 text-sm">{session.result.audioResponse}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoralOrchestrator;