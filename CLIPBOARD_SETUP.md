# Clipboard Functionality Setup

## Current Implementation

The copy functionality has been implemented with a copy icon next to the restaurant name in both list and grid views of orders. When clicked, it formats the order data and attempts to copy it to the clipboard.

## Features Implemented

✅ Copy icon added next to restaurant name  
✅ Order data formatted exactly as requested  
✅ Toast message feedback  
✅ Cross-platform clipboard utility  
✅ Error handling

## Order Data Format

The copied data follows this exact format:

```
Customer Name: [Customer Name]
Customer Phone: [Phone Number]
Address: [Full Address]
Total Amount: [Amount]
Item: [Quantity]x [Item Name], [Quantity]x [Item Name]
```

## To Enable Full Clipboard Functionality

### Option 1: Install React Native Clipboard Package

```bash
npm install @react-native-clipboard/clipboard
```

Then update the `utils/clipboard.ts` file:

```typescript
import Clipboard from "@react-native-clipboard/clipboard";

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    Clipboard.setString(text);
    return true;
  } catch (error) {
    console.error("Clipboard error:", error);
    return false;
  }
};
```

### Option 2: Install Expo Clipboard Package

```bash
npx expo install expo-clipboard
```

Then update the `utils/clipboard.ts` file:

```typescript
import * as Clipboard from "expo-clipboard";

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    console.error("Clipboard error:", error);
    return false;
  }
};
```

## Current Behavior

- **Web**: Clipboard functionality works automatically
- **React Native**: Shows "Copy ready" message and logs data to console
- **Toast Messages**: Always show appropriate feedback to user

## Components Updated

- `components/OrderHistory/OrderListItem.tsx` - List view with copy icon
- `components/OrderHistory/OrderGridItem.tsx` - Grid view with copy icon
- `utils/clipboard.ts` - Cross-platform clipboard utility

## Usage

1. Navigate to the Orders section
2. Look for the copy icon (📋) next to the restaurant name
3. Tap the copy icon to copy order details
4. Toast message will confirm the action
5. Order data is formatted and ready for use
