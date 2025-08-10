import { useLoginMutation } from "@/redux/feature/authentication/authenticationApi";

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
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [login, { isLoading }] = useLoginMutation();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (validate()) {
      try {
        const result = await login({ email, password }).unwrap();
        // Auth data is automatically stored by the API slice
        // No need to manually dispatch or store here
      } catch (error) {
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
              className="w-full h-14 bg-blue-500 rounded-xl justify-center items-center"
              onPress={onSubmit}
              disabled={isLoading}
            >
              <Text className="text-white text-lg font-bold">
                {isLoading ? "Loading..." : "Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
