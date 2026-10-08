import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api, Ticket, SystemMetric, Client, Resource, AnalyticsData } from '../services/api';
import { localStorageService, UserPreferences } from '../services/localStorage';

interface AppState {
  tickets: Ticket[];
  systemMetrics: SystemMetric[];
  clients: Client[];
  resources: Resource[];
  analytics: AnalyticsData | null;
  loading: {
    tickets: boolean;
    systemMetrics: boolean;
    clients: boolean;
    resources: boolean;
    analytics: boolean;
  };
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TICKETS'; payload: Ticket[] }
  | { type: 'SET_SYSTEM_METRICS'; payload: SystemMetric[] }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'SET_RESOURCES'; payload: Resource[] }
  | { type: 'SET_ANALYTICS'; payload: AnalyticsData }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: Ticket };

const initialState: AppState = {
  tickets: [],
  systemMetrics: [],
  clients: [],
  resources: [],
  analytics: null,
  loading: {
    tickets: false,
    systemMetrics: false,
    clients: false,
    resources: false,
    analytics: false,
  },
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_TICKETS':
      return {
        ...state,
        tickets: action.payload,
      };
    case 'SET_SYSTEM_METRICS':
      return {
        ...state,
        systemMetrics: action.payload,
      };
    case 'SET_CLIENTS':
      return {
        ...state,
        clients: action.payload,
      };
    case 'SET_RESOURCES':
      return {
        ...state,
        resources: action.payload,
      };
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload,
      };
    case 'ADD_TICKET':
      return {
        ...state,
        tickets: [action.payload, ...state.tickets],
      };
    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.id ? action.payload : ticket
        ),
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  preferences: UserPreferences;
  actions: {
    loadTickets: () => Promise<void>;
    loadSystemMetrics: () => Promise<void>;
    loadClients: () => Promise<void>;
    loadResources: () => Promise<void>;
    loadAnalytics: () => Promise<void>;
    createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
    refreshAll: () => Promise<void>;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    exportData: () => string;
    importData: (data: string) => boolean;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [preferences, setPreferences] = React.useState<UserPreferences>(() => 
    localStorageService.getUserPreferences()
  );

  const setLoading = (key: keyof AppState['loading'], value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const loadTickets = async () => {
    try {
      setLoading('tickets', true);
      setError(null);
      const tickets = await api.getTickets();
      dispatch({ type: 'SET_TICKETS', payload: tickets });
    } catch (error) {
      setError('Failed to load tickets');
      console.error('Error loading tickets:', error);
    } finally {
      setLoading('tickets', false);
    }
  };

  const loadSystemMetrics = async () => {
    try {
      setLoading('systemMetrics', true);
      setError(null);
      const metrics = await api.getSystemMetrics();
      dispatch({ type: 'SET_SYSTEM_METRICS', payload: metrics });
    } catch (error) {
      setError('Failed to load system metrics');
      console.error('Error loading system metrics:', error);
    } finally {
      setLoading('systemMetrics', false);
    }
  };

  const loadClients = async () => {
    try {
      setLoading('clients', true);
      setError(null);
      const clients = await api.getClients();
      dispatch({ type: 'SET_CLIENTS', payload: clients });
    } catch (error) {
      setError('Failed to load clients');
      console.error('Error loading clients:', error);
    } finally {
      setLoading('clients', false);
    }
  };

  const loadResources = async () => {
    try {
      setLoading('resources', true);
      setError(null);
      const resources = await api.getResources();
      dispatch({ type: 'SET_RESOURCES', payload: resources });
    } catch (error) {
      setError('Failed to load resources');
      console.error('Error loading resources:', error);
    } finally {
      setLoading('resources', false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading('analytics', true);
      setError(null);
      const analytics = await api.getAnalytics();
      dispatch({ type: 'SET_ANALYTICS', payload: analytics });
    } catch (error) {
      setError('Failed to load analytics');
      console.error('Error loading analytics:', error);
    } finally {
      setLoading('analytics', false);
    }
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const newTicket = await api.createTicket(ticketData);
      dispatch({ type: 'ADD_TICKET', payload: newTicket });
    } catch (error) {
      setError('Failed to create ticket');
      console.error('Error creating ticket:', error);
      throw error;
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    try {
      setError(null);
      const updatedTicket = await api.updateTicket(id, updates);
      dispatch({ type: 'UPDATE_TICKET', payload: updatedTicket });
    } catch (error) {
      setError('Failed to update ticket');
      console.error('Error updating ticket:', error);
      throw error;
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      loadTickets(),
      loadSystemMetrics(),
      loadClients(),
      loadResources(),
      loadAnalytics(),
    ]);
  };

  // Load initial data
  useEffect(() => {
    refreshAll();
  }, []);

  // Set up periodic refresh for system metrics (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadSystemMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Apply theme to document root based on user preferences
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = preferences.theme === 'dark' || (preferences.theme === 'system' && isSystemDark);
      root.classList.toggle('dark', !!isDark);
    };

    applyTheme();

    const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const handleChange = () => {
      if (preferences.theme === 'system') {
        applyTheme();
      }
    };
    media?.addEventListener('change', handleChange);

    return () => {
      media?.removeEventListener('change', handleChange);
    };
  }, [preferences.theme]);

  // Preference management functions
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorageService.setUserPreferences(updated);
  };

  const exportData = () => {
    return localStorageService.exportData();
  };

  const importData = (data: string) => {
    const success = localStorageService.importData(data);
    if (success) {
      setPreferences(localStorageService.getUserPreferences());
      refreshAll(); // Reload app data after import
    }
    return success;
  };

  const actions = {
    loadTickets,
    loadSystemMetrics,
    loadClients,
    loadResources,
    loadAnalytics,
    createTicket,
    updateTicket,
    refreshAll,
    updatePreferences,
    exportData,
    importData,
  };

  const value = {
    state,
    preferences,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};