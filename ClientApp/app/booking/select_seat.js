import { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { seatService } from "@/services/bookingService";
import { movieService } from "@/services/movieService";
import { showtimeService } from "@/services/showtimeService";

const formatCurrency = (value) => {
  if (!value) return "0đ";
  return `${value.toLocaleString("vi-VN")}đ`;
};

export default function SelectSeatScreen() {
  const router = useRouter();
  const { showtimeId, movieId, roomId } = useLocalSearchParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Lấy thông tin showtime, movie, room từ backend
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [room, setRoom] = useState(null);
  const [theater, setTheater] = useState(null);

  // Load seats khi component mount
  useEffect(() => {
    loadSeats();
  }, [showtimeId, roomId]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        // Load movie
        if (movieId) {
          const mv = await movieService.getMovieById(parseInt(movieId));
          setMovie(mv);
        }

        // Load showtime and related room/theater
        if (showtimeId) {
          const all = await showtimeService.getAllShowtimes();
          const st = all.find((s) => Number(s.id) === parseInt(showtimeId));
          setShowtime(st || null);
          if (st) {
            setRoom(st.rooms || { id: st.roomId, name: st.roomName });
            setTheater(st.theater || null);
          }
        }
      } catch (e) {
        console.error("Error loading meta info:", e);
      }
    };
    loadMeta();
  }, [showtimeId, movieId]);

  const loadSeats = async () => {
    try {
      setLoading(true);
      const roomIdToUse = showtime?.roomId || parseInt(roomId);
      const availableSeats = await seatService.getAvailableSeats(
        parseInt(showtimeId),
        roomIdToUse
      );
      setSeats(availableSeats);
    } catch (error) {
      console.error("Error loading seats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tạo sơ đồ ghế từ danh sách seats
  const seatLayout = useMemo(() => {
    if (!seats.length) return null;

    // Group seats by row
    const rowMap = {};
    seats.forEach((seat) => {
      const row = seat.name.charAt(0); // A, B, C, D, E
      if (!rowMap[row]) {
        rowMap[row] = [];
      }
      rowMap[row].push(seat);
    });

    // Sort seats in each row by column number
    Object.keys(rowMap).forEach((row) => {
      rowMap[row].sort((a, b) => {
        const colA = parseInt(a.name.substring(1));
        const colB = parseInt(b.name.substring(1));
        return colA - colB;
      });
    });

    const rows = Object.keys(rowMap)
      .sort()
      .map((rowLetter) => ({
        row: rowLetter,
        seats: rowMap[rowLetter],
      }));

    return {
      screenType: room?.type || "2D",
      rows: rows,
    };
  }, [seats, room]);

  const seatLookup = useMemo(() => {
    return seats.reduce((acc, seat) => {
      acc[seat.name] = seat;
      return acc;
    }, {});
  }, [seats]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#6C47DB" />
          <Text style={styles.emptyTitle}>Đang tải sơ đồ ghế...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!seatLayout || !movie || !room) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="seat-outline"
            size={48}
            color="#6C47DB"
          />
          <Text style={styles.emptyTitle}>Không tìm thấy sơ đồ ghế</Text>
          <Text style={styles.emptySubtitle}>
            Vui lòng quay lại chọn rạp hoặc suất chiếu khác.
          </Text>
          <Pressable style={styles.emptyButton} onPress={() => router.back()}>
            <Text style={styles.emptyButtonText}>Quay lại</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const toggleSeat = (seatName) => {
    const seat = seatLookup[seatName];
    if (!seat || seat.status === "Đã đặt") return;

    setSelectedSeats((prev) =>
      prev.includes(seatName)
        ? prev.filter((name) => name !== seatName)
        : [...prev, seatName]
    );
  };

  const selectedSeatCount = selectedSeats.length;

  const totalPrice = selectedSeats.reduce((sum, seatName) => {
    const seat = seatLookup[seatName];
    return sum + (seat?.price || 0);
  }, 0);

  const sortedSeats = [...selectedSeats].sort((a, b) => a.localeCompare(b));

  const seatStatusLegend = [
    {
      label: "Đang chọn",
      style: { backgroundColor: "#F5B301", borderColor: "#F5B301" },
    },
    {
      label: "Ghế VIP (100k)",
      style: { backgroundColor: "#2C1F4F", borderColor: "#6C47DB" },
    },
    {
      label: "Ghế thường (70k)",
      style: { backgroundColor: "#2E2E2E", borderColor: "#444444" },
    },
    {
      label: "Ghế đôi (75k/ghế)",
      style: { backgroundColor: "#3A1C24", borderColor: "#FF6B81" },
    },
    {
      label: "Đã đặt",
      style: { backgroundColor: "#151515", borderColor: "#2A2A2A" },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentGap}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#FFFFFF"
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieMeta}>
              {theater?.name} • {room.name}
            </Text>
            {showtime && (
              <Text style={styles.movieMeta}>
                {showtime.start} • {showtime.date}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.screenWrapper}>
          <View style={styles.screen}>
            <Text style={styles.screenLabel}>Màn hình</Text>
          </View>
        </View>

        <View style={styles.seatGrid}>
          <View style={styles.rowLabelsColumn}>
            {seatLayout.rows.map((row) => (
              <View key={`label-${row.row}`} style={styles.rowLabelBox}>
                <Text style={styles.rowLabelText}>{row.row}</Text>
              </View>
            ))}
          </View>
          <View style={styles.seatMatrix}>
            {seatLayout.rows.map((row) => (
              <View key={row.row} style={styles.seatRow}>
                {row.seats.map((seat) => (
                  <Pressable
                    key={seat.id}
                    style={[
                      styles.seatBase,
                      seat.type === "VIP" && styles.seatVip,
                      seat.isCoupleEligible && styles.seatCoupleEligible,
                      seat.status === "Đã đặt" && styles.seatBooked,
                      selectedSeats.includes(seat.name) &&
                        seat.status !== "Đã đặt" &&
                        styles.seatSelected,
                    ]}
                    disabled={seat.status === "Đã đặt"}
                    onPress={() => toggleSeat(seat.name)}
                  >
                    <Text style={styles.seatText}>
                      {seat.name.replace(/[A-Z]/g, "")}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.legend}>
          {seatStatusLegend.map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendSeat, item.style]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.summary}>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryLabel}>Ghế đã chọn</Text>
          <Text style={styles.summaryValue}>
            {sortedSeats.length ? sortedSeats.join(", ") : "Chưa chọn"}
          </Text>
          <Text style={styles.summaryMeta}>
            {selectedSeatCount} ghế • {seatLayout.screenType}
          </Text>
        </View>
        <View style={styles.summaryAction}>
          <Text style={styles.totalLabel}>Tổng</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
          <Pressable
            style={[
              styles.confirmButton,
              selectedSeats.length === 0 && styles.confirmButtonDisabled,
            ]}
            disabled={selectedSeats.length === 0}
            onPress={() => {
              if (selectedSeats.length > 0) {
                router.push({
                  pathname: "/booking/payment_method",
                  params: {
                    movieTitle: movie.title,
                    theaterName: theater?.name,
                    roomName: room.name,
                    date:
                      showtime?.date || new Date().toISOString().split("T")[0],
                    time: showtime?.start || "00:00",
                    seats: sortedSeats.join(", "),
                    totalAmount: totalPrice,
                    showtimeId: showtimeId,
                  },
                });
              }
            }}
          >
            <Text style={styles.confirmButtonText}>
              {selectedSeats.length === 0
                ? "Chọn ghế"
                : `Đặt ${selectedSeatCount} ghế`}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  contentGap: {
    paddingBottom: 220,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },
  movieTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  movieMeta: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 2,
  },
  screenWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  screen: {
    width: "80%",
    height: 40,
    backgroundColor: "#1F1F1F",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  screenLabel: {
    color: "#9CA3AF",
    letterSpacing: 1.5,
  },
  seatGrid: {
    backgroundColor: "#141414",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    flexDirection: "row",
    gap: 8,
  },
  rowLabelsColumn: {
    justifyContent: "space-around",
    paddingVertical: 4,
    minWidth: 36,
    marginRight: 4,
  },
  rowLabelBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#6C47DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    marginVertical: 3,
  },
  rowLabelText: {
    color: "#6C47DB",
    fontWeight: "800",
    fontSize: 15,
  },
  seatMatrix: {
    flex: 1,
    paddingLeft: 8,
    gap: 6,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 3,
  },
  seatBase: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#2E2E2E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444444",
  },
  seatVip: {
    backgroundColor: "#2C1F4F",
    borderColor: "#6C47DB",
    borderWidth: 1.5,
  },
  seatCoupleEligible: {
    backgroundColor: "#3A1C24",
    borderColor: "#FF6B81",
    borderWidth: 1.5,
  },
  seatBooked: {
    backgroundColor: "#151515",
    borderColor: "#2A2A2A",
    opacity: 0.5,
  },
  seatSelected: {
    backgroundColor: "#F5B301",
    borderColor: "#F5B301",
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  seatText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  spacer: {
    width: 16,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSeat: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  legendLabel: {
    color: "#E5E7EB",
    fontSize: 13,
    fontWeight: "500",
  },
  summary: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#141414",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#1F1F1F",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    color: "#9CA3AF",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  summaryMeta: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  summaryAction: {
    width: 160,
    alignItems: "flex-end",
  },
  totalLabel: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  totalValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#6C47DB",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#2A2A2A",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
    backgroundColor: "#0A0A0A",
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  emptySubtitle: {
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6C47DB",
    marginTop: 8,
  },
  emptyButtonText: {
    color: "#6C47DB",
    fontWeight: "600",
  },
});
