import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Portal, Dialog, Button, TextInput, Text } from "react-native-paper";

// Project specific imports using relative paths
import { theme } from "../../lib/theme";
import { DatePickerDialog } from "../bookings/DatePickerDialog";
import { TimePickerDialog } from "../bookings/TimePickerDialog";

import { Booking } from "../../lib/types";
import { useAppDispatch } from "../../store/hooks";
import { updateAdminBooking } from "../../store/adminSlice";

interface RequestEditProps {
  visible: boolean;
  booking: Booking | null;
  onDismiss: () => void;
}

/**
 * RequestEdit Component
 * Provides a dialog for administrators to modify existing bookings.
 * Integrated with project-specific DatePickerDialog and TimePickerDialog.
 */
export const RequestEdit: React.FC<RequestEditProps> = ({
  visible,
  booking,
  onDismiss,
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    adminNotes: "",
  });

  // Picker Visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Sync state when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        title: booking.title,
        description: booking.description || "",
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        adminNotes: booking.adminNotes || "",
      });
    }
  }, [booking]);

  if (!booking) return null;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateAdminBooking({
          bookingId: booking._id,
          data: formData,
        })
      ).unwrap();
      onDismiss();
    } catch (error) {
      // Error handled by slice
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Admin: Edit Details</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TextInput
              label="Event Title"
              value={formData.title}
              onChangeText={(text: string) =>
                setFormData({ ...formData, title: text })
              }
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text: string) =>
                setFormData({ ...formData, description: text })
              }
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.pickerButton}
              icon="calendar"
              textColor={theme.colors.onSurface}
            >
              Date: {formData.date}
            </Button>

            <View style={styles.timeRow}>
              <Button
                mode="outlined"
                onPress={() => setShowStartTimePicker(true)}
                style={styles.timeButton}
                icon="clock-start"
                textColor={theme.colors.onSurface}
              >
                Start: {formData.startTime}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowEndTimePicker(true)}
                style={styles.timeButton}
                icon="clock-end"
                textColor={theme.colors.onSurface}
              >
                End: {formData.endTime}
              </Button>
            </View>

            <TextInput
              label="Admin Notes"
              value={formData.adminNotes}
              onChangeText={(text: string) =>
                setFormData({ ...formData, adminNotes: text })
              }
              mode="outlined"
              placeholder="Internal notes..."
              style={styles.input}
            />
          </ScrollView>
        </Dialog.ScrollArea>

        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={loading}>
            Cancel
          </Button>
          <Button onPress={handleUpdate} mode="contained" loading={loading}>
            Save
          </Button>
        </Dialog.Actions>

        {/* Updated to match your DatePickerDialog implementation */}
        <DatePickerDialog
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)}
          onDateSelect={(dateString: string) => {
            setFormData({ ...formData, date: dateString });
            setShowDatePicker(false);
          }}
        />
        <TimePickerDialog
          visible={showStartTimePicker}
          // Changed from initialTime (not in props) to pickerType
          pickerType="start"
          onDismiss={() => setShowStartTimePicker(false)}
          // Changed from onConfirm to onTimeSelect
          onTimeSelect={(time: string) => {
            setFormData({ ...formData, startTime: time });
            setShowStartTimePicker(false);
          }}
        />

        <TimePickerDialog
          visible={showEndTimePicker}
          // Changed from initialTime to pickerType
          pickerType="end"
          onDismiss={() => setShowEndTimePicker(false)}
          // Changed from onConfirm to onTimeSelect
          onTimeSelect={(time: string) => {
            setFormData({ ...formData, endTime: time });
            setShowEndTimePicker(false);
          }}
        />
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: { maxHeight: "85%" },
  scrollContent: { paddingVertical: 10 },
  input: { marginBottom: 15 },
  pickerButton: { marginBottom: 15, justifyContent: "flex-start" },
  timeRow: { flexDirection: "row", gap: 10, marginBottom: 15 },
  timeButton: { flex: 1 },
});
