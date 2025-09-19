import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MicrophoneIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  WalletIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAppState } from '../contexts/AppStateContext';
import { useVoice } from '../contexts/VoiceContext';

const HomePage: React.FC = () => {
  const { stats, user } = useAppState();
  const { isListening, transcript, startListening, stopListening } = useVoice();

  const features = [
    {
      name: 'Voice Support',
      description: 'AI-powered voice assistance for Web3 queries',
      icon: MicrophoneIcon,
      href: '/voice-support',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Lightning Payments',
      description: 'Sub-second cross-border payments with ORGO',
      icon: CreditCardIcon,
      href: '/payments',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Analytics Dashboard',
      description: 'Real-time system monitoring and insights',
      icon: ChartBarIcon,
      href: '/dashboard',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Wallet Integration',
      description: 'Seamless Solana wallet connectivity',
      icon: WalletIcon,
      href: '/wallet',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            RUSH
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Voice-First Web3 Customer Support Agent powered by Coral Protocol
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience lightning-fast payments, AI-powered voice assistance, and comprehensive Web3 support in one unified platform.
          </p>
        </div>

        {/* Voice Demo */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative p-6 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
            }`}
          >
            <MicrophoneIcon className="h-8 w-8 text-white" />
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-white animate-ping"></div>
            )}
          </button>
          
          {transcript && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 max-w-md">
              <p className="text-slate-300 text-sm">"{transcript}"</p>
            </div>
          )}
          
          <p className="text-sm text-slate-400">
            {isListening ? 'Listening...' : 'Click to start voice interaction'}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.supportQueries.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Support Queries</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.transactions.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Transactions</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.successRate}%</div>
            <div className="text-sm text-slate-400">Success Rate</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.avgResponseTime}s</div>
            <div className="text-sm text-slate-400">Avg Response</div>
          </div>
        </motion.div>
      )}

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => (
          <Link
            key={feature.name}
            to={feature.href}
            className="group bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105"
          >
            <div className="space-y-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {feature.description}
                </p>
              </div>
              <div className="flex items-center text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                Explore
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Coral Protocol CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg p-8 border border-purple-500/30"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <SparklesIcon className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Coral Protocol Integration</h2>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Experience the power of agentic software with our Coral Protocol hackathon demo. 
            Discover reusable agents, multi-agent orchestration, and production-ready architecture.
          </p>
          <Link
            to="/coral-hackathon"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          >
            🌊 Explore Coral Protocol Demo
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
