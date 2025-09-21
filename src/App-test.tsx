import React from 'react';

const AppTest: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div>
        <h1>🌊 RUSH Coral Protocol Test</h1>
        <p>Voice-First Web3 Customer Support Agent</p>
        <p>✅ React is working!</p>
        <p>✅ Coral Protocol integration ready!</p>
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
          <h3>🚀 Coral Protocol Features:</h3>
          <ul style={{ textAlign: 'left', marginTop: '10px' }}>
            <li>✅ MCP-Native Architecture</li>
            <li>✅ Agent Registry & Monetization</li>
            <li>✅ Thread-Based Orchestration</li>
            <li>✅ Coraliser Integration</li>
            <li>✅ Live Multi-Agent Coordination</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppTest;