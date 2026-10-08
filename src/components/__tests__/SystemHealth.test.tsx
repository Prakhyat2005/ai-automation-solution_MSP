import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { SystemHealth } from '../SystemHealth'

// Mock the useAsync hook
const mockUseAsync = {
  loading: false,
  error: null as Error | null,
  execute: vi.fn(),
  data: null
}

vi.mock('../../hooks/useAsync', () => ({
  useAsync: () => mockUseAsync
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

describe('SystemHealth', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAsync.loading = false
    mockUseAsync.error = null
  })

  it('renders system health dashboard', () => {
    render(<SystemHealth />)
    
    expect(screen.getByText('System Health')).toBeInTheDocument()
    expect(screen.getByText('Run Health Check')).toBeInTheDocument()
  })

  it('shows skeleton loading when health check is running', () => {
    mockUseAsync.loading = true
    
    render(<SystemHealth />)
    
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('displays error message when health check fails', () => {
    mockUseAsync.error = new Error('Health check failed')
    
    render(<SystemHealth />)
    
    expect(screen.getByText('Failed to perform health check')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('executes health check when scan button is clicked', async () => {
    render(<SystemHealth />)
    
    const scanButton = screen.getByText('Run Health Check')
    await user.click(scanButton)
    
    expect(mockUseAsync.execute).toHaveBeenCalled()
  })

  it('disables scan button when health check is running', () => {
    mockUseAsync.loading = true
    
    render(<SystemHealth />)
    
    const scanButton = screen.getByText('Checking...')
    expect(scanButton).toBeDisabled()
  })

  it('displays system metrics and status', () => {
    render(<SystemHealth />)
    
    // Check for system components
    expect(screen.getByText('Web Server')).toBeInTheDocument()
    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('API Gateway')).toBeInTheDocument()
    expect(screen.getByText('Cache Server')).toBeInTheDocument()
    expect(screen.getByText('Message Queue')).toBeInTheDocument()
  })

  it('shows system status indicators', () => {
    render(<SystemHealth />)
    
    // Should show status indicators for each system
    const statusElements = screen.getAllByText(/Healthy|Warning|Critical/)
    expect(statusElements.length).toBeGreaterThan(0)
  })

  it('displays memory usage chart', () => {
    render(<SystemHealth />)
    
    expect(screen.getByText('Memory Usage Trend')).toBeInTheDocument()
  })

  it('shows last scan time', () => {
    render(<SystemHealth />)
    
    expect(screen.getByText(/Last scan:/)).toBeInTheDocument()
  })

  it('calls retry function when retry button is clicked in error state', async () => {
    mockUseAsync.error = new Error('Health check failed')
    
    render(<SystemHealth />)
    
    const retryButton = screen.getByText('Retry')
    await user.click(retryButton)
    
    expect(mockUseAsync.execute).toHaveBeenCalled()
  })

  it('displays system overview statistics', () => {
    render(<SystemHealth />)
    
    // Should show counts for different system statuses
    expect(screen.getByText('Systems Monitored')).toBeInTheDocument()
    expect(screen.getByText('Healthy')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('handles successful health check completion', async () => {
    render(<SystemHealth />)
    
    const scanButton = screen.getByText('Run Health Check')
    await user.click(scanButton)
    
    // Simulate successful completion
    mockUseAsync.loading = false
    mockUseAsync.error = null
    
    expect(mockUseAsync.execute).toHaveBeenCalled()
  })

  it('shows appropriate loading states for different sections', () => {
    mockUseAsync.loading = true
    
    render(<SystemHealth />)
    
    // Should show skeletons for header, stats, systems list, and charts
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThanOrEqual(4)
  })

  it('displays system performance metrics', () => {
    render(<SystemHealth />)
    
    // Check for performance indicators
    expect(screen.getByText(/CPU/)).toBeInTheDocument()
    expect(screen.getByText(/Memory/)).toBeInTheDocument()
    expect(screen.getByText(/Response Time/)).toBeInTheDocument()
  })
})