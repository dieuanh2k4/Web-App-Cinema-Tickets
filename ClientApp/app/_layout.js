import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="(auth)/welcome">
      <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)/login"
        options={{ headerShown: true, title: "Đăng nhập" }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{ headerShown: true, title: "Đăng ký" }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
