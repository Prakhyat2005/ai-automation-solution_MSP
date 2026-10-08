import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { SystemHealth } from '../../components/SystemHealth'

// Mock system health data
const mockHealthData = {
  overall: 'healthy',
  services: [
    { name: 'Web Server', status: 'healthy', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', uptime: '99.8%' },
    { name: 'Email Service', status: 'warning', uptime: '98.5%' }
  ],
  metrics: {
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 12
  },
  lastScan: '2024-01-01T12:00:00Z'
}

const mockUseAsync = {
  loading: false,
  error: null as Error | null,
  data: mockHealthData,
  execute: vi.fn()
}

vi.mock('../../hooks/useAsync', () => ({
  useAsync: () => mockUseAsync
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

describe('System Health Integration Flow', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock to default state
    Object.assign(mockUseAsync, {
      loading: false,
      error: null,
      data: mockHealthData,
      execute: vi.fn()
    })
  })

  it('renders system health dashboard with health data', () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    expect(screen.getByText('System Health')).toBeInTheDocument()
    expect(screen.getByText('Web Server')).toBeInTheDocument()
    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('Email Service')).toBeInTheDocument()
  })

  it('displays overall health status', () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    // Should show overall health status
    expect(screen.getByText(/healthy/i)).toBeInTheDocument()
  })

  it('displays service statuses with uptime', () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('99.8%')).toBeInTheDocument()
    expect(screen.getByText('98.5%')).toBeInTheDocument()
  })

  it('displays system metrics', () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    // Should show CPU, Memory, Disk, Network metrics
    expect(screen.getByText('45%')).toBeInTheDocument() // CPU
    expect(screen.getByText('67%')).toBeInTheDocument() // Memory
    expect(screen.getByText('23%')).toBeInTheDocument() // Disk
    expect(screen.getByText('12%')).toBeInTheDocument() // Network
  })

  it('allows manual health scan', async () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    const scanButton = screen.getByText('Scan Now')
    await user.click(scanButton)

    expect(mockUseAsync.execute).toHaveBeenCalled()
  })

  it('shows loading state during health scan', () => {
    // Mock loading state
    Object.assign(mockUseAsync, { loading: true, data: null })

    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('handles error states gracefully', () => {
    // Mock error state
    Object.assign(mockUseAsync, { 
      loading: false, 
      error: new Error('Failed to fetch health data'),
      data: null 
    })

    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    expect(screen.getByText('Failed to fetch health data')).toBeInTheDocument()
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('displays last scan timestamp', () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    // Should show last scan time (format may vary)
    expect(screen.getByText(/last scan/i)).toBeInTheDocument()
  })

  it('shows different status indicators for services', () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    // Should have different visual indicators for healthy vs warning status
    const healthyServices = screen.getAllByText('healthy')
    const warningServices = screen.getAllByText('warning')
    
    expect(healthyServices.length).toBe(2)
    expect(warningServices.length).toBe(1)
  })

  it('allows refreshing health data', async () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    const refreshButton = screen.getByText('Refresh')
    await user.click(refreshButton)

    expect(mockUseAsync.execute).toHaveBeenCalled()
  })

  it('displays health trends when available', () => {
    const healthDataWithTrends = {
      ...mockHealthData,
      trends: {
        cpu: [40, 42, 45, 43, 45],
        memory: [60, 62, 65, 67, 67],
        uptime: 99.5
      }
    }

    Object.assign(mockUseAsync, { data: healthDataWithTrends })

    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    // Should show trend information
    expect(screen.getByText(/trend/i)).toBeInTheDocument()
  })

  it('handles empty health data gracefully', () => {
    Object.assign(mockUseAsync, { 
      data: { 
        overall: 'unknown', 
        services: [], 
        metrics: {}, 
        lastScan: null 
      } 
    })

    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    expect(screen.getByText('No health data available')).toBeInTheDocument()
  })

  it('shows critical alerts when services are down', () => {
    const criticalHealthData = {
      ...mockHealthData,
      overall: 'critical',
      services: [
        { name: 'Web Server', status: 'down', uptime: '0%' },
        { name: 'Database', status: 'healthy', uptime: '99.8%' }
      ]
    }

    Object.assign(mockUseAsync, { data: criticalHealthData })

    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    expect(screen.getByText('critical')).toBeInTheDocument()
    expect(screen.getByText('down')).toBeInTheDocument()
  })

  it('allows filtering services by status', async () => {
    render(
      <BrowserRouter>
        <SystemHealth />
      </BrowserRouter>
    )

    const statusFilter = screen.getByDisplayValue('All Services')
    await user.selectOptions(statusFilter, 'warning')

    expect(statusFilter).toHaveValue('warning')
  })
})