import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MathKeyboardProps {
  onInsert: (text: string) => void;
  onClose: () => void;
}

export const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert, onClose }) => {
  const mathSymbols = [
    // Operatori base
    { label: "+", latex: "+" },
    { label: "−", latex: "-" },
    { label: "×", latex: "\\times" },
    { label: "÷", latex: "\\div" },
    { label: "=", latex: "=" },
    { label: "≠", latex: "\\neq" },
    
    // Frazioni e potenze
    { label: "x²", latex: "^{2}" },
    { label: "xⁿ", latex: "^{n}" },
    { label: "½", latex: "\\frac{1}{2}" },
    { label: "x/y", latex: "\\frac{x}{y}" },
    { label: "√", latex: "\\sqrt{x}" },
    { label: "ⁿ√", latex: "\\sqrt[n]{x}" },
    
    // Relazioni
    { label: "<", latex: "<" },
    { label: ">", latex: ">" },
    { label: "≤", latex: "\\leq" },
    { label: "≥", latex: "\\geq" },
    { label: "≈", latex: "\\approx" },
    { label: "∞", latex: "\\infty" },
    
    // Calcolo
    { label: "∫", latex: "\\int" },
    { label: "∑", latex: "\\sum" },
    { label: "∏", latex: "\\prod" },
    { label: "lim", latex: "\\lim_{x \\to \\infty}" },
    { label: "d/dx", latex: "\\frac{d}{dx}" },
    
    // Lettere greche comuni
    { label: "α", latex: "\\alpha" },
    { label: "β", latex: "\\beta" },
    { label: "γ", latex: "\\gamma" },
    { label: "δ", latex: "\\delta" },
    { label: "θ", latex: "\\theta" },
    { label: "π", latex: "\\pi" },
    { label: "μ", latex: "\\mu" },
    { label: "σ", latex: "\\sigma" },
    { label: "Σ", latex: "\\Sigma" },
    { label: "Δ", latex: "\\Delta" },
    
    // Parentesi
    { label: "( )", latex: "()" },
    { label: "[ ]", latex: "[]" },
    { label: "{ }", latex: "\\{\\}" },
    { label: "|x|", latex: "|x|" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Simboli Matematici</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.symbolsContainer}
        showsVerticalScrollIndicator={false}
      >
        {mathSymbols.map((symbol, index) => (
          <Pressable
            key={index}
            style={styles.symbolButton}
            onPress={() => onInsert(symbol.latex)}
          >
            <Text style={styles.symbolText}>{symbol.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.helpText}>
          Tocca un simbolo per inserirlo nella formula
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(26, 26, 26, 0.98)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  scrollView: {
    maxHeight: 200,
  },
  symbolsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 8,
  },
  symbolButton: {
    width: 60,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  symbolText: {
    fontSize: 20,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  helpText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});
