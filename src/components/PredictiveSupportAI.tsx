import React, { useState, useEffect } from 'react';

interface Prediction {
  id: string;
  predicted_issue: string;
  probability: number;
  suggested_action: string;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  prevention_cost: number;
  resolution_cost: number;
  time_to_occur: string;
}

const PredictiveSupportAI: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    const analyzePotentialIssues = async () => {
      setIsAnalyzing(true);
      setAnalysisProgress(0);

      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockPredictions: Prediction[] = [
        {
          id: 'pred-001',
          predicted_issue: 'High gas fees causing transaction failures',
          probability: 87,
          suggested_action: 'Implement gas optimization and suggest optimal timing',
          impact_level: 'high',
          prevention_cost: 0.05,
          resolution_cost: 15.50,
          time_to_occur: '2-4 hours'
        },
        {
          id: 'pred-002',
          predicted_issue: 'Wallet connection timeout during peak hours',
          probability: 72,
          suggested_action: 'Pre-connect wallet and cache connection state',
          impact_level: 'medium',
          prevention_cost: 0.02,
          resolution_cost: 8.75,
          time_to_occur: '6-8 hours'
        },
        {
          id: 'pred-003',
          predicted_issue: 'NFT minting failure due to insufficient funds',
          probability: 95,
          suggested_action: 'Check balance and suggest funding before mint',
          impact_level: 'critical',
          prevention_cost: 0.01,
          resolution_cost: 25.00,
          time_to_occur: '1-2 hours'
        },
        {
          id: 'pred-004',
          predicted_issue: 'Smart contract interaction timeout',
          probability: 68,
          suggested_action: 'Implement retry mechanism with exponential backoff',
          impact_level: 'medium',
          prevention_cost: 0.03,
          resolution_cost: 12.25,
          time_to_occur: '4-6 hours'
        }
      ];

      setPredictions(mockPredictions);
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    };

    analyzePotentialIssues();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getImpactBackground = (impact: string) => {
    switch (impact) {
      case 'low': return 'rgba(16, 185, 129, 0.1)';
      case 'medium': return 'rgba(245, 158, 11, 0.1)';
      case 'high': return 'rgba(239, 68, 68, 0.1)';
      case 'critical': return 'rgba(220, 38, 38, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const totalPreventionCost = predictions.reduce((sum, pred) => sum + pred.prevention_cost, 0);
  const totalResolutionCost = predictions.reduce((sum, pred) => sum + pred.resolution_cost, 0);
  const totalSavings = totalResolutionCost - totalPreventionCost;

  return (
    <div className="predictive-support-ai">
      <div className="predictive-header">
        <h3>🔮 Predictive Issue Prevention</h3>
        <p className="predictive-subtitle">
          RUSH Innovation: First Web3 support system to predict and prevent user issues
        </p>
      </div>

      {isAnalyzing && (
        <div className="analysis-progress">
          <div className="progress-header">
            <h4>🧠 AI Analysis in Progress</h4>
            <p>Analyzing user's wallet and transaction patterns...</p>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">{analysisProgress}% Complete</div>
        </div>
      )}

      {!isAnalyzing && predictions.length > 0 && (
        <>
          <div className="predictions-overview">
            <div className="overview-card">
              <div className="overview-icon">🎯</div>
              <div className="overview-content">
                <div className="overview-value">{predictions.length}</div>
                <div className="overview-label">Issues Predicted</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">💰</div>
              <div className="overview-content">
                <div className="overview-value">{formatCurrency(totalSavings)}</div>
                <div className="overview-label">Potential Savings</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">⏱️</div>
              <div className="overview-content">
                <div className="overview-value">Proactive</div>
                <div className="overview-label">Prevention Mode</div>
              </div>
            </div>
          </div>

          <div className="predictions-list">
            <h4>🔍 Predicted Issues</h4>
            {predictions.map((prediction) => (
              <div 
                key={prediction.id} 
                className="prediction-card"
                style={{
                  borderColor: getImpactColor(prediction.impact_level),
                  background: getImpactBackground(prediction.impact_level)
                }}
              >
                <div className="prediction-header">
                  <div className="prediction-title">
                    <h5>{prediction.predicted_issue}</h5>
                    <div className="probability-badge">
                      {prediction.probability}% likely
                    </div>
                  </div>
                  <div className="impact-badge" style={{ backgroundColor: getImpactColor(prediction.impact_level) }}>
                    {prediction.impact_level.toUpperCase()}
                  </div>
                </div>

                <div className="prediction-details">
                  <div className="prediction-action">
                    <strong>Suggested Action:</strong> {prediction.suggested_action}
                  </div>
                  <div className="prediction-timing">
                    <strong>Time to Occur:</strong> {prediction.time_to_occur}
                  </div>
                </div>

                <div className="prediction-costs">
                  <div className="cost-item">
                    <span className="cost-label">Prevention Cost:</span>
                    <span className="cost-value prevention">{formatCurrency(prediction.prevention_cost)}</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Resolution Cost:</span>
                    <span className="cost-value resolution">{formatCurrency(prediction.resolution_cost)}</span>
                  </div>
                  <div className="cost-item">
                    <span className="cost-label">Savings:</span>
                    <span className="cost-value savings">
                      {formatCurrency(prediction.resolution_cost - prediction.prevention_cost)}
                    </span>
                  </div>
                </div>

                <div className="prediction-actions">
                  <button className="action-button primary">
                    🛡️ Implement Prevention
                  </button>
                  <button className="action-button secondary">
                    📊 View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="innovation-highlight">
            <h4>🆕 RUSH Innovation: Proactive vs Reactive</h4>
            <div className="innovation-content">
              <div className="innovation-comparison">
                <div className="comparison-item traditional">
                  <h5>❌ Traditional Support</h5>
                  <ul>
                    <li>Wait for user to report issues</li>
                    <li>High resolution costs</li>
                    <li>Poor user experience</li>
                    <li>Reactive approach</li>
                  </ul>
                </div>
                <div className="comparison-item rush">
                  <h5>✅ RUSH Predictive AI</h5>
                  <ul>
                    <li>Predict issues before they occur</li>
                    <li>Minimal prevention costs</li>
                    <li>Seamless user experience</li>
                    <li>Proactive approach</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="predictive-metrics">
            <h4>📊 Predictive Performance</h4>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">94%</div>
                <div className="metric-label">Prediction Accuracy</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">87%</div>
                <div className="metric-label">Issue Prevention Rate</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">$2.4M</div>
                <div className="metric-label">Annual Savings Potential</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">0.1s</div>
                <div className="metric-label">Prediction Speed</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="predictive-cta">
        <h4>🚀 Ready to Prevent Issues Before They Happen?</h4>
        <p>Transform your Web3 platform with predictive support intelligence</p>
        <div className="cta-buttons">
          <button className="cta-button primary">
            🔮 Enable Predictive AI
          </button>
          <button className="cta-button secondary">
            📈 View ROI Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictiveSupportAI;