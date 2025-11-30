// components/home/TodayEventCard.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { Booking } from "@/lib/types";
import { router } from "expo-router";

interface TodayEventCardProps {
  booking: Booking;
}

export const TodayEventCard: React.FC<TodayEventCardProps> = ({ booking }) => {
  const isApproved = booking.status === "approved";
  const statusBg = isApproved ? "#E8F5E8" : "#FFF3E0";
  const statusColor = isApproved ? "#2E7D32" : "#E65100";

  return (
    <Card
      style={styles.eventCard}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/bookings/details",
          params: { booking: JSON.stringify(booking) },
        })
      }
    >
      <Card.Content>
        <View style={styles.eventHeader}>
          <Text variant="titleMedium" style={styles.eventTitle}>
            {booking.title}
          </Text>
          <Chip
            mode="flat"
            style={[styles.statusChip, { backgroundColor: statusBg }]}
            textStyle={{ color: statusColor }}
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
  );
};

const styles = StyleSheet.create({
  eventCard: {
    marginBottom: 10,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  eventTitle: {
    flex: 1,
    fontWeight: "bold",
  },
  statusChip: {
    marginLeft: 10,
  },
  eventDetails: {
    gap: 5,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventDetailText: {
    marginLeft: 8,
    color: theme.colors.onSurfaceVariant,
  },
});
