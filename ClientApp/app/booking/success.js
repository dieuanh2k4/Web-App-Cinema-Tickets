import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { bookingService } from "../../services";

export default function BookingSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookingDetails();
  }, []);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      // Lấy thông tin booking từ backend bằng ticketId
      const response = await bookingService.getTicketById(params.ticketId);
      console.log("Ticket details:", response);
      setBookingDetails(response?.data || response);
    } catch (error) {
      console.error("Error loading booking details:", error);
      // Nếu không lấy được từ backend, dùng data từ params
      setBookingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = () => {
    // Chuyển đến màn hình chi tiết vé
    router.push({
      pathname: "/(tabs)/tickets",
    });
  };

  const handleGoHome = () => {
    router.replace("/(tabs)/home");
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#6C47DB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Icon */}
      <View style={styles.successSection}>
        <View style={styles.checkmarkContainer}>
          <MaterialCommunityIcons name="check" size={48} color="#FFF" />
        </View>
        <Text style={styles.successTitle}>Thanh toán thành công</Text>
      </View>

      {/* Ticket Card */}
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Image
            source={{
              uri:
                params.movieThumbnail || "https://via.placeholder.com/100x140",
            }}
            style={styles.moviePoster}
            resizeMode="cover"
          />
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {bookingDetails?.movieTitle || params.movieTitle || "Phim"}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ageRating}>13+</Text>
              <Text style={styles.subtitle}>SUB/VIETNAMESE</Text>
            </View>
            <Text style={styles.genre}>Lịch sử, Hành động</Text>
            <Text style={styles.duration}>2 hr 44min</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Booking Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ngày</Text>
            <Text style={styles.detailValue}>
              {bookingDetails?.date || params.date || "20/09/2025"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phòng chiếu</Text>
            <Text style={styles.detailValue}>
              {bookingDetails?.roomName || params.roomName || "Phòng"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian</Text>
            <Text style={styles.detailValue}>
              {bookingDetails?.startTime || params.showtime || "21:15"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ghế</Text>
            <Text style={styles.detailValue}>
              {bookingDetails?.seats?.map((s) => s.seatName).join(", ") ||
                params.seats ||
                "H2, H3"}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleViewTicket}>
        <Text style={styles.primaryButtonText}>Xem vé</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
        <Text style={styles.secondaryButtonText}>Quay về trang chủ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  successSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6C47DB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
  },
  ticketCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  ticketHeader: {
    flexDirection: "row",
    marginBottom: 20,
  },
  moviePoster: {
    width: 100,
    height: 140,
    borderRadius: 12,
    marginRight: 16,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ageRating: {
    backgroundColor: "#6C47DB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
    marginRight: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genre: {
    fontSize: 14,
    color: "#CCC",
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: "#999",
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginBottom: 20,
  },
  detailsSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#999",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#6C47DB",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  secondaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
