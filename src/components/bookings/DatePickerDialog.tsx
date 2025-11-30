// components/bookings/DatePickerDialog.tsx

import React from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface DatePickerDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onDateSelect: (date: string) => void;
}

export const DatePickerDialog: React.FC<DatePickerDialogProps> = ({
  visible,
  onDismiss,
  onDateSelect,
}) => {
  if (!visible) {
    return null;
  }

  // This function handles the response from the native picker
  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    // 1. Always call onDismiss to close the modal
    onDismiss();

    // 2. Check if a date was actually "set" (user pressed "OK" or "Done")
    if (event.type === "set" && selectedDate) {
      // 3. Format the date to "YYYY-MM-DD" to match your old format
      const dateString = selectedDate.toISOString().split("T")[0];
      onDateSelect(dateString);
    }
    // If event.type is 'dismissed', we just close (which onDismiss already did)
  };

  return (
    <DateTimePicker
      value={new Date()} // Defaults to today's date
      mode="date"
      display="calendar" // Use "calendar" on Android, "inline" on iOS
      onChange={onChange}
      minimumDate={new Date()} // Disables all dates before today
    />
  );
};
