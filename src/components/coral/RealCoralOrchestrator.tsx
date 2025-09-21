import React from 'react';
import CoralWorkflowVisualizer from './CoralWorkflowVisualizer';

const RealCoralOrchestrator: React.FC = () => {
  return (
    <div className="real-coral-orchestrator">
      <div className="orchestrator-header">
        <h1>🎭 Real Coral Orchestrator</h1>
        <p>Live multi-agent coordination powered by Coral Protocol v1</p>
      </div>
      
      <CoralWorkflowVisualizer />
    </div>
  );
};

export default RealCoralOrchestrator;