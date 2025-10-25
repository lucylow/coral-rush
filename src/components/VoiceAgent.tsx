// src/components/VoiceAgent.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, CheckCircle, AlertCircle, Bot, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AgentResult {
  role: string;
  output: string;
  metadata?: {
    agent: string;
    tokens_used?: number;
    processing_time?: number;
    fallback?: boolean;
    error?: string;
  };
  error?: string;
}

interface MultiAgentResponse {
  success: boolean;
  agents: Record<string, AgentResult>;
  decision: string;
  txSignature?: string;
  explorerUrl?: string;
  timestamp: string;
  processingTimeMs?: number;
}

export default function VoiceAgent() {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MultiAgentResponse | null>(null);
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  async function executeMultiAgent() {
    if (!command.trim()) {
      toast({
        title: "Command Required",
        description: "Please enter a command or question for the agents to process",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const payload = { 
        command: command.trim(), 
        userWallet: publicKey?.toBase58(), 
        useOnChainLog: true 
      };

      console.log('🚀 Sending multi-agent request:', payload);
      
      const response = await axios.post(`${API_BASE_URL}/api/ai/execute`, payload, {
        timeout: 60000, // 1 minute timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setResult(response.data);
      
      toast({
        title: "Multi-Agent Processing Complete",
        description: `${Object.keys(response.data.agents).length} agents completed analysis`,
      });

    } catch (err: any) {
      console.error('❌ Multi-agent execution error:', err);
      
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error occurred';
      
      toast({
        title: "Multi-Agent Error",
        description: errorMessage,
        variant: "destructive"
      });

      // Set error result for display
      setResult({
        success: false,
        agents: {},
        decision: `Error: ${errorMessage}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'research': return '🔍';
      case 'summarizer': return '📝';
      case 'voting': return '🗳️';
      default: return '🤖';
    }
  };

  const getStatusBadge = (agent: AgentResult) => {
    if (agent.error) {
      return <Badge variant="destructive" className="ml-2">Failed</Badge>;
    }
    if (agent.metadata?.fallback) {
      return <Badge variant="secondary" className="ml-2">Fallback</Badge>;
    }
    return <Badge variant="default" className="ml-2">Success</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            Coral Rush — Multi-Agent AI System
          </CardTitle>
          <CardDescription>
            Powered by Swarms orchestration with on-chain logging to Solana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Command Input */}
          <div>
            <label htmlFor="command" className="block text-sm font-medium mb-2">
              Command or Question
            </label>
            <Textarea
              id="command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              rows={3}
              placeholder="Ask the multi-agent system to analyze, research, or make decisions about Web3 topics..."
              className="resize-none"
              disabled={loading}
            />
          </div>

          {/* Execute Button */}
          <div className="flex items-center justify-between">
            <Button 
              onClick={executeMultiAgent} 
              disabled={loading || !command.trim()}
              size="lg"
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  Run Multi-Agent Analysis
                </>
              )}
            </Button>

            {connected ? (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Wallet Connected
              </div>
            ) : (
              <div className="text-sm text-orange-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Connect wallet for on-chain logging
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Final Decision */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧠 Aggregated Decision
                {result.processingTimeMs && (
                  <Badge variant="outline">
                    {(result.processingTimeMs / 1000).toFixed(2)}s
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {result.decision}
                </pre>
              </div>
              
              {/* On-chain Transaction */}
              {result.txSignature && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        On-Chain Log Recorded
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Decision logged to Solana blockchain
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(result.explorerUrl, '_blank')}
                      className="flex items-center gap-2"
                    >
                      View Transaction
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-xs font-mono text-blue-600 dark:text-blue-400 break-all">
                    {result.txSignature}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Individual Agent Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(result.agents).map(([agentId, agent]) => (
              <Card key={agentId} className={agent.error ? 'border-red-200' : 'border-gray-200'}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <span className="mr-2">{getAgentIcon(agentId)}</span>
                    {agent.role || agentId}
                    {getStatusBadge(agent)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Agent Output */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-sm">
                      <pre className="whitespace-pre-wrap">
                        {agent.output || agent.error || 'No output available'}
                      </pre>
                    </div>

                    {/* Agent Metadata */}
                    {agent.metadata && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {agent.metadata.tokens_used && (
                          <div>Tokens: {agent.metadata.tokens_used}</div>
                        )}
                        {agent.metadata.processing_time && (
                          <div>Time: {agent.metadata.processing_time}ms</div>
                        )}
                        {agent.metadata.fallback && (
                          <div className="text-orange-600">⚠️ Fallback mode</div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Metadata */}
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-sm">System Information</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>Timestamp: {new Date(result.timestamp).toLocaleString()}</div>
              <div>Success: {result.success ? '✅' : '❌'}</div>
              <div>Agents Processed: {Object.keys(result.agents).length}</div>
              {result.processingTimeMs && (
                <div>Processing Time: {result.processingTimeMs}ms</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Example Commands */}
      {!result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Example Commands</CardTitle>
            <CardDescription>Try these sample commands to test the multi-agent system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Analyze the current DeFi yield farming opportunities",
                "Research the latest NFT market trends and provide investment recommendations",
                "Evaluate the risks of bridging tokens to Arbitrum",
                "Assess the security of the new Solana lending protocol"
              ].map((example, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => setCommand(example)}
                  className="text-left justify-start h-auto p-3 whitespace-normal"
                  disabled={loading}
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
