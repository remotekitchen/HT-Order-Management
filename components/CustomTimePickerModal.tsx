import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

export default function CustomTimePickerModal({
  visible,
  onCancel,
  onOk,
  initialHour,
  initialMinute,
  label,
}) {
  const [hour, setHour] = useState(initialHour || 0);
  const [minute, setMinute] = useState(initialMinute || 0);

  useEffect(() => {
    if (visible) {
      setHour(initialHour || 0);
      setMinute(initialMinute || 0);
    }
  }, [visible, initialHour, initialMinute]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.25)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 24,
            width: 340,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#888",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            {label}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            {/* Hour Picker */}
            <ScrollView
              style={{ height: 120 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {hours.map((h) => (
                <TouchableOpacity key={h} onPress={() => setHour(h)}>
                  <Text
                    style={{
                      fontSize: 48,
                      color: hour === h ? "#111" : "#bbb",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: 80,
                      borderWidth: 2,
                      borderColor: hour === h ? "#E91E63" : "transparent",
                      borderRadius: 12,
                      marginVertical: 2,
                    }}
                  >
                    {h.toString().padStart(2, "0")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={{ fontSize: 48, marginHorizontal: 8, color: "#888" }}>
              :
            </Text>
            {/* Minute Picker */}
            <ScrollView
              style={{ height: 120 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {minutes.map((m) => (
                <TouchableOpacity key={m} onPress={() => setMinute(m)}>
                  <Text
                    style={{
                      fontSize: 48,
                      color: minute === m ? "#111" : "#bbb",
                      fontWeight: "bold",
                      textAlign: "center",
                      width: 80,
                      borderWidth: 2,
                      borderColor: minute === m ? "#E91E63" : "transparent",
                      borderRadius: 12,
                      marginVertical: 2,
                    }}
                  >
                    {m.toString().padStart(2, "0")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                width: 80,
                textAlign: "center",
                color: "#888",
                fontWeight: "bold",
              }}
            >
              Hour
            </Text>
            <Text
              style={{
                width: 80,
                textAlign: "center",
                color: "#888",
                fontWeight: "bold",
                marginLeft: 96,
              }}
            >
              Minute
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 8,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{ flex: 1, alignItems: "center", padding: 12 }}
            >
              <Text
                style={{ color: "#E91E63", fontWeight: "bold", fontSize: 18 }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onOk(hour, minute)}
              style={{ flex: 1, alignItems: "center", padding: 12 }}
            >
              <Text
                style={{ color: "#E91E63", fontWeight: "bold", fontSize: 18 }}
              >
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
