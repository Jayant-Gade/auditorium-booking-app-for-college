// app/(tabs)/profile/index.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";

// Adjust paths as needed
import { theme } from "@/lib/theme";
import { useProfile } from "@/hooks/useProfile";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { QuickActionsCard } from "@/components/profile/QuickActionsCard";

export default function ProfileScreen() {
  const {
    currentUser,
    userStats,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    handleSave,
    handleCancelEdit,
    showLogoutDialog,
    setShowLogoutDialog,
    handleLogout,
    getRoleIcon,
    getRoleColor,
  } = useProfile();

  const roleIcon = getRoleIcon(currentUser?.role);
  const roleColor = getRoleColor(currentUser?.role);

  return (
    <ScreenContainer>
      {/* Profile Header */}
      <ProfileHeader
        user={currentUser}
        roleIcon={roleIcon}
        roleColor={roleColor}
      />

      {/* User Statistics */}
      <ProfileStats stats={userStats} />

      {/* Profile Information */}
      <ProfileInfoCard
        user={currentUser}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSave}
        onCancel={handleCancelEdit}
      />

      {/* Quick Actions */}
      <QuickActionsCard isAdmin={currentUser?.role === "admin"} />

      {/* Logout Section */}
      <Card style={styles.logoutCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => setShowLogoutDialog(true)}
            icon="logout"
            buttonColor={theme.colors.error}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        visible={showLogoutDialog}
        onDismiss={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from the application?"
        confirmLabel="Logout"
        confirmColor={theme.colors.error}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoutCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 30,
    elevation: 4,
  },
  logoutButton: {
    paddingVertical: 5,
  },
});
