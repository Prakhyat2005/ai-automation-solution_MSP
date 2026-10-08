import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  MessageSquare, 
  Send, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Users,
  Bot,
  FileText,
  Settings,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Filter,
  Search,
  Bell,
  Star,
  MessageCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { api } from '../services/api';
import ClientCommunicationService, { 
  CommunicationMessage, 
  TransparencyReport, 
  ClientPortalConfig,
  FeedbackSurvey,
  MessageType,
  MessagePriority,
  CommunicationChannel
} from '../services/clientCommunication';

interface Message {
  id: string;
  client: string;
  subject: string;
  preview: string;
  time: string;
  status: 'unread' | 'read' | 'replied';
  priority: 'high' | 'medium' | 'low';
  channel: 'email' | 'chat' | 'phone';
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface EnhancedMessage extends Message {
  aiSuggestions?: string[];
  translationRequired?: boolean;
  urgencyScore?: number;
  relatedTickets?: string[];
  clientFeedback?: {
    rating: number;
    comment?: string;
  };
}

interface CommunicationStats {
  totalMessages: number;
  responseRate: number;
  avgResponseTime: string;
  satisfaction: number;
  automationRate: number;
  channelDistribution: Record<string, number>;
  sentimentAnalysis: Record<string, number>;
}

interface TransparencyMetrics {
  uptime: number;
  incidentCount: number;
  avgResolutionTime: number;
  slaCompliance: number;
  proactiveAlerts: number;
}

export function ClientCommunication() {
  const [selectedMessage, setSelectedMessage] = useState<EnhancedMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [communicationService] = useState(() => new ClientCommunicationService());
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [transparencyMetrics, setTransparencyMetrics] = useState<TransparencyMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('messages');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent' | 'automated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lexLoading, setLexLoading] = useState(false);
  const [lexResult, setLexResult] = useState<any>(null);

  // Enhanced message data with AI features
  const enhancedMessages: EnhancedMessage[] = [
    {
      id: 'MSG-001',
      client: 'TechCorp Inc',
      subject: 'Server upgrade consultation needed',
      preview: 'We are planning to upgrade our infrastructure and would like to schedule a meeting...',
      time: '5 minutes ago',
      status: 'unread',
      priority: 'high',
      channel: 'email',
      sentiment: 'neutral',
      aiSuggestions: [
        'Schedule a technical consultation call',
        'Provide infrastructure assessment report',
        'Offer migration timeline options'
      ],
      urgencyScore: 75,
      relatedTickets: ['TKT-2024-001', 'TKT-2024-003']
    },
    {
      id: 'MSG-002',
      client: 'RetailCo',
      subject: 'Thank you for quick resolution',
      preview: 'Your team did an excellent job resolving our network issue yesterday...',
      time: '1 hour ago',
      status: 'read',
      priority: 'low',
      channel: 'email',
      sentiment: 'positive',
      clientFeedback: {
        rating: 5,
        comment: 'Excellent service and communication'
      },
      urgencyScore: 20
    },
    {
      id: 'MSG-003',
      client: 'FinServe Ltd',
      subject: 'Urgent: Database performance issues',
      preview: 'We are experiencing slow query times and need immediate assistance...',
      time: '2 hours ago',
      status: 'replied',
      priority: 'high',
      channel: 'chat',
      sentiment: 'negative',
      aiSuggestions: [
        'Escalate to database specialist',
        'Provide performance optimization recommendations',
        'Schedule emergency maintenance window'
      ],
      urgencyScore: 95,
      translationRequired: false
    }
  ];

  const communicationStats: CommunicationStats = {
    totalMessages: 247,
    responseRate: 94,
    avgResponseTime: '12m',
    satisfaction: 4.8,
    automationRate: 68,
    channelDistribution: {
      email: 145,
      chat: 67,
      phone: 25,
      portal: 10
    },
    sentimentAnalysis: {
      positive: 156,
      neutral: 67,
      negative: 24
    }
  };

  const transparencyData: TransparencyMetrics = {
    uptime: 99.9,
    incidentCount: 3,
    avgResolutionTime: 45,
    slaCompliance: 98.5,
    proactiveAlerts: 12
  };

  useEffect(() => {
    setMessages(enhancedMessages);
    setStats(communicationStats);
    setTransparencyMetrics(transparencyData);
  }, []);

  useEffect(() => {
    // Clear previous Lex result when changing selection
    setLexResult(null);
  }, [selectedMessage]);

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filterType === 'all' || 
      (filterType === 'unread' && message.status === 'unread') ||
      (filterType === 'urgent' && message.priority === 'high') ||
      (filterType === 'automated' && message.aiSuggestions);
    
    const matchesSearch = searchQuery === '' || 
      message.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAIGenerate = async () => {
    if (!selectedMessage) return;
    
    setIsLoading(true);
    try {
      const text = `${selectedMessage.subject} ${selectedMessage.preview}`.trim();
      const sentimentRes = await api.analyzeSentiment(text);
      const replyRes = await api.assistantRespond(text, sentimentRes?.Sentiment);
      // Update reply text with AI response
      setReplyText(replyRes?.response || '');
      // Optionally update sentiment shown for selected message
      const mapped = (sentimentRes?.Sentiment || 'NEUTRAL').toLowerCase();
      const uiSentiment = mapped === 'positive' ? 'positive' : mapped === 'negative' ? 'negative' : 'neutral';
      setSelectedMessage(prev => prev ? { ...prev, sentiment: uiSentiment as any } : prev);
    } catch (err) {
      console.error('AI generate failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLexDetectIntent = async () => {
    if (!selectedMessage) return;
    setLexLoading(true);
    try {
      const text = `${selectedMessage.subject} ${selectedMessage.preview}`.trim();
      const res = await api.lexRecognizeText(text);
      setLexResult(res);
    } catch (err) {
      console.error('Lex detect failed:', err);
      setLexResult({ intent: 'Error', message: 'Could not detect intent', slots: {} });
    } finally {
      setLexLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    // Simulate sending message
    console.log('Sending message:', replyText);
    setReplyText('');
    setSelectedMessage(null);
  };

  const generateTransparencyReport = async () => {
    setIsLoading(true);
    // Simulate report generation
    setTimeout(() => {
      console.log('Generating transparency report...');
      setIsLoading(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return '';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'neutral': return 'text-gray-600';
      case 'negative': return 'text-red-600';
      default: return '';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return null;
    }
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Communication Hub</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered communication management and transparency platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={generateTransparencyReport} disabled={isLoading}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-2xl font-bold">{stats?.totalMessages || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-2xl font-bold">{stats?.responseRate || 0}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
              <p className="text-2xl font-bold">{stats?.avgResponseTime || '0m'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
              <p className="text-2xl font-bold">{stats?.satisfaction || 0}/5</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Automation</p>
              <p className="text-2xl font-bold">{stats?.automationRate || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="transparency">Transparency</TabsTrigger>
          <TabsTrigger value="portal">Client Portal</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Messages List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search and Filter */}
              <Card className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="automated">AI Assisted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  {filteredMessages.map((message) => (
                    <Card
                      key={message.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                        message.status === 'unread' ? 'border-l-4 border-l-blue-600' : ''
                      } ${selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm">
                            {message.client.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium">{message.client}</h4>
                              {message.status === 'unread' && (
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                              )}
                              {message.aiSuggestions && (
                                <Badge variant="outline" className="text-xs">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium">{message.subject}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{message.preview}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getChannelIcon(message.channel)}
                            <span>{message.channel}</span>
                          </div>
                          <div className={`flex items-center gap-1 text-xs ${getSentimentColor(message.sentiment)}`}>
                            <span>Sentiment: {message.sentiment}</span>
                          </div>
                          {message.urgencyScore && (
                            <div className={`flex items-center gap-1 text-xs ${getUrgencyColor(message.urgencyScore)}`}>
                              <AlertTriangle className="h-3 w-3" />
                              <span>{message.urgencyScore}%</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {message.clientFeedback && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              {message.clientFeedback.rating}
                            </Badge>
                          )}
                          {message.status === 'replied' && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Replied
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Enhanced Reply Section */}
              {selectedMessage && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Reply to {selectedMessage.client}</h3>
                      <p className="text-sm text-muted-foreground">Re: {selectedMessage.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAIGenerate}
                        disabled={isLoading}
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        {isLoading ? 'Generating...' : 'AI Generate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLexDetectIntent}
                        disabled={lexLoading}
                        className="gap-2"
                      >
                        <Bot className="h-4 w-4" />
                        {lexLoading ? 'Detecting...' : 'Detect Intent'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4 mr-2" />
                        Translate
                      </Button>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  {selectedMessage.aiSuggestions && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        AI Suggestions
                      </h4>
                      <div className="space-y-1">
                        {selectedMessage.aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {lexResult && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        Detected Intent
                      </h4>
                      <div className="text-xs text-muted-foreground mb-2">
                        {(lexResult.intentName || lexResult.intent || 'Unknown')}
                      </div>
                      {lexResult.message && (
                        <div className="text-xs text-muted-foreground mb-2">{lexResult.message}</div>
                      )}
                      {lexResult.slots && Object.keys(lexResult.slots).length > 0 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {Object.entries(lexResult.slots).map(([name, value]) => (
                            <div key={name}>• {name}: {String(value || '')}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-32 mb-4"
                  />

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                      <Button variant="outline" size="sm">Save Draft</Button>
                    </div>
                    <Button onClick={handleSendMessage} className="gap-2">
                      <Send className="h-4 w-4" />
                      Send Reply
                    </Button>
                  </div>
                </Card>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-4">
              {/* AI Assistant */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Bot className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs text-muted-foreground">Smart communication tools</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Smart Routing</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      3 messages automatically routed to specialists
                    </p>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Response Optimization</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      AI detected urgent tone in 2 messages
                    </p>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Sentiment Analysis</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      1 negative sentiment detected - escalation recommended
                    </p>
                  </div>
                </div>
              </Card>

              {/* Communication Insights */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Communication Insights</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">This Week</span>
                      <span className="font-medium">247 messages</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Automated</span>
                      <span className="text-green-600 font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Avg Rating</span>
                      <span className="text-yellow-600 font-medium">★ 4.8</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Bulk Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Rules
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Transparency Tab */}
        <TabsContent value="transparency" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transparency Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Service Transparency
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">System Uptime</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">{transparencyMetrics?.uptime}%</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <Progress value={transparencyMetrics?.uptime || 0} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">SLA Compliance</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-green-600">{transparencyMetrics?.slaCompliance}%</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <Progress value={transparencyMetrics?.slaCompliance || 0} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Resolution Time</span>
                  <span className="font-semibold">{transparencyMetrics?.avgResolutionTime}m</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Incidents</span>
                  <span className="font-semibold text-orange-600">{transparencyMetrics?.incidentCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Proactive Alerts</span>
                  <span className="font-semibold text-blue-600">{transparencyMetrics?.proactiveAlerts}</span>
                </div>
              </div>
            </Card>

            {/* Recent Reports */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Transparency Reports
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Monthly Service Report</h4>
                    <p className="text-xs text-muted-foreground">Generated 2 days ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Incident Summary</h4>
                    <p className="text-xs text-muted-foreground">Generated 1 week ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">SLA Performance</h4>
                    <p className="text-xs text-muted-foreground">Generated 2 weeks ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-4" onClick={generateTransparencyReport} disabled={isLoading}>
                <FileText className="h-4 w-4 mr-2" />
                {isLoading ? 'Generating...' : 'Generate New Report'}
              </Button>
            </Card>
          </div>

          {/* Real-time Updates */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Real-time Service Updates
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">All Systems Operational</h4>
                  <p className="text-xs text-muted-foreground">Last updated: 2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Scheduled Maintenance</h4>
                  <p className="text-xs text-muted-foreground">Database optimization - Tomorrow 2:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Performance Monitoring</h4>
                  <p className="text-xs text-muted-foreground">Increased response times detected - investigating</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Client Portal Tab */}
        <TabsContent value="portal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Portal Configuration
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Client Portal Access</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Custom Branding</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Real-time Updates</span>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mobile Responsive</span>
                  <Badge variant="outline">Yes</Badge>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Portal
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Portal Analytics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily Active Users</span>
                  <span className="font-semibold">127</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Session Duration</span>
                  <span className="font-semibold">8m 32s</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Most Viewed Section</span>
                  <span className="font-semibold">Service Status</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Support Tickets Created</span>
                  <span className="font-semibold">23</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Channel Performance</h3>
              
              <div className="space-y-3">
                {stats && Object.entries(stats.channelDistribution).map(([channel, count]) => (
                  <div key={channel} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(channel)}
                      <span className="text-sm capitalize">{channel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / stats.totalMessages) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
              
              <div className="space-y-3">
                {stats && Object.entries(stats.sentimentAnalysis).map(([sentiment, count]) => (
                  <div key={sentiment} className="flex items-center justify-between">
                    <span className={`text-sm capitalize ${getSentimentColor(sentiment)}`}>
                      {sentiment}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            sentiment === 'positive' ? 'bg-green-600' :
                            sentiment === 'negative' ? 'bg-red-600' : 'bg-gray-600'
                          }`}
                          style={{ width: `${(count / stats.totalMessages) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automation Rules
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Critical Incident Auto-Response</h4>
                    <p className="text-xs text-muted-foreground">Triggers on high priority incidents</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Resolution Follow-up</h4>
                    <p className="text-xs text-muted-foreground">Sends satisfaction survey after resolution</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">Maintenance Notifications</h4>
                    <p className="text-xs text-muted-foreground">Proactive maintenance alerts</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Manage Rules
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Automation Performance</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Messages Automated</span>
                  <span className="font-semibold text-green-600">68%</span>
                </div>
                <Progress value={68} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time Saved</span>
                  <span className="font-semibold">4.2 hours/day</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <Progress value={94} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cost Savings</span>
                  <span className="font-semibold">$1,200/month</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
