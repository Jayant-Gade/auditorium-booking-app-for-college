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
  Avatar,
  TextInput,
  Surface,
  Portal,
  Dialog,
  List,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateUser, logoutUser } from '../store/userSlice';
import { theme } from '../theme/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { bookings } = useSelector((state: RootState) => state.bookings);

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || '',
  });

  const userBookings = bookings.filter(booking => 
    booking.organizerEmail === currentUser?.email
  );

  const userStats = {
    totalBookings: userBookings.length,
    approvedBookings: userBookings.filter(b => b.status === 'approved').length,
    pendingBookings: userBookings.filter(b => b.status === 'pending').length,
    rejectedBookings: userBookings.filter(b => b.status === 'rejected').length,
  };

  const handleSave = () => {
    if (!editData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    dispatch(updateUser(editData));
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.replace('Login');
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'shield-crown';
      case 'faculty':
        return 'school';
      case 'student':
        return 'account-school';
      default:
        return 'account';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return '#F44336';
      case 'faculty':
        return '#2196F3';
      case 'student':
        return '#4CAF50';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Avatar.Text
            size={80}
            label={currentUser?.name.substring(0, 2).toUpperCase() || 'YC'}
            style={[styles.avatar, { backgroundColor: getRoleColor(currentUser?.role) }]}
            labelStyle={styles.avatarLabel}
          />
          <View style={styles.profileInfo}>
            <Text variant="headlineSmall" style={styles.profileName}>
              {currentUser?.name}
            </Text>
            <Text variant="bodyMedium" style={styles.profileEmail}>
              {currentUser?.email}
            </Text>
            <View style={styles.roleContainer}>
              <Icon 
                name={getRoleIcon(currentUser?.role)} 
                size={20} 
                color={getRoleColor(currentUser?.role)} 
              />
              <Text variant="bodyMedium" style={[styles.profileRole, { color: getRoleColor(currentUser?.role) }]}>
                {currentUser?.role?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* User Statistics */}
      <View style={styles.statsSection}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          My Statistics
        </Text>
        <View style={styles.statsGrid}>
          <Surface style={[styles.statCard, { backgroundColor: theme.colors.primary }]}>
            <Icon name="calendar-multiple" size={24} color={theme.colors.surface} />
            <Text variant="titleMedium" style={styles.statNumber}>
              {userStats.totalBookings}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Total Bookings
            </Text>
          </Surface>
          
          <Surface style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
            <Icon name="check-circle" size={24} color={theme.colors.surface} />
            <Text variant="titleMedium" style={styles.statNumber}>
              {userStats.approvedBookings}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Approved
            </Text>
          </Surface>
        </View>

        <View style={styles.statsGrid}>
          <Surface style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
            <Icon name="clock" size={24} color={theme.colors.surface} />
            <Text variant="titleMedium" style={styles.statNumber}>
              {userStats.pendingBookings}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Pending
            </Text>
          </Surface>

          <Surface style={[styles.statCard, { backgroundColor: '#F44336' }]}>
            <Icon name="close-circle" size={24} color={theme.colors.surface} />
            <Text variant="titleMedium" style={styles.statNumber}>
              {userStats.rejectedBookings}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Rejected
            </Text>
          </Surface>
        </View>
      </View>

      {/* Profile Information */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Profile Information
            </Text>
            <Button
              mode={isEditing ? 'contained' : 'outlined'}
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
              icon={isEditing ? 'check' : 'pencil'}
              compact
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                label="Full Name"
                value={editData.name}
                onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />

              <TextInput
                label="Phone Number"
                value={editData.phone}
                onChangeText={(text) => setEditData(prev => ({ ...prev, phone: text }))}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
              />

              <TextInput
                label="Department"
                value={editData.department}
                onChangeText={(text) => setEditData(prev => ({ ...prev, department: text }))}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="school" />}
              />

              <View style={styles.editActions}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setIsEditing(false);
                    setEditData({
                      name: currentUser?.name || '',
                      phone: currentUser?.phone || '',
                      department: currentUser?.department || '',
                    });
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Icon name="account" size={20} color={theme.colors.primary} />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Full Name
                  </Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>
                    {currentUser?.name}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Icon name="email" size={20} color={theme.colors.primary} />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Email
                  </Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>
                    {currentUser?.email}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Icon name="phone" size={20} color={theme.colors.primary} />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Phone Number
                  </Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>
                    {currentUser?.phone}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Icon name="school" size={20} color={theme.colors.primary} />
                <View style={styles.infoContent}>
                  <Text variant="bodySmall" style={styles.infoLabel}>
                    Department
                  </Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>
                    {currentUser?.department}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Quick Actions
          </Text>

          <List.Item
            title="My Bookings"
            description="View and manage your bookings"
            left={props => <List.Icon {...props} icon="calendar-check" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Bookings')}
            style={styles.listItem}
          />

          <List.Item
            title="New Booking"
            description="Book the auditorium for an event"
            left={props => <List.Icon {...props} icon="calendar-plus" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Book')}
            style={styles.listItem}
          />

          {currentUser?.role === 'admin' && (
            <List.Item
              title="Admin Panel"
              description="Manage all bookings and requests"
              left={props => <List.Icon {...props} icon="shield-crown" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Admin')}
              style={styles.listItem}
            />
          )}

          <List.Item
            title="About YCCE"
            description="Learn more about the college"
            left={props => <List.Icon {...props} icon="information" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('YCCE', 'Yeshwantrao Chavan College of Engineering, Nagpur')}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Logout Section */}
      <Card style={styles.logoutCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => setShowLogoutDialog(true)}
            icon="logout"
            buttonColor={theme.colors.error}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to logout from the application?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button
              onPress={handleLogout}
              mode="contained"
              buttonColor={theme.colors.error}
            >
              Logout
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
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    marginRight: 20,
  },
  avatarLabel: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    color: theme.colors.surface,
    opacity: 0.9,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileRole: {
    marginLeft: 5,
    fontWeight: 'bold',
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
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
    elevation: 4,
  },
  statNumber: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: theme.colors.surface,
    marginTop: 2,
    textAlign: 'center',
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  actionsCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  logoutCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 30,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  editForm: {
    gap: 15,
  },
  input: {
    marginBottom: 10,
  },
  editActions: {
    marginTop: 10,
  },
  cancelButton: {
    alignSelf: 'flex-start',
  },
  infoList: {
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.outline,
    marginBottom: 2,
  },
  infoValue: {
    color: theme.colors.onSurface,
  },
  listItem: {
    paddingVertical: 5,
  },
  logoutButton: {
    paddingVertical: 5,
  },
});

export default ProfileScreen;