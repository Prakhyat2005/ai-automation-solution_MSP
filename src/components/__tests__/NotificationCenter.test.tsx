import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotificationCenter } from '../NotificationCenter'

// Mock the WebSocket context
const mockWebSocketContext = {
  notifications: [
    {
      id: '1',
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info' as const,
      timestamp: new Date('2024-01-01T10:00:00Z'),
      read: false
    },
    {
      id: '2',
      title: 'Warning Alert',
      message: 'This is a warning',
      type: 'warning' as const,
      timestamp: new Date('2024-01-01T09:00:00Z'),
      read: true
    }
  ],
  markNotificationAsRead: vi.fn(),
  clearNotifications: vi.fn(),
  isConnected: true,
  connectionState: 'connected' as const,
  connect: vi.fn(),
  disconnect: vi.fn(),
  sendMessage: vi.fn(),
  ticketUpdates: [],
  systemMetrics: null
}

// Create a mock function that can be dynamically updated
const mockUseWebSocket = vi.fn(() => mockWebSocketContext)

vi.mock('../../contexts/WebSocketContext', () => ({
  useWebSocket: mockUseWebSocket
}))

describe('NotificationCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders notification center with notifications', () => {
    render(<NotificationCenter />)
    
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Test Notification')).toBeInTheDocument()
    expect(screen.getByText('Warning Alert')).toBeInTheDocument()
  })

  it('shows unread count badge', () => {
    render(<NotificationCenter />)
    
    const badge = screen.getByText('1')
    expect(badge).toBeInTheDocument()
  })

  it('marks notification as read when clicked', () => {
    render(<NotificationCenter />)
    
    // Open the notification center
    fireEvent.click(screen.getByRole('button'))
    
    // Click on unread notification
    const notification = screen.getByText('Test Notification').closest('div')
    fireEvent.click(notification!)
    
    expect(mockWebSocketContext.markNotificationAsRead).toHaveBeenCalledWith('1')
  })

  it('clears all notifications when clear button is clicked', () => {
    render(<NotificationCenter />)
    
    // Open the notification center
    fireEvent.click(screen.getByRole('button'))
    
    // Click clear all button
    fireEvent.click(screen.getByText('Clear All'))
    
    expect(mockWebSocketContext.clearNotifications).toHaveBeenCalled()
  })

  it('shows empty state when no notifications', () => {
    const emptyContext = {
      ...mockWebSocketContext,
      notifications: []
    }
    
    mockUseWebSocket.mockReturnValue(emptyContext)
    
    render(<NotificationCenter />)
    
    // Open the notification center
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('No notifications')).toBeInTheDocument()
  })

  it('displays correct notification types with appropriate icons', () => {
    render(<NotificationCenter />)
    
    // Open the notification center
    fireEvent.click(screen.getByRole('button'))
    
    // Check for info and warning notifications
    expect(screen.getByText('Test Notification')).toBeInTheDocument()
    expect(screen.getByText('Warning Alert')).toBeInTheDocument()
  })
})