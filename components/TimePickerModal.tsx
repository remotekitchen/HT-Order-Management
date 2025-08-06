import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

export default function TimePickerModal({
  visible,
  onCancel,
  onOk,
  initialHour,
  initialMinute,
  label,
}) {
  const [tempTime, setTempTime] = useState(
    new Date(0, 0, 0, initialHour || 0, initialMinute || 0, 0, 0)
  );
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    if (visible) {
      setTempTime(
        new Date(0, 0, 0, initialHour || 0, initialMinute || 0, 0, 0)
      );
      if (Platform.OS === "ios") setShowIOS(true);
    } else {
      setShowIOS(false);
    }
  }, [visible, initialHour, initialMinute]);

  // Android: show system dialog only, no modal, clock view only
  if (Platform.OS === "android") {
    return (
      <>
        {visible && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={true}
            display="clock"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                setTempTime(selectedDate);
                onOk(selectedDate.getHours(), selectedDate.getMinutes());
              } else {
                onCancel();
              }
            }}
          />
        )}
      </>
    );
  }

  // iOS: show modal with spinner
  return (
    <Modal visible={showIOS} transparent animationType="fade">
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
            width: 320,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#888",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            {label}
          </Text>
          <DateTimePicker
            value={
              new Date(
                0,
                0,
                0,
                tempTime.getHours(),
                tempTime.getMinutes(),
                0,
                0
              )
            }
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(event, selectedDate) => {
              if (selectedDate) setTempTime(selectedDate);
            }}
            style={{ width: 250 }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 16,
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
              onPress={() => onOk(tempTime.getHours(), tempTime.getMinutes())}
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
