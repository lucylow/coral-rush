import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Wallet, ExternalLink, Copy, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NFT {
  id: string;
  name: string;
  collection: string;
  tokenId: string;
  image: string;
  isNew?: boolean;
  mintedAt?: Date;
}

interface Transaction {
  hash: string;
  type: 'mint' | 'transfer' | 'refund';
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
  amount?: string;
}

const BlockchainPanel = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [walletAddress] = useState("0x742d35Cc6634C0532925a3b8D6Ac6E7D9C");
  const [balance] = useState("2.456 ETH");
  const [userNFTs, setUserNFTs] = useState<NFT[]>([
    {
      id: "1",
      name: "Bored Ape #1234",
      collection: "BAYC",
      tokenId: "1234",
      image: "/placeholder.svg"
    },
    {
      id: "2", 
      name: "Punk #5678",
      collection: "CryptoPunks",
      tokenId: "5678",
      image: "/placeholder.svg"
    }
  ]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      hash: "0x7f2d1b...af8394",
      type: "transfer",
      status: "failed",
      timestamp: new Date(Date.now() - 300000),
      amount: "0.5 ETH"
    }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const addNewNFT = () => {
    const newNFT: NFT = {
      id: Date.now().toString(),
      name: `Support Ticket #${Math.floor(Math.random() * 10000)}`,
      collection: "RUSH Support",
      tokenId: Math.floor(Math.random() * 10000).toString(),
      image: "/placeholder.svg",
      isNew: true,
      mintedAt: new Date()
    };
    
    setUserNFTs(prev => [newNFT, ...prev]);
    
    // Add transaction record
    const newTransaction: Transaction = {
      hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}`,
      type: "mint",
      status: "success",
      timestamp: new Date()
    };
    setRecentTransactions(prev => [newTransaction, ...prev]);

    // Remove "new" badge after 10 seconds
    setTimeout(() => {
      setUserNFTs(prev => prev.map(nft => 
        nft.id === newNFT.id ? { ...nft, isNew: false } : nft
      ));
    }, 10000);
  };

  // Listen for NFT minting from agent activities
  useEffect(() => {
    const handleAgentNFTMint = (event: CustomEvent) => {
      const compensationNFT: NFT = {
        id: Date.now().toString(),
        name: event.detail.name || `Support Resolution #${Math.floor(Math.random() * 10000)}`,
        collection: "Agent Support NFTs",
        tokenId: Math.floor(Math.random() * 10000).toString(),
        image: "/placeholder.svg",
        isNew: true,
        mintedAt: new Date()
      };
      
      setUserNFTs(prev => [compensationNFT, ...prev]);
      
      // Add transaction record
      const newTransaction: Transaction = {
        hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}`,
        type: "mint",
        status: "success",
        timestamp: new Date()
      };
      setRecentTransactions(prev => [newTransaction, ...prev]);

      // Remove "new" badge after 10 seconds
      setTimeout(() => {
        setUserNFTs(prev => prev.map(nft => 
          nft.id === compensationNFT.id ? { ...nft, isNew: false } : nft
        ));
      }, 10000);
    };

    window.addEventListener('agent-nft-mint', handleAgentNFTMint as EventListener);
    return () => {
      window.removeEventListener('agent-nft-mint', handleAgentNFTMint as EventListener);
    };
  }, []);

  // Simulate new NFT when agent completes work (reduced frequency)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance every 30 seconds
        addNewNFT();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Wallet Connection Card */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm flex-shrink-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Wallet className="h-5 w-5" />
            Web3 Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected ? (
            <>
              <div>
                <p className="text-sm text-gray-400 mb-1">Address</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-white truncate">{walletAddress}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(walletAddress)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Balance</p>
                <p className="font-semibold text-white text-lg">{balance}</p>
              </div>

              <div className="flex items-center gap-2 agent-card-executor">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">Connected via Crossmint</span>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-gray-600"
                onClick={() => setIsConnected(false)}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsConnected(true)}
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* NFT Collection */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Your NFTs</CardTitle>
            <Badge variant="secondary">{userNFTs.length}</Badge>
          </div>
          <p className="text-sm text-gray-400">
            Collection with live support rewards
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6 pb-6">
            <div className="space-y-3">
              {userNFTs.map((nft) => (
                <Card key={nft.id} className={cn(
                  "relative transition-all duration-500 border-gray-600",
                  nft.isNew && "nft-appear ring-2 ring-green-400 shadow-glow-executor"
                )}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-700/30 to-green-700/30 rounded-lg flex items-center justify-center border border-gray-600 relative overflow-hidden">
                        {nft.isNew && (
                          <div className="absolute inset-0 bg-gradient-executor opacity-20 animate-pulse" />
                        )}
                        <Sparkles className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-white truncate">
                          {nft.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {nft.collection}
                        </p>
                        {nft.mintedAt && (
                          <p className="text-xs text-green-400 mt-1">
                            Minted: {nft.mintedAt.toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {nft.isNew && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            <Sparkles className="h-3 w-3 mr-1" />
                            NEW
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40">
            <div className="space-y-2">
              {recentTransactions.map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        tx.status === 'success' ? 'default' :
                        tx.status === 'failed' ? 'destructive' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {tx.type}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {tx.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {tx.amount && (
                      <span className="text-xs text-white">{tx.amount}</span>
                    )}
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <ExternalLink className="h-2 w-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainPanel;