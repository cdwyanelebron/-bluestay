import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useApp, type Listing } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const SCREEN_W = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_W * 0.3;
const CARD_W = Math.min(SCREEN_W - 32, 380);
const CARD_H = CARD_W * 1.2;

interface Props {
  listings: Listing[];
}

export default function SwipeDeck({ listings }: Props) {
  const colors = useColors();
  const router = useRouter();
  const { toggleSaved, savedListings } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gone, setGone] = useState<number[]>([]);

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_W / 2, 0, SCREEN_W / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });
  const likeOpacity = position.x.interpolate({
    inputRange: [25, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-100, -25],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => position.setValue({ x: g.dx, y: g.dy }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (g.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 5,
          }).start();
        }
      },
    })
  ).current;

  const swipeRight = () => {
    const listing = visibleListings[0];
    if (!listing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!savedListings.includes(listing.id)) toggleSaved(listing.id);
    Animated.timing(position, {
      toValue: { x: SCREEN_W + 100, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setGone((prev) => [...prev, listing.id]);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeLeft = () => {
    const listing = visibleListings[0];
    if (!listing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(position, {
      toValue: { x: -SCREEN_W - 100, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setGone((prev) => [...prev, listing.id]);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const visibleListings = listings.filter((l) => !gone.includes(l.id));
  const top2 = visibleListings.slice(0, 2);

  if (visibleListings.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.muted, borderRadius: 24 }]}>
        <Feather name="refresh-cw" size={32} color={colors.mutedForeground} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>You've seen them all!</Text>
        <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
          Saved ones are in your profile.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.counter, { color: colors.mutedForeground }]}>
        {visibleListings.length} listings remaining
      </Text>

      <View style={styles.deck}>
        {/* Background card */}
        {top2[1] && (
          <View style={[styles.card, styles.backCard, { backgroundColor: colors.card, borderColor: colors.border, width: CARD_W, height: CARD_H }]}>
            <Image source={top2[1].image || require("@/assets/images/listing1.png")} style={styles.cardImage} />
          </View>
        )}

        {/* Front card */}
        {top2[0] && (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                width: CARD_W,
                height: CARD_H,
                transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
              },
            ]}
          >
            <Image source={top2[0].image || require("@/assets/images/listing1.png")} style={styles.cardImage} />

            <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
              <Text style={styles.likeLabelText}>SAVE</Text>
            </Animated.View>
            <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
              <Text style={styles.nopeLabelText}>SKIP</Text>
            </Animated.View>

            <View style={[styles.cardInfo, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={1}>
                {top2[0].title}
              </Text>
              <View style={styles.cardRow}>
                <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                <Text style={[styles.cardLocation, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {top2[0].location}
                </Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={[styles.cardPrice, { color: colors.primary }]}>
                  ₱{top2[0].price.toLocaleString()}/night
                </Text>
                <View style={styles.ratingRow}>
                  <Feather name="star" size={12} color="#FBBF24" />
                  <Text style={[styles.cardRating, { color: colors.foreground }]}>{top2[0].rating}</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable
          onPress={swipeLeft}
          style={({ pressed }) => [styles.actionBtn, styles.nopeBtn, { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.93 : 1 }] }]}
        >
          <Feather name="x" size={26} color="#EF4444" />
        </Pressable>

        <Pressable
          onPress={() => top2[0] && router.push(`/listing/${top2[0].id}`)}
          style={({ pressed }) => [styles.actionBtn, styles.infoBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.93 : 1 }] }]}
        >
          <Feather name="info" size={20} color="#FFF" />
        </Pressable>

        <Pressable
          onPress={swipeRight}
          style={({ pressed }) => [styles.actionBtn, styles.likeBtn, { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.93 : 1 }] }]}
        >
          <Feather name="heart" size={26} color="#22C55E" />
        </Pressable>
      </View>

      <Text style={[styles.hint, { color: colors.mutedForeground }]}>
        Swipe right to save · Swipe left to skip
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingBottom: 8 },
  counter: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 12 },
  deck: { alignItems: "center", justifyContent: "center", height: CARD_H + 16 },
  card: {
    position: "absolute",
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  backCard: { top: 10, transform: [{ scale: 0.96 }] },
  cardImage: { width: "100%", height: "65%", resizeMode: "cover" },
  likeLabel: {
    position: "absolute",
    top: 30,
    left: 20,
    borderWidth: 3,
    borderColor: "#22C55E",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    transform: [{ rotate: "-20deg" }],
  },
  likeLabelText: { color: "#22C55E", fontSize: 20, fontFamily: "Inter_700Bold" },
  nopeLabel: {
    position: "absolute",
    top: 30,
    right: 20,
    borderWidth: 3,
    borderColor: "#EF4444",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    transform: [{ rotate: "20deg" }],
  },
  nopeLabelText: { color: "#EF4444", fontSize: 20, fontFamily: "Inter_700Bold" },
  cardInfo: { padding: 14, gap: 4 },
  cardTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  cardRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 4 },
  cardLocation: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  cardPrice: { fontSize: 16, fontFamily: "Inter_700Bold" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  cardRating: { fontSize: 13, fontFamily: "Inter_500Medium" },
  actions: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 16 },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  nopeBtn: {},
  likeBtn: {},
  infoBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 0 },
  hint: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 12 },
  empty: { width: CARD_W, height: 220, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptySub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
});
