import { Calendar as CalendarIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateRangeModal from "./DateRangeModal";
import { DateFilter, DateRange } from "./types";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function Tabs({
  dateFilter,
  setDateFilter,
}: {
  dateFilter: DateFilter;
  setDateFilter: (filter: DateFilter) => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectDateRange = (range: DateRange) => {
    setDateFilter({ mode: "custom", range });
    setModalVisible(false);
  };

  return (
    <View>
      <View className="flex-row bg-gray-100 p-1 rounded-full">
        <TouchableOpacity
          className="flex-1 items-center justify-center py-2"
          onPress={() => setDateFilter({ mode: "last7days" })}
        >
          <Text
            className={`font-bold ${
              dateFilter.mode === "last7days" ? "text-black" : "text-gray-500"
            }`}
          >
            Last 7 days
          </Text>
          {dateFilter.mode === "last7days" && (
            <View
              className="absolute -bottom-1 h-1 w-full bg-black"
              style={{ borderRadius: 2 }}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 flex-row items-center justify-center py-2 gap-x-1"
          onPress={() => setModalVisible(true)}
        >
          <CalendarIcon
            size={18}
            color={dateFilter.mode === "custom" ? "#000" : "#888"}
            className="mr-1"
          />
          <Text
            className={`font-bold ${
              dateFilter.mode === "custom" ? "text-black" : "text-gray-500"
            }`}
          >
            {dateFilter.mode === "custom" && dateFilter.range
              ? `${formatDate(dateFilter.range.startDate)} - ${formatDate(
                  dateFilter.range.endDate
                )}`
              : "Select Date"}
          </Text>
          {dateFilter.mode === "custom" && (
            <View
              className="absolute -bottom-1 h-1 w-full bg-black"
              style={{ borderRadius: 2 }}
            />
          )}
        </TouchableOpacity>
      </View>
      <DateRangeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelectDateRange}
      />
    </View>
  );
}
