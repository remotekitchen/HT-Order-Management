import { Package } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface HeaderProps {
  totalOrders: number;
}

export default function Header({ totalOrders }: HeaderProps) {
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
    <View className="bg-white px-4 py-4 border-b border-gray-100 shadow-sm">
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900">Recent Orders</Text>

        <Animated.View
          style={[
            animatedStyle,
            {
              backgroundColor: "#3B82F6",
              borderRadius: 25,
              paddingHorizontal: 16,
              paddingVertical: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Package size={16} color="white" style={{ marginRight: 4 }} />
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
                marginLeft: 4,
              }}
            >
              {totalOrders}
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
