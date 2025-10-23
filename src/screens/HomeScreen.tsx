import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Chip,
  Surface,
  ProgressBar,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { theme } from '../theme/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { bookings } = useSelector((state: RootState) => state.bookings);

  const todayBookings = bookings.filter(booking => {
    const today = new Date().toDateString();
    return new Date(booking.date).toDateString() === today;
  });

  const upcomingBookings = bookings.filter(booking => {
    const today = new Date();
    const bookingDate = new Date(booking.date);
    return bookingDate > today && booking.status === 'approved';
  }).slice(0, 3);

  const stats = {
    totalBookings: bookings.length,
    approvedBookings: bookings.filter(b => b.status === 'approved').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    userBookings: bookings.filter(b => b.organizerEmail === currentUser?.email).length,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.headerBackground}
        imageStyle={styles.headerImage}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.welcomeSection}>
            <Avatar.Text
              size={60}
              label={currentUser?.name.substring(0, 2).toUpperCase() || 'YC'}
              style={styles.avatar}
            />
            <View style={styles.welcomeText}>
              <Text variant="headlineSmall" style={styles.welcomeTitle}>
                Welcome back!
              </Text>
              <Text variant="titleMedium" style={styles.userName}>
                {currentUser?.name}
              </Text>
              <Chip
                mode="outlined"
                style={styles.roleChip}
                textStyle={styles.roleChipText}
              >
                {currentUser?.role?.toUpperCase()}
              </Chip>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Quick Overview
        </Text>
        <View style={styles.statsGrid}>
          <Surface style={[styles.statCard, { backgroundColor: theme.colors.primary }]}>
            <Icon name="calendar-check" size={30} color={theme.colors.surface} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.approvedBookings}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Approved
            </Text>
          </Surface>
          <Surface style={[styles.statCard, { backgroundColor: theme.colors.secondary }]}>
            <Icon name="calendar-clock" size={30} color={theme.colors.surface} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.pendingBookings}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Pending
            </Text>
          </Surface>
          <Surface style={[styles.statCard, { backgroundColor: theme.colors.tertiary || '#4CAF50' }]}>
            <Icon name="account-check" size={30} color={theme.colors.surface} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {stats.userBookings}
            </Text>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Your Bookings
            </Text>
          </Surface>
        </View>
      </View>

      {/* Today's Events */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Today's Events
        </Text>
        {todayBookings.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="calendar-today" size={48} color={theme.colors.outline} />
              <Text variant="bodyLarge" style={styles.emptyText}>
                No events scheduled for today
              </Text>
            </Card.Content>
          </Card>
        ) : (
          todayBookings.map((booking) => (
            <Card key={booking.id} style={styles.eventCard}>
              <Card.Content>
                <View style={styles.eventHeader}>
                  <Text variant="titleMedium" style={styles.eventTitle}>
                    {booking.title}
                  </Text>
                  <Chip
                    mode="flat"
                    style={[
                      styles.statusChip,
                      { backgroundColor: booking.status === 'approved' ? '#E8F5E8' : '#FFF3E0' },
                    ]}
                    textStyle={{
                      color: booking.status === 'approved' ? '#2E7D32' : '#E65100',
                    }}
                  >
                    {booking.status}
                  </Chip>
                </View>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <Icon name="clock" size={16} color={theme.colors.outline} />
                    <Text variant="bodyMedium" style={styles.eventDetailText}>
                      {booking.startTime} - {booking.endTime}
                    </Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Icon name="account" size={16} color={theme.colors.outline} />
                    <Text variant="bodyMedium" style={styles.eventDetailText}>
                      {booking.organizerName}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Book')}
            icon="calendar-plus"
          >
            Book Auditorium
          </Button>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Bookings')}
            icon="calendar-check"
          >
            View My Bookings
          </Button>
          {currentUser?.role === 'admin' && (
            <Button
              mode="contained-tonal"
              style={[styles.actionButton, { backgroundColor: theme.colors.secondaryContainer }]}
              onPress={() => navigation.navigate('Admin')}
              icon="shield-crown"
            >
              Admin Panel
            </Button>
          )}
        </View>
      </View>

      {/* Upcoming Events */}
      {upcomingBookings.length > 0 && (
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Upcoming Events
          </Text>
          {upcomingBookings.map((booking) => (
            <Card key={booking.id} style={styles.eventCard}>
              <Card.Content>
                <View style={styles.eventHeader}>
                  <Text variant="titleMedium" style={styles.eventTitle}>
                    {booking.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.eventDate}>
                    {new Date(booking.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <Icon name="clock" size={16} color={theme.colors.outline} />
                    <Text variant="bodyMedium" style={styles.eventDetailText}>
                      {booking.startTime} - {booking.endTime}
                    </Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Icon name="school" size={16} color={theme.colors.outline} />
                    <Text variant="bodyMedium" style={styles.eventDetailText}>
                      {booking.department}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBackground: {
    height: 200,
    width: '100%',
  },
  headerImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 101, 192, 0.8)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    justifyContent: 'flex-end',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.surface,
    marginRight: 15,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  userName: {
    color: theme.colors.surface,
    marginTop: 2,
  },
  roleChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: theme.colors.surface,
  },
  roleChipText: {
    color: theme.colors.surface,
    fontSize: 12,
  },
  statsContainer: {
    padding: 20,
    paddingTop: 25,
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  section: {
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
  eventCard: {
    marginBottom: 10,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  eventDate: {
    color: theme.colors.outline,
  },
  statusChip: {
    marginLeft: 10,
  },
  eventDetails: {
    gap: 5,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    marginLeft: 8,
    color: theme.colors.onSurfaceVariant,
  },
  actionsContainer: {
    gap: 10,
  },
  actionButton: {
    paddingVertical: 5,
  },
});

export default HomeScreen;