# Dashboard Overview Component

```tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CpuChipIcon,
  BoltIcon,
  ShieldCheckIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAppState } from '../../contexts/AppStateContext';
import MetricCard from '../../components/dashboard/MetricCard';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import SystemStatus from '../../components/dashboard/SystemStatus';
import RecentActivity from '../../components/dashboard/RecentActivity';
import AlertPanel from '../../components/dashboard/AlertPanel';

const DashboardOverview: React.FC = () => {
  const { stats, systemHealth, recentActivity, alerts } = useAppState();
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const keyMetrics = [
    {
      title: 'Support Queries',
      value: stats?.supportQueries || 1247,
      change: '+12.5%',
      trend: 'up' as const,
      icon: UsersIcon,
      color: 'purple'
    },
    {
      title: 'Transactions/Day',
      value: stats?.transactions || 42700,
      change: '+8.2%',
      trend: 'up' as const,
      icon: BoltIcon,
      color: 'blue'
    },
    {
      title: 'ORGO Burned',
      value: stats?.tokensBurned || 2847.39,
      change: '+625 today',
      trend: 'up' as const,
      icon: CurrencyDollarIcon,
      color: 'orange'
    },
    {
      title: 'Success Rate',
      value: '99.7%',
      change: '+0.2%',
      trend: 'up' as const,
      icon: ShieldCheckIcon,
      color: 'emerald'
    }
  ];

  const vmStatus = [
    {
      name: 'Routing Optimizer',
      status: 'healthy',
      cpu: 45,
      memory: 62,
      uptime: '99.9%',
      lastUpdate: '2 min ago'
    },
    {
      name: 'Risk Management',
      status: 'healthy',
      cpu: 33,
      memory: 55,
      uptime: '99.8%',
      lastUpdate: '1 min ago'
    },
    {
      name: 'Compliance Engine',
      status: 'warning',
      cpu: 78,
      memory: 84,
      uptime: '99.5%',
      lastUpdate: '30 sec ago'
    },
    {
      name: 'Treasury Management',
      status: 'healthy',
      cpu: 41,
      memory: 58,
      uptime: '100%',
      lastUpdate: '1 min ago'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-slate-400">Real-time insights into your RUSH network performance</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          {(['1h', '24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <AlertPanel alerts={alerts} />
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ChartBarIcon className="w-5 h-5 text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live</span>
              </div>
            </div>
            
            <PerformanceChart timeRange={timeRange} />
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center mb-4">
              <CpuChipIcon className="w-5 h-5 text-purple-400 mr-2" />
              <h2 className="text-lg font-semibold text-white">System Health</h2>
            </div>
            
            <SystemStatus health={systemHealth} />
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Avg Response Time</span>
                <span className="text-white font-semibold">0.3s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Sessions</span>
                <span className="text-white font-semibold">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Queue Length</span>
                <span className="text-green-400 font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Error Rate</span>
                <span className="text-green-400 font-semibold">0.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VM Status */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center mb-6">
          <CpuChipIcon className="w-5 h-5 text-emerald-400 mr-2" />
          <h2 className="text-xl font-semibold text-white">Virtual Machine Status</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vmStatus.map((vm, index) => (
            <motion.div
              key={vm.name}
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium text-sm">{vm.name}</h3>
                <div className={`w-2 h-2 rounded-full ${
                  vm.status === 'healthy' ? 'bg-green-500' : 
                  vm.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">CPU</span>
                  <span className="text-white">{vm.cpu}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      vm.cpu > 80 ? 'bg-red-500' : 
                      vm.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${vm.cpu}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-400">Memory</span>
                  <span className="text-white">{vm.memory}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      vm.memory > 80 ? 'bg-red-500' : 
                      vm.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${vm.memory}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-slate-600">
                  <span className="text-slate-400">Uptime</span>
                  <span className="text-green-400 font-medium">{vm.uptime}</span>
                </div>
                
                <div className="text-slate-500 text-center">
                  Updated {vm.lastUpdate}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center mb-4">
            <TrendingUpIcon className="w-5 h-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          
          <RecentActivity 
            activities={recentActivity} 
            maxItems={5} 
            compact={true}
          />
        </div>

        {/* Network Statistics */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="w-5 h-5 text-purple-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Network Statistics</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Total Value Locked</span>
              <span className="text-white font-semibold">$2.4M</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">24h Volume</span>
              <span className="text-white font-semibold">$856K</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Active Users</span>
              <span className="text-white font-semibold">3,247</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Completion Rate</span>
              <span className="text-green-400 font-semibold">99.7%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-slate-700 pt-4">
              <span className="text-slate-400">Network Health</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-400 font-semibold">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
```