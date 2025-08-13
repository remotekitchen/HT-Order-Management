# 🚨 FCM Custom Sound Issue - FIX REQUIRED

## ❌ **Current Problem**

Your app is receiving FCM notifications but playing the **device default sound** instead of your custom `order_sound.wav` when the app is in the background.

## 🔍 **Root Cause Identified**

Your backend is sending FCM notifications with the **WRONG payload structure**:

### **Current Backend Payload (WRONG)**

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

- ✅ Custom sound works when app is **open/foreground**
- ❌ Custom sound **does NOT work** when app is **background/minimized**
- ❌ Only device default sound plays in background

## ✅ **Solution: Fix FCM Payload Structure**

### **Correct FCM Payload (FIXED)**

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

## 🔧 **What Your Backend Team Needs to Do**

### **1. Move Sound Field**

- ❌ Remove `"sound": "order_sound"` from `data` section
- ✅ Add `"sound": "order_sound"` to `notification` section

### **2. Add Platform-Specific Sound Configuration**

- **Android**: Add `android.notification.sound: "order_sound"`
- **iOS**: Add `apns.payload.aps.sound: "order_sound.wav"`

### **3. Update Notification Channel**

- Ensure `channel_id` matches your app configuration: `"high_importance_channel"`

## 📱 **Expected Behavior After Fix**

- **App Open/Foreground**: Custom sound plays via JavaScript ✅
- **App Background/Minimized**: Custom sound plays via system notification ✅
- **App Killed**: Custom sound plays via system notification ✅

## 🧪 **Testing the Fix**

### **Test 1: App in Foreground**

1. Open your app
2. Send FCM notification from backend
3. ✅ Should hear custom `order_sound.wav`

### **Test 2: App in Background**

1. Minimize your app (put in background)
2. Send FCM notification from backend
3. ✅ Should hear custom `order_sound.wav` (not device default)

### **Test 3: App Killed**

1. Force close your app completely
2. Send FCM notification from backend
3. ✅ Should hear custom `order_sound.wav` (not device default)

## 🚨 **Why This Happens**

### **Technical Explanation**

- **App Foreground**: JavaScript can execute and play custom sounds
- **App Background**: JavaScript cannot execute, only system can play sounds
- **System Sounds**: FCM must specify custom sounds in the `notification` section for the OS to recognize them

### **FCM Payload Rules**

- `data.sound`: Only accessible when app is running (foreground/background)
- `notification.sound`: Accessible by the operating system (works even when app is killed)

## 📋 **Implementation Checklist**

- [ ] **Backend**: Move `sound` field from `data` to `notification` section
- [ ] **Backend**: Add `android.notification.sound` for Android
- [ ] **Backend**: Add `apns.payload.aps.sound` for iOS
- [ ] **Backend**: Ensure `channel_id` matches app configuration
- [ ] **Test**: Verify custom sound works in foreground
- [ ] **Test**: Verify custom sound works in background
- [ ] **Test**: Verify custom sound works when app is killed

## 🔗 **Related Files**

- `FCM_CUSTOM_SOUND_GUIDE.md` - Detailed implementation guide
- `scripts/test-fcm-payload.js` - Test script to validate payloads
- `app.json` - App configuration (already correct)
- `assets/sound/order_sound.wav` - Custom sound file (already correct)

## 📞 **Support**

If you need help implementing this fix:

1. **Check the updated `FCM_CUSTOM_SOUND_GUIDE.md`** for detailed examples
2. **Run `node scripts/test-fcm-payload.js`** to test different payload structures
3. **Use the generated backend code** from the test script
4. **Test with app in different states** (foreground, background, killed)

---

## 🎯 **Summary**

**The issue is NOT with your app code or configuration.**
**The issue is with your backend FCM payload structure.**

**Fix**: Move `"sound": "order_sound"` from `data` section to `notification` section in your FCM payload.

**Result**: Custom notification sounds will work in all app states (foreground, background, and killed).

