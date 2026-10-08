import { v4 as uuidv4 } from 'uuid';
import { subDays, differenceInMinutes } from 'date-fns';
import * as natural from 'natural';
import compromise from 'compromise';
import mlEngine, { TicketContext } from './mlEngine';
import aiService from './aiService';

// Core interfaces for Root Cause Analysis
export interface RootCauseAnalysis {
  id: string;
  ticketId: string;
  incidentId?: string;
  timestamp: Date;
  status: RCAStatus;
  confidence: number; // 0-1
  primaryCause: CauseHypothesis;
  contributingCauses: CauseHypothesis[];
  evidenceChain: Evidence[];
  impactAssessment: ImpactAssessment;
  recommendedActions: RecommendedAction[];
  preventionStrategies: PreventionStrategy[];
  metadata: RCAMetadata;
  learningData: RCALearningData;
}

export type RCAStatus = 
  | 'analyzing' 
  | 'hypothesis_generated' 
  | 'evidence_gathering' 
  | 'validation' 
  | 'completed' 
  | 'inconclusive' 
  | 'requires_human_review';

export interface CauseHypothesis {
  id: string;
  category: CauseCategory;
  description: string;
  likelihood: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeframe: TimeFrame;
  affectedSystems: string[];
  rootCauseChain: string[];
  supportingEvidence: string[];
  contradictingEvidence: string[];
  similarIncidents: string[];
  confidenceFactors: ConfidenceFactor[];
}

export type CauseCategory = 
  | 'hardware_failure' 
  | 'software_bug' 
  | 'configuration_error' 
  | 'network_issue' 
  | 'security_breach' 
  | 'capacity_overload' 
  | 'human_error' 
  | 'external_dependency' 
  | 'environmental_factor' 
  | 'process_failure';

export interface TimeFrame {
  estimatedStart: Date;
  detectionTime: Date;
  escalationTime?: Date;
  resolutionTime?: Date;
  duration: number; // minutes
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  source: string;
  timestamp: Date;
  content: string;
  relevanceScore: number; // 0-1
  reliability: number; // 0-1
  correlationStrength: number; // 0-1
  metadata: Record<string, any>;
  analysisResults: AnalysisResult[];
}

export type EvidenceType = 
  | 'log_entry' 
  | 'metric_anomaly' 
  | 'alert_correlation' 
  | 'user_report' 
  | 'system_event' 
  | 'configuration_change' 
  | 'deployment_event' 
  | 'external_event' 
  | 'historical_pattern';

export interface AnalysisResult {
  analyzer: string;
  result: any;
  confidence: number;
  processingTime: number;
  metadata: Record<string, any>;
}

export interface ImpactAssessment {
  businessImpact: BusinessImpact;
  technicalImpact: TechnicalImpact;
  userImpact: UserImpact;
  financialImpact: FinancialImpact;
  reputationalImpact: ReputationalImpact;
  overallSeverity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BusinessImpact {
  affectedServices: string[];
  downtime: number; // minutes
  degradedPerformance: number; // percentage
  affectedUsers: number;
  lostTransactions: number;
  complianceViolations: string[];
  slaBreaches: string[];
}

export interface TechnicalImpact {
  affectedSystems: string[];
  cascadingFailures: string[];
  dataIntegrity: 'intact' | 'compromised' | 'lost';
  securityImplications: string[];
  recoveryComplexity: 'simple' | 'moderate' | 'complex' | 'critical';
}

export interface UserImpact {
  totalAffectedUsers: number;
  criticalUsers: number;
  userExperienceScore: number; // 1-10
  supportTicketsGenerated: number;
  userSatisfactionImpact: number; // -100 to 100
}

export interface FinancialImpact {
  directCosts: number;
  indirectCosts: number;
  lostRevenue: number;
  penaltyCosts: number;
  recoveryInvestment: number;
  totalEstimatedCost: number;
}

export interface ReputationalImpact {
  mediaAttention: 'none' | 'minimal' | 'moderate' | 'significant';
  socialMediaSentiment: number; // -1 to 1
  customerTrustImpact: number; // -100 to 100
  brandValueImpact: number; // -100 to 100
}

export interface RecommendedAction {
  id: string;
  type: ActionType;
  priority: 'immediate' | 'urgent' | 'high' | 'medium' | 'low';
  description: string;
  expectedOutcome: string;
  estimatedEffort: number; // hours
  requiredSkills: string[];
  dependencies: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  successCriteria: string[];
  rollbackPlan?: string;
}

export type ActionType = 
  | 'immediate_fix' 
  | 'workaround' 
  | 'investigation' 
  | 'monitoring' 
  | 'communication' 
  | 'escalation' 
  | 'prevention' 
  | 'documentation';

export interface PreventionStrategy {
  id: string;
  category: PreventionCategory;
  description: string;
  implementationPlan: string;
  estimatedCost: number;
  expectedROI: number;
  timeToImplement: number; // days
  preventionEffectiveness: number; // 0-1
  applicableScenarios: string[];
}

export type PreventionCategory = 
  | 'monitoring_enhancement' 
  | 'process_improvement' 
  | 'technology_upgrade' 
  | 'training_program' 
  | 'policy_change' 
  | 'automation' 
  | 'redundancy' 
  | 'testing_enhancement';

export interface ConfidenceFactor {
  factor: string;
  weight: number; // 0-1
  value: number; // 0-1
  reasoning: string;
}

export interface RCAMetadata {
  analyst: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  reviewStatus: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: Date;
  tags: string[];
  relatedIncidents: string[];
  estimatedAnalysisTime: number; // minutes
  actualAnalysisTime: number; // minutes
}

export interface RCALearningData {
  patternMatches: PatternMatch[];
  modelPredictions: ModelPrediction[];
  historicalComparisons: HistoricalComparison[];
  expertValidations: ExpertValidation[];
  outcomeTracking: OutcomeTracking;
}

export interface PatternMatch {
  patternId: string;
  matchStrength: number; // 0-1
  patternType: 'temporal' | 'causal' | 'correlation' | 'sequence';
  description: string;
  historicalOccurrences: number;
  lastOccurrence: Date;
}

export interface ModelPrediction {
  modelName: string;
  prediction: any;
  confidence: number;
  features: Record<string, number>;
  explanation: string;
}

export interface HistoricalComparison {
  incidentId: string;
  similarity: number; // 0-1
  commonFactors: string[];
  differentiatingFactors: string[];
  outcomeComparison: string;
}

export interface ExpertValidation {
  expertId: string;
  validationDate: Date;
  accuracy: number; // 0-1
  feedback: string;
  corrections: string[];
  confidence: number; // 0-1
}

export interface OutcomeTracking {
  recommendationAccuracy: number; // 0-1
  preventionEffectiveness: number; // 0-1
  timeToResolution: number; // minutes
  customerSatisfaction: number; // 1-5
  costEffectiveness: number; // ROI
}

export interface IncidentContext {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  affectedSystems: string[];
  reportedBy: string;
  reportedAt: Date;
  symptoms: string[];
  initialDiagnosis?: string;
  relatedTickets: string[];
  environmentInfo: EnvironmentInfo;
  timelineEvents: TimelineEvent[];
}

export interface EnvironmentInfo {
  environment: 'production' | 'staging' | 'development';
  region: string;
  infrastructure: string[];
  versions: Record<string, string>;
  configurations: Record<string, any>;
  dependencies: string[];
}

export interface TimelineEvent {
  timestamp: Date;
  event: string;
  source: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details: Record<string, any>;
}

class RootCauseAnalysisService {
  private analyses: Map<string, RootCauseAnalysis> = new Map();
  private patterns: Map<string, CausePattern> = new Map();
  private knowledgeBase: KnowledgeBase = new KnowledgeBase();
  private stemmer = natural.PorterStemmer;
  private tfidf = new natural.TfIdf();

  constructor() {
    this.initializePatterns();
    this.initializeKnowledgeBase();
  }

  private initializePatterns(): void {
    // Initialize common failure patterns
    const patterns: CausePattern[] = [
      {
        id: 'memory-leak-pattern',
        name: 'Memory Leak Pattern',
        category: 'software_bug',
        indicators: ['increasing memory usage', 'gradual performance degradation', 'eventual crash'],
        timeSignature: 'gradual_increase',
        commonCauses: ['unclosed resources', 'circular references', 'cache overflow'],
        diagnosticSteps: ['memory profiling', 'heap dump analysis', 'code review'],
        confidence: 0.85
      },
      {
        id: 'cascade-failure-pattern',
        name: 'Cascade Failure Pattern',
        category: 'capacity_overload',
        indicators: ['multiple service failures', 'rapid failure propagation', 'timeout errors'],
        timeSignature: 'rapid_spread',
        commonCauses: ['insufficient circuit breakers', 'resource exhaustion', 'dependency chains'],
        diagnosticSteps: ['dependency mapping', 'load analysis', 'circuit breaker review'],
        confidence: 0.90
      },
      {
        id: 'configuration-drift-pattern',
        name: 'Configuration Drift Pattern',
        category: 'configuration_error',
        indicators: ['inconsistent behavior', 'environment-specific issues', 'recent deployments'],
        timeSignature: 'sudden_onset',
        commonCauses: ['manual configuration changes', 'deployment errors', 'version mismatches'],
        diagnosticSteps: ['configuration comparison', 'deployment history review', 'version audit'],
        confidence: 0.80
      }
    ];

    patterns.forEach(pattern => this.patterns.set(pattern.id, pattern));
  }

  private initializeKnowledgeBase(): void {
    // Initialize with common IT knowledge
    this.knowledgeBase.addKnowledge('database', [
      'connection pool exhaustion leads to timeout errors',
      'deadlocks cause transaction failures',
      'index fragmentation degrades query performance',
      'log file growth can cause disk space issues'
    ]);

    this.knowledgeBase.addKnowledge('network', [
      'DNS resolution failures cause connectivity issues',
      'bandwidth saturation leads to packet loss',
      'firewall changes can block legitimate traffic',
      'routing table corruption causes intermittent failures'
    ]);

    this.knowledgeBase.addKnowledge('application', [
      'memory leaks cause gradual performance degradation',
      'thread pool exhaustion leads to request queuing',
      'cache invalidation issues cause data inconsistency',
      'session management problems affect user experience'
    ]);
  }

  async analyzeIncident(incident: IncidentContext): Promise<string> {
    const analysisId = uuidv4();
    
    const analysis: RootCauseAnalysis = {
      id: analysisId,
      ticketId: incident.id,
      timestamp: new Date(),
      status: 'analyzing',
      confidence: 0,
      primaryCause: {} as CauseHypothesis,
      contributingCauses: [],
      evidenceChain: [],
      impactAssessment: {} as ImpactAssessment,
      recommendedActions: [],
      preventionStrategies: [],
      metadata: {
        analyst: 'AI System',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0',
        reviewStatus: 'pending',
        tags: [],
        relatedIncidents: [],
        estimatedAnalysisTime: 0,
        actualAnalysisTime: 0
      },
      learningData: {
        patternMatches: [],
        modelPredictions: [],
        historicalComparisons: [],
        expertValidations: [],
        outcomeTracking: {} as OutcomeTracking
      }
    };

    this.analyses.set(analysisId, analysis);

    try {
      // Step 1: Gather and analyze evidence
      analysis.status = 'evidence_gathering';
      await this.gatherEvidence(analysis, incident);

      // Step 2: Generate hypotheses
      analysis.status = 'hypothesis_generated';
      await this.generateHypotheses(analysis, incident);

      // Step 3: Validate hypotheses
      analysis.status = 'validation';
      await this.validateHypotheses(analysis, incident);

      // Step 4: Assess impact
      await this.assessImpact(analysis, incident);

      // Step 5: Generate recommendations
      await this.generateRecommendations(analysis, incident);

      // Step 6: Create prevention strategies
      await this.createPreventionStrategies(analysis, incident);

      analysis.status = 'completed';
      analysis.metadata.actualAnalysisTime = differenceInMinutes(new Date(), analysis.timestamp);

    } catch (error) {
      console.error('RCA analysis failed:', error);
      analysis.status = 'requires_human_review';
    }

    analysis.metadata.updatedAt = new Date();
    return analysisId;
  }

  private async gatherEvidence(analysis: RootCauseAnalysis, incident: IncidentContext): Promise<void> {
    const evidence: Evidence[] = [];

    // Analyze timeline events
    for (const event of incident.timelineEvents) {
      const eventEvidence: Evidence = {
        id: uuidv4(),
        type: 'system_event',
        source: event.source,
        timestamp: event.timestamp,
        content: event.event,
        relevanceScore: this.calculateRelevanceScore(event, incident),
        reliability: 0.8,
        correlationStrength: 0,
        metadata: event.details,
        analysisResults: []
      };

      // Analyze event content using NLP
      const nlpAnalysis = await this.analyzeTextContent(event.event);
      eventEvidence.analysisResults.push({
        analyzer: 'nlp',
        result: nlpAnalysis,
        confidence: nlpAnalysis.confidence,
        processingTime: 100,
        metadata: {}
      });

      evidence.push(eventEvidence);
    }

    // Gather log evidence (simulated)
    const logEvidence = await this.gatherLogEvidence(incident);
    evidence.push(...logEvidence);

    // Gather metric evidence (simulated)
    const metricEvidence = await this.gatherMetricEvidence(incident);
    evidence.push(...metricEvidence);

    // Calculate correlations between evidence
    this.calculateEvidenceCorrelations(evidence);

    analysis.evidenceChain = evidence.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private async analyzeTextContent(text: string): Promise<any> {
    // Use compromise for NLP analysis
    const doc = compromise(text);
    
    // Extract entities
    const entities = {
      people: doc.people().out('array'),
      places: doc.places().out('array'),
      organizations: doc.organizations().out('array'),
      topics: doc.topics().out('array')
    };

    // Sentiment analysis using natural
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
    const stemmedTokens = tokens.map((token: string) => this.stemmer.stem(token));
    
    // Simple sentiment scoring
    const positiveWords = ['success', 'working', 'resolved', 'fixed', 'stable'];
    const negativeWords = ['error', 'failure', 'crash', 'timeout', 'down', 'failed'];
    
    let sentiment = 0;
    stemmedTokens.forEach((token: string) => {
      if (positiveWords.some(word => this.stemmer.stem(word) === token)) sentiment += 1;
      if (negativeWords.some(word => this.stemmer.stem(word) === token)) sentiment -= 1;
    });

    // Extract technical terms
    const technicalTerms = this.extractTechnicalTerms(text);

    return {
      entities,
      sentiment: sentiment / Math.max(tokens.length, 1),
      technicalTerms,
      keyPhrases: doc.match('#Noun+ #Verb+').out('array'),
      confidence: 0.7
    };
  }

  private extractTechnicalTerms(text: string): string[] {
    const technicalPatterns = [
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses
      /\b[A-Z]{2,}\b/g, // Acronyms
      /\b\w+\.\w+\.\w+\b/g, // Dotted notation (like Java packages)
      /\b\w+:\d+\b/g, // Port numbers
      /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g // UUIDs
    ];

    const terms: string[] = [];
    technicalPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) terms.push(...matches);
    });

    return [...new Set(terms)]; // Remove duplicates
  }

  private calculateRelevanceScore(event: TimelineEvent, incident: IncidentContext): number {
    let score = 0.5; // Base score

    // Time proximity to incident
    const timeDiff = Math.abs(differenceInMinutes(event.timestamp, incident.reportedAt));
    if (timeDiff < 30) score += 0.3;
    else if (timeDiff < 120) score += 0.2;
    else if (timeDiff < 480) score += 0.1;

    // Severity alignment
    if (event.severity === 'critical' && incident.severity === 'critical') score += 0.2;
    else if (event.severity === 'error') score += 0.15;
    else if (event.severity === 'warning') score += 0.1;

    // System overlap
    const systemOverlap = incident.affectedSystems.some(system => 
      event.source.toLowerCase().includes(system.toLowerCase())
    );
    if (systemOverlap) score += 0.2;

    return Math.min(score, 1.0);
  }

  private async gatherLogEvidence(incident: IncidentContext): Promise<Evidence[]> {
    // Simulate log evidence gathering
    const logEvidence: Evidence[] = [];
    
    // Mock log entries based on incident type
    const mockLogs = [
      'Connection timeout to database server',
      'Memory usage exceeded 90% threshold',
      'Failed to authenticate user session',
      'Service dependency unavailable',
      'Configuration validation failed'
    ];

    for (let i = 0; i < Math.min(mockLogs.length, 3); i++) {
      const evidence: Evidence = {
        id: uuidv4(),
        type: 'log_entry',
        source: 'application_logs',
        timestamp: new Date(incident.reportedAt.getTime() - (i * 60000)),
        content: mockLogs[i],
        relevanceScore: 0.8 - (i * 0.1),
        reliability: 0.9,
        correlationStrength: 0,
        metadata: { logLevel: 'ERROR', component: 'core-service' },
        analysisResults: []
      };

      const nlpAnalysis = await this.analyzeTextContent(evidence.content);
      evidence.analysisResults.push({
        analyzer: 'log_parser',
        result: nlpAnalysis,
        confidence: 0.8,
        processingTime: 50,
        metadata: {}
      });

      logEvidence.push(evidence);
    }

    return logEvidence;
  }

  private async gatherMetricEvidence(incident: IncidentContext): Promise<Evidence[]> {
    // Simulate metric evidence gathering
    const metricEvidence: Evidence[] = [];
    
    const mockMetrics = [
      { name: 'cpu_usage', value: 95, threshold: 80, unit: '%' },
      { name: 'memory_usage', value: 88, threshold: 85, unit: '%' },
      { name: 'response_time', value: 5000, threshold: 1000, unit: 'ms' },
      { name: 'error_rate', value: 15, threshold: 5, unit: '%' }
    ];

    for (const metric of mockMetrics) {
      if (metric.value > metric.threshold) {
        const evidence: Evidence = {
          id: uuidv4(),
          type: 'metric_anomaly',
          source: 'monitoring_system',
          timestamp: new Date(incident.reportedAt.getTime() - 300000), // 5 minutes before
          content: `${metric.name} exceeded threshold: ${metric.value}${metric.unit} > ${metric.threshold}${metric.unit}`,
          relevanceScore: (metric.value - metric.threshold) / metric.threshold,
          reliability: 0.95,
          correlationStrength: 0,
          metadata: { metric: metric.name, value: metric.value, threshold: metric.threshold },
          analysisResults: []
        };

        evidence.analysisResults.push({
          analyzer: 'anomaly_detector',
          result: { anomalyScore: evidence.relevanceScore, trend: 'increasing' },
          confidence: 0.9,
          processingTime: 25,
          metadata: {}
        });

        metricEvidence.push(evidence);
      }
    }

    return metricEvidence;
  }

  private calculateEvidenceCorrelations(evidence: Evidence[]): void {
    // Calculate correlations between evidence items
    for (let i = 0; i < evidence.length; i++) {
      for (let j = i + 1; j < evidence.length; j++) {
        const correlation = this.calculateCorrelation(evidence[i], evidence[j]);
        evidence[i].correlationStrength = Math.max(evidence[i].correlationStrength, correlation);
        evidence[j].correlationStrength = Math.max(evidence[j].correlationStrength, correlation);
      }
    }
  }

  private calculateCorrelation(evidence1: Evidence, evidence2: Evidence): number {
    let correlation = 0;

    // Time correlation
    const timeDiff = Math.abs(differenceInMinutes(evidence1.timestamp, evidence2.timestamp));
    if (timeDiff < 5) correlation += 0.3;
    else if (timeDiff < 15) correlation += 0.2;
    else if (timeDiff < 60) correlation += 0.1;

    // Source correlation
    if (evidence1.source === evidence2.source) correlation += 0.2;

    // Content similarity (simple keyword matching)
    const words1 = evidence1.content.toLowerCase().split(/\s+/);
    const words2 = evidence2.content.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    const similarity = commonWords.length / Math.max(words1.length, words2.length);
    correlation += similarity * 0.3;

    return Math.min(correlation, 1.0);
  }

  private async generateHypotheses(analysis: RootCauseAnalysis, incident: IncidentContext): Promise<void> {
    const hypotheses: CauseHypothesis[] = [];

    // Pattern-based hypothesis generation
    const patternMatches = this.matchPatterns(analysis.evidenceChain, incident);
    analysis.learningData.patternMatches = patternMatches;

    for (const match of patternMatches) {
      const pattern = this.patterns.get(match.patternId);
      if (pattern) {
        const hypothesis: CauseHypothesis = {
          id: uuidv4(),
          category: pattern.category,
          description: `${pattern.name}: ${pattern.commonCauses.join(', ')}`,
          likelihood: match.matchStrength * pattern.confidence,
          severity: incident.severity,
          timeframe: {
            estimatedStart: new Date(incident.reportedAt.getTime() - 3600000), // 1 hour before
            detectionTime: incident.reportedAt,
            duration: 0
          },
          affectedSystems: incident.affectedSystems,
          rootCauseChain: pattern.commonCauses,
          supportingEvidence: analysis.evidenceChain
            .filter(e => e.relevanceScore > 0.6)
            .map(e => e.content),
          contradictingEvidence: [],
          similarIncidents: [],
          confidenceFactors: [
            {
              factor: 'pattern_match',
              weight: 0.4,
              value: match.matchStrength,
              reasoning: `Matches known pattern: ${pattern.name}`
            },
            {
              factor: 'evidence_quality',
              weight: 0.3,
              value: this.calculateEvidenceQuality(analysis.evidenceChain),
              reasoning: 'Based on evidence reliability and relevance'
            }
          ]
        };

        hypotheses.push(hypothesis);
      }
    }

    // AI-based hypothesis generation
    const aiHypotheses = await this.generateAIHypotheses(analysis, incident);
    hypotheses.push(...aiHypotheses);

    // ML-based hypothesis generation
    const mlHypotheses = await this.generateMLHypotheses(analysis, incident);
    hypotheses.push(...mlHypotheses);

    // Sort by likelihood and select top hypotheses
    hypotheses.sort((a, b) => b.likelihood - a.likelihood);
    
    analysis.primaryCause = hypotheses[0] || this.createFallbackHypothesis(incident);
    analysis.contributingCauses = hypotheses.slice(1, 4); // Top 3 contributing causes
    analysis.confidence = analysis.primaryCause.likelihood;
  }

  private matchPatterns(evidence: Evidence[], incident: IncidentContext): PatternMatch[] {
    const matches: PatternMatch[] = [];

    for (const [patternId, pattern] of this.patterns) {
      let matchStrength = 0;
      let matchedIndicators = 0;

      // Check if evidence matches pattern indicators
      for (const indicator of pattern.indicators) {
        const indicatorFound = evidence.some(e => 
          e.content.toLowerCase().includes(indicator.toLowerCase()) ||
          e.analysisResults.some(ar => 
            JSON.stringify(ar.result).toLowerCase().includes(indicator.toLowerCase())
          )
        );

        if (indicatorFound) {
          matchedIndicators++;
          matchStrength += 1 / pattern.indicators.length;
        }
      }

      if (matchStrength > 0.3) { // Minimum threshold for pattern match
        matches.push({
          patternId,
          matchStrength,
          patternType: 'causal',
          description: `Pattern "${pattern.name}" matched with ${matchedIndicators}/${pattern.indicators.length} indicators`,
          historicalOccurrences: Math.floor(Math.random() * 50) + 10, // Mock data
          lastOccurrence: subDays(new Date(), Math.floor(Math.random() * 30))
        });
      }
    }

    return matches.sort((a, b) => b.matchStrength - a.matchStrength);
  }

  private calculateEvidenceQuality(evidence: Evidence[]): number {
    if (evidence.length === 0) return 0;

    const avgReliability = evidence.reduce((sum, e) => sum + e.reliability, 0) / evidence.length;
    const avgRelevance = evidence.reduce((sum, e) => sum + e.relevanceScore, 0) / evidence.length;
    const diversityScore = new Set(evidence.map(e => e.type)).size / 5; // Normalize by max evidence types

    return (avgReliability * 0.4 + avgRelevance * 0.4 + diversityScore * 0.2);
  }

  private async generateAIHypotheses(analysis: RootCauseAnalysis, incident: IncidentContext): Promise<CauseHypothesis[]> {
    try {
      const prompt = `
        Analyze this IT incident and generate root cause hypotheses:
        
        Incident: ${incident.title}
        Description: ${incident.description}
        Severity: ${incident.severity}
        Affected Systems: ${incident.affectedSystems.join(', ')}
        
        Evidence:
        ${analysis.evidenceChain.slice(0, 5).map(e => `- ${e.content} (${e.type})`).join('\n')}
        
        Generate 2-3 most likely root cause hypotheses with:
        1. Category (hardware_failure, software_bug, configuration_error, etc.)
        2. Description
        3. Likelihood (0-1)
        4. Root cause chain
        5. Supporting reasoning
        
        Format as JSON array.
      `;

      const response = await aiService.sendMessage([
        { role: 'user', content: prompt }
      ]);

      const aiHypotheses = JSON.parse(response.content);
      
      return aiHypotheses.map((h: any) => ({
        id: uuidv4(),
        category: h.category || 'software_bug',
        description: h.description || 'AI-generated hypothesis',
        likelihood: h.likelihood || 0.5,
        severity: incident.severity,
        timeframe: {
          estimatedStart: new Date(incident.reportedAt.getTime() - 3600000),
          detectionTime: incident.reportedAt,
          duration: 0
        },
        affectedSystems: incident.affectedSystems,
        rootCauseChain: h.rootCauseChain || ['unknown'],
        supportingEvidence: h.supportingEvidence || [],
        contradictingEvidence: [],
        similarIncidents: [],
        confidenceFactors: [
          {
            factor: 'ai_analysis',
            weight: 0.6,
            value: h.likelihood || 0.5,
            reasoning: h.reasoning || 'AI-based analysis'
          }
        ]
      }));

    } catch (error) {
      console.error('AI hypothesis generation failed:', error);
      return [];
    }
  }

  private async generateMLHypotheses(analysis: RootCauseAnalysis, incident: IncidentContext): Promise<CauseHypothesis[]> {
    try {
      // Use ML engine for hypothesis generation
      const ticketContext: TicketContext = {
        id: incident.id,
        title: incident.title,
        description: incident.description,
        category: incident.category,
        priority: incident.severity,
        tags: [incident.category, ...incident.affectedSystems],
        clientId: 'system',
        assignedTo: 'ai-system',
        createdAt: incident.reportedAt,
        updatedAt: new Date(),
        status: 'analyzing',
        metadata: {
          affectedSystems: incident.affectedSystems,
          environmentInfo: incident.environmentInfo
        }
      };

      const rootCauseAnalysis = await mlEngine.performRootCauseAnalysis(ticketContext);
      
      const hypothesis: CauseHypothesis = {
        id: uuidv4(),
        category: this.mapCategoryFromML(rootCauseAnalysis.rootCause),
        description: rootCauseAnalysis.rootCause,
        likelihood: rootCauseAnalysis.confidence,
        severity: incident.severity,
        timeframe: {
          estimatedStart: new Date(incident.reportedAt.getTime() - 3600000),
          detectionTime: incident.reportedAt,
          duration: 0
        },
        affectedSystems: incident.affectedSystems,
        rootCauseChain: rootCauseAnalysis.contributingFactors,
        supportingEvidence: rootCauseAnalysis.recommendedActions,
        contradictingEvidence: [],
        similarIncidents: rootCauseAnalysis.similarIncidents,
        confidenceFactors: [
          {
            factor: 'ml_model',
            weight: 0.5,
            value: rootCauseAnalysis.confidence,
            reasoning: 'Machine learning model prediction'
          }
        ]
      };

      analysis.learningData.modelPredictions.push({
        modelName: 'root_cause_classifier',
        prediction: rootCauseAnalysis,
        confidence: rootCauseAnalysis.confidence,
        features: {},
        explanation: rootCauseAnalysis.description
      });

      return [hypothesis];

    } catch (error) {
      console.error('ML hypothesis generation failed:', error);
      return [];
    }
  }

  private mapCategoryFromML(mlCategory: string): CauseCategory {
    const categoryMap: Record<string, CauseCategory> = {
      'technical': 'software_bug',
      'infrastructure': 'hardware_failure',
      'configuration': 'configuration_error',
      'network': 'network_issue',
      'security': 'security_breach',
      'performance': 'capacity_overload',
      'user': 'human_error',
      'external': 'external_dependency'
    };

    return categoryMap[mlCategory.toLowerCase()] || 'software_bug';
  }

  private createFallbackHypothesis(incident: IncidentContext): CauseHypothesis {
    return {
      id: uuidv4(),
      category: 'software_bug',
      description: 'Generic software issue requiring investigation',
      likelihood: 0.3,
      severity: incident.severity,
      timeframe: {
        estimatedStart: new Date(incident.reportedAt.getTime() - 3600000),
        detectionTime: incident.reportedAt,
        duration: 0
      },
      affectedSystems: incident.affectedSystems,
      rootCauseChain: ['unknown cause'],
      supportingEvidence: ['incident reported'],
      contradictingEvidence: [],
      similarIncidents: [],
      confidenceFactors: [
        {
          factor: 'fallback',
          weight: 1.0,
          value: 0.3,
          reasoning: 'Fallback hypothesis when analysis is inconclusive'
        }
      ]
    };
  }

  private async validateHypotheses(analysis: RootCauseAnalysis, incident: IncidentContext): Promise<void> {
    // Validate primary hypothesis
    await this.validateHypothesis(analysis.primaryCause, analysis, incident);
    
    // Validate contributing causes
    for (const hypothesis of analysis.contributingCauses) {
      await this.validateHypothesis(hypothesis, analysis, incident);
    }

    // Update overall confidence based on validation results
    const validationScores = [analysis.primaryCause, ...analysis.contributingCauses]
      .map(h => h.confidenceFactors.reduce((sum, cf) => sum + (cf.weight * cf.value), 0));
    
    analysis.confidence = validationScores.length > 0 ? 
      validationScores.reduce((sum, score) => sum + score, 0) / validationScores.length : 0.3;
  }

  private async validateHypothesis(hypothesis: CauseHypothesis, analysis: RootCauseAnalysis, incident: IncidentContext): Promise<void> {
    // Knowledge base validation
    const knowledgeValidation = this.knowledgeBase.validate(hypothesis.category, hypothesis.description);
    hypothesis.confidenceFactors.push({
      factor: 'knowledge_base',
      weight: 0.2,
      value: knowledgeValidation.confidence,
      reasoning: knowledgeValidation.reasoning
    });

    // Historical incident comparison
    const historicalComparisons = await this.findSimilarIncidents(incident);
    analysis.learningData.historicalComparisons = historicalComparisons;

    if (historicalComparisons.length > 0) {
      const avgSimilarity = historicalComparisons.reduce((sum, comp) => sum + comp.similarity, 0) / historicalComparisons.length;
      hypothesis.confidenceFactors.push({
        factor: 'historical_similarity',
        weight: 0.3,
        value: avgSimilarity,
        reasoning: `Found ${historicalComparisons.length} similar incidents`
      });
    }

    // Evidence consistency check
    const evidenceConsistency = this.checkEvidenceConsistency(hypothesis, analysis.evidenceChain);
    hypothesis.confidenceFactors.push({
      factor: 'evidence_consistency',
      weight: 0.4,
      value: evidenceConsistency,
      reasoning: 'Evidence supports hypothesis'
    });

    // Update likelihood based on validation
    const totalWeight = hypothesis.confidenceFactors.reduce((sum, cf) => sum + cf.weight, 0);
    const weightedScore = hypothesis.confidenceFactors.reduce((sum, cf) => sum + (cf.weight * cf.value), 0);
    hypothesis.likelihood = totalWeight > 0 ? weightedScore / totalWeight : hypothesis.likelihood;
  }

  private checkEvidenceConsistency(hypothesis: CauseHypothesis, evidence: Evidence[]): number {
    let consistencyScore = 0;
    let relevantEvidence = 0;

    for (const evidenceItem of evidence) {
      // Check if evidence supports the hypothesis
      const supports = hypothesis.rootCauseChain.some(cause => 
        evidenceItem.content.toLowerCase().includes(cause.toLowerCase())
      ) || hypothesis.supportingEvidence.some(support => 
        evidenceItem.content.toLowerCase().includes(support.toLowerCase())
      );

      if (supports) {
        consistencyScore += evidenceItem.relevanceScore * evidenceItem.reliability;
        relevantEvidence++;
      }
    }

    return relevantEvidence > 0 ? consistencyScore / relevantEvidence : 0.5;
  }

  private async findSimilarIncidents(incident: IncidentContext): Promise<HistoricalComparison[]> {
    // Mock historical incident comparison
    const mockComparisons: HistoricalComparison[] = [
      {
        incidentId: 'INC-2024-001',
        similarity: 0.85,
        commonFactors: ['database timeout', 'high CPU usage', 'memory leak'],
        differentiatingFactors: ['different time of day', 'different user load'],
        outcomeComparison: 'Resolved by restarting database service and applying memory patch'
      },
      {
        incidentId: 'INC-2024-002',
        similarity: 0.72,
        commonFactors: ['service unavailable', 'timeout errors'],
        differentiatingFactors: ['different affected systems', 'different error patterns'],
        outcomeComparison: 'Resolved by scaling resources and updating configuration'
      }
    ];

    return mockComparisons;
  }

  private async assessImpact(analysis: RootCauseAnalysis, incident: IncidentContext): Promise<void> {
    const impact: ImpactAssessment = {
      businessImpact: {
        affectedServices: incident.affectedSystems,
        downtime: this.estimateDowntime(incident),
        degradedPerformance: this.estimatePerformanceDegradation(incident),
        affectedUsers: this.estimateAffectedUsers(incident),
        lostTransactions: this.estimateLostTransactions(incident),
        complianceViolations: this.identifyComplianceViolations(incident),
        slaBreaches: this.identifySLABreaches(incident)
      },
      technicalImpact: {
        affectedSystems: incident.affectedSystems,
        cascadingFailures: this.identifyCascadingFailures(incident),
        dataIntegrity: this.assessDataIntegrity(incident),
        securityImplications: this.assessSecurityImplications(incident),
        recoveryComplexity: this.assessRecoveryComplexity(incident)
      },
      userImpact: {
        totalAffectedUsers: this.estimateAffectedUsers(incident),
        criticalUsers: this.estimateCriticalUsers(incident),
        userExperienceScore: this.calculateUserExperienceScore(incident),
        supportTicketsGenerated: this.estimateSupportTickets(incident),
        userSatisfactionImpact: this.estimateUserSatisfactionImpact(incident)
      },
      financialImpact: {
        directCosts: this.calculateDirectCosts(incident),
        indirectCosts: this.calculateIndirectCosts(incident),
        lostRevenue: this.calculateLostRevenue(incident),
        penaltyCosts: this.calculatePenaltyCosts(incident),
        recoveryInvestment: this.calculateRecoveryInvestment(incident),
        totalEstimatedCost: 0
      },
      reputationalImpact: {
        mediaAttention: this.assessMediaAttention(incident),
        socialMediaSentiment: this.assessSocialMediaSentiment(incident),
        customerTrustImpact: this.assessCustomerTrustImpact(incident),
        brandValueImpact: this.assessBrandValueImpact(incident)
      },
      overallSeverity: incident.severity
    };

    // Calculate total financial impact
    impact.financialImpact.totalEstimatedCost = 
      impact.financialImpact.directCosts +
      impact.financialImpact.indirectCosts +
      impact.financialImpact.lostRevenue +
      impact.financialImpact.penaltyCosts +
      impact.financialImpact.recoveryInvestment;

    analysis.impactAssessment = impact;
  }

  // Impact assessment helper methods (simplified implementations)
  private estimateDowntime(incident: IncidentContext): number {
    const severityMultiplier = { low: 30, medium: 120, high: 480, critical: 1440 };
    return severityMultiplier[incident.severity] || 60;
  }

  private estimatePerformanceDegradation(incident: IncidentContext): number {
    const severityMultiplier = { low: 10, medium: 30, high: 60, critical: 90 };
    return severityMultiplier[incident.severity] || 20;
  }

  private estimateAffectedUsers(incident: IncidentContext): number {
    const systemMultiplier = incident.affectedSystems.length * 1000;
    const severityMultiplier = { low: 0.1, medium: 0.3, high: 0.7, critical: 1.0 };
    return Math.floor(systemMultiplier * (severityMultiplier[incident.severity] || 0.5));
  }

  private estimateLostTransactions(incident: IncidentContext): number {
    return Math.floor(this.estimateAffectedUsers(incident) * 0.1);
  }

  private identifyComplianceViolations(incident: IncidentContext): string[] {
    const violations: string[] = [];
    if (incident.severity === 'critical') {
      violations.push('SLA-001: Maximum downtime exceeded');
    }
    if (incident.affectedSystems.some(s => s.includes('database'))) {
      violations.push('DATA-001: Data availability requirements not met');
    }
    return violations;
  }

  private identifySLABreaches(incident: IncidentContext): string[] {
    const breaches: string[] = [];
    if (incident.severity === 'high' || incident.severity === 'critical') {
      breaches.push('Response time SLA breach');
      breaches.push('Availability SLA breach');
    }
    return breaches;
  }

  private identifyCascadingFailures(incident: IncidentContext): string[] {
    return incident.affectedSystems.length > 2 ? 
      ['Service dependency chain failure', 'Load balancer impact'] : [];
  }

  private assessDataIntegrity(incident: IncidentContext): 'intact' | 'compromised' | 'lost' {
    if (incident.affectedSystems.some(s => s.includes('database'))) {
      return incident.severity === 'critical' ? 'compromised' : 'intact';
    }
    return 'intact';
  }

  private assessSecurityImplications(incident: IncidentContext): string[] {
    const implications: string[] = [];
    if (incident.category.toLowerCase().includes('security')) {
      implications.push('Potential data breach', 'Authentication bypass risk');
    }
    return implications;
  }

  private assessRecoveryComplexity(incident: IncidentContext): 'simple' | 'moderate' | 'complex' | 'critical' {
    if (incident.severity === 'critical') return 'critical';
    if (incident.affectedSystems.length > 3) return 'complex';
    if (incident.affectedSystems.length > 1) return 'moderate';
    return 'simple';
  }

  private estimateCriticalUsers(incident: IncidentContext): number {
    return Math.floor(this.estimateAffectedUsers(incident) * 0.1);
  }

  private calculateUserExperienceScore(incident: IncidentContext): number {
    const baseScore = 8;
    const severityImpact = { low: -1, medium: -2, high: -4, critical: -6 };
    return Math.max(1, baseScore + (severityImpact[incident.severity] || -2));
  }

  private estimateSupportTickets(incident: IncidentContext): number {
    return Math.floor(this.estimateAffectedUsers(incident) * 0.05);
  }

  private estimateUserSatisfactionImpact(incident: IncidentContext): number {
    const severityImpact = { low: -10, medium: -25, high: -50, critical: -80 };
    return severityImpact[incident.severity] || -20;
  }

  private calculateDirectCosts(incident: IncidentContext): number {
    const hourlyRate = 150; // Average IT professional hourly rate
    const estimatedHours = this.estimateDowntime(incident) / 60;
    return hourlyRate * estimatedHours * incident.affectedSystems.length;
  }

  private calculateIndirectCosts(incident: IncidentContext): number {
    return this.calculateDirectCosts(incident) * 0.5; // 50% of direct costs
  }

  private calculateLostRevenue(incident: IncidentContext): number {
    const revenuePerHour = 10000; // Estimated revenue per hour
    const downtimeHours = this.estimateDowntime(incident) / 60;
    return revenuePerHour * downtimeHours * (incident.severity === 'critical' ? 1 : 0.5);
  }

  private calculatePenaltyCosts(incident: IncidentContext): number {
    return incident.severity === 'critical' ? 50000 : 0;
  }

  private calculateRecoveryInvestment(incident: IncidentContext): number {
    const baseInvestment = { low: 5000, medium: 15000, high: 50000, critical: 200000 };
    return baseInvestment[incident.severity] || 10000;
  }

  private assessMediaAttention(incident: IncidentContext): 'none' | 'minimal' | 'moderate' | 'significant' {
    return incident.severity === 'critical' ? 'moderate' : 'minimal';
  }

  private assessSocialMediaSentiment(incident: IncidentContext): number {
    const severityImpact = { low: -0.1, medium: -0.3, high: -0.6, critical: -0.8 };
    return severityImpact[incident.severity] || -0.2;
  }

  private assessCustomerTrustImpact(incident: IncidentContext): number {
    const severityImpact = { low: -5, medium: -15, high: -35, critical: -60 };
    return severityImpact[incident.severity] || -10;
  }

  private assessBrandValueImpact(incident: IncidentContext): number {
    return this.assessCustomerTrustImpact(incident) * 0.5;
  }

  private async generateRecommendations(analysis: RootCauseAnalysis, incident: IncidentContext): Promise<void> {
    const recommendations: RecommendedAction[] = [];

    // Generate immediate actions
    recommendations.push({
      id: uuidv4(),
      type: 'immediate_fix',
      priority: 'immediate',
      description: `Address primary cause: ${analysis.primaryCause.description}`,
      expectedOutcome: 'Restore service functionality',
      estimatedEffort: 2,
      requiredSkills: ['system_administration', 'troubleshooting'],
      dependencies: [],
      riskLevel: 'medium',
      successCriteria: ['Service restored', 'Error rate below 1%'],
      rollbackPlan: 'Revert to previous stable configuration'
    });

    // Generate monitoring actions
    recommendations.push({
      id: uuidv4(),
      type: 'monitoring',
      priority: 'high',
      description: 'Implement enhanced monitoring for early detection',
      expectedOutcome: 'Prevent similar incidents',
      estimatedEffort: 4,
      requiredSkills: ['monitoring_tools', 'alerting_systems'],
      dependencies: ['immediate_fix'],
      riskLevel: 'low',
      successCriteria: ['Monitoring alerts configured', 'Baseline metrics established']
    });

    // Generate communication actions
    if (analysis.impactAssessment.userImpact.totalAffectedUsers > 100) {
      recommendations.push({
        id: uuidv4(),
        type: 'communication',
        priority: 'urgent',
        description: 'Communicate incident status to affected users',
        expectedOutcome: 'Maintain user trust and transparency',
        estimatedEffort: 1,
        requiredSkills: ['communication', 'customer_service'],
        dependencies: [],
        riskLevel: 'low',
        successCriteria: ['Status page updated', 'User notifications sent']
      });
    }

    // Generate investigation actions for contributing causes
    for (const cause of analysis.contributingCauses) {
      recommendations.push({
        id: uuidv4(),
        type: 'investigation',
        priority: 'medium',
        description: `Investigate contributing cause: ${cause.description}`,
        expectedOutcome: 'Understand full scope of issues',
        estimatedEffort: 3,
        requiredSkills: ['analysis', 'system_knowledge'],
        dependencies: ['immediate_fix'],
        riskLevel: 'low',
        successCriteria: ['Root cause validated', 'Contributing factors identified']
      });
    }

    analysis.recommendedActions = recommendations.sort((a, b) => {
      const priorityOrder = { immediate: 0, urgent: 1, high: 2, medium: 3, low: 4 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private async createPreventionStrategies(analysis: RootCauseAnalysis, incident: IncidentContext): Promise<void> {
    const strategies: PreventionStrategy[] = [];

    // Monitoring enhancement strategy
    strategies.push({
      id: uuidv4(),
      category: 'monitoring_enhancement',
      description: 'Implement predictive monitoring and alerting',
      implementationPlan: 'Deploy advanced monitoring tools with ML-based anomaly detection',
      estimatedCost: 25000,
      expectedROI: 3.5,
      timeToImplement: 30,
      preventionEffectiveness: 0.8,
      applicableScenarios: [analysis.primaryCause.category]
    });

    // Process improvement strategy
    strategies.push({
      id: uuidv4(),
      category: 'process_improvement',
      description: 'Establish incident response playbooks',
      implementationPlan: 'Create automated response procedures for common failure patterns',
      estimatedCost: 15000,
      expectedROI: 4.0,
      timeToImplement: 45,
      preventionEffectiveness: 0.7,
      applicableScenarios: ['all']
    });

    // Technology upgrade strategy
    if (analysis.primaryCause.category === 'hardware_failure') {
      strategies.push({
        id: uuidv4(),
        category: 'technology_upgrade',
        description: 'Implement redundant hardware infrastructure',
        implementationPlan: 'Deploy high-availability hardware with automatic failover',
        estimatedCost: 100000,
        expectedROI: 2.5,
        timeToImplement: 90,
        preventionEffectiveness: 0.9,
        applicableScenarios: ['hardware_failure', 'capacity_overload']
      });
    }

    // Automation strategy
    strategies.push({
      id: uuidv4(),
      category: 'automation',
      description: 'Implement self-healing automation',
      implementationPlan: 'Deploy automated remediation scripts for common issues',
      estimatedCost: 35000,
      expectedROI: 5.0,
      timeToImplement: 60,
      preventionEffectiveness: 0.85,
      applicableScenarios: [analysis.primaryCause.category]
    });

    analysis.preventionStrategies = strategies.sort((a, b) => b.expectedROI - a.expectedROI);
  }

  // Public API methods
  getAnalysis(analysisId: string): RootCauseAnalysis | undefined {
    return this.analyses.get(analysisId);
  }

  getAllAnalyses(): RootCauseAnalysis[] {
    return Array.from(this.analyses.values());
  }

  async updateAnalysisStatus(analysisId: string, status: RCAStatus): Promise<boolean> {
    const analysis = this.analyses.get(analysisId);
    if (analysis) {
      analysis.status = status;
      analysis.metadata.updatedAt = new Date();
      return true;
    }
    return false;
  }

  async addExpertValidation(analysisId: string, validation: ExpertValidation): Promise<boolean> {
    const analysis = this.analyses.get(analysisId);
    if (analysis) {
      analysis.learningData.expertValidations.push(validation);
      
      // Update confidence based on expert feedback
      const avgExpertConfidence = analysis.learningData.expertValidations
        .reduce((sum, v) => sum + v.confidence, 0) / analysis.learningData.expertValidations.length;
      
      analysis.confidence = (analysis.confidence + avgExpertConfidence) / 2;
      analysis.metadata.updatedAt = new Date();
      return true;
    }
    return false;
  }

  getAnalyticsMetrics(): {
    totalAnalyses: number;
    averageConfidence: number;
    completionRate: number;
    averageAnalysisTime: number;
    topCauseCategories: Array<{ category: string; count: number }>;
  } {
    const analyses = Array.from(this.analyses.values());
    const completed = analyses.filter(a => a.status === 'completed');
    
    const categoryCount = new Map<string, number>();
    completed.forEach(a => {
      const category = a.primaryCause.category;
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });

    const topCategories = Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalAnalyses: analyses.length,
      averageConfidence: completed.reduce((sum, a) => sum + a.confidence, 0) / Math.max(completed.length, 1),
      completionRate: completed.length / Math.max(analyses.length, 1),
      averageAnalysisTime: completed.reduce((sum, a) => sum + a.metadata.actualAnalysisTime, 0) / Math.max(completed.length, 1),
      topCauseCategories: topCategories
    };
  }
}

// Helper classes
interface CausePattern {
  id: string;
  name: string;
  category: CauseCategory;
  indicators: string[];
  timeSignature: string;
  commonCauses: string[];
  diagnosticSteps: string[];
  confidence: number;
}

class KnowledgeBase {
  private knowledge: Map<string, string[]> = new Map();

  addKnowledge(domain: string, facts: string[]): void {
    this.knowledge.set(domain, facts);
  }

  validate(category: CauseCategory, description: string): { confidence: number; reasoning: string } {
    const relevantFacts = this.knowledge.get(category) || [];
    
    let matchCount = 0;
    const descriptionLower = description.toLowerCase();
    
    for (const fact of relevantFacts) {
      if (descriptionLower.includes(fact.toLowerCase()) || 
          fact.toLowerCase().includes(descriptionLower)) {
        matchCount++;
      }
    }

    const confidence = relevantFacts.length > 0 ? matchCount / relevantFacts.length : 0.5;
    const reasoning = matchCount > 0 ? 
      `Matches ${matchCount} known patterns in ${category}` : 
      'No specific knowledge base matches found';

    return { confidence, reasoning };
  }
}

export default new RootCauseAnalysisService();