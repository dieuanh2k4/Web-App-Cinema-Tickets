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

export default function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email không được để trống";
    }

    if (!code) {
      newErrors.code = "Mã xác thực không được để trống";
    } else if (code.length !== 6) {
      newErrors.code = "Mã xác thực phải có 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await authService.verifyEmail(email, code);
      if (result.success) {
        Alert.alert("Thành công", result.message, [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]);
      } else {
        Alert.alert("Lỗi xác thực", result.error);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi xác thực email");
    }
  };

  return (
    <AuthLayout>
      <View style={styles.form}>
        <Text style={styles.headerText}>Xác thực email</Text>
        <Text style={styles.subtitle}>
          Nhập mã xác thực 6 số đã được gửi đến email của bạn
        </Text>
        <Text style={styles.demoNote}>(Mã demo: 123456)</Text>

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
            style={[styles.input, errors.code && styles.inputError]}
            placeholder="Mã xác thực (6 số)"
            placeholderTextColor="rgba(255, 255, 255, 0.27)"
            value={code}
            onChangeText={(text) => {
              setCode(text);
              if (errors.code) {
                setErrors({ ...errors, code: null });
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
          />
          {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Xác thực</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Quay lại đăng nhập</Text>
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
  headerText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  demoNote: {
    textAlign: "center",
    fontSize: 12,
    color: "#6C47DB",
    marginBottom: 16,
    fontStyle: "italic",
  },
  inputContainer: {
    marginBottom: 8,
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
