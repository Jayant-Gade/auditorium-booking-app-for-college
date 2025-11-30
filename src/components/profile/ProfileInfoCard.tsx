// components/profile/ProfileInfoCard.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Button, TextInput } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust paths as needed
import { theme } from "@/lib/theme";
import { User } from "@/lib/types";

interface ProfileInfoCardProps {
  user: User | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editData: { name: string; phone: string; department: string };
  setEditData: (data: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

// Small helper component for info rows
const InfoItem: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={20} color={theme.colors.primary} />
    <View style={styles.infoContent}>
      <Text variant="bodySmall" style={styles.infoLabel}>
        {label}
      </Text>
      <Text variant="bodyLarge" style={styles.infoValue}>
        {value}
      </Text>
    </View>
  </View>
);

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  user,
  isEditing,
  setIsEditing,
  editData,
  setEditData,
  onSave,
  onCancel,
}) => {
  return (
    <Card style={styles.infoCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Profile Information
          </Text>
          <Button
            mode={isEditing ? "contained" : "outlined"}
            onPress={isEditing ? onSave : () => setIsEditing(true)}
            icon={isEditing ? "check" : "pencil"}
            compact
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              label="Full Name"
              value={editData.name}
              onChangeText={(text) =>
                setEditData((prev: any) => ({ ...prev, name: text }))
              }
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
            <TextInput
              label="Phone Number"
              value={editData.phone}
              onChangeText={(text) =>
                setEditData((prev: any) => ({ ...prev, phone: text }))
              }
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone" />}
            />
            <TextInput
              label="Department"
              value={editData.department}
              onChangeText={(text) =>
                setEditData((prev: any) => ({ ...prev, department: text }))
              }
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="school" />}
            />
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        ) : (
          <View style={styles.infoList}>
            <InfoItem
              icon="account"
              label="Full Name"
              value={user?.name || ""}
            />
            <InfoItem icon="email" label="Email" value={user?.email || ""} />
            <InfoItem
              icon="phone"
              label="Phone Number"
              value={user?.phone || ""}
            />
            <InfoItem
              icon="school"
              label="Department"
              value={user?.department || ""}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  editForm: {
    gap: 15,
  },
  input: {
    // marginBottom: 10, // 'gap' handles this
  },
  cancelButton: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
  infoList: {
    gap: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.outline,
    marginBottom: 2,
  },
  infoValue: {
    color: theme.colors.onSurface,
  },
});
