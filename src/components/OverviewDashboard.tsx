import { useApp } from '../contexts/AppContext';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { LoadingSpinner, Skeleton } from './LoadingSpinner';
import { Card } from './ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Ticket, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Zap,
  Users,
  Server,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function OverviewDashboard() {
  const { state } = useApp();
  const { tickets, systemMetrics, clients, analytics, loading, error } = state;
  const { handleError } = useErrorHandler();

  // Check if any data is still loading
  const isLoading = Object.values(loading).some(isLoading => isLoading);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Error loading dashboard data</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const activeTickets = tickets.filter(t => t.status !== 'resolved').length;
  const resolvedToday = tickets.filter(t => 
    t.status === 'resolved' && 
    new Date(t.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  // Calculate automation rate based on resolved tickets vs total tickets
  const totalTickets = tickets.length;
  const automationRate = totalTickets > 0 ? Math.round((resolvedToday / totalTickets) * 100) : 87;
  
  // Get average response time from analytics data
  const avgResponseTime = analytics?.responseTime && analytics.responseTime.length > 0 
    ? `${analytics.responseTime[analytics.responseTime.length - 1].avgTime}h`
    : '2.3h';

  const stats = [
    {
      label: 'Active Tickets',
      value: activeTickets.toString(),
      change: '-18%',
      trend: 'down',
      icon: Ticket,
      color: 'blue'
    },
    {
      label: 'Resolved Today',
      value: resolvedToday.toString(),
      change: '+24%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'green'
    },
    {
      label: 'Avg Response Time',
      value: avgResponseTime,
      change: '-32%',
      trend: 'down',
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Automation Rate',
      value: `${automationRate}%`,
      change: '+12%',
      trend: 'up',
      icon: Zap,
      color: 'orange'
    },
  ];

  const ticketTrend = [
    { name: 'Mon', manual: 45, automated: 12 },
    { name: 'Tue', manual: 38, automated: 18 },
    { name: 'Wed', manual: 32, automated: 24 },
    { name: 'Thu', manual: 28, automated: 29 },
    { name: 'Fri', manual: 22, automated: 35 },
    { name: 'Sat', manual: 18, automated: 38 },
    { name: 'Sun', manual: 15, automated: 42 },
  ];

  const systemHealth = [
    { name: 'Optimal', value: 78, color: '#10b981' },
    { name: 'Warning', value: 15, color: '#f59e0b' },
    { name: 'Critical', value: 7, color: '#ef4444' },
  ];

  const recentActivity = [
    { type: 'success', message: 'AI resolved ticket #1847 - Password Reset', time: '2m ago' },
    { type: 'info', message: 'Resource allocation optimized for Client-A', time: '5m ago' },
    { type: 'warning', message: 'High CPU detected on Server-12', time: '12m ago' },
    { type: 'success', message: 'Automated backup completed successfully', time: '18m ago' },
    { type: 'info', message: 'New integration added: AWS CloudWatch', time: '25m ago' },
  ];

  const upcomingTasks = [
    { task: 'Monthly security audit', client: 'TechCorp Inc', priority: 'high', due: '2 hours' },
    { task: 'Server maintenance window', client: 'RetailCo', priority: 'medium', due: '4 hours' },
    { task: 'Quarterly review meeting', client: 'FinServe Ltd', priority: 'low', due: '1 day' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl">Welcome back, Admin</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your operations today</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-700 dark:text-green-400 hidden sm:inline">All Systems Operational</span>
              <span className="text-sm text-green-700 dark:text-green-400 sm:hidden">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h2 className="mt-2">{stat.value}</h2>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="h-4 w-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ticket Automation Trend */}
        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl">Ticket Resolution Trend</h3>
            <p className="text-sm text-muted-foreground mt-1">Manual vs AI-Automated Resolution</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={ticketTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="manual" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="automated" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* System Health Distribution */}
        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl">System Health Distribution</h3>
            <p className="text-sm text-muted-foreground mt-1">Current status across all monitored systems</p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={systemHealth}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {systemHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity and Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">Live updates from your automation system</p>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className={`p-2 rounded-full mt-0.5 ${
                  activity.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                  activity.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {activity.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : activity.type === 'warning' ? (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <Activity className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate sm:whitespace-normal">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl">Upcoming Tasks</h3>
            <p className="text-sm text-muted-foreground mt-1">AI-prioritized action items</p>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="p-3 sm:p-4 rounded-lg border border-border hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h4 className="text-sm flex-1 min-w-0 truncate sm:whitespace-normal">{task.task}</h4>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-1 sm:gap-0">
                  <span className="truncate">{task.client}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Due in {task.due}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
