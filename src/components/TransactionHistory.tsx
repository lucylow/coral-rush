import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Search, ExternalLink, Flame } from "lucide-react";
import { useState } from "react";
export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const transactions = [{
    id: "3x8m9fR2qW5nL1",
    type: "payment",
    status: "completed",
    amount: 150.75,
    currency: "SOL",
    fee: 0.15,
    burn: 1.51,
    recipient: "8K3x...9fR2",
    timestamp: "2024-01-31 14:23:45",
    settlement: "0.3s",
    network: "Solana"
  }, {
    id: "9mK37nL1tY8jH9",
    type: "stake",
    status: "completed",
    amount: 500.00,
    currency: "SOL",
    fee: 0.00,
    burn: 0.00,
    recipient: "Staking Pool",
    timestamp: "2024-01-31 13:45:22",
    settlement: "0.2s",
    network: "Solana"
  }, {
    id: "2qW54tY8jH9mK3",
    type: "receive",
    status: "completed",
    amount: 75.50,
    currency: "SOL",
    fee: 0.00,
    burn: 0.00,
    recipient: "You",
    timestamp: "2024-01-31 12:10:15",
    settlement: "0.3s",
    network: "Solana"
  }, {
    id: "7jH91mP6xV4zQ8",
    type: "payment",
    status: "pending",
    amount: 250.00,
    currency: "USDC",
    fee: 0.25,
    burn: 2.50,
    recipient: "5mN8...3kL7",
    timestamp: "2024-01-31 11:55:30",
    settlement: "Processing...",
    network: "Solana"
  }, {
    id: "4pL6sR9tM2nK5",
    type: "swap",
    status: "completed",
    amount: 1000.00,
    currency: "USDC → SOL",
    fee: 3.00,
    burn: 0.00,
    recipient: "Meteora DEX",
    timestamp: "2024-01-31 10:20:45",
    settlement: "0.4s",
    network: "Solana"
  }, {
    id: "6nM9vB2xL4rT7",
    type: "payment",
    status: "failed",
    amount: 50.25,
    currency: "SOL",
    fee: 0.00,
    burn: 0.00,
    recipient: "9qX2...8fN1",
    timestamp: "2024-01-31 09:15:12",
    settlement: "Failed",
    network: "Solana"
  }];
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "stake":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "swap":
        return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-500" />;
    }
  };
  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };
  const filteredTransactions = transactions.filter(tx => tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Transaction History</h2>
        <p className="text-muted-foreground mt-2">Workflow Steps: 1. Identity Verification: Use zero-knowledge proofs (ZKPs) for instant KYC verification. 2. Transaction Prediction: Use an LSTM model to predict and pre-sign likely transactions. 3. Fraud Detection: Analyze the transaction in real-time using an isolation forest model. 4. Atomic Swap Execution: Execute the payment via an atomic swap on Solana, burning SOL tokens. 5. Tokenomics Enforcement: Apply dynamic burn rates, staking discounts, and mint loyalty NFTs. 6. Feedback and Retraining: Update the prediction and fraud detection models with new data.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">847</div>
          <div className="text-sm text-muted-foreground">Total Transactions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-500">99.7%</div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">0.3s</div>
          <div className="text-sm text-muted-foreground">Avg Settlement</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">142.7</div>
          <div className="text-sm text-muted-foreground">SOL Burned</div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by transaction ID or recipient..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </Card>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.map(tx => <Card key={tx.id} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(tx.type)}
                  {getStatusIcon(tx.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium capitalize">{tx.type}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusBadge(tx.status)}`}>
                      {tx.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    To: <code className="text-xs">{tx.recipient}</code>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {tx.timestamp} • Settlement: {tx.settlement}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold">
                  {tx.type === "receive" ? "+" : "-"}{tx.amount} {tx.currency}
                </div>
                
                {tx.fee > 0 && <div className="text-xs text-muted-foreground">
                    Fee: {tx.fee} SOL
                  </div>}
                
                {tx.burn > 0 && <div className="text-xs text-orange-500 flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    Burned: {tx.burn} SOL
                  </div>}
                
                <Button variant="ghost" size="sm" className="mt-1">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>)}
      </div>

      {filteredTransactions.length === 0 && <Card className="p-8 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </Card>}

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Transactions
        </Button>
      </div>
    </div>;
}