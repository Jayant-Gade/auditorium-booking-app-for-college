// components/bookings/TimePickerDialog.tsx

import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface TimePickerDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onTimeSelect: (time: string) => void;
  pickerType: "start" | "end";
}

export const TimePickerDialog: React.FC<TimePickerDialogProps> = ({
  visible,
  onDismiss,
  onTimeSelect,
  pickerType, // We can use this to set a default!
}) => {
  // Set a default time (e.g., 9:00 AM for 'start', 10:00 AM for 'end')
  const [defaultTime] = useState(() => {
    const d = new Date();
    const defaultHour = pickerType === "start" ? 9 : 10;
    d.setHours(defaultHour, 0, 0, 0);
    return d;
  });

  if (!visible) {
    return null;
  }

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    // 1. Always call onDismiss to close the modal
    onDismiss();

    // 2. Check if a time was "set" (user pressed "OK" or "Done")
    if (event.type === "set" && selectedDate) {
      // 3. Format the time to "HH:MM"
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      onTimeSelect(timeString);
    }
  };

  return (
    <DateTimePicker
      value={defaultTime} // Default to 9:00 or 10:00 AM
      mode="time"
      display="clock" // Use "clock" on Android, "spinner" on iOS
      onChange={onChange}
      is24Hour={true} // Your old times were 24-hour
      // You can set a minute interval if you want
      // minuteInterval={30}
    />
  );
};
