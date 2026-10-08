import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useAsync } from '../hooks/useAsync';
import { LoadingSpinner, Skeleton } from './LoadingSpinner';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  User, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Bot,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { TicketModal } from './TicketModal';
import { api } from '../services/api';

interface Ticket {
  id: string;
  title: string;
  client: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  assignee: string;
  created: string;
  aiSuggestion?: string;
  automationPotential: number;
  estimatedTime: string;
}

export function TicketManagement() {
  const { state, actions } = useApp();
  const { tickets: apiTickets, loading, error } = state;
  const { ticketUpdates, sendNotification, sendTicketUpdate } = useWebSocket();
  const { user } = useAuth();
  const { handleError } = useErrorHandler();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [modalTicket, setModalTicket] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [resolvingAll, setResolvingAll] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  // AI Insights state
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any | null>(null);

  // Handle real-time ticket updates
  useEffect(() => {
    if (ticketUpdates.length > 0) {
      const latestUpdate = ticketUpdates[0];
      sendNotification({
        title: 'Ticket Updated',
        message: `Ticket ${latestUpdate.ticketId} status changed to ${latestUpdate.status}`,
        type: 'info',
        read: false
      });
    }
  }, [ticketUpdates, sendNotification]);

  // Check if tickets are still loading
  const isLoading = loading.tickets;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        
        {/* Search and filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        {/* Tickets list skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Error loading tickets</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => actions.loadTickets()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform API tickets to match component interface
  const tickets = apiTickets.map(ticket => ({
    id: ticket.id,
    title: ticket.title,
    client: ticket.client,
    priority: ticket.priority as 'critical' | 'high' | 'medium' | 'low',
    status: ticket.status as 'open' | 'in-progress' | 'resolved' | 'closed',
    category: ticket.category,
    assignee: ticket.assignee,
    created: new Date(ticket.createdAt).toLocaleString(),
    aiSuggestion: 'AI analysis available - click for details',
    automationPotential: Math.floor(Math.random() * 40) + 60, // 60-100%
    estimatedTime: ticket.estimatedHours ? `${ticket.estimatedHours}h` : '2h'
  }));

  // Filter tickets based on active tab and search query
  const filteredTickets = tickets.filter(ticket => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by active tab
    switch (activeTab) {
      case 'open':
        return matchesSearch && ticket.status === 'open';
      case 'automated':
        return matchesSearch && ticket.assignee === 'AI AutoPilot';
      case 'high-priority':
        return matchesSearch && (ticket.priority === 'high' || ticket.priority === 'critical');
      default:
        return matchesSearch;
    }
  });

  const stats = [
    { label: 'Open Tickets', value: tickets.filter(t => t.status === 'open').length, color: 'blue' },
    { label: 'In Progress', value: tickets.filter(t => t.status === 'in-progress').length, color: 'yellow' },
    { label: 'Resolved Today', value: tickets.filter(t => t.status === 'resolved').length, color: 'green' },
    { label: 'AI Automated', value: '87%', color: 'purple' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-400';
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'closed': return 'bg-gray-200 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAutoResolve = async (ticket: Ticket) => {
    try {
      await actions.updateTicket(ticket.id, {
        status: 'resolved',
        assignee: 'AI AutoPilot'
      });
      // Broadcast ticket update for real-time UI feedback
      sendTicketUpdate({
        ticketId: ticket.id,
        status: 'resolved',
        priority: ticket.priority,
        assignedTo: 'AI AutoPilot',
        updatedBy: 'AI AutoPilot'
      });
      sendNotification({
        title: 'Ticket Auto-Resolved',
        message: `Ticket "${ticket.title}" resolved by AI AutoPilot`,
        type: 'success',
        read: false
      });
    } catch (err) {
      console.error('Auto-resolve failed:', err);
      sendNotification({
        title: 'Auto-Resolve Failed',
        message: `Could not resolve "${ticket.title}" automatically`,
        type: 'error',
        read: false
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const openModal = (mode: 'create' | 'edit' | 'view', ticket?: any) => {
    setModalMode(mode);
    setModalTicket(ticket || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTicket(null);
  };

  const performBulkUpdate = async (updates: Partial<Ticket>, updatedBy: string) => {
    if (selectedTickets.length === 0 || bulkActionLoading) return;
    setBulkActionLoading(true);
    try {
      await Promise.all(
        selectedTickets.map(async (id) => {
          await actions.updateTicket(id, updates);
          const current = tickets.find(t => t.id === id);
          const nextStatus = (updates.status ?? current?.status ?? 'open') as Ticket['status'];
          const nextAssignee = updates.assignee ?? current?.assignee ?? 'Unassigned';
          const nextPriority = (current?.priority ?? 'medium') as Ticket['priority'];
          sendTicketUpdate({
            ticketId: id,
            status: nextStatus,
            priority: nextPriority,
            assignedTo: nextAssignee,
            updatedBy,
          });
        })
      );
      sendNotification({
        title: 'Bulk Action Completed',
        message: `${selectedTickets.length} ticket(s) updated`,
        type: 'success',
        read: false,
      });
      setSelectedTickets([]);
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      handleError(errorObj, { toastTitle: 'Bulk action failed', showToast: true });
      sendNotification({
        title: 'Bulk Action Failed',
        message: 'Some tickets could not be updated',
        type: 'error',
        read: false,
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleResolveAllClick = async () => {
    if (resolvingAll) return;
    setResolvingAll(true);
    try {
      // Prefer high-confidence tickets, otherwise fall back to top 3 by score
      let candidates = tickets
        .filter(t => t.status !== 'resolved' && t.automationPotential >= 95)
        .slice(0, 3);

      if (candidates.length === 0) {
        candidates = tickets
          .filter(t => t.status !== 'resolved')
          .sort((a, b) => b.automationPotential - a.automationPotential)
          .slice(0, 3);
      }

      await Promise.all(
        candidates.map(async (t) => {
          await actions.updateTicket(t.id, { status: 'resolved', assignee: 'AI AutoPilot' });
          sendTicketUpdate({
            ticketId: t.id,
            status: 'resolved',
            priority: t.priority,
            assignedTo: 'AI AutoPilot',
            updatedBy: 'AI AutoPilot'
          });
        })
      );

      sendNotification({
        title: 'Auto-Resolve Completed',
        message: `${candidates.length} ticket(s) resolved automatically`,
        type: 'success',
        read: false
      });
    } catch (err) {
      console.error('Failed to auto-resolve tickets:', err);
      sendNotification({
        title: 'Auto-Resolve Failed',
        message: 'Could not complete auto-resolve. Please try again.',
        type: 'error',
        read: false
      });
    } finally {
      setResolvingAll(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Smart Ticket Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">AI-powered ticket routing and resolution</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedTickets.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedTickets.length} selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={bulkActionLoading}>
                    {bulkActionLoading ? 'Working…' : 'Bulk Actions'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    Apply to {selectedTickets.length} selected
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => performBulkUpdate(
                      { status: 'in-progress' },
                      user?.name || 'Bulk Action'
                    )}
                  >
                    Set status to In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => performBulkUpdate(
                      { status: 'resolved' },
                      user?.name || 'Bulk Action'
                    )}
                  >
                    Mark as Resolved
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => performBulkUpdate(
                      { status: 'closed' },
                      user?.name || 'Bulk Action'
                    )}
                  >
                    Close Tickets
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => performBulkUpdate(
                      { assignee: user?.name ?? 'Unassigned' },
                      user?.name || 'Bulk Action'
                    )}
                  >
                    Assign to Me
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => performBulkUpdate(
                      { assignee: 'AI AutoPilot' },
                      'AI AutoPilot'
                    )}
                  >
                    Assign to AI AutoPilot
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setSelectedTickets([])}
                  >
                    Clear Selection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button 
            onClick={() => openModal('create')}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => {
              setAiInsightsOpen((prev) => !prev);
              if (!aiInsightsOpen) {
                setAiInsightsLoading(true);
                api.getAnalytics()
                  .then((data) => setAnalytics(data))
                  .finally(() => setAiInsightsLoading(false));
              }
            }}
          >
            <Sparkles className="h-4 w-4" />
            AI Insights
          </Button>
        </div>
      </Card>

      {aiInsightsOpen && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">AI Insights Overview</p>
            {aiInsightsLoading && <span className="text-xs text-gray-500">Loading…</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Avg Response Time</p>
              <p className="text-lg font-semibold">
                {analytics?.responseTime ? `${Math.round(analytics.responseTime.reduce((sum: number, rt: any) => sum + (rt.avgTime ?? 0), 0) / analytics.responseTime.length)}h` : '—'}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Top Satisfaction</p>
              <p className="text-lg font-semibold">
                {analytics?.clientSatisfaction ? `${[...analytics.clientSatisfaction].sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0))[0]?.client}` : '—'}
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">Open Tickets</p>
              <p className="text-lg font-semibold">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-xs text-muted-foreground">High/Critical</p>
              <p className="text-lg font-semibold">{tickets.filter(t => t.priority === 'high' || t.priority === 'critical').length}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tickets List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-full grid-cols-4 max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="automated">AI Auto</TabsTrigger>
                <TabsTrigger value="high-priority">High</TabsTrigger>
              </TabsList>
              {filteredTickets.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectedTickets.length === filteredTickets.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="select-all" className="text-sm text-gray-600 dark:text-gray-400">
                    Select All
                  </label>
                </div>
              )}
            </div>
            
            <TabsContent value="all" className="space-y-3 mt-4">
              {filteredTickets.map((ticket) => (
                <Card 
                  key={ticket.id}
                  className="p-3 sm:p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTicketSelect(ticket.id);
                      }}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="flex items-start justify-between mb-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{ticket.id}</span>
                          <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </Badge>
                          {ticket.assignee === 'AI AutoPilot' && (
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs">
                              <Bot className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">{ticket.title}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{ticket.client}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.created}
                          </span>
                          <span>{ticket.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openModal('view', ticket)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openModal('edit', ticket)}
                          title="Edit Ticket"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {ticket.aiSuggestion && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{ticket.aiSuggestion}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {ticket.automationPotential}% automation
                              </span>
                              <span>Est. {ticket.estimatedTime}</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="h-7 text-xs self-start sm:self-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoResolve(ticket);
                              }}
                            >
                              Auto-Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="open" className="space-y-3 mt-4">
              {filteredTickets.map((ticket) => (
                <Card 
                  key={ticket.id}
                  className="p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openModal('view', ticket)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTicketSelect(ticket.id);
                      }}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                            {ticket.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge 
                              variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.created}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.assignee}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('view', ticket);
                          }}
                          title="View Ticket"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('edit', ticket);
                          }}
                          title="Edit Ticket"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {ticket.aiSuggestion && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{ticket.aiSuggestion}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {ticket.automationPotential}% automation
                              </span>
                              <span>Est. {ticket.estimatedTime}</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="h-7 text-xs self-start sm:self-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoResolve(ticket);
                              }}
                            >
                              Auto-Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="automated" className="space-y-3 mt-4">
              {filteredTickets.map((ticket) => (
                <Card 
                  key={ticket.id}
                  className="p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openModal('view', ticket)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTicketSelect(ticket.id);
                      }}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                            {ticket.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge 
                              variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.created}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.assignee}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('view', ticket);
                          }}
                          title="View Ticket"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('edit', ticket);
                          }}
                          title="Edit Ticket"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {ticket.aiSuggestion && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{ticket.aiSuggestion}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {ticket.automationPotential}% automation
                              </span>
                              <span>Est. {ticket.estimatedTime}</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="h-7 text-xs self-start sm:self-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoResolve(ticket);
                              }}
                            >
                              Auto-Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="high-priority" className="space-y-3 mt-4">
              {filteredTickets.map((ticket) => (
                <Card 
                  key={ticket.id}
                  className="p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openModal('view', ticket)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTicketSelect(ticket.id);
                      }}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                            {ticket.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge 
                              variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.created}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.assignee}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('view', ticket);
                          }}
                          title="View Ticket"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('edit', ticket);
                          }}
                          title="Edit Ticket"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {ticket.aiSuggestion && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{ticket.aiSuggestion}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {ticket.automationPotential}% automation
                              </span>
                              <span>Est. {ticket.estimatedTime}</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="h-7 text-xs self-start sm:self-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAutoResolve(ticket);
                              }}
                            >
                              Auto-Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Recommendations Panel */}
        <div className="space-y-4">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Smart automation suggestions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1">Auto-Resolve Ready</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      3 tickets can be automatically resolved with 95%+ confidence
                    </p>
                    <Button 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={handleResolveAllClick}
                      disabled={resolvingAll}
                    >
                      {resolvingAll ? 'Resolving…' : 'Resolve All'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1">Pattern Detected</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Similar password reset requests from TechCorp. Consider automated workflow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm mb-1">Resource Alert</h4>
                    <p className="text-xs text-muted-foreground">
                      Network tickets increasing. Suggest proactive monitoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => sendNotification({
                  title: 'Automation Rule Created',
                  message: 'A sample automation rule has been added.',
                  type: 'info',
                  read: false
                })}
              >
                <Sparkles className="h-4 w-4" />
                Create Automation Rule
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => sendNotification({
                  title: 'AI Training Started',
                  message: 'Model training has begun in the background.',
                  type: 'info',
                  read: false
                })}
              >
                <Bot className="h-4 w-4" />
                Train AI Model
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => sendNotification({
                  title: 'Opening Analytics',
                  message: 'Analytics view is coming soon in this prototype.',
                  type: 'info',
                  read: false
                })}
              >
                <TrendingUp className="h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Ticket Modal */}
      <TicketModal
        isOpen={modalOpen}
        onClose={closeModal}
        ticket={modalTicket}
        mode={modalMode}
      />
    </div>
  );
}
