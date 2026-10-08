import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SystemMetric, Ticket } from '../types';
import { apiService } from '../services/api';

export const DashboardScreen: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data for demo
      const mockMetrics: SystemMetric[] = [
        {
          id: '1',
          name: 'CPU Usage',
          value: 65,
          unit: '%',
          status: 'warning',
          timestamp: new Date(),
        },
        {
          id: '2',
          name: 'Memory Usage',
          value: 45,
          unit: '%',
          status: 'normal',
          timestamp: new Date(),
        },
        {
          id: '3',
          name: 'Disk Usage',
          value: 85,
          unit: '%',
          status: 'critical',
          timestamp: new Date(),
        },
        {
          id: '4',
          name: 'Network Latency',
          value: 25,
          unit: 'ms',
          status: 'normal',
          timestamp: new Date(),
        },
      ];

      const mockTickets: Ticket[] = [
        {
          id: '1',
          title: 'Server Down',
          description: 'Main server is not responding',
          status: 'open',
          priority: 'high',
          client: 'Client A',
          assignee: 'John Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: 'Infrastructure',
        },
        {
          id: '2',
          title: 'Email Issues',
          description: 'Users cannot send emails',
          status: 'in-progress',
          priority: 'medium',
          client: 'Client B',
          assignee: 'Jane Smith',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: 'Software',
        },
      ];

      setMetrics(mockMetrics);
      setRecentTickets(mockTickets);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      case 'critical':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>System Overview</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Metrics</Text>
        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <Text style={styles.metricName}>{metric.name}</Text>
              <Text style={styles.metricValue}>
                {metric.value}{metric.unit}
              </Text>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(metric.status) },
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Tickets</Text>
        {recentTickets.map((ticket) => (
          <TouchableOpacity key={ticket.id} style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>{ticket.title}</Text>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(ticket.priority) },
                ]}
              >
                <Text style={styles.priorityText}>{ticket.priority}</Text>
              </View>
            </View>
            <Text style={styles.ticketDescription} numberOfLines={2}>
              {ticket.description}
            </Text>
            <View style={styles.ticketFooter}>
              <Text style={styles.ticketClient}>{ticket.client}</Text>
              <Text style={styles.ticketStatus}>{ticket.status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    position: 'relative',
  },
  metricName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketClient: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  ticketStatus: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
});