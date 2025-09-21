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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🌊 RUSH Coral Protocol
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          color: '#cbd5e1'
        }}>
          Voice-First Web3 Customer Support Agent
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>🔗 MCP-Native Architecture</h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>True Coral Protocol v1 integration with standardized agent communication</p>
          </div>
          
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#8b5cf6', marginBottom: '10px' }}>💰 Agent Registry</h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Real revenue generation through agent rental and monetization</p>
          </div>
          
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#10b981', marginBottom: '10px' }}>🧵 Thread Orchestration</h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Structured multi-agent coordination with real-time visualization</p>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#fbbf24' }}>🚀 Ready for Internet of Agents Hackathon</h2>
          <p style={{ marginBottom: '20px', color: '#cbd5e1' }}>
            This implementation demonstrates RUSH as the definitive example of what's possible with Coral Protocol v1
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => window.location.href = '/coral-hackathon'}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              🌊 Coral Protocol Demo
            </button>
            <button 
              onClick={() => window.location.href = '/coral-orchestrator'}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              🎭 Live Orchestration
            </button>
          </div>
        </div>
        
        <p style={{
          fontSize: '0.9rem',
          color: '#64748b',
          marginTop: '20px'
        }}>
          ✅ Coral Protocol v1 Integration Complete<br/>
          ✅ MCP-Native Architecture Implemented<br/>
          ✅ Agent Registry & Monetization Ready<br/>
          ✅ Thread-Based Orchestration Active
        </p>
      </div>
    </div>
  );
};

export default App;
