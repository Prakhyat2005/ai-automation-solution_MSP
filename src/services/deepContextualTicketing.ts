import * as natural from 'natural';
import compromise from 'compromise';
import { v4 as uuidv4 } from 'uuid';
import { format, differenceInMinutes, differenceInHours } from 'date-fns';
import mlEngine, { TicketContext, RootCauseAnalysis } from './mlEngine';
import aiService from './aiService';

// Enhanced interfaces for deep contextual analysis
export interface ContextualTicket extends TicketContext {
  semanticAnalysis: SemanticAnalysis;
  contextualFactors: ContextualFactor[];
  similarTickets: SimilarTicket[];
  resolutionPrediction: ResolutionPrediction;
  clientContext: ClientContext;
  technicalContext: TechnicalContext;
  businessImpact: BusinessImpact;
  escalationRisk: EscalationRisk;
}

export interface SemanticAnalysis {
  sentiment: {
    score: number; // -1 to 1
    magnitude: number; // 0 to 1
    label: 'positive' | 'neutral' | 'negative';
  };
  entities: Entity[];
  keywords: Keyword[];
  topics: Topic[];
  urgencyIndicators: UrgencyIndicator[];
  technicalComplexity: number; // 1-10 scale
  emotionalTone: EmotionalTone;
}

export interface Entity {
  text: string;
  type: 'person' | 'organization' | 'location' | 'technology' | 'product' | 'service' | 'error_code' | 'ip_address' | 'domain';
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface Keyword {
  word: string;
  relevance: number;
  frequency: number;
  category: 'technical' | 'business' | 'emotional' | 'temporal';
}

export interface Topic {
  name: string;
  confidence: number;
  keywords: string[];
  category: 'infrastructure' | 'software' | 'security' | 'network' | 'user_access' | 'performance' | 'backup' | 'compliance';
}

export interface UrgencyIndicator {
  indicator: string;
  weight: number;
  type: 'temporal' | 'business_critical' | 'security' | 'compliance' | 'user_impact';
}

export interface EmotionalTone {
  frustration: number;
  urgency: number;
  satisfaction: number;
  confusion: number;
  anger: number;
}

export interface ContextualFactor {
  type: 'temporal' | 'environmental' | 'organizational' | 'technical' | 'business';
  factor: string;
  impact: number; // 0-1 scale
  description: string;
}

export interface SimilarTicket {
  ticketId: string;
  similarity: number;
  matchingFactors: string[];
  resolution: string;
  resolutionTime: number;
  successRate: number;
}

export interface ResolutionPrediction {
  estimatedTime: number; // minutes
  confidence: number;
  complexity: 'low' | 'medium' | 'high' | 'critical';
  requiredSkills: string[];
  recommendedTechnician: string;
  alternativeTechnicians: string[];
  resolutionSteps: ResolutionStep[];
  riskFactors: RiskFactor[];
}

export interface ResolutionStep {
  step: number;
  action: string;
  estimatedTime: number;
  requiredSkills: string[];
  riskLevel: 'low' | 'medium' | 'high';
  dependencies: string[];
  validationCriteria: string[];
}

export interface RiskFactor {
  type: 'technical' | 'business' | 'security' | 'compliance';
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface ClientContext {
  clientId: string;
  clientName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  slaLevel: string;
  historicalTicketVolume: number;
  averageResolutionTime: number;
  satisfactionScore: number;
  criticalSystems: string[];
  businessHours: BusinessHours;
  escalationContacts: Contact[];
  preferredCommunication: 'email' | 'phone' | 'portal' | 'chat';
}

export interface BusinessHours {
  timezone: string;
  weekdays: TimeRange;
  weekends: TimeRange;
  holidays: string[];
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

export interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
  escalationLevel: number;
}

export interface TechnicalContext {
  affectedSystems: SystemInfo[];
  networkTopology: NetworkInfo;
  dependencies: Dependency[];
  recentChanges: ChangeRecord[];
  monitoringData: MonitoringMetric[];
  configurationBaseline: ConfigurationItem[];
}

export interface SystemInfo {
  id: string;
  name: string;
  type: 'server' | 'network_device' | 'application' | 'database' | 'storage';
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  lastUpdate: Date;
  metrics: Record<string, number>;
  dependencies: string[];
}

export interface NetworkInfo {
  subnets: string[];
  vlans: number[];
  firewallRules: string[];
  bandwidth: number;
  latency: number;
}

export interface Dependency {
  from: string;
  to: string;
  type: 'network' | 'application' | 'data' | 'service';
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

export interface ChangeRecord {
  id: string;
  timestamp: Date;
  type: 'configuration' | 'software' | 'hardware' | 'network';
  description: string;
  implementedBy: string;
  approvedBy: string;
  rollbackPlan: string;
}

export interface MonitoringMetric {
  metric: string;
  value: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
  timestamp: Date;
}

export interface ConfigurationItem {
  id: string;
  name: string;
  type: string;
  configuration: Record<string, any>;
  lastModified: Date;
  version: string;
}

export interface BusinessImpact {
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: number;
  affectedSystems: string[];
  businessProcesses: string[];
  financialImpact: FinancialImpact;
  reputationalRisk: number; // 0-10 scale
  complianceRisk: ComplianceRisk[];
}

export interface FinancialImpact {
  estimatedCostPerHour: number;
  totalEstimatedCost: number;
  revenueAtRisk: number;
  currency: string;
}

export interface ComplianceRisk {
  framework: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requirements: string[];
  deadline: Date;
}

export interface EscalationRisk {
  riskScore: number; // 0-100
  factors: EscalationFactor[];
  triggers: EscalationTrigger[];
  preventiveMeasures: string[];
  escalationPath: EscalationLevel[];
}

export interface EscalationFactor {
  factor: string;
  weight: number;
  currentValue: number;
  threshold: number;
}

export interface EscalationTrigger {
  condition: string;
  threshold: number;
  action: string;
  notificationList: string[];
}

export interface EscalationLevel {
  level: number;
  title: string;
  contacts: Contact[];
  timeThreshold: number; // minutes
  autoEscalate: boolean;
}

class DeepContextualTicketingService {
  private tokenizer: natural.WordTokenizer;
  private stemmer: any;
  private sentiment: any;
  private tfidf: natural.TfIdf;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.sentiment = natural.SentimentAnalyzer;
    this.tfidf = new natural.TfIdf();
    this.initializeNLP();
  }

  private initializeNLP(): void {
    // Initialize TF-IDF with common IT support documents
    const commonDocuments = [
      'server performance issue high cpu usage memory leak',
      'network connectivity problem dns resolution timeout',
      'email server down exchange outlook connection failed',
      'backup failure storage space insufficient disk full',
      'security breach malware virus detected firewall alert',
      'database connection error sql server timeout query slow',
      'application crash software bug user interface frozen',
      'printer not working driver installation paper jam',
      'password reset user account locked authentication failed',
      'vpn connection issues remote access tunnel down'
    ];

    commonDocuments.forEach(doc => {
      this.tfidf.addDocument(doc);
    });
  }

  async analyzeTicketContext(ticket: TicketContext): Promise<ContextualTicket> {
    try {
      // Perform comprehensive analysis
      const [
        semanticAnalysis,
        contextualFactors,
        similarTickets,
        resolutionPrediction,
        clientContext,
        technicalContext,
        businessImpact,
        escalationRisk
      ] = await Promise.all([
        this.performSemanticAnalysis(ticket),
        this.extractContextualFactors(ticket),
        this.findSimilarTickets(ticket),
        this.predictResolution(ticket),
        this.getClientContext(ticket.clientId),
        this.getTechnicalContext(ticket),
        this.assessBusinessImpact(ticket),
        this.calculateEscalationRisk(ticket)
      ]);

      return {
        ...ticket,
        semanticAnalysis,
        contextualFactors,
        similarTickets,
        resolutionPrediction,
        clientContext,
        technicalContext,
        businessImpact,
        escalationRisk
      };
    } catch (error) {
      console.error('Error analyzing ticket context:', error);
      throw new Error('Failed to analyze ticket context');
    }
  }

  private async performSemanticAnalysis(ticket: TicketContext): Promise<SemanticAnalysis> {
    const text = `${ticket.title} ${ticket.description}`;
    
    // Tokenize and analyze
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    const doc = compromise(text);

    // Sentiment analysis
    const sentiment = await this.analyzeSentiment(text);
    
    // Entity extraction
    const entities = this.extractEntities(text, doc);
    
    // Keyword extraction
    const keywords = this.extractKeywords(tokens, text);
    
    // Topic classification
    const topics = await this.classifyTopics(text, keywords);
    
    // Urgency indicators
    const urgencyIndicators = this.detectUrgencyIndicators(text, tokens);
    
    // Technical complexity
    const technicalComplexity = this.assessTechnicalComplexity(text, keywords, entities);
    
    // Emotional tone
    const emotionalTone = this.analyzeEmotionalTone(text);

    return {
      sentiment,
      entities,
      keywords,
      topics,
      urgencyIndicators,
      technicalComplexity,
      emotionalTone
    };
  }

  private async analyzeSentiment(text: string): Promise<SemanticAnalysis['sentiment']> {
    try {
      // Use AI service for advanced sentiment analysis
      const response = await aiService.sendMessage([
        {
          role: 'user',
          content: `Analyze the sentiment of this IT support ticket text and return a JSON response with score (-1 to 1), magnitude (0 to 1), and label (positive/neutral/negative): "${text}"`
        }
      ]);

      const sentimentData = JSON.parse(response.content);
      return sentimentData;
    } catch (error) {
      // Fallback to basic sentiment analysis
      const tokens = this.tokenizer.tokenize(text.toLowerCase());
      const stemmedTokens = tokens.map(token => this.stemmer.stem(token));
      
      // Simple sentiment scoring
      const positiveWords = ['resolved', 'fixed', 'working', 'good', 'excellent', 'satisfied'];
      const negativeWords = ['broken', 'failed', 'error', 'problem', 'issue', 'urgent', 'critical', 'down'];
      
      let score = 0;
      stemmedTokens.forEach(token => {
        if (positiveWords.includes(token)) score += 0.1;
        if (negativeWords.includes(token)) score -= 0.1;
      });

      score = Math.max(-1, Math.min(1, score));
      const magnitude = Math.abs(score);
      const label: 'positive' | 'neutral' | 'negative' = score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral';

      return { score, magnitude, label };
    }
  }

  private extractEntities(text: string, doc: any): Entity[] {
    const entities: Entity[] = [];

    // Extract people
    const people = doc.people().out('array');
    people.forEach((person: string) => {
      entities.push({
        text: person,
        type: 'person',
        confidence: 0.8,
        startIndex: text.indexOf(person),
        endIndex: text.indexOf(person) + person.length
      });
    });

    // Extract organizations
    const orgs = doc.organizations().out('array');
    orgs.forEach((org: string) => {
      entities.push({
        text: org,
        type: 'organization',
        confidence: 0.7,
        startIndex: text.indexOf(org),
        endIndex: text.indexOf(org) + org.length
      });
    });

    // Extract IP addresses
    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
    let match;
    while ((match = ipRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'ip_address',
        confidence: 0.95,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }

    // Extract domains
    const domainRegex = /\b[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}\b/g;
    while ((match = domainRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'domain',
        confidence: 0.9,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }

    // Extract error codes
    const errorCodeRegex = /\b(error|err|code|exception)\s*:?\s*([a-zA-Z0-9\-_]+)\b/gi;
    while ((match = errorCodeRegex.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'error_code',
        confidence: 0.85,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }

    return entities;
  }

  private extractKeywords(tokens: string[], text: string): Keyword[] {
    const keywords: Keyword[] = [];
    const technicalTerms = ['server', 'network', 'database', 'application', 'firewall', 'router', 'switch', 'vpn', 'dns', 'dhcp'];
    const businessTerms = ['client', 'customer', 'revenue', 'business', 'critical', 'priority', 'sla', 'deadline'];
    const emotionalTerms = ['urgent', 'frustrated', 'angry', 'pleased', 'satisfied', 'disappointed'];
    const temporalTerms = ['immediately', 'asap', 'urgent', 'today', 'tomorrow', 'deadline', 'schedule'];

    // Calculate TF-IDF scores
    this.tfidf.addDocument(text);
    const docIndex = this.tfidf.documents.length - 1;

    tokens.forEach(token => {
      const tfidfScore = this.tfidf.tfidf(token, docIndex);
      if (tfidfScore > 0) {
        let category: Keyword['category'] = 'technical';
        
        if (businessTerms.includes(token)) category = 'business';
        else if (emotionalTerms.includes(token)) category = 'emotional';
        else if (temporalTerms.includes(token)) category = 'temporal';

        keywords.push({
          word: token,
          relevance: tfidfScore,
          frequency: (text.match(new RegExp(token, 'gi')) || []).length,
          category
        });
      }
    });

    return keywords.sort((a, b) => b.relevance - a.relevance).slice(0, 20);
  }

  private async classifyTopics(text: string, keywords: Keyword[]): Promise<Topic[]> {
    const topics: Topic[] = [];
    
    // Define topic patterns
    const topicPatterns = {
      infrastructure: ['server', 'hardware', 'cpu', 'memory', 'disk', 'storage', 'power'],
      software: ['application', 'software', 'program', 'install', 'update', 'patch', 'bug'],
      security: ['security', 'virus', 'malware', 'firewall', 'breach', 'unauthorized', 'password'],
      network: ['network', 'internet', 'connection', 'router', 'switch', 'dns', 'dhcp', 'vpn'],
      user_access: ['login', 'password', 'account', 'access', 'permission', 'authentication'],
      performance: ['slow', 'performance', 'speed', 'timeout', 'lag', 'response', 'optimization'],
      backup: ['backup', 'restore', 'recovery', 'archive', 'snapshot', 'replication'],
      compliance: ['compliance', 'audit', 'regulation', 'policy', 'gdpr', 'hipaa', 'sox']
    };

    Object.entries(topicPatterns).forEach(([topicName, patterns]) => {
      const matchingKeywords = keywords.filter(k => 
        patterns.some(pattern => k.word.includes(pattern) || pattern.includes(k.word))
      );

      if (matchingKeywords.length > 0) {
        const confidence = matchingKeywords.reduce((sum, k) => sum + k.relevance, 0) / matchingKeywords.length;
        
        topics.push({
          name: topicName,
          confidence,
          keywords: matchingKeywords.map(k => k.word),
          category: topicName as Topic['category']
        });
      }
    });

    return topics.sort((a, b) => b.confidence - a.confidence);
  }

  private detectUrgencyIndicators(text: string, tokens: string[]): UrgencyIndicator[] {
    const indicators: UrgencyIndicator[] = [];
    
    const urgencyPatterns = [
      { pattern: /\b(urgent|asap|immediately|critical|emergency)\b/gi, weight: 0.9, type: 'temporal' as const },
      { pattern: /\b(down|offline|not working|failed|broken)\b/gi, weight: 0.8, type: 'business_critical' as const },
      { pattern: /\b(security|breach|hack|virus|malware)\b/gi, weight: 0.95, type: 'security' as const },
      { pattern: /\b(compliance|audit|regulation|violation)\b/gi, weight: 0.85, type: 'compliance' as const },
      { pattern: /\b(all users|entire|company|organization)\b/gi, weight: 0.7, type: 'user_impact' as const }
    ];

    urgencyPatterns.forEach(({ pattern, weight, type }) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          indicators.push({
            indicator: match,
            weight,
            type
          });
        });
      }
    });

    return indicators;
  }

  private assessTechnicalComplexity(text: string, keywords: Keyword[], entities: Entity[]): number {
    let complexity = 1;

    // Technical keywords increase complexity
    const technicalKeywords = keywords.filter(k => k.category === 'technical');
    complexity += technicalKeywords.length * 0.5;

    // Multiple systems/technologies increase complexity
    const techEntities = entities.filter(e => ['technology', 'product', 'service'].includes(e.type));
    complexity += techEntities.length * 0.3;

    // Error codes and technical details increase complexity
    const errorEntities = entities.filter(e => e.type === 'error_code');
    complexity += errorEntities.length * 0.4;

    // Integration/network issues are more complex
    if (text.includes('integration') || text.includes('network') || text.includes('database')) {
      complexity += 1;
    }

    return Math.min(10, Math.max(1, complexity));
  }

  private analyzeEmotionalTone(text: string): EmotionalTone {
    const frustrationWords = ['frustrated', 'annoyed', 'irritated', 'fed up'];
    const urgencyWords = ['urgent', 'asap', 'immediately', 'critical'];
    const satisfactionWords = ['satisfied', 'pleased', 'happy', 'good'];
    const confusionWords = ['confused', 'unclear', 'don\'t understand', 'not sure'];
    const angerWords = ['angry', 'furious', 'unacceptable', 'ridiculous'];

    const calculateScore = (words: string[]) => {
      return words.reduce((score, word) => {
        const regex = new RegExp(word, 'gi');
        const matches = text.match(regex);
        return score + (matches ? matches.length * 0.2 : 0);
      }, 0);
    };

    return {
      frustration: Math.min(1, calculateScore(frustrationWords)),
      urgency: Math.min(1, calculateScore(urgencyWords)),
      satisfaction: Math.min(1, calculateScore(satisfactionWords)),
      confusion: Math.min(1, calculateScore(confusionWords)),
      anger: Math.min(1, calculateScore(angerWords))
    };
  }

  private async extractContextualFactors(ticket: TicketContext): Promise<ContextualFactor[]> {
    const factors: ContextualFactor[] = [];

    // Temporal factors
    const now = new Date();
    const ticketAge = differenceInMinutes(now, ticket.createdAt);
    
    if (ticketAge > 240) { // 4 hours
      factors.push({
        type: 'temporal',
        factor: 'aged_ticket',
        impact: Math.min(1, ticketAge / 1440), // Scale by day
        description: `Ticket is ${Math.round(ticketAge / 60)} hours old`
      });
    }

    // Business hours factor
    const hour = now.getHours();
    const isBusinessHours = hour >= 9 && hour <= 17;
    
    factors.push({
      type: 'temporal',
      factor: 'business_hours',
      impact: isBusinessHours ? 0.8 : 0.3,
      description: isBusinessHours ? 'During business hours' : 'Outside business hours'
    });

    // Priority-based factors
    if (ticket.priority === 'high' || ticket.priority === 'critical') {
      factors.push({
        type: 'business',
        factor: 'high_priority',
        impact: ticket.priority === 'critical' ? 1.0 : 0.8,
        description: `${ticket.priority} priority ticket`
      });
    }

    return factors;
  }

  private async findSimilarTickets(ticket: TicketContext): Promise<SimilarTicket[]> {
    // Mock implementation - in real scenario, this would query a ticket database
    const mockSimilarTickets: SimilarTicket[] = [
      {
        ticketId: 'TKT-001',
        similarity: 0.85,
        matchingFactors: ['server performance', 'high cpu'],
        resolution: 'Restarted services and optimized database queries',
        resolutionTime: 120,
        successRate: 0.9
      },
      {
        ticketId: 'TKT-002',
        similarity: 0.72,
        matchingFactors: ['network connectivity'],
        resolution: 'Updated network drivers and reset network adapter',
        resolutionTime: 45,
        successRate: 0.95
      }
    ];

    return mockSimilarTickets;
  }

  private async predictResolution(ticket: TicketContext): Promise<ResolutionPrediction> {
    // Use ML engine for prediction
    const rootCauseAnalysis = await mlEngine.performRootCauseAnalysis(ticket);
    
    // Generate resolution steps based on analysis
    const resolutionSteps: ResolutionStep[] = [
      {
        step: 1,
        action: 'Initial diagnosis and information gathering',
        estimatedTime: 15,
        requiredSkills: ['troubleshooting', 'communication'],
        riskLevel: 'low',
        dependencies: [],
        validationCriteria: ['Problem scope identified', 'Initial symptoms documented']
      },
      {
        step: 2,
        action: 'Implement primary resolution based on root cause analysis',
        estimatedTime: 60,
        requiredSkills: rootCauseAnalysis.recommendedActions || ['general-troubleshooting'],
        riskLevel: 'medium',
        dependencies: ['step-1'],
        validationCriteria: ['Solution applied', 'System functionality verified']
      }
    ];

    return {
      estimatedTime: resolutionSteps.reduce((total, step) => total + step.estimatedTime, 0),
      confidence: 0.75,
      complexity: this.determineComplexity(ticket),
      requiredSkills: rootCauseAnalysis.recommendedActions || ['general-troubleshooting'],
      recommendedTechnician: 'tech-001', // Would be determined by skill matching
      alternativeTechnicians: ['tech-002', 'tech-003'],
      resolutionSteps,
      riskFactors: [
        {
          type: 'technical',
          description: 'Potential system downtime during resolution',
          probability: 0.3,
          impact: 0.7,
          mitigation: 'Schedule during maintenance window'
        }
      ]
    };
  }

  private determineComplexity(ticket: TicketContext): ResolutionPrediction['complexity'] {
    if (ticket.priority === 'critical') return 'critical';
    if (ticket.tags.some(tag => ['security', 'network', 'database'].includes(tag))) return 'high';
    if (ticket.tags.some(tag => ['server', 'application'].includes(tag))) return 'medium';
    return 'low';
  }

  private async getClientContext(clientId: string): Promise<ClientContext> {
    // Mock client context - would be retrieved from client database
    return {
      clientId,
      clientName: 'Acme Corporation',
      tier: 'gold',
      slaLevel: '4-hour response, 24-hour resolution',
      historicalTicketVolume: 45,
      averageResolutionTime: 180,
      satisfactionScore: 4.2,
      criticalSystems: ['email-server', 'crm-system', 'file-server'],
      businessHours: {
        timezone: 'EST',
        weekdays: { start: '09:00', end: '17:00' },
        weekends: { start: '10:00', end: '14:00' },
        holidays: ['2024-12-25', '2024-01-01']
      },
      escalationContacts: [
        {
          name: 'John Smith',
          role: 'IT Manager',
          email: 'john.smith@acme.com',
          phone: '+1-555-0123',
          escalationLevel: 1
        }
      ],
      preferredCommunication: 'email'
    };
  }

  private async getTechnicalContext(ticket: TicketContext): Promise<TechnicalContext> {
    // Mock technical context - would be retrieved from monitoring systems
    return {
      affectedSystems: [
        {
          id: 'srv-001',
          name: 'Primary Web Server',
          type: 'server',
          status: 'warning',
          lastUpdate: new Date(),
          metrics: { cpu: 85, memory: 78, disk: 45 },
          dependencies: ['db-001', 'lb-001']
        }
      ],
      networkTopology: {
        subnets: ['192.168.1.0/24', '10.0.0.0/16'],
        vlans: [100, 200, 300],
        firewallRules: ['allow-http', 'allow-https', 'deny-all'],
        bandwidth: 1000,
        latency: 15
      },
      dependencies: [
        {
          from: 'web-server',
          to: 'database',
          type: 'application',
          criticality: 'high'
        }
      ],
      recentChanges: [
        {
          id: 'CHG-001',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'software',
          description: 'Updated web server configuration',
          implementedBy: 'admin-001',
          approvedBy: 'manager-001',
          rollbackPlan: 'Restore previous configuration from backup'
        }
      ],
      monitoringData: [
        {
          metric: 'cpu_usage',
          value: 85,
          threshold: 80,
          status: 'warning',
          timestamp: new Date()
        }
      ],
      configurationBaseline: [
        {
          id: 'cfg-001',
          name: 'Web Server Config',
          type: 'application',
          configuration: { maxConnections: 1000, timeout: 30 },
          lastModified: new Date(),
          version: '1.2.3'
        }
      ]
    };
  }

  private async assessBusinessImpact(ticket: TicketContext): Promise<BusinessImpact> {
    const impactLevel = this.calculateImpactLevel(ticket);
    
    return {
      impactLevel,
      affectedUsers: this.estimateAffectedUsers(ticket, impactLevel),
      affectedSystems: ticket.tags.filter(tag => tag.includes('server') || tag.includes('system')),
      businessProcesses: this.identifyAffectedProcesses(ticket),
      financialImpact: {
        estimatedCostPerHour: this.calculateCostPerHour(impactLevel),
        totalEstimatedCost: 0, // Will be calculated based on resolution time
        revenueAtRisk: this.calculateRevenueAtRisk(impactLevel),
        currency: 'USD'
      },
      reputationalRisk: this.assessReputationalRisk(ticket, impactLevel),
      complianceRisk: this.assessComplianceRisk(ticket)
    };
  }

  private calculateImpactLevel(ticket: TicketContext): BusinessImpact['impactLevel'] {
    if (ticket.priority === 'critical') return 'critical';
    if (ticket.priority === 'high') return 'high';
    if (ticket.tags.some(tag => ['server', 'network', 'security'].includes(tag))) return 'medium';
    return 'low';
  }

  private estimateAffectedUsers(ticket: TicketContext, impactLevel: BusinessImpact['impactLevel']): number {
    const baseUsers = {
      low: 5,
      medium: 25,
      high: 100,
      critical: 500
    };
    return baseUsers[impactLevel];
  }

  private identifyAffectedProcesses(ticket: TicketContext): string[] {
    const processes: string[] = [];
    
    if (ticket.tags.includes('email')) processes.push('Email Communication');
    if (ticket.tags.includes('crm')) processes.push('Customer Relationship Management');
    if (ticket.tags.includes('accounting')) processes.push('Financial Operations');
    if (ticket.tags.includes('hr')) processes.push('Human Resources');
    
    return processes;
  }

  private calculateCostPerHour(impactLevel: BusinessImpact['impactLevel']): number {
    const costs = {
      low: 100,
      medium: 500,
      high: 2000,
      critical: 10000
    };
    return costs[impactLevel];
  }

  private calculateRevenueAtRisk(impactLevel: BusinessImpact['impactLevel']): number {
    const revenue = {
      low: 0,
      medium: 1000,
      high: 10000,
      critical: 100000
    };
    return revenue[impactLevel];
  }

  private assessReputationalRisk(ticket: TicketContext, impactLevel: BusinessImpact['impactLevel']): number {
    let risk = 0;
    
    if (impactLevel === 'critical') risk += 8;
    else if (impactLevel === 'high') risk += 5;
    else if (impactLevel === 'medium') risk += 2;
    
    if (ticket.tags.includes('security')) risk += 3;
    if (ticket.tags.includes('customer-facing')) risk += 2;
    
    return Math.min(10, risk);
  }

  private assessComplianceRisk(ticket: TicketContext): ComplianceRisk[] {
    const risks: ComplianceRisk[] = [];
    
    if (ticket.tags.includes('security') || ticket.tags.includes('data')) {
      risks.push({
        framework: 'GDPR',
        riskLevel: 'high',
        requirements: ['Data Protection', 'Breach Notification'],
        deadline: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours
      });
    }
    
    if (ticket.tags.includes('financial') || ticket.tags.includes('audit')) {
      risks.push({
        framework: 'SOX',
        riskLevel: 'medium',
        requirements: ['Financial Controls', 'Audit Trail'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
    }
    
    return risks;
  }

  private async calculateEscalationRisk(ticket: TicketContext): Promise<EscalationRisk> {
    const factors: EscalationFactor[] = [
      {
        factor: 'ticket_age',
        weight: 0.3,
        currentValue: differenceInHours(new Date(), ticket.createdAt),
        threshold: 4
      },
      {
        factor: 'priority_level',
        weight: 0.4,
        currentValue: ticket.priority === 'critical' ? 4 : ticket.priority === 'high' ? 3 : 2,
        threshold: 3
      },
      {
        factor: 'client_tier',
        weight: 0.3,
        currentValue: 3, // Assuming gold tier
        threshold: 2
      }
    ];

    const riskScore = factors.reduce((score, factor) => {
      const riskContribution = (factor.currentValue / factor.threshold) * factor.weight * 100;
      return score + Math.min(100, riskContribution);
    }, 0);

    return {
      riskScore: Math.min(100, riskScore),
      factors,
      triggers: [
        {
          condition: 'ticket_age > 4_hours',
          threshold: 4,
          action: 'escalate_to_senior',
          notificationList: ['senior-tech@company.com']
        },
        {
          condition: 'no_response > 2_hours',
          threshold: 2,
          action: 'escalate_to_manager',
          notificationList: ['manager@company.com']
        }
      ],
      preventiveMeasures: [
        'Assign to experienced technician',
        'Set up automated status updates',
        'Schedule regular check-ins'
      ],
      escalationPath: [
        {
          level: 1,
          title: 'Senior Technician',
          contacts: [
            {
              name: 'Senior Tech',
              role: 'Senior Technician',
              email: 'senior@company.com',
              phone: '+1-555-0124',
              escalationLevel: 1
            }
          ],
          timeThreshold: 240, // 4 hours
          autoEscalate: true
        },
        {
          level: 2,
          title: 'Technical Manager',
          contacts: [
            {
              name: 'Tech Manager',
              role: 'Technical Manager',
              email: 'manager@company.com',
              phone: '+1-555-0125',
              escalationLevel: 2
            }
          ],
          timeThreshold: 480, // 8 hours
          autoEscalate: true
        }
      ]
    };
  }

  async generateIntelligentResolution(contextualTicket: ContextualTicket): Promise<string> {
    try {
      const context = {
        ticket: contextualTicket,
        semanticAnalysis: contextualTicket.semanticAnalysis,
        similarTickets: contextualTicket.similarTickets,
        technicalContext: contextualTicket.technicalContext,
        businessImpact: contextualTicket.businessImpact
      };

      const prompt = `
        Based on the following comprehensive ticket analysis, provide an intelligent resolution plan:
        
        Ticket: ${contextualTicket.title}
        Description: ${contextualTicket.description}
        Priority: ${contextualTicket.priority}
        
        Semantic Analysis:
        - Sentiment: ${contextualTicket.semanticAnalysis.sentiment.label} (${contextualTicket.semanticAnalysis.sentiment.score})
        - Technical Complexity: ${contextualTicket.semanticAnalysis.technicalComplexity}/10
        - Key Topics: ${contextualTicket.semanticAnalysis.topics.map(t => t.name).join(', ')}
        
        Similar Tickets Resolution Success:
        ${contextualTicket.similarTickets.map(st => `- ${st.resolution} (Success Rate: ${st.successRate * 100}%)`).join('\n')}
        
        Business Impact: ${contextualTicket.businessImpact.impactLevel}
        Affected Users: ${contextualTicket.businessImpact.affectedUsers}
        
        Provide a detailed, step-by-step resolution plan with:
        1. Immediate actions
        2. Root cause investigation steps
        3. Resolution implementation
        4. Validation and testing
        5. Prevention measures
      `;

      const response = await aiService.sendMessage([
        { role: 'user', content: prompt }
      ]);

      return response.content;
    } catch (error) {
      console.error('Error generating intelligent resolution:', error);
      return 'Unable to generate intelligent resolution. Please proceed with standard troubleshooting procedures.';
    }
  }
}

export default new DeepContextualTicketingService();