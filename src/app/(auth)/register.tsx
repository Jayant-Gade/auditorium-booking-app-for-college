// app/(auth)/register.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

// Adjust paths as needed
import { theme } from "@/lib/theme";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RoleSelectionDialog } from "@/components/auth/RoleSelectionDialog";
import { router } from "expo-router";

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    phone,
    setPhone,
    department,
    setDepartment,
    role,
    setRole,
    loading,
    showRoleDialog,
    setShowRoleDialog,
    handleRegister,
    confirmRegistration,
  } = useAuth();

  return (
    <AuthLayout>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Create Account
          </Text>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
          />
          <TextInput
            label="Department"
            value={department}
            onChangeText={setDepartment}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="school" />}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => router.push("/(auth)/login")}
            style={styles.switchButton}
          >
            Already have an account? Login
          </Button>
        </Card.Content>
      </Card>

      <RoleSelectionDialog
        visible={showRoleDialog}
        onDismiss={() => setShowRoleDialog(false)}
        onConfirm={confirmRegistration}
        role={role}
        setRole={setRole}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
  },
  cardTitle: {
    textAlign: "center",
    marginBottom: 20,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  switchButton: {
    marginTop: 15,
  },
});
