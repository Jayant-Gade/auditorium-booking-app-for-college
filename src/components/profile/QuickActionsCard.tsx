// components/profile/QuickActionsCard.tsx

import React from "react";
import { StyleSheet, Alert } from "react-native";
import { Text, Card, List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { router } from "expo-router";

interface QuickActionsCardProps {
  isAdmin: boolean;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  isAdmin,
}) => {
  const navigation = useNavigation<any>();

  return (
    <Card style={styles.actionsCard}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.cardTitle}>
          Quick Actions
        </Text>

        <List.Item
          title="My Bookings"
          description="View and manage your bookings"
          left={(props) => <List.Icon {...props} icon="calendar-check" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push("/(tabs)/bookings")} // Assumes 'Bookings' screen
          style={styles.listItem}
        />
        <List.Item
          title="New Booking"
          description="Book the auditorium for an event"
          left={(props) => <List.Icon {...props} icon="calendar-plus" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => router.push("/(tabs)/home/book")} // Assumes 'Book' screen
          style={styles.listItem}
        />
        {isAdmin && (
          <List.Item
            title="Admin Panel"
            description="Manage all bookings and requests"
            left={(props) => <List.Icon {...props} icon="shield-crown" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push("/(tabs)/profile/admin")} // Assumes 'Admin' screen
            style={styles.listItem}
          />
        )}
        <List.Item
          title="About YCCE"
          description="Learn more about the college"
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() =>
            Alert.alert(
              "YCCE",
              "Yeshwantrao Chavan College of Engineering, Nagpur"
            )
          }
          style={styles.listItem}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  actionsCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  cardTitle: {
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 10,
  },
  listItem: {
    paddingVertical: 5,
  },
});
