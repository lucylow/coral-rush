import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  MicOff, 
  Play, 
  Zap, 
  Coins, 
  Vote, 
  Wallet, 
  ExternalLink,
  CheckCircle,
  Clock,
  Sparkles,
  Activity
} from 'lucide-react';
import { coralApi } from '@/utils/coralApi';
import { cn } from '@/lib/utils';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  data?: any;
  processingTime?: number;
}

interface AgentActivity {
  name: string;
  status: string;
  result: string;
  processingTime: number;
  details?: any;
}

const CoralHackathonDemo = () => {
  const [demoSteps, setDemoSteps] = useState<DemoStep[]>([
    {
      id: 'voice-command',
      title: 'Voice Command Processing',
      description: 'AI-powered voice recognition and intent detection',
      status: 'pending'
    },
    {
      id: 'multi-agent',
      title: 'Multi-Agent Orchestration',
      description: 'Coordinated AI agents analyzing the request',
      status: 'pending'
    },
    {
      id: 'solana-execution',
      title: 'Solana Integration',
      description: 'Blockchain transaction execution and NFT minting',
      status: 'pending'
    },
    {
      id: 'dao-governance',
      title: 'DAO Governance Integration',
      description: 'Community voting and treasury management',
      status: 'pending'
    }
  ]);

  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [demoResults, setDemoResults] = useState<any>(null);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Demo voice commands for selection
  const demoCommands = [
    'Mint 3 coral NFTs for conservation',
    'Check my wallet balance and recent transactions',
    'Vote on proposal 42 to approve coral funding',
    'Show DAO treasury status and health metrics'
  ];

  const updateStepStatus = (stepId: string, status: DemoStep['status'], data?: any, processingTime?: number) => {
    setDemoSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, data, processingTime }
        : step
    ));
  };

  const addAgentActivity = (activity: AgentActivity) => {
    setAgentActivities(prev => [...prev, activity]);
  };

  const runFullDemo = async () => {
    setIsRunningDemo(true);
    setAgentActivities([]);
    setDemoResults(null);
    setCurrentStep('voice-command');

    try {
      // Step 1: Voice Command Processing
      updateStepStatus('voice-command', 'processing');
      
      const startTime = Date.now();
      const selectedCommand = voiceCommand || demoCommands[0];
      
      // Simulate voice processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const voiceProcessingTime = Date.now() - startTime;
      updateStepStatus('voice-command', 'completed', { 
        command: selectedCommand,
        intent: 'mint_nft',
        confidence: 0.95
      }, voiceProcessingTime);

      // Step 2: Multi-Agent Orchestration
      setCurrentStep('multi-agent');
      updateStepStatus('multi-agent', 'processing');

      // Simulate agent coordination
      const agents = [
        { name: 'ProposalAgent', delay: 800 },
        { name: 'TreasuryAgent', delay: 600 },
        { name: 'VotingAgent', delay: 900 }
      ];

      for (const agent of agents) {
        await new Promise(resolve => setTimeout(resolve, agent.delay));
        addAgentActivity({
          name: agent.name,
          status: 'success',
          result: `${agent.name} analysis complete ✓`,
          processingTime: agent.delay,
          details: { 
            confidence: 0.96,
            recommendations: 'Approved for execution'
          }
        });
      }

      updateStepStatus('multi-agent', 'completed', { 
        agentsUsed: agents.length,
        totalProcessingTime: Math.max(...agents.map(a => a.delay))
      });

      // Step 3: Solana Integration
      setCurrentStep('solana-execution');
      updateStepStatus('solana-execution', 'processing');

      // Call our mock backend for NFT minting
      const mintResult = await coralApi.mintNFT({
        recipientWallet: 'Fz7r8L5y6M4nH3P9aXc1vB8eQ2R3tY6uW1ZxP0aD9fK2',
        quantity: 3,
        collectionId: 'coral-conservation'
      });

      updateStepStatus('solana-execution', 'completed', mintResult);

      // Step 4: DAO Governance
      setCurrentStep('dao-governance');
      updateStepStatus('dao-governance', 'processing');

      // Get treasury info and voting
      const treasuryResult = await coralApi.getTreasuryInfo();
      const voteResult = await coralApi.voteOnProposal(42, 'approve', 'Fz7r8L5y6M4nH3P9aXc1vB8eQ2R3tY6uW1ZxP0aD9fK2');

      updateStepStatus('dao-governance', 'completed', { 
        treasury: treasuryResult.treasury,
        vote: voteResult.voteRecord
      });

      // Get full demo scenario
      const fullScenario = await coralApi.getFullDemoScenario();
      setDemoResults(fullScenario.demoScenario);

    } catch (error) {
      console.error('Demo error:', error);
      if (currentStep) {
        updateStepStatus(currentStep, 'error');
      }
    } finally {
      setIsRunningDemo(false);
      setCurrentStep(null);
    }
  };

  const getStatusIcon = (status: DemoStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Activity className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <ExternalLink className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    
    setTimeout(() => {
      setIsRecording(false);
      setVoiceCommand(demoCommands[Math.floor(Math.random() * demoCommands.length)]);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Coral Rush AI + Solana Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience the future of Web3 with AI-powered voice commands, multi-agent orchestration, 
          and seamless Solana blockchain integration for coral conservation.
        </p>
      </div>

      {/* Voice Command Section */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-6 h-6 text-blue-600" />
            Voice Command Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {demoCommands.map((command, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setVoiceCommand(command)}
                className={cn(
                  "text-sm",
                  voiceCommand === command && "bg-blue-100 border-blue-300"
                )}
              >
                {command}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={simulateVoiceRecording}
              disabled={isRecording}
              className={cn(
                "flex items-center gap-2",
                isRecording && "animate-pulse bg-red-500 hover:bg-red-600"
              )}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Recording...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Simulate Voice Input
                </>
              )}
            </Button>
            
            {voiceCommand && (
              <div className="flex-1 p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">Selected Command:</p>
                <p className="font-medium">{voiceCommand}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Control */}
      <div className="flex justify-center">
        <Button
          onClick={runFullDemo}
          disabled={isRunningDemo || !voiceCommand}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3"
        >
          {isRunningDemo ? (
            <>
              <Activity className="w-5 h-5 mr-2 animate-spin" />
              Running Demo...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start Full Demo
            </>
          )}
        </Button>
      </div>

      {/* Demo Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoSteps.map((step, index) => (
          <Card 
            key={step.id}
            className={cn(
              "transition-all duration-300",
              step.status === 'completed' && "border-green-500 bg-green-50",
              step.status === 'processing' && "border-blue-500 bg-blue-50",
              step.status === 'error' && "border-red-500 bg-red-50",
              currentStep === step.id && "ring-2 ring-blue-400"
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(step.status)}
                Step {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
              
              {step.status === 'completed' && step.data && (
                <div className="space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    ✓ Completed
                  </Badge>
                  {step.processingTime && (
                    <p className="text-xs text-gray-500">
                      {step.processingTime}ms processing time
                    </p>
                  )}
                </div>
              )}
              
              {step.status === 'processing' && (
                <Badge variant="outline" className="text-xs animate-pulse">
                  Processing...
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agent Activities */}
      {agentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Multi-Agent Coordination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {agentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.name}
                      </Badge>
                      <span className="text-sm">{activity.result}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {activity.processingTime}ms
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Demo Results */}
      {demoResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Solana Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-orange-600" />
                Solana Integration Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">
                    ✓ {demoResults.nftMintResults?.length || 3} Coral NFTs Minted Successfully
                  </p>
                </div>
                
                {demoResults.nftMintResults?.slice(0, 2).map((nft: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">NFT #{index + 1}</span>
                      <Badge variant="secondary" className="text-xs">Confirmed</Badge>
                    </div>
                    <p className="text-xs text-gray-600 font-mono">
                      {nft.mintAddress || `NFTCoral00${index + 1}xyz`}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => window.open(nft.explorerUrl, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View on Solana Explorer
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* DAO Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-6 h-6 text-blue-600" />
                DAO Governance Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">
                    ✓ Proposal #42 Vote Recorded
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Treasury Value</p>
                    <p className="font-semibold text-green-600">$1.23M</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Health Score</p>
                    <p className="font-semibold text-blue-600">94/100</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Community Vote</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>Approve: 89%</span>
                    <span>Reject: 11%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary */}
      {demoResults && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-6 h-6" />
              Demo Complete - Hackathon Ready! 🚀
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {demoResults.summary?.totalProcessingTime || 589}ms
                </p>
                <p className="text-sm text-gray-600">Total Processing</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((demoResults.summary?.successRate || 1.0) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-sm text-gray-600">AI Agents Used</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">3</p>
                <p className="text-sm text-gray-600">NFTs Minted</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                🌊 Environmental Impact: +255 Conservation Points
              </p>
              <p className="text-sm text-gray-600">
                This demo showcases AI-powered Web3 interactions for coral conservation, 
                featuring voice commands, multi-agent coordination, and Solana blockchain integration.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoralHackathonDemo;
