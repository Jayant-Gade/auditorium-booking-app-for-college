// components/layout/ScreenContainer.tsx

import React from "react";
import { ScrollView, StyleSheet, ScrollViewProps } from "react-native";
// Assuming theme is accessible
import { theme } from "@/lib/theme";

export const ScreenContainer: React.FC<ScrollViewProps> = ({
  children,
  style,
  contentContainerStyle,
  ...props
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: 0, // Ensure space at the bottom
  },
});
