import { v4 as uuidv4 } from 'uuid';

// Core Communication Interfaces
export interface CommunicationChannel {
  id: string;
  type: 'email' | 'sms' | 'push' | 'portal' | 'webhook' | 'slack' | 'teams';
  name: string;
  configuration: ChannelConfiguration;
  isActive: boolean;
  priority: number;
  deliverySettings: DeliverySettings;
  metadata: Record<string, any>;
}

export interface ChannelConfiguration {
  endpoint?: string;
  apiKey?: string;
  credentials?: Record<string, string>;
  templates?: Record<string, string>;
  customSettings?: Record<string, any>;
}

export interface DeliverySettings {
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  batchSize?: number;
  rateLimiting?: RateLimitConfig;
}

export interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // in milliseconds
  burstLimit?: number;
}

// Communication Message Interfaces
export interface CommunicationMessage {
  id: string;
  clientId: string;
  ticketId?: string;
  type: MessageType;
  priority: MessagePriority;
  subject: string;
  content: MessageContent;
  channels: string[]; // Channel IDs
  scheduledAt?: Date;
  sentAt?: Date;
  deliveryStatus: DeliveryStatus;
  metadata: MessageMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageType = 
  | 'incident_notification'
  | 'status_update' 
  | 'resolution_notification'
  | 'maintenance_alert'
  | 'performance_report'
  | 'security_alert'
  | 'billing_notification'
  | 'service_announcement'
  | 'custom';

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent' | 'critical';

export interface MessageContent {
  text: string;
  html?: string;
  attachments?: MessageAttachment[];
  actionButtons?: ActionButton[];
  embeddedData?: Record<string, any>;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  metadata?: Record<string, any>;
}

export interface ActionButton {
  id: string;
  label: string;
  action: 'url' | 'callback' | 'approve' | 'reject';
  value: string;
  style?: 'primary' | 'secondary' | 'danger';
}

export type DeliveryStatus = 
  | 'pending'
  | 'scheduled'
  | 'sending'
  | 'delivered'
  | 'failed'
  | 'bounced'
  | 'read'
  | 'clicked';

export interface MessageMetadata {
  templateId?: string;
  campaignId?: string;
  tags: string[];
  customFields: Record<string, any>;
  trackingEnabled: boolean;
  deliveryAttempts: DeliveryAttempt[];
}

export interface DeliveryAttempt {
  channelId: string;
  attemptedAt: Date;
  status: DeliveryStatus;
  error?: string;
  responseData?: Record<string, any>;
}

// Transparency and Reporting Interfaces
export interface TransparencyReport {
  id: string;
  clientId: string;
  reportType: ReportType;
  period: ReportPeriod;
  data: ReportData;
  generatedAt: Date;
  deliveryMethod: string[];
  isAutomated: boolean;
  metadata: Record<string, any>;
}

export type ReportType = 
  | 'service_performance'
  | 'incident_summary'
  | 'maintenance_schedule'
  | 'security_status'
  | 'resource_utilization'
  | 'cost_analysis'
  | 'sla_compliance'
  | 'custom';

export interface ReportPeriod {
  startDate: Date;
  endDate: Date;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
}

export interface ReportData {
  summary: ReportSummary;
  metrics: ReportMetric[];
  incidents: IncidentSummary[];
  achievements: Achievement[];
  recommendations: Recommendation[];
  attachments: ReportAttachment[];
}

export interface ReportSummary {
  totalIncidents: number;
  resolvedIncidents: number;
  averageResolutionTime: number;
  uptimePercentage: number;
  slaCompliance: number;
  customerSatisfaction?: number;
}

export interface ReportMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  benchmark?: number;
  target?: number;
}

export interface IncidentSummary {
  id: string;
  title: string;
  severity: string;
  status: string;
  createdAt: Date;
  resolvedAt?: Date;
  impact: string;
  rootCause?: string;
  resolution?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  achievedAt: Date;
  impact: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  estimatedImpact: string;
  implementationEffort: string;
}

export interface ReportAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  description?: string;
}

// Client Portal Interfaces
export interface ClientPortalConfig {
  clientId: string;
  customization: PortalCustomization;
  features: PortalFeature[];
  accessControl: AccessControl;
  integrations: PortalIntegration[];
  metadata: Record<string, any>;
}

export interface PortalCustomization {
  branding: BrandingConfig;
  theme: ThemeConfig;
  layout: LayoutConfig;
  customPages: CustomPage[];
}

export interface BrandingConfig {
  logo?: string;
  favicon?: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  customCSS?: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  colorScheme: string;
  typography: TypographyConfig;
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
}

export interface LayoutConfig {
  sidebar: boolean;
  header: boolean;
  footer: boolean;
  customLayout?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  path: string;
  content: string;
  isPublic: boolean;
  order: number;
}

export interface PortalFeature {
  id: string;
  name: string;
  enabled: boolean;
  configuration: Record<string, any>;
  permissions: string[];
}

export interface AccessControl {
  authentication: AuthenticationConfig;
  authorization: AuthorizationConfig;
  sessionManagement: SessionConfig;
}

export interface AuthenticationConfig {
  methods: string[];
  ssoEnabled: boolean;
  mfaRequired: boolean;
  passwordPolicy: PasswordPolicy;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays?: number;
}

export interface AuthorizationConfig {
  roles: Role[];
  permissions: Permission[];
  defaultRole: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  actions: string[];
}

export interface SessionConfig {
  timeout: number;
  maxConcurrentSessions: number;
  rememberMe: boolean;
}

export interface PortalIntegration {
  id: string;
  type: string;
  name: string;
  configuration: Record<string, any>;
  isActive: boolean;
}

// Notification and Alert Interfaces
export interface NotificationRule {
  id: string;
  clientId: string;
  name: string;
  description: string;
  triggers: NotificationTrigger[];
  conditions: NotificationCondition[];
  actions: NotificationAction[];
  isActive: boolean;
  priority: number;
  metadata: Record<string, any>;
}

export interface NotificationTrigger {
  type: 'incident' | 'metric_threshold' | 'schedule' | 'manual' | 'webhook';
  configuration: Record<string, any>;
  filters?: Record<string, any>;
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'regex';
  value: any;
  logicalOperator?: 'and' | 'or';
}

export interface NotificationAction {
  type: 'send_message' | 'create_ticket' | 'escalate' | 'webhook' | 'custom';
  configuration: Record<string, any>;
  delay?: number;
}

// Feedback and Survey Interfaces
export interface FeedbackSurvey {
  id: string;
  clientId: string;
  title: string;
  description: string;
  type: 'satisfaction' | 'nps' | 'custom';
  questions: SurveyQuestion[];
  triggers: SurveyTrigger[];
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'yes_no' | 'scale';
  question: string;
  required: boolean;
  options?: string[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: string;
  value: any;
  message: string;
}

export interface SurveyTrigger {
  event: 'ticket_resolved' | 'service_completion' | 'scheduled' | 'manual';
  delay?: number;
  conditions?: Record<string, any>;
}

export interface FeedbackResponse {
  id: string;
  surveyId: string;
  clientId: string;
  ticketId?: string;
  responses: QuestionResponse[];
  submittedAt: Date;
  metadata: Record<string, any>;
}

export interface QuestionResponse {
  questionId: string;
  value: any;
  text?: string;
}

// Main Service Class
export class ClientCommunicationService {
  private channels: Map<string, CommunicationChannel> = new Map();
  private messages: Map<string, CommunicationMessage> = new Map();
  private reports: Map<string, TransparencyReport> = new Map();
  private portalConfigs: Map<string, ClientPortalConfig> = new Map();
  private notificationRules: Map<string, NotificationRule> = new Map();
  private surveys: Map<string, FeedbackSurvey> = new Map();
  private feedbackResponses: Map<string, FeedbackResponse> = new Map();

  constructor() {
    this.initializeDefaultChannels();
    this.initializeDefaultSurveys();
  }

  // Channel Management
  async createChannel(channel: Omit<CommunicationChannel, 'id'>): Promise<CommunicationChannel> {
    const newChannel: CommunicationChannel = {
      id: uuidv4(),
      ...channel
    };

    this.channels.set(newChannel.id, newChannel);
    return newChannel;
  }

  async getChannel(channelId: string): Promise<CommunicationChannel | null> {
    return this.channels.get(channelId) || null;
  }

  async updateChannel(channelId: string, updates: Partial<CommunicationChannel>): Promise<CommunicationChannel | null> {
    const channel = this.channels.get(channelId);
    if (!channel) return null;

    const updatedChannel = { ...channel, ...updates };
    this.channels.set(channelId, updatedChannel);
    return updatedChannel;
  }

  async deleteChannel(channelId: string): Promise<boolean> {
    return this.channels.delete(channelId);
  }

  async getChannelsByType(type: CommunicationChannel['type']): Promise<CommunicationChannel[]> {
    return Array.from(this.channels.values()).filter(channel => channel.type === type);
  }

  // Message Management
  async sendMessage(messageData: Omit<CommunicationMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunicationMessage> {
    const message: CommunicationMessage = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...messageData
    };

    this.messages.set(message.id, message);

    // Process message delivery
    await this.processMessageDelivery(message);

    return message;
  }

  private async processMessageDelivery(message: CommunicationMessage): Promise<void> {
    for (const channelId of message.channels) {
      const channel = this.channels.get(channelId);
      if (!channel || !channel.isActive) continue;

      try {
        await this.deliverToChannel(message, channel);
        
        const attempt: DeliveryAttempt = {
          channelId,
          attemptedAt: new Date(),
          status: 'delivered'
        };
        
        message.metadata.deliveryAttempts.push(attempt);
        message.deliveryStatus = 'delivered';
        
      } catch (error) {
        const attempt: DeliveryAttempt = {
          channelId,
          attemptedAt: new Date(),
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        
        message.metadata.deliveryAttempts.push(attempt);
        message.deliveryStatus = 'failed';
      }
    }

    message.sentAt = new Date();
    message.updatedAt = new Date();
    this.messages.set(message.id, message);
  }

  private async deliverToChannel(message: CommunicationMessage, channel: CommunicationChannel): Promise<void> {
    // Simulate channel-specific delivery logic
    switch (channel.type) {
      case 'email':
        await this.sendEmail(message, channel);
        break;
      case 'sms':
        await this.sendSMS(message, channel);
        break;
      case 'push':
        await this.sendPushNotification(message, channel);
        break;
      case 'portal':
        await this.sendPortalNotification(message, channel);
        break;
      case 'webhook':
        await this.sendWebhook(message, channel);
        break;
      case 'slack':
        await this.sendSlackMessage(message, channel);
        break;
      case 'teams':
        await this.sendTeamsMessage(message, channel);
        break;
      default:
        throw new Error(`Unsupported channel type: ${channel.type}`);
    }
  }

  private async sendEmail(message: CommunicationMessage, channel: CommunicationChannel): Promise<void> {
    // Email delivery implementation
    console.log(`Sending email via ${channel.name}:`, message.subject);
  }

  private async sendSMS(message: CommunicationMessage, channel: CommunicationChannel): Promise<void> {
    // SMS delivery implementation
    console.log(`Sending SMS via ${channel.name}:`, message.content.text.substring(0, 50));
  }

  private async sendPushNotification(message: CommunicationMessage, channel: CommunicationChannel): Promise<void> {
    // Push notification implementation
    console.log(`Sending push notification via ${channel.name}:`, message.subject);
  }

  private async sendPortalNotification(message: CommunicationMessage, channel: CommunicationChannel): Promise<void> {
    // Portal notification implementation
    console.log(`Sending portal notification via ${channel.name}:`, message.subject);
  }

  private async sendWebhook(message: CommunicationMessage, channel: CommunicationChannel): Promise<void> {
    // Webhook delivery implementation
    console.log(`Sending webhook via ${channel.name}:`, message.subject);
  }

  private async sendSlackMessage(message: CommunicationMessage, channel: CommunicationChannel): Promise<void> {
    // Slack message implementation
    console.log(`Sending Slack message via ${channel.name}:`, message.subject);
  }

  private async sendTeamsMessage(message: CommunicationMessage, channel: CommunicationChannel): Promise<void> {
    // Teams message implementation
    console.log(`Sending Teams message via ${channel.name}:`, message.subject);
  }

  async getMessage(messageId: string): Promise<CommunicationMessage | null> {
    return this.messages.get(messageId) || null;
  }

  async getMessagesByClient(clientId: string): Promise<CommunicationMessage[]> {
    return Array.from(this.messages.values()).filter(message => message.clientId === clientId);
  }

  async getMessagesByTicket(ticketId: string): Promise<CommunicationMessage[]> {
    return Array.from(this.messages.values()).filter(message => message.ticketId === ticketId);
  }

  // Transparency Reporting
  async generateReport(
    clientId: string,
    reportType: ReportType,
    period: ReportPeriod,
    customData?: Record<string, any>
  ): Promise<TransparencyReport> {
    const reportData = await this.collectReportData(clientId, reportType, period);
    
    const report: TransparencyReport = {
      id: uuidv4(),
      clientId,
      reportType,
      period,
      data: reportData,
      generatedAt: new Date(),
      deliveryMethod: ['portal', 'email'],
      isAutomated: false,
      metadata: customData || {}
    };

    this.reports.set(report.id, report);
    return report;
  }

  private async collectReportData(clientId: string, reportType: ReportType, period: ReportPeriod): Promise<ReportData> {
    // Simulate data collection based on report type
    const mockData: ReportData = {
      summary: {
        totalIncidents: Math.floor(Math.random() * 20),
        resolvedIncidents: Math.floor(Math.random() * 18),
        averageResolutionTime: Math.floor(Math.random() * 240) + 60, // 1-5 hours
        uptimePercentage: 99.5 + Math.random() * 0.5,
        slaCompliance: 95 + Math.random() * 5,
        customerSatisfaction: 4.2 + Math.random() * 0.8
      },
      metrics: [
        {
          name: 'Response Time',
          value: Math.floor(Math.random() * 30) + 5,
          unit: 'minutes',
          trend: 'down',
          changePercentage: -12.5,
          target: 15
        },
        {
          name: 'Resolution Rate',
          value: 94.2 + Math.random() * 5,
          unit: '%',
          trend: 'up',
          changePercentage: 3.2,
          target: 95
        }
      ],
      incidents: [],
      achievements: [
        {
          id: uuidv4(),
          title: 'Zero Critical Incidents',
          description: 'Maintained zero critical incidents for the entire reporting period',
          category: 'reliability',
          achievedAt: new Date(),
          impact: 'High customer satisfaction and business continuity'
        }
      ],
      recommendations: [
        {
          id: uuidv4(),
          title: 'Implement Proactive Monitoring',
          description: 'Deploy additional monitoring tools to detect issues before they impact users',
          priority: 'medium',
          category: 'monitoring',
          estimatedImpact: 'Reduce incident response time by 30%',
          implementationEffort: 'Medium'
        }
      ],
      attachments: []
    };

    return mockData;
  }

  async getReport(reportId: string): Promise<TransparencyReport | null> {
    return this.reports.get(reportId) || null;
  }

  async getReportsByClient(clientId: string): Promise<TransparencyReport[]> {
    return Array.from(this.reports.values()).filter(report => report.clientId === clientId);
  }

  // Client Portal Management
  async configureClientPortal(clientId: string, config: Omit<ClientPortalConfig, 'clientId'>): Promise<ClientPortalConfig> {
    const portalConfig: ClientPortalConfig = {
      clientId,
      ...config
    };

    this.portalConfigs.set(clientId, portalConfig);
    return portalConfig;
  }

  async getClientPortalConfig(clientId: string): Promise<ClientPortalConfig | null> {
    return this.portalConfigs.get(clientId) || null;
  }

  async updateClientPortalConfig(clientId: string, updates: Partial<ClientPortalConfig>): Promise<ClientPortalConfig | null> {
    const config = this.portalConfigs.get(clientId);
    if (!config) return null;

    const updatedConfig = { ...config, ...updates };
    this.portalConfigs.set(clientId, updatedConfig);
    return updatedConfig;
  }

  // Notification Rules Management
  async createNotificationRule(rule: Omit<NotificationRule, 'id'>): Promise<NotificationRule> {
    const newRule: NotificationRule = {
      id: uuidv4(),
      ...rule
    };

    this.notificationRules.set(newRule.id, newRule);
    return newRule;
  }

  async getNotificationRule(ruleId: string): Promise<NotificationRule | null> {
    return this.notificationRules.get(ruleId) || null;
  }

  async getNotificationRulesByClient(clientId: string): Promise<NotificationRule[]> {
    return Array.from(this.notificationRules.values()).filter(rule => rule.clientId === clientId);
  }

  async updateNotificationRule(ruleId: string, updates: Partial<NotificationRule>): Promise<NotificationRule | null> {
    const rule = this.notificationRules.get(ruleId);
    if (!rule) return null;

    const updatedRule = { ...rule, ...updates };
    this.notificationRules.set(ruleId, updatedRule);
    return updatedRule;
  }

  async deleteNotificationRule(ruleId: string): Promise<boolean> {
    return this.notificationRules.delete(ruleId);
  }

  // Survey and Feedback Management
  async createSurvey(survey: Omit<FeedbackSurvey, 'id'>): Promise<FeedbackSurvey> {
    const newSurvey: FeedbackSurvey = {
      id: uuidv4(),
      ...survey
    };

    this.surveys.set(newSurvey.id, newSurvey);
    return newSurvey;
  }

  async getSurvey(surveyId: string): Promise<FeedbackSurvey | null> {
    return this.surveys.get(surveyId) || null;
  }

  async getSurveysByClient(clientId: string): Promise<FeedbackSurvey[]> {
    return Array.from(this.surveys.values()).filter(survey => survey.clientId === clientId);
  }

  async submitFeedback(feedback: Omit<FeedbackResponse, 'id' | 'submittedAt'>): Promise<FeedbackResponse> {
    const response: FeedbackResponse = {
      id: uuidv4(),
      submittedAt: new Date(),
      ...feedback
    };

    this.feedbackResponses.set(response.id, response);
    return response;
  }

  async getFeedbackResponse(responseId: string): Promise<FeedbackResponse | null> {
    return this.feedbackResponses.get(responseId) || null;
  }

  async getFeedbackBySurvey(surveyId: string): Promise<FeedbackResponse[]> {
    return Array.from(this.feedbackResponses.values()).filter(response => response.surveyId === surveyId);
  }

  async getFeedbackByClient(clientId: string): Promise<FeedbackResponse[]> {
    return Array.from(this.feedbackResponses.values()).filter(response => response.clientId === clientId);
  }

  // Analytics and Insights
  async getCommunicationAnalytics(clientId: string, period: ReportPeriod): Promise<Record<string, any>> {
    const messages = await this.getMessagesByClient(clientId);
    const reports = await this.getReportsByClient(clientId);
    const feedback = await this.getFeedbackByClient(clientId);

    return {
      messageStats: {
        total: messages.length,
        byType: this.groupBy(messages, 'type'),
        byPriority: this.groupBy(messages, 'priority'),
        deliveryRate: this.calculateDeliveryRate(messages)
      },
      reportStats: {
        total: reports.length,
        byType: this.groupBy(reports, 'reportType'),
        automated: reports.filter((r: TransparencyReport) => r.isAutomated).length
      },
      feedbackStats: {
        total: feedback.length,
        averageRating: this.calculateAverageRating(feedback),
        responseRate: this.calculateResponseRate(feedback)
      }
    };
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = String(item[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateDeliveryRate(messages: CommunicationMessage[]): number {
    if (messages.length === 0) return 0;
    const delivered = messages.filter(m => m.deliveryStatus === 'delivered').length;
    return (delivered / messages.length) * 100;
  }

  private calculateAverageRating(feedback: FeedbackResponse[]): number {
    if (feedback.length === 0) return 0;
    
    const ratings = feedback.flatMap(f => 
      f.responses.filter(r => typeof r.value === 'number').map(r => r.value as number)
    );
    
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }

  private calculateResponseRate(feedback: FeedbackResponse[]): number {
    // This would need to be calculated against sent surveys
    return feedback.length > 0 ? 75 + Math.random() * 20 : 0; // Mock calculation
  }

  // Initialization Methods
  private initializeDefaultChannels(): void {
    const defaultChannels: Omit<CommunicationChannel, 'id'>[] = [
      {
        type: 'email',
        name: 'Primary Email',
        configuration: {
          endpoint: 'smtp.example.com',
          templates: {
            incident: 'incident_notification_template',
            status: 'status_update_template',
            resolution: 'resolution_template'
          }
        },
        isActive: true,
        priority: 1,
        deliverySettings: {
          retryAttempts: 3,
          retryDelay: 5000,
          timeout: 30000,
          rateLimiting: {
            maxRequests: 100,
            timeWindow: 60000
          }
        },
        metadata: {}
      },
      {
        type: 'portal',
        name: 'Client Portal',
        configuration: {
          endpoint: '/api/portal/notifications'
        },
        isActive: true,
        priority: 2,
        deliverySettings: {
          retryAttempts: 2,
          retryDelay: 1000,
          timeout: 10000
        },
        metadata: {}
      },
      {
        type: 'sms',
        name: 'SMS Alerts',
        configuration: {
          endpoint: 'https://api.sms-provider.com/send'
        },
        isActive: false,
        priority: 3,
        deliverySettings: {
          retryAttempts: 2,
          retryDelay: 2000,
          timeout: 15000,
          rateLimiting: {
            maxRequests: 50,
            timeWindow: 60000
          }
        },
        metadata: {}
      }
    ];

    defaultChannels.forEach(channel => {
      this.createChannel(channel);
    });
  }

  private initializeDefaultSurveys(): void {
    const defaultSurveys: Omit<FeedbackSurvey, 'id'>[] = [
      {
        clientId: 'default',
        title: 'Incident Resolution Satisfaction',
        description: 'Help us improve our incident response process',
        type: 'satisfaction',
        questions: [
          {
            id: 'satisfaction_rating',
            type: 'rating',
            question: 'How satisfied are you with the resolution of your incident?',
            required: true
          },
          {
            id: 'response_time',
            type: 'rating',
            question: 'How would you rate our response time?',
            required: true
          },
          {
            id: 'communication',
            type: 'rating',
            question: 'How clear and helpful was our communication throughout the process?',
            required: true
          },
          {
            id: 'additional_feedback',
            type: 'text',
            question: 'Any additional feedback or suggestions?',
            required: false
          }
        ],
        triggers: [
          {
            event: 'ticket_resolved',
            delay: 3600000 // 1 hour after resolution
          }
        ],
        isActive: true,
        metadata: {}
      }
    ];

    defaultSurveys.forEach(survey => {
      this.createSurvey(survey);
    });
  }

  // Cleanup
  async destroy(): Promise<void> {
    this.channels.clear();
    this.messages.clear();
    this.reports.clear();
    this.portalConfigs.clear();
    this.notificationRules.clear();
    this.surveys.clear();
    this.feedbackResponses.clear();
  }
}

export default ClientCommunicationService;