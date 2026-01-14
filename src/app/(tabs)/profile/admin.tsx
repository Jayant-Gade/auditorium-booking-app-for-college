// app/(tabs)/profile/admin.tsx

import React, { useState, useMemo } from "react"; // Added useMemo for performance
import { View, StyleSheet } from "react-native";
import { Text, SegmentedButtons } from "react-native-paper";

import { useAdminBookings } from "@/hooks/useAdminBookings";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { AccessDenied } from "@/components/common/AccessDenied";
import { EmptyState } from "@/components/common/EmptyState";
import { StatCard } from "@/components/admin/StatCard";
import { BookingCard } from "@/components/admin/BookingCard";
import { ActionDialog } from "@/components/admin/ActionDialog";
import { theme } from "@/lib/theme";
import { Booking } from "@/lib/types";
import { RequestEdit } from "@/components/admin/RequestEdit";

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState("pending");
  const {
    isAdmin,
    stats,
    getCurrentBookings,
    checkConflicts,
    handleAction,
    confirmAction,
    showActionDialog,
    setShowActionDialog,
    actionType,
    adminNotes,
    setAdminNotes,
  } = useAdminBookings();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!isAdmin) {
    return <AccessDenied />;
  }

  const handleEditPress = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowEditDialog(true);
  };

  // --- Sorting Logic ---
  const sortedBookings = useMemo(() => {
    const rawBookings = getCurrentBookings(activeTab);

    return [...rawBookings].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      // Primary Sort: Date
      if (dateA !== dateB) {
        return activeTab === "approved"
          ? dateB - dateA // Latest to Oldest
          : dateA - dateB; // Oldest to Latest (Pending/Rejected)
      }

      // Secondary Sort: Start Time (Always earliest time first for the same day)
      return a.startTime.localeCompare(b.startTime);
    });
  }, [activeTab, getCurrentBookings]);

  return (
    <ScreenContainer>
      {/* Header */}
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
          <StatCard
            label="Total"
            value={stats.totalBookings}
            iconName="calendar-multiple"
            color={theme.colors.primary}
          />
          <StatCard
            label="Pending"
            value={stats.pendingCount}
            iconName="clock"
            color="#FF9800"
          />
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            label="Approved"
            value={stats.approvedCount}
            iconName="check-circle"
            color="#4CAF50"
          />
          <StatCard
            label="Rejected"
            value={stats.rejectedCount}
            iconName="close-circle"
            color="#F44336"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsSection}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            {
              value: "pending",
              label: `Pending (${stats.pendingCount})`,
              icon: "clock",
            },
            {
              value: "approved",
              label: `Approved (${stats.approvedCount})`,
              icon: "check",
            },
            {
              value: "rejected",
              label: `Rejected (${stats.rejectedCount})`,
              icon: "close",
            },
          ]}
        />
      </View>

      {/* Bookings List */}
      <View style={styles.bookingsSection}>
        {sortedBookings.length === 0 ? (
          <EmptyState
            title="No bookings!"
            message={`No ${activeTab} bookings found`}
          />
        ) : (
          sortedBookings.map((booking: Booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              conflicts={checkConflicts(booking)}
              onApprove={() => handleAction(booking, "approve")}
              onReject={() => handleAction(booking, "reject")}
              onUnapprove={() => handleAction(booking, "unapprove")}
              onEdit={() => handleEditPress(booking)}
            />
          ))
        )}
      </View>

      {/* Dialogs */}
      <RequestEdit
        visible={showEditDialog}
        booking={selectedBooking}
        onDismiss={() => {
          setShowEditDialog(false);
          setSelectedBooking(null);
        }}
      />

      <ActionDialog
        visible={showActionDialog}
        onDismiss={() => setShowActionDialog(false)}
        onSubmit={confirmAction}
        actionType={actionType}
        adminNotes={adminNotes}
        onNotesChange={setAdminNotes}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { color: theme.colors.surface, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: theme.colors.surface, opacity: 0.9 },
  statsSection: { padding: 20 },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tabsSection: { paddingHorizontal: 20, marginBottom: 15 },
  bookingsSection: { paddingHorizontal: 20, paddingBottom: 20 },
});
