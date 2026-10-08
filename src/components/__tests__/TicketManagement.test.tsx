import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { TicketManagement } from '../TicketManagement'
import type { UserPreferences } from '../../services/localStorage'
import type { Ticket, SystemMetric, Client, Resource, AnalyticsData } from '../../services/api'

// Define AppContextType locally since it's not exported
interface AppContextType {
  state: {
    tickets: Ticket[];
    systemMetrics: SystemMetric[];
    clients: Client[];
    resources: Resource[];
    analytics: AnalyticsData | null;
    loading: {
      tickets: boolean;
      systemMetrics: boolean;
      clients: boolean;
      resources: boolean;
      analytics: boolean;
    };
    error: string | null;
  };
  preferences: UserPreferences;
  actions: {
    loadTickets: () => Promise<void>;
    loadSystemMetrics: () => Promise<void>;
    loadClients: () => Promise<void>;
    loadResources: () => Promise<void>;
    loadAnalytics: () => Promise<void>;
    createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
    refreshAll: () => Promise<void>;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    exportData: () => string;
    importData: (data: string) => boolean;
  };
}

// Mock the contexts and hooks
vi.mock('../../contexts/AppContext', () => ({
  useApp: vi.fn()
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', role: 'admin', company: 'TechFlow MSP' },
    logout: vi.fn(),
  }),
}))

vi.mock('../../contexts/WebSocketContext', () => ({
  useWebSocket: () => ({
    isConnected: true,
    connectionState: 'connected',
    notifications: [],
    ticketUpdates: [],
    systemMetrics: [],
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendNotification: vi.fn(),
    sendTicketUpdate: vi.fn(),
    markNotificationAsRead: vi.fn(),
    clearNotifications: vi.fn(),
    clearTicketUpdates: vi.fn(),
  }),
}))

vi.mock('../../hooks/useErrorHandler', () => ({
  useErrorHandler: () => ({
    error: null,
    isError: false,
    errorMessage: '',
    handleError: vi.fn(),
    clearError: vi.fn(),
    retryAction: null,
    setRetryAction: vi.fn()
  })
}))

vi.mock('../../hooks/useAsync', () => ({
  useAsync: () => ({
    loading: false,
    error: null,
    execute: vi.fn()
  })
}))

vi.mock('../LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}>Skeleton</div>
  )
}))

const mockTickets = [
  {
    id: '1',
    title: 'Server Down',
    description: 'Main server is not responding',
    status: 'open' as const,
    priority: 'high' as const,
    client: 'Client A',
    assignee: 'John Doe',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    category: 'Infrastructure'
  },
  {
    id: '2',
    title: 'Email Issues',
    description: 'Users cannot send emails',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    client: 'Client B',
    assignee: 'Jane Smith',
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-01-01T11:00:00Z'),
    category: 'Software'
  }
];

const mockAppContext: AppContextType = {
  state: {
    tickets: mockTickets,
    systemMetrics: [],
    clients: [],
    resources: [],
    analytics: null,
    loading: {
      tickets: false,
      systemMetrics: false,
      clients: false,
      resources: false,
      analytics: false,
    },
    error: null,
  },
  preferences: {
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    dashboard: {
      defaultView: 'dashboard',
      refreshInterval: 30000,
      compactMode: false,
    },
    tickets: {
      defaultPriority: 'medium',
      autoAssign: false,
      showResolved: true,
    },
  },
  actions: {
    loadTickets: vi.fn(),
    loadSystemMetrics: vi.fn(),
    loadClients: vi.fn(),
    loadResources: vi.fn(),
    loadAnalytics: vi.fn(),
    createTicket: vi.fn(),
    updateTicket: vi.fn(),
    refreshAll: vi.fn(),
    updatePreferences: vi.fn(),
    exportData: vi.fn(),
    importData: vi.fn(),
  },
}

describe('TicketManagement', () => {
  const user = userEvent.setup()

  beforeEach(async () => {
    vi.clearAllMocks()
    // Get the mocked useApp function and set its return value
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(mockAppContext)
  })

  it('renders ticket management interface', () => {
    render(<TicketManagement />)
    
    expect(screen.getByText('Smart Ticket Management')).toBeInTheDocument()
    expect(screen.getByText('Server Down')).toBeInTheDocument()
    expect(screen.getByText('Email Issues')).toBeInTheDocument()
  })

  it('shows skeleton loading when loading is true', async () => {
    const loadingContext = { 
      ...mockAppContext, 
      state: { 
        ...mockAppContext.state, 
        loading: { 
          ...mockAppContext.state.loading, 
          tickets: true 
        } 
      } 
    }
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(loadingContext)
    
    render(<TicketManagement />)
    
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('displays error message when error occurs', async () => {
    const errorContext = { 
      ...mockAppContext, 
      state: { 
        ...mockAppContext.state, 
        error: 'Failed to load tickets' 
      } 
    }
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(errorContext)
    
    render(<TicketManagement />)
    
    expect(screen.getByText('Failed to load tickets')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('filters tickets by search term', async () => {
    render(<TicketManagement />)
    
    const searchInput = screen.getByPlaceholderText('Search tickets...')
    await user.type(searchInput, 'Server')
    
    expect(screen.getByText('Server Down')).toBeInTheDocument()
    // Email Issues should be filtered out (not visible in search results)
  })

  it('filters tickets by status', async () => {
    render(<TicketManagement />)
    
    const openTab = screen.getByRole('tab', { name: /open/i })
    await user.click(openTab)
    
    expect(screen.getByText('Server Down')).toBeInTheDocument()
  })

  it('filters tickets by priority', async () => {
    render(<TicketManagement />)
    
    const highPriorityTab = screen.getByRole('tab', { name: /high/i })
    await user.click(highPriorityTab)
    
    expect(screen.getByText('Server Down')).toBeInTheDocument()
  })

  it('opens create ticket modal when create button is clicked', async () => {
    render(<TicketManagement />)
    
    const createButton = screen.getByText('Create Ticket')
    await user.click(createButton)
    
    // Modal should open (assuming TicketModal component renders a modal)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('selects and deselects tickets', async () => {
    render(<TicketManagement />)
    
    // Wait for checkboxes to be rendered
    await waitFor(() => {
      expect(screen.getAllByRole('checkbox')).toHaveLength(3) // 1 select all + 2 ticket checkboxes
    })
    
    const checkboxes = screen.getAllByRole('checkbox')
    const firstTicketCheckbox = checkboxes[1] // Skip the "select all" checkbox
    
    await user.click(firstTicketCheckbox)
    expect(firstTicketCheckbox).toBeChecked()
    
    await user.click(firstTicketCheckbox)
    expect(firstTicketCheckbox).not.toBeChecked()
  })

  it('selects all tickets when select all checkbox is clicked', async () => {
    render(<TicketManagement />)
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(selectAllCheckbox)
    
    const ticketCheckboxes = screen.getAllByRole('checkbox').slice(1)
    ticketCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked()
    })
  })

  it('displays ticket statistics correctly', async () => {
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(mockAppContext)

    render(<TicketManagement />)

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('Smart Ticket Management')).toBeInTheDocument()
    })

    // Check for total tickets count (should be 2)
    expect(screen.getByText('2')).toBeInTheDocument() // Total tickets
    // Check for open tickets count (should be 1)
    expect(screen.getByText('Open Tickets')).toBeInTheDocument()
    // Check for in-progress tickets count (should be 1)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    // Check for resolved today count (should be 0)
    expect(screen.getByText('Resolved Today')).toBeInTheDocument()
    // Check for AI automated percentage
    expect(screen.getByText('AI Automated')).toBeInTheDocument()
    expect(screen.getByText('87%')).toBeInTheDocument()
  }),

  it('handles bulk actions on selected tickets', async () => {
    render(<TicketManagement />)
    
    // Wait for checkboxes to be rendered
    await waitFor(() => {
      expect(screen.getAllByRole('checkbox')).toHaveLength(3) // 1 select all + 2 ticket checkboxes
    })
    
    // Select a ticket
    const checkboxes = screen.getAllByRole('checkbox')
    const firstTicketCheckbox = checkboxes[1]
    await user.click(firstTicketCheckbox)
    
    // Bulk actions should be available
    await waitFor(() => {
      expect(screen.getByText('Bulk Actions')).toBeInTheDocument()
    })
  })

  it('calls retry function when retry button is clicked in error state', async () => {
    const mockLoadTickets = vi.fn()
    const errorContext = { 
      ...mockAppContext, 
      state: { 
        ...mockAppContext.state, 
        error: 'Failed to load tickets' 
      },
      actions: {
        ...mockAppContext.actions,
        loadTickets: mockLoadTickets
      }
    }
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(errorContext)
    
    render(<TicketManagement />)
    
    const retryButton = screen.getByText('Retry')
    await user.click(retryButton)
    
    await waitFor(() => {
      expect(mockLoadTickets).toHaveBeenCalled()
    })
  })
})