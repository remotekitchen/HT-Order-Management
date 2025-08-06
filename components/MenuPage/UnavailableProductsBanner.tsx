import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import UnavailableItemsModal from "./UnavailableItemsModal";

export default function UnavailableProductsBanner({
  count,
}: {
  count: number;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: "#FB923C", // App orange
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 14,
          paddingHorizontal: 18,
          marginBottom: 18,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
          Unavailable Products
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            minWidth: 36,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 16,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: "#FB2576", fontWeight: "bold", fontSize: 18 }}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
      <UnavailableItemsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
