import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { Layout } from "react-native-reanimated";
import OpeningHoursDayRow from "./OpeningHoursDayRow";
import OpeningHoursShiftRow from "./OpeningHoursShiftRow";
import TimePickerModal from "./TimePickerModal";

export default function OpeningHoursEditView({
  openingHours,
  setOpeningHours,
  onCancel,
  onSave,
  isSaving,
}: any) {
  const [expandedDays, setExpandedDays] = useState([]);
  const [localHours, setLocalHours] = useState(
    JSON.parse(JSON.stringify(openingHours))
  );
  const [picker, setPicker] = useState(null); // { dayIdx, shiftIdx, field }

  const handleToggle = (idx) => {
    const updated = [...localHours];
    updated[idx].enabled = !updated[idx].enabled;
    setLocalHours(updated);
  };

  const handleArrow = (idx: any) => {
    setExpandedDays((prev: any) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleShiftChange = (dayIdx, shiftIdx, field, value) => {
    const updated = [...localHours];
    updated[dayIdx].shifts[shiftIdx][field] = value;
    setLocalHours(updated);
  };

  const handleRemoveShift = (dayIdx, shiftIdx) => {
    const updated = [...localHours];
    updated[dayIdx].shifts.splice(shiftIdx, 1);
    if (updated[dayIdx].shifts.length === 0) updated[dayIdx].enabled = false;
    setLocalHours(updated);
  };

  const handleAddShift = (dayIdx) => {
    const updated = [...localHours];
    if (updated[dayIdx].shifts.length < 2) {
      updated[dayIdx].shifts.push({ start: "11:00", end: "21:00" });
      updated[dayIdx].enabled = true;
      setLocalHours(updated);
    }
  };

  const hasChanged =
    JSON.stringify(localHours) !== JSON.stringify(openingHours);

  // Time picker handlers
  const openPicker = (dayIdx, shiftIdx, field) => {
    setPicker({ dayIdx, shiftIdx, field });
  };
  const closePicker = () => setPicker(null);
  const onPickerOk = (hour, minute) => {
    if (!picker) return;
    let fixedMinute = minute;
    if (Platform.OS === "android") {
      fixedMinute = minute - 6;
      if (fixedMinute < 0) fixedMinute += 60;
    }
    console.log("DEBUG onPickerOk:", { hour, minute, fixedMinute });
    const value = `${hour.toString().padStart(2, "0")}:${fixedMinute
      .toString()
      .padStart(2, "0")}`;
    console.log("DEBUG value string:", value);
    handleShiftChange(picker.dayIdx, picker.shiftIdx, picker.field, value);
    closePicker();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            margin: 24,
            marginBottom: 12,
          }}
        >
          Edit regular schedule
        </Text>
        {localHours.map((item, idx) => (
          <View key={item.day}>
            <OpeningHoursDayRow
              day={item.day}
              enabled={item.enabled}
              onToggle={() => handleToggle(idx)}
              onArrowPress={() => handleArrow(idx)}
            />
            {expandedDays.includes(idx) && item.enabled && (
              <Animated.View layout={Layout.springify()}>
                {item.shifts.map((shift, sidx) => (
                  <OpeningHoursShiftRow
                    key={sidx}
                    start={shift.start}
                    end={shift.end}
                    onStartChange={() => openPicker(idx, sidx, "start")}
                    onEndChange={() => openPicker(idx, sidx, "end")}
                    onRemove={() => handleRemoveShift(idx, sidx)}
                  />
                ))}
                {item.shifts.length < 2 && (
                  <TouchableOpacity
                    onPress={() => handleAddShift(idx)}
                    style={{ marginLeft: 32, marginBottom: 8 }}
                  >
                    <Text
                      style={{
                        color: "#E91E63",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Add a shift
                    </Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            )}
          </View>
        ))}
      </ScrollView>
      {/* Fixed bottom bar for Save/Cancel, two rows */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#fff",
          paddingHorizontal: 24,
          paddingBottom: 24,
          paddingTop: 12,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => onSave(localHours)}
          disabled={!hasChanged || isSaving}
          style={{
            width: "100%",
            backgroundColor: hasChanged ? "#E91E63" : "#F3F4F6",
            borderRadius: 8,
            paddingVertical: 18,
            alignItems: "center",
            marginBottom: 8,
            opacity: hasChanged && !isSaving ? 1 : 0.5,
          }}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: hasChanged ? "#fff" : "#888",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              Save
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          style={{ alignItems: "center", marginTop: 0 }}
        >
          <Text style={{ color: "#E91E63", fontWeight: "bold", fontSize: 18 }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
      {picker &&
        (() => {
          const timeStr =
            localHours[picker.dayIdx].shifts[picker.shiftIdx][picker.field];
          const timeParts = timeStr.split(":");
          const hour = parseInt(timeParts[0], 10);
          const minute = parseInt(timeParts[1], 10);
          return (
            <TimePickerModal
              visible={!!picker}
              onCancel={closePicker}
              onOk={onPickerOk}
              initialHour={hour}
              initialMinute={minute}
              label={picker.field === "start" ? "STARTS AT" : "ENDS AT"}
            />
          );
        })()}
    </View>
  );
}
