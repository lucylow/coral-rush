import React from 'react';
import CoralRegistryShowcase from './CoralRegistryShowcase';

const AgentRegistry: React.FC = () => {
  return (
    <div className="agent-registry">
      <div className="registry-header">
        <h1>🤖 Agent Registry</h1>
        <p>Discover, rent, and monetize AI agents in the Coral Protocol marketplace</p>
      </div>
      
      <CoralRegistryShowcase />
    </div>
  );
};

export default AgentRegistry;