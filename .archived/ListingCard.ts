import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Listing } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";

interface Props {
  listing: Listing;
  compact?: boolean;
}

export default function ListingCard({ listing, compact }: Props) {
  const colors = useColors();
  const router = useRouter();
  const { savedListings, toggleSaved } = useApp();
  const isSaved = savedListings.includes(listing.id);

  return (
    <Pressable
      onPress={() => router.push(`/listing/${listing.id}`)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: 16,
          width: compact ? 220 : ("100%" as any),
          opacity: pressed ? 0.93 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={listing.image || require("@/assets/images/listing1.png")}
          style={[styles.image, { borderTopLeftRadius: 16, borderTopRightRadius: 16 }]}
        />
        {listing.isOwnerListing && (
          <View style={[styles.ownerBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.ownerBadgeText}>Your Listing</Text>
          </View>
        )}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleSaved(listing.id);
          }}
          hitSlop={8}
          style={({ pressed }) => [styles.heartBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name={isSaved ? "heart" : "heart"} size={18} color={isSaved ? "#EF4444" : "#FFFFFF"} />
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {listing.title}
        </Text>
        <View style={styles.row}>
          <Feather name="map-pin" size={11} color={colors.mutedForeground} />
          <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>
            {listing.location}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ₱{listing.price.toLocaleString()}
            <Text style={[styles.perNight, { color: colors.mutedForeground }]}>/night</Text>
          </Text>
          <View style={styles.ratingRow}>
            <Feather name="star" size={11} color="#FBBF24" />
            <Text style={[styles.rating, { color: colors.foreground }]}>{listing.rating}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  imageContainer: { position: "relative" },
  image: { width: "100%", height: 160, resizeMode: "cover" },
  ownerBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ownerBadgeText: { color: "#FFF", fontSize: 10, fontFamily: "Inter_700Bold" },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 7,
  },
  info: { padding: 12, gap: 4 },
  title: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  location: { fontSize: 12, fontFamily: "Inter_400Regular" },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  price: { fontSize: 16, fontFamily: "Inter_700Bold" },
  perNight: { fontSize: 12, fontWeight: "normal" as const },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  rating: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
