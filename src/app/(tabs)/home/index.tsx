// app/(tabs)/home/index.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

// Adjust paths as needed
import { theme } from "@/lib/theme";
import { useHomeDashboard } from "@/hooks/useHomeDashboard";
import { ScreenContainer } from "@/components/layout/ScreenContainer"; // Assuming this is your ScrollView
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StatCard } from "@/components/home/StatCard";
import { EmptyCard } from "@/components/common/EmptyCard";
import { TodayEventCard } from "@/components/home/TodayEventCard";
import { QuickActions } from "@/components/home/QuickActions";
import { UpcomingEventCard } from "@/components/home/UpcomingEventCard";

export default function HomeScreen() {
  const { currentUser, todayBookings, upcomingBookings, stats } =
    useHomeDashboard();

  return (
    <ScreenContainer>
      {/* Header Section */}
      <WelcomeHeader user={currentUser} />

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Quick Overview
        </Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Approved"
            value={stats.approvedBookings}
            iconName="calendar-check"
            color={theme.colors.primary}
          />
          <StatCard
            label="Pending"
            value={stats.pendingBookings}
            iconName="calendar-clock"
            color={theme.colors.secondary}
          />
          <StatCard
            label="Your Bookings"
            value={stats.userBookings}
            iconName="account-check"
            color={theme.colors.tertiary || "#4CAF50"}
          />
        </View>
      </View>

      {/* Today's Events */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Today's Events
        </Text>
        {todayBookings.length === 0 ? (
          <EmptyCard
            message="No events scheduled for today"
            iconName="calendar-today"
          />
        ) : (
          todayBookings.map((booking) => (
            <TodayEventCard key={booking._id} booking={booking} />
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <QuickActions user={currentUser} />
      </View>

      {/* Upcoming Events */}
      {upcomingBookings.length > 0 && (
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Upcoming Events
          </Text>
          {upcomingBookings.map((booking) => (
            <UpcomingEventCard key={booking._id} booking={booking} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

// Styles remaining are for layout and sectioning
const styles = StyleSheet.create({
  statsContainer: {
    padding: 20,
    paddingTop: 25,
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
