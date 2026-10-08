import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OverviewDashboard } from '../OverviewDashboard'

// Mock AppContext
vi.mock('../../contexts/AppContext', () => ({
  useApp: vi.fn()
}))

vi.mock('../LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}>Skeleton</div>
  )
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

describe('OverviewDashboard', () => {
  const mockAppContext = {
    state: {
      loading: {
        tickets: false,
        clients: false,
        systemMetrics: false,
        analytics: false,
        resources: false
      },
      error: null as string | null,
      tickets: [
        { 
          id: '1', 
          title: 'Test Ticket 1', 
          description: 'Test description 1',
          status: 'open' as const, 
          priority: 'high' as const, 
          client: 'Client A',
          assignee: 'John Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: 'Support'
        },
        { 
          id: '2', 
          title: 'Test Ticket 2', 
          description: 'Test description 2',
          status: 'in-progress' as const, 
          priority: 'medium' as const, 
          client: 'Client B',
          assignee: 'Jane Smith',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: 'Maintenance'
        }
      ],
      clients: [
        { 
          id: '1', 
          name: 'Client A', 
          email: 'client-a@example.com',
          company: 'Company A',
          status: 'active' as const,
          lastContact: new Date(),
          totalTickets: 5,
          openTickets: 2
        },
        { 
          id: '2', 
          name: 'Client B', 
          email: 'client-b@example.com',
          company: 'Company B',
          status: 'active' as const,
          lastContact: new Date(),
          totalTickets: 3,
          openTickets: 1
        }
      ],
      systemMetrics: [
        { 
          id: '1', 
          name: 'CPU Usage',
          value: 45, 
          unit: '%',
          status: 'healthy' as const,
          lastUpdated: new Date(),
          threshold: 80
        },
        { 
          id: '2', 
          name: 'Memory Usage',
          value: 67, 
          unit: '%',
          status: 'warning' as const,
          lastUpdated: new Date(),
          threshold: 85
        }
      ],
      resources: [],
      analytics: {
        ticketTrends: [],
        clientSatisfaction: [],
        resourceUtilization: [],
        responseTime: []
      }
    },
    preferences: {
      theme: 'light' as const,
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      dashboard: {
        defaultView: 'overview',
        refreshInterval: 30000,
        compactMode: false
      },
      tickets: {
        defaultPriority: 'medium' as const,
        autoAssign: false,
        showResolved: true
      }
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
      importData: vi.fn()
    }
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(mockAppContext)
  })

  it('renders dashboard with data when not loading', () => {
    render(<OverviewDashboard />)
    
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument()
    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument()
    expect(screen.getByText('Client A')).toBeInTheDocument()
    expect(screen.getByText('Client B')).toBeInTheDocument()
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
    
    render(<OverviewDashboard />)
    
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('displays error message when error occurs', async () => {
    const errorContext = { 
      ...mockAppContext, 
      state: { 
        ...mockAppContext.state, 
        error: 'Failed to load data' 
      } 
    }
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(errorContext)
    
    render(<OverviewDashboard />)
    
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('calls retry function when retry button is clicked', async () => {
    const errorContext = { 
      ...mockAppContext, 
      state: { 
        ...mockAppContext.state, 
        error: 'Failed to load data' 
      } 
    }
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(errorContext)
    
    render(<OverviewDashboard />)
    
    const retryButton = screen.getByText('Retry')
    fireEvent.click(retryButton)
    
    await waitFor(() => {
      expect(mockAppContext.actions.loadTickets).toHaveBeenCalled()
      expect(mockAppContext.actions.loadClients).toHaveBeenCalled()
      expect(mockAppContext.actions.loadSystemMetrics).toHaveBeenCalled()
    })
  })

  it('displays system metrics correctly', () => {
    render(<OverviewDashboard />)
    
    expect(screen.getByText('45%')).toBeInTheDocument() // CPU
    expect(screen.getByText('67%')).toBeInTheDocument() // Memory
    expect(screen.getByText('23%')).toBeInTheDocument() // Disk
    expect(screen.getByText('89%')).toBeInTheDocument() // Network
  })

  it('shows ticket statistics', () => {
    render(<OverviewDashboard />)
    
    // Should show total tickets count
    expect(screen.getByText('2')).toBeInTheDocument() // Total tickets
  })

  it('handles empty data gracefully', async () => {
    const emptyContext = {
      ...mockAppContext,
      state: {
        ...mockAppContext.state,
        tickets: [],
        clients: [],
        systemMetrics: []
      }
    }
    const { useApp } = await import('../../contexts/AppContext')
    vi.mocked(useApp).mockReturnValue(emptyContext)
    
    render(<OverviewDashboard />)
    
    expect(screen.getByText('Overview Dashboard')).toBeInTheDocument()
    // Should not crash and should handle empty states
  })
})