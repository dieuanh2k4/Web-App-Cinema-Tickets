import { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MOCK_SEAT_LAYOUTS } from "../../constants/mockData";

const formatCurrency = (value) => {
  if (!value) return "0đ";
  return `${value.toLocaleString("vi-VN")}đ`;
};

export default function SelectSeatScreen() {
  const router = useRouter();
  const { showtimeId } = useLocalSearchParams();
  const seatLayout = MOCK_SEAT_LAYOUTS[showtimeId];
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatLookup = useMemo(() => {
    if (!seatLayout) return {};
    return seatLayout.rows.reduce((acc, row) => {
      row.seats.forEach((seat) => {
        if (seat) {
          acc[seat.code] = seat;
        }
      });
      return acc;
    }, {});
  }, [seatLayout]);

  if (!seatLayout) {
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

  const toggleSeat = (seatCode) => {
    const seat = seatLookup[seatCode];
    if (!seat || seat.status === "booked") return;

    setSelectedSeats((prev) =>
      prev.includes(seatCode)
        ? prev.filter((code) => code !== seatCode)
        : [...prev, seatCode]
    );
  };

  const selectedSeatCount = selectedSeats.reduce(
    (total, code) => total + (seatLookup[code]?.span || 1),
    0
  );

  const totalPrice = selectedSeats.reduce((sum, code) => {
    const seatInfo = seatLookup[code];
    if (!seatInfo) return sum;
    const seatPrice = seatLayout.priceByType[seatInfo.type] || 0;
    const multiplier = seatInfo.span || 1;
    return sum + seatPrice * multiplier;
  }, 0);

  const sortedSeats = [...selectedSeats].sort((a, b) => a.localeCompare(b));

  const seatStatusLegend = [
    {
      label: "Đang chọn",
      style: { backgroundColor: "#F5B301", borderColor: "#F5B301" },
    },
    {
      label: "Ghế VIP",
      style: { backgroundColor: "#2C1F4F", borderColor: "#6C47DB" },
    },
    {
      label: "Ghế thường",
      style: { backgroundColor: "#2E2E2E", borderColor: "#444444" },
    },
    {
      label: "Ghế đôi",
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
            <Text style={styles.movieTitle}>{seatLayout.movieTitle}</Text>
            <Text style={styles.movieMeta}>
              {seatLayout.theaterName} • {seatLayout.roomName}
            </Text>
            <Text style={styles.movieMeta}>
              {seatLayout.startTime} • {seatLayout.date}
            </Text>
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
              <View key={`label-${row.label}`} style={styles.rowLabelBox}>
                <Text style={styles.rowLabelText}>{row.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.seatMatrix}>
            {seatLayout.rows.map((row) => (
              <View key={row.label} style={styles.seatRow}>
                {row.seats.map((seat, index) =>
                  seat ? (
                    <Pressable
                      key={seat.code}
                      style={[
                        styles.seatBase,
                        seat.type === "vip" && styles.seatVip,
                        seat.type === "couple" && styles.seatCouple,
                        seat.status === "booked" && styles.seatBooked,
                        selectedSeats.includes(seat.code) &&
                          seat.status !== "booked" &&
                          styles.seatSelected,
                        seat.span === 2 && styles.seatDouble,
                      ]}
                      disabled={seat.status === "booked"}
                      onPress={() => toggleSeat(seat.code)}
                    >
                      <Text style={styles.seatText}>
                        {seat.code.replace(/[A-Z]/g, "")}
                      </Text>
                    </Pressable>
                  ) : (
                    <View
                      key={`space-${row.label}-${index}`}
                      style={styles.spacer}
                    />
                  )
                )}
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
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    flexDirection: "row",
    gap: 12,
  },
  rowLabelsColumn: {
    justifyContent: "space-between",
    paddingVertical: 4,
    gap: 12,
  },
  rowLabelBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
  },
  rowLabelText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  seatMatrix: {
    flex: 1,
    paddingLeft: 4,
    gap: 12,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  seatBase: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#2E2E2E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444444",
  },
  seatVip: {
    backgroundColor: "#2C1F4F",
    borderColor: "#6C47DB",
  },
  seatCouple: {
    backgroundColor: "#3A1C24",
    borderColor: "#FF6B81",
  },
  seatDouble: {
    width: 72,
  },
  seatBooked: {
    backgroundColor: "#151515",
    borderColor: "#2A2A2A",
  },
  seatSelected: {
    backgroundColor: "#F5B301",
    borderColor: "#F5B301",
  },
  seatText: {
    color: "#FFFFFF",
    fontSize: 12,
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
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
  },
  legendLabel: {
    color: "#9CA3AF",
    fontSize: 12,
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
