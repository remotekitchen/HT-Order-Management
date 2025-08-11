#!/usr/bin/env node

/**
 * Script to convert MP3 sound file to WAV format for custom notification sounds
 *
 * Prerequisites:
 * 1. Install ffmpeg: https://ffmpeg.org/download.html
 * 2. Install fluent-ffmpeg: npm install fluent-ffmpeg
 *
 * Usage:
 * node scripts/convert-sound.js
 */

const fs = require("fs");
const path = require("path");

console.log("🎵 Sound File Converter for Custom FCM Notifications");
console.log("===================================================\n");

const inputFile = path.join(__dirname, "../assets/sound/order_sound.mp3");
const outputFile = path.join(__dirname, "../assets/sound/order_sound.wav");

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error("❌ Input file not found:", inputFile);
  console.log(
    "\n📁 Please ensure your MP3 file is located at: assets/sound/order_sound.mp3"
  );
  process.exit(1);
}

console.log("📁 Input file found:", inputFile);
console.log("📁 Output will be saved to:", outputFile);
console.log("\n🔄 Converting MP3 to WAV...");

// Try to use ffmpeg if available
try {
  const ffmpeg = require("fluent-ffmpeg");

  ffmpeg(inputFile)
    .toFormat("wav")
    .on("end", () => {
      console.log("✅ Conversion completed successfully!");
      console.log("🎵 Your custom notification sound is ready.");
      console.log("\n📋 Next steps:");
      console.log("1. ✅ Sound file converted to WAV format");
      console.log("2. ✅ App configuration updated in app.json");
      console.log(
        "3. 🔄 Update your backend FCM payload (see FCM_CUSTOM_SOUND_GUIDE.md)"
      );
      console.log("4. 🧪 Test with real FCM notifications");
    })
    .on("error", (err) => {
      console.error("❌ FFmpeg conversion failed:", err.message);
      console.log("\n💡 Alternative conversion methods:");
      console.log("• Online converters: https://convertio.co/mp3-wav/");
      console.log("• Desktop apps: Audacity, VLC, etc.");
      console.log("• Command line: ffmpeg -i input.mp3 output.wav");
    })
    .save(outputFile);
} catch (error) {
  console.log("⚠️  FFmpeg not available. Please install it manually:");
  console.log("\n📦 Install fluent-ffmpeg:");
  console.log("   npm install fluent-ffmpeg");
  console.log("\n🔧 Or install FFmpeg directly:");
  console.log("   • Windows: https://ffmpeg.org/download.html");
  console.log("   • macOS: brew install ffmpeg");
  console.log("   • Ubuntu: sudo apt install ffmpeg");
  console.log("\n💡 Alternative: Use online converters or desktop apps");
  console.log("   • https://convertio.co/mp3-wav/");
  console.log("   • https://cloudconvert.com/mp3-to-wav");
}
