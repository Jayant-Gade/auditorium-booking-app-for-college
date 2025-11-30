// components/profile/ProfileStats.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { ProfileStatCard } from "./ProfileStatCard";

interface UserStats {
  totalBookings: number;
  approvedBookings: number;
  pendingBookings: number;
  rejectedBookings: number;
}

interface ProfileStatsProps {
  stats: UserStats;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <View style={styles.statsSection}>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        My Statistics
      </Text>
      <View style={styles.statsGrid}>
        <ProfileStatCard
          label="Total Bookings"
          value={stats.totalBookings}
          iconName="calendar-multiple"
          color={theme.colors.primary}
        />
        <ProfileStatCard
          label="Approved"
          value={stats.approvedBookings}
          iconName="check-circle"
          color="#4CAF50"
        />
      </View>
      <View style={styles.statsGrid}>
        <ProfileStatCard
          label="Pending"
          value={stats.pendingBookings}
          iconName="clock"
          color="#FF9800"
        />
        <ProfileStatCard
          label="Rejected"
          value={stats.rejectedBookings}
          iconName="close-circle"
          color="#F44336"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsSection: {
    padding: 20,
  },
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
});
