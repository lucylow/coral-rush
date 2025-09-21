import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { coralServerClient } from '@/coral/CoralServerClient';
import { coralRegistry } from '@/coral/CoralRegistry';
import { threadManager, ThreadSession } from '@/coral/ThreadManager';

interface RegistryStats {
  total_agents: number;
  active_rentals: number;
  total_earned: string;
  success_rate: number;
  network_fees: number;
  total_uses: number;
}

interface RevenueMetrics {
  total_earned: string;
  monthly_earnings: string;
  top_agents: Array<{
    id: string;
    name: string;
    earnings: string;
  }>;
}

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    capabilities: string[];
    pricePerCall: number;
    endpoint: string;
    status: 'active' | 'inactive' | 'busy';
  };
  onRent: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onRent }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (capabilities: string[]) => {
    if (capabilities.includes('voice-processing')) return <Globe className="h-4 w-4" />;
    if (capabilities.includes('blockchain-execution')) return <Zap className="h-4 w-4" />;
    if (capabilities.includes('fraud-detection')) return <Shield className="h-4 w-4" />;
    return <Brain className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {getCategoryIcon(agent.capabilities)}
              <h4 className="font-semibold text-blue-900">{agent.name}</h4>
            </div>
            <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
              {agent.status}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.slice(0, 3).map((capability, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {capability.replace('-', ' ')}
                </Badge>
              ))}
              {agent.capabilities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{agent.capabilities.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-green-600">
              {agent.pricePerCall} CORAL/call
            </div>
            <Button 
              onClick={onRent} 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={agent.status === 'inactive'}
            >
              <Network className="h-3 w-3 mr-1" />
              Rent Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ThreadVisualization: React.FC<{ thread: ThreadSession }> = ({ thread }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'active': return <div className="h-4 w-4 rounded-full bg-blue-600 animate-pulse" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'active': return 'bg-blue-50 border-blue-200';
      case 'failed': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`p-3 rounded-lg border ${getStatusColor(thread.status)}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(thread.status)}
          <span className="font-medium text-sm">{thread.metadata.userQuery}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {thread.metadata.sessionType}
        </Badge>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        Participants: {thread.participants.length} • Messages: {thread.messages.length}
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        <Clock className="h-3 w-3" />
        <span>
          {thread.endTime 
            ? `${Math.round((thread.endTime.getTime() - thread.startTime.getTime()) / 1000)}s`
            : 'Active'
          }
        </span>
      </div>
    </motion.div>
  );
};

const RevenueMetricsDisplay: React.FC<{ metrics: RevenueMetrics }> = ({ metrics }) => (
  <div className="grid md:grid-cols-2 gap-4">
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <h4 className="font-semibold text-green-900 mb-2">💰 Revenue Overview</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Earned:</span>
          <span className="font-bold text-green-600">{metrics.total_earned}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Monthly:</span>
          <span className="font-bold text-green-600">{metrics.monthly_earnings}</span>
        </div>
      </div>
    </div>
    
    <div className="bg-white p-4 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-blue-900 mb-2">🏆 Top Agents</h4>
      <div className="space-y-1">
        {metrics.top_agents.slice(0, 3).map((agent, index) => (
          <div key={agent.id} className="flex justify-between text-sm">
            <span className="text-gray-600">{agent.name}</span>
            <span className="font-medium text-blue-600">{agent.earnings}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CoralOrchestrationDashboard: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [activeThreads, setActiveThreads] = useState<ThreadSession[]>([]);
  const [registryStats, setRegistryStats] = useState<RegistryStats | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [coralConnected, setCoralConnected] = useState(false);

  useEffect(() => {
    loadCoralData();
    const interval = setInterval(loadCoralData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadCoralData = async () => {
    try {
      setLoading(true);
      
      // Load live Coral Protocol data
      const [agentsData, threadsData, registryData, revenueData] = await Promise.all([
        coralServerClient.listAgents(),
        Promise.resolve(threadManager.getActiveSessions()),
        coralRegistry.getRegistryStats(),
        coralRegistry.getRevenueMetrics()
      ]);

      setAgents(agentsData);
      setActiveThreads(threadsData);
      setRegistryStats(registryData);
      setRevenueMetrics(revenueData);
      setCoralConnected(coralServerClient.isConnected());
      
    } catch (error) {
      console.error('Failed to load Coral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRentAgent = async (agentId: string) => {
    try {
      const rental = await coralRegistry.rentAgent(agentId, 60); // 60 minutes
      console.log('Agent rented:', rental);
      // Refresh data
      loadCoralData();
    } catch (error) {
      console.error('Failed to rent agent:', error);
    }
  };

  const startDemoSession = async () => {
    try {
      const session = await threadManager.startSupportSession(
        'Send $10,000 to Philippines',
        `demo_session_${Date.now()}`
      );
      console.log('Demo session started:', session);
      loadCoralData();
    } catch (error) {
      console.error('Failed to start demo session:', error);
    }
  };

  if (loading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading Coral Protocol Dashboard...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Network className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900">🌊 Coral Protocol Orchestration</h2>
            <p className="text-blue-700">Live multi-agent coordination and registry monetization</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={startDemoSession}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Demo Session
          </Button>
          <Button 
            onClick={loadCoralData}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className={`border-2 ${coralConnected ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {coralConnected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <h3 className="font-semibold">
                {coralConnected ? 'Connected to Coral Protocol' : 'Disconnected from Coral Protocol'}
              </h3>
              <p className="text-sm text-gray-600">
                {coralConnected 
                  ? 'MCP integration active • Registry accessible • Agents available'
                  : 'Using fallback mode • Limited functionality'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registry Showcase */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">🏪 Live Coral Registry</h3>
          
          {registryStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-900">{registryStats.total_agents}</div>
                <div className="text-sm text-gray-600">Available Agents</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-200 text-center">
                <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-900">{registryStats.active_rentals}</div>
                <div className="text-sm text-gray-600">Active Rentals</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-900">{registryStats.total_earned}</div>
                <div className="text-sm text-gray-600">Revenue Generated</div>
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
        </CardContent>
      </Card>

      {/* Agent Coordination Theater */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">🎭 Live Agent Coordination</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Active Threads</h4>
              <Badge variant="secondary">{activeThreads.length}</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <AnimatePresence>
                {activeThreads.map((thread) => (
                  <ThreadVisualization key={thread.id} thread={thread} />
                ))}
              </AnimatePresence>
            </div>
            
            {activeThreads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No active coordination threads</p>
                <p className="text-sm">Start a demo session to see agents in action</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rentable Agents Showcase */}
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">💰 Rentable RUSH Agents</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent}
                onRent={() => handleRentAgent(agent.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Dashboard */}
      {revenueMetrics && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4">📈 Coral Protocol Revenue Model</h3>
            <RevenueMetricsDisplay metrics={revenueMetrics} />
          </CardContent>
        </Card>
      )}

      {/* Coral Protocol Advantages */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">🌟 Coral Protocol Advantages</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">MCP-Native Architecture</h4>
                  <p className="text-sm text-blue-800">True standardized agent communication protocol</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Agent Registry & Monetization</h4>
                  <p className="text-sm text-blue-800">Real revenue generation through agent rental</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Thread-Based Orchestration</h4>
                  <p className="text-sm text-blue-800">Structured multi-agent coordination</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Cross-Framework Compatibility</h4>
                  <p className="text-sm text-blue-800">Agents from different frameworks working together</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
