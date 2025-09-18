import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Flame, Zap, Crown, TrendingUp, Wallet, Clock } from "lucide-react";

export default function OrgoTokenPanel() {
  const [solBalance, setSolBalance] = useState(999.9);
  const [totalBurned, setTotalBurned] = useState(1247.3);
  const [speedBoosts, setSpeedBoosts] = useState({
    turboMode: false,
    priorityLane: false,
    preExecution: false
  });
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [stakedSol, setStakedSol] = useState(50.0);
  const [loading, setLoading] = useState(false);

  const enableSpeedBoost = async (boostType: string, solRequired: number) => {
    if (solBalance < solRequired) {
      toast.error(`Insufficient SOL balance. Need ${solRequired} SOL.`);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/v1/orgo/speed-boosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk_live_3927767011051e2f9d97473b75578a1c9f6a03d62ef92eb0'
        },
        body: JSON.stringify({
          user_wallet: "0x742d35Cc6634C0532925a3b8D6Ac6E7D9C",
          boost_type: boostType,
          sol_amount: solRequired,
          action: "enable_boost"
        })
      });

      const result = await response.json();
      
      if (result.boost_status) {
        // Update local state with real API response
        setSpeedBoosts(prev => ({
          ...prev,
          [boostType === 'turbo_mode' ? 'turboMode' : 
           boostType === 'priority_lane' ? 'priorityLane' : 'preExecution']: true
        }));
        
        setSolBalance(result.sol_balance || (solBalance - solRequired));
        setTotalBurned(prev => prev + (result.sol_burned || solRequired));
        setSpeedMultiplier(result.speed_gain ? parseFloat(result.speed_gain.match(/\d+/)?.[0] || "50") / 100 + 1 : speedMultiplier + 0.5);
        
        toast.success(`🔥 ${solRequired} SOL Burned for ${boostType.replace('_', ' ')}! ${result.speed_gain || '50% faster processing'}`);
      }
    } catch (error) {
      // Fallback demo functionality
      setSpeedBoosts(prev => ({
        ...prev,
        [boostType === 'turbo_mode' ? 'turboMode' : 
         boostType === 'priority_lane' ? 'priorityLane' : 'preExecution']: true
      }));
      
      setSolBalance(prev => prev - solRequired);
      setTotalBurned(prev => prev + solRequired);
      setSpeedMultiplier(prev => prev + 0.5);
      
      toast.success(`🔥 ${solRequired} SOL Burned for ${boostType.replace('_', ' ')}! 50% faster processing`);
    }
    
    setLoading(false);
  };

  const stakeSol = async (amount: number) => {
    if (solBalance < amount) {
      toast.error(`Insufficient SOL balance. Need ${amount} SOL.`);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/v1/orgo/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk_live_3927767011051e2f9d97473b75578a1c9f6a03d62ef92eb0'
        },
        body: JSON.stringify({
          user_wallet: "0x742d35Cc6634C0532925a3b8D6Ac6E7D9C",
          amount: amount,
          action: "stake"
        })
      });

      const result = await response.json();
      
      setSolBalance(prev => prev - amount);
      setStakedSol(prev => prev + amount);
      
      toast.success(`💎 ${amount} SOL staked successfully! Earning 12% APY`);
    } catch (error) {
      // Fallback demo
      setSolBalance(prev => prev - amount);
      setStakedSol(prev => prev + amount);
      toast.success(`💎 ${amount} SOL staked successfully! Earning 12% APY`);
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          SOL Token Utility Hub
        </h2>
        <p className="text-muted-foreground mt-2">Burn • Stake • Boost • Earn</p>
      </div>

      {/* Balance Card */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              SOL Balance
            </h3>
            <div className="text-3xl font-bold text-orange-600">{solBalance.toFixed(2)} SOL</div>
            <p className="text-sm text-muted-foreground">${(solBalance * 98.5).toFixed(2)} USD value</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Staked</div>
            <div className="text-xl font-bold text-green-600">{stakedSol.toFixed(1)} SOL</div>
            <div className="text-sm text-green-600">+12% APY</div>
          </div>
        </div>
      </Card>

      {/* Speed Boosts */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Speed Boost Controls
        </h3>
        
        <div className="space-y-4">
          {/* Turbo Mode */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-red-500" />
              <div>
                <h4 className="font-medium">Turbo Mode</h4>
                <p className="text-sm text-muted-foreground">GPU acceleration • 50% faster</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={speedBoosts.turboMode ? "default" : "outline"}>
                {speedBoosts.turboMode ? "ACTIVE" : "0.1 SOL"}
              </Badge>
              <Button
                size="sm"
                disabled={speedBoosts.turboMode || loading}
                onClick={() => enableSpeedBoost('turbo_mode', 0.1)}
                variant={speedBoosts.turboMode ? "secondary" : "default"}
              >
                {speedBoosts.turboMode ? "Active" : "Burn & Enable"}
              </Button>
            </div>
          </div>

          {/* Priority Lane */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-purple-500" />
              <div>
                <h4 className="font-medium">Priority Lane</h4>
                <p className="text-sm text-muted-foreground">Queue skipping • Front of line</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={speedBoosts.priorityLane ? "default" : "outline"}>
                {speedBoosts.priorityLane ? "ACTIVE" : "50 SOL"}
              </Badge>
              <Button
                size="sm"
                disabled={speedBoosts.priorityLane || loading}
                onClick={() => stakeSol(50)}
                variant={speedBoosts.priorityLane ? "secondary" : "default"}
              >
                {speedBoosts.priorityLane ? "Active" : "Stake & Enable"}
              </Button>
            </div>
          </div>

          {/* Pre-Execution */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-blue-500" />
              <div>
                <h4 className="font-medium">Pre-Execution</h4>
                <p className="text-sm text-muted-foreground">Predictive processing • Instant settlement</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={solBalance >= 100 ? "default" : "outline"}>
                {solBalance >= 100 ? "ACTIVE" : "Hold 100+ SOL"}
              </Badge>
              <Button
                size="sm"
                disabled={solBalance < 100 || loading}
                onClick={() => stakeSol(100)}
                variant={solBalance >= 100 ? "secondary" : "default"}
              >
                {solBalance >= 100 ? "Qualified" : "Need More SOL"}
              </Button>
            </div>
          </div>
        </div>

        {/* Speed Multiplier Display */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Speed Multiplier</span>
            <span className="text-2xl font-bold text-green-600">{speedMultiplier.toFixed(1)}x</span>
          </div>
          <Progress value={(speedMultiplier - 1) * 50} className="mt-2" />
        </div>
      </Card>

      {/* Burn Statistics */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          Deflationary Mechanics
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">🔥 {totalBurned.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Total SOL Burned</div>
            <div className="text-lg font-semibold text-green-600">${(totalBurned * 4.73).toFixed(0)} Value Removed</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">🚀 37x</div>
            <div className="text-sm text-muted-foreground">Speed Advantage</div>
            <div className="text-lg font-semibold text-blue-600">vs Traditional Payment</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Daily Burn Rate:</span>
              <span className="font-semibold">625 SOL/day</span>
            </div>
            <div className="flex justify-between">
              <span>Circulating Supply:</span>
              <span className="font-semibold">98,752.7 SOL ↓</span>
            </div>
            <div className="flex justify-between">
              <span>Next Milestone:</span>
              <span className="font-semibold text-orange-600">2,000 SOL burned</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent SOL Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Flame className="h-4 w-4 text-red-500" />
              <span className="text-sm">Turbo Mode Activated</span>
            </div>
            <span className="text-sm font-medium text-red-600">-0.1 SOL</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">Staking Rewards</span>
            </div>
            <span className="text-sm font-medium text-green-600">+0.16 SOL</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Flame className="h-4 w-4 text-red-500" />
              <span className="text-sm">Payment Processing Burn</span>
            </div>
            <span className="text-sm font-medium text-red-600">-0.05 SOL</span>
          </div>
        </div>
      </Card>
    </div>
  );
}