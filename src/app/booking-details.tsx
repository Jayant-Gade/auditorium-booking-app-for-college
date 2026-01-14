// app/booking-details/index.tsx

import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Card,
  Button,
  Chip,
  Surface,
  Divider,
  IconButton,
} from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteBooking } from "@/store/bookingSlice";
import { theme } from "@/lib/theme";
import { Booking } from "@/lib/types";
import { ViewContainer } from "@/components/layout/ViewContainer";
import { Linking, Platform } from "react-native";
import * as Clipboard from "expo-clipboard";

export default function BookingDetailsScreen() {
  const params = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);

  // Parse the booking string passed via navigation
  let booking: Booking | null = null;
  try {
    if (typeof params.booking === "string") {
      booking = JSON.parse(params.booking);
    }
  } catch (e) {
    console.error("Error parsing booking details", e);
  }

  if (!booking) {
    return (
      <ViewContainer style={styles.centerContainer}>
        <Text>Booking details not found.</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </ViewContainer>
    );
  }

  // --- Helper Functions ---

  const handleDelete = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking request? This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            if (booking?._id) {
              await dispatch(deleteBooking(booking._id));
              router.back();
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "#E8F5E8", text: "#2E7D32", icon: "check-circle" };
      case "pending":
        return { bg: "#FFF3E0", text: "#E65100", icon: "clock" };
      case "rejected":
        return { bg: "#FFEBEE", text: "#C62828", icon: "close-circle" };
      default:
        return { bg: "#F5F5F5", text: "#757575", icon: "help-circle" };
    }
  };

  const statusStyle = getStatusColor(booking.status);
  const isOwner = currentUser?.userId === booking.organizerUserId;
  const isPending = booking.status === "pending";

  const handlePhonePress = (phoneNumber: string) => {
    Alert.alert("Contact Organizer", phoneNumber, [
      {
        text: "Call",
        onPress: () => Linking.openURL(`tel:${phoneNumber}`),
      },
      {
        text: "Copy Number",
        onPress: async () => {
          await Clipboard.setStringAsync(phoneNumber);
          // Optional: Show a small toast or alert
          Alert.alert("Copied", "Phone number copied to clipboard.");
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  const handleEmailPress = (email: string, eventTitle?: string) => {
    const subject = eventTitle
      ? `Inquiry regarding: ${eventTitle}`
      : "Booking Inquiry";

    Alert.alert("Contact Organizer", email, [
      {
        text: "Send Email",
        onPress: () =>
          Linking.openURL(
            `mailto:${email}?subject=${encodeURIComponent(subject)}`
          ),
      },
      {
        text: "Copy Email",
        onPress: async () => {
          await Clipboard.setStringAsync(email);
          // Simple feedback
          Alert.alert("Copied", "Email address copied to clipboard.");
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <Surface style={styles.headerSurface} elevation={2}>
        <View style={styles.navBar}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
            style={styles.backBtn}
          />
          <Text variant="titleMedium" style={styles.navTitle}>
            Booking Details
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Chip
            mode="flat"
            style={{ backgroundColor: statusStyle.bg }}
            textStyle={{ color: statusStyle.text, fontWeight: "bold" }}
            icon={() => (
              <Icon
                name={statusStyle.icon as any}
                size={18}
                color={statusStyle.text}
              />
            )}
          >
            {booking.status.toUpperCase()}
          </Chip>
          <Text variant="bodySmall" style={styles.dateSubmitted}>
            Submitted: {new Date(booking.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text variant="headlineMedium" style={styles.title}>
          {booking.title}
        </Text>
        <Text variant="titleMedium" style={styles.department}>
          {booking.department}
        </Text>
      </Surface>

      <View style={styles.contentContainer}>
        {/* Date & Time Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.row}>
              <Icon
                name="calendar-month"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.rowText}>
                <Text variant="labelMedium" style={styles.label}>
                  Date
                </Text>
                <Text variant="bodyLarge">
                  {new Date(booking.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.row}>
              <Icon
                name="clock-outline"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.rowText}>
                <Text variant="labelMedium" style={styles.label}>
                  Time
                </Text>
                <Text variant="bodyLarge">
                  {booking.startTime} - {booking.endTime}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Details Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionHeader}>
              Details
            </Text>

            {booking.description ? (
              <View style={styles.mb}>
                <Text variant="labelMedium" style={styles.label}>
                  Description
                </Text>
                <Text variant="bodyMedium">{booking.description}</Text>
              </View>
            ) : null}

            <View style={styles.rowNoIcon}>
              <View style={{ flex: 1 }}>
                <Text variant="labelLarge" style={styles.label}>
                  Organizer
                </Text>
                <Text variant="bodyMedium">{booking.organizerName}</Text>
                <Text
                  variant="bodySmall"
                  style={[
                    {
                      color: theme.colors.primary,
                      textDecorationLine: "underline",
                    }, // Changed color to primary to show it's a link
                  ]}
                  onPress={() =>
                    handleEmailPress(booking.organizerEmail, booking.title)
                  }
                >
                  {booking.organizerEmail}
                </Text>
                <View>
                  {/*<Icon name="phone" size={20} color={theme.colors.primary} />*/}
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.organizerText,
                      { color: theme.colors.primary },
                    ]}
                    onPress={() => handlePhonePress(currentUser?.phone || "")}
                  >
                    {currentUser?.phone || "No phone provided"}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="labelLarge" style={styles.label}>
                  Attendees
                </Text>
                <Text variant="bodyMedium">
                  {booking.expectedAttendees} People
                </Text>
              </View>
            </View>

            {booking.equipmentNeeded && booking.equipmentNeeded.length > 0 && (
              <>
                <Text
                  variant="labelLarge"
                  style={[styles.label, { marginTop: 15, marginBottom: 8 }]}
                >
                  Equipment Required
                </Text>

                <View style={styles.equipmentRow}>
                  {booking.equipmentNeeded.map((item, index) => {
                    // Define your standard items
                    const standardItems = [
                      "Audio System",
                      "Video/Projector",
                      "Air Conditioning",
                    ];
                    const isStandard = standardItems.includes(item);

                    if (isStandard) {
                      // Render standard items as compact Chips
                      return (
                        <Chip key={item} compact style={styles.eqChip}>
                          {item}
                        </Chip>
                      );
                    } else {
                      // Render custom requirements as a full-width Surface or View with text wrap
                      return (
                        <View key={index} style={styles.customRequirementBox}>
                          {/*<Icon
                            name="plus-box-outline"
                            size={16}
                            color={theme.colors.primary}
                          />*/}
                          <Text
                            variant="bodyMedium"
                            style={styles.customRequirementText}
                          >
                            {item}
                          </Text>
                        </View>
                      );
                    }
                  })}
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Admin Notes (Visible if present) */}
        {booking.adminNotes && (
          <Card style={[styles.card, { backgroundColor: "#FFF8E1" }]}>
            <Card.Content>
              <View style={styles.row}>
                <Icon name="comment-alert-outline" size={24} color="#F57C00" />
                <View style={styles.rowText}>
                  <Text
                    variant="titleMedium"
                    style={{ color: "#F57C00", fontWeight: "bold" }}
                  >
                    Admin Note
                  </Text>
                  <Text variant="bodyMedium">{booking.adminNotes}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Actions */}
        {isOwner && isPending && (
          <Button
            mode="contained"
            onPress={handleDelete}
            buttonColor={theme.colors.error}
            icon="delete"
            style={styles.deleteButton}
          >
            Cancel Booking Request
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSurface: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: -12, // Pull icon to left align visually
  },
  backBtn: {
    margin: 0,
  },
  navTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  dateSubmitted: {
    color: theme.colors.outline,
  },
  title: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  department: {
    color: theme.colors.outline,
  },
  contentContainer: {
    padding: 15,
    gap: 15,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    elevation: 2,
  },
  equipmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  eqChip: {
    marginBottom: 4,
  },
  customRequirementBox: {
    width: "100%", // Forces it to its own line/full width
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: theme.colors.surfaceVariant,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  customRequirementText: {
    marginLeft: 8,
    flex: 1, // Crucial: This forces the text to wrap instead of pushing out of bounds
    flexWrap: "wrap",
    color: theme.colors.onSurfaceVariant,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rowNoIcon: {
    flexDirection: "row",
    marginTop: 10,
  },
  rowText: {
    marginLeft: 15,
    flex: 1,
  },
  divider: {
    marginVertical: 12,
    marginLeft: 39,
  },
  sectionHeader: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    color: theme.colors.outline,
    marginBottom: 2,
  },
  mb: {
    marginBottom: 15,
  },
  organizerText: {
    marginLeft: 0,
    textDecorationLine: "underline", // Optional: makes it look like a link
  },
  deleteButton: {
    marginTop: 10,
    marginBottom: 30,
  },
});
