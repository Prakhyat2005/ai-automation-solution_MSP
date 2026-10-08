import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { OverviewDashboard } from './OverviewDashboard';
import { TicketManagement } from './TicketManagement';
import { ResourceAllocation } from './ResourceAllocation';
import { SystemHealth } from './SystemHealth';
import { ClientCommunication } from './ClientCommunication';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { Integrations } from './Integrations';
import { NotificationSystem } from './NotificationSystem';
import { ProfileSettings } from './auth/ProfileSettings';
import { NotificationCenter } from './NotificationCenter';
import { ConnectionStatus } from './ConnectionStatus';
import { RealTimeMonitoring } from './RealTimeMonitoring';
import { TicketClassification } from './TicketClassification';
import { ProactiveCompliance } from './ProactiveCompliance';

export type ViewType = 
  | 'overview' 
  | 'tickets' 
  | 'resources' 
  | 'health' 
  | 'communication' 
  | 'analytics' 
  | 'integrations'
  | 'profile'
  | 'ai-monitoring'
  | 'ai-tickets'
  | 'compliance';

export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewDashboard />;
      case 'tickets':
        return <TicketManagement />;
      case 'resources':
        return <ResourceAllocation />;
      case 'health':
        return <SystemHealth />;
      case 'communication':
        return <ClientCommunication />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'integrations':
        return <Integrations />;
      case 'compliance':
        return <ProactiveCompliance />;
      case 'profile':
        return <ProfileSettings />;
      case 'ai-monitoring':
        return <RealTimeMonitoring />;
      case 'ai-tickets':
        return <TicketClassification />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - responsive for both mobile and desktop */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 overflow-auto">
        {/* Header with real-time features */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-end gap-4 p-4">
            <ConnectionStatus />
            <NotificationCenter />
          </div>
        </div>
        
        {renderView()}
      </main>
      <NotificationSystem isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      {/* Floating Notification Button */}
      <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="fixed bottom-6 right-24 h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v3.5"
          />
        </svg>
        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-xs flex items-center justify-center text-white font-bold">
          3
        </span>
      </button>
    </div>
  );
}
