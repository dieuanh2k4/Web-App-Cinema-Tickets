import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { userService } from "../../../services";

export default function TicketsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await userService.getMyTickets();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#0F0F0F", "#0F0F0F", "rgba(108, 71, 219, 0.15)"]}
        locations={[0, 0.7, 1]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Vé của tôi</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C47DB" />
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (bookings.length === 0) {
    return (
      <LinearGradient
        colors={["#0F0F0F", "#0F0F0F", "rgba(108, 71, 219, 0.15)"]}
        locations={[0, 0.7, 1]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Vé của tôi</Text>
          </View>

          <View style={styles.emptyContainer}>
            <View style={styles.trashIconWrapper}>
              <MaterialCommunityIcons
                name="delete-empty-outline"
                size={120}
                color="#3A3A3A"
              />
            </View>
            <Text style={styles.emptyTitle}>Chưa có giao dịch</Text>
            <Text style={styles.emptySubtitle}>
              Lịch sử đặt vé của bạn sẽ xuất hiện ở đây
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "upcoming":
        return { label: "Sắp tới", color: "#4CAF50", icon: "clock-outline" };
      case "used":
        return {
          label: "Đã sử dụng",
          color: "#888888",
          icon: "check-circle-outline",
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "#F44336",
          icon: "close-circle-outline",
        };
      default:
        return {
          label: "Unknown",
          color: "#888888",
          icon: "help-circle-outline",
        };
    }
  };

  const TicketCard = ({ booking }) => {
    const statusInfo = getStatusInfo(booking.status);

    return (
      <TouchableOpacity style={styles.ticketCard} activeOpacity={0.7}>
        <View style={styles.ticketContent}>
          <Image
            source={{ uri: booking.poster }}
            style={styles.posterImage}
            resizeMode="cover"
          />

          <View style={styles.ticketInfo}>
            <View style={styles.ticketHeader}>
              <Text style={styles.movieTitle} numberOfLines={1}>
                {booking.movieTitle}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusInfo.color + "20" },
                ]}
              >
                <MaterialCommunityIcons
                  name={statusInfo.icon}
                  size={12}
                  color={statusInfo.color}
                />
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color="#888888"
              />
              <Text style={styles.detailText}>{booking.theater}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="door-open"
                size={16}
                color="#888888"
              />
              <Text style={styles.detailText}>{booking.room}</Text>
            </View>

            <View style={styles.timeSeatsRow}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={16}
                  color="#888888"
                />
                <Text style={styles.detailText}>
                  {booking.date} - {booking.time}
                </Text>
              </View>
            </View>

            <View style={styles.seatsRow}>
              <MaterialCommunityIcons
                name="seat-outline"
                size={16}
                color="#888888"
              />
              <Text style={styles.detailText}>
                Ghế: {booking.seats.join(", ")}
              </Text>
            </View>

            <View style={styles.ticketFooter}>
              <View style={styles.bookingCodeContainer}>
                <Text style={styles.bookingCodeLabel}>Mã đặt vé:</Text>
                <Text style={styles.bookingCode}>{booking.bookingCode}</Text>
              </View>
              <Text style={styles.priceText}>
                {booking.totalAmount.toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ticketPerforation}>
          {[...Array(20)].map((_, i) => (
            <View key={i} style={styles.perforationDot} />
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={["#0F0F0F", "#0F0F0F", "rgba(108, 71, 219, 0.15)"]}
      locations={[0, 0.7, 1]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vé của tôi</Text>
          <Text style={styles.headerSubtitle}>{bookings.length} vé</Text>
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {bookings.map((booking) => (
            <TicketCard key={booking.id} booking={booking} />
          ))}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888888",
    marginTop: 4,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  ticketCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ticketContent: {
    flexDirection: "row",
    padding: 16,
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
  },
  ticketInfo: {
    flex: 1,
    marginLeft: 16,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#CCCCCC",
  },
  timeSeatsRow: {
    marginTop: 2,
  },
  seatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  bookingCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bookingCodeLabel: {
    fontSize: 11,
    color: "#888888",
  },
  bookingCode: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C47DB",
    letterSpacing: 0.5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
  },
  ticketPerforation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#0F0F0F",
  },
  perforationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2A2A2A",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  trashIconWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    borderWidth: 2,
    borderColor: "#2A2A2A",
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#888888",
    textAlign: "center",
    lineHeight: 22,
  },
  scrollContent: {
    flex: 1,
  },
});
