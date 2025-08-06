import { Search, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PrinterSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPrinter: (printerName: string) => void;
}

// Mock printer devices - in a real app, this would come from Bluetooth scanning
const mockPrinters = [
  "DESKTOP-T680OHC9",
  "BlueTooth Printer",
  "realme Buds Air 3 Neo",
  "E70",
];

export default function PrinterSelectionModal({
  visible,
  onClose,
  onSelectPrinter,
}: PrinterSelectionModalProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [printers, setPrinters] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setIsSearching(true);
      // Simulate searching for printers
      setTimeout(() => {
        setPrinters(mockPrinters);
        setIsSearching(false);
      }, 1500);
    }
  }, [visible]);

  const handleSelectPrinter = (printerName: string) => {
    onSelectPrinter(printerName);
    onClose();
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 bg-black/40">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center p-6 border-b border-gray-200">
          <Text className="text-xl font-bold text-black">Printer</Text>
          <TouchableOpacity onPress={onClose} className="p-1">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1">
          {isSearching ? (
            <View className="p-6 items-center">
              <View>
                <Search size={32} color="#6B7280" />
              </View>
              <View>
                <Text className="text-gray-500 text-center mt-3">
                  Searching for printers...
                </Text>
              </View>
            </View>
          ) : (
            <View className="p-4">
              {printers.map((printer, index) => (
                <View key={printer}>
                  <View>
                    <TouchableOpacity
                      onPress={() => handleSelectPrinter(printer)}
                      className="py-4 border-b border-gray-200 last:border-b-0"
                      activeOpacity={0.7}
                    >
                      <Text className="text-black text-base text-center">
                        {printer}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
