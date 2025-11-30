// app/index.tsx

import React from "react";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust path if needed

/**
 * This is the root entry point when the app is opened via its scheme
 * with no specific path (e.g., auditoriumbooker://).
 * It redirects based on authentication status.
 */
export default function RootIndex() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  // If the user is logged in, redirect to the main app (home tab).
  // If not logged in, redirect to the login screen.
  // This logic mirrors the redirection in app/_layout.tsx but uses <Redirect>.
  if (currentUser) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
