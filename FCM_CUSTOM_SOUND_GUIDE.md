# 🎵 FCM Custom Notification Sound Guide

## Overview

This guide explains how to configure FCM notifications to play your custom sound file (`order_sound.wav`) instead of the device's default notification sound, even when the app is in the background.

## 🚨 **Current Issue Identified**

Your backend is currently sending FCM notifications with this structure:

```json
{
  "from": "290554369819",
  "messageId": "d0db5292-9f91-4ff2-b634-14caddfc4681",
  "data": {
    "sound": "order_sound", // ❌ WRONG: Sound in data section
    "order_id": "28581",
    "title": "New Order Placed",
    "body": "Order #28581 was just placed."
  }
}
```

**Problem**: The `sound` field is in the `data` section, which means:

- Custom sound will NOT play when app is in background
- Only device default sound will play
- Custom sound only works when app is in foreground

## 💡 **Solution: Move Sound to Notification Section**

### **Correct FCM Payload Structure**

#### **For Android (Primary Fix)**

```json
{
  "to": "FCM_TOKEN_HERE",
  "notification": {
    "title": "New Order Placed",
    "body": "Order #28581 was just placed.",
    "sound": "order_sound" // ✅ CORRECT: Sound in notification section
  },
  "android": {
    "notification": {
      "channel_id": "high_importance_channel",
      "sound": "order_sound", // ✅ CORRECT: Android-specific sound
      "priority": "high"
    }
  },
  "data": {
    "order_id": "28581",
    "image_url": "",
    "badge_count": "1",
    "id": "28581",
    "screen": "OrderDetails",
    "click_action": "https://www.hungry-tiger.com/",
    "campaign_category": "orders",
    "campaign_is_active": "true",
    "restaurant_name": "Tiger Eats",
    "icon": "https://www.example.com/icon.png",
    "image": "https://www.example.com/image.jpg",
    "badge": "https://www.example.com/badge.png"
  }
}
```

#### **For iOS (Additional Fix)**

```json
{
  "to": "FCM_TOKEN_HERE",
  "notification": {
    "title": "New Order Placed",
    "body": "Order #28581 was just placed.",
    "sound": "order_sound.wav" // ✅ CORRECT: Sound in notification section
  },
  "apns": {
    "payload": {
      "aps": {
        "sound": "order_sound.wav", // ✅ CORRECT: iOS-specific sound
        "badge": 1
      }
    }
  },
  "data": {
    "order_id": "28581",
    "image_url": "",
    "badge_count": "1",
    "id": "28581",
    "screen": "OrderDetails",
    "click_action": "https://www.hungry-tiger.com/",
    "campaign_category": "orders",
    "campaign_is_active": "true",
    "restaurant_name": "Tiger Eats",
    "icon": "https://www.example.com/icon.png",
    "image": "https://www.example.com/image.jpg",
    "badge": "https://www.example.com/badge.png"
  }
}
```

## 🔧 **Backend Implementation Examples**

### **Node.js Example (Updated)**

```javascript
const admin = require("firebase-admin");

const message = {
  notification: {
    title: "New Order Placed",
    body: "Order #28581 was just placed.",
    sound: "order_sound", // ✅ Sound in notification section
  },
  android: {
    notification: {
      channelId: "high_importance_channel",
      sound: "order_sound", // ✅ Android-specific sound
      priority: "high",
    },
  },
  apns: {
    payload: {
      aps: {
        sound: "order_sound.wav", // ✅ iOS-specific sound
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
  token: "USER_FCM_TOKEN_HERE",
};

admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.log("Error sending message:", error);
  });
```

### **Python Example (Updated)**

```python
import firebase_admin
from firebase_admin import messaging

message = messaging.Message(
    notification=messaging.Notification(
        title='New Order Placed',
        body='Order #28581 was just placed.',
        sound='order_sound'  # ✅ Sound in notification section
    ),
    android=messaging.AndroidConfig(
        notification=messaging.AndroidNotification(
            channel_id='high_importance_channel',
            sound='order_sound',  # ✅ Android-specific sound
            priority='high'
        )
    ),
    apns=messaging.APNSConfig(
        payload=messaging.APNSPayload(
            aps=messaging.Aps(
                sound='order_sound.wav',  # ✅ iOS-specific sound
                badge=1
            )
        )
    ),
    data={
        'order_id': '28581',
        'image_url': '',
        'badge_count': '1',
        'id': '28581',
        'screen': 'OrderDetails',
        'click_action': 'https://www.hungry-tiger.com/',
        'campaign_category': 'orders',
        'campaign_is_active': 'true',
        'restaurant_name': 'Tiger Eats',
        'icon': 'https://www.example.com/icon.png',
        'image': 'https://www.example.com/image.jpg',
        'badge': 'https://www.example.com/badge.png'
    },
    token='USER_FCM_TOKEN_HERE'
)

response = messaging.send(message)
print('Successfully sent message:', response)
```

## 🚨 **Important Limitations**

### **Background App Behavior**

- **App in Foreground**: Custom sound can play via JavaScript
- **App in Background**: Only system-level notification sounds can play
- **App Killed**: Only system-level notification sounds can play

### **Why Custom Sounds Don't Work in Background**

When your app is minimized:

- JavaScript code cannot execute
- Audio libraries cannot run
- Only the operating system can play notification sounds

## 📱 **Testing Custom Sounds**

### **1. Test with Background Audio Tester**

- Open your app
- Go to **Background Audio Tester**
- Test "Test FCM Trigger" button
- Sound should play when app is active

### **2. Test Real FCM Notifications**

1. **Minimize your app** (put it in background)
2. **Send FCM notification** from backend with custom sound in notification section
3. **Listen for custom sound** instead of default
4. **Bring app to foreground** to see if sound continues

### **3. Expected Behavior**

- **App Open**: Custom sound plays via JavaScript
- **App Minimized**: Custom sound plays via system notification
- **App Killed**: Custom sound plays via system notification

## 🚨 **Common Issues & Solutions**

### **Issue 1: Still Hearing Default Sound**

**Solution**: Check FCM payload structure

- ✅ Ensure `sound` field is in `notification` section
- ✅ Verify `channel_id` matches your app configuration
- ✅ Check that sound file path is correct

### **Issue 2: Sound File Not Found**

**Solution**: Verify file placement

- Ensure `order_sound.wav` exists in `assets/sound/`
- Check file permissions
- Verify file format (WAV for Android, MP3/WAV for iOS)

### **Issue 3: Different Sounds on Different Devices**

**Solution**: Test on multiple devices

- Different Android versions may behave differently
- iOS and Android handle sounds differently
- Some devices may ignore custom sounds

## 📋 **Checklist for Implementation**

- [ ] Convert `order_sound.mp3` to `order_sound.wav`
- [ ] Place `order_sound.wav` in `assets/sound/` directory
- [ ] Update `app.json` with notification sounds configuration
- [ ] **CRITICAL**: Update backend FCM payload to include sound in notification section
- [ ] Test with app in foreground
- [ ] Test with app in background
- [ ] Test with app killed
- [ ] Verify custom sound plays on both platforms

## 🔗 **Related Files**

- `assets/sound/order_sound.wav` - Custom notification sound
- `app.json` - App configuration with notification sounds
- `utils/fcm.ts` - FCM message handling (updated with better logging)
- `utils/backgroundAudioService.ts` - Background audio service

## 📞 **Support**

If you encounter issues:

1. **Check FCM payload structure** - Sound must be in notification section
2. Verify sound file format and placement
3. Test on different devices/platforms
4. Check console logs for FCM processing
5. Ensure backend is sending correct notification format

---

**Remember**: Custom notification sounds only work at the system level when the app is in the background. For true background audio playback, you need the app to be active.

**Key Fix**: Move `"sound": "order_sound"` from `data` section to `notification` section in your FCM payload!
