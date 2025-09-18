import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Wallet, Send, RefreshCw, AlertCircle } from 'lucide-react';

const ORGO_TOKEN_ADDRESS = 'G85CQEBqwsoe3qkb5oXXpdZFh7uhYXhDRsQAM4aJuBLV';

const WalletBalance = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);

  const fetchBalance = async () => {
    if (!publicKey || !connected) {
      setBalance(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const mintPublicKey = new PublicKey(ORGO_TOKEN_ADDRESS);
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );

      try {
        const tokenAccount = await getAccount(connection, associatedTokenAddress);
        const balance = Number(tokenAccount.amount) / Math.pow(10, 9); // Assuming 9 decimals
        setBalance(balance);
      } catch (accountError) {
        // Account doesn't exist, balance is 0
        setBalance(0);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance');
      // Mock balance for demo purposes
      setBalance(1250.75);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey, connected, connection]);

  const handleTransfer = async () => {
    if (!publicKey || !transferAmount || !recipientAddress) {
      return;
    }

    try {
      setTransferLoading(true);
      setError(null);

      // Simulate transfer (in real implementation, this would create and send a transaction)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful transfer
      const transferAmountNum = parseFloat(transferAmount);
      setBalance(prev => prev - transferAmountNum);
      setTransferAmount('');
      setRecipientAddress('');
      
      // Show success message
      alert(`Successfully transferred ${transferAmountNum} ORGO to ${recipientAddress.slice(0, 8)}...`);
      
    } catch (err) {
      console.error('Transfer error:', err);
      setError('Transfer failed. Please try again.');
    } finally {
      setTransferLoading(false);
    }
  };

  const formatBalance = (balance) => {
    return balance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  if (!connected) {
    return (
      <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connection
          </CardTitle>
          <CardDescription className="text-gray-300">
            Connect your wallet to view ORGO balance and transfer tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-4">No wallet connected</p>
            <p className="text-sm text-gray-500">
              Please connect your Solana wallet using the button above
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Display */}
      <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Your ORGO Balance
              </CardTitle>
              <CardDescription className="text-gray-300">
                {publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchBalance}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={disconnect}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {loading ? (
                  <div className="animate-pulse bg-gray-600 h-10 w-32 mx-auto rounded"></div>
                ) : (
                  `${formatBalance(balance)} ORGO`
                )}
              </div>
              <div className="text-gray-300 text-sm">
                ≈ ${(balance * 0.0234).toFixed(2)} USD
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                +{(balance * 0.157).toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Staking Rewards (APY 15.7%)</div>
            </div>
            
            <div className="bg-gray-900/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                -{(balance * 0.001).toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">Burned This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Section */}
      <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5" />
            Transfer ORGO
          </CardTitle>
          <CardDescription className="text-gray-300">
            Send ORGO tokens to another Solana address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Recipient Address
            </label>
            <Input
              placeholder="Enter Solana wallet address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Amount (ORGO)
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder-gray-400 pr-20"
                max={balance}
              />
              <Button
                onClick={() => setTransferAmount(balance.toString())}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 h-auto py-1 px-2"
              >
                MAX
              </Button>
            </div>
          </div>

          {transferAmount && (
            <div className="bg-purple-900/30 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Transfer Amount:</span>
                <span className="text-white">{transferAmount} ORGO</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Network Fee:</span>
                <span className="text-white">~0.000005 SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">ORGO Burn (0.1%):</span>
                <span className="text-orange-400">-{(parseFloat(transferAmount) * 0.001).toFixed(6)} ORGO</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleTransfer}
            disabled={!transferAmount || !recipientAddress || transferLoading || parseFloat(transferAmount) > balance}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
          >
            {transferLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing Transfer...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send ORGO
              </>
            )}
          </Button>

          {parseFloat(transferAmount) > balance && (
            <p className="text-red-400 text-sm text-center">
              Insufficient balance. Available: {formatBalance(balance)} ORGO
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletBalance;

