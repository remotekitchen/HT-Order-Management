import { completeLogout } from "@/redux/feature/authentication/authenticationSlice";
import { LogOut } from "lucide-react-native";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

interface HeaderProps {
  onMenuPress: () => void;
  onHelpCenterPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, onHelpCenterPress }) => {
  const dispatch = useDispatch();

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

      {/* Logo on the right side */}
      <TouchableOpacity onPress={onHelpCenterPress} className="p-2">
        <Image
          className="rounded-full"
          source={require("../assets/images/main_icon_300x300.png")}
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
