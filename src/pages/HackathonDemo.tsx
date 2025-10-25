import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mic, 
  Sparkles, 
  Coins, 
  Vote, 
  ExternalLink,
  CheckCircle,
  Info,
  Activity,
  Zap,
  Users
} from 'lucide-react';
import CoralHackathonDemo from '@/components/coral/CoralHackathonDemo';
import { coralApi } from '@/utils/coralApi';

const HackathonDemo = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiHealth, setApiHealth] = useState<any>(null);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/health');
      if (response.ok) {
        const health = await response.json();
        setApiHealth(health);
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const demoFeatures = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: 'AI Voice Processing',
      description: 'Convert voice commands to actionable blockchain intents',
      color: 'text-blue-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Multi-Agent Orchestration',
      description: 'Coordinated AI agents for complex decision making',
      color: 'text-purple-600'
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: 'Solana Integration',
      description: 'Seamless NFT minting and blockchain transactions',
      color: 'text-orange-600'
    },
    {
      icon: <Vote className="w-6 h-6" />,
      title: 'DAO Governance',
      description: 'Community voting and treasury management',
      color: 'text-green-600'
    }
  ];

  const technicalStack = [
    { category: 'Frontend', tech: 'React + TypeScript + Tailwind CSS' },
    { category: 'AI Processing', tech: 'Coral Protocol + Multi-Agent System' },
    { category: 'Blockchain', tech: 'Solana + Anchor + NFT Standards' },
    { category: 'Voice AI', tech: 'Speech Recognition + Intent Detection' },
    { category: 'Backend', tech: 'Node.js + Express + Mock Integration' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Coral Rush Hackathon Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Experience the future of Web3 with AI-powered voice commands, multi-agent orchestration, 
            and seamless Solana blockchain integration for coral conservation.
          </p>
          
          {/* Backend Status */}
          <div className="flex justify-center">
            {backendStatus === 'checking' && (
              <Badge variant="outline" className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin" />
                Checking Backend Status...
              </Badge>
            )}
            {backendStatus === 'online' && (
              <Badge variant="default" className="bg-green-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mock Backend Online
              </Badge>
            )}
            {backendStatus === 'offline' && (
              <Badge variant="destructive" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Backend Offline - Start Mock Server
              </Badge>
            )}
          </div>
        </div>

        {/* Backend Instructions */}
        {backendStatus === 'offline' && (
          <Alert className="max-w-4xl mx-auto border-orange-200 bg-orange-50">
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>To run this demo:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Open terminal in the project root directory</li>
                <li>Navigate to mock-backend: <code className="bg-orange-100 px-1 rounded">cd mock-backend</code></li>
                <li>Install dependencies: <code className="bg-orange-100 px-1 rounded">npm install</code></li>
                <li>Start mock server: <code className="bg-orange-100 px-1 rounded">npm start</code></li>
                <li>Refresh this page once the server is running on port 8080</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="demo" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="api">API Status</TabsTrigger>
          </TabsList>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            {backendStatus === 'online' ? (
              <CoralHackathonDemo />
            ) : (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Activity className="w-16 h-16 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-600">Demo Waiting for Backend</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Start the mock backend server to experience the full AI + Solana integration demo.
                  </p>
                  <Button onClick={checkBackendStatus} variant="outline">
                    Check Backend Status
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoFeatures.map((feature, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-3 ${feature.color}`}>
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Demo Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-600" />
                  Complete Demo Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold">Voice Input</h4>
                    <p className="text-sm text-gray-600">User speaks command like "Mint 3 coral NFTs"</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-purple-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold">AI Analysis</h4>
                    <p className="text-sm text-gray-600">Multi-agent system analyzes intent and parameters</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-orange-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold">Blockchain Execution</h4>
                    <p className="text-sm text-gray-600">Solana transactions executed automatically</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-green-600 font-bold">4</span>
                    </div>
                    <h4 className="font-semibold">Results</h4>
                    <p className="text-sm text-gray-600">NFTs minted, transactions confirmed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicalStack.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{item.category}</span>
                      <span className="text-gray-600">{item.tech}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Architecture Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h4 className="font-semibold text-blue-800">Frontend Layer</h4>
                    <p className="text-blue-700">React components with real-time UI updates and voice interface</p>
                  </div>
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                    <h4 className="font-semibold text-purple-800">AI Agent Layer</h4>
                    <p className="text-purple-700">Multi-agent orchestration with ProposalAgent, TreasuryAgent, VotingAgent</p>
                  </div>
                  <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold text-orange-800">Blockchain Layer</h4>
                    <p className="text-orange-700">Solana integration with NFT minting and transaction execution</p>
                  </div>
                  <div className="p-4 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold text-green-800">Mock Backend</h4>
                    <p className="text-green-700">Comprehensive API simulation for hackathon demonstrations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Status Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                {apiHealth ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="font-medium">Overall Status</span>
                      <Badge variant="default" className="bg-green-500">
                        {apiHealth.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(apiHealth.services || {}).map(([service, status]) => (
                        <div key={service} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="capitalize">{service.replace(/_/g, ' ')}</span>
                            <Badge variant={status === 'online' ? 'default' : 'secondary'}>
                              {status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">API Version</span>
                        <span className="text-blue-600">{apiHealth.version}</span>
                      </div>
                    </div>
                  </div>
                ) : backendStatus === 'offline' ? (
                  <div className="text-center py-8">
                    <ExternalLink className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Backend Not Running</h3>
                    <p className="text-gray-500">Start the mock backend to see API status information.</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Checking API Status...</h3>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle>Available Demo Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { method: 'GET', endpoint: '/health', description: 'API health check' },
                    { method: 'POST', endpoint: '/api/coral/process-voice', description: 'Process voice commands' },
                    { method: 'POST', endpoint: '/api/solana/mint-nft', description: 'Mint coral NFTs' },
                    { method: 'GET', endpoint: '/api/dao/treasury', description: 'Get treasury information' },
                    { method: 'GET', endpoint: '/api/demo/full-scenario', description: 'Complete demo scenario' }
                  ].map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono text-xs">
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.endpoint}</code>
                      </div>
                      <span className="text-sm text-gray-600">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HackathonDemo;
