import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import { FilterType } from "./types";

interface FilterDropdownProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  orderCounts: {
    all: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
}

const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Rejected", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function FilterDropdown({
  filter,
  setFilter,
  orderCounts,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: FilterType) => {
    setFilter(value);
    toggleDropdown();
  };

  const selectedLabel =
    filterOptions.find((opt) => opt.value === filter)?.label || "All";

  return (
    <View className="relative z-10">
      <TouchableOpacity
        className="flex-row items-center justify-between p-4 bg-gray-100 rounded-lg"
        onPress={toggleDropdown}
      >
        <Text className="text-lg font-bold">
          {selectedLabel} {orderCounts[filter]}
        </Text>
        <ChevronDown
          size={20}
          color="black"
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>
      {isOpen && (
        <View className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-2">
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="p-4 border-b border-gray-200"
              onPress={() => handleSelect(option.value)}
            >
              <Text className="text-base">
                {option.label} {orderCounts[option.value]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
