import AccountPage from "@/screens/AccountPage";
import HomePage from "@/screens/HomePage";
import { StatusBar } from "react-native";
import StudentChat from "../../screens/StudentChat";
import { SwipeableTabContainer } from "../../src/SwipeableTabContainer";
import { Toast } from "@/src/Toast";
import { useState } from "react";

export default function AppLayout() {
  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ visible: false, message: "", type: "info" });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SwipeableTabContainer>
        <HomePage />
        <StudentChat />
        <AccountPage />
      </SwipeableTabContainer>
    </>
  );
}
