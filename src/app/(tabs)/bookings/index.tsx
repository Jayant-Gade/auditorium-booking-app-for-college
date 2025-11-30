// app/(tabs)/bookings/index.tsx

import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { Text, Button, FAB, SegmentedButtons } from "react-native-paper";
import { router } from "expo-router"; // Use router for navigation

// Adjust paths as needed
import { useUserBookings } from "@/hooks/useUserBookings";
import { ViewContainer } from "@/components/layout/ViewContainer";
import { EmptyState } from "@/components/common/EmptyState";
import { UserBookingCard } from "@/components/bookings/UserBookingCard";
import { theme } from "@/lib/theme";
import { Booking } from "@/lib/types";
import { useAppDispatch } from "@/store/hooks"; // Use typed dispatch
import { fetchUserBookings } from "@/store/bookingSlice"; // Import the thunk

export default function MyBookingsScreen() {
  const dispatch = useAppDispatch(); // Use typed dispatch
  const {
    filter,
    setFilter,
    refreshing,
    onRefresh: handleLocalRefresh, // Rename original refresh
    userBookings, // This now comes directly from Redux via the hook
    filteredBookings,
    currentUser,
  } = useUserBookings(); // This hook should select userBookings from the store

  // --- Data Fetching ---
  useEffect(() => {
    // Fetch user bookings when the component mounts or user changes
    if (currentUser?.email) {
      dispatch(fetchUserBookings(currentUser.email));
    }
  }, [currentUser, dispatch]);

  const onRefresh = React.useCallback(() => {
    // Combine local refresh state with data refetching
    handleLocalRefresh(); // Handles the RefreshControl animation state
    if (currentUser?.email) {
      dispatch(fetchUserBookings(currentUser.email)); // Refetch data
    }
  }, [currentUser, dispatch, handleLocalRefresh]);

  // --- Navigation ---
  const handleEdit = (booking: Booking) => {
    // Navigate to an edit screen (assuming it exists)
    // router.push({ pathname: '/(tabs)/editBooking', params: { bookingId: booking._id } });
    console.log("Edit booking:", booking._id); // Placeholder
  };

  const handleNewBooking = () => {
    // Navigate to the booking creation screen using Expo Router path
    router.push("/(tabs)/home/book");
  };

  // --- Empty State ---
  const emptyTitle = "No bookings found";
  const emptyMessage =
    filter === "all"
      ? "You haven't made any bookings yet."
      : `No ${filter} bookings found.`;
  const emptyAction =
    filter === "all" ? (
      <Button
        mode="contained"
        onPress={handleNewBooking}
        icon="plus"
        style={styles.emptyButton}
      >
        Make Your First Booking
      </Button>
    ) : null;

  return (
    <ViewContainer>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          My Bookings
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {userBookings.length} total bookings
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            // Add 'completed' if you use that status
          ]}
        />
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.bookingsList}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBookings.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            action={emptyAction}
            iconName="calendar-remove-outline" // Adjusted icon name
          />
        ) : (
          filteredBookings.map((booking) => (
            <UserBookingCard
              key={booking._id}
              booking={booking}
              onEdit={handleEdit}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleNewBooking}
        label="New Booking"
      />
    </ViewContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: theme.colors.surface,
    fontWeight: "bold",
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
    flex: 1, // Needed for ScrollView to fill space
  },
  scrollContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80, // Add padding to avoid FAB overlap
  },
  emptyButton: {
    // Added style from original code
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
