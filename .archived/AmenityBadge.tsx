import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

const amenityIcons: Record<string, keyof typeof Feather.glyphMap> = {
  WiFi: "wifi",
  Aircon: "wind",
  Kitchen: "coffee",
  Parking: "truck",
};

export default function AmenityBadge({ name }: { name: string }) {
  const colors = useColors();
  const icon = amenityIcons[name] || "check-circle";

  return (
    <View style={[styles.badge, { backgroundColor: colors.muted, borderRadius: 12 }]}>
      <Feather name={icon} size={16} color={colors.primary} />
      <Text style={[styles.text, { color: colors.foreground }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  text: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
