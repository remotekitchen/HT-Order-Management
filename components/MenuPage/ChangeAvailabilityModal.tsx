import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAvailableUnavailableItemMutation } from "../../redux/feature/menu/menuApi";
import { ChangeAvailabilityModalProps } from "./types";

const AVAILABILITY_OPTIONS = [
  { key: "in_stock", label: "In Stock" },
  { key: "sold_out_today", label: "Sold Out Today" },
  { key: "out_of_stock", label: "Out of Stock" },
];

export default function ChangeAvailabilityModal({
  visible,
  onClose,
  onChange,
  current,
  itemId,
}: ChangeAvailabilityModalProps) {
  const [selected, setSelected] = useState(current);
  const [updateAvailability, { isLoading }] =
    useAvailableUnavailableItemMutation();
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Reset selected when modal opens
  useEffect(() => {
    if (visible) {
      setSelected(current);
      setToastMessage(null);
    }
  }, [visible, current]);

  // Check if there's a change
  const hasChange = selected !== current;

  const getApiPayload = (status: string) => {
    switch (status) {
      case "in_stock":
        return {
          itemId: [itemId],
          indefinite: true,
          today: true,
        };
      case "sold_out_today":
        return {
          itemId: [itemId],
          indefinite: true,
          today: false,
        };
      case "out_of_stock":
        return {
          itemId: [itemId],
          indefinite: false,
          today: true,
        };
      default:
        return {
          itemId: [itemId],
          indefinite: true,
          today: true,
        };
    }
  };

  const handleChange = async () => {
    if (!hasChange) return;

    try {
      const payload = getApiPayload(selected);
      await updateAvailability(payload).unwrap();

      // Show success toast within modal
      setToastMessage({
        type: "success",
        message: "Item availability updated successfully",
      });

      // Auto-hide toast after 2 seconds
      setTimeout(() => {
        setToastMessage(null);
        // Call the onChange callback and close modal
        onChange(selected);
        onClose();
      }, 2000);
    } catch (error) {
      // Show error toast within modal
      setToastMessage({
        type: "error",
        message: "Failed to update item availability",
      });

      // Auto-hide error toast after 3 seconds
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.18)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#F7F7FB",
            borderRadius: 18,
            width: 340,
            padding: 22,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 6,
            position: "relative",
          }}
        >
          {/* Toast Message */}
          {toastMessage && (
            <View
              style={{
                position: "absolute",
                top: -60,
                left: 0,
                right: 0,
                backgroundColor:
                  toastMessage.type === "success" ? "#10B981" : "#EF4444",
                borderRadius: 12,
                padding: 12,
                marginHorizontal: 10,
                zIndex: 1000,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {toastMessage.message}
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "#111" }}>
              Change Availability
            </Text>
            <TouchableOpacity onPress={onClose}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#fff0f0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 22, color: "#F43F5E", fontWeight: "bold" }}
                >
                  ×
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {AVAILABILITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setSelected(opt.key)}
              style={{
                borderWidth: 2,
                borderColor: selected === opt.key ? "#2563eb" : "#E5E7EB",
                borderRadius: 12,
                paddingVertical: 18,
                paddingHorizontal: 16,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 17, color: "#222", fontWeight: "500" }}>
                {opt.label}
              </Text>
              {selected === opt.key ? (
                <Text style={{ color: "#2563eb", fontSize: 22 }}>✔️</Text>
              ) : (
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: "#D1D5DB",
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={handleChange}
            disabled={!hasChange || isLoading}
            style={{
              backgroundColor: hasChange && !isLoading ? "#2196F3" : "#D1D5DB",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 8,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginRight: 8 }}
              />
            ) : null}
            <Text
              style={{
                color: hasChange && !isLoading ? "#fff" : "#666",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {isLoading ? "Updating..." : "Change"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
