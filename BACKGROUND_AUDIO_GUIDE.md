# 🎵 Background Audio System Guide

## Overview

This guide explains how the background audio system works to ensure FCM notifications can trigger sound playback even when your app is minimized or in the background.

## 🚀 How It Works

### 1. **Background Audio Service** (`utils/backgroundAudioService.ts`)

- **Audio Mode Configuration**: Sets `staysActiveInBackground: true` to keep audio playing when app is minimized
- **App State Monitoring**: Listens for app state changes (foreground/background) to handle audio transitions
- **FCM Integration**: Provides `handleFCMOrderSound()` function specifically for FCM-triggered audio

### 2. **FCM Integration** (`utils/fcm.ts`)

- **Background Messages**: Uses `setBackgroundMessageHandler` to process notifications when app is minimized
- **Foreground Messages**: Uses `onMessage` to handle notifications when app is open
- **Sound Triggering**: Automatically calls `handleFCMOrderSound()` when "New Order Received!" notifications are detected

### 3. **App Lifecycle Management** (`app/_layout.tsx`)

- **Initialization**: Sets up background audio service when app starts
- **Audio Setup**: Configures notification sounds and background audio capabilities

## 🔧 Key Features

### ✅ **Background Audio Support**

- Sound continues playing when app is minimized
- Audio mode configured for background playback
- App state change handling for seamless transitions

### ✅ **FCM Integration**

- Automatic sound triggering on specific notification titles
- Works in both foreground and background states
- Fallback mechanisms for reliability

### ✅ **Smart Resume Logic**

- Tracks when sound should resume after app becomes active
- Handles app lifecycle changes gracefully
- Prevents duplicate audio playback

## 🧪 Testing the System

### **1. Background Audio Tester**

Navigate to **Background Audio Tester** in your sidebar to test:

- Direct sound playback
- FCM sound triggering simulation
- Audio status monitoring
- Background playback verification

### **2. Real FCM Testing**

1. **Start the app** and ensure it's running
2. **Minimize the app** (put it in background)
3. **Send FCM notification** from your backend with title "New Order Received!"
4. **Check if sound plays** even when app is minimized
5. **Bring app to foreground** to see if sound continues

### **3. Console Logging**

Monitor console logs for detailed information:

```
🎵 FCM order sound triggered - starting background audio...
✅ FCM order sound started successfully
🎵 Background sound status: { isPlaying: true, position: 0, isLooping: true }
```

## 📱 App Configuration

### **Android Permissions** (already configured in `app.json`)

```json
"permissions": [
  "INTERNET",
  "NOTIFICATIONS",
  "FOREGROUND_SERVICE",
  "WAKE_LOCK",
  "POST_NOTIFICATIONS"
]
```

### **iOS Background Modes** (already configured in `app.json`)

```json
"UIBackgroundModes": ["audio", "fetch", "remote-notification"]
```

### **Notification Channels** (Android)

- High importance channel with sound, vibration, and lights
- Configured for order notifications

## 🎯 Expected Behavior

### **When FCM Notification Arrives:**

1. **App Open**: Sound starts immediately and loops continuously
2. **App Minimized**: Sound starts and continues playing in background
3. **App Killed**: Notification sound plays (system-level)

### **Sound Characteristics:**

- **Format**: MP3 file from `assets/sound/order_sound.mp3`
- **Looping**: Continuous playback until manually stopped
- **Volume**: Full volume (1.0)
- **Background**: Continues when app is minimized

## 🔍 Troubleshooting

### **Sound Not Playing in Background:**

1. Check if `staysActiveInBackground: true` is set
2. Verify Android permissions are granted
3. Ensure notification channel is properly configured
4. Check console logs for initialization errors

### **FCM Not Triggering Sound:**

1. Verify notification title contains "New Order Received!" or similar
2. Check if background message handler is registered
3. Monitor console logs for FCM processing
4. Test with Background Audio Tester first

### **Audio Quality Issues:**

1. Ensure sound file is properly formatted (MP3)
2. Check audio mode configuration
3. Verify device volume settings
4. Test on different devices/OS versions

## 🚨 Important Notes

### **Limitations:**

- **iOS**: Background audio may be limited by system policies
- **Android**: Battery optimization may affect background playback
- **Device**: Some devices may have additional restrictions

### **Best Practices:**

- Test on real devices (not just simulators)
- Verify permissions are granted by user
- Monitor battery usage and performance
- Handle audio interruptions gracefully

## 📋 Testing Checklist

- [ ] Background Audio Tester works in foreground
- [ ] Sound continues when app is minimized
- [ ] FCM notification triggers sound in background
- [ ] Sound resumes when app becomes active
- [ ] Console shows proper logging
- [ ] No duplicate audio playback
- [ ] Sound stops when manually triggered
- [ ] Works on both iOS and Android

## 🔗 Related Files

- `utils/backgroundAudioService.ts` - Core background audio logic
- `utils/fcm.ts` - FCM message handling and sound triggering
- `app/_layout.tsx` - App initialization and audio setup
- `components/BackgroundAudioTester.tsx` - Testing interface
- `app.json` - Platform-specific configurations

## 📞 Support

If you encounter issues:

1. Check console logs for error messages
2. Verify all configurations are correct
3. Test with Background Audio Tester first
4. Ensure device permissions are granted
5. Test on different devices/OS versions

---

**Remember**: Background audio behavior can vary between devices and OS versions. Always test on real devices for production use.
