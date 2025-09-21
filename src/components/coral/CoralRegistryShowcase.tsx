import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Zap, 
  Shield, 
  Brain, 
  Clock, 
  DollarSign,
  Activity,
  TrendingUp,
  Users,
  Database,
  Network,
  ChevronRight
} from "lucide-react";
import { coralApi, CoralAgentRegistry } from "@/utils/coralApi";

interface RegistryStats {
  total_agents: number;
  active_workflows: number;
  network_fees: number;
  total_uses: number;
  success_rate: number;
}

interface AgentCardProps {
  agent: CoralAgentRegistry;
  onRent: () => void;
  price: number;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onRent, price }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'voice': return <Globe className="h-4 w-4" />;
      case 'fraud-detection': return <Shield className="h-4 w-4" />;
      case 'analytics': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getCategoryIcon(agent.category)}
            <h4 className="font-semibold text-blue-900">{agent.name}</h4>
          </div>
          <Badge variant={agent.isActive ? "default" : "secondary"} className="text-xs">
            {agent.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 3).map((capability, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {capability}
              </Badge>
            ))}
            {agent.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{agent.capabilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {agent.metrics && (
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium text-gray-700">Uses</div>
              <div className="text-blue-600">{agent.metrics.total_uses}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium text-gray-700">Success Rate</div>
              <div className="text-green-600">{(agent.metrics.success_rate * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium text-gray-700">Avg Response</div>
              <div className="text-orange-600">{agent.metrics.avg_response_time}ms</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-medium text-gray-700">Last Used</div>
              <div className="text-purple-600">
                {new Date(agent.metrics.last_used).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-green-600">
            ${price}/hour
          </div>
          <Button 
            onClick={onRent} 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Network className="h-3 w-3 mr-1" />
            Rent Agent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const CoralRegistryShowcase: React.FC = () => {
  const [availableAgents, setAvailableAgents] = useState<CoralAgentRegistry[]>([]);
  const [registryStats, setRegistryStats] = useState<RegistryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadCoralRegistry = async () => {
      try {
        setLoading(true);
        
        // Load available agents
        const agents = await coralApi.getAvailableAgents();
        setAvailableAgents(agents);

        // Simulate registry stats (in real implementation, this would come from Coral Protocol)
        const mockStats: RegistryStats = {
          total_agents: agents.length || 47,
          active_workflows: 23,
          network_fees: 125.50,
          total_uses: 15420,
          success_rate: 0.987
        };
        setRegistryStats(mockStats);
        
      } catch (error) {
        console.error('Failed to load Coral Registry:', error);
        
        // Fallback mock data
        const mockAgents: CoralAgentRegistry[] = [
          {
            id: '1',
            name: 'Payment Processor',
            description: 'Advanced payment processing with fraud detection',
            capabilities: ['payment-processing', 'fraud-detection', 'compliance-check'],
            endpoint: 'https://coral-registry.com/agents/payment-processor',
            version: '2.1.0',
            category: 'payment',
            isActive: true,
            metrics: {
              total_uses: 3240,
              success_rate: 0.995,
              avg_response_time: 85,
              last_used: new Date().toISOString()
            }
          },
          {
            id: '2',
            name: 'Voice Interpreter',
            description: 'Natural language processing for voice commands',
            capabilities: ['speech-to-text', 'intent-analysis', 'context-understanding'],
            endpoint: 'https://coral-registry.com/agents/voice-interpreter',
            version: '1.8.2',
            category: 'voice',
            isActive: true,
            metrics: {
              total_uses: 5670,
              success_rate: 0.982,
              avg_response_time: 120,
              last_used: new Date().toISOString()
            }
          },
          {
            id: '3',
            name: 'Fraud Detector',
            description: 'AI-powered fraud detection and risk assessment',
            capabilities: ['fraud-detection', 'risk-analysis', 'pattern-recognition'],
            endpoint: 'https://coral-registry.com/agents/fraud-detector',
            version: '3.0.1',
            category: 'fraud-detection',
            isActive: true,
            metrics: {
              total_uses: 8920,
              success_rate: 0.988,
              avg_response_time: 95,
              last_used: new Date().toISOString()
            }
          }
        ];
        
        setAvailableAgents(mockAgents);
        setRegistryStats({
          total_agents: 47,
          active_workflows: 23,
          network_fees: 125.50,
          total_uses: 15420,
          success_rate: 0.987
        });
      } finally {
        setLoading(false);
      }
    };

    loadCoralRegistry();
  }, []);

  const handleRentAgent = (agentId: string) => {
    console.log(`Renting agent ${agentId}`);
    // In real implementation, this would trigger the rental process
  };

  const filteredAgents = selectedCategory === 'all' 
    ? availableAgents 
    : availableAgents.filter(agent => agent.category === selectedCategory);

  const categories = ['all', 'payment', 'voice', 'fraud-detection', 'analytics'];

  if (loading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading Coral Registry...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-900">🌊 Live Coral Registry Integration</h3>
            <p className="text-blue-700">Discover and rent AI agents from the decentralized Coral Protocol registry</p>
          </div>
        </div>

        {/* Registry Stats */}
        {registryStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-900">{registryStats.total_agents}</div>
              <div className="text-sm text-gray-600">Available Agents</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-purple-200 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-900">{registryStats.active_workflows}</div>
              <div className="text-sm text-gray-600">Active Workflows</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-900">${registryStats.network_fees}</div>
              <div className="text-sm text-gray-600">Network Fees</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-orange-200 text-center">
              <Database className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-900">{registryStats.total_uses.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Uses</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-teal-200 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-teal-600" />
              <div className="text-2xl font-bold text-teal-900">{(registryStats.success_rate * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-blue-600 text-white" : ""}
            >
              {category === 'all' ? 'All Agents' : category.replace('-', ' ').toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Show rentable agents */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-600" />
            Available Agents for Rental
            <Badge variant="secondary" className="ml-2">{filteredAgents.length}</Badge>
          </h4>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onRent={() => handleRentAgent(agent.id)}
                price={Math.random() * 50 + 10} // Mock pricing
              />
            ))}
          </div>
        </div>

        {/* Coral Protocol Advantages */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Coral Protocol Advantages
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
      </CardContent>
    </Card>
  );
};

// Import CheckCircle for the advantages section
import { CheckCircle } from "lucide-react";
