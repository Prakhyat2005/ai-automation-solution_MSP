import { v4 as uuidv4 } from 'uuid';

// Core Skill and Competency Interfaces
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  level: SkillLevel;
  tags: string[];
  prerequisites: string[]; // Skill IDs
  certifications: Certification[];
  marketDemand: MarketDemand;
  metadata: Record<string, any>;
}

export type SkillCategory = 
  | 'technical'
  | 'security'
  | 'cloud'
  | 'networking'
  | 'database'
  | 'programming'
  | 'devops'
  | 'project_management'
  | 'communication'
  | 'leadership'
  | 'business'
  | 'compliance'
  | 'vendor_specific';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface Certification {
  id: string;
  name: string;
  provider: string;
  validityPeriod?: number; // in months
  cost?: number;
  difficulty: SkillLevel;
  url?: string;
}

export interface MarketDemand {
  score: number; // 0-100
  trend: 'increasing' | 'stable' | 'decreasing';
  salaryImpact: number; // percentage increase
  jobOpenings: number;
  lastUpdated: Date;
}

// Employee and Team Interfaces
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  seniority: SeniorityLevel;
  currentSkills: EmployeeSkill[];
  learningPreferences: LearningPreferences;
  careerGoals: CareerGoal[];
  performanceMetrics: PerformanceMetric[];
  metadata: Record<string, any>;
}

export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'director';

export interface EmployeeSkill {
  skillId: string;
  currentLevel: SkillLevel;
  proficiencyScore: number; // 0-100
  lastAssessed: Date;
  assessmentMethod: AssessmentMethod;
  certifications: EmployeeCertification[];
  experienceYears: number;
  confidence: number; // 0-100, self-reported confidence
}

export type AssessmentMethod = 
  | 'self_assessment'
  | 'peer_review'
  | 'manager_evaluation'
  | 'technical_test'
  | 'project_performance'
  | 'certification'
  | 'ai_analysis';

export interface EmployeeCertification {
  certificationId: string;
  obtainedDate: Date;
  expiryDate?: Date;
  score?: number;
  isValid: boolean;
}

export interface LearningPreferences {
  preferredMethods: LearningMethod[];
  timeAvailability: number; // hours per week
  budget?: number;
  pace: 'self_paced' | 'structured' | 'intensive';
  format: 'online' | 'in_person' | 'hybrid';
}

export type LearningMethod = 
  | 'video_courses'
  | 'hands_on_labs'
  | 'mentoring'
  | 'workshops'
  | 'conferences'
  | 'reading'
  | 'peer_learning'
  | 'certification_prep';

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetRole?: string;
  timeline: number; // months
  priority: 'low' | 'medium' | 'high';
  requiredSkills: string[]; // Skill IDs
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  period: string;
  benchmark?: number;
  trend: 'improving' | 'stable' | 'declining';
}

// Skill Gap Analysis Interfaces
export interface SkillGapAnalysis {
  id: string;
  employeeId?: string;
  teamId?: string;
  organizationId?: string;
  analysisType: AnalysisType;
  scope: AnalysisScope;
  gaps: SkillGap[];
  recommendations: SkillRecommendation[];
  priorityMatrix: PriorityMatrix;
  businessImpact: BusinessImpact;
  timeline: AnalysisTimeline;
  generatedAt: Date;
  metadata: Record<string, any>;
}

export type AnalysisType = 'individual' | 'team' | 'department' | 'organization' | 'project_based';

export interface AnalysisScope {
  includeCurrentProjects: boolean;
  includeFutureNeeds: boolean;
  includeMarketTrends: boolean;
  timeHorizon: number; // months
  focusAreas: SkillCategory[];
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  currentLevel: SkillLevel;
  requiredLevel: SkillLevel;
  gapSeverity: GapSeverity;
  urgency: Urgency;
  impactArea: ImpactArea[];
  affectedEmployees?: string[]; // Employee IDs
  businessRisk: BusinessRisk;
  estimatedCost: CostEstimate;
}

export type GapSeverity = 'minor' | 'moderate' | 'significant' | 'critical';
export type Urgency = 'low' | 'medium' | 'high' | 'immediate';

export type ImpactArea = 
  | 'service_delivery'
  | 'customer_satisfaction'
  | 'security'
  | 'compliance'
  | 'innovation'
  | 'efficiency'
  | 'cost_management'
  | 'risk_mitigation';

export interface BusinessRisk {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  probability: number; // 0-100
  impact: number; // 0-100
  mitigationStrategies: string[];
}

export interface CostEstimate {
  trainingCost: number;
  opportunityCost: number;
  hiringCost?: number;
  totalCost: number;
  roi: number; // Return on Investment percentage
  paybackPeriod: number; // months
}

// Recommendation and Learning Path Interfaces
export interface SkillRecommendation {
  id: string;
  skillGapId: string;
  type: RecommendationType;
  title: string;
  description: string;
  learningPath: LearningPath;
  priority: number; // 1-10
  estimatedDuration: number; // hours
  estimatedCost: number;
  successMetrics: SuccessMetric[];
  dependencies: string[]; // Other recommendation IDs
  alternatives: AlternativeRecommendation[];
}

export type RecommendationType = 
  | 'training'
  | 'certification'
  | 'mentoring'
  | 'job_rotation'
  | 'project_assignment'
  | 'external_hire'
  | 'contractor'
  | 'partnership';

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  steps: LearningStep[];
  totalDuration: number; // hours
  totalCost: number;
  difficulty: SkillLevel;
  prerequisites: string[];
  outcomes: LearningOutcome[];
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: LearningMethod;
  duration: number; // hours
  cost: number;
  resources: LearningResource[];
  assessments: Assessment[];
  order: number;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'video' | 'lab' | 'documentation' | 'tool';
  provider: string;
  url?: string;
  cost: number;
  rating?: number;
  reviews?: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'practical' | 'project' | 'certification';
  passingScore: number;
  duration: number; // minutes
  attempts: number;
}

export interface LearningOutcome {
  skillId: string;
  targetLevel: SkillLevel;
  competencies: string[];
  measurableGoals: string[];
}

export interface SuccessMetric {
  name: string;
  target: number;
  unit: string;
  measurementMethod: string;
  frequency: string;
}

export interface AlternativeRecommendation {
  title: string;
  description: string;
  cost: number;
  duration: number;
  pros: string[];
  cons: string[];
}

// Priority and Planning Interfaces
export interface PriorityMatrix {
  highImpactHighUrgency: SkillGap[];
  highImpactLowUrgency: SkillGap[];
  lowImpactHighUrgency: SkillGap[];
  lowImpactLowUrgency: SkillGap[];
  recommendations: PriorityRecommendation[];
}

export interface PriorityRecommendation {
  quadrant: string;
  strategy: string;
  timeline: string;
  resources: string[];
}

export interface BusinessImpact {
  currentState: ImpactMetrics;
  projectedImprovement: ImpactMetrics;
  riskMitigation: RiskMitigation[];
  competitiveAdvantage: CompetitiveAdvantage[];
}

export interface ImpactMetrics {
  serviceQuality: number; // 0-100
  customerSatisfaction: number; // 0-100
  operationalEfficiency: number; // 0-100
  securityPosture: number; // 0-100
  innovationCapacity: number; // 0-100
  costEffectiveness: number; // 0-100
}

export interface RiskMitigation {
  risk: string;
  currentExposure: number; // 0-100
  mitigatedExposure: number; // 0-100
  mitigationActions: string[];
}

export interface CompetitiveAdvantage {
  area: string;
  currentPosition: string;
  targetPosition: string;
  enabledCapabilities: string[];
}

export interface AnalysisTimeline {
  phases: AnalysisPhase[];
  milestones: Milestone[];
  totalDuration: number; // months
  criticalPath: string[];
}

export interface AnalysisPhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  deliverables: string[];
  dependencies: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  criteria: string[];
  stakeholders: string[];
}

// Progress Tracking Interfaces
export interface SkillDevelopmentPlan {
  id: string;
  employeeId: string;
  analysisId: string;
  goals: DevelopmentGoal[];
  timeline: PlanTimeline;
  budget: PlanBudget;
  progress: ProgressTracking;
  approvals: Approval[];
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DevelopmentGoal {
  id: string;
  skillId: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  learningPath: string; // Learning Path ID
  deadline: Date;
  priority: number;
  status: GoalStatus;
  progress: number; // 0-100
}

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';

export interface PlanTimeline {
  startDate: Date;
  endDate: Date;
  phases: TimelinePhase[];
  checkpoints: Checkpoint[];
}

export interface TimelinePhase {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goals: string[]; // Goal IDs
  status: PhaseStatus;
}

export type PhaseStatus = 'upcoming' | 'active' | 'completed' | 'delayed' | 'cancelled';

export interface Checkpoint {
  id: string;
  date: Date;
  description: string;
  criteria: string[];
  completed: boolean;
  notes?: string;
}

export interface PlanBudget {
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  breakdown: BudgetBreakdown[];
}

export interface BudgetBreakdown {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface ProgressTracking {
  overallProgress: number; // 0-100
  goalProgress: GoalProgress[];
  recentActivities: Activity[];
  upcomingDeadlines: Deadline[];
}

export interface GoalProgress {
  goalId: string;
  progress: number; // 0-100
  lastUpdated: Date;
  blockers: string[];
  achievements: string[];
}

export interface Activity {
  id: string;
  type: 'training' | 'assessment' | 'project' | 'mentoring';
  description: string;
  date: Date;
  duration: number; // hours
  outcome: string;
  skillsImpacted: string[];
}

export interface Deadline {
  goalId: string;
  description: string;
  date: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'on_track' | 'at_risk' | 'overdue';
}

export interface Approval {
  id: string;
  type: 'budget' | 'timeline' | 'resources' | 'plan';
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  date: Date;
  comments?: string;
}

export type PlanStatus = 'draft' | 'pending_approval' | 'approved' | 'active' | 'completed' | 'cancelled';

// Main Service Class
export class SkillGapAnalysisService {
  private skills: Map<string, Skill> = new Map();
  private employees: Map<string, Employee> = new Map();
  private analyses: Map<string, SkillGapAnalysis> = new Map();
  private recommendations: Map<string, SkillRecommendation> = new Map();
  private learningPaths: Map<string, LearningPath> = new Map();
  private developmentPlans: Map<string, SkillDevelopmentPlan> = new Map();

  constructor() {
    this.initializeDefaultSkills();
    this.initializeDefaultLearningPaths();
  }

  // Skill Management
  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const newSkill: Skill = {
      id: uuidv4(),
      ...skill
    };

    this.skills.set(newSkill.id, newSkill);
    return newSkill;
  }

  async getSkill(skillId: string): Promise<Skill | null> {
    return this.skills.get(skillId) || null;
  }

  async getSkillsByCategory(category: SkillCategory): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(skill => skill.category === category);
  }

  async updateSkill(skillId: string, updates: Partial<Skill>): Promise<Skill | null> {
    const skill = this.skills.get(skillId);
    if (!skill) return null;

    const updatedSkill = { ...skill, ...updates };
    this.skills.set(skillId, updatedSkill);
    return updatedSkill;
  }

  async deleteSkill(skillId: string): Promise<boolean> {
    return this.skills.delete(skillId);
  }

  // Employee Management
  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const newEmployee: Employee = {
      id: uuidv4(),
      ...employee
    };

    this.employees.set(newEmployee.id, newEmployee);
    return newEmployee;
  }

  async getEmployee(employeeId: string): Promise<Employee | null> {
    return this.employees.get(employeeId) || null;
  }

  async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<Employee | null> {
    const employee = this.employees.get(employeeId);
    if (!employee) return null;

    const updatedEmployee = { ...employee, ...updates };
    this.employees.set(employeeId, updatedEmployee);
    return updatedEmployee;
  }

  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(emp => emp.department === department);
  }

  async getEmployeesByRole(role: string): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(emp => emp.role === role);
  }

  // Skill Gap Analysis
  async performSkillGapAnalysis(
    analysisType: AnalysisType,
    scope: AnalysisScope,
    targetIds: string[] // Employee IDs, Team IDs, etc.
  ): Promise<SkillGapAnalysis> {
    const analysis: SkillGapAnalysis = {
      id: uuidv4(),
      analysisType,
      scope,
      gaps: [],
      recommendations: [],
      priorityMatrix: this.createEmptyPriorityMatrix(),
      businessImpact: this.createEmptyBusinessImpact(),
      timeline: this.createEmptyTimeline(),
      generatedAt: new Date(),
      metadata: {}
    };

    // Set target IDs based on analysis type
    if (analysisType === 'individual' && targetIds.length > 0) {
      analysis.employeeId = targetIds[0];
    } else if (analysisType === 'team' && targetIds.length > 0) {
      analysis.teamId = targetIds[0];
    } else if (analysisType === 'organization' && targetIds.length > 0) {
      analysis.organizationId = targetIds[0];
    }

    // Identify skill gaps
    analysis.gaps = await this.identifySkillGaps(analysisType, targetIds, scope);

    // Generate recommendations
    analysis.recommendations = await this.generateRecommendations(analysis.gaps);

    // Create priority matrix
    analysis.priorityMatrix = this.createPriorityMatrix(analysis.gaps);

    // Assess business impact
    analysis.businessImpact = await this.assessBusinessImpact(analysis.gaps);

    // Create timeline
    analysis.timeline = this.createAnalysisTimeline(analysis.recommendations);

    this.analyses.set(analysis.id, analysis);
    return analysis;
  }

  private async identifySkillGaps(
    analysisType: AnalysisType,
    targetIds: string[],
    scope: AnalysisScope
  ): Promise<SkillGap[]> {
    const gaps: SkillGap[] = [];
    const requiredSkills = await this.getRequiredSkills(scope);

    for (const targetId of targetIds) {
      if (analysisType === 'individual') {
        const employee = await this.getEmployee(targetId);
        if (employee) {
          const employeeGaps = await this.analyzeEmployeeSkillGaps(employee, requiredSkills);
          gaps.push(...employeeGaps);
        }
      }
      // Add logic for team and organization analysis
    }

    return gaps;
  }

  private async analyzeEmployeeSkillGaps(employee: Employee, requiredSkills: Skill[]): Promise<SkillGap[]> {
    const gaps: SkillGap[] = [];

    for (const requiredSkill of requiredSkills) {
      const employeeSkill = employee.currentSkills.find(s => s.skillId === requiredSkill.id);
      const currentLevel = employeeSkill?.currentLevel || 'beginner';
      const requiredLevel = requiredSkill.level;

      if (this.isSkillGap(currentLevel, requiredLevel)) {
        const gap: SkillGap = {
          skillId: requiredSkill.id,
          skillName: requiredSkill.name,
          currentLevel,
          requiredLevel,
          gapSeverity: this.calculateGapSeverity(currentLevel, requiredLevel),
          urgency: this.calculateUrgency(requiredSkill),
          impactArea: this.determineImpactAreas(requiredSkill),
          affectedEmployees: [employee.id],
          businessRisk: this.assessBusinessRisk(requiredSkill, currentLevel, requiredLevel),
          estimatedCost: this.estimateCost(requiredSkill, currentLevel, requiredLevel)
        };

        gaps.push(gap);
      }
    }

    return gaps;
  }

  private isSkillGap(current: SkillLevel, required: SkillLevel): boolean {
    const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
    const currentIndex = levels.indexOf(current);
    const requiredIndex = levels.indexOf(required);
    return currentIndex < requiredIndex;
  }

  private calculateGapSeverity(current: SkillLevel, required: SkillLevel): GapSeverity {
    const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
    const gap = levels.indexOf(required) - levels.indexOf(current);

    if (gap === 1) return 'minor';
    if (gap === 2) return 'moderate';
    if (gap === 3) return 'significant';
    return 'critical';
  }

  private calculateUrgency(skill: Skill): Urgency {
    // Calculate urgency based on market demand and business criticality
    const demandScore = skill.marketDemand.score;
    
    if (demandScore >= 90) return 'immediate';
    if (demandScore >= 70) return 'high';
    if (demandScore >= 50) return 'medium';
    return 'low';
  }

  private determineImpactAreas(skill: Skill): ImpactArea[] {
    const areas: ImpactArea[] = [];
    
    // Map skill categories to impact areas
    switch (skill.category) {
      case 'security':
        areas.push('security', 'compliance', 'risk_mitigation');
        break;
      case 'cloud':
        areas.push('efficiency', 'cost_management', 'innovation');
        break;
      case 'technical':
        areas.push('service_delivery', 'efficiency');
        break;
      case 'communication':
        areas.push('customer_satisfaction', 'service_delivery');
        break;
      default:
        areas.push('service_delivery');
    }

    return areas;
  }

  private assessBusinessRisk(skill: Skill, current: SkillLevel, required: SkillLevel): BusinessRisk {
    const gapSeverity = this.calculateGapSeverity(current, required);
    const demandScore = skill.marketDemand.score;

    let riskLevel: BusinessRisk['riskLevel'] = 'low';
    let probability = 30;
    let impact = 40;

    if (gapSeverity === 'critical' && demandScore >= 80) {
      riskLevel = 'critical';
      probability = 85;
      impact = 90;
    } else if (gapSeverity === 'significant' || demandScore >= 70) {
      riskLevel = 'high';
      probability = 70;
      impact = 75;
    } else if (gapSeverity === 'moderate' || demandScore >= 50) {
      riskLevel = 'medium';
      probability = 50;
      impact = 60;
    }

    return {
      riskLevel,
      description: `Skill gap in ${skill.name} may impact business operations`,
      probability,
      impact,
      mitigationStrategies: [
        'Implement targeted training program',
        'Consider external hiring',
        'Engage contractors for immediate needs',
        'Cross-train existing team members'
      ]
    };
  }

  private estimateCost(skill: Skill, current: SkillLevel, required: SkillLevel): CostEstimate {
    const gapSeverity = this.calculateGapSeverity(current, required);
    
    let trainingCost = 1000;
    let opportunityCost = 5000;
    let hiringCost = 15000;

    switch (gapSeverity) {
      case 'critical':
        trainingCost = 5000;
        opportunityCost = 25000;
        hiringCost = 50000;
        break;
      case 'significant':
        trainingCost = 3000;
        opportunityCost = 15000;
        hiringCost = 30000;
        break;
      case 'moderate':
        trainingCost = 2000;
        opportunityCost = 10000;
        hiringCost = 20000;
        break;
    }

    const totalCost = trainingCost + opportunityCost;
    const roi = skill.marketDemand.salaryImpact * 2; // Simplified ROI calculation
    const paybackPeriod = Math.ceil(totalCost / (roi * 100)) || 12; // Months, default to 12 if calculation fails

    return {
      trainingCost,
      opportunityCost,
      hiringCost,
      totalCost,
      roi,
      paybackPeriod
    };
  }

  private async getRequiredSkills(scope: AnalysisScope): Promise<Skill[]> {
    let skills = Array.from(this.skills.values());

    if (scope.focusAreas.length > 0) {
      skills = skills.filter(skill => scope.focusAreas.includes(skill.category));
    }

    if (scope.includeMarketTrends) {
      skills = skills.filter(skill => skill.marketDemand.score >= 60);
    }

    return skills;
  }

  // Recommendation Generation
  private async generateRecommendations(gaps: SkillGap[]): Promise<SkillRecommendation[]> {
    const recommendations: SkillRecommendation[] = [];

    for (const gap of gaps) {
      const skill = await this.getSkill(gap.skillId);
      if (!skill) continue;

      const recommendation = await this.createRecommendation(gap, skill);
      recommendations.push(recommendation);
      this.recommendations.set(recommendation.id, recommendation);
    }

    return recommendations;
  }

  private async createRecommendation(gap: SkillGap, skill: Skill): Promise<SkillRecommendation> {
    const learningPath = await this.findOrCreateLearningPath(skill, gap.currentLevel, gap.requiredLevel);
    
    return {
      id: uuidv4(),
      skillGapId: gap.skillId,
      type: 'training',
      title: `Develop ${skill.name} Skills`,
      description: `Bridge the skill gap in ${skill.name} from ${gap.currentLevel} to ${gap.requiredLevel}`,
      learningPath,
      priority: this.calculateRecommendationPriority(gap),
      estimatedDuration: learningPath.totalDuration,
      estimatedCost: learningPath.totalCost,
      successMetrics: [
        {
          name: 'Skill Level Achievement',
          target: this.getSkillLevelScore(gap.requiredLevel),
          unit: 'score',
          measurementMethod: 'Assessment',
          frequency: 'Monthly'
        },
        {
          name: 'Certification Completion',
          target: 1,
          unit: 'certification',
          measurementMethod: 'Verification',
          frequency: 'Upon completion'
        }
      ],
      dependencies: [],
      alternatives: this.generateAlternatives(gap, skill)
    };
  }

  private calculateRecommendationPriority(gap: SkillGap): number {
    let priority = 5; // Base priority

    // Adjust based on gap severity
    switch (gap.gapSeverity) {
      case 'critical': priority += 4; break;
      case 'significant': priority += 3; break;
      case 'moderate': priority += 2; break;
      case 'minor': priority += 1; break;
    }

    // Adjust based on urgency
    switch (gap.urgency) {
      case 'immediate': priority += 3; break;
      case 'high': priority += 2; break;
      case 'medium': priority += 1; break;
    }

    // Adjust based on business risk
    switch (gap.businessRisk.riskLevel) {
      case 'critical': priority += 2; break;
      case 'high': priority += 1; break;
    }

    return Math.min(priority, 10); // Cap at 10
  }

  private getSkillLevelScore(level: SkillLevel): number {
    const scores = {
      'beginner': 20,
      'intermediate': 40,
      'advanced': 60,
      'expert': 80,
      'master': 100
    };
    return scores[level];
  }

  private generateAlternatives(gap: SkillGap, skill: Skill): AlternativeRecommendation[] {
    const hiringCost = gap.estimatedCost.hiringCost || 15000; // Default hiring cost if undefined
    
    return [
      {
        title: 'External Hiring',
        description: `Hire external candidate with ${skill.name} expertise`,
        cost: hiringCost,
        duration: 2160, // 3 months in hours
        pros: ['Immediate expertise', 'No training time', 'Fresh perspective'],
        cons: ['Higher cost', 'Cultural fit risk', 'Longer recruitment process']
      },
      {
        title: 'Contractor Engagement',
        description: `Engage contractor for ${skill.name} requirements`,
        cost: hiringCost * 0.7,
        duration: 720, // 1 month in hours
        pros: ['Quick deployment', 'Flexible engagement', 'Specialized expertise'],
        cons: ['Temporary solution', 'Knowledge transfer challenges', 'Higher hourly rates']
      },
      {
        title: 'Partnership/Outsourcing',
        description: `Partner with external provider for ${skill.name} services`,
        cost: gap.estimatedCost.totalCost * 1.5,
        duration: 2160, // 3 months setup
        pros: ['Reduced internal burden', 'Access to specialized teams', 'Scalable solution'],
        cons: ['Dependency on external provider', 'Less control', 'Potential security concerns']
      }
    ];
  }

  private async findOrCreateLearningPath(skill: Skill, currentLevel: SkillLevel, targetLevel: SkillLevel): Promise<LearningPath> {
    // Try to find existing learning path
    const existingPath = Array.from(this.learningPaths.values()).find(path => 
      path.name.includes(skill.name) && 
      path.outcomes.some(outcome => outcome.targetLevel === targetLevel)
    );

    if (existingPath) {
      return existingPath;
    }

    // Create new learning path
    const learningPath = this.createLearningPath(skill, currentLevel, targetLevel);
    this.learningPaths.set(learningPath.id, learningPath);
    return learningPath;
  }

  private createLearningPath(skill: Skill, currentLevel: SkillLevel, targetLevel: SkillLevel): LearningPath {
    const steps: LearningStep[] = [];
    let totalDuration = 0;
    let totalCost = 0;

    // Generate learning steps based on skill and level progression
    const levelProgression = this.getLevelProgression(currentLevel, targetLevel);
    
    for (let i = 0; i < levelProgression.length; i++) {
      const step = this.createLearningStep(skill, levelProgression[i], i + 1);
      steps.push(step);
      totalDuration += step.duration;
      totalCost += step.cost;
    }

    return {
      id: uuidv4(),
      name: `${skill.name} Mastery Path`,
      description: `Comprehensive learning path to advance ${skill.name} skills from ${currentLevel} to ${targetLevel}`,
      steps,
      totalDuration,
      totalCost,
      difficulty: targetLevel,
      prerequisites: skill.prerequisites,
      outcomes: [
        {
          skillId: skill.id,
          targetLevel,
          competencies: [`Advanced ${skill.name}`, `${skill.name} Best Practices`, `${skill.name} Troubleshooting`],
          measurableGoals: [
            `Achieve ${targetLevel} proficiency in ${skill.name}`,
            `Complete practical projects using ${skill.name}`,
            `Pass certification exam if applicable`
          ]
        }
      ]
    };
  }

  private getLevelProgression(current: SkillLevel, target: SkillLevel): SkillLevel[] {
    const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
    const currentIndex = levels.indexOf(current);
    const targetIndex = levels.indexOf(target);
    
    return levels.slice(currentIndex + 1, targetIndex + 1);
  }

  private createLearningStep(skill: Skill, level: SkillLevel, order: number): LearningStep {
    const baseDuration = 40; // hours
    const baseCost = 500;

    const levelMultipliers = {
      'beginner': 1,
      'intermediate': 1.5,
      'advanced': 2,
      'expert': 2.5,
      'master': 3
    };

    const multiplier = levelMultipliers[level];
    
    return {
      id: uuidv4(),
      title: `${skill.name} - ${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
      description: `Master ${level} concepts and practices in ${skill.name}`,
      type: 'video_courses',
      duration: baseDuration * multiplier,
      cost: baseCost * multiplier,
      resources: [
        {
          id: uuidv4(),
          title: `${skill.name} ${level} Course`,
          type: 'course',
          provider: 'Learning Platform',
          cost: baseCost * multiplier * 0.8,
          rating: 4.5,
          reviews: 1250
        },
        {
          id: uuidv4(),
          title: `${skill.name} Hands-on Lab`,
          type: 'lab',
          provider: 'Lab Platform',
          cost: baseCost * multiplier * 0.2,
          rating: 4.7,
          reviews: 890
        }
      ],
      assessments: [
        {
          id: uuidv4(),
          title: `${skill.name} ${level} Assessment`,
          type: 'practical',
          passingScore: 80,
          duration: 120,
          attempts: 3
        }
      ],
      order
    };
  }

  // Priority Matrix and Business Impact
  private createPriorityMatrix(gaps: SkillGap[]): PriorityMatrix {
    const matrix: PriorityMatrix = {
      highImpactHighUrgency: [],
      highImpactLowUrgency: [],
      lowImpactHighUrgency: [],
      lowImpactLowUrgency: [],
      recommendations: []
    };

    for (const gap of gaps) {
      const isHighImpact = gap.businessRisk.impact >= 70;
      const isHighUrgency = gap.urgency === 'high' || gap.urgency === 'immediate';

      if (isHighImpact && isHighUrgency) {
        matrix.highImpactHighUrgency.push(gap);
      } else if (isHighImpact && !isHighUrgency) {
        matrix.highImpactLowUrgency.push(gap);
      } else if (!isHighImpact && isHighUrgency) {
        matrix.lowImpactHighUrgency.push(gap);
      } else {
        matrix.lowImpactLowUrgency.push(gap);
      }
    }

    matrix.recommendations = [
      {
        quadrant: 'High Impact, High Urgency',
        strategy: 'Address immediately with dedicated resources',
        timeline: 'Within 1-2 months',
        resources: ['Senior trainers', 'Accelerated programs', 'External experts']
      },
      {
        quadrant: 'High Impact, Low Urgency',
        strategy: 'Plan comprehensive development programs',
        timeline: 'Within 3-6 months',
        resources: ['Structured learning paths', 'Mentorship programs', 'Certifications']
      },
      {
        quadrant: 'Low Impact, High Urgency',
        strategy: 'Quick wins with minimal resources',
        timeline: 'Within 2-4 weeks',
        resources: ['Online courses', 'Peer learning', 'Documentation']
      },
      {
        quadrant: 'Low Impact, Low Urgency',
        strategy: 'Include in long-term development plans',
        timeline: 'Within 6-12 months',
        resources: ['Self-paced learning', 'Optional workshops', 'Knowledge sharing']
      }
    ];

    return matrix;
  }

  private async assessBusinessImpact(gaps: SkillGap[]): Promise<BusinessImpact> {
    const currentState: ImpactMetrics = {
      serviceQuality: 75,
      customerSatisfaction: 78,
      operationalEfficiency: 72,
      securityPosture: 80,
      innovationCapacity: 65,
      costEffectiveness: 70
    };

    // Calculate projected improvements based on addressing skill gaps
    const projectedImprovement: ImpactMetrics = {
      serviceQuality: Math.min(currentState.serviceQuality + (gaps.length * 2), 95),
      customerSatisfaction: Math.min(currentState.customerSatisfaction + (gaps.length * 1.5), 95),
      operationalEfficiency: Math.min(currentState.operationalEfficiency + (gaps.length * 3), 95),
      securityPosture: Math.min(currentState.securityPosture + (gaps.filter(g => g.impactArea.includes('security')).length * 5), 95),
      innovationCapacity: Math.min(currentState.innovationCapacity + (gaps.length * 4), 95),
      costEffectiveness: Math.min(currentState.costEffectiveness + (gaps.length * 2.5), 95)
    };

    const riskMitigation: RiskMitigation[] = gaps.map(gap => ({
      risk: `${gap.skillName} skill deficiency`,
      currentExposure: gap.businessRisk.probability,
      mitigatedExposure: Math.max(gap.businessRisk.probability - 60, 10),
      mitigationActions: gap.businessRisk.mitigationStrategies
    }));

    const competitiveAdvantage: CompetitiveAdvantage[] = [
      {
        area: 'Technical Excellence',
        currentPosition: 'Competitive',
        targetPosition: 'Industry Leading',
        enabledCapabilities: ['Advanced troubleshooting', 'Proactive monitoring', 'Automation']
      },
      {
        area: 'Service Delivery',
        currentPosition: 'Standard',
        targetPosition: 'Premium',
        enabledCapabilities: ['Faster resolution times', 'Predictive maintenance', 'Custom solutions']
      }
    ];

    return {
      currentState,
      projectedImprovement,
      riskMitigation,
      competitiveAdvantage
    };
  }

  private createAnalysisTimeline(recommendations: SkillRecommendation[]): AnalysisTimeline {
    const phases: AnalysisPhase[] = [
      {
        id: uuidv4(),
        name: 'Immediate Actions',
        description: 'Address critical and high-priority skill gaps',
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        deliverables: ['Critical skill training', 'Emergency hiring', 'Contractor engagement'],
        dependencies: []
      },
      {
        id: uuidv4(),
        name: 'Short-term Development',
        description: 'Implement structured learning programs',
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
        deliverables: ['Learning path deployment', 'Certification programs', 'Mentorship setup'],
        dependencies: ['immediate-actions']
      },
      {
        id: uuidv4(),
        name: 'Long-term Strategy',
        description: 'Establish sustainable skill development framework',
        startDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 days
        deliverables: ['Continuous learning culture', 'Career development paths', 'Knowledge management'],
        dependencies: ['short-term-development']
      }
    ];

    const milestones: Milestone[] = [
      {
        id: uuidv4(),
        name: 'Critical Gaps Addressed',
        description: 'All critical skill gaps have mitigation plans in place',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        criteria: ['Training programs started', 'External resources engaged', 'Risk mitigation active'],
        stakeholders: ['HR', 'Department Managers', 'Training Coordinators']
      },
      {
        id: uuidv4(),
        name: 'Learning Programs Deployed',
        description: 'Structured learning programs are operational',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        criteria: ['Learning paths active', 'Progress tracking implemented', 'Assessments deployed'],
        stakeholders: ['Learning & Development', 'Employees', 'Managers']
      }
    ];

    return {
      phases,
      milestones,
      totalDuration: 12, // months
      criticalPath: ['immediate-actions', 'short-term-development', 'long-term-strategy']
    };
  }

  // Development Plan Management
  async createDevelopmentPlan(
    employeeId: string,
    analysisId: string,
    goals: Omit<DevelopmentGoal, 'id' | 'status' | 'progress'>[]
  ): Promise<SkillDevelopmentPlan> {
    const plan: SkillDevelopmentPlan = {
      id: uuidv4(),
      employeeId,
      analysisId,
      goals: goals.map(goal => ({
        ...goal,
        id: uuidv4(),
        status: 'not_started',
        progress: 0
      })),
      timeline: this.createPlanTimeline(goals),
      budget: this.createPlanBudget(goals),
      progress: this.initializeProgressTracking(),
      approvals: [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.developmentPlans.set(plan.id, plan);
    return plan;
  }

  private createPlanTimeline(goals: Omit<DevelopmentGoal, 'id' | 'status' | 'progress'>[]): PlanTimeline {
    const startDate = new Date();
    const endDate = new Date(Math.max(...goals.map(g => g.deadline.getTime())));

    return {
      startDate,
      endDate,
      phases: [
        {
          id: uuidv4(),
          name: 'Foundation Phase',
          startDate,
          endDate: new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000),
          goals: goals.slice(0, Math.ceil(goals.length / 3)).map(() => uuidv4()),
          status: 'upcoming'
        }
      ],
      checkpoints: [
        {
          id: uuidv4(),
          date: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
          description: '30-day progress review',
          criteria: ['Initial assessments completed', 'Learning resources accessed', 'Progress tracking active'],
          completed: false
        }
      ]
    };
  }

  private createPlanBudget(goals: Omit<DevelopmentGoal, 'id' | 'status' | 'progress'>[]): PlanBudget {
    const totalBudget = goals.length * 2000; // Estimated $2000 per goal

    return {
      totalBudget,
      allocatedBudget: totalBudget,
      spentBudget: 0,
      breakdown: [
        {
          category: 'Training Materials',
          allocated: totalBudget * 0.6,
          spent: 0,
          remaining: totalBudget * 0.6
        },
        {
          category: 'Certifications',
          allocated: totalBudget * 0.3,
          spent: 0,
          remaining: totalBudget * 0.3
        },
        {
          category: 'External Training',
          allocated: totalBudget * 0.1,
          spent: 0,
          remaining: totalBudget * 0.1
        }
      ]
    };
  }

  private initializeProgressTracking(): ProgressTracking {
    return {
      overallProgress: 0,
      goalProgress: [],
      recentActivities: [],
      upcomingDeadlines: []
    };
  }

  // Utility Methods
  private createEmptyPriorityMatrix(): PriorityMatrix {
    return {
      highImpactHighUrgency: [],
      highImpactLowUrgency: [],
      lowImpactHighUrgency: [],
      lowImpactLowUrgency: [],
      recommendations: []
    };
  }

  private createEmptyBusinessImpact(): BusinessImpact {
    return {
      currentState: {
        serviceQuality: 0,
        customerSatisfaction: 0,
        operationalEfficiency: 0,
        securityPosture: 0,
        innovationCapacity: 0,
        costEffectiveness: 0
      },
      projectedImprovement: {
        serviceQuality: 0,
        customerSatisfaction: 0,
        operationalEfficiency: 0,
        securityPosture: 0,
        innovationCapacity: 0,
        costEffectiveness: 0
      },
      riskMitigation: [],
      competitiveAdvantage: []
    };
  }

  private createEmptyTimeline(): AnalysisTimeline {
    return {
      phases: [],
      milestones: [],
      totalDuration: 0,
      criticalPath: []
    };
  }

  // Initialization Methods
  private initializeDefaultSkills(): void {
    const defaultSkills: Omit<Skill, 'id'>[] = [
      {
        name: 'Microsoft 365 Administration',
        category: 'cloud',
        description: 'Comprehensive administration of Microsoft 365 services',
        level: 'advanced',
        tags: ['microsoft', 'cloud', 'email', 'collaboration'],
        prerequisites: [],
        certifications: [
          {
            id: uuidv4(),
            name: 'Microsoft 365 Certified: Administrator Expert',
            provider: 'Microsoft',
            validityPeriod: 24,
            cost: 165,
            difficulty: 'advanced',
            url: 'https://docs.microsoft.com/en-us/learn/certifications/m365-enterprise-administrator'
          }
        ],
        marketDemand: {
          score: 85,
          trend: 'increasing',
          salaryImpact: 15,
          jobOpenings: 2500,
          lastUpdated: new Date()
        },
        metadata: {}
      },
      {
        name: 'Cybersecurity Fundamentals',
        category: 'security',
        description: 'Essential cybersecurity principles and practices',
        level: 'intermediate',
        tags: ['security', 'compliance', 'risk', 'threats'],
        prerequisites: [],
        certifications: [
          {
            id: uuidv4(),
            name: 'CompTIA Security+',
            provider: 'CompTIA',
            validityPeriod: 36,
            cost: 370,
            difficulty: 'intermediate',
            url: 'https://www.comptia.org/certifications/security'
          }
        ],
        marketDemand: {
          score: 95,
          trend: 'increasing',
          salaryImpact: 25,
          jobOpenings: 3500,
          lastUpdated: new Date()
        },
        metadata: {}
      },
      {
        name: 'AWS Cloud Architecture',
        category: 'cloud',
        description: 'Design and implement AWS cloud solutions',
        level: 'advanced',
        tags: ['aws', 'cloud', 'architecture', 'scalability'],
        prerequisites: [],
        certifications: [
          {
            id: uuidv4(),
            name: 'AWS Certified Solutions Architect',
            provider: 'Amazon Web Services',
            validityPeriod: 36,
            cost: 150,
            difficulty: 'advanced',
            url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
          }
        ],
        marketDemand: {
          score: 90,
          trend: 'increasing',
          salaryImpact: 30,
          jobOpenings: 4200,
          lastUpdated: new Date()
        },
        metadata: {}
      },
      {
        name: 'Network Troubleshooting',
        category: 'networking',
        description: 'Advanced network diagnostics and problem resolution',
        level: 'advanced',
        tags: ['networking', 'troubleshooting', 'diagnostics', 'protocols'],
        prerequisites: [],
        certifications: [
          {
            id: uuidv4(),
            name: 'Cisco CCNA',
            provider: 'Cisco',
            validityPeriod: 36,
            cost: 300,
            difficulty: 'intermediate',
            url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html'
          }
        ],
        marketDemand: {
          score: 75,
          trend: 'stable',
          salaryImpact: 20,
          jobOpenings: 1800,
          lastUpdated: new Date()
        },
        metadata: {}
      },
      {
        name: 'Customer Communication',
        category: 'communication',
        description: 'Effective client communication and relationship management',
        level: 'intermediate',
        tags: ['communication', 'customer service', 'relationship management'],
        prerequisites: [],
        certifications: [],
        marketDemand: {
          score: 70,
          trend: 'stable',
          salaryImpact: 10,
          jobOpenings: 2200,
          lastUpdated: new Date()
        },
        metadata: {}
      }
    ];

    defaultSkills.forEach(skill => {
      this.createSkill(skill);
    });
  }

  private initializeDefaultLearningPaths(): void {
    // Learning paths will be created dynamically based on skill gaps
    // This method can be used to create common learning paths
  }

  // Analytics and Reporting
  async getAnalyticsReport(organizationId?: string): Promise<Record<string, any>> {
    const analyses = Array.from(this.analyses.values());
    const plans = Array.from(this.developmentPlans.values());
    const employees = Array.from(this.employees.values());

    return {
      summary: {
        totalAnalyses: analyses.length,
        totalPlans: plans.length,
        totalEmployees: employees.length,
        averageSkillGaps: analyses.reduce((sum, a) => sum + a.gaps.length, 0) / analyses.length || 0
      },
      gapsByCategory: this.analyzeGapsByCategory(analyses),
      planProgress: this.analyzePlanProgress(plans),
      skillDemandTrends: this.analyzeSkillDemandTrends(),
      investmentAnalysis: this.analyzeInvestment(plans)
    };
  }

  private analyzeGapsByCategory(analyses: SkillGapAnalysis[]): Record<string, number> {
    const categoryGaps: Record<string, number> = {};
    
    for (const analysis of analyses) {
      for (const gap of analysis.gaps) {
        const skill = this.skills.get(gap.skillId);
        if (skill) {
          categoryGaps[skill.category] = (categoryGaps[skill.category] || 0) + 1;
        }
      }
    }

    return categoryGaps;
  }

  private analyzePlanProgress(plans: SkillDevelopmentPlan[]): Record<string, any> {
    const activePlans = plans.filter(p => p.status === 'active');
    const completedPlans = plans.filter(p => p.status === 'completed');
    
    return {
      totalPlans: plans.length,
      activePlans: activePlans.length,
      completedPlans: completedPlans.length,
      averageProgress: activePlans.reduce((sum, p) => sum + p.progress.overallProgress, 0) / activePlans.length || 0,
      onTrackPlans: activePlans.filter(p => p.progress.overallProgress >= 50).length
    };
  }

  private analyzeSkillDemandTrends(): Record<string, any> {
    const skills = Array.from(this.skills.values());
    
    return {
      highDemandSkills: skills.filter(s => s.marketDemand.score >= 80).length,
      emergingSkills: skills.filter(s => s.marketDemand.trend === 'increasing').length,
      decliningSkills: skills.filter(s => s.marketDemand.trend === 'decreasing').length,
      averageDemandScore: skills.reduce((sum, s) => sum + s.marketDemand.score, 0) / skills.length
    };
  }

  private analyzeInvestment(plans: SkillDevelopmentPlan[]): Record<string, any> {
    const totalBudget = plans.reduce((sum, p) => sum + p.budget.totalBudget, 0);
    const spentBudget = plans.reduce((sum, p) => sum + p.budget.spentBudget, 0);
    
    return {
      totalBudget,
      spentBudget,
      remainingBudget: totalBudget - spentBudget,
      utilizationRate: (spentBudget / totalBudget) * 100,
      averagePlanCost: totalBudget / plans.length || 0
    };
  }

  // Cleanup
  async destroy(): Promise<void> {
    this.skills.clear();
    this.employees.clear();
    this.analyses.clear();
    this.recommendations.clear();
    this.learningPaths.clear();
    this.developmentPlans.clear();
  }

  // Automated Skill Gap Identification System
  private automatedMonitoring: Map<string, AutomatedMonitoring> = new Map();
  private skillAlerts: Map<string, SkillAlert> = new Map();
  private skillPredictions: Map<string, SkillPrediction> = new Map();
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

  async setupAutomatedMonitoring(organizationId: string, config: Omit<AutomatedMonitoring, 'id' | 'createdAt' | 'lastUpdated'>): Promise<AutomatedMonitoring> {
    const monitoring: AutomatedMonitoring = {
      id: uuidv4(),
      ...config,
      organizationId,
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    this.automatedMonitoring.set(monitoring.id, monitoring);
    
    if (monitoring.isActive) {
      await this.startMonitoring(monitoring.id);
    }

    return monitoring;
  }

  async startMonitoring(monitoringId: string): Promise<void> {
    const monitoring = this.automatedMonitoring.get(monitoringId);
    if (!monitoring) {
      throw new Error(`Monitoring configuration not found: ${monitoringId}`);
    }

    // Initialize automated monitoring
    await this.initializeAutomatedMonitoring(monitoring);

    // Set up monitoring intervals for different frequencies
    for (const rule of monitoring.monitoringRules) {
      if (rule.isActive) {
        const intervalMs = this.getIntervalMs(rule.frequency);
        const interval = setInterval(async () => {
          await this.executeMonitoringRule(monitoring, rule);
        }, intervalMs);
        
        this.monitoringIntervals.set(`${monitoringId}-${rule.id}`, interval);
      }
    }

    // Set up scheduled analyses
    for (const scheduledAnalysis of monitoring.scheduledAnalyses) {
      if (scheduledAnalysis.isActive) {
        // Schedule analysis based on schedule configuration
        this.scheduleAnalysis(monitoring, scheduledAnalysis);
      }
    }
  }

  async stopMonitoring(monitoringId: string): Promise<void> {
    const monitoring = this.automatedMonitoring.get(monitoringId);
    if (!monitoring) {
      throw new Error(`Monitoring configuration not found: ${monitoringId}`);
    }

    // Clear all intervals for this monitoring
    for (const [key, interval] of Array.from(this.monitoringIntervals.entries())) {
      if (key.startsWith(monitoringId)) {
        clearInterval(interval);
        this.monitoringIntervals.delete(key);
      }
    }

    // Update monitoring status
    monitoring.isActive = false;
    monitoring.lastUpdated = new Date();
  }

  private async executeMonitoringRule(monitoring: AutomatedMonitoring, rule: MonitoringRule): Promise<void> {
    try {
      // Evaluate trigger conditions
      const triggered = await this.evaluateTriggerConditions(monitoring, rule);
      
      if (triggered) {
        // Execute automated actions
        for (const action of rule.actions) {
          await this.executeAutomatedAction(monitoring, rule, action);
        }
      }
    } catch (error) {
      console.error(`Error executing monitoring rule ${rule.id}:`, error);
    }
  }

  private async evaluateTriggerConditions(monitoring: AutomatedMonitoring, rule: MonitoringRule): Promise<boolean> {
    for (const condition of rule.triggerConditions) {
      const conditionMet = await this.evaluateCondition(monitoring, condition);
      if (!conditionMet) {
        return false; // All conditions must be met
      }
    }
    return true;
  }

  private async evaluateCondition(monitoring: AutomatedMonitoring, condition: TriggerCondition): Promise<boolean> {
    switch (condition.type) {
      case 'skill_gap_detected':
        return await this.evaluateSkillGapCondition(monitoring, condition);
      case 'performance_decline':
        return await this.evaluatePerformanceCondition(monitoring, condition);
      case 'market_demand_change':
        return await this.evaluateMarketCondition(monitoring, condition);
      case 'certification_expiry':
        return await this.evaluateCertificationCondition(monitoring, condition);
      case 'project_requirement':
        return await this.evaluateProjectCondition(monitoring, condition);
      default:
        return false;
    }
  }

  private async evaluateSkillGapCondition(monitoring: AutomatedMonitoring, condition: TriggerCondition): Promise<boolean> {
    // Get recent analyses for the organization
    const analyses = Array.from(this.analyses.values())
      .filter(analysis => analysis.organizationId === monitoring.organizationId);

    for (const analysis of analyses) {
      const criticalGaps = analysis.gaps.filter(gap => 
        gap.gapSeverity === 'critical' || gap.urgency === 'immediate'
      );

      if (criticalGaps.length >= condition.threshold) {
        return true;
      }
    }

    return false;
  }

  private async evaluatePerformanceCondition(monitoring: AutomatedMonitoring, condition: TriggerCondition): Promise<boolean> {
    // Evaluate performance metrics from real-time tracking
    const realTimeData = monitoring.realTimeTracking;
    const decliningMetrics = realTimeData.performanceMetrics.filter(metric => 
      metric.trend === 'declining' && 
      Math.abs(metric.changePercentage) >= condition.threshold
    );

    return decliningMetrics.length > 0;
  }

  private async evaluateMarketCondition(monitoring: AutomatedMonitoring, condition: TriggerCondition): Promise<boolean> {
    const marketData = monitoring.realTimeTracking.marketTrends;
    const significantChanges = marketData.filter(trend => 
      trend.obsolescenceRisk >= condition.threshold
    );

    return significantChanges.length > 0;
  }

  private async evaluateCertificationCondition(monitoring: AutomatedMonitoring, condition: TriggerCondition): Promise<boolean> {
    const employees = Array.from(this.employees.values());
    const expiringCertifications = employees.flatMap(employee => 
      employee.currentSkills.flatMap(skill => 
        skill.certifications.filter(cert => {
          if (!cert.expiryDate) return false;
          const daysUntilExpiry = Math.ceil(
            (cert.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysUntilExpiry <= condition.threshold;
        })
      )
    );

    return expiringCertifications.length > 0;
  }

  private async evaluateProjectCondition(monitoring: AutomatedMonitoring, condition: TriggerCondition): Promise<boolean> {
    const projectRequirements = monitoring.realTimeTracking.projectRequirements;
    const underCoveredProjects = projectRequirements.filter(project => 
      project.currentCoverage < condition.threshold
    );

    return underCoveredProjects.length > 0;
  }

  private async executeAutomatedAction(monitoring: AutomatedMonitoring, rule: MonitoringRule, action: AutomatedAction): Promise<void> {
    switch (action.type) {
      case 'send_alert':
        await this.createSkillAlert(monitoring, rule, action);
        break;
      case 'create_analysis':
        await this.triggerAutomatedAnalysis(monitoring, action);
        break;
      case 'generate_recommendation':
        await this.generateAutomatedRecommendation(monitoring, action);
        break;
      case 'schedule_training':
        await this.scheduleAutomatedTraining(monitoring, action);
        break;
      case 'notify_manager':
        await this.notifyManager(monitoring, rule, action);
        break;
    }
  }

  private async createSkillAlert(monitoring: AutomatedMonitoring, rule: MonitoringRule, action: AutomatedAction): Promise<SkillAlert> {
    const alert: SkillAlert = {
      id: uuidv4(),
      type: action.parameters.alertType || 'skill_gap_critical',
      severity: action.priority === 'critical' ? 'critical' : 
                action.priority === 'high' ? 'error' : 
                action.priority === 'medium' ? 'warning' : 'info',
      title: action.parameters.title || `Skill Gap Alert: ${rule.name}`,
      message: action.parameters.message || `Monitoring rule "${rule.name}" has been triggered`,
      affectedEntities: action.parameters.affectedEntities || [],
      recommendations: action.parameters.recommendations || [],
      createdAt: new Date(),
      status: 'active'
    };

    this.skillAlerts.set(alert.id, alert);
    return alert;
  }

  private async triggerAutomatedAnalysis(monitoring: AutomatedMonitoring, action: AutomatedAction): Promise<void> {
    const analysisType: AnalysisType = action.parameters.analysisType || 'organization';
    const scope: AnalysisScope = {
      includeCurrentProjects: true,
      includeFutureNeeds: true,
      includeMarketTrends: true,
      timeHorizon: action.parameters.timeHorizon || 12,
      focusAreas: action.parameters.focusAreas || []
    };

    await this.performSkillGapAnalysis(analysisType, scope, [monitoring.organizationId]);
  }

  private async generateAutomatedRecommendation(monitoring: AutomatedMonitoring, action: AutomatedAction): Promise<void> {
    // Generate recommendations based on current gaps
    const analyses = Array.from(this.analyses.values())
      .filter(analysis => analysis.organizationId === monitoring.organizationId);

    for (const analysis of analyses) {
      const recommendations = await this.generateRecommendations(analysis.gaps);
      // Store or process recommendations as needed
    }
  }

  private async scheduleAutomatedTraining(monitoring: AutomatedMonitoring, action: AutomatedAction): Promise<void> {
    // Implementation for automated training scheduling
    // This would integrate with learning management systems
    console.log(`Scheduling automated training for organization ${monitoring.organizationId}`);
  }

  private async notifyManager(monitoring: AutomatedMonitoring, rule: MonitoringRule, action: AutomatedAction): Promise<void> {
    // Implementation for manager notifications
    // This would integrate with communication systems
    console.log(`Notifying managers about rule trigger: ${rule.name}`);
  }

  private scheduleAnalysis(monitoring: AutomatedMonitoring, scheduledAnalysis: ScheduledAnalysis): void {
    // Implementation for scheduling analyses based on cron-like schedules
    // This would use a proper scheduler in production
    console.log(`Scheduling analysis: ${scheduledAnalysis.name}`);
  }

  async processRealTimeAssessment(assessment: RealTimeAssessment): Promise<void> {
    // Update employee skill data based on real-time assessment
    const employee = this.employees.get(assessment.employeeId);
    if (!employee) return;

    const skillIndex = employee.currentSkills.findIndex(skill => skill.skillId === assessment.skillId);
    if (skillIndex !== -1) {
      // Update skill proficiency based on assessment
      const currentSkill = employee.currentSkills[skillIndex];
      const weightedScore = (currentSkill.proficiencyScore * 0.7) + (assessment.score * 0.3);
      
      employee.currentSkills[skillIndex] = {
        ...currentSkill,
        proficiencyScore: Math.round(weightedScore),
        lastAssessed: assessment.timestamp,
        assessmentMethod: assessment.assessmentType as AssessmentMethod
      };

      // Trigger monitoring rules if significant change
      const changeThreshold = 10; // 10% change threshold
      if (Math.abs(assessment.score - currentSkill.proficiencyScore) >= changeThreshold) {
        await this.checkMonitoringRules(assessment.employeeId, assessment.skillId);
      }
    }
  }

  private async checkMonitoringRules(employeeId: string, skillId: string): Promise<void> {
    // Check if any monitoring rules should be triggered
    for (const monitoring of Array.from(this.automatedMonitoring.values())) {
      if (monitoring.isActive) {
        for (const rule of monitoring.monitoringRules) {
          if (rule.isActive) {
            await this.executeMonitoringRule(monitoring, rule);
          }
        }
      }
    }
  }

  async updateMarketTrends(marketData: MarketTrendData[]): Promise<void> {
    // Update market trend data for skills
    for (const trend of marketData) {
      const skill = this.skills.get(trend.skillId);
      if (skill) {
        skill.marketDemand = {
          score: trend.demandScore,
          trend: trend.demandScore > skill.marketDemand.score ? 'increasing' : 
                 trend.demandScore < skill.marketDemand.score ? 'decreasing' : 'stable',
          salaryImpact: trend.salaryTrend,
          jobOpenings: trend.jobOpenings,
          lastUpdated: trend.lastUpdated
        };

        // Check for significant market changes
        await this.checkMarketChangeAlerts(skill, trend);
      }
    }
  }

  private async checkMarketChangeAlerts(skill: Skill, trend: MarketTrendData): Promise<void> {
    // Create alerts for significant market changes
    if (trend.obsolescenceRisk > 70) {
      await this.createMarketAlert(skill, 'high_obsolescence_risk', trend);
    }
    
    if (trend.demandScore > 80 && skill.marketDemand.score < 60) {
      await this.createMarketAlert(skill, 'emerging_demand', trend);
    }
  }

  private async createMarketAlert(skill: Skill, alertType: string, trend: MarketTrendData): Promise<void> {
    const alert: SkillAlert = {
      id: uuidv4(),
      type: 'market_demand_shift',
      severity: alertType === 'high_obsolescence_risk' ? 'critical' : 'warning',
      title: `Market Change Alert: ${skill.name}`,
      message: alertType === 'high_obsolescence_risk' 
        ? `Skill ${skill.name} has high obsolescence risk (${trend.obsolescenceRisk}%)`
        : `Emerging demand detected for ${skill.name} (demand score: ${trend.demandScore})`,
      affectedEntities: [{
        type: 'skill',
        id: skill.id,
        name: skill.name,
        impact: alertType === 'high_obsolescence_risk' ? 'critical' : 'medium'
      }],
      recommendations: this.generateMarketRecommendations(skill, trend, alertType),
      createdAt: new Date(),
      status: 'active'
    };

    this.skillAlerts.set(alert.id, alert);
  }

  private generateMarketRecommendations(skill: Skill, trend: MarketTrendData, alertType: string): string[] {
    if (alertType === 'high_obsolescence_risk') {
      return [
        `Consider transitioning employees from ${skill.name} to emerging technologies`,
        `Evaluate replacement skills in the same category`,
        `Plan phased migration strategy for affected projects`
      ];
    } else {
      return [
        `Prioritize training in ${skill.name} for relevant team members`,
        `Consider hiring specialists in ${skill.name}`,
        `Evaluate current team capacity for ${skill.name} projects`
      ];
    }
  }

  async generateSkillPredictions(organizationId: string, timeHorizon: number = 12): Promise<SkillPrediction[]> {
    const predictions: SkillPrediction[] = [];
    const skills = Array.from(this.skills.values());

    for (const skill of skills) {
      const prediction = await this.generateSkillPrediction(skill, organizationId, timeHorizon);
      predictions.push(prediction);
    }

    return predictions;
  }

  private async generateSkillPrediction(skill: Skill, organizationId: string, timeHorizon: number): Promise<SkillPrediction> {
    const prediction: SkillPrediction = {
      skillId: skill.id,
      predictionType: 'demand_forecast',
      timeHorizon,
      confidence: this.calculatePredictionConfidence(skill),
      predictions: this.generatePredictionPoints(skill, timeHorizon),
      factors: this.identifyPredictionFactors(skill),
      recommendations: this.generatePredictionRecommendations(skill),
      generatedAt: new Date()
    };

    this.skillPredictions.set(`${skill.id}-${organizationId}`, prediction);
    return prediction;
  }

  private calculatePredictionConfidence(skill: Skill): number {
    // Calculate confidence based on data quality and market stability
    let confidence = 70; // Base confidence

    // Adjust based on market demand data recency
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - skill.marketDemand.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceUpdate < 30) confidence += 20;
    else if (daysSinceUpdate < 90) confidence += 10;
    else confidence -= 10;

    // Adjust based on market trend stability
    if (skill.marketDemand.trend === 'stable') confidence += 10;

    return Math.min(Math.max(confidence, 0), 100);
  }

  private generatePredictionPoints(skill: Skill, timeHorizon: number): PredictionPoint[] {
    const points: PredictionPoint[] = [];
    const currentDemand = skill.marketDemand.score;
    
    for (let month = 1; month <= timeHorizon; month++) {
      const baseGrowth = skill.marketDemand.trend === 'increasing' ? 2 : 
                        skill.marketDemand.trend === 'decreasing' ? -2 : 0;
      
      const optimisticValue = Math.min(currentDemand + (baseGrowth + 1) * month, 100);
      const realisticValue = Math.min(Math.max(currentDemand + baseGrowth * month, 0), 100);
      const pessimisticValue = Math.max(currentDemand + (baseGrowth - 1) * month, 0);

      points.push(
        {
          date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000),
          value: optimisticValue,
          confidence: 60,
          scenario: 'optimistic'
        },
        {
          date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000),
          value: realisticValue,
          confidence: 80,
          scenario: 'realistic'
        },
        {
          date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000),
          value: pessimisticValue,
          confidence: 70,
          scenario: 'pessimistic'
        }
      );
    }

    return points;
  }

  private identifyPredictionFactors(skill: Skill): PredictionFactor[] {
    return [
      {
        factor: 'Market Demand Trend',
        impact: skill.marketDemand.trend === 'increasing' ? 30 : 
                skill.marketDemand.trend === 'decreasing' ? -30 : 0,
        confidence: 80,
        description: `Current market trend is ${skill.marketDemand.trend}`
      },
      {
        factor: 'Job Market Activity',
        impact: Math.min(skill.marketDemand.jobOpenings / 100, 50),
        confidence: 70,
        description: `${skill.marketDemand.jobOpenings} job openings in the market`
      },
      {
        factor: 'Technology Evolution',
        impact: skill.category === 'technical' ? 20 : 10,
        confidence: 60,
        description: 'Technology skills tend to evolve rapidly'
      }
    ];
  }

  private generatePredictionRecommendations(skill: Skill): string[] {
    const recommendations: string[] = [];

    if (skill.marketDemand.trend === 'increasing') {
      recommendations.push(`Invest in ${skill.name} training programs`);
      recommendations.push(`Consider hiring specialists in ${skill.name}`);
    } else if (skill.marketDemand.trend === 'decreasing') {
      recommendations.push(`Plan transition strategy from ${skill.name}`);
      recommendations.push(`Identify replacement skills for ${skill.name}`);
    }

    if (skill.marketDemand.score > 80) {
      recommendations.push(`Prioritize ${skill.name} in development plans`);
    }

    return recommendations;
  }

  // Alert Management
  async getActiveAlerts(organizationId?: string): Promise<SkillAlert[]> {
    return Array.from(this.skillAlerts.values())
      .filter(alert => alert.status === 'active');
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<SkillAlert | null> {
    const alert = this.skillAlerts.get(alertId);
    if (!alert) return null;

    alert.acknowledgedAt = new Date();
    alert.status = 'acknowledged';
    return alert;
  }

  async resolveAlert(alertId: string, userId: string, resolution?: string): Promise<SkillAlert | null> {
    const alert = this.skillAlerts.get(alertId);
    if (!alert) return null;

    alert.resolvedAt = new Date();
    alert.status = 'resolved';
    return alert;
  }

  // Analytics and Reporting
  async getAutomatedAnalyticsReport(organizationId: string): Promise<Record<string, any>> {
    const monitoring = Array.from(this.automatedMonitoring.values())
      .find(m => m.organizationId === organizationId);

    if (!monitoring) {
      return { error: 'No monitoring configuration found' };
    }

    const alerts = Array.from(this.skillAlerts.values());
    const predictions = Array.from(this.skillPredictions.values())
      .filter(p => p.skillId.includes(organizationId));

    return {
      monitoringStatus: {
        isActive: monitoring.isActive,
        rulesCount: monitoring.monitoringRules.length,
        activeRules: monitoring.monitoringRules.filter(r => r.isActive).length
      },
      alertsSummary: {
        total: alerts.length,
        active: alerts.filter(a => a.status === 'active').length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        bySeverity: this.groupAlertsBySeverity(alerts)
      },
      predictionsSummary: {
        total: predictions.length,
        highConfidence: predictions.filter(p => p.confidence > 80).length,
        averageConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
      },
      realTimeMetrics: {
        assessmentsProcessed: monitoring.realTimeTracking.skillAssessments.length,
        marketTrendsTracked: monitoring.realTimeTracking.marketTrends.length,
        projectRequirements: monitoring.realTimeTracking.projectRequirements.length
      }
    };
  }

  private groupAlertsBySeverity(alerts: SkillAlert[]): Record<string, number> {
    return alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getIntervalMs(frequency: MonitoringFrequency): number {
    switch (frequency) {
      case 'real_time': return 60000; // 1 minute
      case 'hourly': return 3600000; // 1 hour
      case 'daily': return 86400000; // 24 hours
      case 'weekly': return 604800000; // 7 days
      case 'monthly': return 2592000000; // 30 days
      default: return 3600000; // Default to hourly
    }
  }

  private async initializeAutomatedMonitoring(monitoring: AutomatedMonitoring): Promise<void> {
    // Initialize real-time tracking data structures
    if (!monitoring.realTimeTracking.skillAssessments) {
      monitoring.realTimeTracking.skillAssessments = [];
    }
    if (!monitoring.realTimeTracking.performanceMetrics) {
      monitoring.realTimeTracking.performanceMetrics = [];
    }
    if (!monitoring.realTimeTracking.marketTrends) {
      monitoring.realTimeTracking.marketTrends = [];
    }
    if (!monitoring.realTimeTracking.projectRequirements) {
      monitoring.realTimeTracking.projectRequirements = [];
    }

    console.log(`Initialized automated monitoring for organization: ${monitoring.organizationId}`);
  }
}

export default SkillGapAnalysisService;



// New Automation Interfaces
export interface AutomatedMonitoring {
  id: string;
  organizationId: string;
  monitoringRules: MonitoringRule[];
  alertThresholds: AlertThreshold[];
  scheduledAnalyses: ScheduledAnalysis[];
  realTimeTracking: RealTimeTracking;
  isActive: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

export interface MonitoringRule {
  id: string;
  name: string;
  description: string;
  triggerConditions: TriggerCondition[];
  actions: AutomatedAction[];
  frequency: MonitoringFrequency;
  isActive: boolean;
}

export type MonitoringFrequency = 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface TriggerCondition {
  type: 'skill_gap_detected' | 'performance_decline' | 'market_demand_change' | 'certification_expiry' | 'project_requirement';
  parameters: Record<string, any>;
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'contains';
}

export interface AutomatedAction {
  type: 'send_alert' | 'create_analysis' | 'generate_recommendation' | 'schedule_training' | 'notify_manager';
  parameters: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AlertThreshold {
  metric: 'gap_severity' | 'skill_obsolescence' | 'team_coverage' | 'certification_compliance';
  warningLevel: number;
  criticalLevel: number;
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  level: number;
  timeDelay: number; // minutes
  recipients: string[];
  actions: string[];
}

export interface ScheduledAnalysis {
  id: string;
  name: string;
  analysisType: AnalysisType;
  scope: AnalysisScope;
  schedule: AnalysisSchedule;
  autoGenerateRecommendations: boolean;
  autoCreatePlans: boolean;
  isActive: boolean;
}

export interface AnalysisSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  timezone: string;
}

export interface RealTimeTracking {
  skillAssessments: RealTimeAssessment[];
  performanceMetrics: RealTimeMetric[];
  marketTrends: MarketTrendData[];
  projectRequirements: ProjectRequirement[];
}

export interface RealTimeAssessment {
  employeeId: string;
  skillId: string;
  assessmentType: 'project_performance' | 'peer_feedback' | 'ai_analysis' | 'certification_update';
  score: number;
  confidence: number;
  timestamp: Date;
  source: string;
}

export interface RealTimeMetric {
  employeeId: string;
  metric: string;
  value: number;
  previousValue: number;
  changePercentage: number;
  timestamp: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface MarketTrendData {
  skillId: string;
  demandScore: number;
  salaryTrend: number;
  jobOpenings: number;
  emergingTechnologies: string[];
  obsolescenceRisk: number;
  lastUpdated: Date;
}

export interface ProjectRequirement {
  projectId: string;
  requiredSkills: ProjectSkillRequirement[];
  timeline: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  currentCoverage: number; // percentage
}

export interface ProjectSkillRequirement {
  skillId: string;
  requiredLevel: SkillLevel;
  requiredCount: number;
  currentCount: number;
  gap: number;
}

// Enhanced Alert System
export interface SkillAlert {
  id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  affectedEntities: AffectedEntity[];
  recommendations: string[];
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
}

export type AlertType = 
  | 'skill_gap_critical'
  | 'certification_expiring'
  | 'performance_decline'
  | 'market_demand_shift'
  | 'team_coverage_risk'
  | 'training_overdue'
  | 'budget_threshold'
  | 'compliance_risk';

export interface AffectedEntity {
  type: 'employee' | 'team' | 'department' | 'skill' | 'project';
  id: string;
  name: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

// Predictive Analytics Interfaces
export interface SkillPrediction {
  skillId: string;
  employeeId?: string;
  teamId?: string;
  predictionType: 'demand_forecast' | 'obsolescence_risk' | 'performance_trajectory' | 'career_path';
  timeHorizon: number; // months
  confidence: number; // 0-100
  predictions: PredictionPoint[];
  factors: PredictionFactor[];
  recommendations: string[];
  generatedAt: Date;
}

export interface PredictionPoint {
  date: Date;
  value: number;
  confidence: number;
  scenario: 'optimistic' | 'realistic' | 'pessimistic';
}

export interface PredictionFactor {
  factor: string;
  impact: number; // -100 to 100
  confidence: number;
  description: string;
}