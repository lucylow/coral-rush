import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Zap, 
  Brain, 
  Shield, 
  DollarSign,
  Network,
  Activity,
  Globe
} from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  duration: number;
  coralFeature: string;
  description: string;
  agent: string;
  icon: React.ReactNode;
}

interface WorkflowMetrics {
  totalTime: number;
  agentsUsed: number;
  coralFeatures: string[];
  efficiency: number;
}

export const CoralWorkflowVisualizer: React.FC = () => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: '1',
      name: 'Agent Discovery',
      status: 'complete',
      duration: 50,
      coralFeature: 'Registry API',
      description: 'Discover available agents from Coral Registry',
      agent: 'Registry Agent',
      icon: <Globe className="h-4 w-4" />
    },
    {
      id: '2',
      name: 'Multi-Agent Coordination',
      status: 'active',
      duration: 150,
      coralFeature: 'MCP Integration',
      description: 'Coordinate multiple agents for complex tasks',
      agent: 'Orchestrator',
      icon: <Network className="h-4 w-4" />
    },
    {
      id: '3',
      name: 'Payment Settlement',
      status: 'pending',
      duration: 300,
      coralFeature: 'Transaction Engine',
      description: 'Execute blockchain transactions',
      agent: 'Payment Agent',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      id: '4',
      name: 'Result Synthesis',
      status: 'pending',
      duration: 75,
      coralFeature: 'Response Aggregation',
      description: 'Combine results from all agents',
      agent: 'Synthesis Agent',
      icon: <Brain className="h-4 w-4" />
    }
  ]);

  const [workflowMetrics, setWorkflowMetrics] = useState<WorkflowMetrics>({
    totalTime: 0,
    agentsUsed: 0,
    coralFeatures: [],
    efficiency: 0
  });

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Calculate metrics
    const totalTime = workflowSteps.reduce((sum, step) => sum + step.duration, 0);
    const agentsUsed = new Set(workflowSteps.map(step => step.agent)).size;
    const coralFeatures = [...new Set(workflowSteps.map(step => step.coralFeature))];
    const efficiency = Math.round((workflowSteps.filter(step => step.status === 'complete').length / workflowSteps.length) * 100);

    setWorkflowMetrics({
      totalTime,
      agentsUsed,
      coralFeatures,
      efficiency
    });
  }, [workflowSteps]);

  const startWorkflow = () => {
    setIsRunning(true);
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));

    // Simulate workflow execution
    let currentStep = 0;
    const interval = setInterval(() => {
      setWorkflowSteps(prev => {
        const newSteps = [...prev];
        if (currentStep > 0) {
          newSteps[currentStep - 1].status = 'complete';
        }
        if (currentStep < newSteps.length) {
          newSteps[currentStep].status = 'active';
        }
        return newSteps;
      });
      currentStep++;

      if (currentStep > workflowSteps.length) {
        clearInterval(interval);
        setIsRunning(false);
        setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'complete' })));
      }
    }, 800);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'active':
        return <div className="h-5 w-5 rounded-full bg-blue-600 animate-pulse" />;
      case 'error':
        return <div className="h-5 w-5 rounded-full bg-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'active':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-900">🔄 Coral Protocol Workflow Engine</h3>
            <p className="text-blue-700">Real-time multi-agent coordination and task orchestration</p>
          </div>
        </div>

        {/* Workflow Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-900">{workflowMetrics.totalTime}ms</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-purple-200 text-center">
            <Network className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-900">{workflowMetrics.agentsUsed}</div>
            <div className="text-sm text-gray-600">Agents Used</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-900">{workflowMetrics.coralFeatures.length}</div>
            <div className="text-sm text-gray-600">Coral Features</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-orange-200 text-center">
            <Activity className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-900">{workflowMetrics.efficiency}%</div>
            <div className="text-sm text-gray-600">Efficiency</div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">Workflow Steps</h4>
            <button
              onClick={startWorkflow}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isRunning ? 'Running...' : 'Start Workflow'}
            </button>
          </div>

          <div className="space-y-3">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                )}
                
                <div className={`p-4 rounded-lg border-2 ${getStatusColor(step.status)} transition-all duration-300`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-semibold">{step.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          {step.coralFeature}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {step.duration}ms
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {step.icon}
                        <span>Agent: {step.agent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coral Protocol Advantages */}
        <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Coral Protocol Workflow Advantages
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Zero-trust agent orchestration
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Cross-framework compatibility
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Monetizable agent rental
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Decentralized agent discovery
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Performance */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            Real-time Performance Metrics
          </h5>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">98.7%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">150ms</div>
              <div className="text-xs text-gray-600">Avg Response</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">4</div>
              <div className="text-xs text-gray-600">Concurrent Agents</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
