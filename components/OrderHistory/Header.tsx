import { Clock, Inbox } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface HeaderProps {
  totalOrders: number;
  activeTab: "incoming" | "recent";
  onTabChange: (tab: "incoming" | "recent") => void;
}

export default function Header({
  totalOrders,
  activeTab,
  onTabChange,
}: HeaderProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  React.useEffect(() => {
    scale.value = withTiming(1.05, { duration: 200 }, () => {
      scale.value = withTiming(1, { duration: 200 });
    });
  }, [totalOrders]);

  return (
    <View className="bg-white px-4 pt-4 border-b border-gray-100 shadow-sm">
      {/* Tabs */}
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => onTabChange("incoming")}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginRight: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            backgroundColor: activeTab === "incoming" ? "#f97316" : "#f9fafb",
            borderWidth: activeTab === "incoming" ? 0 : 1,
            borderColor: activeTab === "incoming" ? "transparent" : "#e5e7eb",
          }}
        >
          <View className="flex-row items-center justify-center">
            <Inbox
              size={16}
              color={activeTab === "incoming" ? "white" : "#6B7280"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: 16,
                color: activeTab === "incoming" ? "white" : "#374151",
              }}
            >
              Incoming ({totalOrders})
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTabChange("recent")}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginLeft: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            backgroundColor: activeTab === "recent" ? "#f59e0b" : "#f9fafb",
            borderWidth: activeTab === "recent" ? 0 : 1,
            borderColor: activeTab === "recent" ? "transparent" : "#e5e7eb",
          }}
        >
          <View className="flex-row items-center justify-center">
            <Clock
              size={16}
              color={activeTab === "recent" ? "white" : "#6B7280"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: 16,
                color: activeTab === "recent" ? "white" : "#374151",
              }}
            >
              Recent Orders (0)
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
