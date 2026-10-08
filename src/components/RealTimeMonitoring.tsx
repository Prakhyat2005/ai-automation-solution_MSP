import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  HardDrive, 
  Wifi, 
  MemoryStick,
  Zap,
  Brain,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { aiMonitoringService, SystemMetrics, PredictiveAlert, AIInsight } from '../services/aiMonitoring';

interface RealTimeMonitoringProps {
  className?: string;
}

export function RealTimeMonitoring({ className }: RealTimeMonitoringProps) {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    overall: 0,
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0
  });
  const [executiveSummary, setExecutiveSummary] = useState({
    performanceScore: 0,
    automationRate: 0,
    costSavings: '$0',
    riskLevel: 'Low',
    recommendations: [] as string[]
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Initialize data
    setMetrics(aiMonitoringService.getLatestMetrics(20));
    setAlerts(aiMonitoringService.getPredictiveAlerts());
    setInsights(aiMonitoringService.getAIInsights());
    setSystemHealth(aiMonitoringService.getSystemHealth());
    setExecutiveSummary(aiMonitoringService.generateExecutiveSummary());

    // Set up event listeners
    const handleMetricsUpdate = (newMetric: SystemMetrics) => {
      setMetrics(prev => [...prev.slice(-19), newMetric]);
      setSystemHealth(aiMonitoringService.getSystemHealth());
    };

    const handleAlertGenerated = (alert: PredictiveAlert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 19)]);
    };

    const handleInsightGenerated = (insight: AIInsight) => {
      setInsights(prev => [insight, ...prev.slice(0, 19)]);
    };

    aiMonitoringService.on('metrics:updated', handleMetricsUpdate);
    aiMonitoringService.on('alert:generated', handleAlertGenerated);
    aiMonitoringService.on('insight:generated', handleInsightGenerated);

    // Start monitoring
    aiMonitoringService.startMonitoring();
    setIsMonitoring(true);

    return () => {
      aiMonitoringService.off('metrics:updated', handleMetricsUpdate);
      aiMonitoringService.off('alert:generated', handleAlertGenerated);
      aiMonitoringService.off('insight:generated', handleInsightGenerated);
      aiMonitoringService.stopMonitoring();
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (value: number) => {
    if (value >= 90) return 'Excellent';
    if (value >= 70) return 'Good';
    if (value >= 50) return 'Fair';
    return 'Poor';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time AI Monitoring</h2>
          <p className="text-gray-600">Advanced predictive analytics and intelligent insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isMonitoring ? 'default' : 'secondary'} className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {isMonitoring ? 'Live Monitoring' : 'Monitoring Stopped'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isMonitoring) {
                aiMonitoringService.stopMonitoring();
                setIsMonitoring(false);
              } else {
                aiMonitoringService.startMonitoring();
                setIsMonitoring(true);
              }
            }}
          >
            {isMonitoring ? 'Stop' : 'Start'} Monitoring
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Executive Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{executiveSummary.performanceScore}%</div>
            <div className="text-sm text-gray-600">Performance Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{executiveSummary.automationRate}%</div>
            <div className="text-sm text-gray-600">Automation Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{executiveSummary.costSavings}</div>
            <div className="text-sm text-gray-600">Potential Savings</div>
          </div>
          <div className="text-center">
            <Badge className={`${
              executiveSummary.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
              executiveSummary.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {executiveSummary.riskLevel} Risk
            </Badge>
          </div>
        </div>
      </Card>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Overall Health</span>
            </div>
            <span className={`text-lg font-bold ${getHealthColor(systemHealth.overall)}`}>
              {Math.round(systemHealth.overall)}%
            </span>
          </div>
          <Progress value={systemHealth.overall} className="mb-2" />
          <span className={`text-sm ${getHealthColor(systemHealth.overall)}`}>
            {getHealthStatus(systemHealth.overall)}
          </span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-orange-600" />
              <span className="font-medium">CPU</span>
            </div>
            <span className={`text-lg font-bold ${getHealthColor(systemHealth.cpu)}`}>
              {Math.round(systemHealth.cpu)}%
            </span>
          </div>
          <Progress value={systemHealth.cpu} className="mb-2" />
          <span className={`text-sm ${getHealthColor(systemHealth.cpu)}`}>
            {getHealthStatus(systemHealth.cpu)}
          </span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Memory</span>
            </div>
            <span className={`text-lg font-bold ${getHealthColor(systemHealth.memory)}`}>
              {Math.round(systemHealth.memory)}%
            </span>
          </div>
          <Progress value={systemHealth.memory} className="mb-2" />
          <span className={`text-sm ${getHealthColor(systemHealth.memory)}`}>
            {getHealthStatus(systemHealth.memory)}
          </span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-green-600" />
              <span className="font-medium">Storage</span>
            </div>
            <span className={`text-lg font-bold ${getHealthColor(systemHealth.disk)}`}>
              {Math.round(systemHealth.disk)}%
            </span>
          </div>
          <Progress value={systemHealth.disk} className="mb-2" />
          <span className={`text-sm ${getHealthColor(systemHealth.disk)}`}>
            {getHealthStatus(systemHealth.disk)}
          </span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Network</span>
            </div>
            <span className={`text-lg font-bold ${getHealthColor(systemHealth.network)}`}>
              {Math.round(systemHealth.network)}%
            </span>
          </div>
          <Progress value={systemHealth.network} className="mb-2" />
          <span className={`text-sm ${getHealthColor(systemHealth.network)}`}>
            {getHealthStatus(systemHealth.network)}
          </span>
        </Card>
      </div>

      {/* Alerts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Alerts */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Predictive Alerts</h3>
            <Badge variant="outline">{alerts.length}</Badge>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(alert.severity)}
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Predicted: {formatTimeAgo(alert.predictedTime)}</span>
                  </div>
                  <span>{alert.confidence}% confidence</span>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No active alerts</p>
              </div>
            )}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">AI Insights</h3>
            <Badge variant="outline">{insights.length}</Badge>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {insights.slice(0, 10).map((insight) => (
              <div key={insight.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {insight.category === 'optimization' && <Zap className="h-4 w-4 text-yellow-600" />}
                    {insight.category === 'trend' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                    {insight.category === 'anomaly' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {insight.category === 'opportunity' && <Target className="h-4 w-4 text-green-600" />}
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <Badge className={`${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impact} impact
                  </Badge>
                  <span>{formatTimeAgo(insight.generatedAt)}</span>
                </div>
              </div>
            ))}
            {insights.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p>Generating insights...</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Real-time Metrics Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Real-time Performance Metrics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {metrics.length > 0 && (
            <>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(metrics[metrics.length - 1]?.cpuUsage || 0)}%
                </div>
                <div className="text-sm text-gray-600">CPU Usage</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(metrics[metrics.length - 1]?.memoryUsage || 0)}%
                </div>
                <div className="text-sm text-gray-600">Memory Usage</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(metrics[metrics.length - 1]?.networkLatency || 0)}ms
                </div>
                <div className="text-sm text-gray-600">Network Latency</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(metrics[metrics.length - 1]?.throughput || 0)}
                </div>
                <div className="text-sm text-gray-600">Throughput/min</div>
              </div>
            </>
          )}
        </div>
        
        {/* Simple metrics visualization */}
        <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-center p-4">
          <div className="flex items-end gap-1 h-full">
            {metrics.slice(-20).map((metric, index) => (
              <div
                key={index}
                className="bg-blue-500 rounded-t min-w-[8px] transition-all duration-300"
                style={{
                  height: `${(metric.cpuUsage / 100) * 100}%`,
                  opacity: 0.7 + (index / 20) * 0.3
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}