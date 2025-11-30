// components/auth/AuthLayout.tsx

import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text, Avatar } from "react-native-paper";
// Adjust paths as needed
import { theme } from "@/lib/theme";

const AUTH_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <ImageBackground
      source={{ uri: AUTH_BACKGROUND_IMAGE }}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Avatar.Text
              size={80}
              label="YCCE"
              style={styles.logo}
              labelStyle={styles.logoText}
            />
            <Text variant="headlineMedium" style={styles.title}>
              YCCE Auditorium Booking
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Book auditorium for events and activities
            </Text>
          </View>

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    backgroundColor: theme.colors.primary,
    marginBottom: 10,
  },
  logoText: {
    color: theme.colors.surface,
    fontWeight: "bold",
  },
  title: {
    color: theme.colors.surface,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: theme.colors.surface,
    textAlign: "center",
    opacity: 0.9,
  },
});
