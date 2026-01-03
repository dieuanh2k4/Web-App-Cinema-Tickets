import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { paymentService, bookingService } from "../../services";

export default function PaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState("vnpay");
  const [processing, setProcessing] = useState(false);

  const totalAmount = parseInt(params.totalAmount || 0);
  const finalAmount = totalAmount;

  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      icon: "V",
      color: "#0F3B82",
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setProcessing(true);

      const booking = await bookingService.createBooking({
        ShowtimeId: parseInt(params.showtimeId),
        SeatIds: params.seats.split(", ").map((s) => parseInt(s)),
        TotalAmount: finalAmount,
      });

      const paymentData = {
        TicketId: booking.ticketId,
        Amount: finalAmount,
        OrderInfo: `Thanh toán vé ${params.movieTitle}`,
      };

      const paymentResult = await paymentService.createVNPayPayment(
        paymentData
      );

      if (paymentResult.paymentUrl) {
        await Linking.openURL(paymentResult.paymentUrl);
      } else {
        Alert.alert("Lỗi", "Không thể tạo thanh toán");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể xử lý thanh toán");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh Toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ticket Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="movie" size={20} color="#6C47DB" />
            <Text style={styles.summaryLabel}>Phim:</Text>
            <Text style={styles.summaryValue}>{params.movieTitle}</Text>
          </View>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#6C47DB"
            />
            <Text style={styles.summaryLabel}>Rạp:</Text>
            <Text style={styles.summaryValue}>{params.theaterName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="clock" size={20} color="#6C47DB" />
            <Text style={styles.summaryLabel}>Suất:</Text>
            <Text style={styles.summaryValue}>
              {params.date} - {params.time}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <MaterialCommunityIcons name="seat" size={20} color="#6C47DB" />
            <Text style={styles.summaryLabel}>Ghế:</Text>
            <Text style={styles.summaryValue}>{params.seats}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodSection}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: method.color }]}
                >
                  <Text style={styles.iconText}>{method.icon}</Text>
                </View>
                <Text style={styles.methodName}>{method.name}</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  selectedMethod === method.id && styles.radioSelected,
                ]}
              >
                {selectedMethod === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính</Text>
            <Text style={styles.priceValue}>
              {totalAmount.toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {finalAmount.toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.bottomLabel}>Tổng thanh toán</Text>
          <Text style={styles.bottomTotal}>
            {finalAmount.toLocaleString("vi-VN")}đ
          </Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
          <Text style={styles.payBtnText}>Thanh toán ngay</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
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
  summaryCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
    width: 60,
  },
  summaryValue: {
    fontSize: 14,
    color: "#FFF",
    flex: 1,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  methodSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  methodCardSelected: {
    borderColor: "#6C47DB",
    backgroundColor: "#2A2540",
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  methodName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#6C47DB",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6C47DB",
  },
  priceSection: {
    marginHorizontal: 16,
    marginBottom: 100,
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#999",
  },
  priceValue: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    color: "#6C47DB",
    fontWeight: "700",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bottomLabel: {
    fontSize: 13,
    color: "#999",
  },
  bottomTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  payBtn: {
    flexDirection: "row",
    backgroundColor: "#6C47DB",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
