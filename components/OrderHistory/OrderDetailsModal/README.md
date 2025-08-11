# OrderDetailsModal - Clean Architecture

This directory contains a refactored, clean, and manageable implementation of the OrderDetailsModal following clean code architecture principles.

## Architecture Overview

The OrderDetailsModal has been broken down into smaller, focused components, each responsible for a single feature:

```
OrderDetailsModal/
├── index.ts                    # Main exports
├── types.ts                    # Type definitions and interfaces
├── utils.ts                    # Utility functions and business logic
├── OrderDetailsModal.tsx       # Main modal component (orchestrator)
├── components/                 # Individual feature components
│   ├── ModalHeader.tsx        # Modal header with title and close button
│   ├── SectionHeader.tsx      # Reusable section header component
│   ├── RestaurantInfoSection.tsx    # Restaurant information display
│   ├── CustomerInfoSection.tsx      # Customer information display
│   ├── OrderInfoSection.tsx         # Order details (date, status, payment)
│   ├── OrderItemsSection.tsx        # List of order items
│   ├── OrderSummarySection.tsx      # Order summary and calculations
│   └── SpecialInstructionsSection.tsx # Special instructions/notes
└── README.md                  # This documentation
```

## Key Benefits

### 1. **Single Responsibility Principle**

- Each component has one clear purpose
- Easy to understand and maintain
- Simple to test individual components

### 2. **Separation of Concerns**

- **Types**: All interfaces and type definitions
- **Utils**: Business logic and helper functions
- **Components**: Pure UI components with minimal logic
- **Main Modal**: Orchestration and animation logic

### 3. **Reusability**

- `SectionHeader` can be reused across different sections
- Utility functions can be imported and used elsewhere
- Components can be easily swapped or modified

### 4. **Maintainability**

- Changes to one feature don't affect others
- Easy to locate specific functionality
- Clear component hierarchy

### 5. **Testability**

- Each component can be tested in isolation
- Utility functions are pure and easy to unit test
- Mock data can be easily injected

## Usage

### Basic Import

```tsx
import { OrderDetailsModal } from "./components/OrderHistory/OrderDetailsModal";
```

### Individual Components

```tsx
import {
  RestaurantInfoSection,
  CustomerInfoSection,
  OrderInfoSection,
} from "./components/OrderHistory/OrderDetailsModal";
```

### Utility Functions

```tsx
import {
  formatDate,
  calculateSubtotal,
  formatCurrency,
} from "./components/OrderHistory/OrderDetailsModal";
```

## Component Props

### OrderDetailsModal

- `visible: boolean` - Controls modal visibility
- `order: GenericOrder | null` - Order data to display
- `onClose: () => void` - Callback when modal closes

### Section Components

Each section component receives only the data it needs to display, making them lightweight and focused.

## Data Flow

1. **Main Modal** receives order data and visibility state
2. **Utility functions** process and transform the data
3. **Section components** receive processed data and render UI
4. **Reusable components** (like SectionHeader) provide consistent styling

## Adding New Features

To add a new section:

1. Create a new component in the `components/` directory
2. Add the component to the main modal
3. Export it from `index.ts`
4. Update types if needed

## Performance Considerations

- Components only re-render when their specific props change
- Utility functions are memoized where appropriate
- Animation logic is separated from rendering logic

## Best Practices Followed

- **DRY (Don't Repeat Yourself)**: Common patterns extracted into reusable components
- **KISS (Keep It Simple, Stupid)**: Each component is simple and focused
- **SOLID Principles**: Single responsibility, open/closed, dependency inversion
- **Clean Code**: Meaningful names, small functions, clear structure
