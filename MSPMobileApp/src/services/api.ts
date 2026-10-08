// API Service for MSP Mobile App
import { Ticket, SystemMetric, Client, User } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // Update with your backend URL

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = await this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async getAuthToken(): Promise<string | null> {
    // In a real app, this would get the token from secure storage
    return null;
  }

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Tickets
  async getTickets(): Promise<Ticket[]> {
    return this.request('/tickets');
  }

  async getTicket(id: string): Promise<Ticket> {
    return this.request(`/tickets/${id}`);
  }

  async createTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    return this.request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // System Metrics
  async getSystemMetrics(): Promise<SystemMetric[]> {
    return this.request('/metrics');
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return this.request('/clients');
  }

  async getClient(id: string): Promise<Client> {
    return this.request(`/clients/${id}`);
  }
}

export const apiService = new ApiService();