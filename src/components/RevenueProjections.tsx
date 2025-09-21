import React, { useState, useEffect } from 'react';

interface RevenueProjection {
  period: string;
  mrr: number;
  platforms: number;
  queries: number;
  revenue_per_query: number;
  growth_rate: number;
  market_share: number;
}

const RevenueProjections: React.FC = () => {
  const [projections, setProjections] = useState<RevenueProjection[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month12');
  const [animatedValues, setAnimatedValues] = useState({
    mrr: 0,
    platforms: 0,
    queries: 0,
    revenue_per_query: 0
  });

  useEffect(() => {
    const mockProjections: RevenueProjection[] = [
      {
        period: 'month1',
        mrr: 15000,
        platforms: 25,
        queries: 50000,
        revenue_per_query: 0.30,
        growth_rate: 0,
        market_share: 0.1
      },
      {
        period: 'month6',
        mrr: 125000,
        platforms: 200,
        queries: 500000,
        revenue_per_query: 0.25,
        growth_rate: 733,
        market_share: 0.8
      },
      {
        period: 'month12',
        mrr: 500000,
        platforms: 1000,
        queries: 2500000,
        revenue_per_query: 0.20,
        growth_rate: 3233,
        market_share: 3.2
      },
      {
        period: 'month24',
        mrr: 2000000,
        platforms: 5000,
        queries: 10000000,
        revenue_per_query: 0.20,
        growth_rate: 13233,
        market_share: 12.5
      }
    ];

    setProjections(mockProjections);
  }, []);

  useEffect(() => {
    const currentProjection = projections.find(p => p.period === selectedPeriod);
    if (!currentProjection) return;

    // Animate values
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

    // Animate MRR
    animateValue(0, currentProjection.mrr, 1000, (value) => {
      setAnimatedValues(prev => ({ ...prev, mrr: value }));
    });

    // Animate platforms
    animateValue(0, currentProjection.platforms, 1200, (value) => {
      setAnimatedValues(prev => ({ ...prev, platforms: value }));
    });

    // Animate queries
    animateValue(0, currentProjection.queries, 1500, (value) => {
      setAnimatedValues(prev => ({ ...prev, queries: value }));
    });

    // Animate revenue per query
    animateValue(0, currentProjection.revenue_per_query, 800, (value) => {
      setAnimatedValues(prev => ({ ...prev, revenue_per_query: value }));
    });

  }, [selectedPeriod, projections]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    } else {
      return value.toFixed(0);
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'month1': return 'Month 1';
      case 'month6': return 'Month 6';
      case 'month12': return 'Month 12';
      case 'month24': return 'Month 24';
      default: return period;
    }
  };

  const currentProjection = projections.find(p => p.period === selectedPeriod);

  return (
    <div className="revenue-projections">
      <div className="revenue-header">
        <h3>📈 Revenue Projections</h3>
        <p className="revenue-subtitle">
          Scalable revenue model through Coral Protocol agent rental and monetization
        </p>
      </div>

      <div className="period-selector">
        <h4>Select Time Period</h4>
        <div className="period-buttons">
          {projections.map((projection) => (
            <button
              key={projection.period}
              className={`period-button ${selectedPeriod === projection.period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(projection.period)}
            >
              {getPeriodLabel(projection.period)}
            </button>
          ))}
        </div>
      </div>

      {currentProjection && (
        <>
          <div className="revenue-overview">
            <div className="overview-card primary">
              <div className="overview-icon">💰</div>
              <div className="overview-content">
                <div className="overview-value">{formatCurrency(animatedValues.mrr)}</div>
                <div className="overview-label">Monthly Recurring Revenue</div>
                <div className="overview-growth">
                  {currentProjection.growth_rate > 0 && (
                    <span className="growth-rate">+{currentProjection.growth_rate}% growth</span>
                  )}
                </div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">🏢</div>
              <div className="overview-content">
                <div className="overview-value">{formatNumber(animatedValues.platforms)}</div>
                <div className="overview-label">Platforms</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">📊</div>
              <div className="overview-content">
                <div className="overview-value">{formatNumber(animatedValues.queries)}</div>
                <div className="overview-label">Monthly Queries</div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-icon">💵</div>
              <div className="overview-content">
                <div className="overview-value">${animatedValues.revenue_per_query.toFixed(2)}</div>
                <div className="overview-label">Revenue per Query</div>
              </div>
            </div>
          </div>

          <div className="revenue-breakdown">
            <h4>💰 Revenue Breakdown</h4>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <div className="breakdown-label">Agent Rental Fees</div>
                <div className="breakdown-value">
                  {formatCurrency(currentProjection.mrr * 0.6)}
                </div>
                <div className="breakdown-percentage">60%</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Transaction Fees</div>
                <div className="breakdown-value">
                  {formatCurrency(currentProjection.mrr * 0.25)}
                </div>
                <div className="breakdown-percentage">25%</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Premium Features</div>
                <div className="breakdown-value">
                  {formatCurrency(currentProjection.mrr * 0.15)}
                </div>
                <div className="breakdown-percentage">15%</div>
              </div>
            </div>
          </div>

          <div className="market-analysis">
            <h4>🌍 Market Analysis</h4>
            <div className="market-grid">
              <div className="market-item">
                <div className="market-label">Market Share</div>
                <div className="market-value">{currentProjection.market_share}%</div>
                <div className="market-description">Of Web3 support market</div>
              </div>
              <div className="market-item">
                <div className="market-label">Total Addressable Market</div>
                <div className="market-value">$2.4B</div>
                <div className="market-description">Web3 support market size</div>
              </div>
              <div className="market-item">
                <div className="market-label">Serviceable Market</div>
                <div className="market-value">$240M</div>
                <div className="market-description">Addressable market</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="revenue-timeline">
        <h4>📅 Revenue Timeline</h4>
        <div className="timeline-grid">
          {projections.map((projection, index) => (
            <div 
              key={projection.period}
              className={`timeline-card ${selectedPeriod === projection.period ? 'active' : ''}`}
            >
              <div className="timeline-header">
                <h5>{getPeriodLabel(projection.period)}</h5>
                <div className="timeline-growth">
                  {projection.growth_rate > 0 && (
                    <span className="growth-badge">+{projection.growth_rate}%</span>
                  )}
                </div>
              </div>
              <div className="timeline-metrics">
                <div className="timeline-metric">
                  <span className="metric-label">MRR:</span>
                  <span className="metric-value">{formatCurrency(projection.mrr)}</span>
                </div>
                <div className="timeline-metric">
                  <span className="metric-label">Platforms:</span>
                  <span className="metric-value">{formatNumber(projection.platforms)}</span>
                </div>
                <div className="timeline-metric">
                  <span className="metric-label">Queries:</span>
                  <span className="metric-value">{formatNumber(projection.queries)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="revenue-strategy">
        <h4>🚀 Revenue Strategy</h4>
        <div className="strategy-grid">
          <div className="strategy-item">
            <div className="strategy-icon">🎯</div>
            <div className="strategy-content">
              <h5>Freemium Model</h5>
              <p>Free tier with basic support, premium features for advanced needs</p>
            </div>
          </div>
          <div className="strategy-item">
            <div className="strategy-icon">💰</div>
            <div className="strategy-content">
              <h5>Usage-Based Pricing</h5>
              <p>Pay per query with volume discounts for high-usage platforms</p>
            </div>
          </div>
          <div className="strategy-item">
            <div className="strategy-icon">🤝</div>
            <div className="strategy-content">
              <h5>Partnership Revenue</h5>
              <p>Revenue sharing with Web3 platforms and agent developers</p>
            </div>
          </div>
          <div className="strategy-item">
            <div className="strategy-icon">🌐</div>
            <div className="strategy-content">
              <h5>Marketplace Fees</h5>
              <p>Transaction fees from agent rental and marketplace activities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="revenue-cta">
        <h4>🚀 Ready to Scale Your Revenue?</h4>
        <p>Join the Coral Protocol ecosystem and monetize your AI agents</p>
        <div className="cta-buttons">
          <button className="cta-button primary">
            💰 Start Monetizing
          </button>
          <button className="cta-button secondary">
            📊 View Business Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueProjections;