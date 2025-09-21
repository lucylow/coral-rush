import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  Calculator,
  Target,
  BarChart3,
  PieChart
} from "lucide-react";

interface BusinessMetrics {
  monthlyQueries: number;
  traditionalCost: number;
  rushCost: number;
  savings: number;
  timesSaved: number;
  costReduction: number;
  productivityGain: number;
}

interface IndustryComparison {
  industry: string;
  avgCostPerTicket: number;
  avgResolutionTime: number;
  rushAdvantage: number;
}

const BusinessImpactCalculator: React.FC = () => {
  const [monthlyQueries, setMonthlyQueries] = useState(10000);
  const [selectedIndustry, setSelectedIndustry] = useState('fintech');
  
  const industryData: IndustryComparison[] = [
    {
      industry: 'fintech',
      avgCostPerTicket: 15,
      avgResolutionTime: 45,
      rushAdvantage: 150
    },
    {
      industry: 'ecommerce',
      avgCostPerTicket: 8,
      avgResolutionTime: 30,
      rushAdvantage: 100
    },
    {
      industry: 'banking',
      avgCostPerTicket: 25,
      avgResolutionTime: 60,
      rushAdvantage: 200
    },
    {
      industry: 'crypto',
      avgCostPerTicket: 35,
      avgResolutionTime: 120,
      rushAdvantage: 400
    }
  ];

  const currentIndustry = industryData.find(ind => ind.industry === selectedIndustry) || industryData[0];

  const calculateMetrics = (): BusinessMetrics => {
    const traditionalCost = monthlyQueries * currentIndustry.avgCostPerTicket;
    const rushCost = monthlyQueries * 0.50; // $0.50 per AI resolution
    const savings = traditionalCost - rushCost;
    const timesSaved = monthlyQueries * currentIndustry.avgResolutionTime; // minutes saved
    const costReduction = ((traditionalCost - rushCost) / traditionalCost) * 100;
    const productivityGain = (timesSaved / 60) * 25; // Assuming $25/hour for support staff

    return {
      monthlyQueries,
      traditionalCost,
      rushCost,
      savings,
      timesSaved: timesSaved / 60, // Convert to hours
      costReduction,
      productivityGain
    };
  };

  const metrics = calculateMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Calculator className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-900">💰 ROI Calculator</h3>
            <p className="text-green-700">Calculate your savings with RUSH voice-first customer support</p>
          </div>
        </div>

        {/* Industry Selection */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Select Your Industry
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {industryData.map((industry) => (
              <button
                key={industry.industry}
                onClick={() => setSelectedIndustry(industry.industry)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedIndustry === industry.industry
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="text-sm font-medium capitalize">{industry.industry}</div>
                <div className="text-xs text-gray-500">${industry.avgCostPerTicket}/ticket</div>
              </button>
            ))}
          </div>
        </div>

        {/* Query Volume Slider */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Monthly Support Queries
          </h4>
          <div className="space-y-4">
            <Slider
              value={[monthlyQueries]}
              onValueChange={(value) => setMonthlyQueries(value[0])}
              max={100000}
              min={1000}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>1,000 queries</span>
              <span className="font-semibold text-lg text-blue-600">
                {formatNumber(monthlyQueries)} queries/month
              </span>
              <span>100,000 queries</span>
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4">
              <h5 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Traditional Support Costs
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost per ticket:</span>
                  <span className="font-semibold">${currentIndustry.avgCostPerTicket}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly cost:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(metrics.traditionalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Annual cost:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(metrics.traditionalCost * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolution time:</span>
                  <span className="font-semibold">{currentIndustry.avgResolutionTime} min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                RUSH Support Costs
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost per query:</span>
                  <span className="font-semibold">$0.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly cost:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(metrics.rushCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Annual cost:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(metrics.rushCost * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolution time:</span>
                  <span className="font-semibold">0.3 seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Display */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg text-center border border-green-300">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-900">{formatCurrency(metrics.savings)}</div>
            <div className="text-sm text-green-700">Monthly Savings</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg text-center border border-blue-300">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-900">{metrics.timesSaved.toFixed(0)}h</div>
            <div className="text-sm text-blue-700">Time Saved</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-lg text-center border border-purple-300">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-900">{metrics.costReduction.toFixed(1)}%</div>
            <div className="text-sm text-purple-700">Cost Reduction</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-lg text-center border border-orange-300">
            <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-900">{formatCurrency(metrics.productivityGain)}</div>
            <div className="text-sm text-orange-700">Productivity Gain</div>
          </div>
        </div>

        {/* Annual Projections */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Annual Projections
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(metrics.savings * 12)}</div>
                <div className="text-xs text-gray-600">Annual Savings</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(metrics.productivityGain * 12)}</div>
                <div className="text-xs text-gray-600">Productivity Value</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{formatNumber(metrics.timesSaved * 12)}h</div>
                <div className="text-xs text-gray-600">Hours Saved</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{formatNumber(metrics.monthlyQueries * 12)}</div>
                <div className="text-xs text-gray-600">Annual Queries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitive Advantage */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            RUSH Competitive Advantages
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {currentIndustry.rushAdvantage}x faster than industry average
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {metrics.costReduction.toFixed(1)}% cost reduction
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Voice-first natural language interface
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                AI-powered fraud detection included
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Import CheckCircle
import { CheckCircle } from "lucide-react";

export default BusinessImpactCalculator;
