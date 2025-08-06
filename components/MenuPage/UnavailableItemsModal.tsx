import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const initialMockUnavailable = [
  {
    category: "Rice",
    items: [
      { name: "Egg Khichuri", available: false },
      { name: "Chicken Khichuri", available: false },
      { name: "Morog Polao", available: false },
      { name: "Plain Rice", available: false },
    ],
  },
  {
    category: "Snacks",
    items: [
      { name: "Chicken Cheese Burger", available: false },
      { name: "Naga Wings", available: false },
    ],
  },
  {
    category: "Combo",
    items: [{ name: "Plain Rice with Chicken Curry", available: false }],
  },
  {
    category: "Curry",
    items: [{ name: "Chicken Jhal Fry", available: false }],
  },
  {
    category: "Drinks",
    items: [
      { name: "Mojo", available: false },
      { name: "Clemon", available: false },
    ],
  },
];

export default function UnavailableItemsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [show, setShow] = useState(visible);
  const [closing, setClosing] = useState(false);
  const [unavailable, setUnavailable] = useState(initialMockUnavailable);

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

  const handleToggle = (catIdx: number, itemIdx: number) => {
    setUnavailable((prev) =>
      prev.map((cat, cidx) =>
        cidx === catIdx
          ? {
              ...cat,
              items: cat.items.map((item, iidx) =>
                iidx === itemIdx
                  ? { ...item, available: !item.available }
                  : item
              ),
            }
          : cat
      )
    );
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
            zIndex: 100,
          }}
        >
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
            <Text style={{ fontWeight: "bold", fontSize: 22, color: "#111" }}>
              Unavailable Items
            </Text>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingBottom: 32,
              marginTop: 8,
            }}
          >
            {unavailable.map((cat, cidx) => (
              <View key={cat.category} style={{ marginBottom: 18 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: "#222",
                    marginBottom: 8,
                  }}
                >
                  {cat.category}
                </Text>
                {cat.items.map((item, idx) => (
                  <View
                    key={item.name}
                    style={{
                      backgroundColor: "#F3F4F6",
                      borderRadius: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 12,
                      padding: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        backgroundColor: "#F1F1F1",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                      }}
                    >
                      <Text style={{ color: "#BDBDBD", fontSize: 28 }}>🍽️</Text>
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontWeight: "500",
                        fontSize: 16,
                        color: "#222",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Switch
                      value={item.available}
                      trackColor={{ false: "#D1D5DB", true: "#34D399" }}
                      thumbColor={item.available ? "#10B981" : "#ccc"}
                      style={{ marginRight: 10 }}
                      onValueChange={() => handleToggle(cidx, idx)}
                    />
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </Modal>
  );
}
