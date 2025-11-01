import { Redirect } from "expo-router";

export default function Index() {
  // Questo componente non verrà mai mostrato perché il Gate in _layout.tsx
  // si occuperà del routing. Ma serve come fallback per evitare "unmatched route"
  return <Redirect href="/(auth)/login" />;
}
