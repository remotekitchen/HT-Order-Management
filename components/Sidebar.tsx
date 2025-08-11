import { completeLogout } from "@/redux/feature/authentication/authenticationSlice";
import {
  ArrowLeft,
  Clock,
  Headphones,
  List,
  Settings,
  Volume2,
  X,
  Zap,
} from "lucide-react-native";
import React, { useRef } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

const menuItems = [
  { label: "Orders Overview", icon: List, key: "orders" },
  { label: "Recent Orders", icon: Clock, key: "recent" },
  { label: "Settings", icon: Settings, key: "settings" },
  { label: "FCM Debugger", icon: Zap, key: "fcm" },
  { label: "FCM Sound Tester", icon: Volume2, key: "fcm-sound" },
  {
    label: "Background Audio Tester",
    icon: Headphones,
    key: "background-audio",
  },
];

function finishClose(
  setShouldRenderRef: React.MutableRefObject<
    React.Dispatch<React.SetStateAction<boolean>>
  >,
  onCloseRef: React.MutableRefObject<() => void>
) {
  setShouldRenderRef.current(false);
  onCloseRef.current();
}

export default function Sidebar({
  visible,
  onClose,
  onSelect,
  selectedKey,
  statusBarHeight,
  helpCenterModalVisible,
  setHelpCenterModalVisible,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
  selectedKey: string;
  statusBarHeight: number;
  helpCenterModalVisible: boolean;
  setHelpCenterModalVisible: (visible: boolean) => void;
}) {
  const dispatch = useDispatch();
  const windowHeight = Dimensions.get("window").height;
  const sidebarWidth = Dimensions.get("window").width * 0.8;
  const translateX = useSharedValue(-sidebarWidth);
  const [shouldRender, setShouldRender] = React.useState(visible);
  const setShouldRenderRef = useRef(setShouldRender);
  setShouldRenderRef.current = setShouldRender;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Static restaurant info for demo
  const restaurantLogo = require("../assets/images/main_icon.png");
  const restaurantName = "Order Management";

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      translateX.value = withTiming(0, { duration: 250 });
    } else if (shouldRender) {
      translateX.value = withTiming(
        -sidebarWidth,
        { duration: 200 },
        (finished) => {
          if (finished) runOnJS(finishClose)(setShouldRenderRef, onCloseRef);
        }
      );
    }
  }, [visible, shouldRender, sidebarWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleClose = React.useCallback(() => {
    translateX.value = withTiming(
      -sidebarWidth,
      { duration: 200 },
      (finished) => {
        if (finished) runOnJS(finishClose)(setShouldRenderRef, onCloseRef);
      }
    );
  }, [sidebarWidth, translateX]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            dispatch(completeLogout());
            onClose();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleMenuSelect = (key: string) => {
    handleClose();
    setTimeout(() => onSelect(key), 200); // Reduced timeout for faster response
  };

  if (!shouldRender) return null;

  return (
    <View
      className="absolute left-0 right-0 z-50 flex-row"
      style={{ top: statusBarHeight, height: windowHeight - statusBarHeight }}
    >
      <Animated.View
        style={[
          { width: sidebarWidth, height: "100%" },
          animatedStyle,
          styles.sidebarShadow,
          { borderTopRightRadius: 36, backgroundColor: "white" },
        ]}
      >
        <View className="items-center pt-10 pb-4 bg-white">
          <Image
            source={restaurantLogo}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              marginBottom: 8,
            }}
            resizeMode="cover"
          />
          <Text className="text-2xl font-extrabold text-black mb-2">
            {restaurantName}
          </Text>
        </View>

        <View className="flex-1 px-4">
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.key}
              className="flex-row items-center py-3"
              onPress={() => handleMenuSelect(item.key)}
              style={{
                borderLeftWidth: selectedKey === item.key ? 4 : 0,
                borderLeftColor:
                  selectedKey === item.key ? "#FB923C" : "transparent",
                backgroundColor:
                  selectedKey === item.key ? "#F8F8F8" : "transparent",
              }}
            >
              <item.icon
                size={22}
                color="#222"
                style={{ marginLeft: 5, marginRight: 16 }}
              />
              <Text className="text-base font-semibold text-black flex-1">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#eee",
            marginHorizontal: 16,
            marginTop: 8,
          }}
        />
        <View className="px-4 pb-8 pt-4">
          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={() => setHelpCenterModalVisible(true)}
          >
            <Headphones size={22} color="#222" style={{ marginRight: 16 }} />
            <Text className="text-base font-semibold text-black flex-1">
              Help Center
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={handleLogout}
          >
            <ArrowLeft size={22} color="#222" style={{ marginRight: 16 }} />
            <Text className="text-base font-semibold text-black flex-1">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* Click outside to close */}
      <TouchableOpacity style={{ flex: 1 }} onPress={handleClose} />

      {/* Help Center Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpCenterModalVisible}
        onRequestClose={() => setHelpCenterModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className="bg-white rounded-2xl p-6 mx-6 shadow-lg"
            style={{ width: "85%" }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">
                Help Center
              </Text>
              <TouchableOpacity
                onPress={() => setHelpCenterModalVisible(false)}
                className="p-2"
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="items-center py-8">
              <View className="bg-blue-50 rounded-full p-4 mb-4">
                <Headphones size={48} color="#3B82F6" />
              </View>

              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Need Help?
              </Text>

              <Text className="text-gray-600 text-center mb-6">
                Contact our support team for assistance
              </Text>

              <View className="bg-gray-50 rounded-lg p-4 w-full">
                <Text className="text-gray-600 text-center mb-2">
                  Call us at:
                </Text>
                <Text className="text-2xl font-bold text-blue-600 text-center">
                  01789141408
                </Text>
              </View>

              <Text className="text-sm text-gray-500 text-center mt-4">
                Available 24/7 for your support
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 24,
  },
});
