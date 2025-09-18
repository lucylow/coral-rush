import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RushLandingPage from "./pages/RushLandingPage";
import VoiceAgentPage from "./pages/VoiceAgentPage";
import SupportHistoryPage from "./pages/SupportHistoryPage";
import AgentMarketplacePage from "./pages/AgentMarketplacePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DocumentationPage from "./pages/DocumentationPage";
import LiveDemoPage from "./pages/LiveDemo";
import VMDashboardPage from "./pages/VMDashboardPage";
import PaymentPage from "./pages/PaymentPage";
import OrgoUtilityPage from "./pages/OrgoUtilityPage";
import FraudDetectionPage from "./pages/FraudDetectionPage";
import TokenInfoPage from "./pages/TokenInfoPage";
import WalletPage from "./pages/WalletPage";
import HistoryPage from "./pages/HistoryPage";
import CoralOrchestratorPage from "./pages/CoralOrchestratorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RushLandingPage />} />
          <Route path="/voice-agent" element={<VoiceAgentPage />} />
          <Route path="/dashboard" element={<VoiceAgentPage />} />
          <Route path="/history" element={<SupportHistoryPage />} />
          <Route path="/marketplace" element={<AgentMarketplacePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          
          {/* Legacy routes for existing OrgoRush functionality */}
          <Route path="/orgo-demo" element={<LiveDemoPage />} />
          <Route path="/vm-dashboard" element={<VMDashboardPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/orgo-utility" element={<OrgoUtilityPage />} />
          <Route path="/fraud-detection" element={<FraudDetectionPage />} />
          <Route path="/token-info" element={<TokenInfoPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/orgo-history" element={<HistoryPage />} />
          <Route path="/coral-orchestrator" element={<CoralOrchestratorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
