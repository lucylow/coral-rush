import React, { useState, useEffect } from 'react';

interface DemoStep {
  id: string;
  title: string;
  script: string;
  visual: string;
  duration: number;
  emotion: 'problem' | 'solution' | 'success' | 'impact';
}

const EmotionalDemoScript: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScript, setShowScript] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: 'problem',
      title: '😰 The Problem',
      script: "Meet Sarah - she just lost $500 in a failed NFT mint. Traditional Web3 support would take 3-5 days and she'd probably never get her money back.",
      visual: 'Frustrated user with failed transaction',
      duration: 3000,
      emotion: 'problem'
    },
    {
      id: 'solution',
      title: '🎤 RUSH Solution',
      script: "User speaks: 'My NFT mint failed and I lost money'. RUSH processes this instantly using Coral Protocol's multi-agent coordination.",
      visual: 'Voice input processing in real-time',
      duration: 4000,
      emotion: 'solution'
    },
    {
      id: 'success',
      title: '⚡ Instant Resolution',
      script: "0.3 seconds later: Automatic refund NFT minted to user's wallet. Sarah gets her money back instantly with blockchain confirmation.",
      visual: 'Success animation with blockchain confirmation',
      duration: 3500,
      emotion: 'success'
    },
    {
      id: 'impact',
      title: '🎯 Business Impact',
      script: "Cost: $350 → $0.50 | Time: 3 days → 0.3 seconds | Customer Satisfaction: 40% → 98%",
      visual: 'ROI metrics animation',
      duration: 4000,
      emotion: 'impact'
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % demoSteps.length);
      }, demoSteps[currentStep].duration);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, demoSteps]);

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setShowScript(true);
  };

  const stopDemo = () => {
    setIsPlaying(false);
    setShowScript(false);
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'problem': return '#ef4444';
      case 'solution': return '#3b82f6';
      case 'success': return '#10b981';
      case 'impact': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getEmotionBackground = (emotion: string) => {
    switch (emotion) {
      case 'problem': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)';
      case 'solution': return 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)';
      case 'success': return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)';
      case 'impact': return 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)';
      default: return 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.1) 100%)';
    }
  };

  return (
    <div className="emotional-demo-script">
      <div className="demo-header">
        <h3>🎭 The Sarah Story - Emotional Demo</h3>
        <p className="demo-subtitle">
          Experience the transformation from frustration to instant resolution
        </p>
      </div>

      <div className="demo-controls">
        <button
          className={`demo-button ${isPlaying ? 'stop' : 'start'}`}
          onClick={isPlaying ? stopDemo : startDemo}
        >
          {isPlaying ? '⏹️ Stop Demo' : '▶️ Start Demo'}
        </button>
        <div className="demo-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${isPlaying ? ((currentStep + 1) / demoSteps.length) * 100 : 0}%`,
                backgroundColor: getEmotionColor(demoSteps[currentStep]?.emotion || 'problem')
              }}
            ></div>
          </div>
          <div className="progress-text">
            Step {currentStep + 1} of {demoSteps.length}
          </div>
        </div>
      </div>

      {showScript && (
        <div className="demo-content">
          <div 
            className="demo-step"
            style={{
              background: getEmotionBackground(demoSteps[currentStep].emotion),
              borderColor: getEmotionColor(demoSteps[currentStep].emotion)
            }}
          >
            <div className="step-header">
              <h4 className="step-title">{demoSteps[currentStep].title}</h4>
              <div className="step-timer">
                {isPlaying && (
                  <div className="timer-circle">
                    <div 
                      className="timer-fill"
                      style={{
                        background: `conic-gradient(${getEmotionColor(demoSteps[currentStep].emotion)} 0deg, transparent 0deg)`
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="step-script">
              <p>{demoSteps[currentStep].script}</p>
            </div>
            
            <div className="step-visual">
              <div className="visual-indicator">
                🎬 {demoSteps[currentStep].visual}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="demo-steps-overview">
        <h4>📋 Demo Script Overview</h4>
        <div className="steps-grid">
          {demoSteps.map((step, index) => (
            <div 
              key={step.id} 
              className={`step-card ${index === currentStep ? 'active' : ''}`}
              style={{
                borderColor: getEmotionColor(step.emotion),
                background: index === currentStep ? getEmotionBackground(step.emotion) : 'transparent'
              }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-info">
                <h5>{step.title}</h5>
                <p>{step.script}</p>
              </div>
              <div className="step-duration">{step.duration / 1000}s</div>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-metrics">
        <h4>📊 Demo Impact Metrics</h4>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-icon">⏱️</div>
            <div className="metric-content">
              <div className="metric-value">0.3s</div>
              <div className="metric-label">Resolution Time</div>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <div className="metric-value">$349.50</div>
              <div className="metric-label">Cost Savings</div>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon">😊</div>
            <div className="metric-content">
              <div className="metric-value">98%</div>
              <div className="metric-label">Satisfaction</div>
            </div>
          </div>
          <div className="metric-item">
            <div className="metric-icon">🔄</div>
            <div className="metric-content">
              <div className="metric-value">24/7</div>
              <div className="metric-label">Availability</div>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-cta">
        <h4>🚀 Ready to Transform Your Support?</h4>
        <p>Experience the same instant resolution for your Web3 platform</p>
        <div className="cta-buttons">
          <button className="cta-button primary">
            🌊 Try Coral Protocol Demo
          </button>
          <button className="cta-button secondary">
            📞 Schedule Integration Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmotionalDemoScript;