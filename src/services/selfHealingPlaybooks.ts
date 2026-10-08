import { v4 as uuidv4 } from 'uuid';
import { format, addMinutes, differenceInMinutes } from 'date-fns';
import mlEngine, { TicketContext } from './mlEngine';
import aiService from './aiService';
import microservicesOrchestrator from './microservicesArchitecture';

// Core interfaces for self-healing system
export interface RemediationPlaybook {
  id: string;
  name: string;
  description: string;
  version: string;
  category: PlaybookCategory;
  triggers: PlaybookTrigger[];
  conditions: PlaybookCondition[];
  actions: RemediationAction[];
  rollbackActions: RemediationAction[];
  successCriteria: SuccessCriteria[];
  metadata: PlaybookMetadata;
  learningData: LearningData;
}

export type PlaybookCategory = 
  | 'infrastructure' 
  | 'application' 
  | 'network' 
  | 'security' 
  | 'database' 
  | 'storage' 
  | 'performance' 
  | 'backup' 
  | 'monitoring';

export interface PlaybookTrigger {
  id: string;
  type: TriggerType;
  source: string;
  condition: string;
  threshold: number;
  timeWindow: number; // minutes
  priority: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export type TriggerType = 
  | 'metric_threshold' 
  | 'log_pattern' 
  | 'alert_correlation' 
  | 'service_failure' 
  | 'performance_degradation' 
  | 'security_event' 
  | 'compliance_violation';

export interface PlaybookCondition {
  id: string;
  type: 'prerequisite' | 'safety_check' | 'business_rule';
  description: string;
  expression: string;
  required: boolean;
  timeout: number; // seconds
}

export interface RemediationAction {
  id: string;
  name: string;
  type: ActionType;
  description: string;
  command?: string;
  script?: string;
  apiCall?: APICall;
  parameters: Record<string, any>;
  timeout: number; // seconds
  retryCount: number;
  retryDelay: number; // seconds
  rollbackOnFailure: boolean;
  requiresApproval: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  parallelExecution: boolean;
}

export type ActionType = 
  | 'restart_service' 
  | 'scale_resource' 
  | 'update_configuration' 
  | 'run_script' 
  | 'api_call' 
  | 'database_query' 
  | 'file_operation' 
  | 'network_change' 
  | 'security_action' 
  | 'notification';

export interface APICall {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body?: any;
  authentication?: {
    type: 'bearer' | 'basic' | 'api_key';
    credentials: Record<string, string>;
  };
}

export interface SuccessCriteria {
  id: string;
  name: string;
  type: 'metric' | 'log' | 'api_response' | 'manual_verification';
  condition: string;
  expectedValue: any;
  tolerance: number;
  checkInterval: number; // seconds
  maxWaitTime: number; // seconds
}

export interface PlaybookMetadata {
  author: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  tags: string[];
  approvedBy: string;
  approvalDate: Date;
  lastExecuted?: Date;
  executionCount: number;
  successRate: number;
  averageExecutionTime: number; // seconds
  estimatedDowntime: number; // seconds
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
}

export interface LearningData {
  executionHistory: ExecutionRecord[];
  successPatterns: Pattern[];
  failurePatterns: Pattern[];
  optimizationSuggestions: OptimizationSuggestion[];
  adaptiveThresholds: AdaptiveThreshold[];
}

export interface ExecutionRecord {
  id: string;
  executionId: string;
  timestamp: Date;
  triggeredBy: string;
  context: ExecutionContext;
  actions: ActionResult[];
  outcome: ExecutionOutcome;
  duration: number; // seconds
  rollbackRequired: boolean;
  lessonsLearned: string[];
}

export interface ExecutionContext {
  environment: 'production' | 'staging' | 'development';
  affectedSystems: string[];
  businessHours: boolean;
  maintenanceWindow: boolean;
  concurrentExecutions: number;
  systemLoad: number;
  userImpact: number;
}

export interface ActionResult {
  actionId: string;
  status: 'success' | 'failure' | 'timeout' | 'skipped';
  startTime: Date;
  endTime: Date;
  output: string;
  errorMessage?: string;
  metrics: Record<string, number>;
  sideEffects: string[];
}

export interface ExecutionOutcome {
  status: 'success' | 'partial_success' | 'failure' | 'rollback';
  successCriteriaMet: boolean;
  impactReduction: number; // percentage
  timeToResolution: number; // seconds
  userSatisfaction?: number; // 1-5 scale
  businessValue: number; // estimated cost savings
  followUpRequired: boolean;
  followUpActions: string[];
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  frequency: number;
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  recommendations: string[];
}

export interface OptimizationSuggestion {
  id: string;
  type: 'performance' | 'reliability' | 'cost' | 'security';
  description: string;
  currentValue: number;
  suggestedValue: number;
  expectedImprovement: number;
  implementationEffort: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  priority: number;
}

export interface AdaptiveThreshold {
  metricName: string;
  currentThreshold: number;
  suggestedThreshold: number;
  confidence: number;
  basedOnExecutions: number;
  lastUpdated: Date;
}

export interface PlaybookExecution {
  id: string;
  playbookId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  triggeredBy: string;
  context: ExecutionContext;
  currentAction?: string;
  progress: number; // 0-100
  logs: ExecutionLog[];
  metrics: ExecutionMetrics;
}

export type ExecutionStatus = 
  | 'queued' 
  | 'running' 
  | 'paused' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'rollback_in_progress' 
  | 'rollback_completed';

export interface ExecutionLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  actionId?: string;
  metadata?: Record<string, any>;
}

export interface ExecutionMetrics {
  totalActions: number;
  completedActions: number;
  failedActions: number;
  skippedActions: number;
  averageActionTime: number;
  resourceUtilization: Record<string, number>;
  impactMetrics: Record<string, number>;
}

class SelfHealingPlaybooksService {
  private playbooks: Map<string, RemediationPlaybook> = new Map();
  private activeExecutions: Map<string, PlaybookExecution> = new Map();
  private executionQueue: PlaybookExecution[] = [];
  private isProcessingQueue = false;

  constructor() {
    this.initializeDefaultPlaybooks();
    this.startQueueProcessor();
  }

  private initializeDefaultPlaybooks(): void {
    // High CPU Usage Remediation
    const highCpuPlaybook: RemediationPlaybook = {
      id: 'pb-high-cpu-001',
      name: 'High CPU Usage Remediation',
      description: 'Automatically resolves high CPU usage issues through service optimization and resource scaling',
      version: '1.0.0',
      category: 'performance',
      triggers: [
        {
          id: 'trigger-cpu-001',
          type: 'metric_threshold',
          source: 'system_metrics',
          condition: 'cpu_usage > 85',
          threshold: 85,
          timeWindow: 5,
          priority: 'high',
          enabled: true
        }
      ],
      conditions: [
        {
          id: 'cond-001',
          type: 'safety_check',
          description: 'Ensure system is not in maintenance mode',
          expression: 'maintenance_mode == false',
          required: true,
          timeout: 30
        }
      ],
      actions: [
        {
          id: 'action-001',
          name: 'Identify CPU-intensive processes',
          type: 'run_script',
          description: 'Get list of processes consuming high CPU',
          script: 'ps aux --sort=-%cpu | head -10',
          parameters: {},
          timeout: 30,
          retryCount: 2,
          retryDelay: 5,
          rollbackOnFailure: false,
          requiresApproval: false,
          riskLevel: 'low',
          dependencies: [],
          parallelExecution: false
        },
        {
          id: 'action-002',
          name: 'Restart high-impact services',
          type: 'restart_service',
          description: 'Restart services that are consuming excessive CPU',
          parameters: { services: ['apache2', 'mysql', 'nginx'] },
          timeout: 120,
          retryCount: 1,
          retryDelay: 10,
          rollbackOnFailure: true,
          requiresApproval: false,
          riskLevel: 'medium',
          dependencies: ['action-001'],
          parallelExecution: false
        },
        {
          id: 'action-003',
          name: 'Scale resources if needed',
          type: 'scale_resource',
          description: 'Increase CPU allocation if pattern persists',
          parameters: { resource_type: 'cpu', scale_factor: 1.5 },
          timeout: 300,
          retryCount: 1,
          retryDelay: 30,
          rollbackOnFailure: true,
          requiresApproval: true,
          riskLevel: 'medium',
          dependencies: ['action-002'],
          parallelExecution: false
        }
      ],
      rollbackActions: [
        {
          id: 'rollback-001',
          name: 'Restore original resource allocation',
          type: 'scale_resource',
          description: 'Revert CPU scaling changes',
          parameters: { resource_type: 'cpu', scale_factor: 1.0 },
          timeout: 300,
          retryCount: 2,
          retryDelay: 30,
          rollbackOnFailure: false,
          requiresApproval: false,
          riskLevel: 'low',
          dependencies: [],
          parallelExecution: false
        }
      ],
      successCriteria: [
        {
          id: 'success-001',
          name: 'CPU usage normalized',
          type: 'metric',
          condition: 'cpu_usage < 70',
          expectedValue: 70,
          tolerance: 5,
          checkInterval: 30,
          maxWaitTime: 600
        }
      ],
      metadata: {
        author: 'AI System',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0',
        tags: ['performance', 'cpu', 'auto-scaling'],
        approvedBy: 'System Admin',
        approvalDate: new Date(),
        executionCount: 0,
        successRate: 0,
        averageExecutionTime: 0,
        estimatedDowntime: 30,
        businessImpact: 'medium'
      },
      learningData: {
        executionHistory: [],
        successPatterns: [],
        failurePatterns: [],
        optimizationSuggestions: [],
        adaptiveThresholds: []
      }
    };

    // Service Failure Recovery
    const serviceFailurePlaybook: RemediationPlaybook = {
      id: 'pb-service-failure-001',
      name: 'Service Failure Recovery',
      description: 'Automatically detects and recovers failed services with dependency management',
      version: '1.0.0',
      category: 'infrastructure',
      triggers: [
        {
          id: 'trigger-service-001',
          type: 'service_failure',
          source: 'service_monitor',
          condition: 'service_status == "down"',
          threshold: 1,
          timeWindow: 1,
          priority: 'critical',
          enabled: true
        }
      ],
      conditions: [
        {
          id: 'cond-service-001',
          type: 'prerequisite',
          description: 'Check if service dependencies are healthy',
          expression: 'dependencies_healthy == true',
          required: true,
          timeout: 60
        }
      ],
      actions: [
        {
          id: 'action-service-001',
          name: 'Check service status',
          type: 'run_script',
          description: 'Verify current service status and dependencies',
          script: 'systemctl status $SERVICE_NAME && systemctl list-dependencies $SERVICE_NAME',
          parameters: { SERVICE_NAME: 'target_service' },
          timeout: 30,
          retryCount: 1,
          retryDelay: 5,
          rollbackOnFailure: false,
          requiresApproval: false,
          riskLevel: 'low',
          dependencies: [],
          parallelExecution: false
        },
        {
          id: 'action-service-002',
          name: 'Restart failed service',
          type: 'restart_service',
          description: 'Attempt to restart the failed service',
          parameters: { force_restart: true, wait_for_startup: true },
          timeout: 180,
          retryCount: 2,
          retryDelay: 30,
          rollbackOnFailure: false,
          requiresApproval: false,
          riskLevel: 'medium',
          dependencies: ['action-service-001'],
          parallelExecution: false
        },
        {
          id: 'action-service-003',
          name: 'Failover to backup instance',
          type: 'api_call',
          description: 'Switch traffic to backup service instance',
          apiCall: {
            method: 'POST',
            url: '/api/v1/services/failover',
            headers: { 'Content-Type': 'application/json' },
            body: { service_id: '${SERVICE_ID}', backup_instance: '${BACKUP_INSTANCE}' }
          },
          parameters: {},
          timeout: 120,
          retryCount: 1,
          retryDelay: 15,
          rollbackOnFailure: true,
          requiresApproval: false,
          riskLevel: 'high',
          dependencies: ['action-service-002'],
          parallelExecution: false
        }
      ],
      rollbackActions: [
        {
          id: 'rollback-service-001',
          name: 'Restore original service routing',
          type: 'api_call',
          description: 'Revert traffic routing to original service',
          apiCall: {
            method: 'POST',
            url: '/api/v1/services/restore',
            headers: { 'Content-Type': 'application/json' },
            body: { service_id: '${SERVICE_ID}' }
          },
          parameters: {},
          timeout: 120,
          retryCount: 2,
          retryDelay: 15,
          rollbackOnFailure: false,
          requiresApproval: false,
          riskLevel: 'medium',
          dependencies: [],
          parallelExecution: false
        }
      ],
      successCriteria: [
        {
          id: 'success-service-001',
          name: 'Service is healthy',
          type: 'api_response',
          condition: 'service_health_check == "healthy"',
          expectedValue: 'healthy',
          tolerance: 0,
          checkInterval: 15,
          maxWaitTime: 300
        }
      ],
      metadata: {
        author: 'AI System',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0',
        tags: ['infrastructure', 'service-recovery', 'failover'],
        approvedBy: 'System Admin',
        approvalDate: new Date(),
        executionCount: 0,
        successRate: 0,
        averageExecutionTime: 0,
        estimatedDowntime: 120,
        businessImpact: 'high'
      },
      learningData: {
        executionHistory: [],
        successPatterns: [],
        failurePatterns: [],
        optimizationSuggestions: [],
        adaptiveThresholds: []
      }
    };

    this.playbooks.set(highCpuPlaybook.id, highCpuPlaybook);
    this.playbooks.set(serviceFailurePlaybook.id, serviceFailurePlaybook);
  }

  async createPlaybook(playbook: Omit<RemediationPlaybook, 'id' | 'metadata' | 'learningData'>): Promise<string> {
    const id = uuidv4();
    const newPlaybook: RemediationPlaybook = {
      ...playbook,
      id,
      metadata: {
        author: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: playbook.version,
        tags: [],
        approvedBy: 'Pending',
        approvalDate: new Date(),
        executionCount: 0,
        successRate: 0,
        averageExecutionTime: 0,
        estimatedDowntime: 0,
        businessImpact: 'medium'
      },
      learningData: {
        executionHistory: [],
        successPatterns: [],
        failurePatterns: [],
        optimizationSuggestions: [],
        adaptiveThresholds: []
      }
    };

    this.playbooks.set(id, newPlaybook);
    return id;
  }

  async executePlaybook(playbookId: string, triggeredBy: string, context: Partial<ExecutionContext> = {}): Promise<string> {
    const playbook = this.playbooks.get(playbookId);
    if (!playbook) {
      throw new Error(`Playbook ${playbookId} not found`);
    }

    const executionId = uuidv4();
    const execution: PlaybookExecution = {
      id: executionId,
      playbookId,
      status: 'queued',
      startTime: new Date(),
      triggeredBy,
      context: {
        environment: 'production',
        affectedSystems: [],
        businessHours: this.isBusinessHours(),
        maintenanceWindow: false,
        concurrentExecutions: this.activeExecutions.size,
        systemLoad: 0.5,
        userImpact: 0,
        ...context
      },
      progress: 0,
      logs: [],
      metrics: {
        totalActions: playbook.actions.length,
        completedActions: 0,
        failedActions: 0,
        skippedActions: 0,
        averageActionTime: 0,
        resourceUtilization: {},
        impactMetrics: {}
      }
    };

    this.activeExecutions.set(executionId, execution);
    this.executionQueue.push(execution);

    this.addExecutionLog(executionId, 'info', `Playbook execution queued: ${playbook.name}`);
    
    return executionId;
  }

  private async processExecution(execution: PlaybookExecution): Promise<void> {
    const playbook = this.playbooks.get(execution.playbookId);
    if (!playbook) {
      this.addExecutionLog(execution.id, 'error', 'Playbook not found');
      execution.status = 'failed';
      return;
    }

    try {
      execution.status = 'running';
      execution.startTime = new Date();
      this.addExecutionLog(execution.id, 'info', `Starting playbook execution: ${playbook.name}`);

      // Check conditions
      const conditionsResult = await this.checkConditions(playbook.conditions, execution);
      if (!conditionsResult.success) {
        this.addExecutionLog(execution.id, 'error', `Conditions not met: ${conditionsResult.message}`);
        execution.status = 'failed';
        return;
      }

      // Execute actions
      let rollbackRequired = false;
      const actionResults: ActionResult[] = [];

      for (const action of playbook.actions) {
        if (execution.status === 'cancelled') {
          break;
        }

        this.addExecutionLog(execution.id, 'info', `Executing action: ${action.name}`);
        execution.currentAction = action.id;

        const actionResult = await this.executeAction(action, execution);
        actionResults.push(actionResult);

        if (actionResult.status === 'failure' && action.rollbackOnFailure) {
          rollbackRequired = true;
          break;
        }

        execution.metrics.completedActions++;
        execution.progress = (execution.metrics.completedActions / execution.metrics.totalActions) * 100;
      }

      // Execute rollback if needed
      if (rollbackRequired) {
        execution.status = 'rollback_in_progress';
        this.addExecutionLog(execution.id, 'warn', 'Executing rollback actions');
        
        for (const rollbackAction of playbook.rollbackActions) {
          await this.executeAction(rollbackAction, execution);
        }
        
        execution.status = 'rollback_completed';
      } else {
        // Check success criteria
        const successResult = await this.checkSuccessCriteria(playbook.successCriteria, execution);
        execution.status = successResult.success ? 'completed' : 'failed';
      }

      execution.endTime = new Date();
      
      // Record execution for learning
      await this.recordExecution(playbook, execution, actionResults);
      
      // Update playbook metadata
      this.updatePlaybookMetadata(playbook, execution);

    } catch (error) {
      this.addExecutionLog(execution.id, 'error', `Execution failed: ${error}`);
      execution.status = 'failed';
      execution.endTime = new Date();
    }
  }

  private async checkConditions(conditions: PlaybookCondition[], execution: PlaybookExecution): Promise<{ success: boolean; message: string }> {
    for (const condition of conditions) {
      try {
        // Simulate condition checking - in real implementation, this would evaluate the expression
        const result = await this.evaluateCondition(condition, execution);
        if (!result && condition.required) {
          return { success: false, message: `Required condition failed: ${condition.description}` };
        }
      } catch (error) {
        if (condition.required) {
          return { success: false, message: `Condition evaluation error: ${error}` };
        }
      }
    }
    return { success: true, message: 'All conditions met' };
  }

  private async evaluateCondition(condition: PlaybookCondition, execution: PlaybookExecution): Promise<boolean> {
    // Mock condition evaluation - in real implementation, this would use a proper expression evaluator
    switch (condition.type) {
      case 'safety_check':
        return !execution.context.maintenanceWindow;
      case 'prerequisite':
        return execution.context.systemLoad < 0.8;
      case 'business_rule':
        return execution.context.businessHours || execution.context.environment !== 'production';
      default:
        return true;
    }
  }

  private async executeAction(action: RemediationAction, execution: PlaybookExecution): Promise<ActionResult> {
    const startTime = new Date();
    const result: ActionResult = {
      actionId: action.id,
      status: 'success',
      startTime,
      endTime: startTime,
      output: '',
      metrics: {},
      sideEffects: []
    };

    try {
      // Check if approval is required
      if (action.requiresApproval && !await this.getApproval(action, execution)) {
        result.status = 'skipped';
        result.output = 'Action skipped - approval not granted';
        execution.metrics.skippedActions++;
        return result;
      }

      // Execute action based on type
      switch (action.type) {
        case 'restart_service':
          result.output = await this.executeServiceRestart(action, execution);
          break;
        case 'scale_resource':
          result.output = await this.executeResourceScaling(action, execution);
          break;
        case 'run_script':
          result.output = await this.executeScript(action, execution);
          break;
        case 'api_call':
          result.output = await this.executeApiCall(action, execution);
          break;
        case 'update_configuration':
          result.output = await this.executeConfigurationUpdate(action, execution);
          break;
        default:
          result.output = `Action type ${action.type} not implemented`;
          result.status = 'failure';
      }

      result.endTime = new Date();
      
    } catch (error) {
      result.status = 'failure';
      result.errorMessage = String(error);
      result.endTime = new Date();
      execution.metrics.failedActions++;
    }

    return result;
  }

  private async executeServiceRestart(action: RemediationAction, execution: PlaybookExecution): Promise<string> {
    // Mock service restart - in real implementation, this would interact with system services
    const services = action.parameters.services || ['unknown-service'];
    const results: string[] = [];

    for (const service of services) {
      try {
        // Simulate service restart
        await new Promise(resolve => setTimeout(resolve, 1000));
        results.push(`Service ${service} restarted successfully`);
        
        // Update metrics
        execution.metrics.resourceUtilization[service] = Math.random() * 100;
      } catch (error) {
        results.push(`Failed to restart service ${service}: ${error}`);
        throw error;
      }
    }

    return results.join('\n');
  }

  private async executeResourceScaling(action: RemediationAction, execution: PlaybookExecution): Promise<string> {
    // Mock resource scaling - in real implementation, this would interact with cloud providers or orchestrators
    const resourceType = action.parameters.resource_type || 'cpu';
    const scaleFactor = action.parameters.scale_factor || 1.0;

    try {
      // Simulate scaling operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update metrics
      execution.metrics.resourceUtilization[resourceType] = scaleFactor * 100;
      
      return `Successfully scaled ${resourceType} by factor ${scaleFactor}`;
    } catch (error) {
      throw new Error(`Failed to scale ${resourceType}: ${error}`);
    }
  }

  private async executeScript(action: RemediationAction, execution: PlaybookExecution): Promise<string> {
    // Mock script execution - in real implementation, this would execute actual scripts
    const script = action.script || action.command || 'echo "No script provided"';
    
    try {
      // Simulate script execution
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock output based on script type
      if (script.includes('ps aux')) {
        return 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot      1234 85.2  5.3 123456  7890 ?        R    10:00   0:30 high-cpu-process';
      } else if (script.includes('systemctl status')) {
        return 'Active: active (running) since Mon 2024-01-01 10:00:00 UTC; 1h 30min ago';
      } else {
        return `Script executed successfully: ${script}`;
      }
    } catch (error) {
      throw new Error(`Script execution failed: ${error}`);
    }
  }

  private async executeApiCall(action: RemediationAction, execution: PlaybookExecution): Promise<string> {
    // Mock API call - in real implementation, this would make actual HTTP requests
    const apiCall = action.apiCall;
    if (!apiCall) {
      throw new Error('No API call configuration provided');
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response based on URL
      if (apiCall.url.includes('failover')) {
        return 'Failover completed successfully';
      } else if (apiCall.url.includes('restore')) {
        return 'Service restored to original configuration';
      } else {
        return `API call to ${apiCall.url} completed successfully`;
      }
    } catch (error) {
      throw new Error(`API call failed: ${error}`);
    }
  }

  private async executeConfigurationUpdate(action: RemediationAction, execution: PlaybookExecution): Promise<string> {
    // Mock configuration update - in real implementation, this would update actual configurations
    const configType = action.parameters.config_type || 'application';
    const changes = action.parameters.changes || {};

    try {
      // Simulate configuration update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return `Configuration updated for ${configType}: ${JSON.stringify(changes)}`;
    } catch (error) {
      throw new Error(`Configuration update failed: ${error}`);
    }
  }

  private async getApproval(action: RemediationAction, execution: PlaybookExecution): Promise<boolean> {
    // Mock approval process - in real implementation, this would integrate with approval workflows
    if (execution.context.environment === 'production' && action.riskLevel === 'critical') {
      // Simulate approval request
      this.addExecutionLog(execution.id, 'info', `Approval requested for high-risk action: ${action.name}`);
      return false; // Require manual approval for critical actions in production
    }
    return true;
  }

  private async checkSuccessCriteria(criteria: SuccessCriteria[], execution: PlaybookExecution): Promise<{ success: boolean; message: string }> {
    for (const criterion of criteria) {
      try {
        const result = await this.evaluateSuccessCriterion(criterion, execution);
        if (!result) {
          return { success: false, message: `Success criterion not met: ${criterion.name}` };
        }
      } catch (error) {
        return { success: false, message: `Error evaluating success criterion: ${error}` };
      }
    }
    return { success: true, message: 'All success criteria met' };
  }

  private async evaluateSuccessCriterion(criterion: SuccessCriteria, execution: PlaybookExecution): Promise<boolean> {
    // Mock success criteria evaluation - in real implementation, this would check actual metrics/logs/APIs
    switch (criterion.type) {
      case 'metric':
        // Simulate metric check
        const currentValue = Math.random() * 100;
        return currentValue < criterion.expectedValue;
      case 'api_response':
        // Simulate API health check
        return Math.random() > 0.1; // 90% success rate
      case 'log':
        // Simulate log pattern check
        return true;
      default:
        return true;
    }
  }

  private async recordExecution(playbook: RemediationPlaybook, execution: PlaybookExecution, actionResults: ActionResult[]): Promise<void> {
    const executionRecord: ExecutionRecord = {
      id: uuidv4(),
      executionId: execution.id,
      timestamp: execution.startTime,
      triggeredBy: execution.triggeredBy,
      context: execution.context,
      actions: actionResults,
      outcome: {
        status: execution.status === 'completed' ? 'success' : 
                execution.status === 'rollback_completed' ? 'rollback' : 'failure',
        successCriteriaMet: execution.status === 'completed',
        impactReduction: execution.status === 'completed' ? Math.random() * 50 + 50 : 0,
        timeToResolution: execution.endTime ? 
          differenceInMinutes(execution.endTime, execution.startTime) * 60 : 0,
        businessValue: execution.status === 'completed' ? Math.random() * 10000 : 0,
        followUpRequired: execution.status !== 'completed',
        followUpActions: execution.status !== 'completed' ? ['Manual investigation required'] : []
      },
      duration: execution.endTime ? 
        differenceInMinutes(execution.endTime, execution.startTime) * 60 : 0,
      rollbackRequired: execution.status === 'rollback_completed',
      lessonsLearned: await this.extractLessonsLearned(execution, actionResults)
    };

    playbook.learningData.executionHistory.push(executionRecord);
    
    // Analyze patterns and generate optimizations
    await this.analyzeExecutionPatterns(playbook);
  }

  private async extractLessonsLearned(execution: PlaybookExecution, actionResults: ActionResult[]): Promise<string[]> {
    const lessons: string[] = [];
    
    // Analyze failed actions
    const failedActions = actionResults.filter(ar => ar.status === 'failure');
    if (failedActions.length > 0) {
      lessons.push(`${failedActions.length} actions failed - review error handling`);
    }

    // Analyze execution time
    if (execution.endTime) {
      const duration = differenceInMinutes(execution.endTime, execution.startTime);
      if (duration > 30) {
        lessons.push('Execution took longer than expected - consider optimization');
      }
    }

    // Analyze context factors
    if (!execution.context.businessHours && execution.context.environment === 'production') {
      lessons.push('After-hours execution in production - consider scheduling');
    }

    return lessons;
  }

  private async analyzeExecutionPatterns(playbook: RemediationPlaybook): Promise<void> {
    const history = playbook.learningData.executionHistory;
    if (history.length < 5) return; // Need minimum data for pattern analysis

    // Analyze success patterns
    const successfulExecutions = history.filter(h => h.outcome.status === 'success');
    const failedExecutions = history.filter(h => h.outcome.status === 'failure');

    // Generate optimization suggestions
    const suggestions: OptimizationSuggestion[] = [];

    // Performance optimization
    const avgDuration = history.reduce((sum, h) => sum + h.duration, 0) / history.length;
    if (avgDuration > 300) { // 5 minutes
      suggestions.push({
        id: uuidv4(),
        type: 'performance',
        description: 'Consider parallelizing actions to reduce execution time',
        currentValue: avgDuration,
        suggestedValue: avgDuration * 0.7,
        expectedImprovement: 30,
        implementationEffort: 'medium',
        riskLevel: 'low',
        priority: 1
      });
    }

    // Reliability optimization
    const successRate = successfulExecutions.length / history.length;
    if (successRate < 0.8) {
      suggestions.push({
        id: uuidv4(),
        type: 'reliability',
        description: 'Add additional error handling and retry logic',
        currentValue: successRate * 100,
        suggestedValue: 90,
        expectedImprovement: (0.9 - successRate) * 100,
        implementationEffort: 'medium',
        riskLevel: 'low',
        priority: 2
      });
    }

    playbook.learningData.optimizationSuggestions = suggestions;

    // Update adaptive thresholds
    await this.updateAdaptiveThresholds(playbook);
  }

  private async updateAdaptiveThresholds(playbook: RemediationPlaybook): Promise<void> {
    // Analyze trigger thresholds based on execution outcomes
    for (const trigger of playbook.triggers) {
      const relatedExecutions = playbook.learningData.executionHistory.filter(h => 
        h.triggeredBy.includes(trigger.id)
      );

      if (relatedExecutions.length >= 10) {
        const successfulTriggers = relatedExecutions.filter(h => h.outcome.status === 'success');
        const successRate = successfulTriggers.length / relatedExecutions.length;

        let suggestedThreshold = trigger.threshold;
        
        if (successRate < 0.7) {
          // Too many false positives, increase threshold
          suggestedThreshold = trigger.threshold * 1.1;
        } else if (successRate > 0.95) {
          // Very high success rate, might be able to lower threshold for earlier detection
          suggestedThreshold = trigger.threshold * 0.95;
        }

        const adaptiveThreshold: AdaptiveThreshold = {
          metricName: trigger.source,
          currentThreshold: trigger.threshold,
          suggestedThreshold,
          confidence: Math.min(0.95, relatedExecutions.length / 50),
          basedOnExecutions: relatedExecutions.length,
          lastUpdated: new Date()
        };

        const existingIndex = playbook.learningData.adaptiveThresholds.findIndex(
          at => at.metricName === trigger.source
        );

        if (existingIndex >= 0) {
          playbook.learningData.adaptiveThresholds[existingIndex] = adaptiveThreshold;
        } else {
          playbook.learningData.adaptiveThresholds.push(adaptiveThreshold);
        }
      }
    }
  }

  private updatePlaybookMetadata(playbook: RemediationPlaybook, execution: PlaybookExecution): void {
    playbook.metadata.executionCount++;
    playbook.metadata.lastExecuted = execution.startTime;

    // Update success rate
    const successfulExecutions = playbook.learningData.executionHistory.filter(
      h => h.outcome.status === 'success'
    ).length;
    playbook.metadata.successRate = successfulExecutions / playbook.metadata.executionCount;

    // Update average execution time
    const totalTime = playbook.learningData.executionHistory.reduce(
      (sum, h) => sum + h.duration, 0
    );
    playbook.metadata.averageExecutionTime = totalTime / playbook.learningData.executionHistory.length;

    playbook.metadata.updatedAt = new Date();
  }

  private addExecutionLog(executionId: string, level: ExecutionLog['level'], message: string, actionId?: string): void {
    const execution = this.activeExecutions.get(executionId);
    if (execution) {
      execution.logs.push({
        timestamp: new Date(),
        level,
        message,
        actionId,
        metadata: {}
      });
    }
  }

  private isBusinessHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    return day >= 1 && day <= 5 && hour >= 9 && hour <= 17;
  }

  private startQueueProcessor(): void {
    if (this.isProcessingQueue) return;
    
    this.isProcessingQueue = true;
    
    const processQueue = async () => {
      while (this.executionQueue.length > 0) {
        const execution = this.executionQueue.shift();
        if (execution) {
          await this.processExecution(execution);
          this.activeExecutions.delete(execution.id);
        }
      }
      
      // Continue processing every 5 seconds
      setTimeout(processQueue, 5000);
    };

    processQueue();
  }

  // Public API methods
  getPlaybooks(): RemediationPlaybook[] {
    return Array.from(this.playbooks.values());
  }

  getPlaybook(id: string): RemediationPlaybook | undefined {
    return this.playbooks.get(id);
  }

  getActiveExecutions(): PlaybookExecution[] {
    return Array.from(this.activeExecutions.values());
  }

  getExecutionStatus(executionId: string): PlaybookExecution | undefined {
    return this.activeExecutions.get(executionId);
  }

  async cancelExecution(executionId: string): Promise<boolean> {
    const execution = this.activeExecutions.get(executionId);
    if (execution && (execution.status === 'running' || execution.status === 'queued')) {
      execution.status = 'cancelled';
      this.addExecutionLog(executionId, 'warn', 'Execution cancelled by user');
      return true;
    }
    return false;
  }

  async generatePlaybookFromTicket(ticket: TicketContext): Promise<string> {
    try {
      // Use AI to generate a playbook based on ticket analysis
      const prompt = `
        Based on this IT support ticket, generate a remediation playbook:
        
        Title: ${ticket.title}
        Description: ${ticket.description}
        Category: ${ticket.category}
        Priority: ${ticket.priority}
        Tags: ${ticket.tags.join(', ')}
        
        Generate a JSON playbook with:
        1. Appropriate triggers for this type of issue
        2. Safety conditions to check before execution
        3. Step-by-step remediation actions
        4. Rollback procedures
        5. Success criteria to validate resolution
        
        Focus on automation-friendly actions that can be safely executed without human intervention.
      `;

      const response = await aiService.sendMessage([
        { role: 'user', content: prompt }
      ]);

      // Parse AI response and create playbook
      const aiPlaybook = JSON.parse(response.content);
      const playbookId = await this.createPlaybook(aiPlaybook);
      
      return playbookId;
    } catch (error) {
      console.error('Error generating playbook from ticket:', error);
      throw new Error('Failed to generate playbook from ticket');
    }
  }

  getPlaybookMetrics(): {
    totalPlaybooks: number;
    activeExecutions: number;
    averageSuccessRate: number;
    totalExecutions: number;
    averageExecutionTime: number;
  } {
    const playbooks = Array.from(this.playbooks.values());
    
    return {
      totalPlaybooks: playbooks.length,
      activeExecutions: this.activeExecutions.size,
      averageSuccessRate: playbooks.reduce((sum, p) => sum + p.metadata.successRate, 0) / playbooks.length,
      totalExecutions: playbooks.reduce((sum, p) => sum + p.metadata.executionCount, 0),
      averageExecutionTime: playbooks.reduce((sum, p) => sum + p.metadata.averageExecutionTime, 0) / playbooks.length
    };
  }
}

export default new SelfHealingPlaybooksService();