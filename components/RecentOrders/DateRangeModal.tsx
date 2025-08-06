import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { DateRange } from "./types";

interface DateRangeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (range: DateRange) => void;
}

interface CustomPeriodMarking {
  startingDay?: boolean;
  endingDay?: boolean;
  color: string;
  textColor: string;
  disabled?: boolean;
  disableTouchEvent?: boolean;
}

export default function DateRangeModal({
  visible,
  onClose,
  onSelect,
}: DateRangeModalProps) {
  const [markedDates, setMarkedDates] = useState<{
    [date: string]: CustomPeriodMarking;
  }>({});
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setStartDate(null);
      setEndDate(null);
      setMarkedDates({});
    }
  }, [visible]);

  const onDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          color: "blue",
          textColor: "white",
        },
      });
    } else {
      setEndDate(day.dateString);
      let newMarkedDates: { [date: string]: CustomPeriodMarking } = {};
      let current = new Date(startDate);
      const end = new Date(day.dateString);

      while (current <= end) {
        const dateString = current.toISOString().split("T")[0];
        newMarkedDates[dateString] = {
          color: "lightblue",
          textColor: "black",
        };
        current.setDate(current.getDate() + 1);
      }

      newMarkedDates[startDate] = {
        ...newMarkedDates[startDate],
        startingDay: true,
        color: "blue",
        textColor: "white",
      };
      newMarkedDates[day.dateString] = {
        ...newMarkedDates[day.dateString],
        endingDay: true,
        color: "blue",
        textColor: "white",
      };
      setMarkedDates(newMarkedDates);
    }
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      onSelect({ startDate, endDate });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-4 w-11/12">
          <Text className="text-xl font-bold text-center mb-4">
            Select Dates
          </Text>
          <Calendar
            markingType={"period"}
            markedDates={markedDates}
            onDayPress={onDayPress}
            theme={{
              arrowColor: "blue",
              todayTextColor: "blue",
            }}
          />
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              className="bg-red-100 px-4 py-2 rounded-lg mr-2"
              onPress={onClose}
            >
              <Text className="text-red-500 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                startDate && endDate ? "bg-blue-500" : "bg-gray-300"
              }`}
              onPress={handleSubmit}
              disabled={!startDate || !endDate}
            >
              <Text className="text-white font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
