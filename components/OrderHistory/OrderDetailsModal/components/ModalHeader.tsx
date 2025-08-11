import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 border-b border-gray-200 pb-4">
      <Text className="text-xl font-bold text-gray-900">{title}</Text>
      <TouchableOpacity
        onPress={onClose}
        className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
      >
        <Text className="text-gray-600 text-lg">×</Text>
      </TouchableOpacity>
    </View>
  );
}
