// Local Storage Service for MSP Automation Solution
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    defaultView: string;
    refreshInterval: number;
    compactMode: boolean;
  };
  tickets: {
    defaultPriority: 'low' | 'medium' | 'high' | 'critical';
    autoAssign: boolean;
    showResolved: boolean;
  };
}

export interface AppData {
  tickets: any[];
  clients: any[];
  resources: any[];
  lastSync: string;
}

class LocalStorageService {
  private readonly PREFERENCES_KEY = 'msp_user_preferences';
  private readonly APP_DATA_KEY = 'msp_app_data';
  private readonly AUTH_TOKEN_KEY = 'msp_auth_token';

  // User Preferences
  getUserPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
    
    // Return default preferences
    return {
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      dashboard: {
        defaultView: 'overview',
        refreshInterval: 30000,
        compactMode: false,
      },
      tickets: {
        defaultPriority: 'medium',
        autoAssign: true,
        showResolved: false,
      },
    };
  }

  setUserPreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.getUserPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  // App Data
  getAppData(): AppData {
    try {
      const stored = localStorage.getItem(this.APP_DATA_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading app data:', error);
    }
    
    return {
      tickets: [],
      clients: [],
      resources: [],
      lastSync: new Date().toISOString(),
    };
  }

  setAppData(data: Partial<AppData>): void {
    try {
      const current = this.getAppData();
      const updated = { ...current, ...data, lastSync: new Date().toISOString() };
      localStorage.setItem(this.APP_DATA_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving app data:', error);
    }
  }

  // Authentication
  getAuthToken(): string | null {
    try {
      return localStorage.getItem(this.AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error loading auth token:', error);
      return null;
    }
  }

  setAuthToken(token: string): void {
    try {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  removeAuthToken(): void {
    try {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Utility methods
  clearAllData(): void {
    try {
      localStorage.removeItem(this.PREFERENCES_KEY);
      localStorage.removeItem(this.APP_DATA_KEY);
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  }

  exportData(): string {
    try {
      const data = {
        preferences: this.getUserPreferences(),
        appData: this.getAppData(),
        exportDate: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.preferences) {
        this.setUserPreferences(data.preferences);
      }
      if (data.appData) {
        this.setAppData(data.appData);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const localStorageService = new LocalStorageService();