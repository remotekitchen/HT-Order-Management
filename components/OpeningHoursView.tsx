import { Pencil } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

function formatTime12h(timeStr) {
  // timeStr: '08:00' or '19:50' or '20:55'
  const [h, m] = timeStr.split(":").map(Number);
  let hour = h % 12 === 0 ? 12 : h % 12;
  let ampm = h < 12 ? "AM" : "PM";
  // Add space before and after colon if not on the hour
  if (m === 0) {
    return `${hour} ${ampm}`;
  } else {
    return `${hour} : ${m.toString().padStart(2, "0")} ${ampm}`;
  }
}

export default function OpeningHoursView({ openingHours, onEdit }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 24,
          paddingBottom: 12,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>
          Your opening hours
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Regular schedule
        </Text>
        <TouchableOpacity
          onPress={onEdit}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text
            style={{
              color: "#FB923C",
              fontWeight: "bold",
              fontSize: 16,
              marginRight: 4,
            }}
          >
            Edit
          </Text>
          <Pencil size={18} color="#FB923C" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={openingHours}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text style={{ color: "#888", fontSize: 16 }}>{item.day}</Text>
            <Text style={{ color: "#222", fontSize: 16 }}>
              {item.enabled && item.shifts.length > 0
                ? item.shifts
                    .map(
                      (s) =>
                        `${formatTime12h(s.start)} - ${formatTime12h(s.end)}`
                    )
                    .join(", ")
                : "--"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
