// components/common/EmptyCard.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust paths as needed
import { theme } from "@/lib/theme";

interface EmptyCardProps {
  message: string;
  iconName: string;
}

export const EmptyCard: React.FC<EmptyCardProps> = ({ message, iconName }) => {
  return (
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.emptyContent}>
        <Icon name={iconName} size={48} color={theme.colors.outline} />
        <Text variant="bodyLarge" style={styles.emptyText}>
          {message}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    marginTop: 10,
    color: theme.colors.outline,
  },
});
