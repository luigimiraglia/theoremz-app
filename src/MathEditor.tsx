import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MathView } from "./MathView";

interface MathEditorProps {
  visible: boolean;
  onClose: () => void;
  onInsert: (latex: string) => void;
}

export const MathEditor: React.FC<MathEditorProps> = ({
  visible,
  onClose,
  onInsert,
}) => {
  const [formula, setFormula] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const templates = [
    { name: "Frazione", latex: "\\frac{#}{#}", display: "x/y" },
    { name: "Potenza", latex: "^{#}", display: "x²" },
    { name: "Radice", latex: "\\sqrt{#}", display: "√x" },
    { name: "Sommatoria", latex: "\\sum_{#}^{#}", display: "∑" },
    { name: "Integrale", latex: "\\int_{#}^{#}", display: "∫" },
    { name: "Limite", latex: "\\lim_{# \\to #}", display: "lim" },
  ];

  const symbols = [
    { symbol: "+", latex: "+" },
    { symbol: "−", latex: "-" },
    { symbol: "×", latex: "\\times" },
    { symbol: "÷", latex: "\\div" },
    { symbol: "=", latex: "=" },
    { symbol: "π", latex: "\\pi" },
    { symbol: "∞", latex: "\\infty" },
    { symbol: "α", latex: "\\alpha" },
    { symbol: "β", latex: "\\beta" },
    { symbol: "θ", latex: "\\theta" },
  ];

  const insertAtCursor = (text: string) => {
    const before = formula.substring(0, cursorPosition);
    const after = formula.substring(cursorPosition);
    const newFormula = before + text + after;
    setFormula(newFormula);
    setCursorPosition(cursorPosition + text.length);

    // Se c'è un #, sposta il cursore lì
    const hashIndex = newFormula.indexOf("#", cursorPosition);
    if (hashIndex !== -1) {
      setFormula(newFormula.replace("#", ""));
      setCursorPosition(hashIndex);
    }
  };

  const handleInsert = () => {
    if (formula.trim()) {
      onInsert(`$${formula}$`);
      setFormula("");
      setCursorPosition(0);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} tint="dark" style={styles.blurView}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Editor Formule</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>

            {/* Anteprima Formula */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Anteprima:</Text>
              {formula ? (
                <View style={styles.previewBox}>
                  <MathView math={`$${formula}$`} />
                </View>
              ) : (
                <Text style={styles.emptyText}>La formula apparirà qui</Text>
              )}
            </View>

            {/* Input LaTeX (nascosto in futuro) */}
            <View style={styles.latexContainer}>
              <TextInput
                style={styles.latexInput}
                value={formula}
                onChangeText={setFormula}
                placeholder="Formula LaTeX..."
                placeholderTextColor="#666"
                multiline
                onSelectionChange={(e) =>
                  setCursorPosition(e.nativeEvent.selection.start)
                }
              />
            </View>

            {/* Template */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.templateScroll}
              contentContainerStyle={styles.templateContainer}
            >
              {templates.map((template, index) => (
                <Pressable
                  key={index}
                  style={styles.templateButton}
                  onPress={() => insertAtCursor(template.latex)}
                >
                  <Text style={styles.templateDisplay}>{template.display}</Text>
                  <Text style={styles.templateName}>{template.name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Simboli */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.symbolScroll}
              contentContainerStyle={styles.symbolContainer}
            >
              {symbols.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.symbolButton}
                  onPress={() => insertAtCursor(item.latex)}
                >
                  <Text style={styles.symbolText}>{item.symbol}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Azioni */}
            <View style={styles.actions}>
              <Pressable
                style={styles.clearButton}
                onPress={() => {
                  setFormula("");
                  setCursorPosition(0);
                }}
              >
                <Text style={styles.clearText}>Cancella</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.insertButton,
                  !formula.trim() && styles.insertButtonDisabled,
                ]}
                onPress={handleInsert}
                disabled={!formula.trim()}
              >
                <Text style={styles.insertText}>Inserisci</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  blurView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "rgba(26, 26, 26, 0.98)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
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
  previewContainer: {
    padding: 20,
    paddingBottom: 16,
  },
  previewLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  previewBox: {
    backgroundColor: "rgba(43, 127, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(43, 127, 255, 0.2)",
    minHeight: 80,
    justifyContent: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 15,
    textAlign: "center",
    fontStyle: "italic",
  },
  latexContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  latexInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    fontFamily: "monospace",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    minHeight: 60,
  },
  templateScroll: {
    maxHeight: 100,
  },
  templateContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  templateButton: {
    backgroundColor: "rgba(43, 127, 255, 0.12)",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(43, 127, 255, 0.25)",
    alignItems: "center",
    minWidth: 80,
  },
  templateDisplay: {
    fontSize: 24,
    color: "#2b7fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  templateName: {
    fontSize: 11,
    color: "#2b7fff",
  },
  symbolScroll: {
    marginTop: 12,
    maxHeight: 60,
  },
  symbolContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  symbolButton: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(43, 127, 255, 0.12)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(43, 127, 255, 0.25)",
  },
  symbolText: {
    fontSize: 22,
    color: "#2b7fff",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    marginTop: 16,
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
    alignItems: "center",
  },
  clearText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "600",
  },
  insertButton: {
    flex: 2,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#2b7fff",
    alignItems: "center",
  },
  insertButtonDisabled: {
    backgroundColor: "#444",
    opacity: 0.5,
  },
  insertText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
