// components/home/UpcomingEventCard.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { Booking } from "@/lib/types";
import { router } from "expo-router";

interface UpcomingEventCardProps {
  booking: Booking;
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  booking,
}) => {
  return (
    <Card
      style={styles.eventCard}
      onPress={() =>
        router.push({
          pathname: "/booking-details",
          params: { booking: JSON.stringify(booking) },
        })
      }
    >
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
  eventDate: {
    color: theme.colors.outline,
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
