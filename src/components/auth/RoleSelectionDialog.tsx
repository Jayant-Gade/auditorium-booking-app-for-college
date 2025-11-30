// components/auth/RoleSelectionDialog.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Portal, Dialog, RadioButton, Text, Button } from "react-native-paper";
// Adjust paths as needed
import { UserRole } from "@/hooks/useAuth"; // Import the type from the hook

interface RoleSelectionDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const RoleSelectionDialog: React.FC<RoleSelectionDialogProps> = ({
  visible,
  onDismiss,
  onConfirm,
  role,
  setRole,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Select Your Role</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            onValueChange={(value) => setRole(value as UserRole)}
            value={role}
          >
            <View style={styles.radioItem}>
              <RadioButton value="student" />
              <Text variant="bodyMedium">Student</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="faculty" />
              <Text variant="bodyMedium">Faculty</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="admin" />
              <Text variant="bodyMedium">Admin</Text>
            </View>
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={onConfirm}>Confirm</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
});
