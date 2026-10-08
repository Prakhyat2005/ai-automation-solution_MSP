import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Loader2, Sparkles, Bot, Clock, User, AlertCircle } from 'lucide-react';
import { Ticket, api } from '../services/api';
import { toast } from 'sonner';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: Ticket | null;
  mode: 'create' | 'edit' | 'view';
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, ticket, mode }) => {
  const { actions, state } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    status: 'open' as 'open' | 'in-progress' | 'resolved' | 'closed',
    assignee: '',
    client: '',
    category: 'Infrastructure',
    estimatedHours: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSentiment, setAiSentiment] = useState<string | null>(null);
  const [aiTone, setAiTone] = useState<string | null>(null);
  const [aiRecommendedCategory, setAiRecommendedCategory] = useState<string | null>(null);
  const [aiRecommendedPriority, setAiRecommendedPriority] = useState<'low' | 'medium' | 'high' | 'critical' | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  // Allow custom client entry when not found in list
  const [useCustomClient, setUseCustomClient] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Reset form when modal opens/closes or ticket changes
  useEffect(() => {
    if (mode === 'view' && ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        assignee: ticket.assignee,
        client: ticket.client,
        category: ticket.category,
        estimatedHours: ticket.estimatedHours || 0,
      });
      setUseCustomClient(false);
    } else if (mode === 'create') {
      // Preselect a sensible default client to reduce friction
      const defaultClient = state.clients[0]?.company || 'Acme Corp';
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'open',
        assignee: '',
        client: defaultClient,
        category: 'Infrastructure',
        estimatedHours: 0,
      });
      setUseCustomClient(false);
    }
    setAiSuggestion('');
    setShowAiSuggestion(false);
    setSubmitError('');
  }, [ticket, mode, isOpen]);

  const generateAiSuggestion = async () => {
    if (!formData.title && !formData.description) return;
    setAiLoading(true);
    try {
      // Analyze sentiment first to inform assistant tone
      const sentiment = await api.analyzeSentiment(`${formData.title}\n${formData.description}`);
      setAiSentiment(sentiment.Sentiment);

      const suggestion = await api.assistantRespond(
        `${formData.title}\n${formData.description}`,
        sentiment.Sentiment
      );
      setAiResponse(suggestion.response);
      setAiTone(suggestion.tone);

      const classification = await api.classifyTicket(`${formData.title} ${formData.description}`);
      setAiRecommendedCategory(classification.category);
      setAiRecommendedPriority(classification.priority);

      setShowAiSuggestion(true);
      setAiSuggestion('AI found a recommended category and priority.');
    } catch (err) {
      console.error('AI analysis failed:', err);
      setAiSuggestion('AI analysis unavailable. Check backend configuration.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Trigger AI suggestion when title or description changes
    if ((field === 'title' || field === 'description') && value && mode === 'create') {
      generateAiSuggestion();
    }
  };

  const applyRecommendedCategory = () => {
    if (aiRecommendedCategory) {
      setFormData(prev => ({ ...prev, category: aiRecommendedCategory }));
    }
  };

  const applyRecommendedPriority = () => {
    if (aiRecommendedPriority) {
      setFormData(prev => ({ ...prev, priority: aiRecommendedPriority }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.client || !formData.category) {
      setSubmitError('Please fill in Title, Client, and Category.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      if (mode === 'create') {
        await actions.createTicket(formData);
        toast.success('Ticket created', { description: formData.title || 'New ticket added' });
      } else if (mode === 'edit' && ticket) {
        await actions.updateTicket(ticket.id, formData);
        toast.success('Ticket updated', { description: formData.title || `Ticket ${ticket.id} updated` });
      }
      // Help user see the new entry immediately
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
      onClose();
    } catch (error: any) {
      console.error('Error saving ticket:', error);
      setSubmitError(error?.message || 'Failed to save ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Create New Ticket' : mode === 'edit' ? 'Edit Ticket' : 'Ticket Details';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
            {ticket && (
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter ticket title"
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div>
                <Label htmlFor="client">Client *</Label>
                {!useCustomClient ? (
                  <Select
                    value={formData.client}
                    onValueChange={(value) => {
                      if (value === '__custom__') {
                        setUseCustomClient(true);
                        setFormData(prev => ({ ...prev, client: '' }));
                        return;
                      }
                      setUseCustomClient(false);
                      handleInputChange('client', value);
                    }}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.clients.map((client) => (
                        <SelectItem key={client.id} value={client.company}>
                          {client.company}
                        </SelectItem>
                      ))}
                      <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                      <SelectItem value="Tech Solutions Inc">Tech Solutions Inc</SelectItem>
                      <SelectItem value="Global Enterprises">Global Enterprises</SelectItem>
                      <SelectItem value="__custom__">Other…</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    placeholder="Enter client name"
                    disabled={isReadOnly}
                    required
                  />
                )}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="User Support">User Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                  disabled={isReadOnly || mode === 'create'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={formData.assignee}
                  onValueChange={(value) => handleInputChange('assignee', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Tech">John Tech</SelectItem>
                    <SelectItem value="Sarah Support">Sarah Support</SelectItem>
                    <SelectItem value="Mike Manager">Mike Manager</SelectItem>
                    <SelectItem value="AI AutoPilot">AI AutoPilot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {ticket && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4" />
                    Last Updated: {new Date(ticket.updatedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide details about the issue"
              disabled={isReadOnly}
              className="min-h-[100px]"
            />
          </div>

          {/* AI Suggestion Card */}
          {showAiSuggestion && (
            <Card className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <p className="text-sm font-medium">AI Recommendation</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {aiSuggestion || 'AI has analyzed your ticket and proposed improvements.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={applyRecommendedCategory} disabled={!aiRecommendedCategory}>
                      Apply Category{aiRecommendedCategory ? `: ${aiRecommendedCategory}` : ''}
                    </Button>
                    <Button variant="outline" size="sm" onClick={applyRecommendedPriority} disabled={!aiRecommendedPriority}>
                      Apply Priority{aiRecommendedPriority ? `: ${aiRecommendedPriority}` : ''}
                    </Button>
                  </div>
                </div>
                <div className="w-64">
                  {aiResponse ? (
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg bg-white/50 dark:bg-transparent">
                        <p className="text-xs text-muted-foreground mb-1">Assistant Tone</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{aiTone || '—'}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-white/50 dark:bg-transparent">
                        <p className="text-xs text-muted-foreground mb-1">Empathetic Response</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{aiResponse || '—'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing ticket details...</p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Error Display */}
          {(state.error || submitError) && (
            <Card className="p-4 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-700 dark:text-red-400">{submitError || state.error}</p>
              </div>
            </Card>
          )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.client || !formData.category}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Create Ticket' : 'Update Ticket'}
            </Button>
          )}
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};