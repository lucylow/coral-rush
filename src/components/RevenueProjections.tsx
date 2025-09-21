import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Globe,
  BarChart3,
  PieChart,
  Target,
  Rocket,
  Zap,
  Building,
  ArrowUpRight,
  Calendar,
  Activity
} from "lucide-react";

interface RevenueProjection {
  period: string;
  mrr: number;
  platforms: number;
  queries: number;
  growth: number;
  market_share: number;
}

interface RevenueMetrics {
  current_mrr: number;
  target_mrr: number;
  customer_acquisition_cost: number;
  lifetime_value: number;
  churn_rate: number;
  growth_rate: number;
}

const RevenueProjections: React.FC = () => {
  const [projections, setProjections] = useState<RevenueProjection[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    current_mrr: 15000,
    target_mrr: 500000,
    customer_acquisition_cost: 250,
    lifetime_value: 8500,
    churn_rate: 0.05,
    growth_rate: 0.15
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState<'6m' | '12m' | '24m'>('12m');

  useEffect(() => {
    const generateProjections = () => {
      const baseProjections = {
        '6m': [
          { period: 'Month 1', mrr: 15000, platforms: 25, queries: 50000, growth: 0, market_share: 0.1 },
          { period: 'Month 3', mrr: 45000, platforms: 75, queries: 150000, growth: 200, market_share: 0.3 },
          { period: 'Month 6', mrr: 125000, platforms: 200, queries: 500000, growth: 733, market_share: 0.8 }
        ],
        '12m': [
          { period: 'Month 1', mrr: 15000, platforms: 25, queries: 50000, growth: 0, market_share: 0.1 },
          { period: 'Month 3', mrr: 45000, platforms: 75, queries: 150000, growth: 200, market_share: 0.3 },
          { period: 'Month 6', mrr: 125000, platforms: 200, queries: 500000, growth: 733, market_share: 0.8 },
          { period: 'Month 9', mrr: 275000, platforms: 450, queries: 1200000, growth: 1733, market_share: 1.5 },
          { period: 'Month 12', mrr: 500000, platforms: 1000, queries: 2500000, growth: 3233, market_share: 2.5 }
        ],
        '24m': [
          { period: 'Month 1', mrr: 15000, platforms: 25, queries: 50000, growth: 0, market_share: 0.1 },
          { period: 'Month 6', mrr: 125000, platforms: 200, queries: 500000, growth: 733, market_share: 0.8 },
          { period: 'Month 12', mrr: 500000, platforms: 1000, queries: 2500000, growth: 3233, market_share: 2.5 },
          { period: 'Month 18', mrr: 1250000, platforms: 2500, queries: 7500000, growth: 8233, market_share: 5.0 },
          { period: 'Month 24', mrr: 2500000, platforms: 5000, queries: 20000000, growth: 16566, market_share: 8.5 }
        ]
      };

      setProjections(baseProjections[selectedTimeframe]);
    };

    generateProjections();
  }, [selectedTimeframe]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 1000) return 'text-green-600';
    if (growth > 500) return 'text-blue-600';
    if (growth > 100) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 500) return <Rocket className="h-4 w-4" />;
    if (growth > 100) return <TrendingUp className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-900">📈 Revenue Projections</h3>
            <p className="text-emerald-700">Post-hackathon growth strategy and market expansion</p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Projection Timeline
          </h4>
          <div className="flex gap-3">
            {(['6m', '12m', '24m'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={selectedTimeframe === timeframe ? "bg-emerald-600 text-white" : ""}
              >
                {timeframe === '6m' ? '6 Months' : timeframe === '12m' ? '12 Months' : '24 Months'}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.current_mrr)}</div>
              <div className="text-sm text-gray-600">Current MRR</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-900">{formatCurrency(metrics.target_mrr)}</div>
              <div className="text-sm text-gray-600">Target MRR</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-900">{(metrics.growth_rate * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Monthly Growth</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Projections */}
        <div className="space-y-4 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Revenue Growth Projections
          </h4>
          
          <div className="grid gap-4">
            {projections.map((projection, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{projection.period}</h5>
                        <div className="flex items-center gap-2">
                          {getGrowthIcon(projection.growth)}
                          <span className={`text-sm font-medium ${getGrowthColor(projection.growth)}`}>
                            +{projection.growth.toFixed(0)}% growth
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {projection.market_share}% market share
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-3 rounded-lg text-center">
                      <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-600" />
                      <div className="text-lg font-bold text-emerald-900">{formatCurrency(projection.mrr)}</div>
                      <div className="text-xs text-emerald-700">Monthly Recurring Revenue</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-lg text-center">
                      <Building className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-lg font-bold text-blue-900">{formatNumber(projection.platforms)}</div>
                      <div className="text-xs text-blue-700">Platforms Using RUSH</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-lg text-center">
                      <Activity className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                      <div className="text-lg font-bold text-purple-900">{formatNumber(projection.queries)}</div>
                      <div className="text-xs text-purple-700">Monthly Queries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Revenue Streams */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Revenue Streams
            </h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm font-medium">Platform Subscription</span>
                  <span className="text-sm font-semibold text-blue-600">60%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm font-medium">Per-Query Pricing</span>
                  <span className="text-sm font-semibold text-green-600">25%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm font-medium">Premium Features</span>
                  <span className="text-sm font-semibold text-purple-600">10%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm font-medium">Coral Agent Rental</span>
                  <span className="text-sm font-semibold text-orange-600">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Strategy */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Post-Hackathon Go-to-Market Strategy
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Partner with 50+ Web3 platforms in Q1
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Launch Coral Registry agent marketplace
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Expand to traditional finance sector
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                International expansion (EU, APAC)
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-blue-600">${metrics.customer_acquisition_cost}</div>
            <div className="text-xs text-gray-600">Customer Acquisition Cost</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-green-600">${formatNumber(metrics.lifetime_value)}</div>
            <div className="text-xs text-gray-600">Customer Lifetime Value</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-purple-600">{(metrics.churn_rate * 100).toFixed(1)}%</div>
            <div className="text-xs text-gray-600">Monthly Churn Rate</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-orange-600">34:1</div>
            <div className="text-xs text-gray-600">LTV:CAC Ratio</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Import CheckCircle
import { CheckCircle } from "lucide-react";

export default RevenueProjections;
