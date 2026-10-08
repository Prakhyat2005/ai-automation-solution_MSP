import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Brain, 
  Zap, 
  Clock, 
  Target,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Bot,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  suggestedResolution?: string;
  estimatedTime: number;
  tags: string[];
  createdAt: Date;
  aiClassified: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  complexity: 'simple' | 'moderate' | 'complex';
  autoResolvable: boolean;
}

interface ClassificationResult {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  reasoning: string;
  suggestedActions: string[];
  estimatedResolutionTime: number;
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  complexity: 'simple' | 'moderate' | 'complex';
  autoResolvable: boolean;
}

interface TicketClassificationProps {
  className?: string;
}

export function TicketClassification({ className }: TicketClassificationProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [stats, setStats] = useState({
    totalTickets: 0,
    autoResolved: 0,
    avgConfidence: 0,
    avgResolutionTime: 0
  });

  // Mock AI classification service
  const classifyTicket = async (title: string, description: string): Promise<ClassificationResult> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const text = `${title} ${description}`.toLowerCase();
    
    // Simple keyword-based classification (in real implementation, this would be ML-based)
    let category = 'General';
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let confidence = 75;
    let estimatedResolutionTime = 60;
    let tags: string[] = [];
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let complexity: 'simple' | 'moderate' | 'complex' = 'moderate';
    let autoResolvable = false;

    // Category classification
    if (text.includes('password') || text.includes('login') || text.includes('access')) {
      category = 'Authentication';
      priority = 'high';
      confidence = 90;
      estimatedResolutionTime = 30;
      tags = ['security', 'access'];
      autoResolvable = true;
    } else if (text.includes('network') || text.includes('internet') || text.includes('connection')) {
      category = 'Network';
      priority = 'high';
      confidence = 85;
      estimatedResolutionTime = 45;
      tags = ['network', 'connectivity'];
    } else if (text.includes('email') || text.includes('outlook') || text.includes('mail')) {
      category = 'Email';
      priority = 'medium';
      confidence = 80;
      estimatedResolutionTime = 40;
      tags = ['email', 'communication'];
    } else if (text.includes('software') || text.includes('application') || text.includes('program')) {
      category = 'Software';
      priority = 'medium';
      confidence = 75;
      estimatedResolutionTime = 90;
      tags = ['software', 'application'];
    } else if (text.includes('hardware') || text.includes('computer') || text.includes('laptop')) {
      category = 'Hardware';
      priority = 'high';
      confidence = 85;
      estimatedResolutionTime = 120;
      tags = ['hardware', 'device'];
    }

    // Priority adjustment based on urgency keywords
    if (text.includes('urgent') || text.includes('critical') || text.includes('emergency')) {
      priority = 'critical';
      confidence += 10;
      estimatedResolutionTime = Math.max(15, estimatedResolutionTime / 2);
    } else if (text.includes('asap') || text.includes('immediately') || text.includes('now')) {
      priority = 'high';
      confidence += 5;
    }

    // Sentiment analysis
    if (text.includes('angry') || text.includes('frustrated') || text.includes('terrible')) {
      sentiment = 'negative';
      if (priority === 'low') priority = 'medium';
    } else if (text.includes('please') || text.includes('thank') || text.includes('appreciate')) {
      sentiment = 'positive';
    }

    // Complexity assessment
    if (text.length > 500 || text.includes('multiple') || text.includes('complex')) {
      complexity = 'complex';
      estimatedResolutionTime *= 1.5;
    } else if (text.length < 100 && autoResolvable) {
      complexity = 'simple';
      estimatedResolutionTime *= 0.7;
    }

    const reasoning = `Classified as ${category} based on keyword analysis. Priority set to ${priority} due to content urgency indicators. Confidence: ${confidence}%`;
    
    const suggestedActions = [
      `Assign to ${category} specialist team`,
      `Set priority to ${priority}`,
      `Estimated resolution time: ${Math.round(estimatedResolutionTime)} minutes`
    ];

    if (autoResolvable) {
      suggestedActions.push('Consider auto-resolution workflow');
    }

    return {
      category,
      priority,
      confidence,
      reasoning,
      suggestedActions,
      estimatedResolutionTime: Math.round(estimatedResolutionTime),
      tags,
      sentiment,
      complexity,
      autoResolvable
    };
  };

  const handleSubmitTicket = async () => {
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) return;

    setIsClassifying(true);
    
    try {
      const classification = await classifyTicket(newTicketTitle, newTicketDescription);
      
      const newTicket: Ticket = {
        id: `ticket-${Date.now()}`,
        title: newTicketTitle,
        description: newTicketDescription,
        category: classification.category,
        priority: classification.priority,
        confidence: classification.confidence,
        suggestedResolution: classification.suggestedActions.join('; '),
        estimatedTime: classification.estimatedResolutionTime,
        tags: classification.tags,
        createdAt: new Date(),
        aiClassified: true,
        sentiment: classification.sentiment,
        complexity: classification.complexity,
        autoResolvable: classification.autoResolvable
      };

      setTickets(prev => [newTicket, ...prev]);
      setNewTicketTitle('');
      setNewTicketDescription('');
      
      // Update stats
      updateStats([newTicket, ...tickets]);
    } catch (error) {
      console.error('Classification failed:', error);
    } finally {
      setIsClassifying(false);
    }
  };

  const updateStats = (ticketList: Ticket[]) => {
    const totalTickets = ticketList.length;
    const autoResolved = ticketList.filter(t => t.autoResolvable).length;
    const avgConfidence = totalTickets > 0 
      ? ticketList.reduce((sum, t) => sum + t.confidence, 0) / totalTickets 
      : 0;
    const avgResolutionTime = totalTickets > 0
      ? ticketList.reduce((sum, t) => sum + t.estimatedTime, 0) / totalTickets
      : 0;

    setStats({
      totalTickets,
      autoResolved,
      avgConfidence: Math.round(avgConfidence),
      avgResolutionTime: Math.round(avgResolutionTime)
    });
  };

  useEffect(() => {
    updateStats(tickets);
  }, [tickets]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <ThumbsDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-600';
      case 'complex': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const categories = ['all', ...Array.from(new Set(tickets.map(t => t.category)))];
  const priorities = ['all', 'critical', 'high', 'medium', 'low'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Ticket Classification</h2>
          <p className="text-gray-600">Intelligent ticket categorization and auto-resolution</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Bot className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalTickets}</div>
              <div className="text-sm text-gray-600">Total Tickets</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.autoResolved}</div>
              <div className="text-sm text-gray-600">Auto-Resolvable</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgConfidence}%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgResolutionTime}m</div>
              <div className="text-sm text-gray-600">Avg Resolution</div>
            </div>
          </div>
        </Card>
      </div>

      {/* New Ticket Form */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Create New Ticket</h3>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Ticket title..."
            value={newTicketTitle}
            onChange={(e) => setNewTicketTitle(e.target.value)}
            className="w-full"
          />
          <Textarea
            placeholder="Describe the issue in detail..."
            value={newTicketDescription}
            onChange={(e) => setNewTicketDescription(e.target.value)}
            className="w-full min-h-[100px]"
          />
          <Button
            onClick={handleSubmitTicket}
            disabled={!newTicketTitle.trim() || !newTicketDescription.trim() || isClassifying}
            className="w-full"
          >
            {isClassifying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                AI Classifying...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Submit & Classify with AI
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                  {ticket.aiClassified && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      AI Classified
                    </Badge>
                  )}
                  {ticket.autoResolvable && (
                    <Badge className="bg-green-100 text-green-800">
                      <Zap className="h-3 w-3 mr-1" />
                      Auto-Resolvable
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{ticket.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{ticket.category}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getSentimentIcon(ticket.sentiment)}
                    {ticket.sentiment}
                  </Badge>
                  <Badge variant="outline" className={getComplexityColor(ticket.complexity)}>
                    {ticket.complexity}
                  </Badge>
                  {ticket.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {ticket.suggestedResolution && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">AI Suggestions</span>
                    </div>
                    <p className="text-sm text-blue-800">{ticket.suggestedResolution}</p>
                  </div>
                )}
              </div>

              <div className="text-right ml-4">
                <div className="text-sm text-gray-500 mb-1">
                  Confidence: {ticket.confidence}%
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  Est. Time: {ticket.estimatedTime}m
                </div>
                <div className="text-xs text-gray-400">
                  {ticket.createdAt.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Created {ticket.createdAt.toLocaleDateString()}</span>
              </div>
              <Button variant="outline" size="sm">
                View Details
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>
        ))}

        {filteredTickets.length === 0 && (
          <Card className="p-12 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">
              {tickets.length === 0 
                ? "Create your first ticket to see AI classification in action"
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}