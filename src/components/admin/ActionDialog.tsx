import React from "react";
import { StyleSheet } from "react-native";
import { Portal, Dialog, Button, Text, TextInput } from "react-native-paper";
import { theme } from "@/lib/theme";

interface ActionDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: () => void;
  actionType: "approve" | "reject" | "unapprove"; // Updated
  adminNotes: string;
  onNotesChange: (text: string) => void;
}

export const ActionDialog: React.FC<ActionDialogProps> = ({
  visible,
  onDismiss,
  onSubmit,
  actionType,
  adminNotes,
  onNotesChange,
}) => {
  // Config for different action types
  const getActionConfig = () => {
    switch (actionType) {
      case "approve":
        return {
          title: "Approve",
          color: "#4CAF50",
          text: "Are you sure you want to approve this booking?",
        };
      case "reject":
        return {
          title: "Reject",
          color: "#F44336",
          text: "Are you sure you want to reject this booking?",
        };
      case "unapprove":
        return {
          title: "Unapprove",
          color: theme.colors.primary,
          text: "Are you sure you want to revert this booking to pending status?",
        };
    }
  };

  const config = getActionConfig();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{config.title} Booking</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={styles.confirmationText}>
            {config.text}
          </Text>
          <TextInput
            label="Admin Notes (Optional)"
            value={adminNotes}
            onChangeText={onNotesChange}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Add any additional notes or comments..."
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            onPress={onSubmit}
            mode="contained"
            buttonColor={config.color}
          >
            {config.title}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  confirmationText: {
    marginBottom: 15,
  },
});
