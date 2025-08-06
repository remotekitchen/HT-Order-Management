import { Pencil } from "lucide-react-native";
import React from "react";
import { Image, Switch, Text, TouchableOpacity, View } from "react-native";
import { MenuItem } from "./types";

export default function MenuItemCard({
  item,
  index,
  onEdit,
  onAvailabilityChange,
  onImagePress,
}: {
  item: MenuItem;
  index: number;
  onEdit: () => void;
  onAvailabilityChange: (value: boolean) => void;
  onImagePress: (imageUri: string) => void;
}) {
  // Determine image source - prioritize API images, fallback to main icon
  const getImageSource = (item: MenuItem) => {
    if (item.original_image && item.original_image.local_url) {
      return { uri: item.original_image.local_url };
    } else if (item.image_url) {
      return { uri: item.image_url };
    } else {
      return require("../../assets/images/main_icon.png");
    }
  };

  const imageSource = getImageSource(item);

  return (
    <View
      style={{
        backgroundColor: "#F7F7F7",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          // Only show full screen if it's an API image, not the fallback icon
          if (item.original_image?.local_url || item.image_url) {
            const imageUri = item.original_image?.local_url || item.image_url;
            if (imageUri) {
              onImagePress(imageUri);
            }
          }
        }}
      >
        <Image
          source={imageSource}
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            marginRight: 12,
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 4,
          }}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 4,
          }}
        >
          ৳{(item.base_price || 0).toFixed(2)}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#999",
          }}
        >
          {item.description || "No description available"}
        </Text>
      </View>
      <Switch
        value={item.is_available && item.is_available_today}
        trackColor={{
          false: "#E5E7EB",
          true: "#10B981",
        }}
        thumbColor={
          item.is_available && item.is_available_today ? "#fff" : "#fff"
        }
        ios_backgroundColor="#E5E7EB"
        style={{ marginRight: 10 }}
        onValueChange={onAvailabilityChange}
      />
      <TouchableOpacity
        style={{
          padding: 8,
          borderRadius: 8,
          backgroundColor: "#F3F4F6",
        }}
        onPress={onEdit}
      >
        <Pencil size={18} color="#888" />
      </TouchableOpacity>
    </View>
  );
}
