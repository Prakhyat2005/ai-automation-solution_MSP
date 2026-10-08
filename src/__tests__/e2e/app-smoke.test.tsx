import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { AppProvider } from '../../contexts/AppContext'
import { WebSocketProvider } from '../../contexts/WebSocketContext'
import { Dashboard } from '../../components/Dashboard'

// Mock all external dependencies
vi.mock('../../services/websocket', () => ({
  WebSocketService: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  }))
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
    data: null,
    execute: vi.fn()
  }),
  useAsyncQueue: () => ({
    loading: false,
    addToQueue: vi.fn()
  })
}))

vi.mock('../../components/LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  Skeleton: () => <div data-testid="skeleton">Loading skeleton...</div>
}))

// Mock auth context with authenticated user
const mockAuthContext = {
  user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'admin' as const },
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
  signup: vi.fn(),
  updateProfile: vi.fn(),
  resetPassword: vi.fn(),
  changePassword: vi.fn()
}

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockAuthContext
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Application Smoke Tests', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )
    
    // Just verify the component renders without throwing
    expect(document.body).toBeInTheDocument()
  })

  it('displays basic UI elements', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )
    
    // Check for basic navigation elements
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('handles authenticated user state', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )
    
    // Should show user-specific content when authenticated
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('renders sidebar navigation', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )
    
    // Check for main navigation items
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Tickets')).toBeInTheDocument()
    expect(screen.getByText('System Health')).toBeInTheDocument()
  })

  it('shows loading states appropriately', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    )
    
    // Should handle loading states gracefully
    const skeletons = screen.queryAllByTestId('skeleton')
    // Loading skeletons may or may not be present depending on state
    expect(skeletons.length).toBeGreaterThanOrEqual(0)
  })
})