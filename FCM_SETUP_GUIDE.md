# 🔥 Firebase Cloud Messaging (FCM) Setup Guide

## Overview

This guide explains how Firebase Cloud Messaging is configured in your Order Management app and how to troubleshoot common issues.

## 🚀 What's Been Set Up

### 1. Enhanced FCM Utility (`utils/fcm.ts`)

- ✅ Comprehensive error handling and logging
- ✅ Permission requests for iOS and Android 13+
- ✅ Device registration with FCM
- ✅ Token retrieval and refresh handling
- ✅ Background and foreground message handlers
- ✅ Detailed console logging for debugging

### 2. FCM Debugger Component (`components/FCMDebugger.tsx`)

- ✅ Real-time FCM status display
- ✅ Manual FCM registration testing
- ✅ Token display and validation
- ✅ Error reporting and troubleshooting tips

### 3. Firebase Configuration (`utils/firebase.ts`)

- ✅ Firebase initialization checks
- ✅ Status monitoring utilities

### 4. Integration Points

- ✅ App startup FCM registration (`app/_layout.tsx`)
- ✅ Sidebar menu access to FCM Debugger
- ✅ Automatic token logging and alerts

## 🔧 How to Use

### Access FCM Debugger

1. Open the app
2. Tap the menu button (hamburger icon)
3. Select "FCM Debugger" from the sidebar
4. Use the buttons to check status and register FCM

### Check Console Logs

The app now provides extensive console logging:

- 🚀 FCM registration steps
- 📱 Device and permission status
- 🎯 Token retrieval process
- ❌ Any errors that occur

## 🚨 Common Issues & Solutions

### Issue 1: "Firebase not initialized"

**Symptoms:** Error message about Firebase not being initialized
**Solutions:**

- Ensure you're running on a physical device (not simulator)
- Verify `google-services.json` is in the root directory
- Check that Firebase plugins are properly configured in `app.json`

### Issue 2: "Permission not granted"

**Symptoms:** Permission denied errors
**Solutions:**

- On iOS: Go to Settings > Notifications > Your App > Enable
- On Android 13+: Grant notification permission when prompted
- Restart the app after granting permissions

### Issue 3: "No FCM token received"

**Symptoms:** Registration succeeds but no token
**Solutions:**

- Check Firebase Console has Cloud Messaging enabled
- Verify `google-services.json` has correct package name
- Ensure device has internet connection
- Check console for detailed error messages

### Issue 4: Package Name Mismatch

**Symptoms:** FCM registration fails silently
**Solutions:**

- Verify `app.json` package name matches `google-services.json`
- Current package: `com.chatchefs.ordermanagement`
- Check Firebase Console project settings

## 📱 Testing FCM

### 1. Send Test Message

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Messaging > Send your first message
4. Send to your FCM token (shown in console/debugger)

### 2. Verify Receipt

- Check console for message logs
- Verify foreground/background handlers are called
- Test with app in different states (foreground, background, killed)

## 🔍 Debugging Steps

### Step 1: Check Console Logs

Look for these log patterns:

```
🚀 Starting FCM registration...
📱 Device check passed, proceeding with permissions...
🍎 Requesting iOS notification permission...
🔧 Registering device for remote messages...
🎯 Getting FCM token...
🎉 SUCCESS! FCM token retrieved:
```

### Step 2: Use FCM Debugger

- Check all status indicators
- Try manual registration
- Look for specific error messages

### Step 3: Verify Configuration

- `google-services.json` exists and has correct package
- `app.json` has Firebase plugins configured
- Device is physical (not simulator)
- App has notification permissions

## 📋 Required Files Checklist

- [ ] `google-services.json` (Android)
- [ ] `GoogleService-Info.plist` (iOS)
- [ ] Firebase plugins in `app.json`
- [ ] `@react-native-firebase/messaging` dependency
- [ ] Physical device for testing

## 🎯 Expected Behavior

### On App Start:

1. Console shows FCM initialization logs
2. Permission requests appear (if needed)
3. FCM token is retrieved and logged
4. Success alert shows token preview
5. Token is available for backend use

### In FCM Debugger:

1. All status indicators show current state
2. Manual registration works
3. Token is displayed and accessible
4. Error messages are clear and actionable

## 🆘 Getting Help

If you're still having issues:

1. **Check Console Logs First** - Most issues are logged with detailed information
2. **Use FCM Debugger** - Provides real-time status and manual testing
3. **Verify Configuration** - Ensure all required files are present and correct
4. **Test on Physical Device** - Simulators don't support FCM
5. **Check Firebase Console** - Verify project settings and Cloud Messaging status

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com)
- [React Native Firebase Documentation](https://rnfirebase.io/messaging/usage)
- [FCM Testing Tools](https://firebase.google.com/docs/cloud-messaging/test-message)

---

**Remember:** FCM requires a physical device and proper Firebase project configuration. The enhanced logging and debugger should help identify any issues quickly!
