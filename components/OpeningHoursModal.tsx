import { useUpdateMenuOpeningHoursMutation } from "@/redux/feature/restaurant/restaurantApi";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import OpeningHoursEditView from "./OpeningHoursEditView";
import OpeningHoursView from "./OpeningHoursView";

const { width } = Dimensions.get("window");

export default function OpeningHoursModal({
  visible,
  onClose,
  openingHours,
  setOpeningHours,
  menuId,
}: any) {
  const [editMode, setEditMode] = useState(false);
  const [show, setShow] = useState(visible);

  const [updateMenuOpeningHours, { isLoading: isUpdating }] =
    useUpdateMenuOpeningHoursMutation();

  React.useEffect(() => {
    if (visible) setShow(true);
  }, [visible]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setEditMode(false);
      onClose();
    }, 400);
  };

  if (!show) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        zIndex: 100,
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (editMode) setEditMode(false);
              else handleClose();
            }}
          >
            <ArrowLeft size={28} color="#222" />
          </TouchableOpacity>
        </View>
        {editMode ? (
          <OpeningHoursEditView
            openingHours={openingHours}
            setOpeningHours={setOpeningHours}
            onCancel={() => setEditMode(false)}
            isSaving={isUpdating}
            onSave={async (newHours: any) => {
              const formatted = newHours
                .filter((day: any) => day.enabled)
                .map((item: any) => ({
                  id: item.id,
                  day_index: item.day?.toLowerCase().slice(0, 3),
                  is_close: !item.enabled,
                  opening_hour: item.shifts.map((shift: any) => ({
                    id: shift.id,
                    start_time: shift.start + ":00",
                    end_time: shift.end + ":00",
                  })),
                }));

              try {
                await updateMenuOpeningHours({
                  menuId: menuId,
                  opening_hours: formatted,
                }).unwrap();

                Toast.show({
                  type: "success",
                  text1: "Opening hours updated successfully!",
                });
                setEditMode(false);
              } catch (err) {
                Toast.show({
                  type: "error",
                  text1: "Failed to update opening hours.",
                });
              }
            }}
          />
        ) : (
          <OpeningHoursView
            openingHours={openingHours}
            onEdit={() => setEditMode(true)}
          />
        )}
      </View>
    </View>
  );
}
