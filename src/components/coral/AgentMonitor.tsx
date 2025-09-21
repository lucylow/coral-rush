import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Zap, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Server,
  Cpu,
  Database,
  Network
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentMetrics {
  agent_id: string;
  name: string;
  status: 'idle' | 'processing' | 'success' | 'error' | 'offline';
  last_heartbeat: string;
  current_task?: string;
  metrics: {
    requests_processed: number;
    average_response_time: number;
    success_rate: number;
    error_count: number;
    uptime: number;
  };
  capabilities: string[];
}

interface WorkflowExecution {
  execution_id: string;
  workflow_name: string;
  status: 'running' | 'completed' | 'failed';
  current_step: number;
  total_steps: number;
  start_time: string;
  end_time?: string;
  steps: Array<{
    step_id: string;
    agent_id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    duration?: number;
  }>;
}

interface AgentMonitorProps {
  className?: string;
}

const AgentMonitor: React.FC<AgentMonitorProps> = ({ className }) => {
  const [agents, setAgents] = useState<AgentMetrics[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowExecution[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data for demonstration
  const mockAgents: AgentMetrics[] = [
    {
      agent_id: 'voice-listener-agent',
      name: 'Voice Listener Agent',
      status: 'processing',
      last_heartbeat: new Date().toISOString(),
      current_task: 'transcribe_speech',
      metrics: {
        requests_processed: 1247,
        average_response_time: 1.2,
        success_rate: 98.5,
        error_count: 19,
        uptime: 99.2
      },
      capabilities: ['speech-to-text', 'text-to-speech', 'voice-processing']
    },
    {
      agent_id: 'brain-agent',
      name: 'Brain Agent',
      status: 'success',
      last_heartbeat: new Date().toISOString(),
      metrics: {
        requests_processed: 1156,
        average_response_time: 2.1,
        success_rate: 97.8,
        error_count: 25,
        uptime: 99.5
      },
      capabilities: ['natural-language-understanding', 'intent-analysis', 'response-generation']
    },
    {
      agent_id: 'fraud-detection-agent',
      name: 'Fraud Detection Agent',
      status: 'idle',
      last_heartbeat: new Date().toISOString(),
      metrics: {
        requests_processed: 892,
        average_response_time: 0.3,
        success_rate: 99.7,
        error_count: 3,
        uptime: 99.9
      },
      capabilities: ['fraud-detection', 'risk-assessment', 'pattern-analysis']
    },
    {
      agent_id: 'payment-agent',
      name: 'Payment Agent',
      status: 'processing',
      last_heartbeat: new Date().toISOString(),
      current_task: 'process_payment',
      metrics: {
        requests_processed: 634,
        average_response_time: 0.8,
        success_rate: 99.2,
        error_count: 5,
        uptime: 99.1
      },
      capabilities: ['cross-border-payments', 'sub-second-settlement', 'multi-currency-support']
    },
    {
      agent_id: 'executor-agent',
      name: 'Executor Agent',
      status: 'success',
      last_heartbeat: new Date().toISOString(),
      metrics: {
        requests_processed: 1089,
        average_response_time: 1.5,
        success_rate: 96.8,
        error_count: 34,
        uptime: 98.7
      },
      capabilities: ['blockchain-interaction', 'nft-minting', 'transaction-verification']
    }
  ];

  const mockWorkflows: WorkflowExecution[] = [
    {
      execution_id: 'exec_001',
      workflow_name: 'voice_payment_workflow',
      status: 'running',
      current_step: 2,
      total_steps: 4,
      start_time: new Date(Date.now() - 30000).toISOString(),
      steps: [
        { step_id: 'voice_processing', agent_id: 'voice-listener-agent', status: 'completed', duration: 1200 },
        { step_id: 'intent_analysis', agent_id: 'brain-agent', status: 'completed', duration: 2100 },
        { step_id: 'fraud_detection', agent_id: 'fraud-detection-agent', status: 'running' },
        { step_id: 'payment_processing', agent_id: 'payment-agent', status: 'pending' }
      ]
    },
    {
      execution_id: 'exec_002',
      workflow_name: 'support_workflow',
      status: 'completed',
      current_step: 3,
      total_steps: 3,
      start_time: new Date(Date.now() - 120000).toISOString(),
      end_time: new Date(Date.now() - 30000).toISOString(),
      steps: [
        { step_id: 'query_analysis', agent_id: 'brain-agent', status: 'completed', duration: 1500 },
        { step_id: 'transaction_check', agent_id: 'executor-agent', status: 'completed', duration: 1000 },
        { step_id: 'nft_compensation', agent_id: 'executor-agent', status: 'completed', duration: 2000 }
      ]
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setAgents(mockAgents);
    setWorkflows(mockWorkflows);
    setIsConnected(true);

    // Simulate real-time updates
    intervalRef.current = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate agent status changes
      setAgents(prev => prev.map(agent => ({
        ...agent,
        last_heartbeat: new Date().toISOString(),
        metrics: {
          ...agent.metrics,
          requests_processed: agent.metrics.requests_processed + Math.floor(Math.random() * 3),
          average_response_time: agent.metrics.average_response_time + (Math.random() - 0.5) * 0.1,
          success_rate: Math.max(95, Math.min(100, agent.metrics.success_rate + (Math.random() - 0.5) * 0.2))
        }
      })));

      // Simulate workflow progress
      setWorkflows(prev => prev.map(workflow => {
        if (workflow.status === 'running') {
          const updatedSteps = workflow.steps.map(step => {
            if (step.status === 'running' && Math.random() > 0.7) {
              return { ...step, status: 'completed' as const, duration: Math.floor(Math.random() * 2000) + 500 };
            }
            return step;
          });
          
          const allCompleted = updatedSteps.every(step => step.status === 'completed');
          
          return {
            ...workflow,
            steps: updatedSteps,
            current_step: allCompleted ? workflow.total_steps : workflow.current_step + 1,
            status: allCompleted ? 'completed' as const : workflow.status,
            end_time: allCompleted ? new Date().toISOString() : workflow.end_time
          };
        }
        return workflow;
      }));
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'bg-gray-600';
      case 'processing':
        return 'bg-blue-600';
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'offline':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Connection Status */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-blue-400">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Coral Protocol Monitor
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    Connected
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                    Disconnected
                  </>
                )}
              </Badge>
              <span className="text-xs text-gray-400">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Agent Status Grid */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Cpu className="h-5 w-5" />
            Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.agent_id}
                className="p-4 bg-gray-800/50 border border-gray-600/50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(agent.status)}
                    <h3 className="font-medium text-white text-sm">{agent.name}</h3>
                  </div>
                  <Badge className={cn("text-xs", getStatusColor(agent.status))}>
                    {agent.status}
                  </Badge>
                </div>
                
                {agent.current_task && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400">Current Task:</p>
                    <p className="text-sm text-blue-400">{agent.current_task}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Requests:</span>
                    <span className="text-white">{agent.metrics.requests_processed}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Avg Response:</span>
                    <span className="text-white">{agent.metrics.average_response_time.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Success Rate:</span>
                    <span className="text-green-400">{agent.metrics.success_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-blue-400">{agent.metrics.uptime.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-600/50">
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 2).map((capability) => (
                      <Badge key={capability} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {agent.capabilities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.capabilities.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Executions */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Network className="h-5 w-5" />
            Active Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow.execution_id}
                  className="p-4 bg-gray-800/50 border border-gray-600/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white text-sm">
                        {workflow.workflow_name.replace('_', ' ')}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {workflow.execution_id}
                      </Badge>
                    </div>
                    <Badge className={cn("text-xs", getWorkflowStatusColor(workflow.status))}>
                      {workflow.status}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{workflow.current_step}/{workflow.total_steps}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(workflow.current_step / workflow.total_steps) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {workflow.steps.map((step, index) => (
                      <div key={step.step_id} className="flex items-center gap-2 text-xs">
                        {getStatusIcon(step.status)}
                        <span className="text-gray-300">{step.step_id}</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-gray-400">{step.agent_id}</span>
                        {step.duration && (
                          <span className="text-gray-500 ml-auto">
                            {step.duration}ms
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-600/50 flex justify-between text-xs text-gray-400">
                    <span>Started: {new Date(workflow.start_time).toLocaleTimeString()}</span>
                    {workflow.end_time && (
                      <span>Completed: {new Date(workflow.end_time).toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentMonitor;
