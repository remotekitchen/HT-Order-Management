import { ArrowLeft, ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useUpdateItemMutation } from "../../redux/feature/menu/menuApi";
import { Category, MenuItem } from "./types";

interface EditMenuItemModalProps {
  visible: boolean;
  onClose: () => void;
  item: MenuItem;
  onUpdate: (item: MenuItem) => void;
  categories: Category[];
}

export default function EditMenuItemModal({
  visible,
  onClose,
  item,
  onUpdate,
  categories,
}: EditMenuItemModalProps) {
  // Find the current category name based on category_id
  const getCurrentCategoryName = () => {
    // Check if item has category_names (string) first
    if (item.category_names) {
      return item.category_names;
    }

    // Fallback to category array if category_names is not available
    if (Array.isArray(item.category) && item.category.length > 0) {
      // Find the category by ID in the categories array
      const categoryId = item.category[0];
      const currentCategory = categories.find((cat) => cat.id === categoryId);
      return currentCategory ? currentCategory.name : "";
    }

    return "";
  };

  // console.log(JSON.stringify(item, null, 2), "item");

  const [category, setCategory] = useState(getCurrentCategoryName());
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [name, setName] = useState(item.name || "");
  const [price, setPrice] = useState(
    item.base_price ? item.base_price.toString() : "0"
  );
  const [description, setDescription] = useState(item.description || "");
  const [image] = useState(
    item.original_image && item.original_image.local_url
      ? { uri: item.original_image.local_url }
      : item.original_image && item.original_image.working_url
      ? { uri: item.original_image.working_url }
      : require("../../assets/images/main_icon.png")
  );
  const [show, setShow] = useState(visible);
  const [closing, setClosing] = useState(false);
  const [updateItem, { isLoading }] = useUpdateItemMutation();

  // Update form data when item changes
  useEffect(() => {
    if (visible && item) {
      setName(item.name || "");
      setPrice(item.base_price ? item.base_price.toString() : "0");
      setDescription(item.description || "");
      setCategory(getCurrentCategoryName());
    }
  }, [visible, item, categories]);

  React.useEffect(() => {
    if (visible) {
      setShow(true);
      setClosing(false);
    }
  }, [visible]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShow(false);
      setClosing(false);
      onClose();
    }, 400);
  };

  // Get category ID from category name
  const getCategoryId = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.id.toString() : "";
  };

  return (
    <Modal visible={show} animationType="none" transparent>
      {show && !closing && (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 200,
          }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 22, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginBottom: 18,
              }}
            >
              <TouchableOpacity
                onPress={handleClose}
                style={{ marginRight: 16 }}
              >
                <ArrowLeft size={32} color="#222" />
              </TouchableOpacity>
              <Text style={{ fontWeight: "bold", fontSize: 22, color: "#111" }}>
                Update Menu Item
              </Text>
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              Select Category
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1.5,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                padding: 14,
                marginBottom: 0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => setShowCategoryDropdown((v) => !v)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 18 }}>
                {category || "Select a category"}
              </Text>
              <ChevronDown
                size={22}
                color="#888"
                style={{
                  transform: [
                    { rotate: showCategoryDropdown ? "180deg" : "0deg" },
                  ],
                }}
              />
            </TouchableOpacity>
            {showCategoryDropdown && (
              <View
                style={{
                  backgroundColor: "#F5F3F7",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  marginBottom: 18,
                  borderWidth: 1.5,
                  borderColor: "#D1D5DB",
                  borderTopWidth: 0,
                  maxHeight: 200,
                  overflow: "hidden",
                }}
              >
                <ScrollView
                  style={{ maxHeight: 200 }}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => {
                        setCategory(cat.name);
                        setShowCategoryDropdown(false);
                      }}
                      style={{
                        paddingVertical: 16,
                        paddingHorizontal: 18,
                        backgroundColor:
                          cat.name === category ? "#E5E1EB" : "#F5F3F7",
                        borderBottomWidth: 1,
                        borderBottomColor: "#E5E7EB",
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {!showCategoryDropdown && <View style={{ marginBottom: 18 }} />}
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              Item Image
            </Text>
            <View style={{ marginBottom: 18 }}>
              <Image
                source={image}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: "#D1D5DB",
                }}
              />
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: "#666",
                  textAlign: "center",
                }}
              >
                Image (Read Only)
              </Text>
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              Item Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={{
                borderWidth: 1.5,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                padding: 14,
                fontSize: 18,
                marginBottom: 18,
                color: "#222",
              }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              Base Price
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              style={{
                borderWidth: 1.5,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                padding: 14,
                fontSize: 18,
                marginBottom: 18,
                color: "#222",
              }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              style={{
                borderWidth: 1.5,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                padding: 14,
                fontSize: 17,
                minHeight: 80,
                color: "#222",
                marginBottom: 28,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#2563eb",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                opacity: isLoading ? 0.7 : 1,
              }}
              onPress={async () => {
                const updatedItem = {
                  ...item,
                  name,
                  price: parseFloat(price),
                  description,
                  category: category, // Use the selected category name
                  image,
                };

                console.log(
                  "Updated Item Data:",
                  JSON.stringify(updatedItem, null, 2)
                );

                // Create the API payload as an object (not form data)
                const payload = {
                  name: name,
                  description: description,
                  base_price: parseFloat(price),
                  category: getCategoryId(category),
                };

                console.log("API Payload (Individual Fields):");
                console.log("itemId:", item.id);
                console.log("name:", name);
                console.log("description:", description);
                console.log("base_price:", parseFloat(price));
                console.log("category:", [getCategoryId(category)]); // Show as array

                try {
                  const result = await updateItem({
                    itemId: item.id,
                    name: name,
                    description: description,
                    base_price: parseFloat(price),
                    category: [getCategoryId(category)], // Send as array
                  }).unwrap();

                  console.log("API Response:", result);

                  // Call onUpdate callback with updated item
                  onUpdate({
                    ...item,
                    name: name,
                    base_price: parseFloat(price),
                    description: description,
                    category: [getCategoryId(category)], // Send as array
                  });

                  // Close modal
                  onClose();
                } catch (error) {
                  console.error("Error updating item:", error);
                  Alert.alert(
                    "Error",
                    "Failed to update item. Please try again."
                  );
                }
              }}
              disabled={isLoading}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                {isLoading ? "Updating..." : "Update Item"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </Modal>
  );
}
