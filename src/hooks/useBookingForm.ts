// hooks/useBookingForm.ts

import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addBooking } from '@/store/bookingSlice';
import { RootState, NewBookingData } from '@/lib/types';

// Form state (equipmentNeeded removed)
export interface BookingFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  expectedAttendees: string;
}

const INITIAL_FORM_DATA: BookingFormData = {
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  expectedAttendees: '',
};

export const useBookingForm = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state: RootState) => state.user);

  const [formData, setFormData] =
    useState<BookingFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);

  // --- NEW Equipment State ---
  const [needsAudio, setNeedsAudio] = useState(false);
  const [needsVideo, setNeedsVideo] = useState(false);
  const [needsAC, setNeedsAC] = useState(false);
  // --- END NEW Equipment State ---

  // Dialog visibility state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState<'start' | 'end'>('start');
  // showEquipmentDialog is no longer needed

  // --- Form Handlers ---

  const handleValueChange = (
    field: keyof BookingFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: string) => {
    setFormData((prev) => ({ ...prev, date }));
    setShowDatePicker(false);
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      [timePickerType === 'start' ? 'startTime' : 'endTime']: time,
    }));
    setShowTimePicker(false);
  };

  // toggleEquipment and setShowEquipmentDialog are no longer needed

  // --- Submission ---

  const handleSubmit = async () => {
    const { title, date, startTime, endTime, expectedAttendees } = formData;

    if (!title || !date || !startTime || !endTime || !expectedAttendees) {
      Alert.alert('Error', 'Please fill all required fields (*)');
      return;
    }

    if (
      parseInt(startTime.replace(':', '')) >=
      parseInt(endTime.replace(':', ''))
    ) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    setLoading(true);

    // --- NEW: Build equipmentNeeded array ---
    const equipmentNeeded: string[] = [];
    if (needsAudio) equipmentNeeded.push('Audio System');
    if (needsVideo) equipmentNeeded.push('Video/Projector');
    if (needsAC) equipmentNeeded.push('Air Conditioning');
    // --- END NEW ---

    // Prepare data for the API
    const newBookingData: NewBookingData = {
      ...formData,
      expectedAttendees: parseInt(expectedAttendees) || 0,
      equipmentNeeded: equipmentNeeded, // Pass the built array
    };

    try {
      await dispatch(addBooking(newBookingData)).unwrap();

      setFormData(INITIAL_FORM_DATA); // Reset form
      // Reset equipment
      setNeedsAudio(false);
      setNeedsVideo(false);
      setNeedsAC(false);

      Alert.alert(
        'Success',
        'Your booking request has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/bookings'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Submission Failed',
        error.message || 'Could not create booking. Please check for time conflicts.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    formData,
    loading,

    // Form handlers
    handleValueChange,
    handleSubmit,

    // Equipment state
    needsAudio,
    setNeedsAudio,
    needsVideo,
    setNeedsVideo,
    needsAC,
    setNeedsAC,

    // Dialog state and handlers
    showDatePicker,
    setShowDatePicker,
    handleDateSelect,

    showTimePicker,
    setShowTimePicker,
    timePickerType,
    setTimePickerType,
    handleTimeSelect,
  };
};