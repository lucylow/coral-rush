import React, { useState, useEffect } from 'react';

interface BusinessMetrics {
  monthlyQueries: number;
  traditionalCost: number;
  rushCost: number;
  savings: number;
  timesSaved: number;
  costReduction: number;
  roi: number;
}

const BusinessImpactCalculator: React.FC = () => {
  const [monthlyQueries, setMonthlyQueries] = useState(10000);
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    monthlyQueries: 10000,
    traditionalCost: 150000,
    rushCost: 5000,
    savings: 145000,
    timesSaved: 7500,
    costReduction: 96.7,
    roi: 2900
  });

  const [animatedValues, setAnimatedValues] = useState({
    savings: 0,
    timesSaved: 0,
    costReduction: 0,
    roi: 0
  });

  useEffect(() => {
    const calculateMetrics = () => {
      const traditionalCost = monthlyQueries * 15; // $15 per human support ticket
      const rushCost = monthlyQueries * 0.50; // $0.50 per AI resolution
      const savings = traditionalCost - rushCost;
      const timesSaved = monthlyQueries * 45; // 45 minutes saved per query
      const costReduction = ((traditionalCost - rushCost) / traditionalCost) * 100;
      const roi = (savings / rushCost) * 100;

      return {
        monthlyQueries,
        traditionalCost,
        rushCost,
        savings,
        timesSaved: timesSaved / 60, // Convert to hours
        costReduction,
        roi
      };
    };

    const newMetrics = calculateMetrics();
    setMetrics(newMetrics);

    // Animate the values
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * progress;
        callback(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    // Animate savings
    animateValue(0, newMetrics.savings, 1000, (value) => {
      setAnimatedValues(prev => ({ ...prev, savings: value }));
    });

    // Animate time saved
    animateValue(0, newMetrics.timesSaved, 1200, (value) => {
      setAnimatedValues(prev => ({ ...prev, timesSaved: value }));
    });

    // Animate cost reduction
    animateValue(0, newMetrics.costReduction, 800, (value) => {
      setAnimatedValues(prev => ({ ...prev, costReduction: value }));
    });

    // Animate ROI
    animateValue(0, newMetrics.roi, 1500, (value) => {
      setAnimatedValues(prev => ({ ...prev, roi: value }));
    });

  }, [monthlyQueries]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  return (
    <div className="business-impact-calculator">
      <div className="calculator-header">
        <h3>💰 ROI Calculator</h3>
        <p className="calculator-subtitle">
          Calculate the business impact of implementing RUSH for your Web3 platform
        </p>
      </div>

      <div className="calculator-controls">
        <div className="input-group">
          <label htmlFor="monthly-queries">Monthly Support Queries</label>
          <div className="slider-container">
            <input
              id="monthly-queries"
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={monthlyQueries}
              onChange={(e) => setMonthlyQueries(Number(e.target.value))}
              className="query-slider"
            />
            <div className="slider-labels">
              <span>1K</span>
              <span>100K</span>
            </div>
          </div>
          <div className="current-value">
            {formatNumber(monthlyQueries)} queries/month
          </div>
        </div>
      </div>

      <div className="savings-display">
        <div className="metric-card primary">
          <div className="metric-icon">💵</div>
          <div className="metric-content">
            <div className="metric-value">
              {formatCurrency(animatedValues.savings)}
            </div>
            <div className="metric-label">Monthly Savings</div>
            <div className="metric-description">
              Traditional: {formatCurrency(metrics.traditionalCost)} → RUSH: {formatCurrency(metrics.rushCost)}
            </div>
          </div>
        </div>

        <div className="metric-card secondary">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">
              {formatNumber(animatedValues.timesSaved)}h
            </div>
            <div className="metric-label">Time Saved</div>
            <div className="metric-description">
              {formatNumber(monthlyQueries * 45)} minutes → Instant resolution
            </div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">📉</div>
          <div className="metric-content">
            <div className="metric-value">
              {animatedValues.costReduction.toFixed(1)}%
            </div>
            <div className="metric-label">Cost Reduction</div>
            <div className="metric-description">
              From $15/ticket to $0.50/resolution
            </div>
          </div>
        </div>

        <div className="metric-card roi">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">
              {animatedValues.roi.toFixed(0)}%
            </div>
            <div className="metric-label">ROI</div>
            <div className="metric-description">
              Return on investment in first month
            </div>
          </div>
        </div>
      </div>

      <div className="business-scenarios">
        <h4>🎯 Business Scenarios</h4>
        <div className="scenarios-grid">
          <div className="scenario-card">
            <h5>Small Platform</h5>
            <div className="scenario-metrics">
              <div>5K queries/month</div>
              <div>Savings: $72,500</div>
              <div>ROI: 2,900%</div>
            </div>
          </div>
          <div className="scenario-card">
            <h5>Medium Platform</h5>
            <div className="scenario-metrics">
              <div>25K queries/month</div>
              <div>Savings: $362,500</div>
              <div>ROI: 2,900%</div>
            </div>
          </div>
          <div className="scenario-card">
            <h5>Large Platform</h5>
            <div className="scenario-metrics">
              <div>100K queries/month</div>
              <div>Savings: $1,450,000</div>
              <div>ROI: 2,900%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="market-impact">
        <h4>🌍 Market Impact</h4>
        <div className="market-stats">
          <div className="market-stat">
            <div className="stat-value">$2.4B</div>
            <div className="stat-label">Web3 Support Market</div>
          </div>
          <div className="market-stat">
            <div className="stat-value">97%</div>
            <div className="stat-label">Cost Reduction Potential</div>
          </div>
          <div className="market-stat">
            <div className="stat-value">10,000x</div>
            <div className="stat-label">Speed Improvement</div>
          </div>
          <div className="market-stat">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Availability</div>
          </div>
        </div>
      </div>

      <div className="implementation-timeline">
        <h4>🚀 Implementation Timeline</h4>
        <div className="timeline-steps">
          <div className="timeline-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h5>Week 1: Integration</h5>
              <p>Connect RUSH to your platform via Coral Protocol</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h5>Week 2: Testing</h5>
              <p>Deploy in staging environment and test workflows</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h5>Week 3: Launch</h5>
              <p>Go live with RUSH support system</p>
            </div>
          </div>
          <div className="timeline-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h5>Week 4: Scale</h5>
              <p>Monitor performance and scale as needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessImpactCalculator;