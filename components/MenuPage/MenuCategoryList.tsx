import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import MenuCategoryModal from "./MenuCategoryModal";

// --- SkeletonLoader (copied from RecentOrders) ---
function SkeletonLoader() {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingBottom: 16,
        flex: 1,
        justifyContent: "center",
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            marginBottom: 8,
            backgroundColor: "#f3f3f3",
            borderRadius: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#e5e7eb",
              borderRadius: 20,
              marginRight: 16,
            }}
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 16,
                backgroundColor: "#e5e7eb",
                borderRadius: 8,
                width: "50%",
                marginBottom: 8,
              }}
            />
            <View
              style={{
                height: 12,
                backgroundColor: "#f1f1f1",
                borderRadius: 6,
                width: "33%",
                marginBottom: 4,
              }}
            />
            <View
              style={{
                height: 12,
                backgroundColor: "#f1f1f1",
                borderRadius: 6,
                width: "25%",
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function MenuCategoryList({
  categories,
  isLoading,
  isError,
  items,
}: {
  categories: any;
  items: any;
  isLoading: boolean;
  isError: boolean;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Helper: count items per category
  const getItemCountForCategory = (categoryId: number) => {
    if (!Array.isArray(items)) return 0;

    const filteredItems = items.filter((item: any) => {
      return Array.isArray(item.category) && item.category.includes(categoryId);
    });

    return filteredItems.length;
  };

  // Find selected category id
  const selectedCategoryObj = categories.find(
    (cat: any) => cat?.name === selectedCategory
  );
  const selectedCategoryId = selectedCategoryObj?.id ?? null;

  // Handle category press
  const handleCategoryPress = (catName: string) => {
    setSelectedCategory(catName);
    setModalVisible(true);
  };

  return (
    <ScrollView>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: "#111",
            }}
          >
            Delivery Menu
          </Text>
        </View>
        {isLoading ? (
          <SkeletonLoader />
        ) : isError ? (
          <Text style={{ color: "#f00", marginVertical: 20 }}>
            Failed to load categories.
          </Text>
        ) : (
          categories.map((cat: any, idx: number) => {
            const itemCount = getItemCountForCategory(cat?.id);
            const isDisabled = itemCount === 0;
            return (
              <View
                key={cat?.id || cat?.name || idx}
                style={{ marginBottom: 12 }}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleCategoryPress(cat?.name)}
                  disabled={isDisabled}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#FFF7E6" : "#FFF3E0",
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 18,
                    paddingHorizontal: 18,
                    shadowColor: "#000",
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    elevation: 1,
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                >
                  <Text
                    style={{ fontSize: 17, color: "#222", fontWeight: "600" }}
                  >
                    {cat?.name}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#FB923C",
                      borderRadius: 16,
                      minWidth: 32,
                      height: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 12,
                      paddingHorizontal: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {itemCount}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
        <MenuCategoryModal
          visible={modalVisible}
          category={selectedCategory}
          onClose={() => setModalVisible(false)}
          items={items}
          categoryId={selectedCategoryId}
          categories={categories}
        />
      </View>
    </ScrollView>
  );
}
