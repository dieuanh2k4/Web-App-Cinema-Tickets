import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AuthLayout from "../../components/AuthLayout/auth_layout";
import { authService } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        // Lưu thông tin user và chuyển hướng thông qua AuthContext
        await login({
          token: result.data.token,
          user: result.data.user,
        });
      } else {
        Alert.alert("Lỗi đăng nhập", result.error);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng nhập");
    }
  };

  return (
    <AuthLayout>
      <View style={styles.form}>
        <Text style={styles.loginText}>Đăng nhập</Text>
        <View>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="rgba(255, 255, 255, 0.27)"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors({ ...errors, email: null });
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Mật khẩu"
            placeholderTextColor="rgba(255, 255, 255, 0.27)"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors({ ...errors, password: null });
              }
            }}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
const styles = StyleSheet.create({
  form: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(77, 77, 77, 0.5)",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#6C47DB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#6C47DB",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  inputError: {
    borderColor: "#FF6B6B",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
