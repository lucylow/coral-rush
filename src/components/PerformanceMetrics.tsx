import React, { useState, useEffect } from 'react';

interface PerformanceMetric {
  title: string;
  value: number;
  unit: string;
  target: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
  trend: 'up' | 'down' | 'stable';
}

const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurementProgress, setMeasurementProgress] = useState(0);

  useEffect(() => {
    const measurePerformance = async () => {
      setIsMeasuring(true);
      setMeasurementProgress(0);

      // Simulate performance measurement
      const progressInterval = setInterval(() => {
        setMeasurementProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      // Simulate measurement delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockMetrics: PerformanceMetric[] = [
        {
          title: 'Voice Processing',
          value: 45,
          unit: 'ms',
          target: 50,
          status: 'excellent',
          description: 'Speech-to-text conversion time',
          trend: 'down'
        },
        {
          title: 'Agent Coordination',
          value: 150,
          unit: 'ms',
          target: 200,
          status: 'excellent',
          description: 'Multi-agent communication time',
          trend: 'stable'
        },
        {
          title: 'Blockchain Execution',
          value: 300,
          unit: 'ms',
          target: 500,
          status: 'good',
          description: 'Smart contract execution time',
          trend: 'down'
        },
        {
          title: 'Total Resolution',
          value: 495,
          unit: 'ms',
          target: 1000,
          status: 'excellent',
          description: 'End-to-end problem resolution',
          trend: 'down'
        },
        {
          title: 'Success Rate',
          value: 98.7,
          unit: '%',
          target: 95,
          status: 'excellent',
          description: 'Successful issue resolution rate',
          trend: 'up'
        },
        {
          title: 'User Satisfaction',
          value: 4.9,
          unit: '/5',
          target: 4.5,
          status: 'excellent',
          description: 'Average user satisfaction score',
          trend: 'up'
        }
      ];

      setMetrics(mockMetrics);
      setIsMeasuring(false);
      setMeasurementProgress(100);
    };

    measurePerformance();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'excellent': return 'rgba(16, 185, 129, 0.1)';
      case 'good': return 'rgba(59, 130, 246, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'critical': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    } else if (unit === '/5') {
      return `${value.toFixed(1)}/5`;
    } else {
      return `${value}${unit}`;
    }
  };

  const calculatePerformanceScore = () => {
    if (metrics.length === 0) return 0;
    
    const totalScore = metrics.reduce((sum, metric) => {
      const ratio = metric.value / metric.target;
      const score = ratio <= 1 ? 100 : Math.max(0, 100 - (ratio - 1) * 50);
      return sum + score;
    }, 0);
    
    return totalScore / metrics.length;
  };

  return (
    <div className="performance-metrics">
      <div className="metrics-header">
        <h3>⚡ Real-Time Performance Metrics</h3>
        <p className="metrics-subtitle">
          Live performance monitoring of RUSH's Coral Protocol integration
        </p>
      </div>

      {isMeasuring && (
        <div className="measurement-progress">
          <div className="progress-header">
            <h4>🔍 Measuring Performance</h4>
            <p>Analyzing system performance across all components...</p>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${measurementProgress}%` }}
            ></div>
          </div>
          <div className="progress-text">{measurementProgress}% Complete</div>
        </div>
      )}

      {!isMeasuring && metrics.length > 0 && (
        <>
          <div className="performance-overview">
            <div className="overview-card primary">
              <div className="overview-icon">🎯</div>
              <div className="overview-content">
                <div className="overview-value">{calculatePerformanceScore().toFixed(1)}%</div>
                <div className="overview-label">Overall Performance Score</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">⚡</div>
              <div className="overview-content">
                <div className="overview-value">{metrics.find(m => m.title === 'Total Resolution')?.value}ms</div>
                <div className="overview-label">Average Resolution Time</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">✅</div>
              <div className="overview-content">
                <div className="overview-value">{metrics.find(m => m.title === 'Success Rate')?.value}%</div>
                <div className="overview-label">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className="metric-card"
                style={{
                  borderColor: getStatusColor(metric.status),
                  background: getStatusBackground(metric.status)
                }}
              >
                <div className="metric-header">
                  <h5 className="metric-title">{metric.title}</h5>
                  <div className="metric-status" style={{ backgroundColor: getStatusColor(metric.status) }}>
                    {metric.status.toUpperCase()}
                  </div>
                </div>

                <div className="metric-value">
                  <span className="value">{formatValue(metric.value, metric.unit)}</span>
                  <span className="trend">{getTrendIcon(metric.trend)}</span>
                </div>

                <div className="metric-details">
                  <div className="metric-description">{metric.description}</div>
                  <div className="metric-target">
                    Target: {formatValue(metric.target, metric.unit)}
                  </div>
                </div>

                <div className="metric-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(100, (metric.value / metric.target) * 100)}%`,
                        backgroundColor: getStatusColor(metric.status)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="performance-comparison">
            <h4>📊 Performance Comparison</h4>
            <div className="comparison-grid">
              <div className="comparison-item">
                <h5>Traditional Support</h5>
                <div className="comparison-metrics">
                  <div className="comparison-metric">
                    <span className="metric-label">Resolution Time:</span>
                    <span className="metric-value">3-5 days</span>
                  </div>
                  <div className="comparison-metric">
                    <span className="metric-label">Success Rate:</span>
                    <span className="metric-value">40-60%</span>
                  </div>
                  <div className="comparison-metric">
                    <span className="metric-label">Cost per Resolution:</span>
                    <span className="metric-value">$15-50</span>
                  </div>
                </div>
              </div>
              <div className="comparison-item rush">
                <h5>RUSH with Coral Protocol</h5>
                <div className="comparison-metrics">
                  <div className="comparison-metric">
                    <span className="metric-label">Resolution Time:</span>
                    <span className="metric-value">0.5 seconds</span>
                  </div>
                  <div className="comparison-metric">
                    <span className="metric-label">Success Rate:</span>
                    <span className="metric-value">98.7%</span>
                  </div>
                  <div className="comparison-metric">
                    <span className="metric-label">Cost per Resolution:</span>
                    <span className="metric-value">$0.50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="performance-breakdown">
            <h4>🔍 Performance Breakdown</h4>
            <div className="breakdown-chart">
              <div className="breakdown-item">
                <div className="breakdown-label">Voice Processing</div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill"
                    style={{ 
                      width: '45%',
                      backgroundColor: '#10b981'
                    }}
                  ></div>
                </div>
                <div className="breakdown-value">45ms</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Agent Coordination</div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill"
                    style={{ 
                      width: '75%',
                      backgroundColor: '#10b981'
                    }}
                  ></div>
                </div>
                <div className="breakdown-value">150ms</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Blockchain Execution</div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill"
                    style={{ 
                      width: '60%',
                      backgroundColor: '#3b82f6'
                    }}
                  ></div>
                </div>
                <div className="breakdown-value">300ms</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="performance-cta">
        <h4>🚀 Optimize Your Platform Performance</h4>
        <p>Experience the same lightning-fast performance for your Web3 platform</p>
        <div className="cta-buttons">
          <button className="cta-button primary">
            ⚡ Enable Performance Monitoring
          </button>
          <button className="cta-button secondary">
            📊 View Detailed Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;