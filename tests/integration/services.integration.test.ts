import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';

// Import all services
import { ticketAnalysisService } from '../../src/services/ticketAnalysis';
import { mlEngineService } from '../../src/services/mlEngine';
import { rootCauseAnalysisService } from '../../src/services/rootCauseAnalysis';
import { predictiveAnalyticsService } from '../../src/services/predictiveAnalytics';
import { resourceOrchestrationService } from '../../src/services/resourceOrchestration';
import { selfHealingPlaybooksService } from '../../src/services/selfHealingPlaybooks';
import { clientCommunicationService } from '../../src/services/clientCommunication';
import { skillGapAnalysisService } from '../../src/services/skillGapAnalysis';

// Import types
import { Ticket, TicketPriority, TicketStatus } from '../../src/services/ticketAnalysis';
import { IncidentContext } from '../../src/services/rootCauseAnalysis';
import { PredictiveModel } from '../../src/services/predictiveAnalytics';
import { ResourcePool, Workload } from '../../src/services/resourceOrchestration';
import { PlaybookExecution } from '../../src/services/selfHealingPlaybooks';
import { Employee, SkillGapAnalysis } from '../../src/services/skillGapAnalysis';

describe('AI Automation Solution - Integration Tests', () => {
  let testTicketId: string;
  let testEmployeeId: string;
  let testResourcePoolId: string;
  let testPlaybookId: string;

  beforeAll(async () => {
    // Initialize test data
    testTicketId = uuidv4();
    testEmployeeId = uuidv4();
    testResourcePoolId = uuidv4();
    testPlaybookId = uuidv4();
  });

  afterAll(async () => {
    // Cleanup services
    await ticketAnalysisService.destroy();
    await mlEngineService.destroy();
    await rootCauseAnalysisService.destroy();
    await predictiveAnalyticsService.destroy();
    await resourceOrchestrationService.destroy();
    await selfHealingPlaybooksService.destroy();
    await clientCommunicationService.destroy();
    await skillGapAnalysisService.destroy();
  });

  beforeEach(() => {
    // Reset any service state if needed
  });

  describe('End-to-End Ticket Processing Workflow', () => {
    it('should process a ticket through the complete automation pipeline', async () => {
      // Step 1: Create and analyze a ticket
      const ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Server Performance Issues',
        description: 'Production server experiencing high CPU usage and slow response times',
        clientId: 'client-123',
        priority: 'high' as TicketPriority,
        status: 'open' as TicketStatus,
        category: 'performance',
        subcategory: 'server_performance',
        tags: ['performance', 'cpu', 'server'],
        assignedTo: testEmployeeId,
        metadata: {
          serverName: 'prod-server-01',
          cpuUsage: '95%',
          responseTime: '5000ms'
        }
      };

      const createdTicket = await ticketAnalysisService.createTicket(ticket);
      expect(createdTicket).toBeDefined();
      expect(createdTicket.id).toBeDefined();

      // Step 2: Perform ML-based analysis
      const ticketContext = {
        ticketId: createdTicket.id,
        title: createdTicket.title,
        description: createdTicket.description,
        category: createdTicket.category,
        priority: createdTicket.priority,
        clientId: createdTicket.clientId,
        metadata: createdTicket.metadata
      };

      const mlAnalysis = await mlEngineService.performRootCauseAnalysis(ticketContext);
      expect(mlAnalysis).toBeDefined();
      expect(mlAnalysis.rootCause).toBeDefined();
      expect(mlAnalysis.confidence).toBeGreaterThan(0);

      // Step 3: Perform root cause analysis
      const incidentContext: IncidentContext = {
        ticketId: createdTicket.id,
        title: createdTicket.title,
        description: createdTicket.description,
        severity: 'high',
        category: createdTicket.category,
        affectedSystems: ['prod-server-01'],
        reportedBy: 'client-123',
        reportedAt: new Date(),
        initialSymptoms: ['high CPU usage', 'slow response times'],
        environmentInfo: {
          infrastructure: 'cloud',
          operatingSystem: 'linux',
          applications: ['web-server', 'database'],
          networkSegment: 'production',
          dataCenter: 'us-east-1'
        }
      };

      const rcaResult = await rootCauseAnalysisService.analyzeIncident(incidentContext);
      expect(rcaResult).toBeDefined();
      expect(rcaResult.hypotheses).toBeDefined();
      expect(rcaResult.hypotheses.length).toBeGreaterThan(0);

      // Step 4: Generate predictive insights
      const predictiveAnalysis = await predictiveAnalyticsService.performPredictiveAnalysis(
        'incident_prediction',
        {
          ticketData: createdTicket,
          historicalIncidents: [],
          systemMetrics: {
            cpuUsage: 95,
            memoryUsage: 80,
            diskUsage: 70,
            networkLatency: 150
          }
        }
      );

      expect(predictiveAnalysis).toBeDefined();
      expect(predictiveAnalysis.predictions).toBeDefined();
      expect(predictiveAnalysis.predictions.length).toBeGreaterThan(0);

      // Step 5: Check for self-healing playbooks
      const availablePlaybooks = await selfHealingPlaybooksService.findApplicablePlaybooks({
        category: createdTicket.category,
        symptoms: ['high CPU usage', 'slow response times'],
        severity: 'high',
        environment: 'production'
      });

      expect(availablePlaybooks).toBeDefined();
      expect(Array.isArray(availablePlaybooks)).toBe(true);

      // Step 6: Execute self-healing if applicable
      if (availablePlaybooks.length > 0) {
        const playbook = availablePlaybooks[0];
        const execution = await selfHealingPlaybooksService.executePlaybook(
          playbook.id,
          incidentContext
        );

        expect(execution).toBeDefined();
        expect(execution.status).toBeDefined();
      }

      // Step 7: Update ticket status
      const updatedTicket = await ticketAnalysisService.updateTicket(createdTicket.id, {
        status: 'in_progress' as TicketStatus,
        metadata: {
          ...createdTicket.metadata,
          rcaCompleted: true,
          mlAnalysisCompleted: true,
          predictiveAnalysisCompleted: true
        }
      });

      expect(updatedTicket).toBeDefined();
      expect(updatedTicket?.status).toBe('in_progress');
    });

    it('should handle resource orchestration during incident response', async () => {
      // Create a resource pool
      const resourcePool: Omit<ResourcePool, 'id' | 'createdAt' | 'lastUpdated'> = {
        name: 'Production Servers',
        type: 'compute',
        provider: 'aws',
        region: 'us-east-1',
        capacity: {
          total: 100,
          available: 60,
          allocated: 40,
          reserved: 0
        },
        resources: [
          {
            id: 'server-01',
            name: 'prod-server-01',
            type: 'ec2-instance',
            status: 'running',
            capacity: 10,
            utilization: 95,
            metadata: {
              instanceType: 't3.large',
              cpuCores: 2,
              memory: '8GB'
            }
          }
        ],
        configuration: {
          autoScaling: true,
          minCapacity: 20,
          maxCapacity: 200,
          targetUtilization: 70
        },
        tags: ['production', 'web-tier'],
        metadata: {}
      };

      const createdPool = await resourceOrchestrationService.createResourcePool(resourcePool);
      expect(createdPool).toBeDefined();
      expect(createdPool.id).toBeDefined();

      // Create a workload
      const workload: Omit<Workload, 'id' | 'createdAt' | 'lastUpdated'> = {
        name: 'High Priority Incident Response',
        type: 'incident_response',
        priority: 'high',
        requirements: {
          cpu: 4,
          memory: 16,
          storage: 100,
          network: 1000
        },
        constraints: {
          region: 'us-east-1',
          availabilityZone: 'us-east-1a',
          instanceTypes: ['t3.large', 't3.xlarge'],
          maxCost: 100
        },
        scheduling: {
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          recurrence: 'none'
        },
        status: 'pending',
        metadata: {
          ticketId: testTicketId,
          incidentType: 'performance'
        }
      };

      const createdWorkload = await resourceOrchestrationService.scheduleWorkload(workload);
      expect(createdWorkload).toBeDefined();
      expect(createdWorkload.id).toBeDefined();

      // Generate orchestration plan
      const orchestrationPlan = await resourceOrchestrationService.generateOrchestrationPlan([createdWorkload.id]);
      expect(orchestrationPlan).toBeDefined();
      expect(orchestrationPlan.workloads).toContain(createdWorkload.id);

      // Execute the plan
      const executionResult = await resourceOrchestrationService.executeOrchestrationPlan(orchestrationPlan.id);
      expect(executionResult).toBeDefined();
      expect(executionResult.success).toBe(true);
    });
  });

  describe('Skill Gap Analysis Integration', () => {
    it('should identify skill gaps based on incident patterns', async () => {
      // Create an employee
      const employee: Omit<Employee, 'id'> = {
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'System Administrator',
        department: 'IT Operations',
        seniority: 'mid',
        currentSkills: [
          {
            skillId: 'linux-admin',
            currentLevel: 'intermediate',
            proficiencyScore: 70,
            lastAssessed: new Date(),
            assessmentMethod: 'self_assessment',
            certifications: [],
            experienceYears: 3,
            confidence: 75
          }
        ],
        learningPreferences: {
          preferredMethods: ['hands_on_labs', 'video_courses'],
          timeAvailability: 10,
          pace: 'self_paced',
          format: 'online'
        },
        careerGoals: [
          {
            id: uuidv4(),
            title: 'Become Senior System Administrator',
            description: 'Advance to senior level with cloud expertise',
            targetRole: 'Senior System Administrator',
            timeline: 12,
            priority: 'high',
            requiredSkills: ['cloud-architecture', 'kubernetes', 'security'],
            status: 'active'
          }
        ],
        performanceMetrics: [
          {
            metric: 'Incident Resolution Time',
            value: 4.5,
            period: 'hours',
            benchmark: 4.0,
            trend: 'stable'
          }
        ],
        metadata: {}
      };

      const createdEmployee = await skillGapAnalysisService.createEmployee(employee);
      expect(createdEmployee).toBeDefined();
      expect(createdEmployee.id).toBeDefined();

      // Perform skill gap analysis
      const analysis = await skillGapAnalysisService.performSkillGapAnalysis(
        'individual',
        {
          includeCurrentProjects: true,
          includeFutureNeeds: true,
          includeMarketTrends: true,
          timeHorizon: 12,
          focusAreas: ['technical', 'cloud', 'security']
        },
        [createdEmployee.id]
      );

      expect(analysis).toBeDefined();
      expect(analysis.gaps).toBeDefined();
      expect(analysis.recommendations).toBeDefined();
      expect(analysis.priorityMatrix).toBeDefined();

      // Create development plan based on analysis
      const developmentPlan = await skillGapAnalysisService.createDevelopmentPlan(
        createdEmployee.id,
        analysis.id,
        [
          {
            skillId: 'cloud-architecture',
            currentLevel: 'beginner',
            targetLevel: 'intermediate',
            learningPath: 'cloud-fundamentals',
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            priority: 1
          }
        ]
      );

      expect(developmentPlan).toBeDefined();
      expect(developmentPlan.goals).toBeDefined();
      expect(developmentPlan.goals.length).toBeGreaterThan(0);
    });
  });

  describe('Client Communication Integration', () => {
    it('should send automated updates throughout incident lifecycle', async () => {
      // Create a communication channel
      const channel = await clientCommunicationService.createChannel({
        name: 'Incident Updates',
        type: 'email',
        configuration: {
          smtpServer: 'smtp.company.com',
          port: 587,
          encryption: 'tls',
          authentication: {
            username: 'notifications@company.com',
            password: 'secure-password'
          }
        },
        deliverySettings: {
          retryAttempts: 3,
          retryDelay: 300,
          timeout: 30,
          batchSize: 50
        },
        rateLimiting: {
          maxPerMinute: 60,
          maxPerHour: 1000,
          maxPerDay: 10000
        },
        isActive: true,
        metadata: {}
      });

      expect(channel).toBeDefined();
      expect(channel.id).toBeDefined();

      // Send incident notification
      const message = await clientCommunicationService.sendMessage({
        channelId: channel.id,
        recipients: ['client@example.com'],
        type: 'incident_notification',
        priority: 'high',
        subject: 'Incident Alert: Server Performance Issues',
        content: {
          text: 'We have detected performance issues with your server and are investigating.',
          html: '<p>We have detected performance issues with your server and are investigating.</p>',
          template: 'incident-alert',
          variables: {
            incidentId: testTicketId,
            severity: 'high',
            affectedServices: ['Web Server']
          }
        },
        attachments: [],
        actionButtons: [
          {
            text: 'View Status Page',
            url: 'https://status.company.com',
            style: 'primary'
          }
        ],
        scheduledAt: new Date(),
        metadata: {
          ticketId: testTicketId,
          incidentType: 'performance'
        }
      });

      expect(message).toBeDefined();
      expect(message.id).toBeDefined();
      expect(message.status).toBe('queued');

      // Process the message
      const processedMessage = await clientCommunicationService.processMessage(message.id);
      expect(processedMessage).toBeDefined();
    });
  });

  describe('Predictive Analytics Integration', () => {
    it('should generate capacity forecasts and recommendations', async () => {
      // Create a predictive model for capacity forecasting
      const model: Omit<PredictiveModel, 'id' | 'createdAt' | 'lastTrained'> = {
        name: 'Resource Capacity Forecasting',
        type: 'capacity_forecasting',
        algorithm: 'time_series',
        version: '1.0.0',
        description: 'Predicts future resource capacity needs based on historical usage',
        features: ['cpu_usage', 'memory_usage', 'network_traffic', 'storage_usage'],
        targetVariable: 'capacity_needed',
        hyperparameters: {
          lookback_window: 30,
          forecast_horizon: 7,
          seasonality: 'weekly'
        },
        performance: {
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.88,
          f1Score: 0.85,
          mse: 0.15,
          mae: 0.12,
          r2Score: 0.78
        },
        isActive: true,
        metadata: {}
      };

      const createdModel = await predictiveAnalyticsService.createModel(model);
      expect(createdModel).toBeDefined();
      expect(createdModel.id).toBeDefined();

      // Perform predictive analysis
      const analysis = await predictiveAnalyticsService.performPredictiveAnalysis(
        'capacity_forecasting',
        {
          timeRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            end: new Date()
          },
          metrics: ['cpu_usage', 'memory_usage', 'storage_usage'],
          granularity: 'hourly',
          includeSeasonality: true,
          confidenceLevel: 0.95
        }
      );

      expect(analysis).toBeDefined();
      expect(analysis.predictions).toBeDefined();
      expect(analysis.predictions.length).toBeGreaterThan(0);
      expect(analysis.insights).toBeDefined();
      expect(analysis.recommendations).toBeDefined();

      // Assess business impact
      const businessImpact = await predictiveAnalyticsService.analyzeBusinessImpact(analysis.id);
      expect(businessImpact).toBeDefined();
      expect(businessImpact.costSavings).toBeDefined();
      expect(businessImpact.riskReduction).toBeDefined();
    });
  });

  describe('Cross-Service Data Flow', () => {
    it('should maintain data consistency across all services', async () => {
      // Create a ticket that will flow through multiple services
      const ticket = await ticketAnalysisService.createTicket({
        title: 'Database Connection Issues',
        description: 'Multiple clients reporting database connection timeouts',
        clientId: 'client-456',
        priority: 'critical' as TicketPriority,
        status: 'open' as TicketStatus,
        category: 'database',
        subcategory: 'connectivity',
        tags: ['database', 'connectivity', 'timeout'],
        assignedTo: testEmployeeId,
        metadata: {
          affectedClients: 15,
          errorRate: '25%',
          avgResponseTime: '8000ms'
        }
      });

      // Verify ticket exists in ticket analysis service
      const retrievedTicket = await ticketAnalysisService.getTicket(ticket.id);
      expect(retrievedTicket).toBeDefined();
      expect(retrievedTicket?.id).toBe(ticket.id);

      // Perform ML analysis and verify data consistency
      const mlAnalysis = await mlEngineService.performRootCauseAnalysis({
        ticketId: ticket.id,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        clientId: ticket.clientId,
        metadata: ticket.metadata
      });

      expect(mlAnalysis.ticketId).toBe(ticket.id);

      // Perform RCA and verify data consistency
      const rcaResult = await rootCauseAnalysisService.analyzeIncident({
        ticketId: ticket.id,
        title: ticket.title,
        description: ticket.description,
        severity: 'critical',
        category: ticket.category,
        affectedSystems: ['database-cluster'],
        reportedBy: ticket.clientId,
        reportedAt: ticket.createdAt,
        initialSymptoms: ['connection timeouts', 'high error rate'],
        environmentInfo: {
          infrastructure: 'cloud',
          operatingSystem: 'linux',
          applications: ['database', 'connection-pool'],
          networkSegment: 'production',
          dataCenter: 'us-west-2'
        }
      });

      expect(rcaResult.ticketId).toBe(ticket.id);

      // Verify all services have consistent ticket reference
      expect(mlAnalysis.ticketId).toBe(rcaResult.ticketId);
      expect(rcaResult.ticketId).toBe(ticket.id);
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle concurrent operations across services', async () => {
      const concurrentOperations = [];
      const numOperations = 10;

      // Create multiple concurrent tickets
      for (let i = 0; i < numOperations; i++) {
        const operation = ticketAnalysisService.createTicket({
          title: `Concurrent Test Ticket ${i}`,
          description: `Test ticket for concurrent processing ${i}`,
          clientId: `client-${i}`,
          priority: 'medium' as TicketPriority,
          status: 'open' as TicketStatus,
          category: 'test',
          subcategory: 'concurrent',
          tags: ['test', 'concurrent'],
          assignedTo: testEmployeeId,
          metadata: { testIndex: i }
        });

        concurrentOperations.push(operation);
      }

      // Wait for all operations to complete
      const results = await Promise.all(concurrentOperations);

      // Verify all tickets were created successfully
      expect(results).toHaveLength(numOperations);
      results.forEach((ticket, index) => {
        expect(ticket).toBeDefined();
        expect(ticket.id).toBeDefined();
        expect(ticket.title).toBe(`Concurrent Test Ticket ${index}`);
      });

      // Verify tickets can be retrieved
      const retrievalOperations = results.map(ticket => 
        ticketAnalysisService.getTicket(ticket.id)
      );

      const retrievedTickets = await Promise.all(retrievalOperations);
      expect(retrievedTickets).toHaveLength(numOperations);
      retrievedTickets.forEach(ticket => {
        expect(ticket).toBeDefined();
        expect(ticket?.id).toBeDefined();
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should gracefully handle service failures and maintain system stability', async () => {
      // Test with invalid data
      try {
        await ticketAnalysisService.createTicket({
          title: '',
          description: '',
          clientId: '',
          priority: 'invalid' as any,
          status: 'invalid' as any,
          category: '',
          subcategory: '',
          tags: [],
          assignedTo: '',
          metadata: {}
        });
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Test with non-existent IDs
      const nonExistentTicket = await ticketAnalysisService.getTicket('non-existent-id');
      expect(nonExistentTicket).toBeNull();

      // Test service recovery after error
      const validTicket = await ticketAnalysisService.createTicket({
        title: 'Recovery Test Ticket',
        description: 'Testing service recovery after error',
        clientId: 'client-recovery',
        priority: 'low' as TicketPriority,
        status: 'open' as TicketStatus,
        category: 'test',
        subcategory: 'recovery',
        tags: ['test', 'recovery'],
        assignedTo: testEmployeeId,
        metadata: {}
      });

      expect(validTicket).toBeDefined();
      expect(validTicket.id).toBeDefined();
    });
  });

  describe('Analytics and Reporting', () => {
    it('should generate comprehensive analytics across all services', async () => {
      // Get analytics from skill gap analysis service
      const skillAnalytics = await skillGapAnalysisService.getAnalyticsReport();
      expect(skillAnalytics).toBeDefined();
      expect(skillAnalytics.totalAnalyses).toBeDefined();
      expect(skillAnalytics.gapsByCategory).toBeDefined();

      // Verify analytics data structure
      expect(typeof skillAnalytics.totalAnalyses).toBe('number');
      expect(typeof skillAnalytics.gapsByCategory).toBe('object');
      expect(typeof skillAnalytics.planProgress).toBe('object');
      expect(typeof skillAnalytics.skillDemandTrends).toBe('object');
      expect(typeof skillAnalytics.investmentAnalysis).toBe('object');
    });
  });
});

// Helper functions for testing
export const TestHelpers = {
  createTestTicket: (overrides: Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>> = {}) => ({
    title: 'Test Ticket',
    description: 'Test ticket description',
    clientId: 'test-client',
    priority: 'medium' as TicketPriority,
    status: 'open' as TicketStatus,
    category: 'test',
    subcategory: 'integration',
    tags: ['test'],
    assignedTo: 'test-employee',
    metadata: {},
    ...overrides
  }),

  createTestEmployee: (overrides: Partial<Omit<Employee, 'id'>> = {}) => ({
    name: 'Test Employee',
    email: 'test@company.com',
    role: 'Test Role',
    department: 'Test Department',
    seniority: 'mid' as const,
    currentSkills: [],
    learningPreferences: {
      preferredMethods: ['video_courses'],
      timeAvailability: 10,
      pace: 'self_paced' as const,
      format: 'online' as const
    },
    careerGoals: [],
    performanceMetrics: [],
    metadata: {},
    ...overrides
  }),

  waitForAsync: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  generateTestData: (count: number, generator: (index: number) => any) => 
    Array.from({ length: count }, (_, index) => generator(index))
};