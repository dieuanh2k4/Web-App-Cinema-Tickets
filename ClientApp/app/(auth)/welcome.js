import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Pressable,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  const { width, height } = Dimensions.get("window");

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <StatusBar style="light" />
        <Image
          source={require("../../assets/icons/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Chào mừng đến với CineBook</Text>
        <Text style={styles.subtitle}>
          Đặt vé xem phim dễ dàng và nhanh chóng
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </Pressable>
          <Pressable
            style={styles.registerButton}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={[styles.buttonText, styles.registerText]}>
              Đăng ký
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 16,
  },
  loginButton: {
    backgroundColor: "#6C47DB",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  registerButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    opacity: 0.9,
  },
});
