import { Stack } from "expo-router";

export default function TheaterLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1A1A1A",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          color: "#FFFFFF",
          fontWeight: "bold",
        },
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
