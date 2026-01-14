// hooks/useBookingForm.ts

import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addBooking } from '@/store/bookingSlice';
import { RootState, NewBookingData } from '@/lib/types';

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

  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);

  // --- Equipment State ---
  const [needsAudio, setNeedsAudio] = useState(false);
  const [needsVideo, setNeedsVideo] = useState(false);
  const [needsAC, setNeedsAC] = useState(false);
  // Changed from boolean to string to store the actual text
  const [otherNeeds, setOtherNeeds] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState<'start' | 'end'>('start');

  const handleValueChange = (field: keyof BookingFormData, value: string) => {
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

  const handleSubmit = async () => {
    const { title, date, startTime, endTime, expectedAttendees } = formData;

    if (!title || !date || !startTime || !endTime || !expectedAttendees) {
      Alert.alert('Error', 'Please fill all required fields (*)');
      return;
    }

    // Basic time validation
    if (startTime === endTime) {
      Alert.alert('Error', 'Start and End time cannot be the same');
      return;
    }

    setLoading(true);

    // --- Build equipmentNeeded array ---
    const equipmentNeeded: string[] = [];
    if (needsAudio) equipmentNeeded.push('Audio System');
    if (needsVideo) equipmentNeeded.push('Video/Projector');
    if (needsAC) equipmentNeeded.push('Air Conditioning');

    // Add custom text if it's not empty
    if (otherNeeds.trim().length > 0) {
      equipmentNeeded.push(otherNeeds.trim());
    }

    const newBookingData: NewBookingData = {
      ...formData,
      expectedAttendees: parseInt(expectedAttendees) || 0,
      equipmentNeeded: equipmentNeeded,
    };

    try {
      await dispatch(addBooking(newBookingData)).unwrap();

      // Reset everything
      setFormData(INITIAL_FORM_DATA);
      setNeedsAudio(false);
      setNeedsVideo(false);
      setNeedsAC(false);
      setOtherNeeds("");

      Alert.alert(
        'Success',
        'Your booking request has been submitted successfully!',
        [{ text: 'OK', onPress: () => router.push('/(tabs)/bookings') }]
      );
    } catch (error: any) {
      Alert.alert('Submission Failed', error.message || 'Error creating booking.');
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    formData,
    loading,
    handleValueChange,
    handleSubmit,
    // Equipment exports
    needsAudio,
    setNeedsAudio,
    needsVideo,
    setNeedsVideo,
    needsAC,
    setNeedsAC,
    otherNeeds,
    setOtherNeeds,
    // Picker exports
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