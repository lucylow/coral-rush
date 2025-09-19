import React from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Bars3Icon, BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAppState } from '../../contexts/AppStateContext';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
  const { user, notifications } = useAppState();

  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Bars3Icon className="h-6 w-6 text-slate-300" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-white">RUSH</span>
          </Link>
        </div>

        {/* Center - Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/voice-support" 
            className="text-slate-300 hover:text-white transition-colors"
          >
            Voice Support
          </Link>
          <Link 
            to="/payments" 
            className="text-slate-300 hover:text-white transition-colors"
          >
            Payments
          </Link>
          <Link 
            to="/dashboard" 
            className="text-slate-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/wallet" 
            className="text-slate-300 hover:text-white transition-colors"
          >
            Wallet
          </Link>
          <Link 
            to="/coral-hackathon" 
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            🌊 Coral Protocol
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <BellIcon className="h-6 w-6 text-slate-300" />
            {notifications.unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.unreadCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <Cog6ToothIcon className="h-6 w-6 text-slate-300" />
          </button>

          {/* Wallet Connection */}
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-blue-500 hover:!from-purple-600 hover:!to-blue-600 !border-0 !rounded-lg !font-medium" />
        </div>
      </div>
    </header>
  );
};

export default Header;
