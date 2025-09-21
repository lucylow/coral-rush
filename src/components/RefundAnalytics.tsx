import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';

interface RefundAnalytics {
  totalRefunds: number;
  totalAmount: number;
  avgProcessingTime: number;
  successRate: number;
  methodBreakdown: {
    nft_replacement: number;
    sol_refund: number;
    token_refund: number;
  };
  statusBreakdown: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  dailyRefunds: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  topReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  processingTimeByMethod: {
    [key: string]: number;
  };
}

const RefundAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<RefundAnalytics>({
    totalRefunds: 0,
    totalAmount: 0,
    avgProcessingTime: 0,
    successRate: 0,
    methodBreakdown: { nft_replacement: 0, sol_refund: 0, token_refund: 0 },
    statusBreakdown: { pending: 0, processing: 0, completed: 0, failed: 0 },
    dailyRefunds: [],
    topReasons: [],
    processingTimeByMethod: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Simulate fetching analytics from Coral Protocol
      const mockAnalytics: RefundAnalytics = {
        totalRefunds: 247,
        totalAmount: 123.5,
        avgProcessingTime: 0.3, // seconds
        successRate: 99.7,
        methodBreakdown: {
          nft_replacement: 156,
          sol_refund: 67,
          token_refund: 24
        },
        statusBreakdown: {
          pending: 3,
          processing: 7,
          completed: 235,
          failed: 2
        },
        dailyRefunds: [
          { date: '2024-01-15', count: 12, amount: 6.0 },
          { date: '2024-01-16', count: 18, amount: 9.0 },
          { date: '2024-01-17', count: 15, amount: 7.5 },
          { date: '2024-01-18', count: 22, amount: 11.0 },
          { date: '2024-01-19', count: 19, amount: 9.5 },
          { date: '2024-01-20', count: 25, amount: 12.5 },
          { date: '2024-01-21', count: 16, amount: 8.0 }
        ],
        topReasons: [
          { reason: 'Failed mint transaction', count: 89, percentage: 36.0 },
          { reason: 'Network congestion', count: 67, percentage: 27.1 },
          { reason: 'User requested refund', count: 45, percentage: 18.2 },
          { reason: 'Double payment', count: 32, percentage: 13.0 },
          { reason: 'Smart contract error', count: 14, percentage: 5.7 }
        ],
        processingTimeByMethod: {
          nft_replacement: 0.4,
          sol_refund: 0.2,
          token_refund: 0.3
        }
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'nft_replacement': return 'text-purple-600 bg-purple-50';
      case 'sol_refund': return 'text-blue-600 bg-blue-50';
      case 'token_refund': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Refund Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time insights into NFT refund processing performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange('7d')}
            className={timeRange === '7d' ? 'bg-primary text-primary-foreground' : ''}
          >
            7 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange('30d')}
            className={timeRange === '30d' ? 'bg-primary text-primary-foreground' : ''}
          >
            30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange('90d')}
            className={timeRange === '90d' ? 'bg-primary text-primary-foreground' : ''}
          >
            90 Days
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRefunds}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAmount.toFixed(2)} SOL</div>
            <p className="text-xs text-muted-foreground">
              ${(analytics.totalAmount * 100).toFixed(2)} value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgProcessingTime}s</div>
            <p className="text-xs text-muted-foreground">
              Lightning fast processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Industry leading reliability
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Refund Methods Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Refund Methods</CardTitle>
            <CardDescription>Distribution of refund processing methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.methodBreakdown).map(([method, count]) => {
                const percentage = (count / analytics.totalRefunds) * 100;
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{method.replace('_', ' ')}</span>
                      <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Refund Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.statusBreakdown).map(([status, count]) => {
                const percentage = (count / analytics.totalRefunds) * 100;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {status === 'processing' && <RefreshCw className="h-4 w-4 text-blue-600" />}
                      {status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                      {status === 'failed' && <XCircle className="h-4 w-4 text-red-600" />}
                      <span className="capitalize">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <Badge variant="secondary" className={getStatusColor(status)}>
                        {percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Refund Reasons */}
      <Card>
        <CardHeader>
          <CardTitle>Top Refund Reasons</CardTitle>
          <CardDescription>Most common reasons for refund requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topReasons.map((reason, index) => (
              <div key={reason.reason} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span className="font-medium">{reason.reason}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{reason.count} requests</span>
                  <Badge variant="secondary">
                    {reason.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Time by Method */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Time by Method</CardTitle>
          <CardDescription>Average processing time for different refund methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.processingTimeByMethod).map(([method, time]) => (
              <div key={method} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{method.replace('_', ' ')}</span>
                  <span className="font-medium">{time}s</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(time / 1) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundAnalytics;
