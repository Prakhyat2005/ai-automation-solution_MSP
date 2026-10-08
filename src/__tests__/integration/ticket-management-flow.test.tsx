import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { TicketManagement } from '../../components/TicketManagement'

// Mock the AppContext with ticket data
const mockTickets = [
  {
    id: '1',
    title: 'Server Down',
    description: 'Main server is not responding',
    status: 'open',
    priority: 'high',
    client: 'Client A',
    assignee: 'John Doe',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Email Issues',
    description: 'Users cannot send emails',
    status: 'in-progress',
    priority: 'medium',
    client: 'Client B',
    assignee: 'Jane Smith',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z'
  }
]

const mockAppContext = {
  state: {
    tickets: [
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
    ],
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
    theme: 'light' as const,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    dashboard: {
      defaultView: 'tickets',
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
  useApp: vi.fn()
}))

// Get the mocked function after the mock is created
const { useApp } = await import('../../contexts/AppContext')
const mockedUseApp = vi.mocked(useApp)
mockedUseApp.mockImplementation(() => mockAppContext)

vi.mock('../../contexts/WebSocketContext', () => ({
  useWebSocket: () => ({
    socket: {
      connected: true,
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn()
    },
    ticketUpdates: [],
    sendNotification: vi.fn()
  })
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

describe('Ticket Management Integration Flow', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders ticket management interface with tickets', () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    expect(screen.getByText('Ticket Management')).toBeInTheDocument()
    expect(screen.getByText('Server Down')).toBeInTheDocument()
    expect(screen.getByText('Email Issues')).toBeInTheDocument()
  })

  it('allows searching for tickets', async () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search tickets...')
    await user.type(searchInput, 'Server')

    // The search should filter tickets (implementation dependent)
    expect(searchInput).toHaveValue('Server')
  })

  it('allows filtering tickets by status', async () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    const statusFilter = screen.getByDisplayValue('All Status')
    await user.selectOptions(statusFilter, 'open')

    expect(statusFilter).toHaveValue('open')
  })

  it('allows filtering tickets by priority', async () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    const priorityFilter = screen.getByDisplayValue('All Priority')
    await user.selectOptions(priorityFilter, 'high')

    expect(priorityFilter).toHaveValue('high')
  })

  it('displays ticket statistics correctly', () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    // Should show total tickets
    expect(screen.getByText('2')).toBeInTheDocument()
    
    // Should show status counts
    expect(screen.getByText('1')).toBeInTheDocument() // Open tickets
    expect(screen.getByText('1')).toBeInTheDocument() // In Progress tickets
  })

  it('allows selecting individual tickets', async () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    const checkboxes = screen.getAllByRole('checkbox')
    const firstTicketCheckbox = checkboxes[1] // Skip the "select all" checkbox

    await user.click(firstTicketCheckbox)
    expect(firstTicketCheckbox).toBeChecked()
  })

  it('allows selecting all tickets', async () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    await user.click(selectAllCheckbox)

    // All ticket checkboxes should be checked
    const ticketCheckboxes = screen.getAllByRole('checkbox').slice(1)
    ticketCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked()
    })
  })

  it('shows bulk actions when tickets are selected', async () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    const checkboxes = screen.getAllByRole('checkbox')
    const firstTicketCheckbox = checkboxes[1]
    await user.click(firstTicketCheckbox)

    // Bulk actions should be visible
    expect(screen.getByText('Bulk Actions')).toBeInTheDocument()
  })

  it('opens create ticket modal when create button is clicked', async () => {
    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    const createButton = screen.getByText('Create Ticket')
    await user.click(createButton)

    // Modal should open (assuming it renders a dialog)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('handles error states gracefully', () => {
    // Mock error state
    const errorContext = { 
      ...mockAppContext, 
      state: { ...mockAppContext.state, error: 'Failed to load tickets' }
    }
    mockedUseApp.mockReturnValue(errorContext)

    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    // Should display error message
    expect(screen.getByText('Failed to load tickets')).toBeInTheDocument()
  })

  it('shows loading state when fetching tickets', () => {
    // Mock loading state
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
    mockedUseApp.mockReturnValue(loadingContext)

    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    // Should show skeleton loading
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('calls retry function when retry button is clicked', async () => {
    // Mock error state
    const errorContext = { 
      ...mockAppContext, 
      state: { ...mockAppContext.state, error: 'Failed to load tickets' }
    }
    mockedUseApp.mockReturnValue(errorContext)

    render(
      <BrowserRouter>
        <TicketManagement />
      </BrowserRouter>
    )

    const retryButton = screen.getByText('Retry')
    await user.click(retryButton)

    expect(mockAppContext.actions.loadTickets).toHaveBeenCalled()
  })
})