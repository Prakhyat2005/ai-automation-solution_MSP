import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { 
  Cloud, 
  Database, 
  Shield, 
  Zap, 
  BarChart3, 
  Bot, 
  Server, 
  Lock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity,
  RefreshCw,
  Loader2,
  FileText
} from 'lucide-react';

interface AWSService {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'beta' | 'warning';
  icon: any;
  metrics: Record<string, string | number>;
  features: string[];
}

interface CostOptimization {
  service: string;
  savings: string;
  percentage: string;
}

interface SecurityCompliance {
  check: string;
  status: 'compliant' | 'warning' | 'critical';
  score: number;
}

export function AWSIntegrations() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showCloudFormationModal, setShowCloudFormationModal] = useState(false);
  const [showCostExplorerModal, setShowCostExplorerModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [awsServices, setAwsServices] = useState<AWSService[]>([
    {
      name: 'Amazon EC2',
      description: 'Auto-scaling compute instances for MSP workloads',
      status: 'active',
      icon: Server,
      metrics: { instances: 24, utilization: '78%', cost: '$1,247/mo' },
      features: ['Auto Scaling', 'Load Balancing', 'Spot Instances']
    },
    {
      name: 'Amazon RDS',
      description: 'Managed database for client data and ticketing system',
      status: 'active',
      icon: Database,
      metrics: { databases: 8, storage: '2.4TB', backups: 'Daily' },
      features: ['Multi-AZ', 'Read Replicas', 'Automated Backups']
    },
    {
      name: 'AWS Lambda',
      description: 'Serverless automation for ticket processing and alerts',
      status: 'active',
      icon: Zap,
      metrics: { executions: '1.2M/mo', duration: '150ms avg', cost: '$89/mo' },
      features: ['Event-driven', 'Auto-scaling', 'Pay-per-use']
    },
    {
      name: 'Amazon CloudWatch',
      description: 'Comprehensive monitoring and alerting for all systems',
      status: 'active',
      icon: BarChart3,
      metrics: { metrics: '50K+', alarms: 127, dashboards: 15 },
      features: ['Real-time Monitoring', 'Custom Metrics', 'Log Analytics']
    },
    {
      name: 'AWS IAM',
      description: 'Identity and access management for secure operations',
      status: 'active',
      icon: Shield,
      metrics: { users: 45, roles: 23, policies: 67 },
      features: ['MFA', 'Role-based Access', 'Policy Management']
    },
    {
      name: 'Amazon Bedrock',
      description: 'AI/ML services for intelligent automation and insights',
      status: 'beta',
      icon: Bot,
      metrics: { models: 5, requests: '25K/mo', accuracy: '94%' },
      features: ['Foundation Models', 'Custom Training', 'API Integration']
    }
  ]);

  const [costOptimization] = useState<CostOptimization[]>([
    { service: 'EC2 Reserved Instances', savings: '$2,340/mo', percentage: '35%' },
    { service: 'S3 Intelligent Tiering', savings: '$890/mo', percentage: '22%' },
    { service: 'Lambda Right-sizing', savings: '$156/mo', percentage: '18%' },
    { service: 'RDS Optimization', savings: '$445/mo', percentage: '12%' }
  ]);

  const [securityCompliance] = useState<SecurityCompliance[]>([
    { check: 'VPC Security Groups', status: 'compliant', score: 98 },
    { check: 'IAM Policy Review', status: 'compliant', score: 95 },
    { check: 'S3 Bucket Encryption', status: 'compliant', score: 100 },
    { check: 'CloudTrail Logging', status: 'warning', score: 87 },
    { check: 'Config Rules', status: 'compliant', score: 92 }
  ]);

  // Simulate real-time data fetching
  const fetchAWSData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update metrics with simulated real-time data
      setAwsServices(prev => prev.map(service => ({
        ...service,
        metrics: {
          ...service.metrics,
          // Add some randomization to simulate real data changes
          ...(service.name === 'Amazon EC2' && {
            instances: Math.floor(Math.random() * 10) + 20,
            utilization: `${Math.floor(Math.random() * 20) + 70}%`
          }),
          ...(service.name === 'Amazon CloudWatch' && {
            alarms: Math.floor(Math.random() * 50) + 100
          })
        }
      })));
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch AWS data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // CloudFormation Stack Launch
  const handleLaunchCloudFormation = async () => {
    setIsLaunching(true);
    try {
      // Simulate CloudFormation stack creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show success notification
      alert('CloudFormation stack launched successfully!');
      setShowCloudFormationModal(false);
    } catch (error) {
      console.error('Failed to launch CloudFormation stack:', error);
      alert('Failed to launch CloudFormation stack. Please try again.');
    } finally {
      setIsLaunching(false);
    }
  };

  // Cost Explorer
  const handleOpenCostExplorer = () => {
    // Simulate opening Cost Explorer
    alert('Opening AWS Cost Explorer... This would redirect to AWS Console in a real implementation.');
    setShowCostExplorerModal(false);
  };

  // Security Assessment
  const handleRunSecurityAssessment = async () => {
    try {
      // Simulate security assessment
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Security assessment completed! Check the Security Compliance section for results.');
      setShowSecurityModal(false);
    } catch (error) {
      console.error('Failed to run security assessment:', error);
      alert('Failed to run security assessment. Please try again.');
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchAWSData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">AWS Integrations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive AWS cloud infrastructure powering your MSP operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Cloud className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">All Systems Operational</span>
            <span className="sm:hidden">Online</span>
          </Badge>
          <Button
            onClick={fetchAWSData}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* AWS Services Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {awsServices.map((service) => (
          <Card key={service.name} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/30">
                  <service.icon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                  <Badge 
                    variant={service.status === 'active' ? 'default' : 'secondary'}
                    className="mt-1 text-xs"
                  >
                    {service.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
              {service.description}
            </p>

            <div className="space-y-2 mb-4">
              {Object.entries(service.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 capitalize">{key}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {service.features.map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Cost Optimization */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Cost Optimization
          </h2>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 self-start sm:self-auto">
            $3,831/mo saved
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {costOptimization.map((item) => (
            <div key={item.service} className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-2">{item.service}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-bold text-green-600">{item.savings}</span>
                <Badge variant="outline" className="text-green-700 border-green-200 text-xs">
                  {item.percentage}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security & Compliance */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Lock className="h-5 w-5 mr-2 text-blue-600" />
            Security & Compliance
          </h2>
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">94% Compliance Score</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {securityCompliance.map((item) => (
            <div key={item.check} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2 sm:gap-0">
              <div className="flex items-center space-x-3">
                {item.status === 'compliant' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{item.check}</span>
              </div>
              <div className="flex items-center space-x-2 ml-8 sm:ml-0">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.score}%
                </span>
                <Badge 
                  variant={item.status === 'compliant' ? 'default' : 'secondary'}
                  className={`text-xs ${item.status === 'compliant' ? 'bg-green-100 text-green-800' : ''}`}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-orange-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            className="flex items-center justify-start space-x-3 h-16 text-left bg-gray-900 hover:bg-gray-800 text-white px-4"
            onClick={() => setShowCloudFormationModal(true)}
          >
            <Cloud className="h-5 w-5 flex-shrink-0" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Launch CloudFormation Stack</span>
              <span className="text-xs text-gray-300">CloudFormation</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-3 h-16 text-left border-2 hover:bg-gray-50 px-4"
            onClick={() => setShowCostExplorerModal(true)}
          >
            <BarChart3 className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <div className="flex flex-col items-start">
              <span className="font-medium">View Cost Explorer</span>
              <span className="text-xs text-gray-500">Cost Explorer</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-3 h-16 text-left border-2 hover:bg-gray-50 px-4"
            onClick={() => setShowSecurityModal(true)}
          >
            <Shield className="h-5 w-5 flex-shrink-0 text-green-600" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Security Assessment</span>
              <span className="text-xs text-gray-500">Security</span>
            </div>
          </Button>
        </div>
      </Card>

      {/* Real-time Monitoring Dashboard */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Real-time Monitoring Dashboard
          </h2>
          <Badge className="bg-blue-100 text-blue-800 text-xs">
            Live Data
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* System Health Overview */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              System Health
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Overall Status</span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">Healthy</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">99.9%</p>
                  <p className="text-xs text-gray-500">Uptime</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">24ms</p>
                  <p className="text-xs text-gray-500">Avg Response</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Instances</span>
                  <span className="font-medium text-green-600">12/15</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Failed Health Checks</span>
                  <span className="font-medium text-red-600">0</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Resource Utilization */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Resource Utilization
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage Usage</span>
                  <span className="font-medium">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Network I/O</span>
                  <span className="font-medium">1.2 GB/s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">API Requests</p>
                <p className="text-2xl font-bold text-blue-600">2.4M</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last hour</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
                <p className="text-2xl font-bold text-green-600">0.02%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">-0.01% from last hour</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Data Transfer</p>
                <p className="text-2xl font-bold text-purple-600">847 GB</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-blue-600 mt-2">+5% from last hour</p>
          </Card>
        </div>
      </Card>

      {/* CloudFormation Modal */}
      <Dialog open={showCloudFormationModal} onOpenChange={setShowCloudFormationModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-orange-600" />
              <span>Launch CloudFormation Stack</span>
            </DialogTitle>
            <DialogDescription>
              Deploy infrastructure as code using AWS CloudFormation templates. Choose from pre-built MSP templates or upload your own.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-type" className="text-sm font-medium">
                Template Type
              </Label>
              <select 
                id="template-type"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                defaultValue="msp-infrastructure"
              >
                <option value="msp-infrastructure">MSP Infrastructure (Recommended)</option>
                <option value="monitoring-stack">Monitoring & Alerting Stack</option>
                <option value="backup-solution">Backup & Recovery Solution</option>
                <option value="security-baseline">Security Baseline</option>
                <option value="custom">Custom Template</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stack-name" className="text-sm font-medium">
                  Stack Name
                </Label>
                <Input
                  id="stack-name"
                  defaultValue="msp-infrastructure-prod"
                  placeholder="Enter stack name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region" className="text-sm font-medium">
                  AWS Region
                </Label>
                <select 
                  id="region"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  defaultValue="us-east-1"
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">Europe (Ireland)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parameters" className="text-sm font-medium">
                Stack Parameters
              </Label>
              <Textarea
                id="parameters"
                placeholder="Environment=Production&#10;InstanceType=t3.medium&#10;KeyPairName=msp-keypair&#10;VpcCidr=10.0.0.0/16"
                className="min-h-[100px]"
                defaultValue="Environment=Production&#10;InstanceType=t3.medium&#10;KeyPairName=msp-keypair"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Estimated Resources
              </h4>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 2x EC2 instances (t3.medium)</li>
                <li>• 1x Application Load Balancer</li>
                <li>• 1x RDS MySQL instance</li>
                <li>• VPC with public/private subnets</li>
                <li>• Security groups and IAM roles</li>
              </ul>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-2 font-medium">
                Estimated monthly cost: $180-220
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCloudFormationModal(false)}>
              Cancel
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                Validate Template
              </Button>
              <Button onClick={handleLaunchCloudFormation} disabled={isLaunching} className="bg-orange-600 hover:bg-orange-700">
                {isLaunching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLaunching ? 'Launching Stack...' : 'Launch Stack'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cost Explorer Modal */}
      <Dialog open={showCostExplorerModal} onOpenChange={setShowCostExplorerModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>AWS Cost Explorer</span>
            </DialogTitle>
            <DialogDescription>
              Analyze your AWS costs and usage patterns with detailed insights and optimization recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {/* Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">This Month</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">$4,247</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">+8% vs last month</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 dark:text-green-100">Forecasted</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">$4,890</p>
                <p className="text-xs text-green-700 dark:text-green-300">End of month</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100">Potential Savings</h4>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">$831</p>
                <p className="text-xs text-orange-700 dark:text-orange-300">Available optimizations</p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Top Cost Drivers</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Server className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">EC2 Instances</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">$1,247</p>
                    <p className="text-xs text-gray-500">29% of total</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">RDS Databases</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">$892</p>
                    <p className="text-xs text-gray-500">21% of total</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cloud className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">S3 Storage</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">$445</p>
                    <p className="text-xs text-gray-500">10% of total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Recommendations */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Optimization Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Reserved Instances</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Save $2,340/month with 1-year commitment</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">High Impact</Badge>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Right-size Instances</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Downsize underutilized instances to save $445/month</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Medium Impact</Badge>
                </div>
              </div>
            </div>

            {/* Report Options */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Available Reports</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Cost & Usage Report
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Rightsizing Report
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Reserved Instance Report
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Savings Plans Report
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCostExplorerModal(false)}>
              Close
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                Export Data
              </Button>
              <Button onClick={handleOpenCostExplorer} className="bg-blue-600 hover:bg-blue-700">
                Open Full Cost Explorer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Assessment Modal */}
      <Dialog open={showSecurityModal} onOpenChange={setShowSecurityModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span>AWS Security Assessment</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive security analysis and compliance reporting for your AWS infrastructure.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {/* Security Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-red-900 dark:text-red-100">Security Score</h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">72/100</p>
                <p className="text-xs text-red-700 dark:text-red-300">Needs improvement</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100">Critical Issues</h4>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</p>
                <p className="text-xs text-orange-700 dark:text-orange-300">Immediate attention</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Warnings</h4>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">12</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Review recommended</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 dark:text-green-100">Compliant</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">85%</p>
                <p className="text-xs text-green-700 dark:text-green-300">SOC 2 compliance</p>
              </div>
            </div>

            {/* Critical Security Issues */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Critical Security Issues</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-red-900 dark:text-red-100">S3 Bucket Public Access</p>
                      <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">2 S3 buckets have public read access enabled</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Affected: prod-data-bucket, backup-storage-bucket</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-red-900 dark:text-red-100">Root Account MFA Disabled</p>
                      <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">Root account does not have MFA enabled</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Account: 123456789012</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Overprivileged IAM Users</p>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">High</Badge>
                    </div>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">5 IAM users have excessive permissions</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Users: dev-user-1, admin-temp, contractor-access</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Compliance Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium">SOC 2 Type II</h5>
                    <Badge className="bg-green-100 text-green-800 text-xs">85% Compliant</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Security Controls</span>
                      <span className="text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Availability</span>
                      <span className="text-green-600">88%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Processing Integrity</span>
                      <span className="text-red-600">72%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium">PCI DSS</h5>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">78% Compliant</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Network Security</span>
                      <span className="text-green-600">95%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Access Control</span>
                      <span className="text-yellow-600">68%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Monitoring</span>
                      <span className="text-red-600">62%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Recommendations */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Security Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Enable AWS Config</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Monitor configuration changes and compliance</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Recommended</Badge>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Implement AWS GuardDuty</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Threat detection and continuous monitoring</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">High Priority</Badge>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Enable CloudTrail Logging</p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">Comprehensive API activity logging</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 text-xs">Essential</Badge>
                </div>
              </div>
            </div>

            {/* Vulnerability Scan Results */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Recent Vulnerability Scans</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">EC2 Instances</span>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">4 Issues</Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Last scan: 2 hours ago</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">2 Medium, 2 Low severity</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">RDS Databases</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">Clean</Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Last scan: 6 hours ago</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">No vulnerabilities found</p>
                </div>
              </div>
            </div>

            {/* Report Generation */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Security Reports</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Summary
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Compliance Report
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Vulnerability Report
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Remediation Plan
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowSecurityModal(false)}>
              Close
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                Schedule Scan
              </Button>
              <Button onClick={handleRunSecurityAssessment} className="bg-red-600 hover:bg-red-700">
                Run Full Assessment
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}