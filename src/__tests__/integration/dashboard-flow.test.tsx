import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '../../App'

// Mock all the contexts and services
const mockAppContext = {
  state: {
    tickets: [
      {
        id: '1',
        title: 'Server Issue',
        status: 'open' as const,
        priority: 'high' as const,
        client: 'Test Client',
        assignee: 'John Doe',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
        description: 'Server is down',
        category: 'Infrastructure'
      }
    ],
    clients: [
      { id: '1', name: 'Test Client', status: 'active' }
    ],
    systemMetrics: [
      {
        id: '1',
        timestamp: new Date('2024-01-01T10:00:00Z'),
        cpu: 45,
        memory: 67,
        disk: 23,
        network: 89
      }
    ],
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
    theme: 'light' as const,
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
      defaultPriority: 'medium' as const,
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
  }
}

vi.mock('../../contexts/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useApp: vi.fn()
}))

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false
  })
}))

vi.mock('../../contexts/WebSocketContext', () => ({
  WebSocketProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useWebSocket: () => ({
    isConnected: true,
    connectionState: 'connected',
    notifications: [],
    ticketUpdates: [],
    systemMetrics: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendMessage: vi.fn(),
    markNotificationAsRead: vi.fn(),
    clearNotifications: vi.fn()
  })
}))

// Mock react-router-dom navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  }
})

describe('Dashboard Integration Flow', () => {
  const user = userEvent.setup()

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useApp } = await import('../../contexts/AppContext')
    const mockedUseApp = vi.mocked(useApp)
    mockedUseApp.mockImplementation(() => mockAppContext)
  })

  it('renders dashboard with all components', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should render main dashboard elements
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('shows system metrics on dashboard', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should display system metrics
    expect(screen.getByText('45%')).toBeInTheDocument() // CPU
    expect(screen.getByText('67%')).toBeInTheDocument() // Memory
  })

  it('displays tickets in the dashboard', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should show ticket information
    expect(screen.getByText('Server Issue')).toBeInTheDocument()
    expect(screen.getByText('Test Client')).toBeInTheDocument()
  })

  it('allows navigation between different sections', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Try to navigate to tickets section
    const ticketsLink = screen.getByText('Tickets')
    await user.click(ticketsLink)

    // Should navigate to tickets page
    expect(mockNavigate).toHaveBeenCalledWith('/tickets')
  })

  it('handles error states gracefully', async () => {
    // Mock error state
    const errorContext = {
      ...mockAppContext,
      state: {
        ...mockAppContext.state,
        error: 'Network error',
        tickets: [],
        clients: [],
        systemMetrics: []
      }
    }
    
    const { useApp } = await import('../../contexts/AppContext')
    const mockedUseApp = vi.mocked(useApp)
    mockedUseApp.mockReturnValue(errorContext)

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should show error message
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('shows loading states appropriately', async () => {
    // Mock loading state
    const loadingContext = {
      ...mockAppContext,
      state: {
        ...mockAppContext.state,
        loading: {
          ...mockAppContext.state.loading,
          tickets: true,
          systemMetrics: true
        }
      }
    }
    
    const { useApp } = await import('../../contexts/AppContext')
    const mockedUseApp = vi.mocked(useApp)
    mockedUseApp.mockReturnValue(loadingContext)

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should show loading indicators
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})