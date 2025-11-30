// app/(tabs)/home/book.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  Surface,
  Checkbox,
} from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

// Adjust paths as needed
import { theme } from "@/lib/theme";
import { useBookingForm } from "@/hooks/useBookingForm";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { DatePickerDialog } from "@/components/bookings/DatePickerDialog";
import { TimePickerDialog } from "@/components/bookings/TimePickerDialog";

// This component replaces the original BookingScreen
export default function BookBookingScreen() {
  const {
    currentUser,
    formData,
    loading,
    handleValueChange,
    needsAudio,
    setNeedsAudio,
    needsVideo,
    setNeedsVideo,
    needsAC,
    setNeedsAC,
    handleSubmit,
    showDatePicker,
    setShowDatePicker,
    handleDateSelect,
    showTimePicker,
    setShowTimePicker,
    timePickerType,
    setTimePickerType,
    handleTimeSelect,
  } = useBookingForm();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Book Auditorium
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Fill in the details for your event booking
        </Text>
      </View>

      <Card style={styles.formCard}>
        <Card.Content>
          {/* Event Details */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Event Details
            </Text>

            <TextInput
              label="Event Title *"
              value={formData.title}
              onChangeText={(text) => handleValueChange("title", text)}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="calendar-text" />}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => handleValueChange("description", text)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="text" />}
            />

            <TextInput
              label="Expected Attendees *"
              value={formData.expectedAttendees}
              onChangeText={(text) =>
                handleValueChange("expectedAttendees", text)
              }
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              left={<TextInput.Icon icon="account-group" />}
            />
          </View>

          {/* Date and Time */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Date & Time
            </Text>

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              icon="calendar"
            >
              {formData.date
                ? new Date(formData.date + "T00:00:00").toLocaleDateString()
                : "Select Date *"}
            </Button>

            <View style={styles.timeRow}>
              <Button
                mode="outlined"
                onPress={() => {
                  setTimePickerType("start");
                  setShowTimePicker(true);
                }}
                style={[styles.timeButton, { marginRight: 10 }]}
                icon="clock"
              >
                {formData.startTime || "Start Time *"}
              </Button>

              <Button
                mode="outlined"
                onPress={() => {
                  setTimePickerType("end");
                  setShowTimePicker(true);
                }}
                style={styles.timeButton}
                icon="clock"
              >
                {formData.endTime || "End Time *"}
              </Button>
            </View>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Equipment Needed
            </Text>

            <Checkbox.Item
              label="Audio System (Mics, Speakers)"
              status={needsAudio ? "checked" : "unchecked"}
              onPress={() => setNeedsAudio(!needsAudio)}
              style={styles.checkboxItem}
            />
            <Checkbox.Item
              label="Video (Projector, Screen)"
              status={needsVideo ? "checked" : "unchecked"}
              onPress={() => setNeedsVideo(!needsVideo)}
              style={styles.checkboxItem}
            />
            <Checkbox.Item
              label="Air Conditioning (A/C)"
              status={needsAC ? "checked" : "unchecked"}
              onPress={() => setNeedsAC(!needsAC)}
              style={styles.checkboxItem}
            />
          </View>

          {/* Organizer Information */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Organizer Information
            </Text>
            <Surface style={styles.organizerInfo}>
              <View style={styles.organizerRow}>
                <Icon name="account" size={20} color={theme.colors.primary} />
                <Text variant="bodyMedium" style={styles.organizerText}>
                  {currentUser?.name}
                </Text>
              </View>
              <View style={styles.organizerRow}>
                <Icon name="email" size={20} color={theme.colors.primary} />
                <Text variant="bodyMedium" style={styles.organizerText}>
                  {currentUser?.email}
                </Text>
              </View>
              <View style={styles.organizerRow}>
                <Icon name="school" size={20} color={theme.colors.primary} />
                <Text variant="bodyMedium" style={styles.organizerText}>
                  {currentUser?.department}
                </Text>
              </View>
            </Surface>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={loading}
            disabled={loading}
            icon="send"
          >
            Submit Booking Request
          </Button>
        </Card.Content>
      </Card>

      {/* Render Dialogs */}
      <DatePickerDialog
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
      />

      <TimePickerDialog
        visible={showTimePicker}
        onDismiss={() => setShowTimePicker(false)}
        onTimeSelect={handleTimeSelect}
        pickerType={timePickerType}
      />
    </ScreenContainer>
  );
}

// These are only the styles needed for the screen layout
const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  checkboxItem: {
    paddingHorizontal: 0, // Align with TextInputs
    paddingVertical: 0,
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
  formCard: {
    margin: 20,
    elevation: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    marginBottom: 15,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  dateButton: {
    marginBottom: 15,
    justifyContent: "flex-start",
    paddingVertical: 8,
  },
  timeRow: {
    flexDirection: "row",
  },
  timeButton: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 8,
  },
  equipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  equipmentChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 32, // Ensure area doesn't collapse
  },
  equipmentChip: {
    marginBottom: 5,
  },
  noEquipmentText: {
    color: theme.colors.outline,
    fontStyle: "italic",
  },
  organizerInfo: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  organizerText: {
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 5,
  },
});
