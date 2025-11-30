// components/common/EmptyState.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust path as needed
import { theme } from "@/lib/theme";

interface EmptyStateProps {
  title: string;
  message: string;
  iconName?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  iconName = "calendar-remove",
  action,
}) => {
  return (
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.emptyContent}>
        <Icon name={iconName} size={64} color={theme.colors.outline} />
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          {title}
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          {message}
        </Text>
        {action && <View style={styles.actionContainer}>{action}</View>}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  emptyCard: {
    margin: 20,
    marginTop: 50,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: theme.colors.outline,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.outline,
    marginBottom: 20,
  },
  actionContainer: {
    marginTop: 10,
  },
});
