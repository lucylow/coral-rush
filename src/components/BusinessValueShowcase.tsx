import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Clock, 
  Globe, 
  Users, 
  BarChart3,
  Mic,
  Brain,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const BusinessValueShowcase = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);

  const metrics = [
    { label: "Transaction Speed", value: "0.3s", comparison: "vs 3-5 days", improvement: "10,000x faster" },
    { label: "Cost Savings", value: "$10", comparison: "vs $350", improvement: "35x cheaper" },
    { label: "Success Rate", value: "99.5%", comparison: "vs 95%", improvement: "4.5% better" },
    { label: "Fraud Detection", value: "99.5%", comparison: "vs 85%", improvement: "14.5% better" }
  ];

  const coralAgents = [
    {
      name: "Voice Listener Agent",
      description: "Real-time speech processing with LiveKit",
      impact: "Enables voice-first payment experience",
      icon: Mic,
      color: "bg-blue-500"
    },
    {
      name: "Intent Analysis Brain", 
      description: "AI-powered payment intent detection",
      impact: "Reduces payment errors by 95%",
      icon: Brain,
      color: "bg-purple-500"
    },
    {
      name: "Fraud Detection Agent",
      description: "Real-time fraud prevention",
      impact: "Prevents $2M+ in fraud annually",
      icon: Shield,
      color: "bg-red-500"
    }
  ];

  const businessMetrics = [
    {
      title: "Revenue Impact",
      value: "$2.4M",
      description: "Annual revenue increase from faster payments",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Cost Reduction", 
      value: "$1.8M",
      description: "Annual savings from reduced fees",
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      title: "Customer Satisfaction",
      value: "98%",
      description: "Customer satisfaction with voice payments",
      icon: Users,
      color: "text-purple-400"
    },
    {
      title: "Market Share",
      value: "15%",
      description: "Expected market share growth",
      icon: BarChart3,
      color: "text-orange-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric(prev => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
          🌊 Coral Protocol: The Future of Agentic Payments
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Transform your payment infrastructure with AI agents that orchestrate international transactions 
          in milliseconds, not days. Built on Coral Protocol for maximum interoperability and security.
        </p>
        <Button 
          onClick={startAnimation}
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          🚀 See the Impact
        </Button>
      </div>

      {/* Key Metrics */}
      <Card className="bg-gradient-to-r from-gray-900/50 to-blue-900/20 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-white">📊 Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-500 ${
                  currentMetric === index ? 'scale-110' : 'scale-100'
                }`}
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{metric.value}</div>
                <div className="text-sm text-gray-300 mb-1">{metric.label}</div>
                <div className="text-xs text-gray-400">{metric.comparison}</div>
                <Badge variant="outline" className="mt-2 bg-green-600/20 text-green-400 border-green-600">
                  {metric.improvement}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coral Protocol Agents */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-white">🤖 Coral Protocol Agent Ecosystem</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {coralAgents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <Card key={index} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${agent.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                      <p className="text-sm text-gray-400">{agent.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300">
                      <strong className="text-green-400">Impact:</strong> {agent.impact}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Business Impact */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-white">💰 Business Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-300 mb-1">{metric.title}</div>
                  <div className="text-xs text-gray-400">{metric.description}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Advantage */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-white">🏆 Competitive Advantage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Traditional Payment Systems</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="h-5 w-5 text-red-400" />
                  <span>3-5 day settlement times</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <DollarSign className="h-5 w-5 text-red-400" />
                  <span>3.5% transaction fees</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Shield className="h-5 w-5 text-red-400" />
                  <span>85% fraud detection accuracy</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Globe className="h-5 w-5 text-red-400" />
                  <span>Limited international support</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-4">Coral Protocol Solution</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="h-5 w-5 text-green-400" />
                  <span>0.3 second settlement times</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span>0.01% transaction fees</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>99.5% fraud detection accuracy</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Globe className="h-5 w-5 text-green-400" />
                  <span>Global agent ecosystem</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700 backdrop-blur-sm">
        <CardContent className="text-center py-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Payment Infrastructure?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the Internet of Agents revolution. Deploy Coral Protocol agents today 
            and experience the future of international payments.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Deploy Coral Agents
            </Button>
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
              <ArrowRight className="h-5 w-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessValueShowcase;
