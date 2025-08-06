import {
  useGetCategoryQuery,
  useGetItemsV1Query,
  useGetMenuIdQuery,
} from "@/redux/feature/menu/menuApi";
import { useGetRestaurantQuery } from "@/redux/feature/restaurant/restaurantApi";
import React from "react";
import { View } from "react-native";
import MenuCategoryList from "./MenuPage/MenuCategoryList";

export default function MenuPage() {
  // Placeholder/mock data
  const unavailableCount = 11;

  const { data: restaurantData } = useGetRestaurantQuery({});
  const restaurantId = restaurantData?.results[0]?.id;

  // Fetch categories from API
  const { data: categoryData, isLoading, isError } = useGetCategoryQuery({});

  const { data: getMenuId } = useGetMenuIdQuery({});
  const menuId = getMenuId?.results[0]?.id;

  const {
    data: getItemsV1,
    isLoading: isItemsV1Loading,
    isError: isItemsV1Error,
  } = useGetItemsV1Query({ menuId: menuId });

  // Prepare categories from API
  const categories = categoryData?.results || [];

  return (
    <View className="flex-1 bg-white px-3 pt-6">
      <MenuCategoryList
        categories={categories}
        items={getItemsV1?.menuitem_set}
        isLoading={isLoading}
        isError={isError}
      />
    </View>
  );
}
