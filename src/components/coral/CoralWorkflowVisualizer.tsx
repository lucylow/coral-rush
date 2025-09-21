import React, { useState, useEffect } from 'react';

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  duration: number;
  coralFeature: string;
  description: string;
  agents: string[];
}

const CoralWorkflowVisualizer: React.FC = () => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'discovery',
      name: 'Agent Discovery',
      status: 'complete',
      duration: 50,
      coralFeature: 'Registry API',
      description: 'Discover available agents in Coral Registry',
      agents: ['Registry Agent', 'Discovery Service']
    },
    {
      id: 'coordination',
      name: 'Multi-Agent Coordination',
      status: 'active',
      duration: 150,
      coralFeature: 'MCP Integration',
      description: 'Coordinate multiple agents using MCP protocol',
      agents: ['Voice Agent', 'Blockchain Agent', 'Fraud Agent']
    },
    {
      id: 'execution',
      name: 'Smart Contract Execution',
      status: 'pending',
      duration: 300,
      coralFeature: 'Transaction Engine',
      description: 'Execute blockchain transactions and smart contracts',
      agents: ['Execution Agent', 'Validation Agent']
    },
    {
      id: 'settlement',
      name: 'Payment Settlement',
      status: 'pending',
      duration: 200,
      coralFeature: 'Payment Engine',
      description: 'Process payments and agent compensation',
      agents: ['Payment Agent', 'Settlement Service']
    }
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        if (nextStep >= workflowSteps.length) {
          // Reset workflow after completion
          setTimeout(() => {
            setWorkflowSteps(prev => 
              prev.map((step, index) => ({
                ...step,
                status: index === 0 ? 'complete' : index === 1 ? 'active' : 'pending'
              }))
            );
            setCurrentStep(1);
            setTotalTime(0);
          }, 2000);
          return prev;
        }
        
        // Update workflow steps
        setWorkflowSteps(prev => 
          prev.map((step, index) => {
            if (index < nextStep) {
              return { ...step, status: 'complete' as const };
            } else if (index === nextStep) {
              return { ...step, status: 'active' as const };
            } else {
              return { ...step, status: 'pending' as const };
            }
          })
        );
        
        return nextStep;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [workflowSteps.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(prev => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return '✅';
      case 'active': return '⚡';
      case 'pending': return '⏳';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return '#10b981';
      case 'active': return '#3b82f6';
      case 'pending': return '#6b7280';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="coral-workflow-visualizer">
      <div className="workflow-header">
        <h3>🔄 Coral Protocol Workflow Engine</h3>
        <p className="workflow-subtitle">
          Real-time multi-agent orchestration powered by Coral Protocol v1
        </p>
      </div>

      <div className="workflow-metrics">
        <div className="metric-card">
          <div className="metric-value">{totalTime}ms</div>
          <div className="metric-label">Total Execution Time</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{workflowSteps.filter(s => s.status === 'complete').length}</div>
          <div className="metric-label">Steps Completed</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{workflowSteps.reduce((acc, step) => acc + step.agents.length, 0)}</div>
          <div className="metric-label">Agents Coordinated</div>
        </div>
      </div>

      <div className="workflow-steps">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className={`workflow-step ${step.status}`}>
            <div className="step-header">
              <div className="step-icon">
                {getStatusIcon(step.status)}
              </div>
              <div className="step-info">
                <h4 className="step-name">{step.name}</h4>
                <p className="step-description">{step.description}</p>
              </div>
              <div className="step-duration">
                {step.duration}ms
              </div>
            </div>
            
            <div className="step-details">
              <div className="coral-feature">
                <span className="feature-label">Coral Feature:</span>
                <span className="feature-name">{step.coralFeature}</span>
              </div>
              
              <div className="step-agents">
                <span className="agents-label">Agents:</span>
                <div className="agents-list">
                  {step.agents.map((agent, agentIndex) => (
                    <span key={agentIndex} className="agent-tag">
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {step.status === 'active' && (
              <div className="step-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(totalTime % (step.duration * 10)) / (step.duration * 10) * 100}%`,
                      backgroundColor: getStatusColor(step.status)
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="workflow-advantages">
        <h4>🚀 Coral Protocol Advantages</h4>
        <div className="advantages-list">
          <div className="advantage-item">
            <span className="advantage-icon">🔒</span>
            <span className="advantage-text">Zero-trust agent orchestration</span>
          </div>
          <div className="advantage-item">
            <span className="advantage-icon">🔗</span>
            <span className="advantage-text">Cross-framework compatibility</span>
          </div>
          <div className="advantage-item">
            <span className="advantage-icon">💰</span>
            <span className="advantage-text">Monetizable agent rental</span>
          </div>
          <div className="advantage-item">
            <span className="advantage-icon">🌐</span>
            <span className="advantage-text">Decentralized agent discovery</span>
          </div>
        </div>
      </div>

      <div className="workflow-performance">
        <h4>⚡ Performance Metrics</h4>
        <div className="performance-grid">
          <div className="perf-metric">
            <div className="perf-value">50ms</div>
            <div className="perf-label">Agent Discovery</div>
          </div>
          <div className="perf-metric">
            <div className="perf-value">150ms</div>
            <div className="perf-label">Multi-Agent Coordination</div>
          </div>
          <div className="perf-metric">
            <div className="perf-value">300ms</div>
            <div className="perf-label">Blockchain Execution</div>
          </div>
          <div className="perf-metric">
            <div className="perf-value">200ms</div>
            <div className="perf-label">Payment Settlement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoralWorkflowVisualizer;