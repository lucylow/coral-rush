import React from 'react';
import RealCoralOrchestrator from '../components/coral/RealCoralOrchestrator';

const VoiceInterface: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Voice Support Interface</h1>
        <p className="text-slate-400">AI-powered voice assistance powered by Coral Protocol</p>
      </div>
      
      <RealCoralOrchestrator />
    </div>
  );
};

export default VoiceInterface;
