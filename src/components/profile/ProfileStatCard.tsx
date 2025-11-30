// components/profile/ProfileStatCard.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust paths as needed
import { theme } from "@/lib/theme";

interface ProfileStatCardProps {
  label: string;
  value: number;
  iconName: string;
  color: string;
}

export const ProfileStatCard: React.FC<ProfileStatCardProps> = ({
  label,
  value,
  iconName,
  color,
}) => {
  return (
    <Surface style={[styles.statCard, { backgroundColor: color }]}>
      <Icon name={iconName} size={24} color={theme.colors.surface} />
      <Text variant="titleMedium" style={styles.statNumber}>
        {value}
      </Text>
      <Text variant="bodySmall" style={styles.statLabel}>
        {label}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    alignItems: "center",
    borderRadius: 12,
    elevation: 4,
  },
  statNumber: {
    color: theme.colors.surface,
    fontWeight: "bold",
    marginTop: 5,
  },
  statLabel: {
    color: theme.colors.surface,
    marginTop: 2,
    textAlign: "center",
  },
});
