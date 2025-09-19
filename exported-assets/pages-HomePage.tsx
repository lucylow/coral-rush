# Home Page Component

```tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MicrophoneIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import VoiceWaveform from '../components/voice/VoiceWaveform';
import StatsCounter from '../components/ui/StatsCounter';
import FeatureCard from '../components/ui/FeatureCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import { useAppState } from '../contexts/AppStateContext';
import { useVoice } from '../contexts/VoiceContext';

const HomePage: React.FC = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { stats, recentActivity } = useAppState();
  const { startListening, stopListening, isListening } = useVoice();

  const handleVoiceDemo = () => {
    if (isListening) {
      stopListening();
      setIsVoiceActive(false);
    } else {
      startListening();
      setIsVoiceActive(true);
    }
  };

  const features = [
    {
      icon: MicrophoneIcon,
      title: 'Voice-First Support',
      description: 'Natural language Web3 support with AI agents',
      color: 'purple',
      href: '/voice-support'
    },
    {
      icon: BoltIcon,
      title: 'Lightning Payments',
      description: 'Sub-0.5s settlement with ORGO token burning',
      color: 'blue',
      href: '/payments'
    },
    {
      icon: ShieldCheckIcon,
      title: 'AI Security',
      description: '99.5% fraud detection accuracy with ML models',
      color: 'emerald',
      href: '/dashboard/ai'
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time Analytics',
      description: 'VM orchestration and performance monitoring',
      color: 'orange',
      href: '/dashboard'
    }
  ];

  const liveStats = [
    {
      label: 'Support Queries Resolved',
      value: stats?.supportQueries || 1247,
      change: '+12.5%',
      trend: 'up'
    },
    {
      label: 'Transactions Processed',
      value: stats?.transactions || 42700,
      change: '+8.2%',
      trend: 'up'
    },
    {
      label: 'ORGO Tokens Burned',
      value: stats?.tokensBurned || 2847.39,
      change: '+625 today',
      trend: 'up'
    },
    {
      label: 'Active Virtual Machines',
      value: stats?.activeVMs || 4,
      change: '100% uptime',
      trend: 'stable'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                RUSH
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-slate-300">
                Voice-First Web3 Agent
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience the future of Web3 support with AI-powered agents that understand 
              your voice and solve blockchain problems instantly.
            </motion.p>

            {/* Interactive Voice Demo */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <button
                  onClick={handleVoiceDemo}
                  className={`relative group mx-auto flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
                    isVoiceActive 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25' 
                      : 'bg-slate-800 hover:bg-slate-700 border-2 border-purple-500/30 hover:border-purple-500/50'
                  }`}
                >
                  {isVoiceActive ? (
                    <VoiceWaveform className="w-8 h-8 text-white" />
                  ) : (
                    <MicrophoneIcon className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
                  )}
                  
                  {isVoiceActive && (
                    <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"></div>
                  )}
                </button>
                
                <p className="mt-4 text-slate-400">
                  {isVoiceActive ? '🎤 Listening...' : '👆 Try the Voice Demo'}
                </p>
              </div>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                to="/voice-support"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <MicrophoneIcon className="w-5 h-5 mr-2" />
                Start Voice Support
              </Link>
              
              <Link 
                to="/payments/demo"
                className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all duration-300 border border-slate-600 hover:border-slate-500"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                View Payment Demo
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Live Statistics */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Live Statistics</h2>
          <p className="text-slate-400">Real-time metrics from the RUSH network</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatsCounter
                label={stat.label}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Core Features</h2>
          <p className="text-slate-400">Discover what makes RUSH the future of Web3 interaction</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Recent Activity</h2>
          <p className="text-slate-400">Latest transactions and support interactions</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <RecentActivity activities={recentActivity} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Web3 Support?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of users already using RUSH for seamless Web3 interactions
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/voice-support"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <MicrophoneIcon className="w-6 h-6 mr-3" />
              Get Support Now
            </Link>
            
            <Link 
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-bold text-lg hover:bg-slate-700 transition-all duration-300 border border-slate-600 hover:border-slate-500"
            >
              <ChartBarIcon className="w-6 h-6 mr-3" />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```