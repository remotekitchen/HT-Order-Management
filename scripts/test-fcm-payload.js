#!/usr/bin/env node

/**
 * FCM Payload Test Script
 *
 * This script helps test and validate FCM notification payloads
 * to ensure custom sounds work properly.
 */

const testPayloads = {
  // ❌ WRONG: Current backend payload (sound in data section)
  wrong: {
    from: "290554369819",
    messageId: "d0db5292-9f91-4ff2-b634-14caddfc4681",
    data: {
      sound: "order_sound", // ❌ WRONG: Sound in data section
      order_id: "28581",
      image_url: "",
      badge_count: "1",
      id: "28581",
      screen: "OrderDetails",
      click_action: "https://www.hungry-tiger.com/",
      campaign_category: "orders",
      campaign_is_active: "true",
      restaurant_name: "Tiger Eats",
      title: "New Order Placed",
      body: "Order #28581 was just placed.",
      icon: "https://www.example.com/icon.png",
      image: "https://www.example.com/image.jpg",
      badge: "https://www.example.com/badge.png",
    },
  },

  // ✅ CORRECT: Fixed payload for Android (sound in notification section)
  correctAndroid: {
    to: "FCM_TOKEN_HERE",
    notification: {
      title: "New Order Placed",
      body: "Order #28581 was just placed.",
      sound: "order_sound", // ✅ CORRECT: Sound in notification section
    },
    android: {
      notification: {
        channel_id: "high_importance_channel",
        sound: "order_sound", // ✅ CORRECT: Android-specific sound
        priority: "high",
      },
    },
    data: {
      order_id: "28581",
      image_url: "",
      badge_count: "1",
      id: "28581",
      screen: "OrderDetails",
      click_action: "https://www.hungry-tiger.com/",
      campaign_category: "orders",
      campaign_is_active: "true",
      restaurant_name: "Tiger Eats",
      icon: "https://www.example.com/icon.png",
      image: "https://www.example.com/image.jpg",
      badge: "https://www.example.com/badge.png",
    },
  },

  // ✅ CORRECT: Fixed payload for iOS (sound in notification section)
  correctIOS: {
    to: "FCM_TOKEN_HERE",
    notification: {
      title: "New Order Placed",
      body: "Order #28581 was just placed.",
      sound: "order_sound.wav", // ✅ CORRECT: Sound in notification section
    },
    apns: {
      payload: {
        aps: {
          sound: "order_sound.wav", // ✅ CORRECT: iOS-specific sound
          badge: 1,
        },
      },
    },
    data: {
      order_id: "28581",
      image_url: "",
      badge_count: "1",
      id: "28581",
      screen: "OrderDetails",
      click_action: "https://www.hungry-tiger.com/",
      campaign_category: "orders",
      campaign_is_active: "true",
      restaurant_name: "Tiger Eats",
      icon: "https://www.example.com/icon.png",
      image: "https://www.example.com/image.jpg",
      badge: "https://www.example.com/badge.png",
    },
  },

  // ✅ CORRECT: Universal payload for both platforms
  correctUniversal: {
    to: "FCM_TOKEN_HERE",
    notification: {
      title: "New Order Placed",
      body: "Order #28581 was just placed.",
      sound: "order_sound", // ✅ CORRECT: Sound in notification section
    },
    android: {
      notification: {
        channel_id: "high_importance_channel",
        sound: "order_sound", // ✅ CORRECT: Android-specific sound
        priority: "high",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "order_sound.wav", // ✅ CORRECT: iOS-specific sound
          badge: 1,
        },
      },
    },
    data: {
      order_id: "28581",
      image_url: "",
      badge_count: "1",
      id: "28581",
      screen: "OrderDetails",
      click_action: "https://www.hungry-tiger.com/",
      campaign_category: "orders",
      campaign_is_active: "true",
      restaurant_name: "Tiger Eats",
      icon: "https://www.example.com/icon.png",
      image: "https://www.example.com/image.jpg",
      badge: "https://www.example.com/badge.png",
    },
  },
};

function analyzePayload(payload, name) {
  console.log(`\n🔍 Analyzing: ${name}`);
  console.log("=".repeat(50));

  const hasNotificationSound = payload.notification?.sound;
  const hasDataSound = payload.data?.sound;
  const hasAndroidSound = payload.android?.notification?.sound;
  const hasIOSSound = payload.apns?.payload?.aps?.sound;

  console.log(
    "✅ Notification section sound:",
    hasNotificationSound || "❌ MISSING"
  );
  console.log("⚠️  Data section sound:", hasDataSound || "❌ MISSING");
  console.log("🤖 Android sound:", hasAndroidSound || "❌ MISSING");
  console.log("🍎 iOS sound:", hasIOSSound || "❌ MISSING");

  if (hasNotificationSound) {
    console.log("🎉 CUSTOM SOUND WILL WORK in background!");
  } else if (hasDataSound) {
    console.log(
      "❌ Custom sound will NOT work in background (only in foreground)"
    );
    console.log("💡 Move sound from data to notification section");
  } else {
    console.log("❌ No custom sound configured - will use device default");
  }

  return {
    willWorkInBackground: !!hasNotificationSound,
    hasDataSound: !!hasDataSound,
    hasAndroidSound: !!hasAndroidSound,
    hasIOSSound: !!hasIOSSound,
  };
}

function generateBackendCode(payload, language = "javascript") {
  console.log(`\n💻 Backend Code (${language}):`);
  console.log("=".repeat(50));

  if (language === "javascript") {
    console.log(`
const message = {
  notification: {
    title: "${payload.notification?.title || ""}",
    body: "${payload.notification?.body || ""}",
    sound: "${payload.notification?.sound || ""}"
  },
  android: {
    notification: {
      channelId: "${payload.android?.notification?.channel_id || ""}",
      sound: "${payload.android?.notification?.sound || ""}",
      priority: "high"
    }
  },
  apns: {
    payload: {
      aps: {
        sound: "${payload.apns?.payload?.aps?.sound || ""}",
        badge: 1
      }
    }
  },
  data: ${JSON.stringify(payload.data, null, 4)},
  token: "USER_FCM_TOKEN_HERE"
};

admin.messaging().send(message)
  .then(response => console.log("Success:", response))
  .catch(error => console.error("Error:", error));
`);
  } else if (language === "python") {
    console.log(`
message = messaging.Message(
    notification=messaging.Notification(
        title='${payload.notification?.title || ""}',
        body='${payload.notification?.body || ""}',
        sound='${payload.notification?.sound || ""}'
    ),
    android=messaging.AndroidConfig(
        notification=messaging.AndroidNotification(
            channel_id='${payload.android?.notification?.channel_id || ""}',
            sound='${payload.android?.notification?.sound || ""}',
            priority='high'
        )
    ),
    apns=messaging.APNSConfig(
        payload=messaging.APNSPayload(
            aps=messaging.Aps(
                sound='${payload.apns?.payload?.aps?.sound || ""}',
                badge=1
            )
        )
    ),
    data=${JSON.stringify(payload.data, null, 4)},
    token='USER_FCM_TOKEN_HERE'
)

response = messaging.send(message)
print('Success:', response)
`);
  }
}

function main() {
  console.log("🎵 FCM Payload Test Script");
  console.log("This script analyzes FCM payloads for custom sound support");

  // Analyze all payloads
  const results = {};
  results.wrong = analyzePayload(
    testPayloads.wrong,
    "❌ Current Backend Payload (WRONG)"
  );
  results.correctAndroid = analyzePayload(
    testPayloads.correctAndroid,
    "✅ Fixed Android Payload"
  );
  results.correctIOS = analyzePayload(
    testPayloads.correctIOS,
    "✅ Fixed iOS Payload"
  );
  results.correctUniversal = analyzePayload(
    testPayloads.correctUniversal,
    "✅ Universal Payload (Both Platforms)"
  );

  // Summary
  console.log("\n📊 SUMMARY:");
  console.log("=".repeat(50));
  Object.entries(results).forEach(([key, result]) => {
    const status = result.willWorkInBackground
      ? "✅ WILL WORK"
      : "❌ WON'T WORK";
    console.log(`${key}: ${status} in background`);
  });

  // Generate backend code for the correct universal payload
  generateBackendCode(testPayloads.correctUniversal, "javascript");
  generateBackendCode(testPayloads.correctUniversal, "python");

  console.log("\n🎯 NEXT STEPS:");
  console.log("1. Update your backend to use the correct payload structure");
  console.log("2. Move 'sound' field from 'data' to 'notification' section");
  console.log("3. Test with app in background to verify custom sound works");
  console.log(
    "4. Check the updated FCM_CUSTOM_SOUND_GUIDE.md for detailed instructions"
  );
}

if (require.main === module) {
  main();
}

module.exports = { testPayloads, analyzePayload, generateBackendCode };

