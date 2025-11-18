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

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await authService.register(email, password);
      if (result.success) {
        await register({
          token: result.data.token,
          user: result.data.user,
        });
      } else {
        Alert.alert("Lỗi đăng ký", result.error);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng ký");
    }
  };

  return (
    <AuthLayout>
      <View style={styles.form}>
        <Text style={styles.headerText}>Đăng ký tài khoản</Text>

        <View style={styles.inputContainer}>
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

        <View style={styles.inputContainer}>
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

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="rgba(255, 255, 255, 0.27)"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: null });
              }
            }}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}
const styles = StyleSheet.create({
  headerText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 24,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  input: {
    backgroundColor: "rgba(77, 77, 77, 0.5)",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#fff",
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
});
