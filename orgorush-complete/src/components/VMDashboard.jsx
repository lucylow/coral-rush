import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { 
  Server, 
  Cpu, 
  Shield, 
  FileText, 
  Coins, 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Route,
  BarChart3,
  RefreshCw,
  Monitor,
  Terminal,
  Play
} from 'lucide-react';
import OrgoComputerDemo from './OrgoComputerDemo';

const VMDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState({
    totalVolume: 1.24,
    transactions: 42.7,
    avgSettlement: 0.3,
    successRate: 98.7
  });

  const [vmStatus, setVmStatus] = useState([]);
  const [apiStatus, setApiStatus] = useState({ connected: false, lastUpdate: null });
  const [loading, setLoading] = useState(true);

  // Fetch VM status from backend API
  const fetchVMStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/health');
      const data = await response.json();
      
      if (data.status === 'healthy') {
        setApiStatus({ 
          connected: true, 
          lastUpdate: new Date().toLocaleTimeString(),
          services: data.services,
          orgoMetrics: data.orgo_metrics
        });

        // Map backend data to VM status
        const vmData = [
          {
            id: 'routing',
            name: 'Routing Optimizer',
            icon: Route,
            description: 'Real-time transaction routing across 12 networks',
            status: data.services?.orgo_vm_backend === 'active' ? 'active' : 'idle',
            activeTasks: Math.floor(Math.random() * 50) + 20,
            performance: 'Optimal',
            backendStatus: data.services?.orgo_vm_backend
          },
          {
            id: 'risk',
            name: 'Risk Management',
            icon: Shield,
            description: 'AI-powered fraud detection and prevention',
            status: data.services?.fraud_detection === 'active' ? 'active' : 'idle',
            threatsBlocked: Math.floor(Math.random() * 10) + 1,
            performance: 'Secure',
            backendStatus: data.services?.fraud_detection
          },
          {
            id: 'compliance',
            name: 'Compliance Engine',
            icon: FileText,
            description: 'Automated regulatory checks for 120+ jurisdictions',
            status: data.services?.compliance_engine === 'active' ? 'active' : 'idle',
            checksToday: Math.floor(Math.random() * 500) + 1000,
            performance: 'Compliant',
            backendStatus: data.services?.compliance_engine
          },
          {
            id: 'treasury',
            name: 'Treasury Management',
            icon: Coins,
            description: 'Optimizing yield across DeFi protocols',
            status: data.services?.burn_tracker === 'active' ? 'active' : 'idle',
            apy: 18.3 + (Math.random() * 2 - 1),
            performance: 'Active',
            backendStatus: data.services?.burn_tracker
          }
        ];

        setVmStatus(vmData);
        
        // Update metrics with real backend data
        if (data.orgo_metrics) {
          setMetrics(prev => ({
            ...prev,
            totalVolume: (data.orgo_metrics.daily_volume / 1000000) || prev.totalVolume,
            successRate: data.orgo_metrics.success_rate || prev.successRate
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch VM status:', error);
      setApiStatus({ 
        connected: false, 
        lastUpdate: null,
        error: error.message
      });
      
      // Fallback to static data if API fails
      setVmStatus([
        {
          id: 'routing',
          name: 'Routing Optimizer',
          icon: Route,
          description: 'Real-time transaction routing across 12 networks',
          status: 'idle',
          activeTasks: 0,
          performance: 'Offline',
          backendStatus: 'disconnected'
        },
        {
          id: 'risk',
          name: 'Risk Management',
          icon: Shield,
          description: 'AI-powered fraud detection and prevention',
          status: 'idle',
          threatsBlocked: 0,
          performance: 'Offline',
          backendStatus: 'disconnected'
        },
        {
          id: 'compliance',
          name: 'Compliance Engine',
          icon: FileText,
          description: 'Automated regulatory checks for 120+ jurisdictions',
          status: 'idle',
          checksToday: 0,
          performance: 'Offline',
          backendStatus: 'disconnected'
        },
        {
          id: 'treasury',
          name: 'Treasury Management',
          icon: Coins,
          description: 'Optimizing yield across DeFi protocols',
          status: 'idle',
          apy: 0,
          performance: 'Offline',
          backendStatus: 'disconnected'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [transactions] = useState([
    {
      icon: '⟠',
      type: 'ETH Payment',
      details: '9WzD...AWWM → 7xKX...SAEv',
      amount: '+2.4 ETH ($4,380)',
      time: '5m ago'
    },
    {
      icon: '💰',
      type: 'USDC Transfer',
      details: '7xKx...SAEv → 4A8Z...OpOr',
      amount: '-15,000 USDC',
      time: '15m ago'
    },
    {
      icon: '₿',
      type: 'BTC Purchase',
      details: '4A8Z...OpOr → 9WzD...AWWM',
      amount: '+0.42 BTC ($14,200)',
      time: '30m ago'
    },
    {
      icon: '🔥',
      type: 'ORGO Burned',
      details: 'Tokens burned from 9WzD...AWWM',
      amount: '-100 ORGO',
      time: '1h ago'
    }
  ]);

  const [insights] = useState([
    {
      title: 'Routing Optimization',
      description: 'Current Solana network fees are 40% lower than Polygon. Recommend routing next 42 transactions through SOL-PATH to save ~$128 in fees with equivalent security.',
      priority: 'medium'
    },
    {
      title: 'Treasury Opportunity',
      description: 'Detected $182K in idle USDC reserves. Deploying to Solend lending pool could generate 12.4% APY (~$6,200 monthly) with minimal risk exposure.',
      priority: 'high'
    },
    {
      title: 'Risk Alert',
      description: 'Unusual transaction pattern detected from account 0x4f3...c2a. Recommend enhanced verification for next transaction. Probability of fraud: 68.4%.',
      priority: 'critical'
    }
  ]);

  // Simulate real-time updates and fetch VM status
  useEffect(() => {
    // Initial fetch
    fetchVMStatus();

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalVolume: prev.totalVolume + (Math.random() * 0.02 - 0.01),
        transactions: prev.transactions + (Math.random() * 0.5 - 0.25),
        avgSettlement: Math.max(0.1, prev.avgSettlement + (Math.random() * 0.02 - 0.01)),
        successRate: Math.min(100, Math.max(95, prev.successRate + (Math.random() * 0.2 - 0.1)))
      }));

      // Refresh VM status every 30 seconds
      if (Date.now() % 30000 < 5000) {
        fetchVMStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    fetchVMStatus();
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-500' : 'bg-yellow-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-red-500/50 bg-red-900/20';
      case 'high': return 'border-orange-500/50 bg-orange-900/20';
      case 'medium': return 'border-blue-500/50 bg-blue-900/20';
      default: return 'border-gray-500/50 bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Tab Navigation */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            VM Dashboard
          </h2>
          <p className="text-xl text-gray-300">
            AI-Powered Payment Intelligence Platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Zap className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-700">
        <Button
          variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
          className={`rounded-b-none ${
            activeTab === 'dashboard' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          VM Status
        </Button>
        <Button
          variant={activeTab === 'demo' ? 'default' : 'ghost'}
          className={`rounded-b-none ${
            activeTab === 'demo' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('demo')}
        >
          <Monitor className="w-4 h-4 mr-2" />
          ORGO Computer Demo
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <>
          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/20 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Volume</p>
                    <p className="text-2xl font-bold text-blue-400">
                      ${metrics.totalVolume.toFixed(2)}M
                    </p>
                    <p className="text-xs text-green-400 mt-1">↗ 12.4% this week</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Transactions</p>
                    <p className="text-2xl font-bold text-green-400">
                      {metrics.transactions.toFixed(1)}K
                    </p>
                    <p className="text-xs text-green-400 mt-1">↗ 8.2% this week</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Avg. Settlement</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {metrics.avgSettlement.toFixed(1)}s
                    </p>
                    <p className="text-xs text-green-400 mt-1">↗ 15ms faster</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-orange-500/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {metrics.successRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-red-400 mt-1">↘ 0.3% from target</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Virtual Machine Status */}
          <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Server className="w-6 h-6 text-purple-400" />
                  <div>
                    <CardTitle className="text-white">Virtual Machine Orchestration</CardTitle>
                    <CardDescription className="text-gray-300">
                      Real-time monitoring of AI-powered payment infrastructure
                    </CardDescription>
                  </div>
                </div>
                <Badge className={`${apiStatus.connected ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                  <div className={`w-2 h-2 ${apiStatus.connected ? 'bg-green-300' : 'bg-red-300'} rounded-full mr-2 ${apiStatus.connected ? 'animate-pulse' : ''}`}></div>
                  {apiStatus.connected ? 'Backend Connected' : 'Backend Disconnected'}
                  {apiStatus.lastUpdate && (
                    <span className="ml-2 text-xs opacity-75">
                      Last: {apiStatus.lastUpdate}
                    </span>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vmStatus.map((vm) => {
                  const IconComponent = vm.icon;
                  return (
                    <div key={vm.id} className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{vm.name}</h3>
                          <p className="text-sm text-gray-400">{vm.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">
                          {vm.id === 'routing' && `Active: ${vm.activeTasks} tasks`}
                          {vm.id === 'risk' && `Threats: ${vm.threatsBlocked} blocked`}
                          {vm.id === 'compliance' && `Checks: ${vm.checksToday.toLocaleString()} today`}
                          {vm.id === 'treasury' && `APY: ${vm.apy.toFixed(1)}%`}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(vm.status)}`}></div>
                          <span className="text-white">{vm.performance}</span>
                          {vm.backendStatus && (
                            <span className="text-xs text-gray-400 ml-1">
                              ({vm.backendStatus})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-black/20 border-green-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                  <CardDescription className="text-gray-300">
                    Latest ORGO token transfers and burns
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Using cached data - API temporarily unavailable</span>
                </div>
              </div>
              <div className="space-y-3">
                {transactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{tx.icon}</div>
                      <div>
                        <div className="font-semibold text-white">{tx.type}</div>
                        <div className="text-sm text-gray-400">{tx.details}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount}
                      </div>
                      <div className="text-sm text-gray-400">{tx.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-black/20 border-blue-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-blue-400" />
                <div>
                  <CardTitle className="text-white">AI Insights & Recommendations</CardTitle>
                  <CardDescription className="text-gray-300">
                    Real-time analysis and actionable insights
                  </CardDescription>
                </div>
                <Badge className="bg-blue-600 text-white ml-auto">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-pulse"></div>
                  Analyzing real-time data...
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => {
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">{insight.title}</h3>
                          <p className="text-gray-300 text-sm mb-3">
                            {insight.description}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                              View Analysis
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              Apply Suggestion
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card className="bg-black/20 border-green-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-center">Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-400 mb-2">10x</div>
                  <div className="text-gray-300">Faster Settlement</div>
                  <div className="text-sm text-gray-400 mt-1">vs Traditional Banking</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">35x</div>
                  <div className="text-gray-300">Lower Fees</div>
                  <div className="text-sm text-gray-400 mt-1">vs Legacy Systems</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-400 mb-2">99.7%</div>
                  <div className="text-gray-300">Uptime</div>
                  <div className="text-sm text-gray-400 mt-1">24/7 Availability</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ORGO Computer Demo Tab */}
      {activeTab === 'demo' && (
        <OrgoComputerDemo />
      )}
    </div>
  );
};

export default VMDashboard;

