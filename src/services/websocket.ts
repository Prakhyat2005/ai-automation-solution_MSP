export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  id?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  userId?: string;
}

export interface TicketUpdate {
  ticketId: string;
  status: string;
  priority: string;
  assignedTo?: string;
  updatedBy: string;
  timestamp: number;
}

export interface SystemMetricUpdate {
  metricType: 'cpu' | 'memory' | 'disk' | 'network';
  value: number;
  threshold?: number;
  clientId: string;
  timestamp: number;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private isConnecting = false;
  private url: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(url: string = (import.meta as any)?.env?.VITE_WS_URL ?? 'ws://localhost:8080/ws') {
    this.url = url;
    // In development, WebSocket server might not be available
    this.maxReconnectAttempts = process.env.NODE_ENV === 'development' ? 3 : 10;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Return a promise that resolves when connection is established
        const checkConnection = () => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            resolve();
          } else if (!this.isConnecting) {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      this.isConnecting = true;

      try {
        // Clear any existing reconnect timeout
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }

        this.ws = new WebSocket(this.url);

        const connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close();
            this.isConnecting = false;
            reject(new Error('Connection timeout'));
          }
        }, 10000); // 10 second timeout

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          clearTimeout(connectionTimeout);
          this.isConnecting = false;
          this.stopHeartbeat();
          this.ws = null;
          
          // Only attempt reconnection if it wasn't a clean close and we haven't exceeded max attempts
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached. Please refresh the page.');
          }
        };

        this.ws.onerror = (error) => {
          console.warn('WebSocket connection error (this is expected in development without a WebSocket server):', error);
          this.isConnecting = false;
          clearTimeout(connectionTimeout);
          
          // In development, don't treat WebSocket errors as critical
          if (process.env.NODE_ENV === 'development') {
            console.info('WebSocket server not available - continuing without real-time features');
            resolve(); // Resolve anyway to not block the app
          } else {
            reject(new Error('WebSocket connection failed'));
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    // Clear timeouts and intervals
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing heartbeat
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({
          type: 'heartbeat',
          payload: {},
          timestamp: Date.now()
        });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(message.payload);
        } catch (error) {
          console.error(`Error in WebSocket listener for ${message.type}:`, error);
        }
      });
    }
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  subscribe(messageType: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }
    
    const listeners = this.listeners.get(messageType)!;
    listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(messageType);
      }
    };
  }

  // Convenience methods for common message types
  subscribeToNotifications(callback: (notification: NotificationData) => void): () => void {
    return this.subscribe('notification', callback);
  }

  subscribeToTicketUpdates(callback: (update: TicketUpdate) => void): () => void {
    return this.subscribe('ticket_update', callback);
  }

  subscribeToSystemMetrics(callback: (metrics: SystemMetricUpdate) => void): () => void {
    return this.subscribe('system_metrics', callback);
  }

  // Send methods
  sendNotification(notification: Omit<NotificationData, 'id' | 'timestamp'>): void {
    this.send({
      type: 'notification',
      payload: {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
  }

  sendTicketUpdate(update: Omit<TicketUpdate, 'timestamp'>): void {
    this.send({
      type: 'ticket_update',
      payload: {
        ...update,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }
}

// Singleton instance
export const websocketService = new WebSocketService();