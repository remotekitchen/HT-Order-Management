// components/BackgroundAudioTester.tsx
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  handleFCMOrderSound,
  isBackgroundSoundPlaying,
  playOrderSoundImmediately,
  stopBackgroundSound,
} from "../utils/backgroundAudioService";

export default function BackgroundAudioTester() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const addResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const testPlaySound = async () => {
    try {
      addResult("🎵 Testing direct sound playback...");
      const success = await playOrderSoundImmediately();
      if (success) {
        addResult("✅ Sound started playing successfully");
        setIsPlaying(true);
      } else {
        addResult("❌ Failed to start sound");
      }
    } catch (error: any) {
      addResult(`❌ Error: ${error?.message || "Unknown error"}`);
    }
  };

  const testStopSound = async () => {
    try {
      addResult("🛑 Testing sound stop...");
      const success = await stopBackgroundSound();
      if (success) {
        addResult("✅ Sound stopped successfully");
        setIsPlaying(false);
      } else {
        addResult("⚠️ Sound was not playing");
      }
    } catch (error: any) {
      addResult(`❌ Error: ${error?.message || "Unknown error"}`);
    }
  };

  const testFCMTrigger = async () => {
    try {
      addResult("📱 Testing FCM sound trigger...");
      const success = await handleFCMOrderSound();
      if (success) {
        addResult("✅ FCM sound trigger successful");
        setIsPlaying(true);
      } else {
        addResult("⚠️ FCM sound trigger will resume when app becomes active");
      }
    } catch (error: any) {
      addResult(`❌ Error: ${error?.message || "Unknown error"}`);
    }
  };

  const checkStatus = () => {
    const playing = isBackgroundSoundPlaying();
    setIsPlaying(playing);
    addResult(`📊 Current status: ${playing ? "Playing" : "Stopped"}`);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f5f5f5" }}>
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          🎵 Background Audio Tester
        </Text>

        <Text
          style={{
            fontSize: 14,
            marginBottom: 16,
            textAlign: "center",
            color: "#666",
          }}
        >
          Test the background audio service for FCM notifications
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={testPlaySound}
            style={{
              backgroundColor: "#34C759",
              padding: 12,
              borderRadius: 6,
              flex: 1,
              marginRight: 8,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              ▶️ Play Sound
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testStopSound}
            style={{
              backgroundColor: "#FF3B30",
              padding: 12,
              borderRadius: 6,
              flex: 1,
              marginLeft: 8,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              ⏹️ Stop Sound
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={testFCMTrigger}
            style={{
              backgroundColor: "#007AFF",
              padding: 12,
              borderRadius: 6,
              flex: 1,
              marginRight: 8,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              📱 Test FCM Trigger
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={checkStatus}
            style={{
              backgroundColor: "#FF9500",
              padding: 12,
              borderRadius: 6,
              flex: 1,
              marginLeft: 8,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              📊 Check Status
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            padding: 12,
            backgroundColor: isPlaying ? "#d4edda" : "#f8d7da",
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
              color: isPlaying ? "#155724" : "#721c24",
            }}
          >
            🎵 Status: {isPlaying ? "Playing" : "Stopped"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={clearResults}
          style={{
            backgroundColor: "#6c757d",
            padding: 8,
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            🗑️ Clear Results
          </Text>
        </TouchableOpacity>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            Test Results:
          </Text>
          {testResults.length === 0 ? (
            <Text style={{ color: "#999", fontStyle: "italic" }}>
              No tests run yet. Use the buttons above to test.
            </Text>
          ) : (
            testResults.map((result, index) => (
              <Text
                key={index}
                style={{
                  fontSize: 12,
                  marginBottom: 4,
                  fontFamily: "monospace",
                }}
              >
                {result}
              </Text>
            ))
          )}
        </View>

        <View
          style={{ padding: 12, backgroundColor: "#f0f8ff", borderRadius: 6 }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
              color: "#0066cc",
            }}
          >
            💡 How to Test Background Audio:
          </Text>
          <Text style={{ fontSize: 12, color: "#0066cc", lineHeight: 18 }}>
            1. Tap "Play Sound" to test direct audio playback{"\n"}
            2. Tap "Test FCM Trigger" to simulate FCM notification{"\n"}
            3. Minimize the app while sound is playing{"\n"}
            4. Send a real FCM notification from backend{"\n"}
            5. Sound should continue playing even when app is minimized{"\n"}
            6. Check console logs for detailed information
          </Text>
        </View>

        <View
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#fff3cd",
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 8,
              color: "#856404",
            }}
          >
            🎯 Expected Behavior:
          </Text>
          <Text style={{ fontSize: 12, color: "#856404", lineHeight: 18 }}>
            • Sound should start immediately when triggered{"\n"}• Sound should
            continue playing when app is minimized{"\n"}• Sound should loop
            continuously until stopped{"\n"}• FCM notifications should trigger
            sound even in background{"\n"}• Console should show detailed logging
            for debugging
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
