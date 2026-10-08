import { useState, useEffect } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useAsync } from '../hooks/useAsync';
import { LoadingSpinner, Skeleton } from './LoadingSpinner';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Server, 
  HardDrive, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  XCircle,
  TrendingUp,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface SystemMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  location: string;
  lastCheck: string;
}

export function SystemHealth() {
  const { handleError } = useErrorHandler();
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate system health check with error handling
  const { execute: performHealthCheck, loading: checkingHealth } = useAsync(
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastScan(new Date());
      return true;
    },
    {
      onSuccess: () => {
        setError(null);
      },
      onError: (err) => {
        handleError(err, { showToast: true });
        setError('Failed to perform health check');
      }
    }
  );

  const systems: SystemMetric[] = [
    {
      id: 'SRV-001',
      name: 'Production Database',
      status: 'healthy',
      cpu: 45,
      memory: 62,
      disk: 71,
      uptime: '45 days',
      location: 'AWS US-East-1',
      lastCheck: '2m ago'
    },
    {
      id: 'SRV-002',
      name: 'Web Server Cluster',
      status: 'healthy',
      cpu: 38,
      memory: 54,
      disk: 43,
      uptime: '22 days',
      location: 'AWS US-West-2',
      lastCheck: '2m ago'
    },
    {
      id: 'SRV-003',
      name: 'Backup Server',
      status: 'warning',
      cpu: 72,
      memory: 85,
      disk: 89,
      uptime: '88 days',
      location: 'Azure East-US',
      lastCheck: '2m ago'
    },
    {
      id: 'SRV-004',
      name: 'Application Server',
      status: 'healthy',
      cpu: 52,
      memory: 68,
      disk: 55,
      uptime: '15 days',
      location: 'AWS EU-West-1',
      lastCheck: '2m ago'
    },
    {
      id: 'SRV-005',
      name: 'Email Server',
      status: 'critical',
      cpu: 89,
      memory: 94,
      disk: 62,
      uptime: '102 days',
      location: 'On-Premise',
      lastCheck: '2m ago'
    },
    {
      id: 'SRV-006',
      name: 'File Storage',
      status: 'healthy',
      cpu: 28,
      memory: 41,
      disk: 78,
      uptime: '67 days',
      location: 'AWS US-East-1',
      lastCheck: '2m ago'
    },
  ];

  const cpuTrend = [
    { time: '00:00', value: 45 },
    { time: '04:00', value: 38 },
    { time: '08:00', value: 62 },
    { time: '12:00', value: 78 },
    { time: '16:00', value: 65 },
    { time: '20:00', value: 52 },
    { time: 'Now', value: 58 },
  ];

  const memoryTrend = [
    { time: '00:00', value: 52 },
    { time: '04:00', value: 48 },
    { time: '08:00', value: 65 },
    { time: '12:00', value: 72 },
    { time: '16:00', value: 68 },
    { time: '20:00', value: 58 },
    { time: 'Now', value: 62 },
  ];

  const statusCounts = {
    healthy: systems.filter(s => s.status === 'healthy').length,
    warning: systems.filter(s => s.status === 'warning').length,
    critical: systems.filter(s => s.status === 'critical').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return '';
    }
  };

  const handleScan = () => {
    performHealthCheck();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        
        {/* Systems list skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">System Health Check Failed</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              performHealthCheck();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry Health Check
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>System Health Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring with predictive analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Last scan: {lastScan.toLocaleTimeString()}
          </span>
          <Button 
            onClick={handleScan}
            disabled={checkingHealth}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${checkingHealth ? 'animate-spin' : ''}`} />
            {checkingHealth ? 'Scanning...' : 'Scan Now'}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Healthy</p>
              <p className="text-2xl">{statusCounts.healthy}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warning</p>
              <p className="text-2xl">{statusCounts.warning}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl">{statusCounts.critical}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-2xl">99.8%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">CPU Usage Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cpuTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Memory Usage Trend (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={memoryTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {systems.map((system) => (
          <Card key={system.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h4>{system.name}</h4>
                  <p className="text-xs text-muted-foreground">{system.id}</p>
                </div>
              </div>
              {getStatusIcon(system.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">CPU</span>
                  </div>
                  <span>{system.cpu}%</span>
                </div>
                <Progress 
                  value={system.cpu} 
                  className="h-1.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Memory</span>
                  </div>
                  <span>{system.memory}%</span>
                </div>
                <Progress 
                  value={system.memory} 
                  className="h-1.5"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Disk</span>
                  </div>
                  <span>{system.disk}%</span>
                </div>
                <Progress 
                  value={system.disk} 
                  className="h-1.5"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
              <span>Uptime: {system.uptime}</span>
              <span>{system.location}</span>
            </div>

            <Badge className={`${getStatusColor(system.status)} mt-3 w-full justify-center`}>
              {system.status.toUpperCase()}
            </Badge>

            {system.status !== 'healthy' && (
              <Button variant="outline" size="sm" className="w-full mt-2">
                View Details
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* AI Predictions */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">AI Predictive Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Capacity Warning</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Email Server will reach 95% memory in ~3 days
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Optimization Ready</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Backup Server can be optimized to reduce disk usage by 23%
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Maintenance Due</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Email Server uptime exceeds recommended restart interval
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
