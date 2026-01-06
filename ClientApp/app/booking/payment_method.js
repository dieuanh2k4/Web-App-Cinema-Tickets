import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { paymentService, bookingService } from "../../services";
import { LoadingOverlay } from "../../components/ui";

export default function PaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState("vnpay");
  const [processing, setProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Form data
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const totalAmount = parseInt(params.totalAmount || 0);
  const serviceFee = Math.round(totalAmount * 0.02); // 2% service fee
  const finalAmount = totalAmount + serviceFee;

  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      description: "Quét QR hoặc chuyển khoản ngân hàng",
      icon: "qrcode",
      color: "#0F3B82",
      logo: null,
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (!agreed) {
      Alert.alert("Thông báo", "Vui lòng đồng ý với điều khoản sử dụng");
      return;
    }

    // Validate form
    if (!customerName.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập họ tên");
      return;
    }

    if (!customerPhone.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập số điện thoại");
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      Alert.alert("Thông báo", "Số điện thoại không hợp lệ (10-11 chữ số)");
      return;
    }

    try {
      setProcessing(true);

      if (!params.holdId) {
        Alert.alert(
          "Lỗi",
          "Phiên giữ ghế không hợp lệ. Vui lòng chọn lại ghế."
        );
        router.back();
        return;
      }

      // Confirm booking
      const bookingResult = await bookingService.confirmBooking(params.holdId);

      if (!bookingResult.success) {
        Alert.alert(
          "Lỗi",
          bookingResult.message || "Không thể xác nhận đặt vé"
        );
        return;
      }

      const ticketId =
        bookingResult.ticketId ||
        bookingResult.booking?.ticketId ||
        bookingResult.booking?.ticket?.id ||
        bookingResult.booking?.id;

      if (!ticketId) {
        Alert.alert("Lỗi", "Không thể lấy thông tin vé");
        return;
      }

      // Create VNPay payment
      const paymentData = {
        TicketId: ticketId,
        Amount: finalAmount,
        OrderInfo: `Thanh toán vé ${params.movieTitle}`,
      };

      const paymentResult = await paymentService.createVNPayPayment(paymentData);

      if (paymentResult.paymentUrl) {
        router.replace({
          pathname: "/booking/payment_result",
          params: {
            ticketId,
            paymentUrl: paymentResult.paymentUrl,
            amount: finalAmount,
            orderId: ticketId,
            status: "pending",
            movieTitle: params.movieTitle,
            movieThumbnail: params.movieThumbnail,
            date: params.date,
            showtime: params.showtime,
            seats: params.seats,
            roomName: params.roomName,
          },
        });
      } else {
        Alert.alert("Lỗi", "Không thể tạo liên kết thanh toán");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Lỗi", error.message || "Không thể xử lý thanh toán");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={processing} message="Đang xử lý thanh toán..." />

      {/* Header */}
      <LinearGradient
        colors={["#1A1A1A", "#0F0F0F"]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Thanh toán</Text>
          <View style={styles.secureTag}>
            <MaterialCommunityIcons name="shield-check" size={12} color="#4CAF50" />
            <Text style={styles.secureText}>Bảo mật</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Movie Info Card */}
          <View style={styles.movieCard}>
            <Image
              source={{ uri: params.movieThumbnail }}
              style={styles.moviePoster}
            />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {params.movieTitle}
              </Text>
              <View style={styles.movieDetail}>
                <MaterialCommunityIcons name="calendar" size={14} color="#6C47DB" />
                <Text style={styles.movieDetailText}>{params.date}</Text>
              </View>
              <View style={styles.movieDetail}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#6C47DB" />
                <Text style={styles.movieDetailText}>{params.time}</Text>
              </View>
              <View style={styles.movieDetail}>
                <MaterialCommunityIcons name="seat" size={14} color="#6C47DB" />
                <Text style={styles.movieDetailText}>{params.seats}</Text>
              </View>
            </View>
          </View>

          {/* Customer Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#6C47DB" />
              <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Họ tên *</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập họ tên"
                  placeholderTextColor="#555"
                  value={customerName}
                  onChangeText={setCustomerName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Số điện thoại *</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="phone" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#555"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="email-outline" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email (không bắt buộc)"
                  placeholderTextColor="#555"
                  value={customerEmail}
                  onChangeText={setCustomerEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="credit-card-outline" size={20} color="#6C47DB" />
              <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            </View>

            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedMethod === method.id && styles.paymentMethodSelected,
                  method.disabled && styles.paymentMethodDisabled,
                ]}
                onPress={() => !method.disabled && setSelectedMethod(method.id)}
                disabled={method.disabled}
              >
                <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                  <MaterialCommunityIcons name={method.icon} size={24} color="#FFF" />
                </View>
                <View style={styles.methodInfo}>
                  <View style={styles.methodNameRow}>
                    <Text style={styles.methodName}>{method.name}</Text>
                    {method.disabled && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>Sắp ra mắt</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.methodDesc}>{method.description}</Text>
                </View>
                <View style={[
                  styles.radioOuter,
                  selectedMethod === method.id && styles.radioOuterSelected,
                ]}>
                  {selectedMethod === method.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Breakdown */}
          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>Chi tiết thanh toán</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Giá vé ({params.seats?.split(",").length || 1} ghế)</Text>
              <Text style={styles.priceValue}>{totalAmount.toLocaleString("vi-VN")}đ</Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Phí dịch vụ (2%)</Text>
              <Text style={styles.priceValue}>{serviceFee.toLocaleString("vi-VN")}đ</Text>
            </View>

            <View style={styles.priceDivider} />

            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalValue}>{finalAmount.toLocaleString("vi-VN")}đ</Text>
            </View>
          </View>

          {/* Terms Agreement */}
          <TouchableOpacity
            style={styles.agreementRow}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && (
                <MaterialCommunityIcons name="check" size={16} color="#FFF" />
              )}
            </View>
            <Text style={styles.agreementText}>
              Tôi đồng ý với{" "}
              <Text style={styles.agreementLink}>Điều khoản sử dụng</Text>
              {" "}và{" "}
              <Text style={styles.agreementLink}>Chính sách bảo mật</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Payment Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>Tổng cộng</Text>
          <Text style={styles.bottomAmount}>{finalAmount.toLocaleString("vi-VN")}đ</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!agreed || processing) && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!agreed || processing}
        >
          <LinearGradient
            colors={agreed ? ["#8B5CF6", "#6C47DB"] : ["#444", "#333"]}
            style={styles.payButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.payButtonText}>Thanh toán</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  secureTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  secureText: {
    fontSize: 11,
    color: "#4CAF50",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  movieCard: {
    flexDirection: "row",
    margin: 16,
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  moviePoster: {
    width: 80,
    height: 110,
    borderRadius: 10,
    backgroundColor: "#2A2A2A",
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 12,
  },
  movieDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  movieDetailText: {
    fontSize: 13,
    color: "#AAA",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#FFF",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  paymentMethodSelected: {
    borderColor: "#6C47DB",
    backgroundColor: "#1E1A2E",
  },
  paymentMethodDisabled: {
    opacity: 0.5,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  methodInfo: {
    flex: 1,
    marginLeft: 14,
  },
  methodNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  methodName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
  methodDesc: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  comingSoonBadge: {
    backgroundColor: "rgba(255,152,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  comingSoonText: {
    fontSize: 10,
    color: "#FF9800",
    fontWeight: "600",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#6C47DB",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6C47DB",
  },
  priceCard: {
    margin: 16,
    padding: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  priceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#888",
  },
  priceValue: {
    fontSize: 14,
    color: "#FFF",
  },
  priceDivider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6C47DB",
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#6C47DB",
    borderColor: "#6C47DB",
  },
  agreementText: {
    flex: 1,
    fontSize: 13,
    color: "#888",
    lineHeight: 20,
  },
  agreementLink: {
    color: "#6C47DB",
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  bottomLeft: {},
  bottomLabel: {
    fontSize: 12,
    color: "#888",
  },
  bottomAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  payButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
