import { Stack } from "expo-router";

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="select_cinema" />
      <Stack.Screen name="select_showtime" />
      <Stack.Screen name="select_seat" />
      <Stack.Screen name="payment_method" />
      <Stack.Screen name="payment_result" />
    </Stack>
  );
}
