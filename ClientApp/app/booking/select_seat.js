import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { seatService, bookingService, customerService } from "../../services";
import { useAuth } from "../../contexts/AuthContext";

export default function SelectSeatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user: currentUser } = useAuth();
  const {
    showtimeId,
    movieId,
    movieTitle,
    movieThumbnail,
    theaterId,
    theaterName,
    showtime,
    format,
    date,
  } = params;

  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holdId, setHoldId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [seatsData, setSeatsData] = useState({
    rows: [],
    columns: 0,
    seats: { booked: [], vip: [], regular: [] },
    prices: { vip: 150000, regular: 100000 },
  });
  const [isHolding, setIsHolding] = useState(false);
  const [holdExpiry, setHoldExpiry] = useState(null);

  useEffect(() => {
    loadSeats();
    return () => {
      // Cleanup: Release hold khi user rời trang
      if (holdId) {
        bookingService.releaseSeats(holdId).catch(console.error);
      }
    };
  }, []);

  const loadSeats = async () => {
    try {
      setLoading(true);
      const response = await seatService.getSeatsByShowtime(showtimeId);

      // Handle different response formats
      const seats = Array.isArray(response)
        ? response
        : response?.seats || response?.data || [];

      if (!seats || seats.length === 0) {
        console.error("No seats found. Response was:", response);
        throw new Error("No seats data received");
      }

      // Filter out invalid seats (seats without name)
      const validSeats = seats.filter(
        (s) => s && s.name && typeof s.name === "string"
      );

      if (validSeats.length === 0) {
        console.error("No valid seats found. Seats data:", seats);
        throw new Error("No valid seats with seat names");
      }

      // Transform flat array to structured data
      const rows = [...new Set(validSeats.map((s) => s.name.charAt(0)))].sort();
      const columns = Math.max(
        ...validSeats.map((s) => parseInt(s.name.substring(1)))
      );

      // Log để kiểm tra loại ghế từ backend
      const transformedData = {
        rows: rows,
        columns: columns,
        seats: {
          booked: validSeats.filter((s) => !s.isAvailable).map((s) => s.name),
          vip: validSeats.filter((s) => s.type === "VIP").map((s) => s.name),
          regular: validSeats
            .filter((s) => s.type === "Standard")
            .map((s) => s.name),
        },
        prices: {
          vip: 150000,
          regular: 100000,
        },
      };

      setSeatsData(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading seats:", error);
      setSeatsData({
        rows: [],
        columns: 0,
        seats: { booked: [], vip: [], regular: [] },
        prices: { vip: 150000, regular: 100000 },
      });
      Alert.alert("Lỗi", "Không thể tải dữ liệu ghế. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // Timer đếm ngược cho hold
  useEffect(() => {
    if (!holdExpiry) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = Math.floor((holdExpiry - now) / 1000);

      if (remaining <= 0) {
        // Hết thời gian hold - reset ghế
        Alert.alert("Hết thời gian giữ ghế", "Vui lòng chọn lại ghế", [
          { text: "OK" },
        ]);
        setSelectedSeats([]);
        setHoldId(null);
        setHoldExpiry(null);
        setTimeRemaining(600);
        clearInterval(timer);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [holdExpiry]);

  const getSeatType = (seatName) => {
    if (seatsData.seats.booked.includes(seatName)) return "booked";
    if (seatsData.seats.vip.includes(seatName)) return "vip";
    if (seatsData.seats.regular.includes(seatName)) return "regular";
    return null;
  };

  const getSeatPrice = (seatType) => {
    return seatsData.prices[seatType] || 0;
  };

  const toggleSeat = async (seatName) => {
    const seatType = getSeatType(seatName);
    if (seatType === "booked") return;

    const isSelected = selectedSeats.includes(seatName);
    let newSelectedSeats;

    if (isSelected) {
      newSelectedSeats = selectedSeats.filter((s) => s !== seatName);
      setSelectedSeats(newSelectedSeats);

      // Nếu bỏ hết ghế, release hold
      if (newSelectedSeats.length === 0 && holdId) {
        await bookingService.releaseSeats(holdId);
        setHoldId(null);
        setHoldExpiry(null);
        setTimeRemaining(600);
      }
    } else {
      newSelectedSeats = [...selectedSeats, seatName];
      setSelectedSeats(newSelectedSeats);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seatName) => {
    const seatType = getSeatType(seatName);
    return sum + getSeatPrice(seatType);
  }, 0);

  const renderSeat = (row, col) => {
    const seatName = `${row}${col}`;
    const seatType = getSeatType(seatName);

    if (!seatType) {
      return <View key={col} style={styles.emptySeat} />;
    }

    const isSelected = selectedSeats.includes(seatName);
    const isBooked = seatType === "booked";

    let seatStyle = [styles.seat];
    if (isSelected) {
      seatStyle.push(styles.seatSelected);
    } else if (isBooked) {
      seatStyle.push(styles.seatBooked);
    } else if (seatType === "vip") {
      seatStyle.push(styles.seatVip);
    }

    return (
      <TouchableOpacity
        key={col}
        style={seatStyle}
        onPress={() => toggleSeat(seatName)}
        disabled={isBooked}
        activeOpacity={0.7}
      >
        {isSelected && <Ionicons name="checkmark" size={12} color="#FFF" />}
      </TouchableOpacity>
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    if (isHolding) return;

    if (!currentUser) {
      Alert.alert("Yêu cầu đăng nhập", "Vui lòng đăng nhập để đặt vé", [
        { text: "Hủy" },
        { text: "Đăng nhập", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    try {
      setIsHolding(true);

      // Lấy seatIds từ seatsData
      const allSeats = await seatService.getSeatsByShowtime(showtimeId);
      const seatIds = selectedSeats
        .map((seatName) => {
          const seat = Array.isArray(allSeats)
            ? allSeats.find((s) => s.name === seatName)
            : (allSeats?.seats || allSeats?.data || []).find(
              (s) => s.name === seatName
            );
          return seat?.id;
        })
        .filter(Boolean);

      if (seatIds.length !== selectedSeats.length) {
        Alert.alert("Lỗi", "Không thể xác định ID ghế. Vui lòng thử lại.");
        setIsHolding(false);
        return;
      }

      // Bước 1: Hold seats
      const holdResponse = await bookingService.holdSeats(
        seatIds,
        parseInt(showtimeId)
      );

      if (!holdResponse.success) {
        Alert.alert("Lỗi", holdResponse.message || "Không thể giữ ghế");
        setIsHolding(false);
        return;
      }

      // Lưu holdId và expiry time
      const expiryTime = new Date(holdResponse.expiresAt).getTime();
      setHoldId(holdResponse.holdId);
      setHoldExpiry(expiryTime);

      // Chuyển sang trang thanh toán với holdId
      router.push({
        pathname: "/booking/payment_method",
        params: {
          holdId: holdResponse.holdId,
          showtimeId,
          movieId,
          movieTitle,
          movieThumbnail: movieThumbnail || "",
          theaterId,
          theaterName,
          showtime,
          format,
          date,
          time: showtime,
          seats: selectedSeats.sort().join(", "),
          seatIds: seatIds.join(","),
          seatCount: selectedSeats.length,
          totalAmount: totalPrice,
          expiresAt: holdResponse.expiresAt,
        },
      });
    } catch (error) {
      console.error("Error holding seats:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể giữ ghế. Vui lòng thử lại."
      );
    } finally {
      setIsHolding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C47DB" />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chọn ghế</Text>
          {movieTitle && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {movieTitle}
            </Text>
          )}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Screen */}
        <View style={styles.screenContainer}>
          <View style={styles.screen} />
        </View>

        {/* Seat Grid */}
        <View style={styles.seatGrid}>
          <View style={styles.rowLabels}>
            {seatsData?.rows?.map((row) => (
              <View key={row} style={styles.rowLabelContainer}>
                <Text style={styles.rowLabel}>{row}</Text>
              </View>
            ))}
          </View>

          <View style={styles.seatsContainer}>
            {seatsData?.rows?.map((row) => (
              <View key={row} style={styles.seatRow}>
                {Array.from({ length: seatsData.columns }, (_, i) => i + 1).map(
                  (col) => renderSeat(row, col)
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendSelected]}>
                <Ionicons name="checkmark" size={10} color="#FFF" />
              </View>
              <Text style={styles.legendText}>Đang chọn</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendVip]} />
              <Text style={styles.legendText}>Ghế Vip</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendBooked]} />
              <Text style={styles.legendText}>Đã đặt</Text>
            </View>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendRegular]} />
              <Text style={styles.legendText}>Ghế thường</Text>
            </View>

            <View style={{ flex: 1 }} />
            <View style={{ flex: 1 }} />
          </View>
        </View>

        {/* Movie Info Bottom */}
        <View style={styles.movieInfoCard}>
          <View style={styles.movieInfoHeader}>
            <Text style={styles.movieTitleCard}>{movieTitle}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{format || "2D"}</Text>
              </View>
              <View style={[styles.badge, styles.badgeRed]}>
                <Text style={styles.badgeText}>
                  {theaterName?.split(" ")[0] || "LTV"}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.seatsSelected}>
            {selectedSeats.length > 0
              ? selectedSeats.sort().join(", ")
              : "Chưa chọn ghế"}
          </Text>
          <Text style={styles.priceInfo}>
            {selectedSeats.length} ghế - {totalPrice.toLocaleString("vi-VN")}{" "}
            VND
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            (selectedSeats.length === 0 || isHolding) &&
            styles.bookButtonDisabled,
          ]}
          onPress={handleBooking}
          disabled={selectedSeats.length === 0 || isHolding}
        >
          {isHolding ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.bookButtonText}>Đang giữ ghế...</Text>
            </>
          ) : (
            <>
              <Text style={styles.bookButtonText}>Đặt vé</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0A0F",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0A0A0F",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#999",
    textAlign: "center",
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  screenContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  screen: {
    width: "85%",
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  seatGrid: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  rowLabels: {
    paddingTop: 2,
    marginRight: 8,
  },
  rowLabelContainer: {
    height: 26,
    width: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
  },
  rowLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  seatsContainer: {
    flex: 1,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 3,
    gap: 3,
  },
  seat: {
    width: 26,
    height: 26,
    borderRadius: 5,
    backgroundColor: "#4A4A50",
    justifyContent: "center",
    alignItems: "center",
  },
  emptySeat: {
    width: 26,
    height: 26,
  },
  seatVip: {
    backgroundColor: "#FF8C00",
  },
  seatBooked: {
    backgroundColor: "#6366F1",
  },
  seatSelected: {
    backgroundColor: "#FF1493",
  },
  legend: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  legendSelected: {
    backgroundColor: "#FF1493",
  },
  legendVip: {
    backgroundColor: "#FF8C00",
  },
  legendBooked: {
    backgroundColor: "#6366F1",
  },
  legendRegular: {
    backgroundColor: "#4A4A50",
  },
  legendText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "400",
  },
  movieInfoCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#1A1A24",
    borderRadius: 12,
    padding: 16,
  },
  movieInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  movieTitleCard: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeRed: {
    borderColor: "#FF3B30",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  seatsSelected: {
    color: "#999999",
    fontSize: 12,
    marginBottom: 6,
  },
  priceInfo: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0A0A0F",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonDisabled: {
    backgroundColor: "#4A4A50",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
