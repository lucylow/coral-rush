import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { APITester, APIHealthStatus, APITestResult } from '@/utils/apiTestUtils';

const ApiHealthDashboard: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<APIHealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { toast } = useToast();

  const apiTester = APITester.getInstance();

  const checkAPIs = async () => {
    setIsLoading(true);
    try {
      const status = await apiTester.testAllAPIs();
      setHealthStatus(status);
      setLastRefresh(new Date());
      
      toast({
        title: "API Health Check Complete",
        description: `Overall status: ${status.overall.toUpperCase()}`,
      });
    } catch (error) {
      console.error('API health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAPIs();
  }, []);

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatResponseTime = (time: number) => {
    if (time < 1000) {
      return `${time}ms`;
    }
    return `${(time / 1000).toFixed(1)}s`;
  };

  const renderAPIDetails = (result: APITestResult) => {
    if (!result.details) return null;

    return (
      <div className="mt-2 text-xs text-muted-foreground space-y-1">
        {result.details.model && <div>Model: {result.details.model}</div>}
        {result.details.voice_id && <div>Voice: {result.details.voice_id}</div>}
        {result.details.api_used && <div>API: {result.details.api_used}</div>}
        {result.details.intent && <div>Intent: {result.details.intent}</div>}
        {result.details.emotion && <div>Emotion: {result.details.emotion}</div>}
        {result.details.confidence && (
          <div>Confidence: {Math.round(result.details.confidence * 100)}%</div>
        )}
        {result.details.audio_size && (
          <div>Audio Size: {Math.round(result.details.audio_size / 1024)}KB</div>
        )}
        {result.details.response_length && (
          <div>Response Length: {result.details.response_length} chars</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              API Health Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastRefresh && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={checkAPIs}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {healthStatus && (
            <div className="space-y-4">
              {/* Overall Status */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Overall Status:</span>
                  <Badge 
                    className={`${
                      healthStatus.overall === 'healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : healthStatus.overall === 'degraded'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {apiTester.getHealthStatusIcon(healthStatus.overall)} {healthStatus.overall.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {healthStatus.apis.filter(api => api.success).length} / {healthStatus.apis.length} APIs healthy
                </div>
              </div>

              {/* Individual API Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthStatus.apis.map((api) => (
                  <Card key={api.api} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(api.success)}
                          <span className="font-medium">{api.api}</span>
                        </div>
                        <Badge className={getStatusColor(api.success)}>
                          {api.success ? 'Healthy' : 'Failed'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        Response Time: {formatResponseTime(api.responseTime)}
                      </div>
                      
                      {api.error && (
                        <div className="text-sm text-red-600 mb-2">
                          Error: {api.error}
                        </div>
                      )}
                      
                      {renderAPIDetails(api)}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {healthStatus.apis.filter(api => api.success).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Healthy APIs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {healthStatus.apis.filter(api => !api.success).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Failed APIs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(healthStatus.apis.reduce((acc, api) => acc + api.responseTime, 0) / healthStatus.apis.length)}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Response Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((healthStatus.apis.filter(api => api.success).length / healthStatus.apis.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {healthStatus.overall !== 'healthy' && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="h-5 w-5" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {healthStatus.apis.filter(api => !api.success).map(api => (
                        <li key={api.api}>
                          • {api.api}: {api.error || 'Check API configuration and try again'}
                        </li>
                      ))}
                      <li>• Verify all API keys are properly configured in Supabase secrets</li>
                      <li>• Check network connectivity and firewall settings</li>
                      <li>• Review API rate limits and quotas</li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiHealthDashboard;

