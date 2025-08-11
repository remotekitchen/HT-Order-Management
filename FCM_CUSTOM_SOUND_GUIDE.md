# 🎵 FCM Custom Notification Sound Guide

## Overview

This guide explains how to configure FCM notifications to play your custom sound file (`order_sound.mp3`) instead of the device's default notification sound, even when the app is in the background.

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

## 💡 **Solution: Configure FCM for Custom Sounds**

### **Step 1: Convert Your Sound File**

Your current file: `assets/sound/order_sound.mp3`

**For Android**: Convert to WAV format

```bash
# Using ffmpeg (recommended)
ffmpeg -i assets/sound/order_sound.mp3 assets/sound/order_sound.wav

# Or use online converters
# https://convertio.co/mp3-wav/
# https://cloudconvert.com/mp3-to-wav
```

**For iOS**: MP3 or WAV both work

### **Step 2: Update App Configuration**

Your `app.json` has been updated with:

```json
{
  "android": {
    "notificationSounds": {
      "order_sound": "./assets/sound/order_sound.wav"
    },
    "notificationChannels": [
      {
        "id": "high_importance_channel",
        "name": "High Importance Notifications",
        "sound": "order_sound"
      }
    ]
  }
}
```

### **Step 3: Backend FCM Configuration**

Your backend needs to send FCM notifications with specific payload structure:

#### **Android FCM Payload**

```json
{
  "to": "FCM_TOKEN_HERE",
  "notification": {
    "title": "New Order Received!",
    "body": "Tiger Eats got a new order... Open the app to see details",
    "sound": "order_sound"
  },
  "android": {
    "notification": {
      "channel_id": "high_importance_channel",
      "sound": "order_sound",
      "priority": "high"
    }
  },
  "data": {
    "order_id": "12345",
    "type": "new_order"
  }
}
```

#### **iOS FCM Payload**

```json
{
  "to": "FCM_TOKEN_HERE",
  "notification": {
    "title": "New Order Received!",
    "body": "Tiger Eats got a new order... Open the app to see details",
    "sound": "order_sound.wav"
  },
  "apns": {
    "payload": {
      "aps": {
        "sound": "order_sound.wav",
        "badge": 1
      }
    }
  },
  "data": {
    "order_id": "12345",
    "type": "new_order"
  }
}
```

## 🔧 **Backend Implementation Examples**

### **Node.js Example**

```javascript
const admin = require("firebase-admin");

const message = {
  notification: {
    title: "New Order Received!",
    body: "Tiger Eats got a new order... Open the app to see details",
    sound: "order_sound",
  },
  android: {
    notification: {
      channelId: "high_importance_channel",
      sound: "order_sound",
      priority: "high",
    },
  },
  apns: {
    payload: {
      aps: {
        sound: "order_sound.wav",
        badge: 1,
      },
    },
  },
  data: {
    order_id: "12345",
    type: "new_order",
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

### **Python Example**

```python
import firebase_admin
from firebase_admin import messaging

message = messaging.Message(
    notification=messaging.Notification(
        title='New Order Received!',
        body='Tiger Eats got a new order... Open the app to see details'
    ),
    android=messaging.AndroidConfig(
        notification=messaging.AndroidNotification(
            channel_id='high_importance_channel',
            sound='order_sound',
            priority='high'
        )
    ),
    apns=messaging.APNSConfig(
        payload=messaging.APNSPayload(
            aps=messaging.Aps(
                sound='order_sound.wav',
                badge=1
            )
        )
    ),
    data={
        'order_id': '12345',
        'type': 'new_order'
    },
    token='USER_FCM_TOKEN_HERE'
)

response = messaging.send(message)
print('Successfully sent message:', response)
```

## 📱 **Testing Custom Sounds**

### **1. Test with Background Audio Tester**

- Open your app
- Go to **Background Audio Tester**
- Test "Test FCM Trigger" button
- Sound should play when app is active

### **2. Test Real FCM Notifications**

1. **Minimize your app** (put it in background)
2. **Send FCM notification** from backend with custom sound
3. **Listen for custom sound** instead of default
4. **Bring app to foreground** to see if sound continues

### **3. Expected Behavior**

- **App Open**: Custom sound plays via JavaScript
- **App Minimized**: Custom sound plays via system notification
- **App Killed**: Custom sound plays via system notification

## 🚨 **Common Issues & Solutions**

### **Issue 1: Still Hearing Default Sound**

**Solution**: Check FCM payload structure

- Ensure `sound` field is set correctly
- Verify `channel_id` matches your app configuration
- Check that sound file path is correct

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
- [ ] Update backend FCM payload to include custom sound
- [ ] Test with app in foreground
- [ ] Test with app in background
- [ ] Test with app killed
- [ ] Verify custom sound plays on both platforms

## 🔗 **Related Files**

- `assets/sound/order_sound.wav` - Custom notification sound
- `app.json` - App configuration with notification sounds
- `utils/fcm.ts` - FCM message handling
- `utils/backgroundAudioService.ts` - Background audio service

## 📞 **Support**

If you encounter issues:

1. Check FCM payload structure
2. Verify sound file format and placement
3. Test on different devices/platforms
4. Check console logs for FCM processing
5. Ensure backend is sending correct notification format

---

**Remember**: Custom notification sounds only work at the system level when the app is in the background. For true background audio playback, you need the app to be active.
