import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Search, Filter, Download, ExternalLink, PlayCircle, CheckCircle, Clock, AlertCircle, Mic, Brain, Zap } from "lucide-react";

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
  agents: Array<{
    type: 'listener' | 'brain' | 'executor';
    actions: string[];
  }>;
}

const SupportHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

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
      agents: [
        { type: 'listener', actions: ['Speech to text conversion', 'Natural language processing'] },
        { type: 'brain', actions: ['Transaction analysis', 'Issue classification', 'Solution planning'] },
        { type: 'executor', actions: ['Blockchain verification', 'NFT minting', 'Wallet notification'] }
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
      agents: [
        { type: 'listener', actions: ['Voice input processing'] },
        { type: 'brain', actions: ['Intent recognition', 'Tutorial selection'] },
        { type: 'executor', actions: ['UI guidance', 'Connection verification'] }
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
      agents: [
        { type: 'listener', actions: ['Audio transcription', 'Emotional analysis'] },
        { type: 'brain', actions: ['Transaction tracking', 'Gas analysis', 'Solution formulation'] },
        { type: 'executor', actions: ['Gas estimation', 'Transaction replacement', 'Confirmation tracking'] }
      ]
    },
    {
      id: "session-004",
      timestamp: new Date(Date.now() - 345600000),
      query: "I can't see my recent NFT purchase in my wallet",
      status: 'in-progress',
      response: "Investigating wallet sync issues and checking metadata refresh",
      duration: "ongoing",
      agents: [
        { type: 'listener', actions: ['Voice processing complete'] },
        { type: 'brain', actions: ['Wallet analysis in progress'] },
        { type: 'executor', actions: ['Metadata refresh pending'] }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Support History
          </h1>
          <p className="text-gray-400">
            Review your past voice interactions and their resolutions
          </p>
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
                      <Button variant="outline" size="sm" className="border-gray-600">
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Play Audio
                      </Button>
                    )}
                    {session.transcriptUrl && (
                      <Button variant="outline" size="sm" className="border-gray-600">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Transcript
                      </Button>
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