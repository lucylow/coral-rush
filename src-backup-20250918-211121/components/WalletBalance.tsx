import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, Copy, ExternalLink, RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
export default function WalletBalance() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balances] = useState({
    sol: 12.47,
    usdc: 10000.00
  });
  const mockWalletAddress = "8K3x7mP9fR2qW5nL1tY8jH9mK3";
  const connectWallet = async () => {
    setLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setConnected(true);
      setWalletAddress(mockWalletAddress);
      setLoading(false);
      toast.success("Phantom wallet connected successfully!");
    }, 2000);
  };
  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress("");
    toast.info("Wallet disconnected");
  };
  const copyAddress = () => {
    navigator.clipboard.writeText(mockWalletAddress);
    toast.success("Address copied to clipboard!");
  };
  const refreshBalances = () => {
    toast.success("Balances refreshed!");
  };
  return <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Solana Wallet</h2>
        <p className="text-muted-foreground mt-2">Connect your wallet to start using RUSH. Agents auto-optimize swaps, compliance, and tokenomics in real-time.  Orgo's 500ms desktop boot enables just-in-time agent spawning. Orgo's desktop SDK for browser/OS control  
- Solana Pay for swaps  
- Believe.app for compliance  
- Meteora for liquidity  
      </p>
      </div>

      {!connected ? <Card className="p-8 text-center">
          <Wallet className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground mb-6">
            Connect your Solana wallet to view balances and make transactions
          </p>
          <div className="space-y-3">
            <Button onClick={connectWallet} disabled={loading} size="lg" className="w-full bg-gradient-to-r from-primary to-blue-600">
              {loading ? <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </> : <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Phantom Wallet
                </>}
            </Button>
            <div className="text-xs text-muted-foreground">
              By connecting, you agree to RUSH Terms of Service
            </div>
          </div>
        </Card> : <div className="space-y-6">
          {/* Wallet Info */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">Connected Wallet</div>
                  <div className="text-sm text-muted-foreground">Phantom Wallet</div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                {walletAddress}...
              </code>
              <Button variant="outline" size="sm" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshBalances} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={disconnectWallet} className="flex-1">
                Disconnect
              </Button>
            </div>
          </Card>

          {/* Token Balances */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Token Balances</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Token
              </Button>
            </div>

            <div className="space-y-4">
              {/* SOL Balance */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SOL</span>
                  </div>
                  <div>
                    <div className="font-medium">Solana</div>
                    <div className="text-sm text-muted-foreground">SOL</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{balances.sol.toFixed(2)} SOL</div>
                  <div className="text-sm text-muted-foreground">
                    ${(balances.sol * 98.5).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* SOL Balance */}
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">OR</span>
                  </div>
                  <div>
                    <div className="font-medium">Solana</div>
                    <div className="text-sm text-muted-foreground">SOL</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{balances.sol.toFixed(2)} SOL</div>
                  <div className="text-sm text-muted-foreground">
                    ${(balances.sol * 98.5).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* USDC Balance */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">US</span>
                  </div>
                  <div>
                    <div className="font-medium">USD Coin</div>
                    <div className="text-sm text-muted-foreground">USDC</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{balances.usdc.toFixed(2)} USDC</div>
                  <div className="text-sm text-muted-foreground">
                    ${balances.usdc.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Portfolio Value</span>
              <span className="text-xl font-bold">
                ${(balances.sol * 98.5 + balances.usdc).toFixed(2)}
              </span>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <Plus className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Buy SOL</div>
              <div className="text-sm text-muted-foreground">Purchase with SOL</div>
            </Card>
            
            <Card className="p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Stake SOL</div>
              <div className="text-sm text-muted-foreground">Earn 22.3% APY</div>
            </Card>
          </div>
        </div>}
    </div>;
}