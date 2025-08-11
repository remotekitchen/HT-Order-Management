import { completeLogout } from "@/redux/feature/authentication/authenticationSlice";
import { useGlobalSoundControl } from "@/utils/orderSoundManager";
import * as Haptics from "expo-haptics";
import { LogOut, Volume2, VolumeX } from "lucide-react-native";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

interface HeaderProps {
  onMenuPress: () => void;
  onHelpCenterPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, onHelpCenterPress }) => {
  const dispatch = useDispatch();
  const { isPaused, toggleSound } = useGlobalSoundControl();

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
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSoundToggle = () => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSound();
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Logout icon on the left side */}
      <TouchableOpacity onPress={handleLogout} className="p-2">
        <LogOut size={28} color="#222" />
      </TouchableOpacity>

      {/* Order Management text in the middle */}
      <Text className="text-xl font-bold text-gray-800 flex-1 text-center">
        Order Management
      </Text>

      {/* Sound control button on the right side */}
      <View className="items-center">
        <TouchableOpacity onPress={handleSoundToggle} className="p-2">
          {isPaused ? (
            <VolumeX size={28} color="#f97316" />
          ) : (
            <Volume2 size={28} color="#22c55e" />
          )}
        </TouchableOpacity>
        <Text className="text-xs text-gray-500 text-center">
          {isPaused ? "Unmute" : "Mute"}
        </Text>
      </View>
    </View>
  );
};

export default Header;
