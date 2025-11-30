// app/(tabs)/calendar/index.tsx

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  Text,
  Card,
  Chip,
  Surface,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCalendarBookings } from "@/store/bookingSlice";
import { RootState, Booking } from "@/lib/types";
import { theme } from "@/lib/theme";
import { router } from "expo-router";

export default function CalendarScreen() {
  const dispatch = useAppDispatch();
  const { calendarBookings = [], loading } = useAppSelector(
    (state: RootState) => state.bookings
  );
  // Cast to any if Typescript complains about the new state property until types.ts is updated

  // --- Local State ---
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the currently viewed month
  const [selectedDate, setSelectedDate] = useState(new Date()); // Tracks the specifically selected day

  // --- Effects ---

  // Fetch data whenever the month changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const monthStr = `${year}-${month}`;

    dispatch(fetchCalendarBookings(monthStr));
  }, [currentDate, dispatch]);

  const onRefresh = () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    dispatch(fetchCalendarBookings(`${year}-${month}`));
  };

  // --- Helpers ---

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Get bookings for the *selected* specific day
  const selectedDayBookings = useMemo(() => {
    return calendarBookings.filter((b: Booking) => {
      // Backend dates are ISO strings. Create Date object and compare.
      // Adjust this based on whether your backend stores UTC or local.
      // Usually ISO string "2023-11-20T00:00:00.000Z" matches UTC date.
      const bookingDate = new Date(b.date);
      return isSameDay(bookingDate, selectedDate);
    });
  }, [calendarBookings, selectedDate]);

  // --- Calendar Grid Generation ---

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Day of week (0 = Sunday, 1 = Monday, etc.)
    const startDayOfWeek = firstDayOfMonth.getDay();

    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.container}>
      {/* --- Calendar Header (Month Navigation) --- */}
      <Surface style={styles.calendarHeader}>
        <IconButton icon="chevron-left" onPress={() => changeMonth(-1)} />
        <Text variant="titleMedium" style={styles.monthTitle}>
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <IconButton icon="chevron-right" onPress={() => changeMonth(1)} />
      </Surface>

      {/* --- Calendar Grid --- */}
      <View style={styles.calendarContainer}>
        {/* Weekday Labels */}
        <View style={styles.weekRow}>
          {weekDays.map((day) => (
            <Text key={day} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {calendarDays.map((date, index) => {
            if (!date) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());

            // Check if this day has any bookings (for the dot indicator)
            const hasBookings = calendarBookings.some((b: Booking) =>
              isSameDay(new Date(b.date), date)
            );

            return (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.dayCell,
                  isSelected && styles.selectedDayCell,
                  isToday && !isSelected && styles.todayCell,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    isToday && !isSelected && styles.todayText,
                  ]}
                >
                  {date.getDate()}
                </Text>
                {hasBookings && (
                  <View
                    style={[
                      styles.dot,
                      isSelected
                        ? { backgroundColor: "white" }
                        : { backgroundColor: theme.colors.primary },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* --- Selected Day Agenda --- */}
      <View style={styles.agendaHeader}>
        <Text variant="titleMedium">
          Bookings for{" "}
          {selectedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>

      <ScrollView
        style={styles.agendaList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {selectedDayBookings.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.outline }}
              >
                No bookings for this date.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          selectedDayBookings.map((booking: Booking) => (
            <Card
              key={booking._id}
              style={styles.bookingCard}
              // 2. Added onPress navigation
              onPress={() =>
                router.push({
                  pathname: "/booking-details",
                  params: { booking: JSON.stringify(booking) },
                })
              }
            >
              <Card.Content>
                <View style={styles.bookingRow}>
                  <View style={styles.timeContainer}>
                    <Text variant="bodyMedium" style={{ fontWeight: "bold" }}>
                      {booking.startTime}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.outline }}
                    >
                      {booking.endTime}
                    </Text>
                  </View>
                  <View style={styles.bookingInfo}>
                    <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
                      {booking.title}
                    </Text>
                    <Text variant="bodySmall">{booking.department}</Text>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.outline }}
                    >
                      By: {booking.organizerName}
                    </Text>
                  </View>
                  <Chip
                    textStyle={{ fontSize: 10, marginVertical: 0 }}
                    style={{
                      height: 24,
                      backgroundColor:
                        booking.status === "approved" ? "#E8F5E8" : "#FFF3E0",
                    }}
                  >
                    {booking.status}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  monthTitle: {
    fontWeight: "bold",
  },
  calendarContainer: {
    backgroundColor: theme.colors.surface,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    marginBottom: 15,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  weekDayText: {
    color: theme.colors.outline,
    width: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  dayCell: {
    width: "14.28%", // 100% / 7 days
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    borderRadius: 22.5,
  },
  selectedDayCell: {
    backgroundColor: theme.colors.primary,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  dayText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },
  todayText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  agendaHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  agendaList: {
    paddingHorizontal: 20,
  },
  emptyCard: {
    backgroundColor: "transparent",
    elevation: 0,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderStyle: "dashed",
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  bookingCard: {
    marginBottom: 10,
    backgroundColor: theme.colors.surface,
  },
  bookingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeContainer: {
    width: 50,
    borderRightWidth: 1,
    borderRightColor: theme.colors.outlineVariant,
    marginRight: 10,
    paddingRight: 5,
    alignItems: "flex-end",
  },
  bookingInfo: {
    flex: 1,
  },
});
