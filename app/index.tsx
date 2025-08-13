import { useLoginMutation } from "@/redux/feature/authentication/authenticationApi";

import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { requestAllPermissions } from "@/utils/requestPermissions";
import * as Updates from "expo-updates";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fcmToken, setFcmToken] = useState<string>("");
  const [isGettingFcmToken, setIsGettingFcmToken] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    fcm_token?: string;
  }>({});
  const [login, { isLoading }] = useLoginMutation();

  // Get FCM token on component mount
  useEffect(() => {
    getFcmToken();
  }, []);

  const getFcmToken = async () => {
    try {
      setIsGettingFcmToken(true);
      const token = await registerForPushNotificationsAsync();
      setFcmToken(token);
    } catch (error) {
      console.error("❌ Failed to get FCM token:", error);
      setErrors((prev) => ({ ...prev, fcm_token: "Failed to get FCM token" }));
    } finally {
      setIsGettingFcmToken(false);
    }
  };

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
      fcm_token?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = "Invalid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!fcmToken) {
      newErrors.fcm_token = "Missing FCM token";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (validate()) {
      // Log the login payload
      const loginPayload = {
        email,
        password,
        fcm_token: fcmToken,
      };

      try {
        const result = await login(loginPayload).unwrap();
        // Auth data is automatically stored by the API slice
        // No need to manually dispatch or store here
      } catch (error) {
        console.error("❌ Login failed:", error);
        Toast.show({
          type: "error",
          text1: "Login Failed",
          // @ts-ignore
          text2: error?.data?.non_field_errors,
          position: "bottom",
        });
      }
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await Updates.reloadAsync();
    } catch (err) {
      Alert.alert("Restart Failed", "Something went wrong. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const askPermissions = async () => {
      const result = await requestAllPermissions();

      if ("error" in result) {
        Alert.alert("Permission Error", result.error);
      }
    };

    askPermissions();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1 justify-center items-center py-10">
          <View className="w-full max-w-lg bg-white p-6 rounded-xl lg:shadow-lg lg:rounded-2xl lg:px-10 lg:py-8">
            <Text className="text-3xl font-bold mb-10 text-neutral-900 text-center">
              Login
            </Text>

            {/* FCM Token Status */}
            <View className="mb-4 p-3 rounded-lg border border-gray-200 bg-gray-50">
              <Text className="text-sm text-gray-600 mb-2">
                FCM Token Status:
              </Text>
              {isGettingFcmToken ? (
                <Text className="text-blue-600 text-sm">
                  Getting FCM token...
                </Text>
              ) : fcmToken ? (
                <View className="flex-row items-center">
                  <Text className="text-green-600 text-sm mr-2">
                    ✅ Token Ready
                  </Text>
                  <TouchableOpacity
                    onPress={getFcmToken}
                    className="bg-blue-500 px-2 py-1 rounded"
                  >
                    <Text className="text-white text-xs">Refresh</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-red-600 text-sm mr-2">❌ No Token</Text>
                  <TouchableOpacity
                    onPress={getFcmToken}
                    className="bg-red-500 px-2 py-1 rounded"
                  >
                    <Text className="text-white text-xs">Retry</Text>
                  </TouchableOpacity>
                </View>
              )}
              {errors.fcm_token && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.fcm_token}
                </Text>
              )}
            </View>

            <View className="gap-y-2 mb-6">
              <TextInput
                className="w-full h-14 border border-gray-300 rounded-xl px-4 text-lg bg-white text-black mb-2"
                placeholder="Email"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              {errors.email ? (
                <Text className="text-red-600 ml-1 text-sm">
                  {errors.email}
                </Text>
              ) : null}
              {/* Password field with eye icon */}
              <View style={{ position: "relative" }}>
                <TextInput
                  className="w-full h-14 border border-gray-300 rounded-xl px-4 text-lg bg-white text-black"
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={{ paddingRight: 40 }}
                />
                <TouchableOpacity
                  style={{ position: "absolute", right: 16, top: 14 }}
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={10}
                >
                  {showPassword ? (
                    <EyeOff size={24} color="#222" />
                  ) : (
                    <Eye size={24} color="#222" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-red-600 ml-1 text-sm">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              className={`w-full h-14 rounded-xl justify-center items-center ${
                !fcmToken ? "bg-gray-400" : "bg-blue-500"
              }`}
              onPress={onSubmit}
              disabled={isLoading || !fcmToken}
            >
              <Text className="text-white text-lg font-bold">
                {isLoading
                  ? "Loading..."
                  : !fcmToken
                  ? "Missing FCM Token"
                  : "Login"}
              </Text>
            </TouchableOpacity>

            {!fcmToken && (
              <Text className="text-red-600 text-center mt-2 text-sm">
                Cannot login without FCM token. Please ensure notifications are
                enabled.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
