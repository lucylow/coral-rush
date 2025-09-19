import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Brain, Zap, Shield, Search, Plus, CheckCircle, Download, Code, Play, Globe } from "lucide-react";
import { coralApi, CoralAgentRegistry } from "@/utils/coralApi";

const AgentRegistry = () => {
  const [agents, setAgents] = useState<CoralAgentRegistry[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<CoralAgentRegistry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CoralAgentRegistry | null>(null);
  const [integrationMode, setIntegrationMode] = useState<'discover' | 'integrate'>('discover');

  // Enhanced agents for the Coral Registry with real integration capabilities
  const predefinedAgents: CoralAgentRegistry[] = [
    {
      id: 'coral-payment-agent-v1',
      name: 'Cross-Border Payment Agent',
      description: 'AI-powered payment processing with fraud detection and sub-second settlement. Built for Coral Protocol ecosystem.',
      capabilities: ['cross-border-payments', 'fraud-detection', 'sub-second-settlement', 'multi-currency-support', 'orgo-token-burning'],
      endpoint: '/api/agents/coral-payment-agent-v1',
      version: '1.0.0',
      category: 'payment',
      isActive: true,
      metrics: {
        total_uses: 1247,
        success_rate: 99.5,
        avg_response_time: 320,
        last_used: '2024-01-15T10:30:00Z'
      },
      integration_code: `// Coral Protocol Payment Agent Integration
import { CoralAgent } from '@coral-protocol/sdk';

const paymentAgent = new CoralAgent('coral-payment-agent-v1');

const result = await paymentAgent.call({
  action: 'process_payment',
  payment_request: {
    amount: 1000,
    currency_from: 'USD',
    currency_to: 'PHP',
    recipient: 'Philippines',
    purpose: 'Family support',
    session_id: 'unique_session_id'
  }
});

console.log('Payment result:', result);`
    },
    {
      id: 'coral-voice-agent-v1',
      name: 'Voice Interface Agent',
      description: 'Real-time voice processing with STT/TTS capabilities using LiveKit integration.',
      capabilities: ['speech-to-text', 'text-to-speech', 'voice-synthesis', 'real-time-processing', 'livekit-integration'],
      endpoint: '/api/agents/coral-voice-agent-v1',
      version: '1.0.0',
      category: 'voice',
      isActive: true,
      metrics: {
        total_uses: 892,
        success_rate: 98.2,
        avg_response_time: 150,
        last_used: '2024-01-15T09:45:00Z'
      },
      integration_code: `// Coral Protocol Voice Agent Integration
import { CoralAgent } from '@coral-protocol/sdk';

const voiceAgent = new CoralAgent('coral-voice-agent-v1');

const result = await voiceAgent.call({
  action: 'process_voice',
  audio_data: audioBlob,
  session_id: 'voice_session_001'
});

console.log('Voice result:', result);`
    },
    {
      id: 'coral-fraud-detector-v1',
      name: 'AI Fraud Detection Agent',
      description: 'Real-time fraud detection with 99.5% accuracy using machine learning models.',
      capabilities: ['fraud-detection', 'risk-assessment', 'compliance-checking', 'pattern-analysis', 'ml-models'],
      endpoint: '/api/agents/coral-fraud-detector-v1',
      version: '1.0.0',
      category: 'fraud-detection',
      isActive: true,
      metrics: {
        total_uses: 2156,
        success_rate: 99.8,
        avg_response_time: 45,
        last_used: '2024-01-15T11:15:00Z'
      },
      integration_code: `// Coral Protocol Fraud Detection Agent Integration
import { CoralAgent } from '@coral-protocol/sdk';

const fraudAgent = new CoralAgent('coral-fraud-detector-v1');

const result = await fraudAgent.call({
  action: 'detect_fraud',
  transaction_data: {
    amount: 1000,
    currency: 'USD',
    recipient_country: 'PH',
    user_history: userData
  }
});

console.log('Fraud score:', result.fraud_score);`
    },
    {
      id: 'coral-intent-analyzer-v1',
      name: 'Intent Analysis Agent',
      description: 'Natural language understanding and intent detection powered by Coral Protocol AI.',
      capabilities: ['intent-analysis', 'nlp', 'context-understanding', 'semantic-analysis', 'coral-ai'],
      endpoint: '/api/agents/coral-intent-analyzer-v1',
      version: '1.0.0',
      category: 'analytics',
      isActive: true,
      metrics: {
        total_uses: 1834,
        success_rate: 97.8,
        avg_response_time: 200,
        last_used: '2024-01-15T08:20:00Z'
      },
      integration_code: `// Coral Protocol Intent Analysis Agent Integration
import { CoralAgent } from '@coral-protocol/sdk';

const intentAgent = new CoralAgent('coral-intent-analyzer-v1');

const result = await intentAgent.call({
  action: 'analyze_intent',
  text: 'Send $1000 to Philippines',
  context: 'payment_request'
});

console.log('Detected intent:', result.intent);`
    }
  ];

  useEffect(() => {
    setAgents(predefinedAgents);
    setFilteredAgents(predefinedAgents);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let filtered = agents;
    
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(agent => agent.category === categoryFilter);
    }
    
    setFilteredAgents(filtered);
  }, [searchTerm, categoryFilter, agents]);

  const registerAgents = async () => {
    setIsRegistering(true);
    try {
      const success = await coralApi.registerAgents(predefinedAgents);
      if (success) {
        // Show success feedback
        setTimeout(() => setIsRegistering(false), 2000);
      }
    } catch (error) {
      console.error('Failed to register agents:', error);
      setIsRegistering(false);
    }
  };

  const testAgent = async (agent: CoralAgentRegistry) => {
    try {
      const response = await fetch('/api/coral/test-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agent.id,
          test_data: {
            action: 'test',
            test_input: 'Sample test data'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Agent test successful: ${JSON.stringify(result)}`);
      } else {
        alert('Agent test failed');
      }
    } catch (error) {
      console.error('Agent test error:', error);
      alert('Agent test error');
    }
  };

  const getAgentIcon = (category: string) => {
    switch (category) {
      case 'voice': return <Mic className="h-5 w-5" />;
      case 'analytics': return <Brain className="h-5 w-5" />;
      case 'payment': return <Zap className="h-5 w-5" />;
      case 'fraud-detection': return <Shield className="h-5 w-5" />;
      default: return <Mic className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'voice': return 'bg-blue-500';
      case 'analytics': return 'bg-purple-500';
      case 'payment': return 'bg-green-500';
      case 'fraud-detection': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            🌊 Coral Protocol Agent Registry
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Discover and register AI agents for multi-agent orchestration. 
            These agents are available for use in Coral Protocol workflows.
          </p>
        </CardHeader>
        <CardContent>
          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant={integrationMode === 'discover' ? 'default' : 'outline'}
              onClick={() => setIntegrationMode('discover')}
            >
              <Search className="h-4 w-4 mr-2" />
              Discover Agents
            </Button>
            <Button
              variant={integrationMode === 'integrate' ? 'default' : 'outline'}
              onClick={() => setIntegrationMode('integrate')}
            >
              <Code className="h-4 w-4 mr-2" />
              Integration Mode
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={registerAgents}
              disabled={isRegistering}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRegistering ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
                  Registering Agents...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Register All Agents
                </>
              )}
            </Button>
            <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600">
              {agents.length} Agents Available
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search agents by name, description, or capabilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="voice">Voice Processing</SelectItem>
                <SelectItem value="analytics">Analytics & AI</SelectItem>
                <SelectItem value="payment">Payment Processing</SelectItem>
                <SelectItem value="fraud-detection">Fraud Detection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <Card 
            key={agent.id} 
            className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedAgent(agent)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(agent.category)}`}>
                  {getAgentIcon(agent.category)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm text-white">{agent.name}</CardTitle>
                  <p className="text-xs text-gray-400">{agent.description}</p>
                </div>
                <Badge variant={agent.isActive ? 'default' : 'secondary'} className="text-xs">
                  {agent.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Agent Metrics */}
                {agent.metrics && (
                  <div className="p-2 bg-gray-800/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Uses:</span>
                        <span className="text-white ml-1">{agent.metrics.total_uses}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Success:</span>
                        <span className="text-green-400 ml-1">{agent.metrics.success_rate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Time:</span>
                        <span className="text-blue-400 ml-1">{agent.metrics.avg_response_time}ms</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Used:</span>
                        <span className="text-gray-300 ml-1">
                          {new Date(agent.metrics.last_used).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-medium text-gray-400">Capabilities</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.capabilities.slice(0, 3).map((capability, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
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
                
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>v{agent.version}</span>
                  <span className="capitalize">{agent.category}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-xs text-gray-400">Endpoint: {agent.endpoint}</span>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        testAgent(agent);
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(agent.integration_code || '');
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="text-center py-8">
            <p className="text-gray-400">No agents found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Agent Details Modal */}
      {selectedAgent && (
        <Card className="fixed inset-4 z-50 bg-gray-900 border-gray-700 backdrop-blur-sm overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getCategoryColor(selectedAgent.category)}`}>
                  {getAgentIcon(selectedAgent.category)}
                </div>
                <div>
                  <CardTitle className="text-white">{selectedAgent.name}</CardTitle>
                  <p className="text-gray-400">Version {selectedAgent.version}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{selectedAgent.description}</p>
            </div>
            
            {/* Agent Metrics */}
            {selectedAgent.metrics && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{selectedAgent.metrics.total_uses}</div>
                    <div className="text-sm text-gray-400">Total Uses</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{selectedAgent.metrics.success_rate}%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{selectedAgent.metrics.avg_response_time}ms</div>
                    <div className="text-sm text-gray-400">Avg Response</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-sm font-bold text-orange-400">
                      {new Date(selectedAgent.metrics.last_used).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-400">Last Used</div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">All Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.capabilities.map((capability, idx) => (
                  <Badge key={idx} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Integration Details</h3>
              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Agent ID:</span>
                  <span className="text-white font-mono">{selectedAgent.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Endpoint:</span>
                  <span className="text-white font-mono">{selectedAgent.endpoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`${selectedAgent.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedAgent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Integration Code */}
            {selectedAgent.integration_code && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Integration Code</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{selectedAgent.integration_code}</code>
                  </pre>
                </div>
                <Button 
                  className="mt-2" 
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(selectedAgent.integration_code || '')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button className="bg-primary hover:bg-primary/80">
                <Globe className="h-4 w-4 mr-2" />
                Integrate Agent
              </Button>
              <Button variant="outline" onClick={() => testAgent(selectedAgent)}>
                <Play className="h-4 w-4 mr-2" />
                Test Agent
              </Button>
              <Button variant="outline">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentRegistry;
