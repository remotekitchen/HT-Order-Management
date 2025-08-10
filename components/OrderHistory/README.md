# Order History Components

This directory contains the Order History functionality with a clean, organized architecture that separates concerns and maintains code quality.

## Architecture Overview

### 🏗️ **Component Structure**

```
OrderHistory/
├── components/           # UI Components
│   ├── Header.tsx       # Tab navigation header
│   ├── OrderListItem.tsx # Individual order item (list view)
│   ├── OrderGridItem.tsx # Individual order item (grid view)
│   ├── NoIncomingOrders.tsx # Empty state component
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useIncomingOrders.ts # Manages incoming orders data
│   └── index.ts         # Hook exports
├── utils/               # Utility functions
│   ├── orderTransformer.ts # API data transformation
│   └── index.ts         # Utility exports
├── types/               # TypeScript type definitions
│   └── types.ts         # All component and API types
└── ...
```

### 🔄 **Data Flow**

1. **API Layer**: `useGetIncomingOrdersQuery` fetches raw data
2. **Hook Layer**: `useIncomingOrders` manages state and transformation
3. **Transform Layer**: `orderTransformer` converts API format to component format
4. **Component Layer**: Components render transformed data

### 🎯 **Key Features**

#### **Tab Navigation**

- **Incoming Tab**: Shows real-time incoming orders from API
- **Recent Orders Tab**: Shows existing RecentOrders component (unchanged)

#### **Dynamic Data Integration**

- Real restaurant logos from API
- Live order status updates
- Automatic refresh functionality
- Error handling and loading states

#### **Responsive Design**

- List and Grid view options
- Pull-to-refresh for incoming orders
- Smooth animations and transitions

### 🛠️ **Usage**

#### **Basic Implementation**

```tsx
import { useIncomingOrders } from "./hooks";

function MyComponent() {
  const { orders, isLoading, error, refreshOrders, hasOrders } =
    useIncomingOrders();

  // Use the data...
}
```

#### **Data Transformation**

```tsx
import { transformApiOrdersToOrderHistory } from "./utils";

const transformedOrders = transformApiOrdersToOrderHistory(apiOrders);
```

### 🔧 **Maintenance**

#### **Adding New API Fields**

1. Update types in `types.ts`
2. Modify transformation logic in `orderTransformer.ts`
3. Update components if new fields need display

#### **Modifying UI Components**

- Keep existing design structure
- Update only the data binding
- Maintain backward compatibility

### 📱 **Component Compatibility**

All existing components (`OrderListItem`, `OrderGridItem`) work unchanged with the new API data structure. The transformation layer ensures backward compatibility while enabling real-time data integration.

### 🚀 **Performance Features**

- **Real-time Polling**: Automatic API calls every 5 seconds for live updates
- **Smart Polling Control**: Pause/resume polling functionality
- **Efficient Data Transformation**: Optimized data mapping from API to UI
- **Conditional Rendering**: Smart rendering based on data availability
- **Optimized Refresh Mechanisms**: Manual refresh with pull-to-refresh
- **Memory-efficient State Management**: Minimal re-renders and efficient updates
- **Network Optimization**: Automatic refetch on focus, reconnect, and mount

### 🔄 **Polling Features**

#### **Automatic Polling**

- **5-second intervals**: Real-time updates without manual refresh
- **Smart pausing**: Can pause polling to save bandwidth
- **Auto-resume**: Automatically resumes when component becomes visible

#### **Polling Controls**

- **Play/Pause Button**: Toggle polling on/off
- **Manual Refresh**: Force immediate data fetch
- **Status Indicator**: Visual feedback for polling state
- **Last Update Time**: Shows when data was last fetched

#### **Network Resilience**

- **Refetch on Focus**: Updates when app comes to foreground
- **Refetch on Reconnect**: Updates when internet connection is restored
- **Refetch on Mount**: Ensures fresh data when component loads
