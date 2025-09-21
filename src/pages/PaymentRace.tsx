import React from 'react';
import LiveDemo from '../components/LiveDemo';

const PaymentRace: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🌊 Coral Protocol Payment Race Demo</h1>
        <p className="text-slate-400">Watch RUSH vs PayPal in real-time</p>
      </div>
      
      <LiveDemo />
    </div>
  );
};

export default PaymentRace;
