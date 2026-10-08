import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Download,
  Calendar,
  DollarSign,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function AnalyticsDashboard() {
  const performanceData = [
    { month: 'Jan', automated: 65, manual: 35, efficiency: 78 },
    { month: 'Feb', automated: 70, manual: 30, efficiency: 82 },
    { month: 'Mar', automated: 75, manual: 25, efficiency: 85 },
    { month: 'Apr', automated: 78, manual: 22, efficiency: 88 },
    { month: 'May', automated: 82, manual: 18, efficiency: 90 },
    { month: 'Jun', automated: 87, manual: 13, efficiency: 94 },
  ];

  const costSavings = [
    { month: 'Jan', saved: 12000, spent: 8000 },
    { month: 'Feb', saved: 15000, spent: 7500 },
    { month: 'Mar', saved: 18000, spent: 7000 },
    { month: 'Apr', saved: 21000, spent: 6800 },
    { month: 'May', saved: 24000, spent: 6500 },
    { month: 'Jun', saved: 28000, spent: 6200 },
  ];

  const ticketCategories = [
    { name: 'Access Management', value: 28, color: '#3b82f6' },
    { name: 'Network Issues', value: 22, color: '#10b981' },
    { name: 'Software', value: 18, color: '#8b5cf6' },
    { name: 'Hardware', value: 15, color: '#f59e0b' },
    { name: 'Security', value: 10, color: '#ef4444' },
    { name: 'Other', value: 7, color: '#6b7280' },
  ];

  const responseTimeData = [
    { time: '00:00', avgTime: 15 },
    { time: '04:00', avgTime: 12 },
    { time: '08:00', avgTime: 8 },
    { time: '12:00', avgTime: 10 },
    { time: '16:00', avgTime: 7 },
    { time: '20:00', avgTime: 9 },
    { time: '24:00', avgTime: 14 },
  ];

  const topClients = [
    { name: 'TechCorp Inc', tickets: 45, satisfaction: 4.9, automation: 92 },
    { name: 'RetailCo', tickets: 38, satisfaction: 4.7, automation: 88 },
    { name: 'FinServe Ltd', tickets: 32, satisfaction: 4.8, automation: 85 },
    { name: 'DesignHub Ltd', tickets: 28, satisfaction: 4.6, automation: 90 },
    { name: 'LawFirm Associates', tickets: 22, satisfaction: 4.9, automation: 87 },
  ];

  const kpiCards = [
    {
      label: 'Total Tickets Handled',
      value: '1,247',
      change: '+18%',
      trend: 'up',
      icon: Target,
      color: 'blue'
    },
    {
      label: 'Cost Savings (MTD)',
      value: '$28,450',
      change: '+24%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Avg Resolution Time',
      value: '8.2 min',
      change: '-32%',
      trend: 'down',
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Automation Rate',
      value: '87%',
      change: '+15%',
      trend: 'up',
      icon: Zap,
      color: 'orange'
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">
            Predictive analytics and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <h2 className="mt-2">{kpi.value}</h2>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="h-4 w-4" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${kpi.color}-100 dark:bg-${kpi.color}-900/30`}>
                  <Icon className={`h-6 w-6 text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Performance Trends */}
      <Tabs defaultValue="automation" className="w-full">
        <TabsList>
          <TabsTrigger value="automation">Automation Trends</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="response">Response Times</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="mt-6">
          <Card className="p-6">
            <h3 className="mb-6">Automation vs Manual Processing</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="automated"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Automated"
                />
                <Area
                  type="monotone"
                  dataKey="manual"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Manual"
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name="Efficiency %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="mt-6">
          <Card className="p-6">
            <h3 className="mb-6">Cost Savings Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={costSavings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="saved" fill="#10b981" name="Saved ($)" />
                <Bar dataKey="spent" fill="#3b82f6" name="Spent ($)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="mt-6">
          <Card className="p-6">
            <h3 className="mb-6">Average Response Time (minutes)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgTime"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Categories */}
        <Card className="p-6">
          <h3 className="mb-6">Ticket Distribution by Category</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label
                >
                  {ticketCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {ticketCategories.map((cat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm">{cat.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Clients */}
        <Card className="p-6">
          <h3 className="mb-6">Top Clients by Volume</h3>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm">{client.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {client.tickets} tickets this month
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    ★ {client.satisfaction}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Automation Rate</span>
                  <span className="text-foreground">{client.automation}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Predictive Insights */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <h3 className="mb-4">AI Predictive Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm">Forecast</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Expected 15% increase in ticket volume next month based on seasonal trends
            </p>
            <Badge variant="outline">High Confidence</Badge>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Cost Optimization</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Increasing automation to 95% could save an additional $8,500/month
            </p>
            <Badge variant="outline">Recommended</Badge>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Efficiency Goal</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              On track to achieve 90% automation rate target by end of quarter
            </p>
            <Badge variant="outline">On Track</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
