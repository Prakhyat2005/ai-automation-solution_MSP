import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Users, 
  Server, 
  TrendingUp, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  RefreshCw,
  Target,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts';
import { useState, useEffect } from 'react';

export function ResourceAllocation() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const teamMembers = [
    {
      id: 'john',
      name: 'John Smith',
      role: 'Senior Engineer',
      avatar: 'JS',
      workload: 85,
      currentTasks: 8,
      efficiency: 94,
      status: 'active',
      specialties: ['Network', 'Security'],
      hourlyRate: 75,
      availableHours: 40,
      utilizedHours: 34
    },
    {
      id: 'sarah',
      name: 'Sarah Johnson',
      role: 'System Admin',
      avatar: 'SJ',
      workload: 72,
      currentTasks: 6,
      efficiency: 89,
      status: 'active',
      specialties: ['Cloud', 'Automation'],
      hourlyRate: 65,
      availableHours: 40,
      utilizedHours: 29
    },
    {
      id: 'mike',
      name: 'Mike Chen',
      role: 'Support Engineer',
      avatar: 'MC',
      workload: 45,
      currentTasks: 4,
      efficiency: 91,
      status: 'available',
      specialties: ['Hardware', 'Software'],
      hourlyRate: 55,
      availableHours: 40,
      utilizedHours: 18
    },
    {
      id: 'emma',
      name: 'Emma Davis',
      role: 'DevOps Engineer',
      avatar: 'ED',
      workload: 68,
      currentTasks: 5,
      efficiency: 96,
      status: 'active',
      specialties: ['CI/CD', 'Monitoring'],
      hourlyRate: 70,
      availableHours: 40,
      utilizedHours: 27
    },
  ];

  const workloadData = [
    { name: 'John', current: 85, optimal: 75, capacity: 100 },
    { name: 'Sarah', current: 72, optimal: 75, capacity: 100 },
    { name: 'Mike', current: 45, optimal: 75, capacity: 100 },
    { name: 'Emma', current: 68, optimal: 75, capacity: 100 },
  ];

  const skillsData = [
    { skill: 'Network', value: 85 },
    { skill: 'Cloud', value: 92 },
    { skill: 'Security', value: 78 },
    { skill: 'Automation', value: 88 },
    { skill: 'Hardware', value: 72 },
    { skill: 'Monitoring', value: 85 },
  ];

  const efficiencyTrend = [
    { week: 'W1', efficiency: 87 },
    { week: 'W2', efficiency: 89 },
    { week: 'W3', efficiency: 91 },
    { week: 'W4', efficiency: 92 },
  ];

  const aiRecommendations = [
    {
      id: 1,
      type: 'rebalance',
      message: 'Redistribute 2 tickets from John to Mike for optimal load balance',
      impact: 'High',
      effort: 'Low',
      estimatedSavings: '$1,200/week',
      implemented: false
    },
    {
      id: 2,
      type: 'skill',
      message: 'Sarah is best suited for 3 upcoming cloud migration tasks',
      impact: 'Medium',
      effort: 'Low',
      estimatedSavings: '$800/week',
      implemented: false
    },
    {
      id: 3,
      type: 'training',
      message: 'Schedule security training for Mike to expand team capacity',
      impact: 'Medium',
      effort: 'Medium',
      estimatedSavings: '$2,000/month',
      implemented: false
    },
  ];

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setOptimizationComplete(false);
      }, 3000);
    }, 2000);
  };

  const handleImplementRecommendation = (id: number) => {
    // Simulate implementing a recommendation
    console.log(`Implementing recommendation ${id}`);
  };

  const getWorkloadColor = (workload: number) => {
    if (workload > 80) return 'text-red-600';
    if (workload > 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      available: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      busy: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Resource Allocation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">AI-optimized team and resource management</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : optimizationComplete ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isOptimizing ? 'Optimizing...' : optimizationComplete ? 'Optimized!' : 'Optimize Now'}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-xl sm:text-2xl font-bold">{teamMembers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Efficiency</p>
              <p className="text-xl sm:text-2xl font-bold">92%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <p className="text-xl sm:text-2xl font-bold">23</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Optimized</p>
              <p className="text-xl sm:text-2xl font-bold">94%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Overview</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              View Details
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <Card 
                key={member.id} 
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedMember === member.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(member.status)}>
                    {member.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Workload</span>
                      <span className={getWorkloadColor(member.workload)}>{member.workload}%</span>
                    </div>
                    <Progress value={member.workload} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tasks:</span>
                      <span className="ml-1 font-medium">{member.currentTasks}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Efficiency:</span>
                      <span className="ml-1 font-medium">{member.efficiency}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {member.specialties.map((specialty, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {selectedMember === member.id && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Rate:</span>
                          <span className="ml-1 font-medium">${member.hourlyRate}/hr</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Utilized:</span>
                          <span className="ml-1 font-medium">{member.utilizedHours}h/{member.availableHours}h</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {member.workload > 80 && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        High workload detected - Consider redistribution
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Charts and Insights */}
        <div className="space-y-6">
          {/* Workload Distribution Chart */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Workload Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="optimal" fill="#94a3b8" opacity={0.3} name="Optimal" />
                <Bar dataKey="current" fill="#3b82f6" name="Current" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Efficiency Trend */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Efficiency Trend</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={efficiencyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Skills Radar */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Team Skills Coverage</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Skills" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* AI Recommendations */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">AI Recommendations</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {aiRecommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  {rec.type === 'rebalance' && <Target className="h-4 w-4 text-blue-600" />}
                  {rec.type === 'skill' && <Users className="h-4 w-4 text-green-600" />}
                  {rec.type === 'training' && <TrendingUp className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-3">{rec.message}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      Impact: {rec.impact}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Effort: {rec.effort}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-green-600">
                      {rec.estimatedSavings}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleImplementRecommendation(rec.id)}
                  >
                    Implement
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
