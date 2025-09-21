import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Users, Coins, BarChart3, Flame } from "lucide-react";

export default function TokenInfo() {
  const tokenStats = {
    price: 237.46,
    priceChange24h: -0.91,
    marketCap: 109500000000,
    volume24h: 2847392000,
    totalSupply: 500000000,
    circulatingSupply: 461000000,
    holders: 1284700,
    burnedTokens: 28473.9,
    stakingAPY: 5.8
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          🌊 Coral Protocol SOL Token Analytics
        </h2>
        <p className="text-muted-foreground mt-2">Solana native token with high-performance blockchain</p>
      </div>

      {/* Main Price Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-blue-600/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">${tokenStats.price}</div>
            <div className="flex items-center gap-2 mt-1">
              {tokenStats.priceChange24h > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                tokenStats.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {tokenStats.priceChange24h > 0 ? '+' : ''}{tokenStats.priceChange24h}%
              </span>
              <span className="text-muted-foreground text-sm">24h</span>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="mb-2">SOL/USD</Badge>
            <div className="text-sm text-muted-foreground">Solana Native Token</div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Market Cap</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(tokenStats.marketCap)}</div>
          <div className="text-xs text-muted-foreground">Rank #5</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">24h Volume</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(tokenStats.volume24h)}</div>
          <div className="text-xs text-muted-foreground">+15.3% vs yesterday</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Holders</span>
          </div>
          <div className="text-xl font-bold">{tokenStats.holders.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">+5.2% this week</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Burned</span>
          </div>
          <div className="text-xl font-bold">{tokenStats.burnedTokens.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">SOL burned in fees</div>
        </Card>
      </div>

      {/* Tokenomics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Token Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Circulating Supply</span>
              <span className="font-medium">{tokenStats.circulatingSupply.toLocaleString()} SOL</span>
            </div>
            <div className="flex justify-between">
              <span>Total Supply</span>
              <span className="font-medium">{tokenStats.totalSupply.toLocaleString()} SOL</span>
            </div>
            <div className="flex justify-between">
              <span>Burned Tokens</span>
              <span className="font-medium text-orange-500">{tokenStats.burnedTokens.toLocaleString()} SOL</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span>Circulating %</span>
              <span>{((tokenStats.circulatingSupply / tokenStats.totalSupply) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Solana Network Mechanics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Transaction Fees</span>
              <span className="font-medium">~0.00025 SOL per tx</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Burns</span>
              <span className="font-medium">~{Math.floor(tokenStats.burnedTokens / 365).toLocaleString()} SOL</span>
            </div>
            <div className="flex justify-between">
              <span>Staking APY</span>
              <span className="font-medium text-green-500">{tokenStats.stakingAPY}%</span>
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">
              SOL is used for transaction fees and staking. Portion of fees are burned, creating deflationary pressure
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Fee Burns</h3>
        <div className="space-y-3">
          {[
            { time: "2 min ago", amount: 0.00025, tx: "3x8m...9fR2" },
            { time: "5 min ago", amount: 0.00025, tx: "9mK3...7nL1" },
            { time: "8 min ago", amount: 0.00025, tx: "2qW5...4tY8" },
            { time: "12 min ago", amount: 0.00025, tx: "7jH9...1mP6" },
          ].map((burn, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <div className="flex items-center gap-3">
                <Flame className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="font-medium">{burn.amount} SOL Burned</div>
                  <div className="text-sm text-muted-foreground">{burn.time}</div>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs">{burn.tx}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}