import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import VMDashboard from "@/components/VMDashboard";
import PaymentForm from "@/components/PaymentForm";
import TokenInfo from "@/components/TokenInfo";
import WalletBalance from "@/components/WalletBalance";
import TransactionHistory from "@/components/TransactionHistory";
import OrgoTokenPanel from "@/components/OrgoTokenPanel";
import VisualFraudDashboard from "@/components/VisualFraudDashboard";
import VoiceAgentTheater from "@/components/VoiceAgentTheater";
import VoiceAgentLayout from "@/components/VoiceAgentLayout";

const Index = () => {
  const [viewMode, setViewMode] = useState<'rush' | 'voice-agent'>('voice-agent');

  if (viewMode === 'voice-agent') {
    return <VoiceAgentLayout />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                RUSH Payment Agent
              </h1>
              <p className="text-muted-foreground mt-2">
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => setViewMode('voice-agent')}
              className="ml-4"
            >
              Switch to Voice Agent
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vm" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
            <TabsTrigger value="vm">VM Dashboard</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="orgo">SOL Utility</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
            <TabsTrigger value="voice">Voice Agent</TabsTrigger>
            <TabsTrigger value="token">Token Info</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="vm">
            <VMDashboard />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentForm />
          </TabsContent>

          <TabsContent value="orgo">
            <OrgoTokenPanel />
          </TabsContent>

          <TabsContent value="fraud">
            <VisualFraudDashboard />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceAgentTheater />
          </TabsContent>

          <TabsContent value="token">
            <TokenInfo />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletBalance />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;