import { useAudioPlayer } from "expo-audio";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingsPage() {
  const player = useAudioPlayer(require("../assets/sound/order_sound.mp3"));

  const handleTestSound = async () => {
    try {
      await player.seekTo(0);
      await player.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Header */}
      <View>
        <Text className="text-black font-bold text-3xl mb-8">Settings</Text>
      </View>

      {/* Sound Section */}
      <View className="flex-row items-center justify-between mt-5">
        <Text className="text-black font-bold text-lg">Sound</Text>
        <TouchableOpacity
          onPress={handleTestSound}
          className="bg-pink-500 px-4 py-2 rounded-lg"
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold">Test sound</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
