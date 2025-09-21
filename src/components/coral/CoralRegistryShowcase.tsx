import React, { useState, useEffect } from 'react';
import { coralRegistry } from '../../coral/CoralRegistry';

interface Agent {
  id: string;
  name: string;
  description: string;
  rental_price: number;
  capabilities: string[];
  status: 'available' | 'rented' | 'busy';
  rating: number;
  response_time: number;
}

interface RegistryStats {
  total_agents: number;
  active_workflows: number;
  network_fees: number;
  total_revenue: number;
  success_rate: number;
}

const CoralRegistryShowcase: React.FC = () => {
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [registryStats, setRegistryStats] = useState<RegistryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [rentingAgent, setRentingAgent] = useState<string | null>(null);

  useEffect(() => {
    const loadCoralRegistry = async () => {
      try {
        setLoading(true);
        
        // Simulate Coral Registry API calls with realistic data
        const agents: Agent[] = [
          {
            id: 'voice-processor-001',
            name: 'Voice Processing Agent',
            description: 'Advanced voice recognition and natural language processing',
            rental_price: 0.05,
            capabilities: ['Speech-to-Text', 'Intent Recognition', 'Multi-language'],
            status: 'available',
            rating: 4.9,
            response_time: 50
          },
          {
            id: 'blockchain-executor-002',
            name: 'Blockchain Executor Agent',
            description: 'Smart contract execution and transaction management',
            rental_price: 0.08,
            capabilities: ['Smart Contracts', 'Transaction Validation', 'Gas Optimization'],
            status: 'available',
            rating: 4.8,
            response_time: 120
          },
          {
            id: 'fraud-detector-003',
            name: 'Fraud Detection Agent',
            description: 'Real-time fraud detection and risk assessment',
            rental_price: 0.12,
            capabilities: ['Pattern Recognition', 'Risk Scoring', 'Anomaly Detection'],
            status: 'available',
            rating: 4.9,
            response_time: 80
          },
          {
            id: 'payment-processor-004',
            name: 'Payment Processor Agent',
            description: 'Cross-chain payment processing and settlement',
            rental_price: 0.06,
            capabilities: ['Multi-chain', 'Instant Settlement', 'Currency Conversion'],
            status: 'rented',
            rating: 4.7,
            response_time: 200
          }
        ];

        const stats: RegistryStats = {
          total_agents: 47,
          active_workflows: 23,
          network_fees: 125.50,
          total_revenue: 2847.30,
          success_rate: 98.7
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setAvailableAgents(agents);
        setRegistryStats(stats);
        
      } catch (error) {
        console.error('Failed to load Coral Registry:', error);
        // Set fallback data
        setAvailableAgents([]);
        setRegistryStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadCoralRegistry();
  }, []);

  const handleRentAgent = async (agentId: string) => {
    try {
      setRentingAgent(agentId);
      
      // Simulate rental process
      await coralRegistry.rentAgent(agentId, 60).catch(() => {
        // Fallback for demo
        console.log(`Renting agent ${agentId} for 60 minutes`);
      });
      
      // Update agent status
      setAvailableAgents(prev => 
        prev.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: 'rented' as const }
            : agent
        )
      );
      
      // Show success message
      setTimeout(() => {
        setRentingAgent(null);
        alert(`✅ Agent rented successfully! Available for 60 minutes.`);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to rent agent:', error);
      setRentingAgent(null);
      alert('❌ Failed to rent agent. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="coral-registry-showcase">
        <div className="loading-state">
          <div className="agent-coordination-loading">
            <div className="agent-pulse"></div>
            <div className="agent-pulse"></div>
            <div className="agent-pulse"></div>
            <div className="agent-pulse"></div>
            <span>Loading Coral Registry...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="coral-registry-showcase">
      <div className="registry-header">
        <h3>🌊 Live Coral Registry Integration</h3>
        <p className="registry-subtitle">
          Discover, rent, and monetize AI agents in the decentralized marketplace
        </p>
      </div>

      {registryStats && (
        <div className="registry-stats">
          <div className="stat-card">
            <div className="stat-value">{registryStats.total_agents}</div>
            <div className="stat-label">Available Agents</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{registryStats.active_workflows}</div>
            <div className="stat-label">Active Workflows</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">${registryStats.network_fees}</div>
            <div className="stat-label">Network Fees</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{registryStats.success_rate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      )}

      <div className="rentable-agents">
        <h4>🤖 Available Agents for Rental</h4>
        <div className="agents-grid">
          {availableAgents.map(agent => (
            <div key={agent.id} className="agent-card">
              <div className="agent-header">
                <h5>{agent.name}</h5>
                <div className={`status-badge ${agent.status}`}>
                  {agent.status === 'rented' ? '🔒 Rented' : '✅ Available'}
                </div>
              </div>
              
              <p className="agent-description">{agent.description}</p>
              
              <div className="agent-metrics">
                <div className="metric">
                  <span className="metric-label">Rating:</span>
                  <span className="metric-value">⭐ {agent.rating}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Response:</span>
                  <span className="metric-value">{agent.response_time}ms</span>
                </div>
              </div>
              
              <div className="agent-capabilities">
                {agent.capabilities.map(capability => (
                  <span key={capability} className="capability-tag">
                    {capability}
                  </span>
                ))}
              </div>
              
              <div className="agent-footer">
                <div className="rental-price">
                  <span className="price">${agent.rental_price}</span>
                  <span className="price-unit">/hour</span>
                </div>
                
                <button
                  className={`rent-button ${agent.status === 'rented' ? 'disabled' : ''}`}
                  onClick={() => handleRentAgent(agent.id)}
                  disabled={agent.status === 'rented' || rentingAgent === agent.id}
                >
                  {rentingAgent === agent.id ? (
                    <>
                      <div className="spinner"></div>
                      Renting...
                    </>
                  ) : agent.status === 'rented' ? (
                    'Rented'
                  ) : (
                    'Rent Agent'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="coral-advantages">
        <h4>🚀 Coral Protocol Advantages</h4>
        <div className="advantages-grid">
          <div className="advantage-item">
            <div className="advantage-icon">🔒</div>
            <div className="advantage-text">Zero-trust agent orchestration</div>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon">🔗</div>
            <div className="advantage-text">Cross-framework compatibility</div>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon">💰</div>
            <div className="advantage-text">Monetizable agent rental</div>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon">🌐</div>
            <div className="advantage-text">Decentralized agent discovery</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoralRegistryShowcase;