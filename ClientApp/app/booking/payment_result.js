import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

export default function PaymentResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 phút = 600 giây

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}s`;
  };

  const handleGoHome = () => {
    router.replace("/(tabs)/home");
  };

  const handlePaymentComplete = () => {
    // Giả định thanh toán thành công, chuyển sang màn success
    router.replace({
      pathname: "/booking/success",
      params: {
        ticketId: params.ticketId,
        movieTitle: params.movieTitle,
        movieThumbnail: params.movieThumbnail,
        date: params.date,
        showtime: params.showtime,
        seats: params.seats,
        roomName: params.roomName,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoHome} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mã QR</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Vui lòng quét mã QR{"\n"}để tiến hành thanh toán
        </Text>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          {params.paymentUrl ? (
            <QRCode
              value={params.paymentUrl}
              size={200}
              backgroundColor="white"
              color="black"
            />
          ) : (
            <ActivityIndicator size="large" color="#6C47DB" />
          )}
        </View>

        {/* Timer */}
        <Text style={styles.timerText}>
          (Thời hạn thanh toán: {formatTime(timeRemaining)})
        </Text>

        {/* Order Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã đơn hàng</Text>
            <Text style={styles.infoValue}>{params.orderId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số tiền thanh toán</Text>
            <Text style={styles.infoValue}>
              {parseInt(params.amount || 0).toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.successButton}
          onPress={handlePaymentComplete}
        >
          <Text style={styles.successButtonText}>Đã thanh toán</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleGoHome}>
          <Text style={styles.backButtonText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: "#1A1A1A",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  qrContainer: {
    width: 240,
    height: 240,
    backgroundColor: "#FFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: "#FFA500",
    marginBottom: 40,
  },
  infoSection: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#999",
  },
  infoValue: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  successButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#6C47DB",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  backButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
