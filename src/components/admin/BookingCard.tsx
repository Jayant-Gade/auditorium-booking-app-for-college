// components/admin/BookingCard.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Chip, Surface, Button } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Assuming theme and types are accessible
import { theme } from "@/lib/theme";
import { Booking, BookingStatus } from "@/lib/types";
import { router } from "expo-router";

interface BookingCardProps {
  booking: Booking;
  conflicts: Booking[];
  onApprove: (booking: Booking) => void;
  onReject: (booking: Booking) => void;
}

const getStatusColors = (status: BookingStatus) => {
  switch (status) {
    case "approved":
      return { bg: "#E8F5E8", text: "#2E7D32" };
    case "pending":
      return { bg: "#FFF3E0", text: "#E65100" };
    case "rejected":
      return { bg: "#FFEBEE", text: "#C62828" };
    default:
      return { bg: theme.colors.surface, text: theme.colors.onSurface };
  }
};

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  conflicts,
  onApprove,
  onReject,
}) => {
  const statusColors = getStatusColors(booking.status);

  return (
    <Card
      key={booking._id}
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
          <Text variant="titleMedium" style={styles.bookingTitle}>
            {booking.title}
          </Text>
          <Chip
            mode="flat"
            style={[styles.statusChip, { backgroundColor: statusColors.bg }]}
            textStyle={{ color: statusColors.text }}
          >
            {booking.status.toUpperCase()}
          </Chip>
        </View>

        {conflicts.length > 0 && (
          <Surface style={styles.conflictBanner}>
            <Icon name="alert" size={20} color="#D84315" />
            <Text variant="bodyMedium" style={styles.conflictText}>
              Time conflict with {conflicts.length} existing booking(s)
            </Text>
          </Surface>
        )}

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" style={styles.detailText}>
              {new Date(booking.date).toLocaleDateString()}
            </Text>
          </View>
          {/* ... other detail rows ... */}
          <View style={styles.detailRow}>
            <Icon name="clock" size={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" style={styles.detailText}>
              {booking.startTime} - {booking.endTime}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="account" size={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" style={styles.detailText}>
              {booking.organizerName} ({booking.department})
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="account-group" size={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" style={styles.detailText}>
              {booking.expectedAttendees} attendees
            </Text>
          </View>
        </View>

        {booking.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {booking.description}
          </Text>
        )}

        {booking.equipmentNeeded.length > 0 && (
          <View style={styles.equipmentRow}>
            <Icon name="tools" size={16} color={theme.colors.outline} />
            <View style={styles.equipmentList}>
              {(() => {
                // 1. Define your default items exactly as they appear in state
                const defaultItems = [
                  "Audio System",
                  "Video/Projector",
                  "Air Conditioning",
                ];

                // 2. Separate the user's selection into 'Defaults' and 'Custom'
                const selectedDefaults = booking.equipmentNeeded.filter(
                  (item) => defaultItems.includes(item)
                );
                const hasCustom = booking.equipmentNeeded.some(
                  (item) => !defaultItems.includes(item)
                );

                return (
                  <>
                    {/* Render the specific chips for default items */}
                    {selectedDefaults.map((equipment) => (
                      <Chip
                        key={equipment}
                        style={styles.equipmentChip}
                        compact
                      >
                        {equipment}
                      </Chip>
                    ))}

                    {/* If any item exists that is NOT in the default list, show + Other */}
                    {hasCustom && (
                      <Chip
                        style={[styles.equipmentChip]}
                        compact
                        icon="plus"
                        onPress={() => {
                          // Find the custom text (it's the item not in defaultItems)
                          const otherText = booking.equipmentNeeded.find(
                            (item) => !defaultItems.includes(item)
                          );
                          alert(`Other Requirements: ${otherText}`);
                        }}
                      >
                        Other
                      </Chip>
                    )}
                  </>
                );
              })()}
            </View>
          </View>
        )}

        {booking.status === "pending" && (
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => onApprove(booking)}
              style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
              icon="check"
            >
              Approve
            </Button>
            <Button
              mode="contained"
              onPress={() => onReject(booking)}
              style={[styles.actionButton, { backgroundColor: "#F44336" }]}
              icon="close"
            >
              Reject
            </Button>
          </View>
        )}

        {booking.adminNotes && (
          <Surface style={styles.adminNotesContainer}>
            <Text variant="labelMedium" style={styles.adminNotesLabel}>
              Admin Notes:
            </Text>
            <Text variant="bodyMedium">{booking.adminNotes}</Text>
          </Surface>
        )}
      </Card.Content>
    </Card>
  );
};

// Add all the relevant styles from the original file
const styles = StyleSheet.create({
  bookingCard: {
    marginBottom: 15,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bookingTitle: {
    flex: 1,
    fontWeight: "bold",
    marginRight: 10,
  },
  statusChip: {
    alignSelf: "flex-start",
  },
  conflictBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#D84315",
  },
  conflictText: {
    marginLeft: 8,
    color: "#D84315",
    fontWeight: "bold",
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 10,
    color: theme.colors.onSurfaceVariant,
  },
  description: {
    marginBottom: 15,
    color: theme.colors.onSurfaceVariant,
    fontStyle: "italic",
  },
  equipmentSection: {
    marginBottom: 15,
  },
  equipmentLabel: {
    marginBottom: 5,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  equipmentChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  equipmentChip: {
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  adminNotesContainer: {
    marginTop: 15,
    padding: 15,
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
});
