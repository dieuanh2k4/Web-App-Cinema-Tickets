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
      source={require("../../assets/images/welcome.png")}
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <StatusBar style="light" />
        <Image
          source={require("../../assets/icons/logo.png")}
          style={styles.logo}
        />
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
            <Text style={styles.buttonText}>Đăng ký</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#fff",
  },
  buttonContainer: {
    width: "80%",
    gap: 16,
  },
  loginButton: {
    backgroundColor: "#5B3BB4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#5B3BB4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  logo: {
    marginBottom: 50,
  },
});
