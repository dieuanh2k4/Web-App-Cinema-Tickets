import { Tabs } from "expo-router";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AIChatButton from "../../components/AIChatButton";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#0F0F0F",
            borderTopWidth: 0,
            elevation: 20,
            height: 60,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.5,
            shadowRadius: 8,
          },
          tabBarActiveTintColor: "#6C47DB",
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
          headerStyle: {
            backgroundColor: "#0F0F0F",
          },
          headerTitleStyle: {
            color: "#FFFFFF",
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search/index"
          options={{
            title: "Tìm kiếm",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule/index"
          options={{
            title: "Lịch chiếu",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="tickets/index"
          options={{
            title: "Đặt vé",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="ticket" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account/index"
          options={{
            title: "Tài khoản",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <AIChatButton />
    </View>
  );
}
