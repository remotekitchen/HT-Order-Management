import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const tabs = [
  { label: "Incoming", key: "incoming", color: "bg-yellow-300" },
  { label: "Preparing", key: "preparing", color: "" },
  { label: "Ready", key: "ready", color: "" },
];

export default function OrderTabs({ activeTab, onTabChange, counts }) {
  return (
    <View className="flex-row border-b border-gray-200 px-2 bg-white">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          className={`px-4 py-2 rounded-t-xl mr-2 ${
            activeTab === tab.key ? "bg-yellow-300" : ""
          }`}
          onPress={() => onTabChange(tab.key)}
        >
          <Text
            className={`text-base font-medium ${
              activeTab === tab.key ? "text-black" : "text-gray-600"
            }`}
          >
            {tab.label} ({counts?.[tab.key] ?? 0})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
