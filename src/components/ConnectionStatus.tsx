import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useWebSocket } from '../contexts/WebSocketContext';
import { cn } from '../lib/utils';

interface ConnectionStatusProps {
  className?: string;
  showLabel?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className, 
  showLabel = true 
}) => {
  const { connectionState, connect } = useWebSocket();

  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connected':
        return {
          icon: <Wifi className="h-3 w-3" />,
          label: 'Connected',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        };
      case 'connecting':
        return {
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          label: 'Connecting',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        };
      case 'development':
        return {
          icon: <Wifi className="h-3 w-3" />,
          label: 'Development Mode',
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="h-3 w-3" />,
          label: 'Disconnected',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        };
      default:
        return {
          icon: <WifiOff className="h-3 w-3" />,
          label: 'Unknown',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleReconnect = async () => {
    if (connectionState === 'disconnected') {
      try {
        await connect();
      } catch (error) {
        console.error('Failed to reconnect:', error);
      }
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge 
        variant={statusConfig.variant}
        className={cn(
          'flex items-center gap-1 text-xs',
          statusConfig.className
        )}
      >
        {statusConfig.icon}
        {showLabel && statusConfig.label}
      </Badge>
      
      {connectionState === 'disconnected' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReconnect}
          className="text-xs h-6 px-2"
        >
          Retry
        </Button>
      )}
    </div>
  );
};