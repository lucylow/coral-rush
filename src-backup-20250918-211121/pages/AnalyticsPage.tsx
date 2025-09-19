import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, Users, Clock, Zap, Brain, Headphones, Star, AlertCircle } from "lucide-react";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("7d");
  
  // Mock analytics data
  const analytics = {
    overview: {
      totalSessions: 1247,
      successRate: 94.2,
      avgResponseTime: 18.5,
      userSatisfaction: 4.8,
      trends: {
        sessions: 12.5,
        successRate: 2.1,
        responseTime: -8.3,
        satisfaction: 0.3
      }
    },
    agents: {
      listener: {
        totalProcessed: 1247,
        avgAccuracy: 96.8,
        languagesSupported: 12,
        processingTime: 2.1,
        errorRate: 1.2
      },
      brain: {
        totalAnalyzed: 1247,
        intentAccuracy: 94.5,
        avgConfidence: 87.3,
        processingTime: 8.2,
        escalationRate: 5.8
      },
      executor: {
        totalExecuted: 1089,
        successRate: 91.7,
        nftsMinted: 342,
        avgExecutionTime: 12.8,
        chainInteractions: 1423
      }
    },
    categories: [
      { name: "Transaction Issues", count: 387, percentage: 31.0 },
      { name: "Wallet Problems", count: 298, percentage: 23.9 },
      { name: "NFT Support", count: 234, percentage: 18.8 },
      { name: "DeFi Questions", count: 156, percentage: 12.5 },
      { name: "General Help", count: 172, percentage: 13.8 }
    ],
    satisfaction: [
      { rating: 5, count: 789, percentage: 63.3 },
      { rating: 4, count: 312, percentage: 25.0 },
      { rating: 3, count: 98, percentage: 7.9 },
      { rating: 2, count: 31, percentage: 2.5 },
      { rating: 1, count: 17, percentage: 1.4 }
    ],
    performance: {
      uptime: 99.7,
      availability: 24,
      peakHours: "14:00 - 18:00 UTC",
      maintenanceWindows: 2,
      errorRate: 0.8
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : trend < 0 ? (
      <TrendingDown className="w-4 h-4 text-red-400" />
    ) : (
      <Activity className="w-4 h-4 text-gray-400" />
    );
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Analytics & Insights
              </h1>
              <p className="text-gray-400">
                Platform performance metrics and user insights
              </p>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Sessions</p>
                  <p className="text-2xl font-bold">{analytics.overview.totalSessions.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getTrendIcon(analytics.overview.trends.sessions)}
                <span className={`text-sm ${getTrendColor(analytics.overview.trends.sessions)}`}>
                  {analytics.overview.trends.sessions > 0 ? '+' : ''}{analytics.overview.trends.sessions}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">{analytics.overview.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getTrendIcon(analytics.overview.trends.successRate)}
                <span className={`text-sm ${getTrendColor(analytics.overview.trends.successRate)}`}>
                  {analytics.overview.trends.successRate > 0 ? '+' : ''}{analytics.overview.trends.successRate}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Response Time</p>
                  <p className="text-2xl font-bold">{analytics.overview.avgResponseTime}s</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getTrendIcon(analytics.overview.trends.responseTime)}
                <span className={`text-sm ${getTrendColor(analytics.overview.trends.responseTime)}`}>
                  {analytics.overview.trends.responseTime > 0 ? '+' : ''}{analytics.overview.trends.responseTime}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">User Satisfaction</p>
                  <p className="text-2xl font-bold">{analytics.overview.userSatisfaction}/5</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getTrendIcon(analytics.overview.trends.satisfaction)}
                <span className={`text-sm ${getTrendColor(analytics.overview.trends.satisfaction)}`}>
                  {analytics.overview.trends.satisfaction > 0 ? '+' : ''}{analytics.overview.trends.satisfaction}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Headphones className="w-5 h-5" />
                Listener Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Speech Accuracy</span>
                  <span className="font-medium">{analytics.agents.listener.avgAccuracy}%</span>
                </div>
                <Progress value={analytics.agents.listener.avgAccuracy} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Processed</p>
                    <p className="font-medium">{analytics.agents.listener.totalProcessed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Languages</p>
                    <p className="font-medium">{analytics.agents.listener.languagesSupported}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg Time</p>
                    <p className="font-medium">{analytics.agents.listener.processingTime}s</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Error Rate</p>
                    <p className="font-medium">{analytics.agents.listener.errorRate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Brain className="w-5 h-5" />
                Brain Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Intent Accuracy</span>
                  <span className="font-medium">{analytics.agents.brain.intentAccuracy}%</span>
                </div>
                <Progress value={analytics.agents.brain.intentAccuracy} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Analyzed</p>
                    <p className="font-medium">{analytics.agents.brain.totalAnalyzed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Confidence</p>
                    <p className="font-medium">{analytics.agents.brain.avgConfidence}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg Time</p>
                    <p className="font-medium">{analytics.agents.brain.processingTime}s</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Escalation</p>
                    <p className="font-medium">{analytics.agents.brain.escalationRate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Zap className="w-5 h-5" />
                Executor Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Success Rate</span>
                  <span className="font-medium">{analytics.agents.executor.successRate}%</span>
                </div>
                <Progress value={analytics.agents.executor.successRate} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Executed</p>
                    <p className="font-medium">{analytics.agents.executor.totalExecuted.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">NFTs Minted</p>
                    <p className="font-medium">{analytics.agents.executor.nftsMinted}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg Time</p>
                    <p className="font-medium">{analytics.agents.executor.avgExecutionTime}s</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Chain Ops</p>
                    <p className="font-medium">{analytics.agents.executor.chainInteractions.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Categories & Satisfaction */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Support Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{category.count}</span>
                        <span className="text-xs text-gray-400">({category.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>User Satisfaction Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.satisfaction.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">({item.rating} star{item.rating !== 1 ? 's' : ''})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                      <div className="text-sm font-medium w-16 text-right">
                        {item.count} ({item.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Performance */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Performance & Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-400">{analytics.performance.uptime}%</span>
                </div>
                <p className="font-medium">System Uptime</p>
                <p className="text-sm text-gray-400">Last 30 days</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-400">{analytics.performance.availability}</span>
                </div>
                <p className="font-medium">Availability</p>
                <p className="text-sm text-gray-400">Hours per day</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <p className="font-medium">Peak Hours</p>
                <p className="text-sm text-gray-400">{analytics.performance.peakHours}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-yellow-400">{analytics.performance.maintenanceWindows}</span>
                </div>
                <p className="font-medium">Maintenance</p>
                <p className="text-sm text-gray-400">Windows this month</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-400">{analytics.performance.errorRate}%</span>
                </div>
                <p className="font-medium">Error Rate</p>
                <p className="text-sm text-gray-400">System errors</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <h4 className="font-medium text-blue-300">System Status</h4>
              </div>
              <p className="text-sm text-gray-300">
                All systems operational. Next maintenance window scheduled for Sunday 02:00-04:00 UTC.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AnalyticsPage;