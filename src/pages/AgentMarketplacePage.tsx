import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Search, Filter, Zap, Shield, Coins, FileText, Brain, Headphones, Users, TrendingUp, ExternalLink, Play } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  category: 'defi' | 'nft' | 'wallet' | 'trading' | 'security' | 'general';
  specialty: string;
  description: string;
  avatar: string;
  rating: number;
  totalInteractions: number;
  successRate: number;
  responseTime: string;
  pricing: {
    type: 'free' | 'premium' | 'enterprise';
    cost?: string;
  };
  features: string[];
  supportedChains: string[];
  creator: string;
  verified: boolean;
  trending: boolean;
}

const AgentMarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Mock agent data
  const [agents] = useState<Agent[]>([
    {
      id: "agent-001",
      name: "DeFi Doctor",
      category: 'defi',
      specialty: "Yield Farming & Liquidity Issues",
      description: "Specialized in diagnosing and resolving DeFi protocol issues, optimizing yield strategies, and troubleshooting liquidity problems across major protocols.",
      avatar: "🏥",
      rating: 4.9,
      totalInteractions: 15847,
      successRate: 96,
      responseTime: "< 15s",
      pricing: { type: 'premium', cost: '0.01 ETH/session' },
      features: [
        "Yield optimization analysis",
        "Impermanent loss calculations",
        "Protocol risk assessment",
        "Gas optimization strategies"
      ],
      supportedChains: ["Ethereum", "Polygon", "Arbitrum", "Optimism"],
      creator: "DefiLabs",
      verified: true,
      trending: true
    },
    {
      id: "agent-002", 
      name: "NFT Whisperer",
      category: 'nft',
      specialty: "NFT Trading & Collection Management",
      description: "Expert in NFT market analysis, collection valuation, mint strategies, and resolving NFT-related transaction issues.",
      avatar: "🖼️",
      rating: 4.8,
      totalInteractions: 8923,
      successRate: 94,
      responseTime: "< 20s",
      pricing: { type: 'free' },
      features: [
        "Floor price analysis",
        "Rarity scoring",
        "Market trend predictions", 
        "Minting assistance"
      ],
      supportedChains: ["Ethereum", "Solana", "Polygon"],
      creator: "NFTLabs",
      verified: true,
      trending: false
    },
    {
      id: "agent-003",
      name: "Security Shield",
      category: 'security',
      specialty: "Wallet Security & Fraud Detection", 
      description: "Advanced security analysis for wallet protection, transaction monitoring, and fraud prevention across multiple blockchain networks.",
      avatar: "🛡️",
      rating: 4.95,
      totalInteractions: 12456,
      successRate: 98,
      responseTime: "< 10s",
      pricing: { type: 'premium', cost: '0.005 ETH/session' },
      features: [
        "Real-time fraud detection",
        "Wallet security audits",
        "Transaction risk scoring",
        "Recovery assistance"
      ],
      supportedChains: ["Ethereum", "BSC", "Polygon", "Avalanche"],
      creator: "CyberSec DAO",
      verified: true,
      trending: true
    },
    {
      id: "agent-004",
      name: "Trading Titan",
      category: 'trading',
      specialty: "Automated Trading & MEV Protection",
      description: "Sophisticated trading agent that helps with order execution, MEV protection, and trading strategy optimization.",
      avatar: "📈",
      rating: 4.7,
      totalInteractions: 6734,
      successRate: 91,
      responseTime: "< 25s",
      pricing: { type: 'enterprise', cost: 'Custom pricing' },
      features: [
        "MEV protection strategies",
        "Order flow optimization",
        "Slippage minimization",
        "Arbitrage opportunities"
      ],
      supportedChains: ["Ethereum", "Arbitrum", "BSC"],
      creator: "TradeFlow Labs",
      verified: true,
      trending: false
    },
    {
      id: "agent-005",
      name: "Wallet Wizard",
      category: 'wallet',
      specialty: "Multi-Wallet Management & Recovery",
      description: "Comprehensive wallet support including setup, recovery, multi-sig management, and cross-chain operations.",
      avatar: "👛",
      rating: 4.85,
      totalInteractions: 11203,
      successRate: 95,
      responseTime: "< 18s",
      pricing: { type: 'free' },
      features: [
        "Wallet setup assistance",
        "Recovery phrase help",
        "Multi-sig coordination",
        "Cross-chain transfers"
      ],
      supportedChains: ["All major chains"],
      creator: "WalletCorp",
      verified: true,
      trending: false
    },
    {
      id: "agent-006",
      name: "Gas Guru",
      category: 'general',
      specialty: "Gas Optimization & Network Analysis",
      description: "Specialized in gas price optimization, network congestion analysis, and transaction timing recommendations.",
      avatar: "⛽",
      rating: 4.6,
      totalInteractions: 4562,
      successRate: 89,
      responseTime: "< 12s",
      pricing: { type: 'free' },
      features: [
        "Real-time gas tracking",
        "Optimal timing predictions",
        "Network congestion analysis",
        "Cost savings strategies"
      ],
      supportedChains: ["Ethereum", "Polygon", "Arbitrum"],
      creator: "GasLabs",
      verified: false,
      trending: true
    }
  ]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || agent.category === categoryFilter;
    const matchesPricing = pricingFilter === "all" || agent.pricing.type === pricingFilter;
    
    return matchesSearch && matchesCategory && matchesPricing;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'interactions': return b.totalInteractions - a.totalInteractions;
      case 'success': return b.successRate - a.successRate;
      default: return b.rating - a.rating;
    }
  });

  const getCategoryIcon = (category: Agent['category']) => {
    switch (category) {
      case 'defi': return <Coins className="w-4 h-4" />;
      case 'nft': return <FileText className="w-4 h-4" />;
      case 'wallet': return <Shield className="w-4 h-4" />;
      case 'trading': return <TrendingUp className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'general': return <Brain className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getPricingColor = (type: Agent['pricing']['type']) => {
    switch (type) {
      case 'free': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'premium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'enterprise': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Agent Marketplace
          </h1>
          <p className="text-gray-400">
            Discover specialized AI agents for your Web3 support needs
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="nft">NFT</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={pricingFilter} onValueChange={setPricingFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pricing</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                  <SelectItem value="interactions">Sort by Usage</SelectItem>
                  <SelectItem value="success">Sort by Success Rate</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-400">
            Found {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Agent Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                      {agent.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {agent.name}
                        {agent.verified && (
                          <Badge variant="outline" className="text-green-400 bg-green-400/10 border-green-400/20 text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-400">by {agent.creator}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {agent.trending && (
                      <Badge variant="outline" className="text-orange-400 bg-orange-400/10 border-orange-400/20">
                        🔥 Trending
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={getPricingColor(agent.pricing.type)}
                    >
                      {agent.pricing.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {getCategoryIcon(agent.category)}
                    <span className="ml-1 capitalize">{agent.category}</span>
                  </Badge>
                </div>
                
                <p className="font-medium text-blue-300 mb-2">{agent.specialty}</p>
                <p className="text-sm text-gray-300 leading-relaxed">{agent.description}</p>
              </CardHeader>
              
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="font-medium">{agent.rating}</span>
                      <span className="text-gray-400">({agent.totalInteractions.toLocaleString()})</span>
                    </div>
                    <p className="text-xs text-gray-400">Rating</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-green-400">{agent.successRate}%</div>
                    <p className="text-xs text-gray-400">Success Rate</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">{agent.responseTime}</div>
                    <p className="text-xs text-gray-400">Response Time</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">
                      {agent.pricing.cost || 'Free'}
                    </div>
                    <p className="text-xs text-gray-400">Pricing</p>
                  </div>
                </div>
                
                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                  <div className="space-y-1">
                    {agent.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                    {agent.features.length > 3 && (
                      <p className="text-xs text-gray-500">+{agent.features.length - 3} more features</p>
                    )}
                  </div>
                </div>
                
                {/* Supported Chains */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Supported Networks:</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.supportedChains.slice(0, 3).map((chain, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {chain}
                      </Badge>
                    ))}
                    {agent.supportedChains.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.supportedChains.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/voice-agent?agent=${agent.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Headphones className="w-4 h-4 mr-2" />
                      Start Session
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAgents.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No agents found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria or browse all categories
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setPricingFilter("all");
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AgentMarketplacePage;