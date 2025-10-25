import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';
import ErrorBoundary from './components/ErrorBoundary';

// Layout Components
import MainLayout from './layouts/MainLayout';

// Page Components
import HomePage from './pages/HomePage';
import VoiceInterface from './pages/VoiceInterface';
import PaymentRace from './pages/PaymentRace';
import DashboardOverview from './pages/DashboardOverview';
import WalletBalance from './pages/WalletBalance';

// Coral Protocol Components
import CoralHackathonDemo from './components/CoralHackathonDemo';
import AethirDashboard from './components/coral/AethirDashboard';
import RealCoralOrchestrator from './components/coral/RealCoralOrchestrator';
import AgentRegistry from './components/coral/AgentRegistry';

// Legacy Pages (for backward compatibility)
import RushLandingPage from './pages/RushLandingPage';
import VoiceAgentPage from './pages/VoiceAgentPage';
import SupportHistoryPage from './pages/SupportHistoryPage';
import AgentMarketplacePage from './pages/AgentMarketplacePage';
import AnalyticsPage from './pages/AnalyticsPage';
import DocumentationPage from './pages/DocumentationPage';
import LiveDemoPage from './pages/LiveDemo';
import VMDashboardPage from './pages/VMDashboardPage';
import PaymentPage from './pages/PaymentPage';
import OrgoUtilityPage from './pages/OrgoUtilityPage';
import FraudDetectionPage from './pages/FraudDetectionPage';
import TokenInfoPage from './pages/TokenInfoPage';
import WalletPage from './pages/WalletPage';
import HistoryPage from './pages/HistoryPage';
import CoralOrchestratorPage from './pages/CoralOrchestratorPage';
import ApiHealthPage from './pages/ApiHealthPage';
import NFTRefundsPage from './pages/NFTRefundsPage';
import CustomerSupportPage from './pages/CustomerSupportPage';
import SupportDashboardPage from './pages/SupportDashboardPage';
import AIFrameworksPage from './pages/AIFrameworksPage';
import NotFound from './pages/NotFound';

// Providers
import { AppStateProvider } from './contexts/AppStateContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Styles
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

// Wallet configuration with error handling for production
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

// Safe wallet initialization for production
const wallets = [];
try {
  wallets.push(new PhantomWalletAdapter());
  wallets.push(new SolflareWalletAdapter());
} catch (error) {
  console.warn('Wallet adapters failed to initialize:', error);
  // Continue without wallets in production
}

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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Initialize app with production error handling
    const initializeApp = async () => {
      try {
        // Add any initialization logic here
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate loading
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
        setHasError(true);
      }
    };

    initializeApp();
  }, []);

  // Production error fallback
  if (hasError) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#1a1a1a', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h1>🚀 RUSH</h1>
          <p>Voice-First Web3 Customer Support Agent</p>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">RUSH</h2>
          <p className="text-slate-400">Initializing Voice-First Web3 Agent...</p>
          <p className="text-red-400 mt-4">Debug: Loading state active</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
                            <Route index element={<RushLandingPage />} />
                            
                            {/* Voice Support Routes */}
                            <Route path="voice-support" element={<VoiceInterface />} />
                            <Route path="voice-agent" element={<VoiceAgentPage />} />
                            
                            {/* Payment Routes */}
                            <Route path="payments" element={<PaymentRace />} />
                            <Route path="payment" element={<PaymentPage />} />
                            <Route path="orgo-demo" element={<LiveDemoPage />} />
                            
                            {/* Dashboard Routes */}
                            <Route path="dashboard" element={<DashboardOverview />} />
                            <Route path="analytics" element={<AnalyticsPage />} />
                            <Route path="vm-dashboard" element={<VMDashboardPage />} />
                            
                            {/* Wallet Routes */}
                            <Route path="wallet" element={<WalletBalance />} />
                            <Route path="wallet-legacy" element={<WalletPage />} />
                            
                            {/* Coral Protocol Routes */}
                            <Route path="coral-hackathon" element={<CoralHackathonDemo />} />
                            <Route path="aethir-dashboard" element={<AethirDashboard />} />
                            <Route path="coral-orchestrator" element={<RealCoralOrchestrator />} />
                            <Route path="agent-registry" element={<AgentRegistry />} />
                            <Route path="coral-protocol/payment" element={<PaymentPage />} />
                            
                            {/* Legacy Routes */}
                            <Route path="history" element={<SupportHistoryPage />} />
                            <Route path="marketplace" element={<AgentMarketplacePage />} />
                            <Route path="docs" element={<DocumentationPage />} />
                            <Route path="api-health" element={<ApiHealthPage />} />
                            <Route path="orgo-utility" element={<OrgoUtilityPage />} />
                            <Route path="fraud-detection" element={<FraudDetectionPage />} />
                            <Route path="token-info" element={<TokenInfoPage />} />
                            <Route path="orgo-history" element={<HistoryPage />} />
                            
                            {/* New Support Routes */}
                            <Route path="support-dashboard" element={<SupportDashboardPage />} />
                            <Route path="nft-refunds" element={<NFTRefundsPage />} />
                            <Route path="customer-support" element={<CustomerSupportPage />} />
                            
                            {/* AI Frameworks Integration */}
                            <Route path="ai-frameworks" element={<AIFrameworksPage />} />
                            
                            {/* Legacy payment route for backward compatibility */}
                            <Route path="payment" element={<Navigate to="/coral-protocol/payment" replace />} />
                          </Route>

                          {/* Legacy standalone routes */}
                          <Route path="/rush-landing" element={<RushLandingPage />} />

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
    </ErrorBoundary>
  );
};

export default App;
