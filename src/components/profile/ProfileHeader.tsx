// components/profile/ProfileHeader.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { User } from "@/lib/types";

interface ProfileHeaderProps {
  user: User | null;
  // Use keyof typeof Icon.getRawGlyphMap() for MaterialCommunityIcons
  roleColor: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  roleIcon,
  roleColor,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <Avatar.Text
          size={80}
          label={user?.name.substring(0, 2).toUpperCase() || "YC"}
          style={[styles.avatar, { backgroundColor: roleColor }]}
          labelStyle={styles.avatarLabel}
        />
        <View style={styles.profileInfo}>
          <Text variant="headlineSmall" style={styles.profileName}>
            {user?.name}
          </Text>
          <Text variant="bodyMedium" style={styles.profileEmail}>
            {user?.email}
          </Text>
          <View style={styles.roleContainer}>
            <Icon name={roleIcon} size={20} color={roleColor} />
            <Text
              variant="bodyMedium"
              style={[styles.profileRole, { color: roleColor }]}
            >
              {user?.role?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatar: {
    marginRight: 20,
  },
  avatarLabel: {
    color: theme.colors.surface,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: theme.colors.surface,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileEmail: {
    color: theme.colors.surface,
    opacity: 0.9,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileRole: {
    marginLeft: 5,
    fontWeight: "bold",
  },
});
