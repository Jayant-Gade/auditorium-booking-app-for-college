// components/home/WelcomeHeader.tsx

import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Text, Avatar, Chip } from "react-native-paper";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { User } from "@/lib/types";

interface WelcomeHeaderProps {
  user: User | null;
}

const HEADER_IMAGE =
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user }) => {
  const userInitials = user?.name.substring(0, 2).toUpperCase() || "...";

  return (
    <ImageBackground
      source={{ uri: HEADER_IMAGE }}
      style={styles.headerBackground}
      imageStyle={styles.headerImage}
    >
      <View style={styles.headerOverlay}>
        <View style={styles.welcomeSection}>
          <Avatar.Text size={60} label={userInitials} style={styles.avatar} />
          <View style={styles.welcomeText}>
            <Text variant="headlineSmall" style={styles.welcomeTitle}>
              Welcome back!
            </Text>
            <Text variant="titleMedium" style={styles.userName}>
              {user?.name}
            </Text>
            <Chip
              mode="outlined"
              style={styles.roleChip}
              textStyle={styles.roleChipText}
            >
              {user?.role?.toUpperCase()}
            </Chip>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    height: 150,
    width: "100%",
  },
  headerImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(21, 101, 192, 0.8)", // Example color, adjust as needed
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    justifyContent: "flex-end",
  },
  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: theme.colors.surface,
    marginRight: 15,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    color: theme.colors.surface,
    fontWeight: "bold",
  },
  userName: {
    color: theme.colors.surface,
    marginTop: 2,
  },
  roleChip: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: theme.colors.surface,
  },
  roleChipText: {
    color: theme.colors.surface,
    fontSize: 12,
  },
});
