// Cross-platform clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // For web platforms
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Try to use built-in React Native Clipboard API
    if (
      typeof global !== "undefined" &&
      global.navigator &&
      global.navigator.clipboard
    ) {
      await global.navigator.clipboard.writeText(text);
      return true;
    }

    // Try to use React Native's built-in Clipboard (if available)
    try {
      const { Clipboard } = require("react-native");
      if (Clipboard && typeof Clipboard.setString === "function") {
        Clipboard.setString(text);
        return true;
      }
    } catch (e) {
      // Clipboard not available
    }

    // For React Native without clipboard, return false
    // The component will handle this by showing the data in a way user can copy
    return false;
  } catch (error) {
    console.error("Clipboard error:", error);
    return false;
  }
};
