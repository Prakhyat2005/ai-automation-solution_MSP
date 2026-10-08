import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { AuthPage } from '../../components/auth/AuthPage'
import { OverviewDashboard } from '../../components/OverviewDashboard'

// Mock the auth service
const mockAuthService = {
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
  isAuthenticated: vi.fn()
}

vi.mock('../../services/auth', () => ({
  authService: mockAuthService
}))

// Mock other dependencies
vi.mock('../../contexts/AppContext', () => ({
  useApp: () => ({
    loading: false,
    error: null,
    dashboardData: {
      systemMetrics: { cpu: 45, memory: 67, disk: 23, network: 12 },
      ticketStats: { total: 25, open: 8, inProgress: 12, resolved: 5 },
      recentTickets: [],
      alerts: []
    }
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

vi.mock('../../components/LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  Skeleton: () => <div data-testid="skeleton">Loading skeleton...</div>
}))

// Test component that uses auth
const ProtectedComponent = () => {
  return <div>Protected Content</div>
}

const TestApp = ({ initialUser = null }: { initialUser?: any }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/dashboard" element={<OverviewDashboard />} />
          <Route path="/protected" element={<ProtectedComponent />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Authentication Integration Flow', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset localStorage
    localStorage.clear()
    // Reset auth service mocks
    mockAuthService.isAuthenticated.mockReturnValue(false)
    mockAuthService.getCurrentUser.mockReturnValue(null)
  })

  it('renders login form when not authenticated', () => {
    render(<TestApp />)
    
    // Navigate to login
    window.history.pushState({}, '', '/login')
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('allows user to login with valid credentials', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    mockAuthService.login.mockResolvedValue({ user: mockUser, token: 'mock-token' })

    render(<TestApp />)
    window.history.pushState({}, '', '/login')

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('shows error message for invalid credentials', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'))

    render(<TestApp />)
    window.history.pushState({}, '', '/login')

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('shows loading state during login', async () => {
    // Mock a delayed login
    mockAuthService.login.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ user: {}, token: 'token' }), 100))
    )

    render(<TestApp />)
    window.history.pushState({}, '', '/login')

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    // Should show loading state
    expect(screen.getByText('Logging in...')).toBeInTheDocument()
  })

  it('redirects to dashboard after successful login', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    mockAuthService.login.mockResolvedValue({ user: mockUser, token: 'mock-token' })
    mockAuthService.isAuthenticated.mockReturnValue(true)
    mockAuthService.getCurrentUser.mockReturnValue(mockUser)

    render(<TestApp />)
    window.history.pushState({}, '', '/login')

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })

  it('allows user to logout', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    mockAuthService.isAuthenticated.mockReturnValue(true)
    mockAuthService.getCurrentUser.mockReturnValue(mockUser)

    render(<TestApp initialUser={mockUser} />)
    window.history.pushState({}, '', '/dashboard')

    const logoutButton = screen.getByText('Logout')
    await user.click(logoutButton)

    expect(mockAuthService.logout).toHaveBeenCalled()
  })

  it('redirects to login after logout', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    mockAuthService.isAuthenticated.mockReturnValue(true)
    mockAuthService.getCurrentUser.mockReturnValue(mockUser)
    mockAuthService.logout.mockImplementation(() => {
      mockAuthService.isAuthenticated.mockReturnValue(false)
      mockAuthService.getCurrentUser.mockReturnValue(null)
    })

    render(<TestApp initialUser={mockUser} />)
    window.history.pushState({}, '', '/dashboard')

    const logoutButton = screen.getByText('Logout')
    await user.click(logoutButton)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login')
    })
  })

  it('persists authentication state on page refresh', () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    localStorage.setItem('auth_token', 'mock-token')
    mockAuthService.isAuthenticated.mockReturnValue(true)
    mockAuthService.getCurrentUser.mockReturnValue(mockUser)

    render(<TestApp />)
    window.history.pushState({}, '', '/dashboard')

    // Should show authenticated content
    expect(screen.getByText('Overview Dashboard')).toBeInTheDocument()
  })

  it('handles expired token gracefully', async () => {
    localStorage.setItem('auth_token', 'expired-token')
    mockAuthService.isAuthenticated.mockReturnValue(false)
    mockAuthService.getCurrentUser.mockReturnValue(null)

    render(<TestApp />)
    window.history.pushState({}, '', '/dashboard')

    // Should redirect to login
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login')
    })
  })

  it('validates email format', async () => {
    render(<TestApp />)
    window.history.pushState({}, '', '/login')

    const emailInput = screen.getByLabelText('Email')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'invalid-email')
    await user.click(loginButton)

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
  })

  it('validates password requirements', async () => {
    render(<TestApp />)
    window.history.pushState({}, '', '/login')

    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(passwordInput, '123') // Too short
    await user.click(loginButton)

    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
  })

  it('shows remember me option', () => {
    render(<TestApp />)
    window.history.pushState({}, '', '/login')

    expect(screen.getByLabelText('Remember me')).toBeInTheDocument()
  })

  it('handles remember me functionality', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    mockAuthService.login.mockResolvedValue({ user: mockUser, token: 'mock-token' })

    render(<TestApp />)
    window.history.pushState({}, '', '/login')

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const rememberCheckbox = screen.getByLabelText('Remember me')
    const loginButton = screen.getByRole('button', { name: 'Login' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(rememberCheckbox)
    await user.click(loginButton)

    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123', true)
  })

  it('displays user information when authenticated', () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
    mockAuthService.isAuthenticated.mockReturnValue(true)
    mockAuthService.getCurrentUser.mockReturnValue(mockUser)

    render(<TestApp initialUser={mockUser} />)
    window.history.pushState({}, '', '/dashboard')

    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})