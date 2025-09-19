import React from 'react';
import { motion } from 'framer-motion';
import { WalletIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletBalance: React.FC = () => {
  const { connected, publicKey } = useWallet();

  const mockBalances = [
    { token: 'ORGO', balance: '1,250.75', value: '$2,501.50', change: '+5.2%', positive: true },
    { token: 'SOL', balance: '45.32', value: '$4,532.00', change: '+2.1%', positive: true },
    { token: 'USDC', balance: '2,500.00', value: '$2,500.00', change: '0.0%', positive: true },
    { token: 'USDT', balance: '1,000.00', value: '$1,000.00', change: '-0.1%', positive: false },
  ];

  const mockTransactions = [
    { id: '1', type: 'received', token: 'ORGO', amount: '50.25', from: '0x...abc', time: '2 min ago' },
    { id: '2', type: 'sent', token: 'SOL', amount: '5.00', to: '0x...def', time: '1 hour ago' },
    { id: '3', type: 'received', token: 'USDC', amount: '500.00', from: '0x...ghi', time: '3 hours ago' },
  ];

  if (!connected) {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
          <WalletIcon className="h-12 w-12 text-slate-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-slate-400">Connect your Solana wallet to view your balances and transactions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Wallet Balance</h1>
        <p className="text-slate-400">Manage your tokens and view transaction history</p>
        <p className="text-sm text-slate-500 mt-2">
          Connected: {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
        </p>
      </div>

      {/* Total Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg p-8 border border-purple-500/30"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Total Portfolio Value</h2>
          <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            $10,533.50
          </p>
          <p className="text-green-400 text-sm mt-2">+7.3% from last week</p>
        </div>
      </motion.div>

      {/* Token Balances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-semibold text-white">Token Balances</h3>
        <div className="space-y-3">
          {mockBalances.map((balance, index) => (
            <div
              key={balance.token}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{balance.token[0]}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{balance.token}</h4>
                    <p className="text-slate-400 text-sm">{balance.balance} {balance.token}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{balance.value}</p>
                  <p className={`text-sm ${balance.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {balance.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'received' ? 'bg-green-900/50' : 'bg-red-900/50'
                  }`}>
                    {tx.type === 'received' ? (
                      <ArrowDownIcon className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowUpIcon className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {tx.type === 'received' ? 'Received' : 'Sent'} {tx.amount} {tx.token}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {tx.type === 'received' ? 'From' : 'To'}: {tx.type === 'received' ? tx.from : tx.to}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">{tx.time}</p>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WalletBalance;
