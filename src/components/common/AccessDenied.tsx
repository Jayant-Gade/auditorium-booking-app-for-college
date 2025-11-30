// components/common/AccessDenied.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Assuming theme is accessible
import { theme } from "@/lib/theme";

export const AccessDenied: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.accessDeniedCard}>
        <Card.Content style={styles.accessDeniedContent}>
          <Icon name="shield-alert" size={64} color={theme.colors.error} />
          <Text variant="headlineSmall" style={styles.accessDeniedTitle}>
            Access Denied
          </Text>
          <Text variant="bodyMedium" style={styles.accessDeniedText}>
            You don't have administrative privileges to access this panel.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  accessDeniedCard: {
    margin: 20,
    width: "90%",
  },
  accessDeniedContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  accessDeniedTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: theme.colors.error,
  },
  accessDeniedText: {
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
  },
});
