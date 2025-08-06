import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import ChangeAvailabilityModal from "./ChangeAvailabilityModal";
import EditMenuItemModal from "./EditMenuItemModal";
import FullScreenImageModal from "./FullScreenImageModal";
import MenuItemList from "./MenuItemList";
import StatusIndicators from "./StatusIndicators";
import { MenuCategoryModalProps } from "./types";

export default function MenuCategoryModal({
  visible,
  category,
  onClose,
  items = [],
  categoryId = null,
  categories = [],
}: MenuCategoryModalProps) {
  const [show, setShow] = useState(visible);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [availModalIdx, setAvailModalIdx] = useState<number | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setShow(true);
    }
  }, [visible]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  // Filter items by categoryId
  const filteredItems =
    Array.isArray(items) && categoryId != null
      ? items.filter(
          (item) =>
            Array.isArray(item.category) && item.category.includes(categoryId)
        )
      : [];

  const handleImagePress = (imageUri: string) => {
    setFullScreenImage(imageUri);
  };

  const handleAvailabilityChange = (index: number, value: boolean) => {
    setAvailModalIdx(index);
  };

  const handleEdit = (index: number) => {
    setEditIdx(index);
  };

  const handleChangeAvailability = (option: string) => {
    if (availModalIdx !== null) {
      // This would need to update the parent state if you want to persist changes
      // For now, do nothing or show a message
      setAvailModalIdx(null);
    }
  };

  // Get current availability status for an item
  const getCurrentAvailabilityStatus = (item: any) => {
    if (item.is_available && item.is_available_today) {
      return "in_stock";
    } else if (item.is_available && !item.is_available_today) {
      return "sold_out_today";
    } else {
      return "out_of_stock";
    }
  };

  const handleUpdateItem = (updated: any) => {
    // This would need to update the parent state if you want to persist changes
    // For now, do nothing or show a message
    setEditIdx(null);
  };

  const handleDeleteItem = () => {
    // This would need to update the parent state if you want to persist changes
    // For now, do nothing or show a message
    setEditIdx(null);
  };

  if (!show) return null;

  return (
    <Modal visible={show} animationType="slide" transparent={false}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 18,
            paddingBottom: 8,
          }}
        >
          <TouchableOpacity onPress={handleClose} style={{ marginRight: 12 }}>
            <ArrowLeft size={28} color="#222" />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "#111" }}>
            {category}
          </Text>
        </View>

        {/* Status Indicators */}
        <StatusIndicators />

        {/* Menu Items List */}
        <MenuItemList
          items={filteredItems}
          onAvailabilityChange={handleAvailabilityChange}
          onEdit={handleEdit}
          onImagePress={handleImagePress}
        />

        {/* Modals */}
        <ChangeAvailabilityModal
          visible={availModalIdx !== null}
          current={
            availModalIdx !== null
              ? getCurrentAvailabilityStatus(filteredItems[availModalIdx])
              : "out_of_stock"
          }
          itemId={
            availModalIdx !== null ? Number(filteredItems[availModalIdx].id) : 0
          }
          onClose={() => setAvailModalIdx(null)}
          onChange={handleChangeAvailability}
        />

        {editIdx !== null && (
          <EditMenuItemModal
            visible={editIdx !== null}
            item={filteredItems[editIdx]}
            onClose={() => setEditIdx(null)}
            onUpdate={handleUpdateItem}
            categories={categories}
          />
        )}

        {/* Full Screen Image Modal */}
        <FullScreenImageModal
          visible={fullScreenImage !== null}
          imageUri={fullScreenImage}
          onClose={() => setFullScreenImage(null)}
        />
      </View>
    </Modal>
  );
}
