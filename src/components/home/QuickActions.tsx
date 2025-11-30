// components/home/QuickActions.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { User } from "@/lib/types";
import { router } from "expo-router";

interface QuickActionsProps {
  user: User | null;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ user }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.actionsContainer}>
      <Button
        mode="contained"
        style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("/(tabs)/home/book")} // Assumes 'Book' screen exists
        icon="calendar-plus"
      >
        Book Auditorium
      </Button>
      <Button
        mode="outlined"
        style={styles.actionButton}
        onPress={() => router.push("/(tabs)/bookings")} // Assumes 'Bookings' screen exists
        icon="calendar-check"
      >
        View My Bookings
      </Button>
      {user?.role === "admin" && (
        <Button
          mode="contained-tonal"
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
          onPress={() => router.push("/(tabs)/profile/admin")} // Assumes 'Admin' screen exists
          icon="shield-crown"
        >
          Admin Panel
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    gap: 10,
  },
  actionButton: {
    paddingVertical: 5,
  },
});
