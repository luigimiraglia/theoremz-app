// 🎨 Theoremz Design System - Premium Azure Theme
// Inspired by the best: Airbnb, Linear, Arc Browser

export const colors = {
  // Primary Brand Color
  primary: "#2b7fff",

  // Primary Azure Palette
  azure: {
    50: "#E0F2FE",
    100: "#B9E6FE",
    200: "#7DD3FC",
    300: "#38BDF8",
    400: "#2b7fff",
    500: "#1e6edb",
    600: "#1a5fc4",
    700: "#1651ad",
    800: "#124396",
    900: "#0e357f",
  },

  // Gradients
  gradients: {
    azure: ["#2b7fff", "#1e6edb"],
    azureSoft: ["#E0F2FE", "#B9E6FE", "#7DD3FC"],
    sky: ["#7DD3FC", "#38BDF8", "#2b7fff"],
    ocean: ["#2b7fff", "#1e6edb", "#1a5fc4"],
    midnight: ["#082F49", "#0C4A6E", "#075985"],
    subtle: ["#F0FBFF", "#E0F2FE", "#B9E6FE"],
  },

  // Neutrals
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // Semantic Colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#0EA5E9",

  // Backgrounds
  bg: {
    primary: "#FFFFFF",
    secondary: "#F8FAFC",
    tertiary: "#F1F5F9",
    dark: "#0F172A",
    darkSecondary: "#1E293B",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
};
