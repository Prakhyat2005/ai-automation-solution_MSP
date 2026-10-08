// API service with AWS HTTP API integration and local mock fallback
// When `VITE_API_BASE_URL` is set, uses real backend; otherwise falls back to mocks

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee: string;
  client: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: Date;
  threshold: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive';
  lastContact: Date;
  totalTickets: number;
  openTickets: number;
}

export interface Resource {
  id: string;
  name: string;
  type: 'server' | 'workstation' | 'network' | 'software';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  assignedTo: string;
  lastMaintenance: Date;
  nextMaintenance: Date;
}

export interface AnalyticsData {
  ticketTrends: Array<{ date: string; open: number; resolved: number; }>;
  clientSatisfaction: Array<{ client: string; score: number; }>;
  resourceUtilization: Array<{ resource: string; utilization: number; }>;
  responseTime: Array<{ date: string; avgTime: number; }>;
}

// Security & Compliance
export interface ComplianceItem {
  id: string;
  framework: 'CIS' | 'HIPAA' | 'GDPR' | 'PCI_DSS' | 'ISO27001' | 'NIST' | 'Other';
  control: string;
  status: 'compliant' | 'non_compliant' | 'partially_compliant';
  severity: 'low' | 'medium' | 'high' | 'critical';
  resourceId?: string;
  description?: string;
  remediation?: string;
}

export interface MisconfigurationItem {
  type: 'S3PublicAccess' | 'IAMPolicyTooPermissive' | 'SecurityGroupOpen' | 'Other';
  resourceId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  fixAvailable: boolean;
}

export interface SecurityPosture {
  summary: { compliant: number; nonCompliant: number; partiallyCompliant: number };
  frameworks: string[];
  items: ComplianceItem[];
  misconfigurations: MisconfigurationItem[];
}

export interface GuardDutyFinding {
  id: string;
  type: string;
  severity: number;
  resource: string;
  title?: string;
  description?: string;
  recommendation?: string;
}

export interface SecurityHubFinding {
  id: string;
  title?: string;
  description?: string;
  severity?: number;
  productArn?: string;
  resource?: string;
  recordState?: string;
  complianceStatus?: string;
}

// Mock data
const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Email server down',
    description: 'Exchange server is not responding, users cannot access email',
    priority: 'critical',
    status: 'in-progress',
    assignee: 'John Tech',
    client: 'Acme Corp',
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    category: 'Infrastructure',
    estimatedHours: 4,
    actualHours: 2
  },
  {
    id: '2',
    title: 'Printer not working',
    description: 'Office printer HP LaserJet is showing error messages',
    priority: 'medium',
    status: 'open',
    assignee: 'Sarah Support',
    client: 'Tech Solutions Inc',
    createdAt: new Date('2024-01-15T11:00:00'),
    updatedAt: new Date('2024-01-15T11:00:00'),
    category: 'Hardware',
    estimatedHours: 1
  },
  {
    id: '3',
    title: 'Software license renewal',
    description: 'Microsoft Office licenses expiring next month',
    priority: 'low',
    status: 'open',
    assignee: 'Mike Manager',
    client: 'Global Enterprises',
    createdAt: new Date('2024-01-14T14:00:00'),
    updatedAt: new Date('2024-01-14T14:00:00'),
    category: 'Software',
    estimatedHours: 2
  }
];

const mockSystemMetrics: SystemMetric[] = [
  {
    id: '1',
    name: 'CPU Usage',
    value: 65,
    unit: '%',
    status: 'warning',
    lastUpdated: new Date(),
    threshold: 80
  },
  {
    id: '2',
    name: 'Memory Usage',
    value: 45,
    unit: '%',
    status: 'healthy',
    lastUpdated: new Date(),
    threshold: 85
  },
  {
    id: '3',
    name: 'Disk Space',
    value: 78,
    unit: '%',
    status: 'warning',
    lastUpdated: new Date(),
    threshold: 90
  },
  {
    id: '4',
    name: 'Network Latency',
    value: 25,
    unit: 'ms',
    status: 'healthy',
    lastUpdated: new Date(),
    threshold: 100
  }
];

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@acmecorp.com',
    company: 'Acme Corp',
    status: 'active',
    lastContact: new Date('2024-01-15T10:00:00'),
    totalTickets: 15,
    openTickets: 2
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@techsolutions.com',
    company: 'Tech Solutions Inc',
    status: 'active',
    lastContact: new Date('2024-01-14T16:30:00'),
    totalTickets: 8,
    openTickets: 1
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@globalent.com',
    company: 'Global Enterprises',
    status: 'active',
    lastContact: new Date('2024-01-13T09:15:00'),
    totalTickets: 22,
    openTickets: 3
  }
];

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'DC-SERVER-01',
    type: 'server',
    status: 'online',
    location: 'Data Center A',
    assignedTo: 'Acme Corp',
    lastMaintenance: new Date('2024-01-01T00:00:00'),
    nextMaintenance: new Date('2024-02-01T00:00:00')
  },
  {
    id: '2',
    name: 'OFFICE-PC-15',
    type: 'workstation',
    status: 'online',
    location: 'Office Floor 2',
    assignedTo: 'Tech Solutions Inc',
    lastMaintenance: new Date('2023-12-15T00:00:00'),
    nextMaintenance: new Date('2024-01-30T00:00:00')
  },
  {
    id: '3',
    name: 'NETWORK-SWITCH-A1',
    type: 'network',
    status: 'maintenance',
    location: 'Server Room',
    assignedTo: 'Global Enterprises',
    lastMaintenance: new Date('2024-01-15T08:00:00'),
    nextMaintenance: new Date('2024-02-15T00:00:00')
  }
];

const mockAnalytics: AnalyticsData = {
  ticketTrends: [
    { date: '2024-01-01', open: 12, resolved: 8 },
    { date: '2024-01-02', open: 15, resolved: 10 },
    { date: '2024-01-03', open: 8, resolved: 12 },
    { date: '2024-01-04', open: 20, resolved: 15 },
    { date: '2024-01-05', open: 18, resolved: 22 },
    { date: '2024-01-06', open: 14, resolved: 16 },
    { date: '2024-01-07', open: 16, resolved: 14 }
  ],
  clientSatisfaction: [
    { client: 'Acme Corp', score: 4.5 },
    { client: 'Tech Solutions Inc', score: 4.8 },
    { client: 'Global Enterprises', score: 4.2 },
    { client: 'StartUp LLC', score: 4.7 }
  ],
  resourceUtilization: [
    { resource: 'Servers', utilization: 75 },
    { resource: 'Workstations', utilization: 60 },
    { resource: 'Network', utilization: 45 },
    { resource: 'Storage', utilization: 80 }
  ],
  responseTime: [
    { date: '2024-01-01', avgTime: 2.5 },
    { date: '2024-01-02', avgTime: 1.8 },
    { date: '2024-01-03', avgTime: 3.2 },
    { date: '2024-01-04', avgTime: 2.1 },
    { date: '2024-01-05', avgTime: 1.9 },
    { date: '2024-01-06', avgTime: 2.8 },
    { date: '2024-01-07', avgTime: 2.3 }
  ]
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const useMock = !BASE_URL;

function toFrontendTicket(item: any): Ticket {
  // Map backend DynamoDB item shape to frontend Ticket type
  return {
    id: item.ticketId ?? item.id ?? String(item.PK)?.replace('TICKET#', ''),
    title: item.title ?? '',
    description: item.description ?? '',
    priority: (item.priority ?? 'medium') as Ticket['priority'],
    status: (item.status ?? 'open') as Ticket['status'],
    assignee: item.assignee ?? 'Unassigned',
    client: item.clientId ?? item.client ?? 'Unknown',
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    category: item.category ?? 'General',
    estimatedHours: item.estimatedHours,
    actualHours: item.actualHours,
  };
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL) throw new Error('API base URL not configured');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

// API functions with simulated delays and backend integration
export const api = {
  // Tickets
  async getTickets(): Promise<Ticket[]> {
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTickets;
    }
    try {
      const list = await http<any[]>(`/tickets`);
      return list.map(toFrontendTicket);
    } catch (err) {
      console.error('Backend getTickets failed, falling back to mock:', err);
      return mockTickets;
    }
  },

  async createTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newTicket: Ticket = {
        ...ticket,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockTickets.push(newTicket);
      return newTicket;
    }
    // Backend expects a strict payload: title, clientId, category, priority
    // Resolve clientId from known clients; if not found, use the provided value directly
    const resolvedClient = (typeof ticket.client === 'string')
      ? (mockClients.find(c => c.company === ticket.client) || null)
      : null;

    const payload: any = {
      title: ticket.title,
      category: ticket.category,
      priority: ticket.priority,
      // Use clientId when available; otherwise pass the raw string assuming it is already an ID
      clientId: resolvedClient?.id ?? ticket.client,
    };

    try {
      const created = await http<any>(`/tickets`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      // If backend returns minimal fields, fetch full item
      const id = created.ticketId ?? created.id;
      if (!id) return toFrontendTicket(created);
      const full = await http<any>(`/tickets/${id}`);
      return toFrontendTicket(full);
    } catch (err) {
      console.error('Backend createTicket failed, falling back to mock:', err);
      // Graceful local fallback so users can continue creating tickets in dev
      const newTicket: Ticket = {
        ...ticket,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTickets.push(newTicket);
      return newTicket;
    }
  },

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    if (useMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        ...updates,
        updatedAt: new Date()
      };
      return mockTickets[ticketIndex];
    }
    const payload: any = {};
    if (updates.status) payload.status = updates.status;
    if (updates.assignee) payload.assignee = updates.assignee;
    if ((updates as any).sla) payload.sla = (updates as any).sla;
    try {
      await http<any>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const full = await http<any>(`/tickets/${id}`);
      return toFrontendTicket(full);
    } catch (err) {
      console.error('Backend updateTicket failed, falling back to mock:', err);
      // Local fallback update
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        ...updates,
        updatedAt: new Date(),
      };
      return mockTickets[ticketIndex];
    }
  },

  // System Metrics
  async getSystemMetrics(): Promise<SystemMetric[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Simulate real-time updates
    return mockSystemMetrics.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * 10,
      lastUpdated: new Date()
    }));
  },

  // Clients
  async getClients(): Promise<Client[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockClients;
  },

  // Resources
  async getResources(): Promise<Resource[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    return mockResources;
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockAnalytics;
  },

  // NLP / AI Assistant
  async analyzeSentiment(text: string): Promise<{ Sentiment: string; SentimentScore: Record<string, number> }> {
    if (useMock) {
      return { Sentiment: 'NEUTRAL', SentimentScore: { Positive: 0.2, Negative: 0.2, Neutral: 0.6, Mixed: 0.0 } };
    }
    return http(`/nlp/sentiment`, { method: 'POST', body: JSON.stringify({ text, languageCode: 'en' }) });
  },

  async classifyTicket(text: string): Promise<{ category: string; priority: Ticket['priority'] }> {
    if (useMock) {
      const category = text.toLowerCase().includes('server') ? 'Infrastructure' : 'General';
      const priority: Ticket['priority'] = text.toLowerCase().includes('down') ? 'high' : 'medium';
      return { category, priority };
    }
    const res = await http<any>(`/ml/classify`, { method: 'POST', body: JSON.stringify({ text }) });
    return { category: res.category ?? 'General', priority: (res.priority ?? 'medium') as Ticket['priority'] };
  },

  async assistantRespond(text: string, sentiment?: string): Promise<{ response: string; tone: string }> {
    if (useMock) {
      return { response: 'AI is disabled. Empathy mode placeholder response.', tone: 'professional and helpful' };
    }
    const res = await http<any>(`/assistant/respond`, { method: 'POST', body: JSON.stringify({ text, sentiment }) });
    return { response: res.response, tone: res.tone };
  },

  async lexRecognizeText(text: string): Promise<any> {
    if (useMock) {
      return { intent: 'Fallback', message: 'Lex not configured', slots: {} };
    }
    return http<any>(`/assistant/lex/text`, { method: 'POST', body: JSON.stringify({ text }) });
  },

  // Security & Compliance
  async getSecurityPosture(): Promise<SecurityPosture> {
    if (useMock) {
      return {
        summary: { compliant: 42, nonCompliant: 5, partiallyCompliant: 8 },
        frameworks: ['CIS', 'HIPAA', 'GDPR'],
        items: [
          { id: 'ctrl-1', framework: 'CIS', control: 'S3.1 Public Access Block', status: 'non_compliant', severity: 'high', resourceId: 's3://customer-data', description: 'Bucket allows public READ', remediation: 'Enable Block Public Access and remove public ACLs' },
          { id: 'ctrl-2', framework: 'HIPAA', control: 'Access Controls', status: 'partially_compliant', severity: 'medium', description: 'Missing MFA for some IAM users' },
        ],
        misconfigurations: [
          { type: 'S3PublicAccess', resourceId: 'customer-data', severity: 'high', description: 'Public READ on bucket', fixAvailable: true },
          { type: 'IAMPolicyTooPermissive', resourceId: 'arn:aws:iam::123456789012:policy/AdminAccessCustom', severity: 'critical', description: 'Policy grants *:*', fixAvailable: true },
        ],
      };
    }
    return http<SecurityPosture>(`/security/posture`);
  },

  async getGuardDutyFindings(): Promise<GuardDutyFinding[]> {
    if (useMock) {
      return [
        { id: 'gd-1', type: 'Recon:EC2/PortProbeUnprotectedPort', severity: 5.3, resource: 'i-0abc123def', title: 'Port probe detected', description: 'Unprotected port probed repeatedly', recommendation: 'Restrict security group ingress' },
        { id: 'gd-2', type: 'UnauthorizedAccess:IAMUser/ConsoleLogin', severity: 7.1, resource: 'user/alice', title: 'Suspicious IAM login', description: 'Console login from unusual location', recommendation: 'Enforce MFA and review access keys' },
      ];
    }
    return http<GuardDutyFinding[]>(`/security/guardduty/findings`);
  },

  async getSecurityHubFindings(): Promise<SecurityHubFinding[]> {
    if (useMock) {
      return [
        { id: 'sh-1', title: 'IAM policy overly permissive', description: 'Allows iam:* on all resources', severity: 8.0, productArn: 'arn:aws:securityhub:region:account:product/amazon/securityhub', resource: 'arn:aws:iam::123456789012:role/LegacyAdmin', recordState: 'ACTIVE', complianceStatus: 'FAILED' },
        { id: 'sh-2', title: 'S3 bucket publicly accessible', description: 'Bucket policy permits s3:GetObject to *', severity: 7.0, productArn: 'arn:aws:securityhub:region:account:product/amazon/securityhub', resource: 'arn:aws:s3:::msp-client-archive', recordState: 'ACTIVE', complianceStatus: 'FAILED' },
      ];
    }
    return http<SecurityHubFinding[]>(`/security/hub/findings`);
  },

  async remediateIssue(input: { type: MisconfigurationItem['type']; resourceId: string }): Promise<{ status: string; details?: string }> {
    if (useMock) {
      return { status: 'remediated', details: `Dry-run: ${input.type} fixed for ${input.resourceId}` };
    }
    return http<{ status: string; details?: string }>(`/security/remediate`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  // AI Assistant
  async sendMessage(message: string): Promise<string> {
    // AI completely removed; return fixed helper text
    await new Promise(resolve => setTimeout(resolve, 300));
    return 'AI functionality is disabled in this build.';
  }
};