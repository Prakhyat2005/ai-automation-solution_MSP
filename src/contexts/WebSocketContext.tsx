import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { websocketService, NotificationData, TicketUpdate, SystemMetricUpdate } from '../services/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  connectionState: string;
  notifications: NotificationData[];
  ticketUpdates: TicketUpdate[];
  systemMetrics: SystemMetricUpdate[];
  connect: () => Promise<void>;
  disconnect: () => void;
  sendNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => void;
  sendTicketUpdate: (update: Omit<TicketUpdate, 'timestamp'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  clearTicketUpdates: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  // Set initial state based on environment
  const [connectionState, setConnectionState] = useState(
    process.env.NODE_ENV === 'development' ? 'development' : 'disconnected'
  );
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [ticketUpdates, setTicketUpdates] = useState<TicketUpdate[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetricUpdate[]>([]);

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribeNotifications = websocketService.subscribeToNotifications((notification: NotificationData) => {
      setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep only latest 50
    });

    // Subscribe to ticket updates
    const unsubscribeTicketUpdates = websocketService.subscribeToTicketUpdates((update: TicketUpdate) => {
      setTicketUpdates(prev => [update, ...prev].slice(0, 100)); // Keep only latest 100
    });

    // Subscribe to system metrics
    const unsubscribeSystemMetrics = websocketService.subscribeToSystemMetrics((metrics: SystemMetricUpdate) => {
      setSystemMetrics(prev => [metrics, ...prev].slice(0, 200)); // Keep only latest 200
    });

    // Monitor connection state
    const checkConnectionState = () => {
      const state = websocketService.getConnectionState();
      if (process.env.NODE_ENV === 'development' && state !== 'connected') {
        // Show explicit development state when not connected in dev
        setConnectionState('development');
        setIsConnected(false);
      } else {
        setConnectionState(state);
        setIsConnected(state === 'connected');
      }
    };

    // In development, check less frequently to reduce noise
    const checkInterval = process.env.NODE_ENV === 'development' ? 10000 : 1000;
    const connectionInterval = setInterval(checkConnectionState, checkInterval);
    
    // Initial check
    checkConnectionState();

    // Always attempt to connect (dev uses mock server if available)
    connect();

    return () => {
      unsubscribeNotifications();
      unsubscribeTicketUpdates();
      unsubscribeSystemMetrics();
      clearInterval(connectionInterval);
    };
  }, []);

  const connect = async (): Promise<void> => {
    try {
      await websocketService.connect();
      setIsConnected(true);
      setConnectionState('connected');
    } catch (error) {
      // In development, WebSocket connection failures are expected
      if (process.env.NODE_ENV === 'development') {
        console.info('WebSocket connection not available in development - this is normal');
        setIsConnected(false);
        setConnectionState('development');
      } else {
        console.error('Failed to connect to WebSocket:', error);
        setIsConnected(false);
        setConnectionState('disconnected');
      }
    }
  };

  const disconnect = (): void => {
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionState('disconnected');
  };

  const sendNotification = (notification: Omit<NotificationData, 'id' | 'timestamp'>): void => {
    websocketService.sendNotification(notification);
    // Local fallback: immediately reflect notification in UI
    const localNotification: NotificationData = {
      id: crypto.randomUUID(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: Date.now(),
      read: false,
      userId: notification.userId
    };
    setNotifications(prev => [localNotification, ...prev].slice(0, 50));
  };

  const sendTicketUpdate = (update: Omit<TicketUpdate, 'timestamp'>): void => {
    websocketService.sendTicketUpdate(update);
    // Local fallback: immediately reflect ticket update in UI
    const localUpdate: TicketUpdate = {
      ticketId: update.ticketId,
      status: update.status,
      priority: update.priority,
      assignedTo: update.assignedTo,
      updatedBy: update.updatedBy,
      timestamp: Date.now(),
    };
    setTicketUpdates(prev => [localUpdate, ...prev].slice(0, 100));
  };

  const markNotificationAsRead = (notificationId: string): void => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotifications = (): void => {
    setNotifications([]);
  };

  const clearTicketUpdates = (): void => {
    setTicketUpdates([]);
  };

  const value: WebSocketContextType = {
    isConnected,
    connectionState,
    notifications,
    ticketUpdates,
    systemMetrics,
    connect,
    disconnect,
    sendNotification,
    sendTicketUpdate,
    markNotificationAsRead,
    clearNotifications,
    clearTicketUpdates,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}