import { Stack } from "expo-router";

export default function MoviesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="now-playing" />
      <Stack.Screen name="upcoming" />
      <Stack.Screen name="detail" />
    </Stack>
  );
}
