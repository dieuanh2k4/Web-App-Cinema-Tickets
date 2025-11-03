import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1A1A1A" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { color: "#FFFFFF", fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
