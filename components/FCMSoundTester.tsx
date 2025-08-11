import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  getLastFCMTriggerInfo,
  triggerOrderSound,
  wasOrderSoundTriggered,
} from "../utils/orderSoundManager";

export default function FCMSoundTester() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const testTriggerOrderSound = () => {
    try {
      addResult("🎵 Testing triggerOrderSound...");
      triggerOrderSound();
      addResult("✅ triggerOrderSound called successfully");

      // Check if the flag was set
      setTimeout(() => {
        const wasTriggered = wasOrderSoundTriggered();
        addResult(`🔍 wasOrderSoundTriggered result: ${wasTriggered}`);
      }, 100);
    } catch (error: any) {
      addResult(`❌ Error: ${error?.message || "Unknown error"}`);
    }
  };

  const testWasOrderSoundTriggered = () => {
    try {
      const wasTriggered = wasOrderSoundTriggered();
      const triggerInfo = getLastFCMTriggerInfo();
      addResult(`🔍 wasOrderSoundTriggered result: ${wasTriggered}`);
      addResult(`📊 Trigger info: ${JSON.stringify(triggerInfo, null, 2)}`);
    } catch (error: any) {
      addResult(`❌ Error: ${error?.message || "Unknown error"}`);
    }
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
          🎵 FCM Sound Tester
        </Text>

        <Text
          style={{
            fontSize: 14,
            marginBottom: 16,
            textAlign: "center",
            color: "#666",
          }}
        >
          Test the FCM sound triggering mechanism
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={testTriggerOrderSound}
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
              🚀 Test Trigger Sound
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testWasOrderSoundTriggered}
            style={{
              backgroundColor: "#007AFF",
              padding: 12,
              borderRadius: 6,
              flex: 1,
              marginLeft: 8,
            }}
          >
            <Text
              style={{ color: "white", textAlign: "center", fontWeight: "600" }}
            >
              🔍 Check Triggered
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={clearResults}
          style={{
            backgroundColor: "#FF3B30",
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
            💡 How to Test:
          </Text>
          <Text style={{ fontSize: 12, color: "#0066cc", lineHeight: 18 }}>
            1. Tap "Test Trigger Sound" to simulate FCM notification{"\n"}
            2. Check if your order sound starts playing{"\n"}
            3. Use "Check Triggered" to verify the flag was set{"\n"}
            4. The sound should continue until manually stopped{"\n"}
            5. Check console logs for detailed information
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
            loop every 2 seconds{"\n"}• Sound should continue until manually
            stopped{"\n"}• Console should show detailed logging{"\n"}• This
            simulates what happens with real FCM notifications
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
