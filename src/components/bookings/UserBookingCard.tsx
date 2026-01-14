// components/bookings/UserBookingCard.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip, Surface, Button } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { Booking, BookingStatus } from "@/lib/types";
import { router } from "expo-router";

interface UserBookingCardProps {
  booking: Booking;
  onEdit: (booking: Booking) => void;
}

const getStatusStyle = (status: BookingStatus) => {
  switch (status) {
    case "approved":
      return {
        backgroundColor: "#E8F5E8",
        color: "#2E7D32",
        icon: "check-circle",
      };
    case "pending":
      return {
        backgroundColor: "#FFF3E0",
        color: "#E65100",
        icon: "clock",
      };
    case "rejected":
      return {
        backgroundColor: "#FFEBEE",
        color: "#C62828",
        icon: "close-circle",
      };
    default:
      return {
        backgroundColor: theme.colors.surface,
        color: theme.colors.onSurface,
        icon: "help-circle",
      };
  }
};

export const UserBookingCard: React.FC<UserBookingCardProps> = ({
  booking,
  onEdit,
}) => {
  const statusStyle = getStatusStyle(booking.status);

  return (
    <Card
      style={styles.bookingCard}
      onPress={() =>
        router.push({
          pathname: "/booking-details",
          params: { booking: JSON.stringify(booking) },
        })
      }
    >
      <Card.Content>
        <View style={styles.bookingHeader}>
          <View style={styles.bookingTitleRow}>
            <Text variant="titleMedium" style={styles.bookingTitle}>
              {booking.title}
            </Text>
            <Chip
              mode="flat"
              style={[
                styles.statusChip,
                { backgroundColor: statusStyle.backgroundColor },
              ]}
              textStyle={{ color: statusStyle.color }}
              icon={statusStyle.icon}
            >
              {booking.status.toUpperCase()}
            </Chip>
          </View>
        </View>

        {booking.description && (
          <Text variant="bodyMedium" style={styles.bookingDescription}>
            {booking.description}
          </Text>
        )}

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" style={styles.detailText}>
              {new Date(booking.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="clock" size={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" style={styles.detailText}>
              {booking.startTime} - {booking.endTime}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="account-group" size={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" style={styles.detailText}>
              {booking.expectedAttendees} attendees
            </Text>
          </View>

          {booking.equipmentNeeded.length > 0 && (
            <View style={styles.equipmentRow}>
              <Icon name="tools" size={16} color={theme.colors.outline} />
              <View style={styles.equipmentList}>
                {booking.equipmentNeeded.slice(0, 3).map((equipment) => (
                  <Chip key={equipment} style={styles.equipmentChip} compact>
                    {equipment}
                  </Chip>
                ))}
                {booking.equipmentNeeded.length > 3 && (
                  <Chip style={styles.equipmentChip} compact>
                    + Other
                  </Chip>
                )}
              </View>
            </View>
          )}
        </View>

        {booking.adminNotes && (
          <Surface style={styles.adminNotesContainer}>
            <Text variant="labelMedium" style={styles.adminNotesLabel}>
              Admin Notes:
            </Text>
            <Text variant="bodyMedium" style={styles.adminNotes}>
              {booking.adminNotes}
            </Text>
          </Surface>
        )}

        <View style={styles.bookingFooter}>
          <Text variant="bodySmall" style={styles.timestamp}>
            Submitted: {new Date(booking.createdAt).toLocaleDateString()}
          </Text>

          {booking.status === "pending" && (
            <Button mode="outlined" onPress={() => onEdit(booking)}>
              Edit Request
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  bookingCard: {
    marginBottom: 15,
    elevation: 3,
  },
  bookingHeader: {
    marginBottom: 10,
  },
  bookingTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bookingTitle: {
    flex: 1,
    fontWeight: "bold",
    marginRight: 10,
  },
  statusChip: {
    alignSelf: "flex-start",
  },
  bookingDescription: {
    marginBottom: 15,
    color: theme.colors.onSurfaceVariant,
    fontStyle: "italic",
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    color: theme.colors.onSurfaceVariant,
  },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
  },
  equipmentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 10,
    flex: 1,
    gap: 5,
  },
  equipmentChip: {
    marginRight: 5,
    marginBottom: 5,
  },
  adminNotesContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  adminNotesLabel: {
    color: theme.colors.primary,
    fontWeight: "bold",
    marginBottom: 5,
  },
  adminNotes: {
    color: theme.colors.onSurfaceVariant,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  timestamp: {
    color: theme.colors.outline,
  },
});
