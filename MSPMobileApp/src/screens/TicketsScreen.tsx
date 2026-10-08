import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ticket } from '../types';
import { apiService } from '../services/api';

export const TicketsScreen: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = ['all', 'open', 'in-progress', 'resolved', 'closed'];

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, selectedFilter]);

  const loadTickets = async () => {
    try {
      // Mock data for demo
      const mockTickets: Ticket[] = [
        {
          id: '1',
          title: 'Server Down - Critical Issue',
          description: 'Main production server is not responding. Multiple clients affected.',
          status: 'open',
          priority: 'critical',
          client: 'TechCorp Inc.',
          assignee: 'John Doe',
          createdAt: new Date('2024-01-15T10:30:00'),
          updatedAt: new Date('2024-01-15T11:00:00'),
          category: 'Infrastructure',
        },
        {
          id: '2',
          title: 'Email Configuration Issues',
          description: 'Users cannot send emails through Outlook. SMTP settings need review.',
          status: 'in-progress',
          priority: 'high',
          client: 'Business Solutions Ltd.',
          assignee: 'Jane Smith',
          createdAt: new Date('2024-01-15T09:15:00'),
          updatedAt: new Date('2024-01-15T10:45:00'),
          category: 'Software',
        },
        {
          id: '3',
          title: 'Printer Not Working',
          description: 'Office printer is showing error messages and not printing.',
          status: 'open',
          priority: 'medium',
          client: 'Local Office',
          assignee: 'Mike Johnson',
          createdAt: new Date('2024-01-15T08:00:00'),
          updatedAt: new Date('2024-01-15T08:30:00'),
          category: 'Hardware',
        },
        {
          id: '4',
          title: 'Software License Renewal',
          description: 'Microsoft Office licenses expiring next month. Need to renew.',
          status: 'resolved',
          priority: 'low',
          client: 'StartupXYZ',
          assignee: 'Sarah Wilson',
          createdAt: new Date('2024-01-14T14:20:00'),
          updatedAt: new Date('2024-01-15T09:00:00'),
          category: 'Licensing',
        },
        {
          id: '5',
          title: 'Network Connectivity Issues',
          description: 'Intermittent network drops affecting productivity.',
          status: 'in-progress',
          priority: 'medium',
          client: 'Manufacturing Co.',
          assignee: 'Tom Brown',
          createdAt: new Date('2024-01-14T16:45:00'),
          updatedAt: new Date('2024-01-15T10:15:00'),
          category: 'Network',
        },
        {
          id: '6',
          title: 'Backup System Failure',
          description: 'Daily backup process failed. Need immediate attention.',
          status: 'open',
          priority: 'high',
          client: 'DataCorp',
          assignee: 'Alex Davis',
          createdAt: new Date('2024-01-15T07:30:00'),
          updatedAt: new Date('2024-01-15T08:00:00'),
          category: 'Infrastructure',
        },
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadTickets();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#3b82f6';
      case 'in-progress':
        return '#f59e0b';
      case 'resolved':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.badges}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Text style={styles.badgeText}>{item.priority}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.ticketDescription} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.ticketMeta}>
        <Text style={styles.metaText}>Client: {item.client}</Text>
        <Text style={styles.metaText}>Assignee: {item.assignee}</Text>
        <Text style={styles.metaText}>Category: {item.category}</Text>
      </View>

      <View style={styles.ticketFooter}>
        <Text style={styles.dateText}>Created: {formatDate(item.createdAt)}</Text>
        <Text style={styles.dateText}>Updated: {formatDate(item.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading tickets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tickets</Text>
        <Text style={styles.subtitle}>
          {filteredTickets.length} of {tickets.length} tickets
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tickets..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          renderItem={({ item }) => renderFilterButton(item)}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      <FlatList
        data={filteredTickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.ticketsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  ticketsList: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  ticketMeta: {
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
  },
  ticketFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  dateText: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
});