import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <WebSocketProvider>
            <div className="size-full bg-background">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
              <Toaster />
            </div>
          </WebSocketProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
