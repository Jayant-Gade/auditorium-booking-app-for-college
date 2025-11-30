// app/(tabs)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import { theme } from "@/lib/theme";
// 1. Make sure this import is correct and Icon component works
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.surface,
        tabBarInactiveTintColor: theme.colors.onPrimary, // Adjusted for contrast
        headerStyle: {
          backgroundColor: theme.colors.primary,
          // --- Remove or adjust any paddingTop/height here if present ---
          // e.g., ensure height isn't too large
          height: 0, // Default is usually fine
          elevation: 0, // Remove shadow if needed on Android
          shadowOpacity: 0, // Remove shadow if needed on iOS
        },
        headerTintColor: theme.colors.surface,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
          // --- Keep these resets ---
          marginTop: 0,
          paddingTop: 0,
          // --- Remove any potentially problematic vertical spacing ---
          paddingVertical: 0, // Remove if present
          lineHeight: undefined, // Remove if present and causing issues
        },
        // Ensure labels are shown (default is true, but good to be explicit)
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home", // Tab label
          headerTitle: "YCCE Auditorium", // Header text

          // Adjust header title styles here
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
            marginTop: 0,
            paddingTop: 0,
          },

          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        // 4. Name matches the FILE name: /app/(tabs)/book.tsx (assuming it's a file, not folder)
        // If it's a folder, it should be just "book" and contain an index.tsx
        name="home/book" // Check if this should be 'book/index' if it's a folder
        options={{
          // 5. Explicit title
          title: "Book",
          headerTitle: "Book Auditorium",
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-plus" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        // 6. Name matches the FILE name: /app/(tabs)/bookings.tsx (assuming)
        // If it's a folder, it should be just "bookings" and contain an index.tsx
        name="bookings/index" // Check if this should be 'bookings/index' if it's a folder
        options={{
          // 7. Explicit title
          title: "Bookings",
          headerTitle: "My Bookings",
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-check" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calender/index"
        options={{
          title: "Calender",
          headerTitle: "Calender View",
          tabBarIcon: ({ color, size }) => (
            <Icon name="shield-crown" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        // Name matches the FILE path: app/(tabs)/profile/admin.tsx
        name="profile/admin"
        options={{
          title: "Admin", // Label for the tab
          headerTitle: "Admin Panel", // Title for the header bar
          tabBarIcon: ({ color, size }) => (
            <Icon name="shield-crown" size={size} color={color} />
          ),
        }}
      />
      {/* Ensure you DON'T have a Tabs.Screen defined here for 'admin' 
        if it's meant to be a screen *within* the profile stack, 
        unless you specifically want an Admin tab.
      */}
      <Tabs.Screen
        name="profile/index" // Assuming file is app/(tabs)/user.tsx
        options={{
          title: "User Profile",
          headerTitle: "User Specifics",
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-details" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
