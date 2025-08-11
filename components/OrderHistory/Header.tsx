import {
  Clock,
  Grid3X3,
  Inbox,
  List,
  Volume2,
  VolumeX,
} from "lucide-react-native";
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
  layoutType?: "list" | "grid";
  onLayoutChange?: (layout: "list" | "grid") => void;
  isPlaying?: boolean; // Add sound playing indicator
  onStopSound?: () => void; // Add manual sound control
}

export default function Header({
  totalOrders,
  activeTab,
  onTabChange,
  layoutType,
  onLayoutChange,
  isPlaying = false, // Default to false
  onStopSound,
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
      {/* Sound Indicator */}
      {isPlaying && (
        <View className="flex-row items-center justify-between mb-3 p-2 bg-orange-100 rounded-lg border border-orange-200">
          <View className="flex-row items-center">
            <Volume2 size={16} color="#f97316" style={{ marginRight: 6 }} />
            <Text className="text-orange-700 text-sm font-medium">
              🔊 New order notification sound playing
            </Text>
          </View>

          {/* Manual Stop Button */}
          {onStopSound && (
            <TouchableOpacity
              onPress={onStopSound}
              className="p-2 bg-orange-200 rounded-lg"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <VolumeX size={16} color="#f97316" />
            </TouchableOpacity>
          )}
        </View>
      )}

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
              Recent Orders
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Layout Toggle - Only show for incoming tab */}
      {activeTab === "incoming" && layoutType && onLayoutChange && (
        <View className="flex-row justify-end mb-3">
          <View className="flex-row bg-gray-100 rounded-lg p-1">
            <TouchableOpacity
              onPress={() => onLayoutChange("list")}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor:
                  layoutType === "list" ? "#f97316" : "transparent",
              }}
            >
              <List
                size={16}
                color={layoutType === "list" ? "white" : "#6B7280"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onLayoutChange("grid")}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor:
                  layoutType === "grid" ? "#f97316" : "transparent",
              }}
            >
              <Grid3X3
                size={16}
                color={layoutType === "grid" ? "white" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
