// components/layout/ViewContainer.tsx

import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
// Adjust path as needed
import { theme } from "@/lib/theme";

export const ViewContainer: React.FC<ViewProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
