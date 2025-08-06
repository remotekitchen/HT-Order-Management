# Menu Page Components

This directory contains all the components related to the menu functionality, organized into smaller, more manageable pieces.

## Component Structure

### Main Components

- **MenuCategoryModal.tsx** - Main modal component for displaying menu items in a category
- **MenuCategoryList.tsx** - List component for displaying menu categories
- **UnavailableItemsModal.tsx** - Modal for handling unavailable items
- **UnavailableProductsBanner.tsx** - Banner component for unavailable products

### Sub-Components (New)

- **ChangeAvailabilityModal.tsx** - Modal for changing item availability status
- **EditMenuItemModal.tsx** - Modal for editing menu item details
- **FullScreenImageModal.tsx** - Modal for displaying images in full screen
- **MenuItemCard.tsx** - Individual menu item card component
- **MenuItemList.tsx** - List component for displaying menu items
- **StatusIndicators.tsx** - Component for displaying availability status indicators

### Types

- **types.ts** - TypeScript interfaces for menu-related data structures

### Index

- **index.ts** - Barrel export file for easy importing

## Usage

```typescript
import {
  MenuCategoryModal,
  MenuItemCard,
  MenuItemList,
  type MenuItem,
  type Category,
} from "./components/MenuPage";
```

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused in different contexts
3. **Maintainability**: Easier to maintain and debug individual components
4. **Testability**: Each component can be tested in isolation
5. **Readability**: Code is more organized and easier to understand
6. **Type Safety**: Proper TypeScript interfaces for better development experience

## Component Responsibilities

- **MenuCategoryModal**: Orchestrates the overall modal experience
- **MenuItemCard**: Handles individual item display and interactions
- **MenuItemList**: Manages the list of items and empty states
- **StatusIndicators**: Displays availability status information
- **ChangeAvailabilityModal**: Handles availability changes
- **EditMenuItemModal**: Manages item editing functionality
- **FullScreenImageModal**: Handles full-screen image viewing
