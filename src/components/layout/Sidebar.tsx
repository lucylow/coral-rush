import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MicrophoneIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  WalletIcon,
  CogIcon,
  XMarkIcon,
  Bars3Icon,
  PlayCircleIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAppState } from '../../contexts/AppStateContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  const location = useLocation();
  const { stats } = useAppState();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Live Demo', href: '/', icon: PlayCircleIcon },
    { name: 'VM Dashboard', href: '/vm-dashboard', icon: ComputerDesktopIcon },
    { name: 'Payment', href: '/payment', icon: CreditCardIcon },
    { name: 'SOL Utility', href: '/orgo-utility', icon: CurrencyDollarIcon },
    { name: 'Fraud Detection', href: '/fraud-detection', icon: ShieldCheckIcon },
    { name: 'Token Info', href: '/token-info', icon: InformationCircleIcon },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon },
    { name: 'History', href: '/history', icon: ClockIcon },
    { name: 'Voice Agent', href: '/voice-agent', icon: MicrophoneIcon },
    { name: 'Coral Protocol', href: '/coral-orchestrator', icon: GlobeAltIcon },
    { name: 'API Health', href: '/api-health', icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-white">RUSH</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Desktop toggle button */}
              <button
                onClick={onToggle}
                className="hidden md:block p-2 rounded-lg hover:bg-slate-800 transition-colors"
                title="Toggle sidebar"
              >
                <Bars3Icon className="h-5 w-5 text-slate-300" />
              </button>
              {/* Mobile close button */}
              <button
                onClick={onClose}
                className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="p-6 border-b border-slate-700">
            <WalletMultiButton className="w-full !bg-gradient-to-r !from-purple-500 !to-blue-500 hover:!from-purple-600 hover:!to-blue-600 !text-white !font-medium !rounded-lg !py-2 !px-4 !transition-all !duration-200" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Stats */}
          {stats && (
            <div className="p-6 border-t border-slate-700">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-400">System Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Support Queries</span>
                    <span className="text-white font-medium">{stats.supportQueries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Transactions</span>
                    <span className="text-white font-medium">{stats.transactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Success Rate</span>
                    <span className="text-green-400 font-medium">{stats.successRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
