import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  onPress?: () => void;
}

export default function SearchBar({ onPress }: Props) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Feather name="search" size={18} color={colors.mutedForeground} />
      <Text style={[styles.placeholder, { color: colors.mutedForeground }]}>Saan ka pupunta?</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholder: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
