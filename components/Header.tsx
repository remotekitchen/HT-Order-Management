import { Menu } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  onMenuPress: () => void;
  onHelpCenterPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, onHelpCenterPress }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <TouchableOpacity onPress={onMenuPress} className="p-2">
        <Menu size={28} color="#222" />
      </TouchableOpacity>

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
