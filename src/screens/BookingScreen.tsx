import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  Portal,
  Dialog,
  Checkbox,
  Surface,
  SegmentedButtons,
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addBooking } from '../store/bookingSlice';
import { theme } from '../theme/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface BookingScreenProps {
  navigation: any;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { bookings } = useSelector((state: RootState) => state.bookings);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    expectedAttendees: '',
    equipmentNeeded: [] as string[],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState<'start' | 'end'>('start');
  const [showEquipmentDialog, setShowEquipmentDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const equipmentOptions = [
    'Microphone System',
    'Projector',
    'Sound System',
    'Stage Lighting',
    'Podium',
    'Chairs (Additional)',
    'Tables',
    'Air Conditioning',
    'Recording Equipment',
    'Photography Equipment',
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const checkTimeConflict = (date: string, startTime: string, endTime: string) => {
    return bookings.some(booking => {
      if (booking.date === date && booking.status === 'approved') {
        const bookingStart = parseInt(booking.startTime.replace(':', ''));
        const bookingEnd = parseInt(booking.endTime.replace(':', ''));
        const newStart = parseInt(startTime.replace(':', ''));
        const newEnd = parseInt(endTime.replace(':', ''));
        
        return (newStart < bookingEnd && newEnd > bookingStart);
      }
      return false;
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.expectedAttendees) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (parseInt(formData.startTime.replace(':', '')) >= parseInt(formData.endTime.replace(':', ''))) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    const hasConflict = checkTimeConflict(formData.date, formData.startTime, formData.endTime);
    if (hasConflict) {
      Alert.alert(
        'Time Conflict',
        'There is already a booking during this time slot. Please choose a different time or date.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);

    const newBooking = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      organizerName: currentUser?.name || '',
      organizerEmail: currentUser?.email || '',
      organizerPhone: currentUser?.phone || '',
      department: currentUser?.department || '',
      expectedAttendees: parseInt(formData.expectedAttendees),
      equipmentNeeded: formData.equipmentNeeded,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      dispatch(addBooking(newBooking));
      setLoading(false);
      Alert.alert(
        'Success',
        'Your booking request has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Bookings'),
          },
        ]
      );
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        expectedAttendees: '',
        equipmentNeeded: [],
      });
    }, 1500);
  };

  const toggleEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipmentNeeded: prev.equipmentNeeded.includes(equipment)
        ? prev.equipmentNeeded.filter(e => e !== equipment)
        : [...prev.equipmentNeeded, equipment]
    }));
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <ScrollView style={styles.container}>
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
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="calendar-text" />}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="text" />}
            />

            <TextInput
              label="Expected Attendees *"
              value={formData.expectedAttendees}
              onChangeText={(text) => setFormData(prev => ({ ...prev, expectedAttendees: text }))}
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
              {formData.date || 'Select Date *'}
            </Button>

            <View style={styles.timeRow}>
              <Button
                mode="outlined"
                onPress={() => {
                  setTimePickerType('start');
                  setShowTimePicker(true);
                }}
                style={[styles.timeButton, { marginRight: 10 }]}
                icon="clock"
              >
                {formData.startTime || 'Start Time *'}
              </Button>

              <Button
                mode="outlined"
                onPress={() => {
                  setTimePickerType('end');
                  setShowTimePicker(true);
                }}
                style={styles.timeButton}
                icon="clock"
              >
                {formData.endTime || 'End Time *'}
              </Button>
            </View>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <View style={styles.equipmentHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Equipment Needed
              </Text>
              <Button
                mode="text"
                onPress={() => setShowEquipmentDialog(true)}
                icon="plus"
              >
                Add Equipment
              </Button>
            </View>

            <View style={styles.equipmentChips}>
              {formData.equipmentNeeded.map((equipment) => (
                <Chip
                  key={equipment}
                  style={styles.equipmentChip}
                  onClose={() => toggleEquipment(equipment)}
                >
                  {equipment}
                </Chip>
              ))}
              {formData.equipmentNeeded.length === 0 && (
                <Text variant="bodyMedium" style={styles.noEquipmentText}>
                  No equipment selected
                </Text>
              )}
            </View>
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

      {/* Date Picker Dialog */}
      <Portal>
        <Dialog visible={showDatePicker} onDismiss={() => setShowDatePicker(false)}>
          <Dialog.Title>Select Date</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            {generateDateOptions().map((date) => (
              <Button
                key={date}
                mode="text"
                onPress={() => {
                  setFormData(prev => ({ ...prev, date }));
                  setShowDatePicker(false);
                }}
                style={styles.dateOption}
              >
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Button>
            ))}
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowDatePicker(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Time Picker Dialog */}
      <Portal>
        <Dialog visible={showTimePicker} onDismiss={() => setShowTimePicker(false)}>
          <Dialog.Title>
            Select {timePickerType === 'start' ? 'Start' : 'End'} Time
          </Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <View style={styles.timeGrid}>
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  mode="outlined"
                  onPress={() => {
                    setFormData(prev => ({
                      ...prev,
                      [timePickerType === 'start' ? 'startTime' : 'endTime']: time
                    }));
                    setShowTimePicker(false);
                  }}
                  style={styles.timeSlot}
                >
                  {time}
                </Button>
              ))}
            </View>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowTimePicker(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Equipment Dialog */}
      <Portal>
        <Dialog visible={showEquipmentDialog} onDismiss={() => setShowEquipmentDialog(false)}>
          <Dialog.Title>Select Equipment</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            {equipmentOptions.map((equipment) => (
              <View key={equipment} style={styles.equipmentOption}>
                <Checkbox
                  status={formData.equipmentNeeded.includes(equipment) ? 'checked' : 'unchecked'}
                  onPress={() => toggleEquipment(equipment)}
                />
                <Text variant="bodyMedium" style={styles.equipmentLabel}>
                  {equipment}
                </Text>
              </View>
            ))}
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowEquipmentDialog(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: theme.colors.surface,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  dateButton: {
    marginBottom: 15,
    justifyContent: 'flex-start',
  },
  timeRow: {
    flexDirection: 'row',
  },
  timeButton: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  equipmentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    marginBottom: 5,
  },
  noEquipmentText: {
    color: theme.colors.outline,
    fontStyle: 'italic',
  },
  organizerInfo: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceVariant,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  organizerText: {
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 5,
  },
  dialogScrollArea: {
    maxHeight: 300,
  },
  dateOption: {
    justifyContent: 'flex-start',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: '45%',
  },
  equipmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  equipmentLabel: {
    marginLeft: 10,
  },
});

export default BookingScreen;