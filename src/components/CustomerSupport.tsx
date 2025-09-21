import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  Mic,
  Bot,
  Zap,
  Shield,
  Headphones,
  FileText,
  CreditCard,
  Wallet
} from 'lucide-react';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  subject: string;
  description: string;
  category: 'technical' | 'payment' | 'nft' | 'general' | 'refund';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  agentId?: string;
  agentName?: string;
  responseTime: string;
  satisfaction?: number;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  sender: 'user' | 'agent' | 'ai';
  content: string;
  timestamp: string;
  isAI?: boolean;
}

interface SupportStats {
  totalTickets: number;
  openTickets: number;
  avgResponseTime: string;
  satisfaction: number;
  aiResolved: number;
  humanResolved: number;
}

const CustomerSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<SupportStats>({
    totalTickets: 0,
    openTickets: 0,
    avgResponseTime: '0.3s',
    satisfaction: 98.7,
    aiResolved: 0,
    humanResolved: 0
  });
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data initialization
  useEffect(() => {
    const mockTickets: SupportTicket[] = [
      {
        id: 'TICKET-001',
        userId: 'user_123',
        userName: 'Sarah Chen',
        userAvatar: '/placeholder.svg',
        subject: 'NFT mint failed - need refund',
        description: 'I tried to mint a Coral Rush NFT but the transaction failed. I was charged 0.5 SOL but didn\'t receive the NFT. Can you help me get a refund?',
        category: 'nft',
        priority: 'high',
        status: 'resolved',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:15Z',
        resolvedAt: '2024-01-15T10:30:15Z',
        agentId: 'ai_agent_1',
        agentName: 'RUSH AI Agent',
        responseTime: '0.3s',
        satisfaction: 5,
        messages: [
          {
            id: 'msg_1',
            sender: 'user',
            content: 'I tried to mint a Coral Rush NFT but the transaction failed. I was charged 0.5 SOL but didn\'t receive the NFT.',
            timestamp: '2024-01-15T10:30:00Z'
          },
          {
            id: 'msg_2',
            sender: 'ai',
            content: 'I understand your concern about the failed NFT mint. Let me check your transaction and process an immediate refund. I can see the transaction failed due to network congestion. I\'m minting a replacement NFT to your wallet right now.',
            timestamp: '2024-01-15T10:30:05Z',
            isAI: true
          },
          {
            id: 'msg_3',
            sender: 'ai',
            content: '✅ Refund processed! I\'ve minted a replacement Coral Rush NFT to your wallet. The transaction hash is 0x1234...abcd. You should see it in your wallet within 30 seconds.',
            timestamp: '2024-01-15T10:30:15Z',
            isAI: true
          }
        ]
      },
      {
        id: 'TICKET-002',
        userId: 'user_789',
        userName: 'Mike Rodriguez',
        userAvatar: '/placeholder.svg',
        subject: 'Payment method not working',
        description: 'I\'m trying to purchase SOL tokens but my credit card keeps getting declined. Is there an issue with the payment system?',
        category: 'payment',
        priority: 'medium',
        status: 'in_progress',
        createdAt: '2024-01-15T14:22:00Z',
        updatedAt: '2024-01-15T14:25:00Z',
        agentId: 'ai_agent_2',
        agentName: 'RUSH AI Agent',
        responseTime: '0.2s',
        messages: [
          {
            id: 'msg_4',
            sender: 'user',
            content: 'I\'m trying to purchase SOL tokens but my credit card keeps getting declined. Is there an issue with the payment system?',
            timestamp: '2024-01-15T14:22:00Z'
          },
          {
            id: 'msg_5',
            sender: 'ai',
            content: 'I can help you with the payment issue. Let me check your account and the payment system status. I can see that your card was declined due to insufficient funds. Would you like me to suggest alternative payment methods?',
            timestamp: '2024-01-15T14:22:10Z',
            isAI: true
          }
        ]
      },
      {
        id: 'TICKET-003',
        userId: 'user_456',
        userName: 'Emma Wilson',
        userAvatar: '/placeholder.svg',
        subject: 'Wallet connection issues',
        description: 'My Phantom wallet won\'t connect to the RUSH platform. I keep getting an error message.',
        category: 'technical',
        priority: 'high',
        status: 'open',
        createdAt: '2024-01-15T16:45:00Z',
        updatedAt: '2024-01-15T16:45:00Z',
        responseTime: '0.1s',
        messages: [
          {
            id: 'msg_6',
            sender: 'user',
            content: 'My Phantom wallet won\'t connect to the RUSH platform. I keep getting an error message.',
            timestamp: '2024-01-15T16:45:00Z'
          }
        ]
      },
      {
        id: 'TICKET-004',
        userId: 'user_999',
        userName: 'Alex Kim',
        userAvatar: '/placeholder.svg',
        subject: 'How to stake my NFTs?',
        description: 'I want to stake my Coral Rush NFTs to earn rewards. Can you guide me through the process?',
        category: 'general',
        priority: 'low',
        status: 'resolved',
        createdAt: '2024-01-15T18:10:00Z',
        updatedAt: '2024-01-15T18:12:00Z',
        resolvedAt: '2024-01-15T18:12:00Z',
        agentId: 'ai_agent_3',
        agentName: 'RUSH AI Agent',
        responseTime: '0.4s',
        satisfaction: 5,
        messages: [
          {
            id: 'msg_7',
            sender: 'user',
            content: 'I want to stake my Coral Rush NFTs to earn rewards. Can you guide me through the process?',
            timestamp: '2024-01-15T18:10:00Z'
          },
          {
            id: 'msg_8',
            sender: 'ai',
            content: 'Great question! I\'ll walk you through the NFT staking process. First, go to the Staking section in your dashboard, then select the NFTs you want to stake. The current APY is 12% for Coral Rush NFTs.',
            timestamp: '2024-01-15T18:10:15Z',
            isAI: true
          },
          {
            id: 'msg_9',
            sender: 'ai',
            content: 'I\'ve prepared a step-by-step guide for you. You can access it at rush.app/staking-guide. The process takes about 2 minutes and you\'ll start earning rewards immediately!',
            timestamp: '2024-01-15T18:12:00Z',
            isAI: true
          }
        ]
      }
    ];

    setTickets(mockTickets);
    
    // Calculate stats
    const openCount = mockTickets.filter(ticket => ticket.status === 'open' || ticket.status === 'in_progress').length;
    const aiResolved = mockTickets.filter(ticket => ticket.status === 'resolved' && ticket.agentName?.includes('AI')).length;
    const humanResolved = mockTickets.filter(ticket => ticket.status === 'resolved' && !ticket.agentName?.includes('AI')).length;
    
    setStats({
      totalTickets: mockTickets.length,
      openTickets: openCount,
      avgResponseTime: '0.3s',
      satisfaction: 98.7,
      aiResolved,
      humanResolved
    });
  }, []);

  const handleSubmitTicket = async () => {
    if (!newTicket.subject || !newTicket.description) return;
    
    setIsSubmitting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const ticket: SupportTicket = {
      id: `TICKET-${String(tickets.length + 1).padStart(3, '0')}`,
      userId: 'current_user',
      userName: 'Current User',
      userAvatar: '/placeholder.svg',
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseTime: '0.1s',
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'user',
          content: newTicket.description,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ subject: '', description: '', category: 'general', priority: 'medium' });
    setIsSubmitting(false);
  };

  const handleSendMessage = async (ticketId: string) => {
    if (!newMessage.trim()) return;
    
    const message: SupportMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, messages: [...ticket.messages, message], updatedAt: new Date().toISOString() }
        : ticket
    ));
    
    setNewMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: SupportMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: 'ai',
        content: 'Thank you for your message. I\'m processing your request and will get back to you shortly with a solution.',
        timestamp: new Date().toISOString(),
        isAI: true
      };
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, messages: [...ticket.messages, aiResponse], updatedAt: new Date().toISOString() }
          : ticket
      ));
    }, 2000);
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'open': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: SupportTicket['category']) => {
    switch (category) {
      case 'technical': return <AlertCircle className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'nft': return <FileText className="h-4 w-4" />;
      case 'general': return <MessageSquare className="h-4 w-4" />;
      case 'refund': return <Wallet className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="container-responsive section-responsive">
      <div className="mb-8">
        <h1 className="heading-responsive font-bold mb-2">🌊 Coral Protocol Customer Support Center</h1>
        <p className="text-responsive text-muted-foreground">
          AI-powered customer support with instant response times
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid-responsive mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Lightning fast
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.satisfaction}%</div>
            <p className="text-xs text-muted-foreground">
              Customer rating
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="new">New Ticket</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card 
                key={ticket.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={ticket.userAvatar} />
                        <AvatarFallback>{ticket.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{ticket.subject}</h3>
                          <Badge className={cn("text-white", getStatusColor(ticket.status))}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={cn("text-white", getPriorityColor(ticket.priority))}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(ticket.category)}
                            <span className="capitalize">{ticket.category}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{ticket.userName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{ticket.responseTime}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        {ticket.satisfaction && (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">Rating:</span>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-4 w-4",
                                    i < ticket.satisfaction! ? "text-yellow-400 fill-current" : "text-gray-300"
                                  )} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {ticket.status === 'open' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Headphones className="h-4 w-4 mr-1" />
                          Assign Agent
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        View Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and our AI agents will help you resolve it instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="payment">Payment Problem</SelectItem>
                      <SelectItem value="nft">NFT Related</SelectItem>
                      <SelectItem value="refund">Refund Request</SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleSubmitTicket}
                disabled={isSubmitting || !newTicket.subject || !newTicket.description}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating Ticket...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription>
                      Chat with {selectedTicket.agentName || 'RUSH AI Agent'}
                    </CardDescription>
                  </div>
                  <Badge className={cn("text-white", getStatusColor(selectedTicket.status))}>
                    {selectedTicket.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.sender === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                          message.sender === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {message.isAI && (
                          <div className="flex items-center space-x-1 mb-1">
                            <Bot className="h-3 w-3" />
                            <span className="text-xs font-medium">AI Agent</span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedTicket.id)}
                  />
                  <Button onClick={() => handleSendMessage(selectedTicket.id)}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a ticket to start chatting</h3>
                <p className="text-muted-foreground">
                  Choose a support ticket from the list above to view the conversation.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerSupport;
