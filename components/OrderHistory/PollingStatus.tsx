import { Pause, Play, RefreshCw } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PollingStatusProps {
  isPolling: boolean;
  isFetching: boolean;
  onPausePolling: () => void;
  onResumePolling: () => void;
  onRefresh: () => void;
  lastUpdateTime?: string;
}

export default function PollingStatus({
  isPolling,
  isFetching,
  onPausePolling,
  onResumePolling,
  onRefresh,
  lastUpdateTime,
}: PollingStatusProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <View className="flex-row items-center justify-between bg-orange-50 px-4 py-2 border-b border-orange-100">
      {/* Left side - Status and time */}
      <View className="flex-row items-center">
        <View className="flex-row items-center mr-3">
          <View
            className={`w-2 h-2 rounded-full mr-2 ${
              isPolling ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <Text className="text-xs text-gray-600">
            {isPolling ? "Live Updates" : "Updates Paused"}
          </Text>
        </View>

        {lastUpdateTime && (
          <Text className="text-xs text-gray-500">
            Last: {formatTime(lastUpdateTime)}
          </Text>
        )}
      </View>

      {/* Right side - Controls */}
      <View className="flex-row items-center space-x-2">
        {/* Manual refresh button */}
        <TouchableOpacity
          onPress={onRefresh}
          disabled={isFetching}
          className={`p-2 rounded-full ${
            isFetching ? "bg-gray-200" : "bg-orange-100"
          }`}
        >
          <RefreshCw
            size={16}
            color={isFetching ? "#9CA3AF" : "#F97316"}
            className={isFetching ? "opacity-50" : ""}
          />
        </TouchableOpacity>

        {/* Play/Pause button */}
        <TouchableOpacity
          onPress={isPolling ? onPausePolling : onResumePolling}
          className="p-2 rounded-full bg-orange-100"
        >
          {isPolling ? (
            <Pause size={16} color="#F97316" />
          ) : (
            <Play size={16} color="#F97316" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
