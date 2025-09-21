import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Book, Code, Mic, Brain, Zap, ExternalLink, Copy, CheckCircle, Video, FileText, MessageCircle, Github } from "lucide-react";

const DocumentationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");
  const [copiedCode, setCopiedCode] = useState("");

  const navigation = [
    {
      title: "Getting Started",
      id: "getting-started",
      items: [
        { title: "Quick Start", id: "quick-start" },
        { title: "Voice Interface", id: "voice-interface" },
        { title: "Wallet Connection", id: "wallet-connection" },
        { title: "First Support Session", id: "first-session" }
      ]
    },
    {
      title: "Voice Agent System",
      id: "voice-agents",
      items: [
        { title: "Listener Agent", id: "listener-agent" },
        { title: "Brain Agent", id: "brain-agent" },
        { title: "Executor Agent", id: "executor-agent" },
        { title: "Agent Coordination", id: "agent-coordination" }
      ]
    },
    {
      title: "API Reference",
      id: "api-reference",
      items: [
        { title: "Voice Processing API", id: "voice-api" },
        { title: "Agent Interaction API", id: "agent-api" },
        { title: "Blockchain Operations", id: "blockchain-api" },
        { title: "Webhook Events", id: "webhooks" }
      ]
    },
    {
      title: "Integration Guides",
      id: "integrations",
      items: [
        { title: "ElevenLabs Setup", id: "elevenlabs" },
        { title: "Mistral AI Configuration", id: "mistral" },
        { title: "Crossmint Integration", id: "crossmint" },
        { title: "Custom Agents", id: "custom-agents" }
      ]
    },
    {
      title: "Troubleshooting",
      id: "troubleshooting",
      items: [
        { title: "Common Issues", id: "common-issues" },
        { title: "Error Codes", id: "error-codes" },
        { title: "Performance Tips", id: "performance" },
        { title: "Support Channels", id: "support" }
      ]
    }
  ];

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Getting Started with RUSH
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Welcome to RUSH - the Voice-First Web3 Customer Support Agent. This guide will help you get up and running in minutes.
              </p>
            </div>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-blue-400" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-2xl mb-2">1️⃣</div>
                    <h4 className="font-medium mb-2">Connect Your Wallet</h4>
                    <p className="text-sm text-gray-400">Link your Web3 wallet to enable blockchain operations</p>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <div className="text-2xl mb-2">2️⃣</div>
                    <h4 className="font-medium mb-2">Start Voice Session</h4>
                    <p className="text-sm text-gray-400">Click the microphone and speak your Web3 question</p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-2xl mb-2">3️⃣</div>
                    <h4 className="font-medium mb-2">Get AI Resolution</h4>
                    <p className="text-sm text-gray-400">Receive instant help with real blockchain actions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Voice Interface Basics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  The RUSH voice interface uses advanced speech recognition to understand your Web3 support needs in natural language.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-300">Supported Voice Commands:</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• "My transaction failed, can you help?"</li>
                    <li>• "I can't see my NFT in my wallet"</li>
                    <li>• "How do I connect my Phantom wallet?"</li>
                    <li>• "My swap is stuck in pending"</li>
                    <li>• "I need help with DeFi protocols"</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                  <h4 className="font-medium text-yellow-300 mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-gray-300">
                    Speak clearly and provide specific details about your issue. The more context you provide, the better our AI agents can help you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "voice-agents":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Voice Agent System</h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                RUSH uses a coordinated multi-agent system to provide comprehensive Web3 support through natural voice interaction.
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="bg-gray-900/50 border-gray-700 border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Mic className="w-5 h-5" />
                    Listener Agent
                  </CardTitle>
                  <Badge variant="outline" className="text-blue-400 bg-blue-400/10 border-blue-400/20 w-fit">
                    Speech Processing
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    The Listener Agent handles all voice input processing, converting speech to text with high accuracy and natural language understanding.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Key Capabilities:</h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-400">
                      <li>• 95%+ speech recognition accuracy</li>
                      <li>• 12 language support</li>
                      <li>• Real-time transcription</li>
                      <li>• Noise cancellation</li>
                      <li>• Emotional tone analysis</li>
                      <li>• Context preservation</li>
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-300 mb-2">Technical Details</h4>
                    <p className="text-sm text-gray-300">
                      Powered by ElevenLabs advanced speech recognition with custom fine-tuning for Web3 terminology and blockchain-specific vocabulary.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700 border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Brain className="w-5 h-5" />
                    Brain Agent
                  </CardTitle>
                  <Badge variant="outline" className="text-orange-400 bg-orange-400/10 border-orange-400/20 w-fit">
                    Intent Analysis
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    The Brain Agent analyzes user requests, understands context, and formulates optimal solution strategies using advanced AI reasoning.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Core Functions:</h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-400">
                      <li>• Intent classification</li>
                      <li>• Context understanding</li>
                      <li>• Solution planning</li>
                      <li>• Risk assessment</li>
                      <li>• Multi-step reasoning</li>
                      <li>• Escalation logic</li>
                    </ul>
                  </div>

                  <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                    <h4 className="font-medium text-orange-300 mb-2">AI Model</h4>
                    <p className="text-sm text-gray-300">
                      Utilizes Mistral AI with specialized training on Web3 protocols, common issues, and resolution strategies for optimal support outcomes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700 border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Zap className="w-5 h-5" />
                    Executor Agent
                  </CardTitle>
                  <Badge variant="outline" className="text-green-400 bg-green-400/10 border-green-400/20 w-fit">
                    Blockchain Operations
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    The Executor Agent performs actual blockchain operations to resolve issues, including transaction verification, NFT minting, and wallet interactions.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Execution Capabilities:</h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-400">
                      <li>• Transaction verification</li>
                      <li>• NFT minting & transfers</li>
                      <li>• Smart contract interaction</li>
                      <li>• Multi-chain operations</li>
                      <li>• Gas optimization</li>
                      <li>• Error recovery</li>
                    </ul>
                  </div>

                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-300 mb-2">Blockchain Integration</h4>
                    <p className="text-sm text-gray-300">
                      Powered by Crossmint for secure, reliable blockchain operations across multiple networks including Ethereum, Solana, Polygon, and more.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "api-reference":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">API Reference</h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Complete API documentation for integrating with RUSH voice agents and blockchain operations.
              </p>
            </div>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  Voice Processing API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Start Voice Session</h4>
                    <div className="bg-gray-800 rounded-lg p-4 relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard('POST /api/voice/start', 'voice-start')}
                      >
                        {copiedCode === 'voice-start' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <pre className="text-sm text-gray-300">
{`POST /api/voice/start
Content-Type: application/json

{
  "sessionId": "string",
  "walletAddress": "string",
  "language": "en-US"
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Process Audio Input</h4>
                    <div className="bg-gray-800 rounded-lg p-4 relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard('POST /api/voice/process', 'voice-process')}
                      >
                        {copiedCode === 'voice-process' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <pre className="text-sm text-gray-300">
{`POST /api/voice/process
Content-Type: multipart/form-data

{
  "sessionId": "string",
  "audioFile": File,
  "format": "webm|mp3|wav"
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Response Example</h4>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <pre className="text-sm text-gray-300">
{`{
  "sessionId": "sess_123abc",
  "transcript": "My NFT transaction failed",
  "agents": {
    "listener": {
      "confidence": 0.96,
      "processing_time": 1.2
    },
    "brain": {
      "intent": "failed_transaction",
      "confidence": 0.94,
      "action_plan": ["verify_tx", "mint_compensation"]
    },
    "executor": {
      "status": "executing",
      "estimated_time": 15
    }
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">🌊 Coral Protocol Documentation</h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Select a section from the navigation to view detailed documentation.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900/50 border-gray-700 sticky top-8">
              <CardHeader className="pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search docs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600"
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-96">
                  <nav className="space-y-6">
                    {navigation.map((section) => (
                      <div key={section.id}>
                        <h4 className="font-medium text-gray-300 mb-2">{section.title}</h4>
                        <ul className="space-y-1">
                          {section.items.map((item) => (
                            <li key={item.id}>
                              <Button
                                variant="ghost"
                                className={`w-full justify-start text-sm ${
                                  activeSection === item.id ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'
                                }`}
                                onClick={() => setActiveSection(item.id)}
                              >
                                {item.title}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="mt-6 bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start border-gray-600">
                  <Video className="w-4 h-4 mr-2" />
                  Video Tutorials
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-gray-600">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Repository
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-gray-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Community Discord
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-8">
                {renderContent()}
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-400 text-sm">
              <p>
                Need help? Join our{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300">Discord community</a>{" "}
                or{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300">contact support</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;