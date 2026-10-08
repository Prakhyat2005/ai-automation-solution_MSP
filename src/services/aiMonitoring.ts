import { aiService, AIMessage } from './aiService';

// Simple event emitter for browser compatibility
class SimpleEventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export interface SystemMetrics {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  activeConnections: number;
  errorRate: number;
  throughput: number;
}

export interface PredictiveAlert {
  id: string;
  type: 'performance' | 'security' | 'capacity' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  predictedTime: Date;
  confidence: number;
  recommendedActions: string[];
  potentialImpact: string;
}

export interface AIInsight {
  id: string;
  category: 'optimization' | 'trend' | 'anomaly' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  data: any;
  generatedAt: Date;
}

export interface AutomationOpportunity {
  id: string;
  processName: string;
  currentEffort: string;
  potentialSavings: string;
  complexity: 'low' | 'medium' | 'high';
  roi: number;
  implementationTime: string;
  description: string;
}

class AIMonitoringService extends SimpleEventEmitter {
  private metrics: SystemMetrics[] = [];
  private alerts: PredictiveAlert[] = [];
  private insights: AIInsight[] = [];
  private automationOpportunities: AutomationOpportunity[] = [];
  private isMonitoring = false;
  private monitoringInterval: number | null = null;

  constructor() {
    super();
    console.log('AI Monitoring Service: Initializing...');
    this.initializeBaselineData();
    console.log('AI Monitoring Service: Initialization complete');
  }

  private initializeBaselineData() {
    console.log('AI Monitoring Service: Generating baseline data...');
    this.generateSampleMetrics();
    this.generatePredictiveAlerts();
    this.generateAIInsights();
    this.generateAutomationOpportunities();
    console.log('AI Monitoring Service: Baseline data generated');
  }

  private generateSampleMetrics() {
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
      this.metrics.push({
        timestamp,
        cpuUsage: 45 + Math.random() * 30,
        memoryUsage: 60 + Math.random() * 25,
        diskUsage: 70 + Math.random() * 15,
        networkLatency: 20 + Math.random() * 30,
        activeConnections: 150 + Math.random() * 100,
        errorRate: Math.random() * 2,
        throughput: 1000 + Math.random() * 500
      });
    }
  }

  private generatePredictiveAlerts() {
    this.alerts = [
      {
        id: '1',
        type: 'performance',
        severity: 'medium',
        title: 'CPU Usage Trending Up',
        description: 'CPU usage has been steadily increasing over the past 6 hours',
        predictedTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        confidence: 85,
        recommendedActions: ['Scale up server resources', 'Optimize running processes'],
        potentialImpact: 'System slowdown affecting 200+ users'
      },
      {
        id: '2',
        type: 'security',
        severity: 'high',
        title: 'Unusual Login Pattern Detected',
        description: 'Multiple failed login attempts from different geographic locations',
        predictedTime: new Date(Date.now() + 30 * 60 * 1000),
        confidence: 92,
        recommendedActions: ['Enable 2FA', 'Review access logs', 'Implement IP blocking'],
        potentialImpact: 'Potential security breach'
      },
      {
        id: '3',
        type: 'capacity',
        severity: 'low',
        title: 'Storage Capacity Warning',
        description: 'Disk usage approaching 80% threshold',
        predictedTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        confidence: 78,
        recommendedActions: ['Archive old files', 'Expand storage capacity'],
        potentialImpact: 'Service interruption if storage fills up'
      }
    ];
  }

  private async generateAIInsights() {
    try {
      // Prepare context for AI analysis
      const recentMetrics = this.metrics.slice(-10);
      const recentAlerts = this.alerts.slice(-5);
      
      const contextMessage: AIMessage[] = [
        {
          role: 'system',
          content: 'You are an AI system monitoring expert. Analyze the provided metrics and alerts to generate actionable insights for MSP operations. Focus on optimization opportunities, trend analysis, and anomaly detection.'
        },
        {
          role: 'user',
          content: `Analyze these system metrics and alerts:
          
Recent Metrics: ${JSON.stringify(recentMetrics, null, 2)}
Recent Alerts: ${JSON.stringify(recentAlerts, null, 2)}

Please provide 2-3 specific insights focusing on:
1. Performance optimization opportunities
2. Trend analysis and predictions
3. Anomaly detection and recommendations

Format your response as actionable insights with confidence levels.`
        }
      ];

      const response = await aiService.sendMessage(contextMessage);
      
      // Parse AI response and create structured insights
      const aiInsight: AIInsight = {
        id: Date.now().toString(),
        category: 'optimization',
        title: 'AI-Generated System Analysis',
        description: response.content,
        confidence: 85 + Math.random() * 10, // 85-95% for AI-generated insights
        impact: 'high',
        data: {
          timestamp: new Date(),
          metrics: recentMetrics,
          alerts: recentAlerts,
          aiModel: 'integrated'
        },
        generatedAt: new Date()
      };

      this.insights.unshift(aiInsight);
      if (this.insights.length > 50) {
        this.insights = this.insights.slice(0, 50);
      }

      this.emit('insight:generated', aiInsight);
      
    } catch (error) {
      console.warn('AI insight generation failed, using fallback:', error);
      // Fallback to original mock insights
      this.generateMockInsights();
    }
  }

  private generateMockInsights() {
    this.insights = [
      {
        id: '1',
        category: 'optimization',
        title: 'Database Query Optimization Opportunity',
        description: 'Identified 15 slow queries that could be optimized with proper indexing',
        confidence: 88,
        impact: 'high',
        data: { queries: 15, avgImprovement: '65%' },
        generatedAt: new Date()
      },
      {
        id: '2',
        category: 'trend',
        title: 'Peak Usage Pattern Analysis',
        description: 'System usage peaks between 2-4 PM daily, suggesting need for auto-scaling',
        confidence: 94,
        impact: 'medium',
        data: { peakHours: '14:00-16:00', usageIncrease: '340%' },
        generatedAt: new Date()
      },
      {
        id: '3',
        category: 'anomaly',
        title: 'Unusual Network Traffic Detected',
        description: 'Network traffic 25% higher than normal baseline for this time period',
        confidence: 76,
        impact: 'medium',
        data: { increase: '25%', duration: '2 hours' },
        generatedAt: new Date()
      },
      {
        id: '4',
        category: 'opportunity',
        title: 'Cost Optimization Potential',
        description: 'Underutilized resources could save $2,400/month if rightsized',
        confidence: 82,
        impact: 'high',
        data: { monthlySavings: '$2,400', resources: 'compute instances' },
        generatedAt: new Date()
      }
    ];
  }

  private generateAutomationOpportunities() {
    this.automationOpportunities = [
      {
        id: '1',
        processName: 'Backup Verification',
        currentEffort: '4 hours/week manual verification',
        potentialSavings: '3.5 hours/week',
        complexity: 'low',
        roi: 340,
        implementationTime: '2-3 days',
        description: 'Automate backup verification with smart monitoring and alerts'
      },
      {
        id: '2',
        processName: 'Security Patch Management',
        currentEffort: '8 hours/month manual patching',
        potentialSavings: '6 hours/month',
        complexity: 'medium',
        roi: 280,
        implementationTime: '1-2 weeks',
        description: 'Implement automated patch testing and deployment pipeline'
      },
      {
        id: '3',
        processName: 'Performance Report Generation',
        currentEffort: '6 hours/month manual reporting',
        potentialSavings: '5.5 hours/month',
        complexity: 'low',
        roi: 420,
        implementationTime: '3-5 days',
        description: 'Create automated performance dashboards and scheduled reports'
      }
    ];
  }

  startMonitoring() {
    console.log('AI Monitoring Service: Starting monitoring...');
    if (this.monitoringInterval) {
      console.log('AI Monitoring Service: Monitoring already active');
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      console.log('AI Monitoring Service: Collecting metrics...');
      this.collectMetrics();
      this.analyzePatterns();
      this.generatePredictions();
    }, 30000) as unknown as number;

    this.emit('monitoring:started');
    console.log('AI Monitoring Service: Monitoring started successfully');
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.emit('monitoring:stopped');
  }

  private collectMetrics() {
    const newMetric: SystemMetrics = {
      timestamp: new Date(),
      cpuUsage: 45 + Math.random() * 30,
      memoryUsage: 60 + Math.random() * 25,
      diskUsage: 70 + Math.random() * 15,
      networkLatency: 20 + Math.random() * 30,
      activeConnections: 150 + Math.random() * 100,
      errorRate: Math.random() * 2,
      throughput: 1000 + Math.random() * 500
    };

    this.metrics.push(newMetric);
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    this.emit('metrics:updated', newMetric);
  }

  private analyzePatterns() {
    if (this.metrics.length < 5) return;

    const recentMetrics = this.metrics.slice(-10);
    
    // CPU trend analysis
    const cpuValues = recentMetrics.map(m => m.cpuUsage);
    const cpuTrend = this.calculateTrend(cpuValues);
    
    if (cpuTrend > 5) {
      this.generateDynamicAlert('performance', 'medium', 'Rising CPU Usage', 'CPU usage trending upward');
    }

    // Memory analysis
    const memoryValues = recentMetrics.map(m => m.memoryUsage);
    const memoryTrend = this.calculateTrend(memoryValues);
    
    if (memoryTrend > 3) {
      this.generateDynamicAlert('capacity', 'high', 'Memory Growth Detected', 'Memory usage increasing consistently');
    }

    // Generate AI insights asynchronously
    this.generateAIInsights().catch(error => {
      console.warn('Failed to generate AI insights:', error);
    });

    this.generatePredictions();
    this.generateDynamicInsight('trend', 'Performance Prediction', 'System performance trending analysis');
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    return secondAvg - firstAvg;
  }

  private generateDynamicAlert(type: PredictiveAlert['type'], severity: PredictiveAlert['severity'], 
                              title: string, description: string) {
    const alert: PredictiveAlert = {
      id: Date.now().toString(),
      type,
      severity,
      title,
      description,
      predictedTime: new Date(Date.now() + 60 * 60 * 1000),
      confidence: 70 + Math.random() * 25,
      recommendedActions: this.getRecommendedActions(type),
      potentialImpact: this.getPotentialImpact(severity)
    };

    this.alerts.unshift(alert);
    if (this.alerts.length > 20) {
      this.alerts = this.alerts.slice(0, 20);
    }

    this.emit('alert:generated', alert);
  }

  private getRecommendedActions(type: string): string[] {
    const actions: { [key: string]: string[] } = {
      performance: ['Monitor resource usage', 'Consider scaling', 'Optimize processes'],
      security: ['Review logs', 'Update security policies', 'Enable monitoring'],
      capacity: ['Plan capacity expansion', 'Archive old data', 'Optimize storage'],
      maintenance: ['Schedule maintenance', 'Update systems', 'Review procedures']
    };
    return actions[type] || ['Review and investigate'];
  }

  private getPotentialImpact(severity: string): string {
    const impacts: { [key: string]: string } = {
      low: 'Minor performance impact',
      medium: 'Moderate service degradation possible',
      high: 'Significant service impact likely',
      critical: 'Service outage imminent'
    };
    return impacts[severity] || 'Unknown impact';
  }

  private generatePredictions() {
    this.generateDynamicInsight('trend', 'Performance Prediction', 'System performance trending analysis');
  }

  private generateDynamicInsight(category: AIInsight['category'], title: string, description: string) {
    const insight: AIInsight = {
      id: Date.now().toString(),
      category,
      title,
      description,
      confidence: 70 + Math.random() * 25,
      impact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      data: {
        timestamp: new Date(),
        metrics: this.metrics.slice(-5)
      },
      generatedAt: new Date()
    };

    this.insights.unshift(insight);
    if (this.insights.length > 50) {
      this.insights = this.insights.slice(0, 50);
    }

    this.emit('insight:generated', insight);
  }

  getLatestMetrics(count = 10): SystemMetrics[] {
    return this.metrics.slice(-count);
  }

  getPredictiveAlerts(): PredictiveAlert[] {
    return this.alerts;
  }

  getAIInsights(): AIInsight[] {
    return this.insights;
  }

  getAutomationOpportunities(): AutomationOpportunity[] {
    return this.automationOpportunities;
  }

  getSystemHealth(): {
    overall: number;
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  } {
    const latest = this.metrics[this.metrics.length - 1];
    if (!latest) {
      return { overall: 100, cpu: 100, memory: 100, disk: 100, network: 100 };
    }

    const cpu = Math.max(0, 100 - latest.cpuUsage);
    const memory = Math.max(0, 100 - latest.memoryUsage);
    const disk = Math.max(0, 100 - latest.diskUsage);
    const network = Math.max(0, 100 - (latest.networkLatency / 2));
    const overall = (cpu + memory + disk + network) / 4;

    return { overall, cpu, memory, disk, network };
  }

  generateExecutiveSummary(): {
    performanceScore: number;
    automationRate: number;
    costSavings: string;
    riskLevel: string;
    recommendations: string[];
  } {
    const health = this.getSystemHealth();
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical').length;
    const highAlerts = this.alerts.filter(a => a.severity === 'high').length;
    
    return {
      performanceScore: Math.round(health.overall),
      automationRate: 73,
      costSavings: '$4,200/month',
      riskLevel: criticalAlerts > 0 ? 'High' : highAlerts > 0 ? 'Medium' : 'Low',
      recommendations: [
        'Implement automated backup verification',
        'Optimize database queries for better performance',
        'Consider auto-scaling for peak hours'
      ]
    };
  }
}

export const aiMonitoringService = new AIMonitoringService();
export default aiMonitoringService;