import { getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
// @ts-ignore - Expo web compatibility
import { getReactNativePersistence } from "@firebase/auth/dist/rn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const firebaseConfig = Constants.expoConfig?.extra?.firebase as {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Inizializza Auth con persistenza solo su mobile
let auth: Auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

export { auth };
