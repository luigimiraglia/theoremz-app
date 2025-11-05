import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = [
  { name: "home", icon: "home", label: "Home" },
  { name: "chat", icon: "chatbubbles", label: "Chat" },
  { name: "account", icon: "person", label: "Account" },
];

interface SwipeableTabContainerProps {
  children: React.ReactNode[];
}

export function SwipeableTabContainer({
  children,
}: SwipeableTabContainerProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndexRef = useRef(0);

  // Mantieni sincronizzato il ref con lo stato
  currentIndexRef.current = currentIndex;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Solo se swipe chiaramente orizzontale
        const isDx = Math.abs(gestureState.dx) > 30;
        const isHorizontal =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 3;
        return isDx && isHorizontal;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderGrant: () => {
        scrollX.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue =
          -currentIndexRef.current * SCREEN_WIDTH + gestureState.dx;
        const minScroll = -(TABS.length - 1) * SCREEN_WIDTH;
        const maxScroll = 0;
        const clampedValue = Math.max(minScroll, Math.min(maxScroll, newValue));
        scrollX.setValue(clampedValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentIdx = currentIndexRef.current;
        let newIndex = currentIdx;

        // Calcola la velocità e la distanza
        const velocity = gestureState.vx; // velocità con segno
        const distance = gestureState.dx; // distanza con segno

        // Logica migliorata:
        // - Swipe veloce (|velocity| > 0.3): cambia pagina con almeno 30px di movimento
        // - Swipe lento: serve almeno il 25% della larghezza dello schermo
        const isFastSwipe = Math.abs(velocity) > 0.3 && Math.abs(distance) > 30;
        const isLongSwipe = Math.abs(distance) > SCREEN_WIDTH * 0.25;

        if (
          distance < 0 &&
          currentIdx < TABS.length - 1 &&
          (isFastSwipe || isLongSwipe)
        ) {
          // Swipe left -> pagina successiva
          newIndex = currentIdx + 1;
        } else if (
          distance > 0 &&
          currentIdx > 0 &&
          (isFastSwipe || isLongSwipe)
        ) {
          // Swipe right -> pagina precedente
          newIndex = currentIdx - 1;
        }

        // Anima alla nuova posizione
        Animated.spring(scrollX, {
          toValue: -newIndex * SCREEN_WIDTH,
          useNativeDriver: true,
          damping: 25,
          stiffness: 200,
          mass: 0.6,
        }).start();

        // Aggiorna l'indice corrente
        if (newIndex !== currentIdx) {
          setCurrentIndex(newIndex);
          currentIndexRef.current = newIndex;
        }
      },
    })
  ).current;

  const handleTabPress = (index: number) => {
    Animated.spring(scrollX, {
      toValue: -index * SCREEN_WIDTH,
      useNativeDriver: true,
      damping: 25,
      stiffness: 200,
      mass: 0.6,
    }).start();
    setCurrentIndex(index);
    currentIndexRef.current = index;
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.pager,
          {
            transform: [{ translateX: scrollX }],
          },
        ]}
      >
        {React.Children.map(children, (child, index) => (
          <View key={index} style={styles.page} pointerEvents="box-none">
            {child}
          </View>
        ))}
      </Animated.View>

      <View style={[styles.tabBarContainer, { bottom: insets.bottom + 10 }]}>
        <BlurView intensity={100} tint="dark" style={styles.tabBarBlur}>
          {TABS.map((tab, index) => {
            const isActive = currentIndex === index;
            return (
              <Pressable
                key={tab.name}
                style={styles.tabButton}
                onPress={() => handleTabPress(index)}
              >
                {isActive && <View style={styles.activeTabBackground} />}
                <View style={{ position: "relative" }}>
                  <Ionicons
                    name={
                      isActive
                        ? (tab.icon as any)
                        : (`${tab.icon}-outline` as any)
                    }
                    size={22}
                    color={isActive ? "#2b7fff" : "#71767b"}
                    style={{ marginBottom: 2 }}
                  />
                  {/* Badge notifiche per Chat tab */}
                  {tab.name === "chat" && index !== currentIndex && (
                    <View style={styles.tabBadge}>
                      <Text style={styles.tabBadgeText}>3</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  pager: {
    flex: 1,
    flexDirection: "row",
    width: SCREEN_WIDTH * 3,
  },
  page: {
    width: SCREEN_WIDTH,
  },
  tabBarContainer: {
    position: "absolute",
    left: 24,
    right: 24,
    height: 60,
  },
  tabBarBlur: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#2b7fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 15,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: "relative",
  },
  activeTabBackground: {
    position: "absolute",
    top: 4,
    left: 12,
    right: 12,
    bottom: 4,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  tabLabel: {
    fontSize: 10,
    color: "#71767b",
    fontWeight: "600",
    marginTop: 2,
  },
  tabLabelActive: {
    color: "#2b7fff",
  },
  tabBadge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#0f172a",
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#fff",
  },
});
