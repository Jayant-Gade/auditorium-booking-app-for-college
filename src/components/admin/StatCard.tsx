// components/admin/StatCard.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Assuming theme is accessible
import { theme } from "@/lib/theme";

interface StatCardProps {
  label: string;
  value: number | string;
  iconName: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  iconName,
  color,
}) => {
  return (
    <Surface style={[styles.statCard, { backgroundColor: color }]}>
      <Icon name={iconName} size={30} color={theme.colors.surface} />
      <Text variant="headlineSmall" style={styles.statNumber}>
        {value}
      </Text>
      <Text variant="bodyMedium" style={styles.statLabel}>
        {label}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 20,
    alignItems: "center",
    borderRadius: 12,
    elevation: 4,
  },
  statNumber: {
    color: theme.colors.surface,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    color: theme.colors.surface,
    marginTop: 4,
    textAlign: "center",
  },
});
