import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import RefundAnalytics from './RefundAnalytics';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  User, 
  Calendar,
  ExternalLink,
  Copy,
  AlertTriangle,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';

interface RefundRequest {
  id: string;
  userId: string;
  userName: string;
  nftId: string;
  nftName: string;
  nftImage: string;
  originalPrice: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  createdAt: string;
  processedAt?: string;
  transactionHash?: string;
  refundMethod: 'nft_replacement' | 'sol_refund' | 'token_refund';
}

interface RefundStats {
  totalRefunds: number;
  totalAmount: number;
  pendingRefunds: number;
  avgProcessingTime: string;
  successRate: number;
}

const NFTRefunds: React.FC = () => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [stats, setStats] = useState<RefundStats>({
    totalRefunds: 0,
    totalAmount: 0,
    pendingRefunds: 0,
    avgProcessingTime: '0.3s',
    successRate: 99.7
  });
  const [newRequest, setNewRequest] = useState({
    nftId: '',
    reason: '',
    refundMethod: 'nft_replacement' as const
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockRefunds: RefundRequest[] = [
      {
        id: 'REF-001',
        userId: 'user_123',
        userName: 'Sarah Chen',
        nftId: 'NFT-456',
        nftName: 'Coral Rush Genesis',
        nftImage: '/placeholder.svg',
        originalPrice: 0.5,
        refundAmount: 0.5,
        reason: 'Failed mint transaction - network congestion',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        processedAt: '2024-01-15T10:30:15Z',
        transactionHash: '0x1234...abcd',
        refundMethod: 'nft_replacement'
      },
      {
        id: 'REF-002',
        userId: 'user_789',
        userName: 'Mike Rodriguez',
        nftId: 'NFT-789',
        nftName: 'Ocean Guardian',
        nftImage: '/placeholder.svg',
        originalPrice: 1.2,
        refundAmount: 1.2,
        reason: 'Double payment due to UI glitch',
        status: 'processing',
        createdAt: '2024-01-15T14:22:00Z',
        refundMethod: 'sol_refund'
      },
      {
        id: 'REF-003',
        userId: 'user_456',
        userName: 'Emma Wilson',
        nftId: 'NFT-321',
        nftName: 'Deep Sea Explorer',
        nftImage: '/placeholder.svg',
        originalPrice: 0.8,
        refundAmount: 0.8,
        reason: 'User requested refund within 24h policy',
        status: 'pending',
        createdAt: '2024-01-15T16:45:00Z',
        refundMethod: 'nft_replacement'
      },
      {
        id: 'REF-004',
        userId: 'user_999',
        userName: 'Alex Kim',
        nftId: 'NFT-654',
        nftName: 'Coral Reef Master',
        nftImage: '/placeholder.svg',
        originalPrice: 2.0,
        refundAmount: 2.0,
        reason: 'Smart contract error - invalid metadata',
        status: 'approved',
        createdAt: '2024-01-15T18:10:00Z',
        refundMethod: 'token_refund'
      }
    ];

    setRefundRequests(mockRefunds);
    
    // Calculate stats
    const totalAmount = mockRefunds.reduce((sum, req) => sum + req.refundAmount, 0);
    const pendingCount = mockRefunds.filter(req => req.status === 'pending').length;
    
    setStats({
      totalRefunds: mockRefunds.length,
      totalAmount,
      pendingRefunds: pendingCount,
      avgProcessingTime: '0.3s',
      successRate: 99.7
    });
  }, []);

  const handleSubmitRefund = async () => {
    if (!newRequest.nftId || !newRequest.reason) return;
    
    setIsProcessing(true);
    
    try {
      // Call Coral Protocol executor agent for NFT refund processing
      const response = await fetch((import.meta.env.VITE_CORAL_API_URL || 'http://localhost:8080') + '/api/coral/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_CORAL_API_KEY || 'demo_key'}`
        },
        body: JSON.stringify({
          message: `Process NFT refund for ${newRequest.nftId} using ${newRequest.refundMethod}`,
          session_id: `refund_session_${Date.now()}`,
          context: {
            refund_request: {
              nft_id: newRequest.nftId,
              refund_method: newRequest.refundMethod,
              reason: newRequest.reason,
              user_wallet: 'current_user_wallet'
            }
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Coral Protocol API error: ${response.status}`);
      }
      
      const coralResult = await response.json();
      
      // Extract refund result from Coral response
      const refundResult = coralResult.extracted_entities?.refund_result || {
        refund_request_id: `REF-${Date.now()}`,
        status: 'processing'
      };
      
      const newRefund: RefundRequest = {
        id: refundResult.refund_request_id || `REF-${String(refundRequests.length + 1).padStart(3, '0')}`,
        userId: 'current_user',
        userName: 'Current User',
        nftId: newRequest.nftId,
        nftName: `NFT-${newRequest.nftId}`,
        nftImage: '/placeholder.svg',
        originalPrice: 0.5,
        refundAmount: 0.5,
        reason: newRequest.reason,
        status: refundResult.status || 'processing',
        createdAt: new Date().toISOString(),
        refundMethod: newRequest.refundMethod
      };
      
      setRefundRequests(prev => [newRefund, ...prev]);
      setNewRequest({ nftId: '', reason: '', refundMethod: 'nft_replacement' });
      
      // Show success message
      toast.success('🌊 Refund request submitted via Coral Protocol agents!');
      
    } catch (error) {
      console.error('Refund processing error:', error);
      
      // Fallback to mock processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRefund: RefundRequest = {
        id: `REF-${String(refundRequests.length + 1).padStart(3, '0')}`,
        userId: 'current_user',
        userName: 'Current User',
        nftId: newRequest.nftId,
        nftName: `NFT-${newRequest.nftId}`,
        nftImage: '/placeholder.svg',
        originalPrice: 0.5,
        refundAmount: 0.5,
        reason: newRequest.reason,
        status: 'processing',
        createdAt: new Date().toISOString(),
        refundMethod: newRequest.refundMethod
      };
      
      setRefundRequests(prev => [newRefund, ...prev]);
      setNewRequest({ nftId: '', reason: '', refundMethod: 'nft_replacement' });
      
      toast.warning('⚠️ Using fallback refund processing - Coral Protocol unavailable');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: RefundRequest['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'approved': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: RefundRequest['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container-responsive section-responsive">
      <div className="mb-8">
        <h1 className="heading-responsive font-bold mb-2">🌊 NFT Refunds & Support</h1>
        <p className="text-responsive text-muted-foreground">
          Instant NFT refunds powered by Coral Protocol multi-agent orchestration
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="outline" className="bg-blue-50 border-blue-200">
            <Shield className="h-3 w-3 mr-1" />
            Crossmint Integration
          </Badge>
          <Badge variant="outline" className="bg-green-50 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Processing
          </Badge>
          <Badge variant="outline" className="bg-purple-50 border-purple-200">
            <RefreshCw className="h-3 w-3 mr-1" />
            Multi-Agent Orchestration
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid-responsive mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRefunds}</div>
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
            <div className="text-2xl font-bold">{stats.totalAmount.toFixed(2)} SOL</div>
            <p className="text-xs text-muted-foreground">
              Refunded to users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRefunds}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Avg processing: {stats.avgProcessingTime}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Refund Requests</TabsTrigger>
          <TabsTrigger value="new">New Request</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="space-y-4">
            {refundRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        NFT
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{request.nftName}</h3>
                          <Badge className={cn("text-white", getStatusColor(request.status))}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{request.status}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                          <div>
                            <span className="font-medium">User:</span> {request.userName}
                          </div>
                          <div>
                            <span className="font-medium">Amount:</span> {request.refundAmount} SOL
                          </div>
                          <div>
                            <span className="font-medium">Method:</span> {request.refundMethod.replace('_', ' ')}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          <span className="font-medium">Reason:</span> {request.reason}
                        </p>
                        
                        {request.transactionHash && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Transaction:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {request.transactionHash}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(request.transactionHash!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {request.status === 'pending' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Zap className="h-4 w-4 mr-1" />
                          Process
                        </Button>
                      )}
                      {request.status === 'processing' && (
                        <Button size="sm" variant="outline" disabled>
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          Processing...
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit New Refund Request</CardTitle>
              <CardDescription>
                Request a refund for your NFT purchase. Our AI agents will process it instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nftId">NFT ID</Label>
                <Input
                  id="nftId"
                  placeholder="Enter NFT ID or transaction hash"
                  value={newRequest.nftId}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, nftId: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Refund</Label>
                <Textarea
                  id="reason"
                  placeholder="Describe why you need a refund..."
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="method">Refund Method</Label>
                <Select
                  value={newRequest.refundMethod}
                  onValueChange={(value: any) => setNewRequest(prev => ({ ...prev, refundMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nft_replacement">Mint Replacement NFT</SelectItem>
                    <SelectItem value="sol_refund">SOL Refund</SelectItem>
                    <SelectItem value="token_refund">Token Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleSubmitRefund}
                disabled={isProcessing || !newRequest.nftId || !newRequest.reason}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing Request...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Submit Refund Request
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Refund Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold">8 refunds</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">32 refunds</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Processing Time</span>
                    <span className="font-semibold text-green-600">0.3s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-semibold text-green-600">98.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Refund Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Network congestion</span>
                    <Badge variant="secondary">35%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>UI glitches</span>
                    <Badge variant="secondary">25%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>User requests</span>
                    <Badge variant="secondary">20%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Smart contract errors</span>
                    <Badge variant="secondary">15%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Other</span>
                    <Badge variant="secondary">5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <RefundAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFTRefunds;
