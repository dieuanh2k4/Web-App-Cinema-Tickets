import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack initialRouteName="(auth)/welcome">
        <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/login"
          options={{ headerShown: false, title: "Đăng nhập" }}
        />
        <Stack.Screen
          name="(auth)/register"
          options={{ headerShown: false, title: "Đăng ký" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="movies/now-playing"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="movies" options={{ headerShown: false }} />
        <Stack.Screen name="movies/detail" options={{ headerShown: false }} />
        <Stack.Screen name="(theaters)" options={{ headerShown: false }} />
        <Stack.Screen
          name="booking/select_cinema"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="booking/select_showtime"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="booking/select_seat"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="booking/payment_method"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="booking/payment_result"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
