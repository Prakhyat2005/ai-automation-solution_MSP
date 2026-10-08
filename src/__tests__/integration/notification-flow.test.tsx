import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { NotificationCenter } from '../../components/NotificationCenter'

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    type: 'alert',
    title: 'Server Alert',
    message: 'High CPU usage detected',
    timestamp: '2024-01-01T12:00:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'info',
    title: 'System Update',
    message: 'System maintenance completed',
    timestamp: '2024-01-01T11:00:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Disk Space Warning',
    message: 'Disk space is running low',
    timestamp: '2024-01-01T10:00:00Z',
    read: false,
    priority: 'medium'
  }
]

const mockWebSocketContext = {
  socket: {
    connected: true,
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  },
  notifications: mockNotifications,
  unreadCount: 2,
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
  clearNotification: vi.fn(),
  clearAllNotifications: vi.fn()
}

// Create a mock function that can be dynamically updated
const mockUseWebSocket = vi.fn(() => mockWebSocketContext)

vi.mock('../../contexts/WebSocketContext', () => ({
  useWebSocket: () => mockWebSocketContext
}))

describe('Notification System Integration Flow', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders notification center with notifications', () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Server Alert')).toBeInTheDocument()
    expect(screen.getByText('System Update')).toBeInTheDocument()
    expect(screen.getByText('Disk Space Warning')).toBeInTheDocument()
  })

  it('displays unread notification count', () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    expect(screen.getByText('2')).toBeInTheDocument() // Unread count badge
  })

  it('shows different notification types with appropriate icons', () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    // Should have different icons for alert, info, warning
    const alertIcon = screen.getByTestId('alert-icon')
    const infoIcon = screen.getByTestId('info-icon')
    const warningIcon = screen.getByTestId('warning-icon')

    expect(alertIcon).toBeInTheDocument()
    expect(infoIcon).toBeInTheDocument()
    expect(warningIcon).toBeInTheDocument()
  })

  it('allows marking individual notifications as read', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const markReadButton = screen.getAllByText('Mark as Read')[0]
    await user.click(markReadButton)

    expect(mockWebSocketContext.markAsRead).toHaveBeenCalledWith('1')
  })

  it('allows marking all notifications as read', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const markAllReadButton = screen.getByText('Mark All Read')
    await user.click(markAllReadButton)

    expect(mockWebSocketContext.markAllAsRead).toHaveBeenCalled()
  })

  it('allows clearing individual notifications', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const clearButtons = screen.getAllByText('Clear')
    await user.click(clearButtons[0])

    expect(mockWebSocketContext.clearNotification).toHaveBeenCalledWith('1')
  })

  it('allows clearing all notifications', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const clearAllButton = screen.getByText('Clear All')
    await user.click(clearAllButton)

    expect(mockWebSocketContext.clearAllNotifications).toHaveBeenCalled()
  })

  it('displays notification timestamps', () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    // Should show relative timestamps
    expect(screen.getByText(/ago/)).toBeInTheDocument()
  })

  it('shows priority indicators for notifications', () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    // Should show priority badges
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('filters notifications by type', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const typeFilter = screen.getByDisplayValue('All Types')
    await user.selectOptions(typeFilter, 'alert')

    expect(typeFilter).toHaveValue('alert')
  })

  it('filters notifications by read status', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const statusFilter = screen.getByDisplayValue('All')
    await user.selectOptions(statusFilter, 'unread')

    expect(statusFilter).toHaveValue('unread')
  })

  it('shows empty state when no notifications', () => {
    const emptyContext = { ...mockWebSocketContext, notifications: [] }
    mockUseWebSocket.mockReturnValue(emptyContext)

    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    expect(screen.getByText('No notifications')).toBeInTheDocument()
  })

  it('displays WebSocket connection status', () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    expect(screen.getByText('Connected')).toBeInTheDocument()
  })

  it('shows disconnected state when WebSocket is offline', () => {
    const disconnectedContext = { 
      ...mockWebSocketContext, 
      socket: { ...mockWebSocketContext.socket, connected: false } 
    }
    mockUseWebSocket.mockReturnValue(disconnectedContext)

    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    expect(screen.getByText('Disconnected')).toBeInTheDocument()
  })

  it('handles real-time notification updates', async () => {
    const { rerender } = render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    // Simulate new notification
    const newNotification = {
      id: '4',
      type: 'alert',
      title: 'New Alert',
      message: 'Critical system error',
      timestamp: '2024-01-01T13:00:00Z',
      read: false,
      priority: 'high'
    }

    const updatedContext = {
      ...mockWebSocketContext,
      notifications: [...mockNotifications, newNotification],
      unreadCount: 3
    }

    mockUseWebSocket.mockReturnValue(updatedContext)

    rerender(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    expect(screen.getByText('New Alert')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // Updated unread count
  })

  it('shows notification details in expandable view', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const notification = screen.getByText('Server Alert')
    await user.click(notification)

    // Should expand to show full message
    expect(screen.getByText('High CPU usage detected')).toBeInTheDocument()
  })

  it('allows searching notifications', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search notifications...')
    await user.type(searchInput, 'Server')

    expect(searchInput).toHaveValue('Server')
  })

  it('shows notification actions menu', async () => {
    render(
      <BrowserRouter>
        <NotificationCenter />
      </BrowserRouter>
    )

    const actionMenus = screen.getAllByText('⋮')
    await user.click(actionMenus[0])

    // Should show action menu options
    expect(screen.getByText('Mark as Read')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })
})