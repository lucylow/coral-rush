import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Volume2, Wallet, Activity, Brain, Headphones, Zap, Settings, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceInterface from "@/components/voice/VoiceInterface";
import AgentOrchestra from "@/components/agents/AgentOrchestra";
import BlockchainPanel from "@/components/blockchain/BlockchainPanel";

const VoiceAgentLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
                Voice-First Web3 Support Agent
              </h1>
              <p className="text-gray-400 mt-1">
                Multi-Agent AI Orchestration for Web3 Customer Support
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="border-gray-700 hover:border-gray-600">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:border-gray-600">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Three Panel Layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
          
          {/* Panel 1: Voice Interface (Left - 25%) */}
          <div className="xl:col-span-3">
            <VoiceInterface />
          </div>

          {/* Panel 2: Agent Activity Theater (Center - 50%) */}
          <div className="xl:col-span-6">
            <AgentOrchestra />
          </div>

          {/* Panel 3: Blockchain & Wallet (Right - 25%) */}
          <div className="xl:col-span-3">
            <BlockchainPanel />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/30 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              Powered by ElevenLabs • Mistral AI • Crossmint
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                All Agents Online
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoiceAgentLayout;