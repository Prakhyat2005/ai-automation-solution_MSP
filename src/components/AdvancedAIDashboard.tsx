import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Server,
  Activity,
  Zap,
  Target,
  BookOpen
} from 'lucide-react';
import mlEngine, { TicketContext, RootCauseAnalysis, PredictiveInsight, SkillGapAnalysis } from '../services/mlEngine';
import securityComplianceService, { SecurityThreat, Vulnerability, ComplianceFramework } from '../services/securityCompliance';
import microservicesOrchestrator from '../services/microservicesArchitecture';

interface AIInsight {
  id: string;
  type: 'ticket_analysis' | 'root_cause' | 'prediction' | 'security' | 'compliance' | 'skill_gap';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  timestamp: Date;
}

const AdvancedAIDashboard: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [compliance, setCompliance] = useState<ComplianceFramework[]>([]);
  const [predictions, setPredictions] = useState<PredictiveInsight[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGapAnalysis[]>([]);
  const [serviceMetrics, setServiceMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load security data
      const [detectedThreats, foundVulnerabilities, complianceFrameworks] = await Promise.all([
        securityComplianceService.detectThreats(),
        securityComplianceService.scanVulnerabilities(),
        securityComplianceService.checkCompliance()
      ]);

      setThreats(detectedThreats);
      setVulnerabilities(foundVulnerabilities);
      setCompliance(complianceFrameworks);

      // Load predictive insights
      const historicalData = generateMockHistoricalData();
      const predictiveInsights = await mlEngine.generatePredictiveInsights(historicalData);
      setPredictions(predictiveInsights);

      // Load skill gap analysis
      const mockSkillGaps = await generateMockSkillGaps();
      setSkillGaps(mockSkillGaps);

      // Load service metrics
      const metrics = microservicesOrchestrator.getServiceMetrics();
      setServiceMetrics(metrics);

      // Generate AI insights
      const aiInsights = await generateAIInsights(
        detectedThreats,
        foundVulnerabilities,
        complianceFrameworks,
        predictiveInsights,
        mockSkillGaps
      );
      setInsights(aiInsights);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHistoricalData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskUsage: Math.random() * 100,
      networkTraffic: Math.random() * 1000,
      ticketVolume: Math.floor(Math.random() * 50),
      responseTime: Math.random() * 500
    }));
  };

  const generateMockSkillGaps = async (): Promise<SkillGapAnalysis[]> => {
    const technicians = ['tech-001', 'tech-002', 'tech-003'];
    const skillGaps: SkillGapAnalysis[] = [];

    for (const techId of technicians) {
      const mockTickets: TicketContext[] = [
        {
          id: 'ticket-1',
          title: 'Server Performance Issue',
          description: 'Server running slow, high CPU usage',
          category: 'performance',
          priority: 'high',
          clientId: 'client-1',
          tags: ['server', 'performance', 'cpu'],
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'resolved',
          resolutionTime: 240
        }
      ];

      const analysis = await mlEngine.analyzeSkillGaps(techId, mockTickets);
      skillGaps.push(analysis);
    }

    return skillGaps;
  };

  const generateAIInsights = async (
    threats: SecurityThreat[],
    vulnerabilities: Vulnerability[],
    frameworks: ComplianceFramework[],
    predictions: PredictiveInsight[],
    skillGaps: SkillGapAnalysis[]
  ): Promise<AIInsight[]> => {
    const insights: AIInsight[] = [];

    // Security insights
    if (threats.length > 0) {
      const criticalThreats = threats.filter(t => t.severity === 'critical');
      if (criticalThreats.length > 0) {
        insights.push({
          id: 'security-critical',
          type: 'security',
          title: `${criticalThreats.length} Critical Security Threats Detected`,
          description: 'Immediate attention required for critical security threats',
          confidence: 0.95,
          priority: 'critical',
          actionable: true,
          recommendations: ['Review threat details', 'Initiate incident response', 'Apply security patches'],
          timestamp: new Date()
        });
      }
    }

    // Compliance insights
    const nonCompliantFrameworks = frameworks.filter(f => f.overallStatus === 'non_compliant');
    if (nonCompliantFrameworks.length > 0) {
      insights.push({
        id: 'compliance-issues',
        type: 'compliance',
        title: `${nonCompliantFrameworks.length} Compliance Frameworks Need Attention`,
        description: 'Non-compliant frameworks require immediate remediation',
        confidence: 0.9,
        priority: 'high',
        actionable: true,
        recommendations: ['Review failed controls', 'Implement remediation plans', 'Schedule compliance review'],
        timestamp: new Date()
      });
    }

    // Predictive insights
    const highImpactPredictions = predictions.filter(p => p.impact === 'high' || p.impact === 'critical');
    if (highImpactPredictions.length > 0) {
      insights.push({
        id: 'predictive-alerts',
        type: 'prediction',
        title: `${highImpactPredictions.length} High-Impact Issues Predicted`,
        description: 'Proactive measures needed to prevent future issues',
        confidence: 0.85,
        priority: 'medium',
        actionable: true,
        recommendations: ['Review predictions', 'Plan preventive actions', 'Allocate resources'],
        timestamp: new Date()
      });
    }

    // Skill gap insights
    const criticalSkillGaps = skillGaps.flatMap(sg => 
      sg.skillGaps.filter(gap => gap.priority === 'critical')
    );
    if (criticalSkillGaps.length > 0) {
      insights.push({
        id: 'skill-gaps',
        type: 'skill_gap',
        title: `${criticalSkillGaps.length} Critical Skill Gaps Identified`,
        description: 'Training programs needed to address skill deficiencies',
        confidence: 0.8,
        priority: 'medium',
        actionable: true,
        recommendations: ['Schedule training sessions', 'Assign mentors', 'Update job requirements'],
        timestamp: new Date()
      });
    }

    return insights;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'non_compliant': return 'text-red-600';
      case 'partially_compliant': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Advanced AI Dashboard</h1>
        <Button onClick={loadDashboardData} disabled={loading}>
          <Activity className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Insights</p>
                <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Threats</p>
                <p className="text-2xl font-bold text-gray-900">{threats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{predictions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Server className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serviceMetrics?.healthyServices || 0}/{serviceMetrics?.totalServices || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Alert */}
      {insights.filter(i => i.priority === 'critical').length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {insights.filter(i => i.priority === 'critical').length} critical AI insights require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice(0, 5).map((insight) => (
                  <div key={insight.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(insight.priority)}`}></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <Badge variant="outline">
                          Confidence: {Math.round(insight.confidence * 100)}%
                        </Badge>
                        <Badge variant={insight.actionable ? "default" : "secondary"}>
                          {insight.actionable ? 'Actionable' : 'Informational'}
                        </Badge>
                      </div>
                      {insight.recommendations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700">Recommendations:</p>
                          <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                            {insight.recommendations.slice(0, 2).map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Security Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {threats.slice(0, 5).map((threat) => (
                    <div key={threat.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{threat.type.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">{threat.description}</p>
                        <p className="text-xs text-gray-500">Risk Score: {threat.riskScore}/10</p>
                      </div>
                      <Badge className={getPriorityColor(threat.severity)}>
                        {threat.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-orange-500" />
                  Vulnerabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vulnerabilities.slice(0, 5).map((vuln) => (
                    <div key={vuln.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{vuln.title}</p>
                        <p className="text-sm text-gray-600">{vuln.cve || 'No CVE'}</p>
                        <p className="text-xs text-gray-500">CVSS: {vuln.cvssScore}/10</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getPriorityColor(vuln.severity)}>
                          {vuln.severity}
                        </Badge>
                        {vuln.patchAvailable && (
                          <p className="text-xs text-green-600 mt-1">Patch Available</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {compliance.map((framework) => (
              <Card key={framework.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{framework.name}</span>
                    <Badge className={getStatusColor(framework.overallStatus)}>
                      {framework.overallStatus.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Compliance Score</span>
                        <span>{Math.round(framework.complianceScore)}%</span>
                      </div>
                      <Progress value={framework.complianceScore} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Controls</p>
                        <p className="font-semibold">{framework.controls.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Compliant</p>
                        <p className="font-semibold text-green-600">
                          {framework.controls.filter(c => c.status === 'compliant').length}
                        </p>
                      </div>
                    </div>

                    {framework.lastAssessment && (
                      <p className="text-xs text-gray-500">
                        Last assessed: {format(framework.lastAssessment, 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {prediction.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{prediction.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getPriorityColor(prediction.impact)}>
                        {prediction.impact} impact
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {Math.round(prediction.confidence * 100)}% confidence
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Timeframe</p>
                      <p className="text-sm text-gray-600">{prediction.timeframe}</p>
                    </div>

                    {prediction.recommendedActions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recommended Actions</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {prediction.recommendedActions.slice(0, 3).map((action, idx) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skillGaps.map((analysis) => (
              <Card key={analysis.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {analysis.technicianName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Current Skills</p>
                        <p className="font-semibold">{analysis.currentSkills.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Skill Gaps</p>
                        <p className="font-semibold text-orange-600">{analysis.skillGaps.length}</p>
                      </div>
                    </div>

                    {analysis.skillGaps.slice(0, 3).map((gap, idx) => (
                      <div key={idx} className="p-2 border rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{gap.skill}</span>
                          <Badge className={getPriorityColor(gap.priority)}>
                            {gap.priority}
                          </Badge>
                        </div>
                        <div className="mt-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Current: {gap.currentLevel}/10</span>
                            <span>Required: {gap.requiredLevel}/10</span>
                          </div>
                          <Progress value={(gap.currentLevel / gap.requiredLevel) * 100} className="h-1 mt-1" />
                        </div>
                      </div>
                    ))}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Avg Resolution Time</p>
                        <p className="font-semibold">{analysis.performanceMetrics.resolutionTime}min</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Customer Satisfaction</p>
                        <p className="font-semibold">{analysis.performanceMetrics.customerSatisfaction}/5</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          {serviceMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    Service Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Services</span>
                      <span className="font-semibold">{serviceMetrics.totalServices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Healthy</span>
                      <span className="font-semibold text-green-600">{serviceMetrics.healthyServices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">Unhealthy</span>
                      <span className="font-semibold text-red-600">{serviceMetrics.unhealthyServices}</span>
                    </div>
                    <Progress 
                      value={(serviceMetrics.healthyServices / serviceMetrics.totalServices) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Circuit Breakers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(serviceMetrics.circuitBreakerStates).map(([serviceId, state]) => (
                      <div key={serviceId} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{serviceId}</span>
                        <Badge variant={state === 'closed' ? 'default' : 'destructive'}>
                          {state}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Load Balancer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(serviceMetrics.loadBalancerStats).map(([serviceId, instances]) => (
                      <div key={serviceId} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{serviceId}</span>
                        <span className="font-semibold">{instances} instances</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAIDashboard;