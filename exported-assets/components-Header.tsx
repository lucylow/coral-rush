# Header Component

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  Bars3Icon, 
  XMarkIcon,
  MicrophoneIcon,
  BellIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { useAppState } from '../../contexts/AppStateContext';
import Logo from '../ui/Logo';
import NotificationDropdown from '../ui/NotificationDropdown';
import UserMenu from '../ui/UserMenu';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
  const location = useLocation();
  const { connected, publicKey } = useWallet();
  const { notifications, user } = useAppState();

  const navigation = [
    { name: '🏠 Home', href: '/', current: location.pathname === '/' },
    { name: '🎤 Voice Support', href: '/voice-support', current: location.pathname.startsWith('/voice-support') },
    { name: '💳 Payments', href: '/payments', current: location.pathname.startsWith('/payments') },
    { name: '📊 Dashboard', href: '/dashboard', current: location.pathname.startsWith('/dashboard') },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Navigation */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              onClick={onMenuClick}
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center ml-2 lg:ml-0">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-white">RUSH</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex ml-10 space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side - Actions & User */}
          <div className="flex items-center space-x-4">
            {/* Voice Button */}
            <button className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <MicrophoneIcon className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <NotificationDropdown 
              notifications={notifications}
              trigger={
                <button className="relative p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <BellIcon className="h-5 w-5" />
                  {notifications?.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.unreadCount > 9 ? '9+' : notifications.unreadCount}
                    </span>
                  )}
                </button>
              }
            />

            {/* Wallet Connection */}
            <div className="hidden sm:block">
              <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md !text-sm" />
            </div>

            {/* User Menu */}
            {connected && publicKey && (
              <UserMenu 
                user={user}
                publicKey={publicKey}
                trigger={
                  <button className="flex items-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <UserCircleIcon className="h-6 w-6" />
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```