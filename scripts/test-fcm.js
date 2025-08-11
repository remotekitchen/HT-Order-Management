#!/usr/bin/env node

/**
 * FCM Configuration Test Script
 * Run this to verify your Firebase FCM setup
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 FCM Configuration Test\n");

// Check 1: google-services.json exists
const googleServicesPath = path.join(__dirname, "..", "google-services.json");
if (fs.existsSync(googleServicesPath)) {
  console.log("✅ google-services.json found");

  try {
    const googleServices = JSON.parse(
      fs.readFileSync(googleServicesPath, "utf8")
    );

    // Check 2: Has correct package name
    const hasCorrectPackage = googleServices.client?.some(
      (client) =>
        client.client_info?.android_client_info?.package_name ===
        "com.chatchefs.ordermanagement"
    );

    if (hasCorrectPackage) {
      console.log("✅ Package name com.chatchefs.ordermanagement found");

      // Check 3: Has firebase_messaging service
      const correctClient = googleServices.client.find(
        (client) =>
          client.client_info?.android_client_info?.package_name ===
          "com.chatchefs.ordermanagement"
      );

      if (correctClient?.services?.firebase_messaging) {
        console.log("✅ firebase_messaging service configured");
      } else {
        console.log(
          "❌ firebase_messaging service missing - this will prevent FCM from working!"
        );
        console.log(
          "   You need to add this service in Firebase Console or regenerate google-services.json"
        );
      }
    } else {
      console.log(
        "❌ Package name com.chatchefs.ordermanagement not found in google-services.json"
      );
    }

    // Check 4: Has project info
    if (googleServices.project_info?.project_id) {
      console.log(
        `✅ Firebase project: ${googleServices.project_info.project_id}`
      );
    } else {
      console.log("❌ Missing project info in google-services.json");
    }
  } catch (error) {
    console.log("❌ Error parsing google-services.json:", error.message);
  }
} else {
  console.log("❌ google-services.json not found");
}

// Check 5: app.json has Firebase plugins
const appJsonPath = path.join(__dirname, "..", "app.json");
if (fs.existsSync(appJsonPath)) {
  console.log("✅ app.json found");

  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

    if (appJson.expo?.plugins?.includes("@react-native-firebase/app")) {
      console.log("✅ @react-native-firebase/app plugin configured");
    } else {
      console.log("❌ @react-native-firebase/app plugin missing");
    }

    if (appJson.expo?.plugins?.includes("@react-native-firebase/messaging")) {
      console.log("✅ @react-native-firebase/messaging plugin configured");
    } else {
      console.log("❌ @react-native-firebase/messaging plugin missing");
    }

    // Check package name
    if (appJson.expo?.android?.package === "com.chatchefs.ordermanagement") {
      console.log("✅ Android package name matches");
    } else {
      console.log("❌ Android package name mismatch");
    }

    if (
      appJson.expo?.ios?.bundleIdentifier === "com.chatchefs.ordermanagement"
    ) {
      console.log("✅ iOS bundle identifier matches");
    } else {
      console.log("❌ iOS bundle identifier mismatch");
    }
  } catch (error) {
    console.log("❌ Error parsing app.json:", error.message);
  }
} else {
  console.log("❌ app.json not found");
}

// Check 6: package.json has Firebase dependencies
const packageJsonPath = path.join(__dirname, "..", "package.json");
if (fs.existsSync(packageJsonPath)) {
  console.log("✅ package.json found");

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    if (packageJson.dependencies["@react-native-firebase/app"]) {
      console.log("✅ @react-native-firebase/app dependency installed");
    } else {
      console.log("❌ @react-native-firebase/app dependency missing");
    }

    if (packageJson.dependencies["@react-native-firebase/messaging"]) {
      console.log("✅ @react-native-firebase/messaging dependency installed");
    } else {
      console.log("❌ @react-native-firebase/messaging dependency missing");
    }
  } catch (error) {
    console.log("❌ Error parsing package.json:", error.message);
  }
} else {
  console.log("❌ package.json not found");
}

console.log("\n📋 Summary:");
console.log(
  "If you see any ❌ errors above, those need to be fixed for FCM to work."
);
console.log("The most common issues are:");
console.log("1. Missing firebase_messaging service in google-services.json");
console.log(
  "2. Package name mismatches between app.json and google-services.json"
);
console.log("3. Missing Firebase plugins in app.json");
console.log("4. Missing Firebase dependencies in package.json");
console.log(
  "\n🚀 After fixing any issues, rebuild your app and test FCM registration."
);
