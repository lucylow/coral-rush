import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, Search, Filter, Download, ExternalLink, PlayCircle, CheckCircle, Clock, AlertCircle, Mic, Brain, Zap, Pause, Volume2, FileText } from "lucide-react";

interface SupportSession {
  id: string;
  timestamp: Date;
  query: string;
  response: string;
  status: 'completed' | 'in-progress' | 'failed';
  duration: string;
  resolution?: string;
  nftMinted?: boolean;
  transcriptUrl?: string;
  audioUrl?: string;
  transcript?: string;
  agents: Array<{
    type: 'listener' | 'brain' | 'executor';
    actions: string[];
  }>;
}

const SupportHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock support history data
  const [supportHistory] = useState<SupportSession[]>([
    {
      id: "session-001",
      timestamp: new Date(Date.now() - 86400000),
      query: "My NFT minting transaction failed and I was charged gas fees",
      response: "I've verified your transaction failed on-chain, so no NFT mint occurred. As compensation, I've minted a Support Resolution NFT to your wallet.",
      status: 'completed',
      duration: "45 seconds",
      resolution: "Compensation NFT minted",
      nftMinted: true,
      transcriptUrl: "/transcripts/session-001.txt",
      audioUrl: "/audio/session-001.mp3",
      transcript: `[00:00:00] User: "Hi, I'm having an issue with my NFT minting transaction. It failed but I was still charged gas fees. Can you help me?"

[00:00:05] Coral Listener Agent: Processing voice command... Speech-to-text conversion complete. Intent extracted: Transaction failure complaint.

[00:00:08] Coral Brain Agent: Analyzing transaction data... Checking blockchain records... Issue classified as failed transaction with gas fee charge.

[00:00:15] Coral Executor Agent: Verifying transaction on-chain... Confirming no NFT was minted... Preparing compensation solution.

[00:00:25] Coral Brain Agent: Orchestrating multi-agent response... Solution: Mint compensation NFT to user's wallet.

[00:00:30] Coral Executor Agent: Executing NFT minting... Transaction submitted... Wallet notification sent.

[00:00:45] System: Support Resolution NFT successfully minted to user wallet. Transaction hash: 0x1234...abcd`,
      agents: [
        { type: 'listener', actions: ['Voice command processing via Coral Protocol', 'Speech-to-text conversion', 'Intent extraction'] },
        { type: 'brain', actions: ['Coral Protocol orchestration', 'Transaction analysis', 'Issue classification', 'Multi-agent solution planning'] },
        { type: 'executor', actions: ['Blockchain verification', 'Coral Protocol agent coordination', 'NFT minting', 'Wallet notification'] }
      ]
    },
    {
      id: "session-002", 
      timestamp: new Date(Date.now() - 172800000),
      query: "How do I connect my Phantom wallet to your platform?",
      response: "I'll guide you through the Phantom wallet connection process. Please click the 'Connect Wallet' button in the top right corner.",
      status: 'completed',
      duration: "28 seconds",
      resolution: "Wallet connection successful",
      nftMinted: false,
      transcriptUrl: "/transcripts/session-002.txt",
      audioUrl: "/audio/session-002.mp3",
      transcript: `[00:00:00] User: "I'm new to this platform and I want to connect my Phantom wallet. Can you help me with that?"

[00:00:03] Coral Listener Agent: Processing voice command... Natural language understanding complete. Intent: Wallet connection tutorial request.

[00:00:06] Coral Brain Agent: Analyzing user intent... Selecting appropriate tutorial flow... Routing to wallet connection guidance.

[00:00:10] Coral Executor Agent: Initiating UI guidance sequence... Highlighting connect wallet button... Preparing step-by-step instructions.

[00:00:15] Coral Brain Agent: Monitoring user interaction... Detecting wallet connection attempt... Verifying connection status.

[00:00:20] Coral Executor Agent: Wallet connection detected... Verifying connection... Confirming successful connection.

[00:00:28] System: Phantom wallet successfully connected. User can now proceed with platform features.`,
      agents: [
        { type: 'listener', actions: ['Coral Protocol voice processing', 'Natural language understanding'] },
        { type: 'brain', actions: ['Coral Protocol intent analysis', 'Multi-agent routing', 'Tutorial selection'] },
        { type: 'executor', actions: ['Coral Protocol coordination', 'UI guidance', 'Wallet connection verification'] }
      ]
    },
    {
      id: "session-003",
      timestamp: new Date(Date.now() - 259200000),
      query: "My swap transaction is stuck in pending for 2 hours",
      response: "I found your transaction stuck due to low gas. I've submitted a replacement transaction with higher gas fees.",
      status: 'completed', 
      duration: "67 seconds",
      resolution: "Transaction accelerated",
      nftMinted: false,
      transcriptUrl: "/transcripts/session-003.txt",
      audioUrl: "/audio/session-003.mp3",
      transcript: `[00:00:00] User: "My swap transaction has been stuck in pending for over 2 hours now. This is really frustrating!"

[00:00:05] Coral Listener Agent: Processing voice command... Emotional tone analysis: High stress detected. Urgency level: Critical.

[00:00:08] Coral Brain Agent: Analyzing transaction status... Checking blockchain for pending transaction... Gas analysis in progress.

[00:00:15] Coral Executor Agent: Transaction found on blockchain... Gas price too low for current network conditions... Preparing replacement transaction.

[00:00:25] Coral Brain Agent: Multi-agent coordination... Calculating optimal gas price... Formulating acceleration solution.

[00:00:35] Coral Executor Agent: Submitting replacement transaction with higher gas... Monitoring confirmation status... Tracking progress.

[00:00:50] Coral Brain Agent: Transaction acceleration successful... Confirming replacement transaction... Notifying user of resolution.

[00:00:67] System: Transaction successfully accelerated. New transaction hash: 0x5678...efgh. Estimated confirmation: 2-3 minutes.`,
      agents: [
        { type: 'listener', actions: ['Coral Protocol voice processing', 'Emotional tone analysis', 'Urgency detection'] },
        { type: 'brain', actions: ['Coral Protocol multi-agent coordination', 'Transaction tracking', 'Gas analysis', 'Solution formulation'] },
        { type: 'executor', actions: ['Coral Protocol execution', 'Gas estimation', 'Transaction replacement', 'Confirmation tracking'] }
      ]
    },
    {
      id: "session-004",
      timestamp: new Date(Date.now() - 345600000),
      query: "I can't see my recent NFT purchase in my wallet",
      status: 'in-progress',
      response: "Investigating wallet sync issues and checking metadata refresh",
      duration: "ongoing",
      transcriptUrl: "/transcripts/session-004.txt",
      audioUrl: "/audio/session-004.mp3",
      transcript: `[00:00:00] User: "I just bought an NFT about 30 minutes ago but I can't see it in my wallet. The transaction went through successfully."

[00:00:03] Coral Listener Agent: Processing voice command... Coral Protocol voice processing complete. Intent: NFT visibility issue.

[00:00:06] Coral Brain Agent: Coral Protocol orchestration initiated... Wallet analysis in progress... Checking transaction history.

[00:00:12] Coral Executor Agent: Coral Protocol coordination active... Verifying transaction on blockchain... Checking wallet sync status.

[00:00:20] Coral Brain Agent: Transaction confirmed on-chain... NFT metadata refresh required... Initiating metadata sync.

[00:00:30] Coral Executor Agent: Metadata refresh pending... Wallet sync in progress... Estimated completion: 2-3 minutes.

[00:00:45] System: Investigation ongoing. Wallet sync and metadata refresh in progress. User will be notified when complete.`,
      agents: [
        { type: 'listener', actions: ['Coral Protocol voice processing complete'] },
        { type: 'brain', actions: ['Coral Protocol orchestration', 'Wallet analysis in progress'] },
        { type: 'executor', actions: ['Coral Protocol coordination', 'Metadata refresh pending'] }
      ]
    }
  ]);

  const filteredHistory = supportHistory.filter(session => {
    const matchesSearch = session.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.response.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = session.timestamp > new Date(Date.now() - 86400000);
    } else if (dateFilter === "week") {
      matchesDate = session.timestamp > new Date(Date.now() - 604800000);
    } else if (dateFilter === "month") {
      matchesDate = session.timestamp > new Date(Date.now() - 2592000000);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: SupportSession['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: SupportSession['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getAgentIcon = (type: 'listener' | 'brain' | 'executor') => {
    switch (type) {
      case 'listener': return <Mic className="w-4 h-4 text-blue-400" />;
      case 'brain': return <Brain className="w-4 h-4 text-orange-400" />;
      case 'executor': return <Zap className="w-4 h-4 text-green-400" />;
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'rush-support-history.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handlePlayAudio = (sessionId: string) => {
    if (playingAudio === sessionId) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Start new audio (mock - in real implementation, this would load actual audio)
      setPlayingAudio(sessionId);
      
      // Simulate audio playback with a timeout
      setTimeout(() => {
        setPlayingAudio(null);
      }, 5000); // Mock 5-second audio
    }
  };

  const handleShowTranscript = (sessionId: string) => {
    setTranscriptOpen(sessionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🌊 Coral Protocol Support History
          </h1>
          <p className="text-gray-400 mb-4">
            Review your past voice interactions powered by Coral Protocol's multi-agent orchestration system
          </p>
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-lg p-4 border border-blue-700/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-300">Coral Protocol Agent Activity</span>
            </div>
            <p className="text-sm text-gray-300">
              Each support session showcases our specialized AI agents working together through Coral Protocol's 
              orchestration framework. See how Voice Listener, Intent Analysis, Fraud Detection, and Payment Processor 
              agents collaborate to solve your Web3 challenges.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={exportHistory}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-400">
            Found {filteredHistory.length} conversation{filteredHistory.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Support Sessions */}
        <div className="space-y-6">
          {filteredHistory.map((session) => (
            <Card key={session.id} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">
                        Session #{session.id.split('-')[1]}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(session.status)}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(session.status)}
                          {session.status.replace('-', ' ')}
                        </div>
                      </Badge>
                      {session.nftMinted && (
                        <Badge variant="outline" className="text-green-400 bg-green-400/10 border-green-400/20">
                          NFT Minted
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {session.timestamp.toLocaleDateString()} at {session.timestamp.toLocaleTimeString()}
                      </div>
                      <div>Duration: {session.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {session.audioUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 hover:bg-gray-700"
                        onClick={() => handlePlayAudio(session.id)}
                      >
                        {playingAudio === session.id ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Stop Audio
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Play Audio
                          </>
                        )}
                      </Button>
                    )}
                    {session.transcript && (
                      <Dialog open={transcriptOpen === session.id} onOpenChange={() => setTranscriptOpen(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-600 hover:bg-gray-700"
                            onClick={() => handleShowTranscript(session.id)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Transcript
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white flex items-center gap-2">
                              <FileText className="w-5 h-5" />
                              Session #{session.id.split('-')[1]} Transcript
                            </DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh] pr-4">
                            <div className="space-y-4">
                              <div className="text-sm text-gray-400 mb-4">
                                Session Date: {session.timestamp.toLocaleDateString()} at {session.timestamp.toLocaleTimeString()}
                              </div>
                              <pre className="whitespace-pre-wrap text-gray-200 font-mono text-sm leading-relaxed bg-gray-800/50 p-4 rounded-lg border border-gray-600/50">
                                {session.transcript}
                              </pre>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* User Query */}
                  <div>
                    <h4 className="font-medium text-blue-300 mb-2">Your Question:</h4>
                    <p className="text-gray-200 bg-gray-800/50 p-3 rounded-lg border border-gray-600/50">
                      "{session.query}"
                    </p>
                  </div>
                  
                  {/* Agent Response */}
                  {session.response && (
                    <div>
                      <h4 className="font-medium text-green-300 mb-2">Agent Response:</h4>
                      <p className="text-gray-200 bg-gray-800/50 p-3 rounded-lg border border-gray-600/50">
                        {session.response}
                      </p>
                    </div>
                  )}
                  
                  {/* Resolution Summary */}
                  {session.resolution && (
                    <div>
                      <h4 className="font-medium text-purple-300 mb-2">Resolution:</h4>
                      <p className="text-gray-200 bg-gray-800/50 p-3 rounded-lg border border-gray-600/50">
                        {session.resolution}
                      </p>
                    </div>
                  )}

                  <Separator className="bg-gray-700" />
                  
                  {/* Agent Activity Summary */}
                  <div>
                    <h4 className="font-medium text-gray-300 mb-3">Agent Activity:</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {session.agents.map((agent, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center gap-2 font-medium capitalize">
                            {getAgentIcon(agent.type)}
                            {agent.type} Agent
                          </div>
                          <ul className="space-y-1 text-sm text-gray-400">
                            {agent.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredHistory.length === 0 && (
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No conversations found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria or start a new conversation
              </p>
              <Link to="/voice-agent">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Start New Conversation
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SupportHistoryPage;