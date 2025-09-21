import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Shield,
  Star,
  MessageSquare,
  RefreshCw,
  Headphones,
  Bot
} from 'lucide-react';
import NFTRefunds from './NFTRefunds';
import CustomerSupport from './CustomerSupport';

interface DashboardStats {
  totalTickets: number;
  resolvedToday: number;
  avgResponseTime: string;
  customerSatisfaction: number;
  aiResolvedPercentage: number;
  totalRefunds: number;
  refundAmount: number;
  refundSuccessRate: number;
}

const SupportDashboard: React.FC = () => {
  const [stats] = useState<DashboardStats>({
    totalTickets: 156,
    resolvedToday: 23,
    avgResponseTime: '0.3s',
    customerSatisfaction: 98.7,
    aiResolvedPercentage: 89.2,
    totalRefunds: 47,
    refundAmount: 23.5,
    refundSuccessRate: 99.7
  });

  return (
    <div className="container-responsive section-responsive">
      <div className="mb-8">
        <h1 className="heading-responsive font-bold mb-2">🌊 Coral Protocol Support Center</h1>
        <p className="text-responsive text-muted-foreground">
          Multi-agent AI orchestration for Web3 customer support powered by Coral Protocol
        </p>
        <div className="mt-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-lg p-4 border border-blue-700/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-300">Coral Protocol Agents Active</span>
          </div>
          <p className="text-sm text-gray-300">
            Our voice-first support system uses specialized AI agents working in harmony through Coral Protocol's 
            multi-agent orchestration framework. Experience lightning-fast response times and intelligent problem resolution.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid-responsive mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Support Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              {stats.aiResolvedPercentage}% by AI
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Lightning fast
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerSatisfaction}%</div>
            <p className="text-xs text-muted-foreground">
              Excellent rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRefunds}</div>
            <p className="text-xs text-muted-foreground">
              {stats.refundAmount} SOL refunded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refund Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.refundSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">
              Near perfect
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coral Protocol Agent Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-400" />
            <span>Coral Protocol Agent Orchestration</span>
            <Badge variant="outline" className="ml-2 border-blue-500/50 text-blue-400">
              Multi-Agent System
            </Badge>
          </CardTitle>
          <CardDescription>
            Real-time status of Coral Protocol's specialized AI agents working in coordination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-500/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-green-400">Voice Listener Agent</p>
                <p className="text-sm text-muted-foreground">Processing voice commands</p>
                <p className="text-xs text-green-300">Coral Protocol v2.1</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-500/20">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-blue-400">Intent Analysis Agent</p>
                <p className="text-sm text-muted-foreground">Understanding user intent</p>
                <p className="text-xs text-blue-300">Claude 3.5 Sonnet</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-500/20">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-purple-400">Fraud Detection Agent</p>
                <p className="text-sm text-muted-foreground">Real-time risk assessment</p>
                <p className="text-xs text-purple-300">99.5% accuracy</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-500/20">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-orange-400">Payment Processor Agent</p>
                <p className="text-sm text-muted-foreground">Executing Solana transactions</p>
                <p className="text-xs text-orange-300">0.3s settlement</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-300 mb-1">Coral Protocol Features</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Multi-agent orchestration and coordination</li>
                  <li>• Real-time agent communication and handoffs</li>
                  <li>• Intelligent routing and load balancing</li>
                  <li>• Secure agent-to-agent messaging</li>
                </ul>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">4</div>
                <div className="text-sm text-gray-400">Active Agents</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="support" className="flex items-center space-x-2">
            <Headphones className="h-4 w-4" />
            <span>Customer Support</span>
          </TabsTrigger>
          <TabsTrigger value="refunds" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>NFT Refunds</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="support">
          <CustomerSupport />
        </TabsContent>

        <TabsContent value="refunds">
          <NFTRefunds />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportDashboard;
