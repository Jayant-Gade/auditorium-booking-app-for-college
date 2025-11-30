// app/(auth)/login.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

// Adjust paths as needed
import { theme } from "@/lib/theme"; //@/lib/theme
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { router } from "expo-router";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { email, setEmail, password, setPassword, loading, handleLogin } =
    useAuth();

  return (
    <AuthLayout>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Welcome Back
          </Text>

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

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>

          <Button
            mode="text"
            onPress={() => router.push("/(auth)/register")}
            style={styles.switchButton}
          >
            Don't have an account? Register
          </Button>
        </Card.Content>
      </Card>
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
