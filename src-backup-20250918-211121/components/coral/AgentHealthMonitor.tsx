import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Server, Cpu, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentHealth {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
  requestsPerMinute: number;
  errorRate: number;
}

const AgentHealthMonitor = () => {
  const [agents, setAgents] = useState<AgentHealth[]>([
    {
      id: 'listener-agent',
      name: 'Voice Listener Agent',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 245,
      requestsPerMinute: 12,
      errorRate: 0.2
    },
    {
      id: 'brain-agent',
      name: 'Intent Analysis Brain',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 180,
      requestsPerMinute: 8,
      errorRate: 0.1
    },
    {
      id: 'executor-agent',
      name: 'Blockchain Executor',
      status: 'degraded',
      uptime: 97.5,
      responseTime: 520,
      requestsPerMinute: 5,
      errorRate: 2.3
    }
  ]);

  const [systemStats, setSystemStats] = useState({
    totalRequests: 1247,
    successfulSessions: 1189,
    averageResponseTime: 315,
    activeConnections: 23
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        responseTime: Math.max(100, agent.responseTime + (Math.random() - 0.5) * 50),
        requestsPerMinute: Math.max(0, agent.requestsPerMinute + (Math.random() - 0.5) * 3),
        errorRate: Math.max(0, agent.errorRate + (Math.random() - 0.5) * 0.5)
      })));

      setSystemStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 3),
        activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/20';
      case 'degraded': return 'text-yellow-400 bg-yellow-400/20';
      case 'down': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <Activity className="h-4 w-4 text-green-400" />;
      case 'degraded': return <Wifi className="h-4 w-4 text-yellow-400" />;
      case 'down': return <Server className="h-4 w-4 text-red-400" />;
      default: return <Cpu className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5" />
            System Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{systemStats.totalRequests}</div>
              <div className="text-sm text-gray-400">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{systemStats.successfulSessions}</div>
              <div className="text-sm text-gray-400">Successful Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{systemStats.averageResponseTime}ms</div>
              <div className="text-sm text-gray-400">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{systemStats.activeConnections}</div>
              <div className="text-sm text-gray-400">Active Connections</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white">{agent.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getHealthIcon(agent.status)}
                  <Badge className={cn("text-xs", getStatusColor(agent.status))}>
                    {agent.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Uptime */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Uptime</span>
                  <span className="text-xs text-white">{agent.uptime.toFixed(1)}%</span>
                </div>
                <Progress value={agent.uptime} className="h-2" />
              </div>

              {/* Response Time */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Response Time</span>
                  <span className="text-xs text-white">{Math.round(agent.responseTime)}ms</span>
                </div>
                <Progress 
                  value={Math.min(100, (1000 - agent.responseTime) / 10)} 
                  className="h-2" 
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-400">{Math.round(agent.requestsPerMinute)}</div>
                  <div className="text-xs text-gray-400">Req/min</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-red-400">{agent.errorRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">Error Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Status */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Agent Connectivity Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-medium text-white mb-2">Orchestrator ↔ Listener</div>
              <Badge className="bg-green-400/20 text-green-400">Connected</Badge>
              <div className="text-xs text-gray-400 mt-1">Latency: 12ms</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-white mb-2">Orchestrator ↔ Brain</div>
              <Badge className="bg-green-400/20 text-green-400">Connected</Badge>
              <div className="text-xs text-gray-400 mt-1">Latency: 8ms</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-white mb-2">Orchestrator ↔ Executor</div>
              <Badge className="bg-yellow-400/20 text-yellow-400">Degraded</Badge>
              <div className="text-xs text-gray-400 mt-1">Latency: 45ms</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentHealthMonitor;