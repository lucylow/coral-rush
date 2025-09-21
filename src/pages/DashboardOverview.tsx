import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CpuChipIcon, 
  ServerIcon, 
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAppState } from '../contexts/AppStateContext';

const DashboardOverview: React.FC = () => {
  const { stats, systemHealth, agents, recentActivity } = useAppState();

  const metrics = [
    {
      name: 'System Health',
      value: systemHealth?.overall || 'healthy',
      icon: ShieldCheckIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    },
    {
      name: 'Active VMs',
      value: stats?.activeVMs || 0,
      icon: ServerIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20'
    },
    {
      name: 'CPU Usage',
      value: `${systemHealth?.cpu || 0}%`,
      icon: CpuChipIcon,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20'
    },
    {
      name: 'Memory Usage',
      value: `${systemHealth?.memory || 0}%`,
      icon: ChartBarIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🌊 Coral Protocol Dashboard Overview</h1>
        <p className="text-slate-400">Real-time system monitoring and analytics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`${metric.bgColor} backdrop-blur-sm rounded-lg p-6 border border-slate-700`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{metric.name}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Overview */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Success Rate</span>
                <span className="text-green-400 font-medium">{stats.successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Response</span>
                <span className="text-blue-400 font-medium">{stats.avgResponseTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Uptime</span>
                <span className="text-purple-400 font-medium">{systemHealth?.uptime || '99.9%'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <ClockIcon className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Support Queries</span>
                <span className="text-white font-medium">{stats.supportQueries.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transactions</span>
                <span className="text-white font-medium">{stats.transactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tokens Burned</span>
                <span className="text-orange-400 font-medium">{stats.tokensBurned.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <ServerIcon className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Agents</h3>
            </div>
            <div className="space-y-3">
              {agents.slice(0, 3).map((agent) => (
                <div key={agent.id} className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">{agent.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    agent.status === 'active' ? 'bg-green-900/50 text-green-400' :
                    agent.status === 'idle' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-400' :
                activity.status === 'warning' ? 'bg-yellow-400' :
                activity.status === 'error' ? 'bg-red-400' :
                'bg-blue-400'
              }`} />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{activity.title}</p>
                <p className="text-slate-400 text-xs">{activity.description}</p>
              </div>
              <span className="text-slate-400 text-xs">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
