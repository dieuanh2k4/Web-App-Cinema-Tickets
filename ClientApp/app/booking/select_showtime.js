import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { showtimeService } from "../../services/showtimeService";

export default function SelectShowtimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theaterId, movieId, movieTitle, theaterName } = params;

  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    generateDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadShowtimes();
    }
  }, [selectedDate, theaterId, movieId]);

  // Tạo danh sách 7 ngày từ hôm nay
  const generateDates = () => {
    const dateList = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateList.push(date);
    }

    setDates(dateList);
    setSelectedDate(dateList[0]);
  };

  const loadShowtimes = async () => {
    try {
      setLoading(true);
      const formattedDate = showtimeService.formatDateForBackend(selectedDate);
      const data = await showtimeService.getShowtimesByMovie(
        theaterId,
        movieId,
        formattedDate
      );

      // Lọc showtimes theo theater và movie
      const filteredShowtimes = data.filter(
        (st) =>
          st.theaterId?.toString() === theaterId?.toString() &&
          st.movieId?.toString() === movieId?.toString()
      );

      // Sắp xếp theo thời gian
      const sorted = filteredShowtimes.sort((a, b) => {
        const timeA = new Date(a.start || a.startTime);
        const timeB = new Date(b.start || b.startTime);
        return timeA - timeB;
      });

      setShowtimes(sorted);
    } catch (error) {
      console.error("Error loading showtimes:", error);
      Alert.alert("Lỗi", "Không thể tải suất chiếu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  };

  const formatDayOfWeek = (date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSelectShowtime = (showtime) => {
    router.push({
      pathname: "/booking/select_seat",
      params: {
        showtimeId: showtime.id,
        movieTitle: movieTitle,
        theaterName: theaterName,
        showtime: formatTime(showtime.start || showtime.startTime),
        date: selectedDate.toISOString().split("T")[0],
        roomName: showtime.roomName || `Phòng ${showtime.roomId}`,
      },
    });
  };

  const renderDateItem = ({ item }) => {
    const isSelected =
      selectedDate && item.toDateString() === selectedDate.toDateString();

    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.dateItemSelected]}
        onPress={() => setSelectedDate(item)}
      >
        <Text style={[styles.dayOfWeek, isSelected && styles.dateTextSelected]}>
          {formatDayOfWeek(item)}
        </Text>
        <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
          {formatDate(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderShowtimeItem = ({ item }) => {
    const startTime = formatTime(item.start || item.startTime);
    const endTime = formatTime(item.end || item.endTime);

    return (
      <TouchableOpacity
        style={styles.showtimeCard}
        onPress={() => handleSelectShowtime(item)}
      >
        <View style={styles.showtimeInfo}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={20} color="#6C47DB" />
            <Text style={styles.timeText}>
              {startTime} - {endTime}
            </Text>
          </View>

          <View style={styles.roomContainer}>
            <Ionicons name="film-outline" size={18} color="#666" />
            <Text style={styles.roomText}>
              {item.roomName || `Phòng ${item.roomId}`}
            </Text>
          </View>

          {item.availableSeats !== undefined && (
            <View style={styles.seatsContainer}>
              <Ionicons name="people-outline" size={18} color="#666" />
              <Text style={styles.seatsText}>
                Còn {item.availableSeats || 0} ghế
              </Text>
            </View>
          )}
        </View>

        <Ionicons name="chevron-forward" size={24} color="#6C47DB" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{movieTitle}</Text>
          <Text style={styles.headerSubtitle}>{theaterName}</Text>
        </View>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dates}
          renderItem={renderDateItem}
          keyExtractor={(item) => item.toISOString()}
          contentContainerStyle={styles.dateList}
        />
      </View>

      {/* Showtimes List */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C47DB" />
            <Text style={styles.loadingText}>Đang tải suất chiếu...</Text>
          </View>
        ) : showtimes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              Không có suất chiếu trong ngày này
            </Text>
            <Text style={styles.emptySubtext}>Vui lòng chọn ngày khác</Text>
          </View>
        ) : (
          <FlatList
            data={showtimes}
            renderItem={renderShowtimeItem}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            contentContainerStyle={styles.showtimesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#6C47DB",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  dateSelector: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dateList: {
    paddingHorizontal: 12,
  },
  dateItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    minWidth: 60,
    alignItems: "center",
  },
  dateItemSelected: {
    backgroundColor: "#6C47DB",
  },
  dayOfWeek: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  dateTextSelected: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  showtimesList: {
    padding: 16,
  },
  showtimeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  showtimeInfo: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  roomContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  roomText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  seatsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
});
