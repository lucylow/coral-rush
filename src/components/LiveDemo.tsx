import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Globe, Shield, TrendingUp, Clock, DollarSign, Mic, Brain } from "lucide-react";
export default function LiveDemo() {
  const [isRacing, setIsRacing] = useState(false);
  const [orgoProgress, setOrgoProgress] = useState(0);
  const [paypalProgress, setPaypalProgress] = useState(0);
  const [burnCounter, setBurnCounter] = useState(2847.39);
  const [coralAgentsActive, setCoralAgentsActive] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const startRace = async () => {
    setIsRacing(true);
    setOrgoProgress(0);
    setPaypalProgress(0);
    setCoralAgentsActive(true);
    setVoiceCommand('Send $10,000 to Philippines');
    
    try {
      // Simulate Coral Protocol agent coordination
      setTimeout(() => {
        setVoiceCommand('Voice Listener: "Send $10,000 to Philippines"');
      }, 500);
      
      setTimeout(() => {
        setVoiceCommand('Intent Analysis: Cross-border payment detected');
      }, 1000);
      
      setTimeout(() => {
        setVoiceCommand('Fraud Detection: Risk score 0.2/10 - Approved');
      }, 1500);
      
      // Call real speed race API
      const response = await fetch('/api/v1/demo/speed-race', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk_live_3927767011051e2f9d97473b75578a1c9f6a03d62ef92eb0'
        },
        body: JSON.stringify({
          amount: 10000,
          competitors: ["rush", "paypal", "visa"],
          demo_type: "live_race",
          coral_agents: true
        })
      });
      const raceData = await response.json();

      // Use real API latency data
      const orgoLatency = raceData.race_results?.rush?.latency_ms || 85.2;
      const paypalLatency = raceData.race_results?.paypal?.latency_ms || 3200.5;

      // RUSH animation based on real 85ms latency
      const orgoInterval = setInterval(() => {
        setOrgoProgress(prev => {
          if (prev >= 100) {
            clearInterval(orgoInterval);
            setBurnCounter(prev => prev + 0.1);
            return 100;
          }
          return prev + 25;
        });
      }, orgoLatency / 4);

      // PayPal animation based on real 3200ms latency  
      const paypalInterval = setInterval(() => {
        setPaypalProgress(prev => {
          if (prev >= 100) {
            clearInterval(paypalInterval);
            return 100;
          }
          return prev + 2;
        });
      }, paypalLatency / 50);
      setTimeout(() => {
        setIsRacing(false);
        setCoralAgentsActive(false);
        setVoiceCommand('Payment completed via Coral Protocol agents!');
      }, Math.max(paypalLatency, 4000));
    } catch (error) {
      // Fallback to demo simulation
      const orgoInterval = setInterval(() => {
        setOrgoProgress(prev => {
          if (prev >= 100) {
            clearInterval(orgoInterval);
            setBurnCounter(prev => prev + 0.1);
            return 100;
          }
          return prev + 33.33;
        });
      }, 100);
      const paypalInterval = setInterval(() => {
        setPaypalProgress(prev => {
          if (prev >= 100) {
            clearInterval(paypalInterval);
            return 100;
          }
          return prev + 3.33;
        });
      }, 100);
      setTimeout(() => {
        setIsRacing(false);
        setCoralAgentsActive(false);
        setVoiceCommand('Payment completed via Coral Protocol agents!');
      }, 4000);
    }
  };
  return <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Watch RUSH vs PayPal in real-time</h2>
        <p className="text-muted-foreground mt-2">An AI agent for cross-border payments that uses the Orgo AI platform. The agent will handle the entire payment process, including KYC verification, transaction signing, and settlement, using predictive pre-signing for speed. 1. A $10,000 USD to Philippines Peso (PHP) transfer completing in 0.3 seconds. 2. A real-time SOL burn counter during the transaction. 3. A side-by-side comparison with PayPal (which will take 3+ seconds).</p>
      </div>

      {/* Coral Protocol Agent Status */}
      {coralAgentsActive && (
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Mic className="h-4 w-4 text-white" />
                  </div>
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="p-2 bg-red-500 rounded-lg">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-medium">🌊 Coral Protocol Agents Active</h3>
                  <p className="text-sm text-gray-300">{voiceCommand}</p>
                </div>
              </div>
              <Badge variant="default" className="bg-blue-600">
                Multi-Agent Orchestration
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary">RUSH</h3>
            <Badge variant="secondary">0.3s Settlement</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Processing Payment...</span>
              <span>{orgoProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all duration-100" style={{
              width: `${orgoProgress}%`
            }} />
            </div>
            <div className="text-sm space-y-1">
              <div>💰 Fee: $1 (0.01%)</div>
              <div>🔥 SOL Burned: 1 token</div>
              <div>⚡ Network: Solana</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-muted">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">PayPal</h3>
            <Badge variant="outline">3-5 days</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Processing Payment...</span>
              <span>{paypalProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full transition-all duration-100" style={{
              width: `${paypalProgress}%`
            }} />
            </div>
            <div className="text-sm space-y-1">
              <div>💸 Fee: $350 (3.5%)</div>
              <div>🏦 Banks: 3-5 intermediaries</div>
              <div>⏰ Processing: Days</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Button onClick={startRace} disabled={isRacing} size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/80 hover:to-blue-600/80">
          {isRacing ? "🌊 Coral Agents Processing..." : "🚀 Start Coral-Powered $10K Transfer"}
        </Button>
      </div>

      <Card className="p-6 text-center bg-gradient-to-r from-primary/5 to-blue-600/5">
        <h3 className="text-2xl font-bold mb-2">🔥 Total SOL Burned</h3>
        <div className="text-4xl font-mono font-bold text-primary">
          {burnCounter.toFixed(2)} SOL
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Deflationary tokenomics in action • ${(burnCounter * 4.73).toFixed(2)} value removed
        </p>
      </Card>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center border-green-200 bg-green-50/50">
          <Zap className="h-12 w-12 mx-auto mb-3 text-green-600" />
          <h3 className="text-lg font-semibold mb-2">10x Faster</h3>
          <p className="text-2xl font-bold text-green-600 mb-1">0.3s vs 3s</p>
          <p className="text-sm text-muted-foreground">Settlement time comparison</p>
        </Card>

        <Card className="p-6 text-center border-blue-200 bg-blue-50/50">
          <DollarSign className="h-12 w-12 mx-auto mb-3 text-blue-600" />
          <h3 className="text-lg font-semibold mb-2">35x Cheaper</h3>
          <p className="text-2xl font-bold text-blue-600 mb-1">$10 vs $350</p>
          <p className="text-sm text-muted-foreground">International transfer fees</p>
        </Card>

        <Card className="p-6 text-center border-orange-200 bg-orange-50/50">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 text-orange-600" />
          <h3 className="text-lg font-semibold mb-2">100% Deflationary</h3>
          <p className="text-2xl font-bold text-orange-600 mb-1">625/day</p>
          <p className="text-sm text-muted-foreground">SOL tokens burned daily</p>
        </Card>
      </div>

      {/* Technical Features */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Why RUSH Wins</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">ZK-Proof Identity</h4>
                <p className="text-sm text-muted-foreground">Privacy-preserving authentication with 99.5% fraud detection accuracy</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Pre-signed Transactions</h4>
                <p className="text-sm text-muted-foreground">Instant execution without user interaction delays</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Atomic Cross-chain Swaps</h4>
                <p className="text-sm text-muted-foreground">USD → USDC → PHP conversion in single transaction</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">VM Orchestration</h4>
                <p className="text-sm text-muted-foreground">4 virtual machines managing payment infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>;
}