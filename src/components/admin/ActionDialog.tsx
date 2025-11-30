// components/admin/ActionDialog.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Portal, Dialog, Button, Text, TextInput } from "react-native-paper";

interface ActionDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: () => void;
  actionType: "approve" | "reject";
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
  const title = actionType === "approve" ? "Approve" : "Reject";
  const submitColor = actionType === "approve" ? "#4CAF50" : "#F44336";
  const confirmationText =
    actionType === "approve"
      ? "Are you sure you want to approve this booking?"
      : "Are you sure you want to reject this booking?";

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title} Booking</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={styles.confirmationText}>
            {confirmationText}
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
          <Button onPress={onSubmit} mode="contained" buttonColor={submitColor}>
            {title}
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
