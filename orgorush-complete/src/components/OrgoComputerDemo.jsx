import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { 
  Monitor, 
  Cpu, 
  Terminal, 
  Code, 
  Zap, 
  Brain, 
  Activity, 
  CheckCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Database,
  Network,
  Shield
} from 'lucide-react';

const OrgoComputerDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkActivity: 0,
    tasksCompleted: 0
  });

  const demoSteps = [
    {
      id: 1,
      title: "Initializing ORGO Computer Environment",
      description: "Starting virtual machines and AI agents",
      duration: 2000,
      icon: Monitor,
      color: "text-blue-400"
    },
    {
      id: 2,
      title: "Loading Payment Intelligence Models",
      description: "Activating fraud detection and risk analysis AI",
      duration: 1500,
      icon: Brain,
      color: "text-purple-400"
    },
    {
      id: 3,
      title: "Connecting to Solana Network",
      description: "Establishing blockchain connections and wallet access",
      duration: 1000,
      icon: Network,
      color: "text-green-400"
    },
    {
      id: 4,
      title: "Analyzing Transaction Patterns",
      description: "AI scanning for optimal routing and fee reduction",
      duration: 2500,
      icon: Activity,
      color: "text-orange-400"
    },
    {
      id: 5,
      title: "Executing Automated Workflows",
      description: "Processing payments with ORGO token burns",
      duration: 1800,
      icon: Zap,
      color: "text-yellow-400"
    },
    {
      id: 6,
      title: "Compliance & Security Checks",
      description: "Running automated regulatory compliance scans",
      duration: 1200,
      icon: Shield,
      color: "text-red-400"
    }
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-20), { timestamp, message, type }]);
  };

  const updateMetrics = () => {
    setSystemMetrics(prev => ({
      cpuUsage: Math.min(100, prev.cpuUsage + Math.random() * 15),
      memoryUsage: Math.min(100, prev.memoryUsage + Math.random() * 10),
      networkActivity: Math.random() * 100,
      tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 3)
    }));
  };

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setLogs([]);
    setSystemMetrics({ cpuUsage: 0, memoryUsage: 0, networkActivity: 0, tasksCompleted: 0 });
    
    addLog("🚀 ORGO Computer Demo Started", 'success');
    addLog("Built using ORGO Computer Environment", 'info');
    
    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      const step = demoSteps[i];
      
      addLog(`▶️ ${step.title}`, 'info');
      addLog(`   ${step.description}`, 'detail');
      
      // Simulate step execution with progress
      const stepDuration = step.duration;
      const progressInterval = stepDuration / 20;
      
      for (let progress = 0; progress <= 100; progress += 5) {
        await new Promise(resolve => setTimeout(resolve, progressInterval));
        updateMetrics();
        
        if (progress === 50) {
          addLog(`   ⚡ ${step.title} - 50% complete`, 'progress');
        }
      }
      
      addLog(`✅ ${step.title} - Completed`, 'success');
      
      // Add specific completion messages
      switch (i) {
        case 0:
          addLog("   4 Virtual Machines Online", 'detail');
          addLog("   AI Agents: ACTIVE", 'detail');
          break;
        case 1:
          addLog("   Fraud Detection: 99.5% accuracy", 'detail');
          addLog("   Risk Models: Loaded", 'detail');
          break;
        case 2:
          addLog("   Solana RPC: Connected", 'detail');
          addLog("   Wallet Balance: 2,847.39 ORGO", 'detail');
          break;
        case 3:
          addLog("   Optimal Route: SOL-PATH", 'detail');
          addLog("   Fee Savings: 40% vs Polygon", 'detail');
          break;
        case 4:
          addLog("   Payments Processed: 42", 'detail');
          addLog("   ORGO Burned: 127.35 tokens", 'detail');
          break;
        case 5:
          addLog("   Compliance Score: 100%", 'detail');
          addLog("   Jurisdictions: 120+ cleared", 'detail');
          break;
      }
    }
    
    addLog("🎉 ORGO Computer Demo Completed Successfully!", 'success');
    addLog("All systems operational and ready for production", 'info');
    setIsRunning(false);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setLogs([]);
    setSystemMetrics({ cpuUsage: 0, memoryUsage: 0, networkActivity: 0, tasksCompleted: 0 });
    addLog("🔄 Demo Reset - Ready to start", 'info');
  };

  useEffect(() => {
    // Initialize with welcome message
    addLog("💻 ORGO Computer Environment Ready", 'info');
    addLog("Click 'Start Demo' to see AI-powered payment processing", 'info');
  }, []);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'progress': return '⚡';
      case 'detail': return '   ';
      default: return 'ℹ️';
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'progress': return 'text-yellow-400';
      case 'detail': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ORGO Computer Demo
          </h2>
          <p className="text-lg text-gray-300">
            Live demonstration of AI-powered payment processing
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
            onClick={resetDemo}
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={runDemo}
            disabled={isRunning}
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Start Demo'}
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">CPU Usage</p>
                <p className="text-2xl font-bold text-blue-400">
                  {systemMetrics.cpuUsage.toFixed(1)}%
                </p>
              </div>
              <Cpu className="w-8 h-8 text-blue-400" />
            </div>
            <Progress value={systemMetrics.cpuUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Memory Usage</p>
                <p className="text-2xl font-bold text-green-400">
                  {systemMetrics.memoryUsage.toFixed(1)}%
                </p>
              </div>
              <Database className="w-8 h-8 text-green-400" />
            </div>
            <Progress value={systemMetrics.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Network Activity</p>
                <p className="text-2xl font-bold text-purple-400">
                  {systemMetrics.networkActivity.toFixed(1)}%
                </p>
              </div>
              <Network className="w-8 h-8 text-purple-400" />
            </div>
            <Progress value={systemMetrics.networkActivity} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-orange-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tasks Completed</p>
                <p className="text-2xl font-bold text-orange-400">
                  {systemMetrics.tasksCompleted}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Process */}
        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Monitor className="w-5 h-5 text-purple-400" />
              Current Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isRunning && currentStep < demoSteps.length ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {React.createElement(demoSteps[currentStep].icon, {
                    className: `w-8 h-8 ${demoSteps[currentStep].color}`
                  })}
                  <div>
                    <h3 className="font-semibold text-white">
                      {demoSteps[currentStep].title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {demoSteps[currentStep].description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">Step {currentStep + 1} of {demoSteps.length}</span>
                  </div>
                  <Progress value={(currentStep + 1) / demoSteps.length * 100} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Monitor className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  {isRunning ? 'Demo Completed!' : 'Ready to start ORGO Computer demo'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card className="bg-black/20 border-green-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Terminal className="w-5 h-5 text-green-400" />
              System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/40 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className={`mb-1 ${getLogColor(log.type)}`}>
                  <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                  <span>{getLogIcon(log.type)} {log.message}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  System logs will appear here during demo execution
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Steps Overview */}
      <Card className="bg-black/20 border-blue-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">ORGO Computer Workflow</CardTitle>
          <CardDescription className="text-gray-300">
            AI-powered payment processing pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isCompleted = !isRunning && currentStep > index;
              const isCurrent = isRunning && currentStep === index;
              
              return (
                <div 
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isCurrent 
                      ? 'border-purple-500/50 bg-purple-900/20' 
                      : isCompleted 
                        ? 'border-green-500/50 bg-green-900/20'
                        : 'border-gray-500/30 bg-gray-900/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCurrent ? 'bg-purple-500/20' : isCompleted ? 'bg-green-500/20' : 'bg-gray-500/20'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        isCurrent ? 'text-purple-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                    </div>
                    {isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {isCurrent && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />}
                  </div>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Built with ORGO */}
      <Card className="bg-black/20 border-yellow-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">Built using ORGO Computer Environment</h3>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            This demo showcases the power of ORGO's AI-driven payment intelligence platform. 
            Real-world implementation processes over $625K daily volume with 99.7% uptime and 
            sub-second settlement times across 120+ jurisdictions.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">0.3s</div>
              <div className="text-sm text-gray-400">Settlement Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">99.7%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">$625K</div>
              <div className="text-sm text-gray-400">Daily Volume</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgoComputerDemo;

