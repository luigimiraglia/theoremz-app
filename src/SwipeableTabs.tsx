import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TABS = [
  { name: "home", path: "/(app)/(tabs)/home", icon: "grid" },
  { name: "chat", path: "/(app)/(tabs)/chat", icon: "flash" },
  { name: "account", path: "/(app)/(tabs)/account", icon: "person-circle" },
];

interface SwipeableTabsProps {
  children: React.ReactNode;
}

export function SwipeableTabs({ children }: SwipeableTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(0);

  // Trova l'indice del tab corrente
  const currentIndex = TABS.findIndex((tab) => pathname.includes(tab.name));

  useEffect(() => {
    // Anima alla posizione corretta quando cambia il pathname
    translateX.value = withSpring(-currentIndex * SCREEN_WIDTH, {
      damping: 20,
      stiffness: 90,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const navigateToTab = (index: number) => {
    if (index >= 0 && index < TABS.length) {
      router.push(TABS[index].path as any);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newTranslateX = -currentIndex * SCREEN_WIDTH + event.translationX;
      // Limita il pan per non andare oltre i bordi
      const minTranslate = -(TABS.length - 1) * SCREEN_WIDTH;
      const maxTranslate = 0;
      translateX.value = Math.max(
        minTranslate,
        Math.min(maxTranslate, newTranslateX)
      );
    })
    .onEnd((event) => {
      const threshold = SCREEN_WIDTH * 0.3;
      let targetIndex = currentIndex;

      if (event.translationX < -threshold && currentIndex < TABS.length - 1) {
        targetIndex = currentIndex + 1;
      } else if (event.translationX > threshold && currentIndex > 0) {
        targetIndex = currentIndex - 1;
      }

      translateX.value = withSpring(-targetIndex * SCREEN_WIDTH, {
        damping: 20,
        stiffness: 90,
      });

      if (targetIndex !== currentIndex) {
        runOnJS(navigateToTab)(targetIndex);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleTabPress = (index: number) => {
    navigateToTab(index);
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.pager, animatedStyle]}>
          {React.Children.map(children, (child, index) => (
            <View key={index} style={[styles.page, { width: SCREEN_WIDTH }]}>
              {child}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>

      {/* Floating Tab Bar */}
      <View style={[styles.tabBarContainer, { bottom: insets.bottom + 20 }]}>
        <BlurView intensity={100} tint="dark" style={styles.tabBarBlur}>
          {TABS.map((tab, index) => {
            const isActive = currentIndex === index;
            return (
              <Animated.View key={tab.name} style={styles.tabButton}>
                <Ionicons
                  name={
                    isActive
                      ? (tab.icon as any)
                      : (`${tab.icon}-outline` as any)
                  }
                  size={isActive ? 26 : 24}
                  color={isActive ? "#1d9bf0" : "#71767b"}
                  onPress={() => handleTabPress(index)}
                />
              </Animated.View>
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
  },
  pager: {
    flex: 1,
    flexDirection: "row",
  },
  page: {
    flex: 1,
  },
  tabBarContainer: {
    position: "absolute",
    left: 30,
    right: 30,
    height: 65,
  },
  tabBarBlur: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});
