import AccountPage from "@/screens/AccountPage";
import HomePage from "@/screens/HomePage";
import { StatusBar } from "react-native";
import StudentChat from "../../screens/StudentChat";
import { SwipeableTabContainer } from "../../src/SwipeableTabContainer";

export default function AppLayout() {
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
