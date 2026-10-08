// Auth service with backend integration and local mock fallback
import { localStorageService } from './localStorage';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'client';
  company?: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

const AUTH_BASE_URL = (import.meta.env.VITE_AUTH_BASE_URL as string | undefined) || '';
const useMock = !AUTH_BASE_URL;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  if (!AUTH_BASE_URL) throw new Error('Auth base URL not configured');
  const res = await fetch(`${AUTH_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

function encodeMockToken(user: User): string {
  const header = btoa(JSON.stringify({ header: 'mock' }));
  const payload = btoa(JSON.stringify(user));
  const signature = btoa('signature');
  return `${header}.${payload}.${signature}`;
}

function decodeMockToken(token: string | null): User | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as User;
  } catch {
    return null;
  }
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    // Try backend if configured
    if (!useMock) {
      const res = await http<AuthResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorageService.setAuthToken(res.token);
      return res;
    }

    // Fallback demo login
    const demoUsers: Record<string, User> = {
      'admin@msp.com': {
        id: '1',
        email: 'admin@msp.com',
        name: 'Admin User',
        role: 'admin',
        company: 'TechFlow MSP',
      },
      'tech@msp.com': {
        id: '2',
        email: 'tech@msp.com',
        name: 'John Technician',
        role: 'technician',
        company: 'TechFlow MSP',
      },
      'client@company.com': {
        id: '3',
        email: 'client@company.com',
        name: 'Jane Client',
        role: 'client',
        company: 'Client Corp',
      },
    };
    const foundUser = demoUsers[email];
    if (!foundUser || password !== 'demo123') {
      throw new Error('Invalid credentials');
    }
    const token = encodeMockToken(foundUser);
    localStorageService.setAuthToken(token);
    return { user: foundUser, token };
  },

  async signup(email: string, password: string, name: string, role: User['role'], company?: string): Promise<AuthResult> {
    if (!useMock) {
      const res = await http<AuthResult>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, role, company }),
      });
      localStorageService.setAuthToken(res.token);
      return res;
    }
    const user: User = { id: Date.now().toString(), email, name, role, company };
    const token = encodeMockToken(user);
    localStorageService.setAuthToken(token);
    return { user, token };
  },

  logout(): void {
    localStorageService.removeAuthToken();
  },

  getCurrentUser(): User | null {
    const token = localStorageService.getAuthToken();
    return decodeMockToken(token);
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};