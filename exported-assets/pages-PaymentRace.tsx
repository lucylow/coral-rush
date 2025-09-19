# Payment Race Demo Component

```tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BoltIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  FireIcon,
  TrophyIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAppState } from '../../contexts/AppStateContext';

interface RaceCompetitor {
  name: string;
  logo: string;
  color: string;
  settlementTime: number; // in seconds
  fee: number; // in dollars
  features: string[];
}

const PaymentRace: React.FC = () => {
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceCompleted, setRaceCompleted] = useState(false);
  const [orgoProgress, setOrgoProgress] = useState(0);
  const [paypalProgress, setPaypalProgress] = useState(0);
  const [tokensBurned, setTokensBurned] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  
  const { stats } = useAppState();

  const competitors: RaceCompetitor[] = [
    {
      name: 'OrgoRush',
      logo: '🚀',
      color: 'purple',
      settlementTime: 0.3,
      fee: 10,
      features: ['Sub-0.5s Settlement', 'ORGO Token Burning', 'AI Fraud Detection', 'Cross-chain Support']
    },
    {
      name: 'PayPal',
      logo: '💳',
      color: 'blue',
      settlementTime: 259200, // 3 days in seconds
      fee: 350,
      features: ['3-5 Day Settlement', 'High International Fees', 'Limited Crypto Support', 'Traditional Banking']
    }
  ];

  const startRace = () => {
    setShowCountdown(true);
    setRaceStarted(false);
    setRaceCompleted(false);
    setOrgoProgress(0);
    setPaypalProgress(0);
    setTokensBurned(0);
    setCountdown(3);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          setRaceStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (raceStarted && !raceCompleted) {
      // OrgoRush animation (fast)
      const orgoInterval = setInterval(() => {
        setOrgoProgress(prev => {
          if (prev >= 100) {
            clearInterval(orgoInterval);
            setTokensBurned(prev => prev + 0.1);
            return 100;
          }
          return prev + 10; // Complete in 1 second
        });
      }, 100);

      // PayPal animation (slow)
      const paypalInterval = setInterval(() => {
        setPaypalProgress(prev => {
          if (prev >= 100) {
            clearInterval(paypalInterval);
            return 100;
          }
          return prev + 0.001; // Takes much longer
        });
      }, 100);

      // Check if OrgoRush completes
      setTimeout(() => {
        if (orgoProgress >= 100) {
          setRaceCompleted(true);
          setTokensBurned(62.5); // Daily burn amount
        }
      }, 1500);

      return () => {
        clearInterval(orgoInterval);
        clearInterval(paypalInterval);
      };
    }
  }, [raceStarted, raceCompleted, orgoProgress]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Payment Speed <span className="text-purple-400">Challenge</span>
        </h1>
        <p className="text-xl text-slate-400 mb-6">
          Watch OrgoRush process a $10,000 USD → PHP transfer vs traditional payment methods
        </p>
        
        {/* Race Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={startRace}
            disabled={raceStarted}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <BoltIcon className="w-6 h-6 mr-3" />
            {raceStarted ? 'Race in Progress...' : 'Start Payment Race'}
          </button>
        </div>
      </div>

      {/* Countdown */}
      {showCountdown && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="text-8xl font-bold text-white mb-4">
              {countdown}
            </div>
            <p className="text-2xl text-slate-400">Get ready...</p>
          </motion.div>
        </div>
      )}

      {/* Race Track */}
      <div className="space-y-6">
        {competitors.map((competitor, index) => (
          <div key={competitor.name} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            {/* Competitor Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`text-4xl ${competitor.name === 'OrgoRush' ? 'animate-bounce' : ''}`}>
                  {competitor.logo}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{competitor.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {competitor.settlementTime < 1 ? 
                        `${competitor.settlementTime}s` : 
                        `${Math.floor(competitor.settlementTime / 86400)} days`
                      }
                    </div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                      ${competitor.fee}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Winner Badge */}
              {raceCompleted && competitor.name === 'OrgoRush' && (
                <motion.div 
                  className="flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <TrophyIcon className="w-5 h-5 mr-2" />
                  WINNER!
                </motion.div>
              )}
            </div>

            {/* Progress Track */}
            <div className="relative">
              <div className="h-12 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    competitor.name === 'OrgoRush' 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700'
                  } flex items-center justify-end pr-4`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${competitor.name === 'OrgoRush' ? orgoProgress : paypalProgress}%` 
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {(competitor.name === 'OrgoRush' ? orgoProgress : paypalProgress) > 10 && (
                    <div className="text-white font-semibold">
                      {Math.round(competitor.name === 'OrgoRush' ? orgoProgress : paypalProgress)}%
                    </div>
                  )}
                </motion.div>
              </div>
              
              {/* Progress Markers */}
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Start</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>Complete</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {competitor.features.map((feature, featureIndex) => (
                <div 
                  key={featureIndex}
                  className={`text-xs px-3 py-2 rounded-full text-center ${
                    competitor.name === 'OrgoRush' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'bg-slate-600/50 text-slate-400 border border-slate-600/30'
                  }`}
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* Status */}
            {raceStarted && (
              <div className="mt-4 p-4 rounded-lg bg-slate-700/50">
                {competitor.name === 'OrgoRush' ? (
                  <div className="space-y-2">
                    {orgoProgress >= 100 ? (
                      <div className="flex items-center text-green-400">
                        <BoltIcon className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Payment Completed! ⚡</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-purple-400">
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Processing lightning-fast settlement...</span>
                      </div>
                    )}
                    
                    {tokensBurned > 0 && (
                      <div className="flex items-center text-orange-400 text-sm">
                        <FireIcon className="w-4 h-4 mr-2" />
                        <span>{tokensBurned.toFixed(1)} ORGO tokens burned 🔥</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-blue-400">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Processing traditional settlement... (This will take 3-5 days)</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results Summary */}
      {raceCompleted && (
        <motion.div 
          className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-8 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">🏆 Race Results</h2>
            <p className="text-slate-400">OrgoRush delivers 10x faster, 35x cheaper payments</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">0.3s</div>
              <div className="text-slate-300">Settlement Time</div>
              <div className="text-sm text-slate-500">vs 3-5 days traditional</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">$10</div>
              <div className="text-slate-300">Transfer Fee</div>
              <div className="text-sm text-slate-500">vs $350 PayPal</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">{tokensBurned}</div>
              <div className="text-slate-300">ORGO Burned</div>
              <div className="text-sm text-slate-500">Deflationary tokenomics</div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
              <BoltIcon className="w-5 h-5 mr-2" />
              Try OrgoRush Now
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Technical Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">🚀 OrgoRush Advantages</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <BoltIcon className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Lightning Settlement:</strong> Sub-0.5s transaction finality with pre-signed transactions
              </div>
            </li>
            <li className="flex items-start">
              <FireIcon className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Deflationary Design:</strong> 0.1% of transaction value burned, reducing supply
              </div>
            </li>
            <li className="flex items-start">
              <CurrencyDollarIcon className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Minimal Fees:</strong> 35x cheaper than traditional international transfers
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">📊 Live Network Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Daily Transactions:</span>
              <span className="text-white font-semibold">{stats?.transactions?.toLocaleString() || '42,700+'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total ORGO Burned:</span>
              <span className="text-orange-400 font-semibold">{stats?.tokensBurned || '2,847.39'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Success Rate:</span>
              <span className="text-green-400 font-semibold">99.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active VMs:</span>
              <span className="text-blue-400 font-semibold">{stats?.activeVMs || 4}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRace;
```