import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { showtimeService } from "../../services/showtimeService";

export default function SelectSeatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    showtimeId,
    movieId,
    movieTitle,
    theaterId,
    theaterName,
    showtime,
    format,
    date,
  } = params;

  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 phút = 600 giây
  const [seatsData, setSeatsData] = useState({
    rows: [],
    columns: 0,
    seats: { regular: [], vip: [], couple: [], booked: [] },
    prices: { regular: 0, vip: 0, couple: 0 },
  });

  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = async () => {
    try {
      setLoading(true);
      const data = await showtimeService.getSeatsByShowtime(showtimeId);
      setSeatsData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading seats:", error);
      setSeatsData({
        rows: [],
        columns: 0,
        seats: { regular: [], vip: [], couple: [], booked: [] },
        prices: { regular: 0, vip: 0, couple: 0 },
      });
      setLoading(false);
    }
  };

  // Timer đếm ngược
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Hết thời gian - reset ghế đã chọn
          setSelectedSeats([]);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const getSeatType = (seatName) => {
    if (seatsData.seats.booked.includes(seatName)) return "booked";
    if (seatsData.seats.vip.includes(seatName)) return "vip";
    if (seatsData.seats.couple.includes(seatName)) return "couple";
    if (seatsData.seats.regular.includes(seatName)) return "regular";
    return null;
  };

  const getSeatPrice = (seatType) => {
    return seatsData.prices[seatType] || 0;
  };

  const toggleSeat = (seatName) => {
    const seatType = getSeatType(seatName);
    if (seatType === "booked") return;

    const isSelected = selectedSeats.includes(seatName);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatName));
    } else {
      setSelectedSeats([...selectedSeats, seatName]);
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

    return (
      <TouchableOpacity
        key={col}
        style={[
          styles.seat,
          seatType === "vip" && styles.seatVip,
          seatType === "couple" && styles.seatCouple,
          isBooked && styles.seatBooked,
          isSelected && styles.seatSelected,
        ]}
        onPress={() => toggleSeat(seatName)}
        disabled={isBooked}
      >
        {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
      </TouchableOpacity>
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;

    router.push({
      pathname: "/booking/payment_method",
      params: {
        showtimeId,
        movieId,
        movieTitle,
        theaterId,
        theaterName,
        showtime,
        format,
        date,
        seats: selectedSeats.sort().join(", "),
        seatCount: selectedSeats.length,
        totalAmount: totalPrice,
      },
    });
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chọn ghế</Text>
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={16} color="#FF6B6B" />
            <Text style={styles.timerText}>
              {Math.floor(timeRemaining / 60)}:
              {String(timeRemaining % 60).padStart(2, "0")}
            </Text>
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Screen */}
        <View style={styles.screenContainer}>
          <View style={styles.screen}>
            <Text style={styles.screenText}>MÀN HÌNH</Text>
          </View>
        </View>

        {/* Seat Grid */}
        <View style={styles.seatGrid}>
          <View style={styles.rowLabels}>
            {seatsData.rows.map((row) => (
              <View key={row} style={styles.rowLabelContainer}>
                <Text style={styles.rowLabel}>{row}</Text>
              </View>
            ))}
          </View>

          <View style={styles.seatsContainer}>
            {seatsData.rows.map((row) => (
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
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#6C47DB" }]}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <Text style={styles.legendText}>Đang chọn</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#FF8C42" }]} />
            <Text style={styles.legendText}>Ghế Vip</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#FF3B8F" }]} />
            <Text style={styles.legendText}>Ghế đôi</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#6C47DB" }]} />
            <Text style={styles.legendText}>Đã đặt</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: "#4A4A4A" }]} />
            <Text style={styles.legendText}>Ghế thường</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.movieTitleBottom}>MUA ĐỎ - T13</Text>
          <Text style={styles.seatInfo}>
            {selectedSeats.length} ghế - {totalPrice.toLocaleString("vi-VN")}{" "}
            VNĐ
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            selectedSeats.length === 0 && styles.bookButtonDisabled,
          ]}
          onPress={handleBooking}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.bookButtonText}>Đặt vé</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#0A0A0A",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  screenContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  screen: {
    width: "70%",
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
  },
  screenText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
  },
  seatGrid: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  rowLabels: {
    paddingTop: 4,
    marginRight: 8,
  },
  rowLabelContainer: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  rowLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  seatsContainer: {
    flex: 1,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4,
    gap: 4,
  },
  seat: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: "#4A4A4A",
    justifyContent: "center",
    alignItems: "center",
  },
  emptySeat: {
    width: 24,
    height: 24,
  },
  seatVip: {
    backgroundColor: "#FF8C42",
  },
  seatCouple: {
    backgroundColor: "#FF3B8F",
  },
  seatBooked: {
    backgroundColor: "#6C47DB",
  },
  seatSelected: {
    backgroundColor: "#6C47DB",
    borderWidth: 2,
    borderColor: "#fff",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  legendText: {
    color: "#fff",
    fontSize: 12,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  priceInfo: {
    marginBottom: 12,
  },
  movieTitleBottom: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  seatInfo: {
    color: "#888",
    fontSize: 14,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C47DB",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonDisabled: {
    backgroundColor: "#2A2A2A",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
