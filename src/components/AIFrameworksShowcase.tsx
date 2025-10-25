import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Zap, Brain, Code2, Palette, Cog, MessageSquare, Rocket } from 'lucide-react';

interface AIFramework {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'initializing' | 'error' | 'offline';
  capabilities: string[];
  performance: {
    success_rate: number;
    avg_response_time: number;
    total_operations: number;
  };
  icon: React.ComponentType<{ className?: string }>;
  category: 'blockchain' | 'generation' | 'conversation' | 'automation';
}

interface OperationResult {
  id: string;
  framework: string;
  operation: string;
  status: 'running' | 'completed' | 'failed';
  duration?: number;
  result?: any;
  error?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  frameworks: string[];
  steps: number;
  estimatedTime: string;
}

const AIFrameworksShowcase: React.FC = () => {
  const [frameworks, setFrameworks] = useState<AIFramework[]>([
    {
      id: 'solana_agent_kit',
      name: 'Solana Agent Kit',
      description: 'Autonomous blockchain operations with 60+ Solana actions',
      status: 'active',
      capabilities: ['Token Transfers', 'NFT Minting', 'DeFi Interactions', 'Wallet Management'],
      performance: {
        success_rate: 97.5,
        avg_response_time: 0.8,
        total_operations: 1247
      },
      icon: Zap,
      category: 'blockchain'
    },
    {
      id: 'codigo_ai',
      name: 'Código AI',
      description: 'AI-powered smart contract generation and optimization',
      status: 'active',
      capabilities: ['Contract Generation', 'Code Optimization', 'Security Auditing', 'Deployment'],
      performance: {
        success_rate: 94.2,
        avg_response_time: 2.3,
        total_operations: 589
      },
      icon: Code2,
      category: 'generation'
    },
    {
      id: 'noah_ai',
      name: 'Noah AI',
      description: 'No-code Solana app development from natural language',
      status: 'active',
      capabilities: ['DApp Generation', 'UI Creation', 'Rapid Prototyping', 'App Deployment'],
      performance: {
        success_rate: 91.8,
        avg_response_time: 4.1,
        total_operations: 342
      },
      icon: Palette,
      category: 'generation'
    },
    {
      id: 'rig_framework',
      name: 'Rig Framework',
      description: 'Modular AI agent building with Rust performance',
      status: 'active',
      capabilities: ['Agent Pipelines', 'Multi-Model Coordination', 'Workflow Management', 'Performance Optimization'],
      performance: {
        success_rate: 98.1,
        avg_response_time: 1.2,
        total_operations: 896
      },
      icon: Cog,
      category: 'automation'
    },
    {
      id: 'zerepy',
      name: 'ZerePy',
      description: 'Autonomous multi-platform agent deployment',
      status: 'active',
      capabilities: ['Cross-Platform Coordination', 'Social Media Automation', 'Task Scheduling', 'Auto-Scaling'],
      performance: {
        success_rate: 95.7,
        avg_response_time: 1.8,
        total_operations: 2156
      },
      icon: Rocket,
      category: 'automation'
    },
    {
      id: 'eliza_framework',
      name: 'Eliza Framework',
      description: 'Conversational AI with Web3 capabilities',
      status: 'active',
      capabilities: ['Natural Conversation', 'Web3 Operations', 'Voice Interaction', 'Context Memory'],
      performance: {
        success_rate: 96.3,
        avg_response_time: 0.6,
        total_operations: 3421
      },
      icon: MessageSquare,
      category: 'conversation'
    }
  ]);

  const [activeOperations, setActiveOperations] = useState<OperationResult[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [isOrchestrating, setIsOrchestrating] = useState(false);

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'complete_dapp_development',
      name: 'Complete DApp Development',
      description: 'End-to-end DApp creation from conversation to deployment',
      frameworks: ['eliza_framework', 'codigo_ai', 'noah_ai', 'solana_agent_kit'],
      steps: 4,
      estimatedTime: '5-10 minutes'
    },
    {
      id: 'voice_to_payment',
      name: 'Voice-to-Payment',
      description: 'Voice-activated payment with AI verification',
      frameworks: ['eliza_framework', 'solana_agent_kit', 'codigo_ai'],
      steps: 3,
      estimatedTime: '30-60 seconds'
    },
    {
      id: 'autonomous_trading',
      name: 'Autonomous Trading Setup',
      description: 'Deploy autonomous trading system with monitoring',
      frameworks: ['rig_framework', 'codigo_ai', 'zerepy', 'solana_agent_kit'],
      steps: 4,
      estimatedTime: '3-7 minutes'
    },
    {
      id: 'nft_marketplace',
      name: 'NFT Marketplace Creation',
      description: 'Complete NFT marketplace with AI curation',
      frameworks: ['noah_ai', 'codigo_ai', 'solana_agent_kit', 'rig_framework'],
      steps: 5,
      estimatedTime: '8-15 minutes'
    }
  ];

  const executeFrameworkOperation = async (frameworkId: string, operation: string) => {
    const operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newOperation: OperationResult = {
      id: operationId,
      framework: frameworkId,
      operation,
      status: 'running'
    };

    setActiveOperations(prev => [...prev, newOperation]);

    // Simulate API call to coral-agent backend
    try {
      const response = await fetch('/api/coral/execute-operation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          framework: frameworkId,
          operation,
          parameters: {}
        })
      });

      const result = await response.json();

      // Update operation with result
      setActiveOperations(prev => 
        prev.map(op => 
          op.id === operationId 
            ? {
                ...op,
                status: result.success ? 'completed' : 'failed',
                duration: result.execution_time || Math.random() * 3 + 0.5,
                result: result.result,
                error: result.error
              }
            : op
        )
      );

    } catch (error) {
      // Handle error
      setActiveOperations(prev => 
        prev.map(op => 
          op.id === operationId 
            ? {
                ...op,
                status: 'failed',
                error: 'Network error or service unavailable'
              }
            : op
        )
      );
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    setIsOrchestrating(true);

    try {
      const response = await fetch('/api/coral/execute-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_name: workflowId,
          parameters: {
            user_message: "Create a payment DApp",
            session_id: `session_${Date.now()}`
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success notification or update UI
        console.log('Workflow completed successfully:', result);
      } else {
        console.error('Workflow failed:', result.error);
      }

    } catch (error) {
      console.error('Workflow execution error:', error);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'initializing': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'initializing': return <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'offline': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'blockchain': return 'bg-purple-100 text-purple-800';
      case 'generation': return 'bg-blue-100 text-blue-800';
      case 'conversation': return 'bg-green-100 text-green-800';
      case 'automation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Frameworks Integration
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Unified orchestration of cutting-edge AI frameworks for Web3 and Solana development. 
            From voice conversations to autonomous agents, smart contract generation to multi-platform deployment.
          </p>
        </div>

        <Tabs defaultValue="frameworks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="frameworks">AI Frameworks</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="operations">Live Operations</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Frameworks Tab */}
          <TabsContent value="frameworks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frameworks.map((framework) => {
                const Icon = framework.icon;
                return (
                  <Card 
                    key={framework.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                      selectedFramework === framework.id 
                        ? 'border-purple-300 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedFramework(selectedFramework === framework.id ? null : framework.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-6 w-6 text-purple-600" />
                          <Badge className={getCategoryColor(framework.category)}>
                            {framework.category}
                          </Badge>
                        </div>
                        {getStatusIcon(framework.status)}
                      </div>
                      <CardTitle className="text-lg">{framework.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {framework.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Success Rate</span>
                            <span className="font-medium">{framework.performance.success_rate}%</span>
                          </div>
                          <Progress value={framework.performance.success_rate} className="h-2" />
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {framework.capabilities.slice(0, 3).map((capability, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                          {framework.capabilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{framework.capabilities.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {selectedFramework === framework.id && (
                          <div className="mt-4 space-y-2 border-t pt-3">
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                executeFrameworkOperation(framework.id, 'test_operation');
                              }}
                            >
                              Test Framework
                            </Button>
                            <div className="text-xs text-gray-500">
                              <div>Avg Response: {framework.performance.avg_response_time}s</div>
                              <div>Total Operations: {framework.performance.total_operations.toLocaleString()}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflowTemplates.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cog className="h-5 w-5 text-blue-600" />
                      {workflow.name}
                    </CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Estimated Time:</span>
                        <Badge variant="outline">{workflow.estimatedTime}</Badge>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Frameworks ({workflow.frameworks.length}):</div>
                        <div className="flex flex-wrap gap-1">
                          {workflow.frameworks.map((frameworkId) => {
                            const framework = frameworks.find(f => f.id === frameworkId);
                            return framework ? (
                              <Badge key={frameworkId} className={getCategoryColor(framework.category)}>
                                {framework.name.split(' ')[0]}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        disabled={isOrchestrating}
                        onClick={() => executeWorkflow(workflow.id)}
                      >
                        {isOrchestrating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Executing...
                          </>
                        ) : (
                          'Execute Workflow'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Operations Monitor</CardTitle>
                <CardDescription>Real-time view of AI framework operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeOperations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active operations. Execute a framework operation or workflow to see activity here.</p>
                    </div>
                  ) : (
                    activeOperations.map((operation) => {
                      const framework = frameworks.find(f => f.id === operation.framework);
                      return (
                        <div key={operation.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {framework?.icon && (
                              <framework.icon className="h-5 w-5 text-gray-600" />
                            )}
                            <div>
                              <div className="font-medium">{framework?.name} - {operation.operation}</div>
                              <div className="text-sm text-gray-500">ID: {operation.id}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {operation.status === 'running' && (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            )}
                            <Badge 
                              className={
                                operation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                operation.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {operation.status}
                            </Badge>
                            {operation.duration && (
                              <span className="text-sm text-gray-500">{operation.duration.toFixed(2)}s</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frameworks.map((framework) => (
                <Card key={framework.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <framework.icon className="h-5 w-5" />
                      {framework.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Success Rate</span>
                          <span className="font-medium">{framework.performance.success_rate}%</span>
                        </div>
                        <Progress value={framework.performance.success_rate} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Avg Response</div>
                          <div className="font-medium">{framework.performance.avg_response_time}s</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Total Ops</div>
                          <div className="font-medium">{framework.performance.total_operations.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">6</div>
                    <div className="text-sm text-gray-500">Active Frameworks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {frameworks.reduce((sum, f) => sum + f.performance.total_operations, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Operations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {(frameworks.reduce((sum, f) => sum + f.performance.success_rate, 0) / frameworks.length).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">Avg Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">4</div>
                    <div className="text-sm text-gray-500">Workflow Templates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIFrameworksShowcase;
