# RUSH Multi-Page DApp - Main Application

```tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Layout Components
import MainLayout from './layouts/MainLayout';

// Page Components
import HomePage from './pages/HomePage';
import VoiceSupportLayout from './layouts/VoiceSupportLayout';
import PaymentsLayout from './layouts/PaymentsLayout';
import DashboardLayout from './layouts/DashboardLayout';
import WalletLayout from './layouts/WalletLayout';

// Voice Support Pages
import VoiceInterface from './pages/voice-support/VoiceInterface';
import SupportHistory from './pages/voice-support/SupportHistory';
import AgentMarketplace from './pages/voice-support/AgentMarketplace';
import HelpCenter from './pages/voice-support/HelpCenter';

// Payment Pages
import SendPayment from './pages/payments/SendPayment';
import PaymentRace from './pages/payments/PaymentRace';
import PaymentHistory from './pages/payments/PaymentHistory';
import TokenManagement from './pages/payments/TokenManagement';

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import VMMonitoring from './pages/dashboard/VMMonitoring';
import AIAnalytics from './pages/dashboard/AIAnalytics';
import SystemHealth from './pages/dashboard/SystemHealth';

// Wallet Pages
import BalanceView from './pages/wallet/BalanceView';
import NFTGallery from './pages/wallet/NFTGallery';
import TransactionExplorer from './pages/wallet/TransactionExplorer';
import StakingInterface from './pages/wallet/StakingInterface';

// Providers
import { AppStateProvider } from './contexts/AppStateContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Styles
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

// Wallet configuration
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Add any initialization logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">RUSH</h2>
          <p className="text-slate-400">Initializing Voice-First Web3 Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ThemeProvider>
              <AppStateProvider>
                <VoiceProvider>
                  <Router>
                    <div className="App">
                      <Routes>
                        {/* Main Layout Routes */}
                        <Route path="/" element={<MainLayout />}>
                          {/* Home Page */}
                          <Route index element={<HomePage />} />
                          
                          {/* Voice Support Routes */}
                          <Route path="voice-support" element={<VoiceSupportLayout />}>
                            <Route index element={<VoiceInterface />} />
                            <Route path="history" element={<SupportHistory />} />
                            <Route path="agents" element={<AgentMarketplace />} />
                            <Route path="help" element={<HelpCenter />} />
                          </Route>

                          {/* Payment Routes */}
                          <Route path="payments" element={<PaymentsLayout />}>
                            <Route index element={<Navigate to="send" replace />} />
                            <Route path="send" element={<SendPayment />} />
                            <Route path="demo" element={<PaymentRace />} />
                            <Route path="history" element={<PaymentHistory />} />
                            <Route path="tokens" element={<TokenManagement />} />
                          </Route>

                          {/* Dashboard Routes */}
                          <Route path="dashboard" element={<DashboardLayout />}>
                            <Route index element={<Navigate to="overview" replace />} />
                            <Route path="overview" element={<DashboardOverview />} />
                            <Route path="vms" element={<VMMonitoring />} />
                            <Route path="ai" element={<AIAnalytics />} />
                            <Route path="health" element={<SystemHealth />} />
                          </Route>

                          {/* Wallet Routes */}
                          <Route path="wallet" element={<WalletLayout />}>
                            <Route index element={<Navigate to="balance" replace />} />
                            <Route path="balance" element={<BalanceView />} />
                            <Route path="nfts" element={<NFTGallery />} />
                            <Route path="transactions" element={<TransactionExplorer />} />
                            <Route path="staking" element={<StakingInterface />} />
                          </Route>
                        </Route>

                        {/* Catch-all redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                  </Router>
                </VoiceProvider>
              </AppStateProvider>
            </ThemeProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export default App;
```