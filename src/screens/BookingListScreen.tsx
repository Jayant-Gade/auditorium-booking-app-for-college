import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Button,
  FAB,
  Surface,
  SegmentedButtons,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { theme } from '../theme/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface BookingListScreenProps {
  navigation: any;
}

const BookingListScreen: React.FC<BookingListScreenProps> = ({ navigation }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const userBookings = bookings.filter(booking => 
    booking.organizerEmail === currentUser?.email
  );

  const filteredBookings = userBookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
      case 'pending':
        return { backgroundColor: '#FFF3E0', color: '#E65100' };
      case 'rejected':
        return { backgroundColor: '#FFEBEE', color: '#C62828' };
      default:
        return { backgroundColor: theme.colors.surface, color: theme.colors.onSurface };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'check-circle';
      case 'pending':
        return 'clock';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          My Bookings
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {userBookings.length} total bookings
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />
      </View>

      <ScrollView
        style={styles.bookingsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBookings.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="calendar-remove" size={64} color={theme.colors.outline} />
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                No bookings found
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                {filter === 'all'
                  ? "You haven't made any bookings yet."
                  : `No ${filter} bookings found.`}
              </Text>
              {filter === 'all' && (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Book')}
                  style={styles.emptyButton}
                  icon="plus"
                >
                  Make Your First Booking
                </Button>
              )}
            </Card.Content>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} style={styles.bookingCard}>
              <Card.Content>
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingTitleRow}>
                    <Text variant="titleMedium" style={styles.bookingTitle}>
                      {booking.title}
                    </Text>
                    <Chip
                      mode="flat"
                      style={[
                        styles.statusChip,
                        { backgroundColor: getStatusColor(booking.status).backgroundColor },
                      ]}
                      textStyle={{ color: getStatusColor(booking.status).color }}
                      icon={getStatusIcon(booking.status)}
                    >
                      {booking.status.toUpperCase()}
                    </Chip>
                  </View>
                </View>

                {booking.description && (
                  <Text variant="bodyMedium" style={styles.bookingDescription}>
                    {booking.description}
                  </Text>
                )}

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="calendar" size={16} color={theme.colors.outline} />
                    <Text variant="bodyMedium" style={styles.detailText}>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Icon name="clock" size={16} color={theme.colors.outline} />
                    <Text variant="bodyMedium" style={styles.detailText}>
                      {booking.startTime} - {booking.endTime}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Icon name="account-group" size={16} color={theme.colors.outline} />
                    <Text variant="bodyMedium" style={styles.detailText}>
                      {booking.expectedAttendees} attendees
                    </Text>
                  </View>

                  {booking.equipmentNeeded.length > 0 && (
                    <View style={styles.equipmentRow}>
                      <Icon name="tools" size={16} color={theme.colors.outline} />
                      <View style={styles.equipmentList}>
                        {booking.equipmentNeeded.slice(0, 2).map((equipment) => (
                          <Chip key={equipment} style={styles.equipmentChip} compact>
                            {equipment}
                          </Chip>
                        ))}
                        {booking.equipmentNeeded.length > 2 && (
                          <Chip style={styles.equipmentChip} compact>
                            +{booking.equipmentNeeded.length - 2} more
                          </Chip>
                        )}
                      </View>
                    </View>
                  )}
                </View>

                {booking.adminNotes && (
                  <Surface style={styles.adminNotesContainer}>
                    <Text variant="labelMedium" style={styles.adminNotesLabel}>
                      Admin Notes:
                    </Text>
                    <Text variant="bodyMedium" style={styles.adminNotes}>
                      {booking.adminNotes}
                    </Text>
                  </Surface>
                )}

                <View style={styles.bookingFooter}>
                  <Text variant="bodySmall" style={styles.timestamp}>
                    Submitted: {new Date(booking.createdAt).toLocaleDateString()}
                  </Text>
                  
                  {booking.status === 'pending' && (
                    <Button mode="outlined" onPress={() => {}}>
                      Edit Request
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Book')}
        label="New Booking"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: theme.colors.surface,
    opacity: 0.9,
  },
  filterContainer: {
    padding: 15,
  },
  bookingsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  emptyCard: {
    margin: 20,
    marginTop: 50,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: theme.colors.outline,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.outline,
    marginBottom: 20,
  },
  emptyButton: {
    marginTop: 10,
  },
  bookingCard: {
    marginBottom: 15,
    elevation: 3,
  },
  bookingHeader: {
    marginBottom: 10,
  },
  bookingTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingTitle: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 10,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  bookingDescription: {
    marginBottom: 15,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    color: theme.colors.onSurfaceVariant,
  },
  equipmentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    flex: 1,
    gap: 5,
  },
  equipmentChip: {
    marginRight: 5,
    marginBottom: 5,
  },
  adminNotesContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  adminNotesLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  adminNotes: {
    color: theme.colors.onSurfaceVariant,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  timestamp: {
    color: theme.colors.outline,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default BookingListScreen;