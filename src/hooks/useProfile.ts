// hooks/useProfile.ts

import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState, User } from '@/lib/types';
import { updateUser, logoutUser } from '@/store/userSlice';
import { theme } from '@/lib/theme';

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state: RootState) => state.user);

  // Get user's bookings from the booking slice
  const { userBookings, loading: bookingsLoading } = useAppSelector(
    (state: RootState) => state.bookings
  );

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || '',
  });

  // Update local editData if currentUser changes in Redux (e.g., after save)
  useEffect(() => {
    if (currentUser && !isEditing) {
      setEditData({
        name: currentUser.name,
        phone: currentUser.phone,
        department: currentUser.department,
      });
    }
  }, [currentUser, isEditing]);

  // Memoize stats based on userBookings from the store
  const userStats = useMemo(() => {
    return {
      totalBookings: userBookings.length,
      approvedBookings: userBookings.filter((b) => b.status === 'approved').length,
      pendingBookings: userBookings.filter((b) => b.status === 'pending').length,
      rejectedBookings: userBookings.filter((b) => b.status === 'rejected').length,
    };
  }, [userBookings]);

  // --- Event Handlers ---

  const handleSave = async () => {
    if (!editData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      // Dispatch the updateUser thunk with the partial data
      await dispatch(updateUser(editData)).unwrap();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Update Failed', error.message || 'Could not update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to current user state
    if (currentUser) {
      setEditData({
        name: currentUser.name,
        phone: currentUser.phone,
        department: currentUser.department,
      });
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setShowLogoutDialog(false);
    // After logout, the root layout will automatically redirect to login
    router.replace('/(auth)/login');
  };

  // --- Helper Functions ---

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

  return {
    currentUser,
    userStats,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    handleSave,
    handleCancelEdit,
    showLogoutDialog,
    setShowLogoutDialog,
    handleLogout,
    getRoleIcon,
    getRoleColor,
    bookingsLoading,
  };
};