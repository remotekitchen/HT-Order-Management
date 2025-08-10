import OrderHistoryComponent from "@/components/OrderHistory";
import RecentOrders from "@/components/RecentOrders";
import SettingsPage from "@/components/SettingsPage";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import { Platform, StatusBar, View } from "react-native";
import Header from "../components/Header";

function getStatusBarHeight() {
  if (Platform.OS === "ios") return 44;
  return StatusBar.currentHeight || 24;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("orders");
  const [helpCenterModalVisible, setHelpCenterModalVisible] = useState(false);
  const statusBarHeight = getStatusBarHeight();

  let SectionComponent = null;
  if (activeSection === "orders") SectionComponent = <OrderHistoryComponent />;
  if (activeSection === "recent") SectionComponent = <RecentOrders />;
  if (activeSection === "settings") SectionComponent = <SettingsPage />;

  return (
    <View className="flex-1 bg-white relative">
      {/* Black status bar area */}
      <View style={{ height: statusBarHeight, backgroundColor: "#ffffff" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      </View>
      {/* Header below status bar */}
      <Header
        onMenuPress={() => setSidebarOpen(true)}
        onHelpCenterPress={() => setHelpCenterModalVisible(true)}
      />
      <View className="flex-1">{SectionComponent}</View>
      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(key: string) => {
          setSidebarOpen(false);
          if (key === "help") {
            setHelpCenterModalVisible(true);
          } else {
            setActiveSection(key);
          }
        }}
        selectedKey={activeSection}
        statusBarHeight={statusBarHeight}
        helpCenterModalVisible={helpCenterModalVisible}
        setHelpCenterModalVisible={setHelpCenterModalVisible}
      />
    </View>
  );
}
