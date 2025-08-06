import React from "react";
import { Image, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface FullScreenImageModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

export default function FullScreenImageModal({
  visible,
  imageUri,
  onClose,
}: FullScreenImageModalProps) {
  if (!imageUri) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.fullScreenOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
});
