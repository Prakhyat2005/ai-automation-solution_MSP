import { cn } from '../lib/utils';
import { ViewType } from './Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Activity, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut,
  Building2,
  Zap,
  User,
  Brain,
  Bot,
  Sun,
  Moon,
  Monitor,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const { user, logout } = useAuth();
  const { preferences, actions } = useApp();
  
  const menuItems = [
    { id: 'overview' as ViewType, label: 'Overview', icon: LayoutDashboard },
    { id: 'tickets' as ViewType, label: 'Smart Tickets', icon: Ticket },
    { id: 'resources' as ViewType, label: 'Resources', icon: Users },
    { id: 'health' as ViewType, label: 'System Health', icon: Activity },
    { id: 'communication' as ViewType, label: 'Communication', icon: MessageSquare },
    { id: 'analytics' as ViewType, label: 'Analytics', icon: BarChart3 },
    { id: 'compliance' as ViewType, label: 'Compliance', icon: ShieldCheck },
    { id: 'integrations' as ViewType, label: 'Integrations', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  const getThemeIcon = () => {
    switch (preferences.theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const cycleTheme = () => {
    const next = preferences.theme === 'light' ? 'dark' : preferences.theme === 'dark' ? 'system' : 'light';
    actions.updatePreferences({ theme: next });
  };

  return (
    <aside className="w-64 lg:w-64 md:w-56 sm:w-48 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-semibold text-foreground">MSP AutoPilot</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Operations</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name || 'User'}
            </p>
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground truncate">
                {user?.company || 'No Company'}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-2 hidden sm:block">
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            user?.role === 'admin' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
            user?.role === 'technician' && "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
            user?.role === 'client' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          )}>
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden sm:block">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => setCurrentView('profile')}
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:block">Profile Settings</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={cycleTheme}
        >
          {getThemeIcon()}
          <span className="hidden sm:block">Theme: {preferences.theme.charAt(0).toUpperCase() + preferences.theme.slice(1)}</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">Sign Out</span>
        </Button>
        
        {/* Removed AI Status panel */}
      </div>
    </aside>
  );
}
