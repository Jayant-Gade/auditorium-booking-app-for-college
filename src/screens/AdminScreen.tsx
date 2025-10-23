import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  Surface,
  SegmentedButtons,
  Portal,
  Dialog,
  TextInput,
  DataTable,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { approveBooking, rejectBooking, updateStatistics } from '../store/adminSlice';
import { theme } from '../theme/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface AdminScreenProps {
  navigation: any;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const { statistics } = useSelector((state: RootState) => state.admin);

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [adminNotes, setAdminNotes] = useState('');

  // Check if user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Card style={styles.accessDeniedCard}>
          <Card.Content style={styles.accessDeniedContent}>
            <Icon name="shield-alert" size={64} color={theme.colors.error} />
            <Text variant="headlineSmall" style={styles.accessDeniedTitle}>
              Access Denied
            </Text>
            <Text variant="bodyMedium" style={styles.accessDeniedText}>
              You don't have administrative privileges to access this panel.
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => b.status === 'approved');
  const rejectedBookings = bookings.filter(b => b.status === 'rejected');

  const getCurrentBookings = () => {
    switch (activeTab) {
      case 'pending':
        return pendingBookings;
      case 'approved':
        return approvedBookings;
      case 'rejected':
        return rejectedBookings;
      default:
        return bookings;
    }
  };

  const handleAction = (booking: any, action: 'approve' | 'reject') => {
    setSelectedBooking(booking);
    setActionType(action);
    setShowActionDialog(true);
    setAdminNotes('');
  };

  const confirmAction = () => {
    if (!selectedBooking) return;

    if (actionType === 'approve') {
      dispatch(approveBooking({ id: selectedBooking.id, adminNotes }));
      Alert.alert('Success', 'Booking has been approved successfully!');
    } else {
      dispatch(rejectBooking({ id: selectedBooking.id, adminNotes }));
      Alert.alert('Success', 'Booking has been rejected.');
    }

    setShowActionDialog(false);
    setSelectedBooking(null);
    setAdminNotes('');
  };

  const checkConflicts = (booking: any) => {
    return bookings.filter(b => 
      b.id !== booking.id &&
      b.date === booking.date &&
      b.status === 'approved' &&
      ((booking.startTime >= b.startTime && booking.startTime < b.endTime) ||
       (booking.endTime > b.startTime && booking.endTime <= b.endTime) ||
       (booking.startTime <= b.startTime && booking.endTime >= b.endTime))
    );
  };

  const stats = {
    totalBookings: bookings.length,
    pendingCount: pendingBookings.length,
    approvedCount: approvedBookings.length,
    rejectedCount: rejectedBookings.length,
    monthlyBookings: bookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Admin Panel
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Manage auditorium bookings and requests
        </Text>
      </View>

      {/* Statistics */}
      <View style={styles.statsSection}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Overview
        </Text>
        <View style={styles.statsGrid}>
          <Surface style={[styles.statCard, { backgroundColor: theme.colors.primary }]}>
            <Icon name="calendar-multiple" size={30} color={theme.colors.surface} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.totalBookings}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Total Bookings
            </Text>
          </Surface>
          
          <Surface style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
            <Icon name="clock" size={30} color={theme.colors.surface} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.pendingCount}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Pending
            </Text>
          </Surface>
        </View>

        <View style={styles.statsGrid}>
          <Surface style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
            <Icon name="check-circle" size={30} color={theme.colors.surface} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.approvedCount}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Approved
            </Text>
          </Surface>

          <Surface style={[styles.statCard, { backgroundColor: '#F44336' }]}>
            <Icon name="close-circle" size={30} color={theme.colors.surface} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.rejectedCount}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Rejected
            </Text>
          </Surface>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsSection}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            {
              value: 'pending',
              label: `Pending (${stats.pendingCount})`,
              icon: 'clock',
            },
            {
              value: 'approved',
              label: `Approved (${stats.approvedCount})`,
              icon: 'check',
            },
            {
              value: 'rejected',
              label: `Rejected (${stats.rejectedCount})`,
              icon: 'close',
            },
          ]}
        />
      </View>

      {/* Bookings List */}
      <View style={styles.bookingsSection}>
        {getCurrentBookings().length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="calendar-remove" size={48} color={theme.colors.outline} />
              <Text variant="bodyLarge" style={styles.emptyText}>
                No {activeTab} bookings found
              </Text>
            </Card.Content>
          </Card>
        ) : (
          getCurrentBookings().map((booking) => {
            const conflicts = checkConflicts(booking);
            return (
              <Card key={booking.id} style={styles.bookingCard}>
                <Card.Content>
                  <View style={styles.bookingHeader}>
                    <Text variant="titleMedium" style={styles.bookingTitle}>
                      {booking.title}
                    </Text>
                    <Chip
                      mode="flat"
                      style={[
                        styles.statusChip,
                        {
                          backgroundColor:
                            booking.status === 'approved'
                              ? '#E8F5E8'
                              : booking.status === 'pending'
                              ? '#FFF3E0'
                              : '#FFEBEE',
                        },
                      ]}
                      textStyle={{
                        color:
                          booking.status === 'approved'
                            ? '#2E7D32'
                            : booking.status === 'pending'
                            ? '#E65100'
                            : '#C62828',
                      }}
                    >
                      {booking.status.toUpperCase()}
                    </Chip>
                  </View>

                  {conflicts.length > 0 && (
                    <Surface style={styles.conflictBanner}>
                      <Icon name="alert" size={20} color="#D84315" />
                      <Text variant="bodyMedium" style={styles.conflictText}>
                        Time conflict with {conflicts.length} existing booking(s)
                      </Text>
                    </Surface>
                  )}

                  <View style={styles.bookingDetails}>
                    <View style={styles.detailRow}>
                      <Icon name="calendar" size={16} color={theme.colors.outline} />
                      <Text variant="bodyMedium" style={styles.detailText}>
                        {new Date(booking.date).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="clock" size={16} color={theme.colors.outline} />
                      <Text variant="bodyMedium" style={styles.detailText}>
                        {booking.startTime} - {booking.endTime}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="account" size={16} color={theme.colors.outline} />
                      <Text variant="bodyMedium" style={styles.detailText}>
                        {booking.organizerName} ({booking.department})
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Icon name="account-group" size={16} color={theme.colors.outline} />
                      <Text variant="bodyMedium" style={styles.detailText}>
                        {booking.expectedAttendees} attendees
                      </Text>
                    </View>
                  </View>

                  {booking.description && (
                    <Text variant="bodyMedium" style={styles.description}>
                      {booking.description}
                    </Text>
                  )}

                  {booking.equipmentNeeded.length > 0 && (
                    <View style={styles.equipmentSection}>
                      <Text variant="labelMedium" style={styles.equipmentLabel}>
                        Equipment Required:
                      </Text>
                      <View style={styles.equipmentChips}>
                        {booking.equipmentNeeded.map((equipment) => (
                          <Chip key={equipment} style={styles.equipmentChip} compact>
                            {equipment}
                          </Chip>
                        ))}
                      </View>
                    </View>
                  )}

                  {booking.status === 'pending' && (
                    <View style={styles.actionButtons}>
                      <Button
                        mode="contained"
                        onPress={() => handleAction(booking, 'approve')}
                        style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                        icon="check"
                      >
                        Approve
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => handleAction(booking, 'reject')}
                        style={[styles.actionButton, { backgroundColor: '#F44336' }]}
                        icon="close"
                      >
                        Reject
                      </Button>
                    </View>
                  )}

                  {booking.adminNotes && (
                    <Surface style={styles.adminNotesContainer}>
                      <Text variant="labelMedium" style={styles.adminNotesLabel}>
                        Admin Notes:
                      </Text>
                      <Text variant="bodyMedium">{booking.adminNotes}</Text>
                    </Surface>
                  )}
                </Card.Content>
              </Card>
            );
          })
        )}
      </View>

      {/* Action Dialog */}
      <Portal>
        <Dialog visible={showActionDialog} onDismiss={() => setShowActionDialog(false)}>
          <Dialog.Title>
            {actionType === 'approve' ? 'Approve' : 'Reject'} Booking
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 15 }}>
              {actionType === 'approve'
                ? 'Are you sure you want to approve this booking?'
                : 'Are you sure you want to reject this booking?'}
            </Text>
            <TextInput
              label="Admin Notes (Optional)"
              value={adminNotes}
              onChangeText={setAdminNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Add any additional notes or comments..."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowActionDialog(false)}>Cancel</Button>
            <Button
              onPress={confirmAction}
              mode="contained"
              buttonColor={actionType === 'approve' ? '#4CAF50' : '#F44336'}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
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
  accessDeniedCard: {
    margin: 20,
    marginTop: 100,
  },
  accessDeniedContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  accessDeniedTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: theme.colors.error,
  },
  accessDeniedText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    elevation: 4,
  },
  statNumber: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: theme.colors.surface,
    marginTop: 4,
    textAlign: 'center',
  },
  tabsSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  bookingsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyCard: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    marginTop: 10,
    color: theme.colors.outline,
  },
  bookingCard: {
    marginBottom: 15,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingTitle: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 10,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  conflictBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#D84315',
  },
  conflictText: {
    marginLeft: 8,
    color: '#D84315',
    fontWeight: 'bold',
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 10,
    color: theme.colors.onSurfaceVariant,
  },
  description: {
    marginBottom: 15,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  equipmentSection: {
    marginBottom: 15,
  },
  equipmentLabel: {
    marginBottom: 5,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  equipmentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  equipmentChip: {
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  adminNotesContainer: {
    marginTop: 15,
    padding: 15,
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
});

export default AdminScreen;