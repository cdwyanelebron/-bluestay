import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const categories = [
  { name: "Beach", icon: "sun" as const },
  { name: "Staycation", icon: "home" as const },
  { name: "Apartment", icon: "grid" as const },
  { name: "Budget", icon: "tag" as const },
  { name: "Barkada", icon: "users" as const },
  { name: "Solo", icon: "user" as const },
];

interface Props {
  selected: string;
  onSelect: (cat: string) => void;
}

export default function CategoryScroll({ selected, onSelect }: Props) {
  const colors = useColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {categories.map((cat) => {
        const isActive = selected === cat.name;
        return (
          <Pressable
            key={cat.name}
            onPress={() => onSelect(isActive ? "" : cat.name)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Feather name={cat.icon} size={16} color={isActive ? "#FFF" : colors.mutedForeground} />
            <Text style={[styles.label, { color: isActive ? "#FFF" : colors.foreground }]}>{cat.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 8, paddingVertical: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  label: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
