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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
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
          <h1>🌊 RUSH Coral Protocol</h1>
          <p>Voice-First Web3 Customer Support Agent</p>
          <p>Error occurred during initialization</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">🌊 RUSH Coral Protocol</h2>
          <p className="text-slate-400">Initializing Voice-First Web3 Agent...</p>
          <p className="text-blue-400 mt-4">Loading Coral Protocol integration...</p>
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
                      <Routes>
                        {/* Main Application Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/voice" element={<VoiceInterface />} />
                        <Route path="/payment-race" element={<PaymentRace />} />
                        <Route path="/dashboard" element={<DashboardOverview />} />
                        <Route path="/wallet-balance" element={<WalletBalance />} />
                        
                        {/* Coral Protocol Routes */}
                        <Route path="/coral-hackathon" element={<CoralHackathonDemo />} />
                        <Route path="/coral-orchestrator" element={<RealCoralOrchestrator />} />
                        <Route path="/agent-registry" element={<AgentRegistry />} />
                        
                        {/* Legacy Routes */}
                        <Route path="/rush-landing" element={<RushLandingPage />} />
                        <Route path="/voice-agent" element={<VoiceAgentPage />} />
                        <Route path="/support-history" element={<SupportHistoryPage />} />
                        <Route path="/agent-marketplace" element={<AgentMarketplacePage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/docs" element={<DocumentationPage />} />
                        <Route path="/live-demo" element={<LiveDemoPage />} />
                        <Route path="/vm-dashboard" element={<VMDashboardPage />} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/orgo-utility" element={<OrgoUtilityPage />} />
                        <Route path="/fraud-detection" element={<FraudDetectionPage />} />
                        <Route path="/token-info" element={<TokenInfoPage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/api-health" element={<ApiHealthPage />} />
                        
                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
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
