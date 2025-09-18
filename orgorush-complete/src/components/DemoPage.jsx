import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Play, RotateCcw, Zap, Clock, Flame, Trophy, DollarSign } from 'lucide-react';

const DemoPage = () => {
  const [isRacing, setIsRacing] = useState(false);
  const [orgoStatus, setOrgoStatus] = useState('Ready');
  const [paypalStatus, setPaypalStatus] = useState('Ready');
  const [orgoTime, setOrgoTime] = useState(0);
  const [paypalTime, setPaypalTime] = useState(0);
  const [orgoCompleted, setOrgoCompleted] = useState(false);
  const [paypalCompleted, setPaypalCompleted] = useState(false);
  const [orgoBurnAmount, setOrgoBurnAmount] = useState(0);
  const [totalBurned, setTotalBurned] = useState(1234567.89);
  const [winner, setWinner] = useState(null);

  const resetDemo = () => {
    setIsRacing(false);
    setOrgoStatus('Ready');
    setPaypalStatus('Ready');
    setOrgoTime(0);
    setPaypalTime(0);
    setOrgoCompleted(false);
    setPaypalCompleted(false);
    setOrgoBurnAmount(0);
    setWinner(null);
  };

  const startRace = async () => {
    setIsRacing(true);
    setWinner(null);
    
    // Start both timers
    const startTime = Date.now();
    
    // ORGO Agent Flow (300ms total)
    const orgoFlow = async () => {
      const steps = [
        { status: 'Pre-signing transaction...', duration: 50 },
        { status: 'Atomic swap USD→USDC...', duration: 80 },
        { status: 'Converting USDC→PHP...', duration: 70 },
        { status: 'Burning ORGO tokens...', duration: 50 },
        { status: 'Transfer completed!', duration: 50 }
      ];
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setOrgoStatus(step.status);
        
        if (step.status.includes('Burning')) {
          // Simulate ORGO burn (0.1% of $10k = $10 worth of ORGO)
          const burnAmount = 10 / 0.0234; // Assuming ORGO price $0.0234
          setOrgoBurnAmount(burnAmount);
          setTotalBurned(prev => prev + burnAmount);
        }
        
        await new Promise(resolve => setTimeout(resolve, step.duration));
        setOrgoTime(Date.now() - startTime);
      }
      
      setOrgoCompleted(true);
      if (!paypalCompleted) {
        setWinner('ORGO');
      }
    };
    
    // PayPal Flow (3000ms total)
    const paypalFlow = async () => {
      const steps = [
        { status: 'Initiating transfer...', duration: 800 },
        { status: 'Verifying recipient...', duration: 700 },
        { status: 'Processing payment...', duration: 900 },
        { status: 'Completing transfer...', duration: 600 }
      ];
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setPaypalStatus(step.status);
        await new Promise(resolve => setTimeout(resolve, step.duration));
        setPaypalTime(Date.now() - startTime);
      }
      
      setPaypalStatus('Transfer completed!');
      setPaypalCompleted(true);
      if (!orgoCompleted) {
        setWinner('PayPal');
      }
    };
    
    // Run both flows simultaneously
    await Promise.all([orgoFlow(), paypalFlow()]);
    setIsRacing(false);
  };

  return (
    <div className="space-y-8">
      {/* Demo Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Live Speed Demo
        </h2>
        <p className="text-xl text-gray-300 mb-6">
          $10,000 USD → Philippines Peso Transfer Race
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={startRace}
            disabled={isRacing}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Race
          </Button>
          
          <Button
            onClick={resetDemo}
            disabled={isRacing}
            variant="outline"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-8 py-3 text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Winner Banner */}
      {winner && (
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold ${
            winner === 'ORGO' 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
          }`}>
            <Trophy className="w-6 h-6" />
            {winner === 'ORGO' ? 'ORGO Agent Wins!' : 'PayPal Wins!'}
          </div>
        </div>
      )}

      {/* Race Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* ORGO Agent Card */}
        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">ORGO Agent</CardTitle>
                  <CardDescription className="text-gray-300">Solana + AI Powered</CardDescription>
                </div>
              </div>
              <Badge className={`${
                orgoCompleted ? 'bg-green-600' : isRacing ? 'bg-yellow-600' : 'bg-gray-600'
              } text-white`}>
                {orgoCompleted ? 'COMPLETED' : isRacing ? 'RACING' : 'READY'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer */}
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {orgoTime}ms
              </div>
              <div className="text-gray-300">Execution Time</div>
            </div>

            {/* Status */}
            <div className="bg-purple-900/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300 text-sm">Status</span>
              </div>
              <div className="text-white font-medium">{orgoStatus}</div>
            </div>

            {/* ORGO Burn Counter */}
            <div className="bg-orange-900/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">ORGO Burned</span>
              </div>
              <div className="text-2xl font-bold text-orange-400">
                {orgoBurnAmount.toFixed(2)} ORGO
              </div>
              <div className="text-sm text-gray-400">
                ≈ ${(orgoBurnAmount * 0.0234).toFixed(2)} USD
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Amount:</span>
                <span className="text-white">$10,000 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Recipient Gets:</span>
                <span className="text-white">₱580,000 PHP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Network Fee:</span>
                <span className="text-green-400">$0.01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Burned:</span>
                <span className="text-orange-400">{totalBurned.toLocaleString()} ORGO</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PayPal Card */}
        <Card className="bg-black/20 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">PayPal</CardTitle>
                  <CardDescription className="text-gray-300">Traditional Payment</CardDescription>
                </div>
              </div>
              <Badge className={`${
                paypalCompleted ? 'bg-green-600' : isRacing ? 'bg-yellow-600' : 'bg-gray-600'
              } text-white`}>
                {paypalCompleted ? 'COMPLETED' : isRacing ? 'PROCESSING' : 'READY'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {paypalTime}ms
              </div>
              <div className="text-gray-300">Execution Time</div>
            </div>

            {/* Status */}
            <div className="bg-blue-900/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 text-sm">Status</span>
              </div>
              <div className="text-white font-medium">{paypalStatus}</div>
            </div>

            {/* Progress Bar */}
            {isRacing && !paypalCompleted && (
              <div className="space-y-2">
                <Progress value={(paypalTime / 3000) * 100} className="w-full" />
                <div className="text-center text-sm text-gray-400">
                  {Math.round((paypalTime / 3000) * 100)}% Complete
                </div>
              </div>
            )}

            {/* Transaction Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Amount:</span>
                <span className="text-white">$10,000 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Recipient Gets:</span>
                <span className="text-white">₱575,000 PHP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">PayPal Fee:</span>
                <span className="text-red-400">$350.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Exchange Rate:</span>
                <span className="text-white">58.00 PHP/USD</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Stats */}
      <Card className="bg-black/20 border-green-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-center">Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">10x</div>
              <div className="text-gray-300">Faster</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">35x</div>
              <div className="text-gray-300">Cheaper Fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
              <div className="text-gray-300">Deflationary</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-black/20 border-gray-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300 space-y-2">
          <div><strong>ORGO Agent:</strong> Solana blockchain + Circle CCTP + AI pre-signing + Atomic swaps</div>
          <div><strong>PayPal:</strong> Traditional banking rails + Manual verification + Currency conversion</div>
          <div><strong>Burn Mechanism:</strong> 0.1% of transaction value burned in ORGO tokens</div>
          <div><strong>Speed Advantage:</strong> Pre-signed transactions + Parallel processing + No intermediaries</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPage;

