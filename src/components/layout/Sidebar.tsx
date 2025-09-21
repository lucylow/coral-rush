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
    { name: 'Voice Agent', href: '/voice-agent', icon: MicrophoneIcon },
    { name: 'Coral Protocol', href: '/coral-orchestrator', icon: GlobeAltIcon },
    { name: 'VM Dashboard', href: '/vm-dashboard', icon: ComputerDesktopIcon },
    { name: 'Payment', href: '/payment', icon: CreditCardIcon },
    { name: 'SOL Utility', href: '/orgo-utility', icon: CurrencyDollarIcon },
    { name: 'Fraud Detection', href: '/fraud-detection', icon: ShieldCheckIcon },
    { name: 'Token Info', href: '/token-info', icon: InformationCircleIcon },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon },
    { name: 'History', href: '/history', icon: ClockIcon },
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
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold text-white">RUSH</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Desktop toggle button */}
              <button
                onClick={onToggle}
                className="hidden md:block p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                title="Toggle sidebar"
              >
                <Bars3Icon className="h-4 w-4 text-slate-300" />
              </button>
              {/* Mobile close button */}
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="p-4 border-b border-slate-700">
            <WalletMultiButton className="w-full !bg-gradient-to-r !from-purple-500 !to-blue-500 hover:!from-purple-600 hover:!to-blue-600 !text-white !font-medium !rounded-lg !py-2 !px-3 !text-sm !transition-all !duration-200" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent p-4 space-y-1">
            <div className="space-y-1.5">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800 hover:shadow-md'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-purple-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    <span className="font-medium truncate text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Stats */}
          {stats && (
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide">System Stats</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Queries</span>
                    <span className="text-white font-medium">{stats.supportQueries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Transactions</span>
                    <span className="text-white font-medium">{stats.transactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Success</span>
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
