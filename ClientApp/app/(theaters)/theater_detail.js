import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theaterService } from "../../services/theaterService";
import { showtimeService } from "../../services/showtimeService";

export default function TheaterDetailScreen() {
  const { theaterId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [theater, setTheater] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheaterDetail();
  }, [theaterId]);

  const loadTheaterDetail = async () => {
    try {
      setLoading(true);
      const theaterData = await theaterService.getTheaterById(theaterId);
      setTheater(theaterData);

      // Load all showtimes for this theater
      const allShowtimes = await showtimeService.getAllShowtimes();
      const theaterShowtimes = allShowtimes.filter((st) => {
        // Filter by theater name (mockDataBackend uses theaterName)
        return st.theaterName === theaterData.name;
      });
      setShowtimes(theaterShowtimes);
    } catch (error) {
      console.error("Error loading theater detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tạo danh sách 7 ngày
  const [dates] = useState(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      const dayName = dayNames[date.getDay()];
      list.push({
        date,
        label:
          i === 0
            ? "Hôm nay"
            : i === 1
            ? "Ngày mai"
            : `${dayName}, ${date.getDate()}/${date.getMonth() + 1}`,
      });
    }
    return list;
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C47DB" />
          <Text style={styles.loadingText}>Đang tải thông tin rạp...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!theater) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#9CA3AF"
          />
          <Text style={styles.error}>Không tìm thấy rạp</Text>
          <Pressable
            style={styles.backButtonError}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const selectedDate = dates[selectedDateIndex].date;
  const selectedDateStr = selectedDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Lọc suất chiếu theo ngày và nhóm theo phim
  const movieShowtimes = showtimes
    .filter((st) => {
      // So sánh với date string từ backend (format: YYYY-MM-DD)
      return st.date === selectedDateStr;
    })
    .reduce((acc, showtime) => {
      const movieId = showtime.movieId;
      const movieTitle = showtime.movieTitle || `Phim ${movieId}`;

      if (!acc[movieId]) {
        acc[movieId] = {
          movieId,
          movieTitle,
          showtimes: [],
        };
      }

      acc[movieId].showtimes.push({
        id: showtime.id,
        start: showtime.start?.substring(0, 5) || showtime.start, // Format HH:mm
        end: showtime.end,
        roomId: showtime.roomId,
        roomType: showtime.roomName || `Phòng ${showtime.roomId}`,
      });

      return acc;
    }, {});

  const movies = Object.values(movieShowtimes);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.theaterName}>{theater.name}</Text>
          <Text style={styles.address}>{theater.address}</Text>
        </View>
      </View>

      {/* Date Selection */}
      <View style={styles.dateContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
        >
          {dates.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.dateButton,
                index === selectedDateIndex && styles.dateButtonActive,
              ]}
              onPress={() => setSelectedDateIndex(index)}
            >
              <Text
                style={[
                  styles.dateText,
                  index === selectedDateIndex && styles.dateTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Movie Showtimes */}
      <ScrollView style={styles.content}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <View key={movie.movieId} style={styles.movieSection}>
              <View style={styles.movieHeader}>
                <Text style={styles.movieTitle}>{movie.movieTitle}</Text>
                <MaterialCommunityIcons
                  name="movie-roll"
                  size={24}
                  color="#6C47DB"
                />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.showtimeList}
              >
                {movie.showtimes.map((showtime, idx) => (
                  <Pressable
                    key={`${showtime.id}-${idx}`}
                    style={styles.showtimeButton}
                    onPress={() => {
                      router.push({
                        pathname: "/booking/select_seat",
                        params: {
                          movieId: movie.movieId,
                          showtimeId: showtime.id,
                          theaterId,
                        },
                      });
                    }}
                  >
                    <Text style={styles.timeText}>{showtime.start}</Text>
                    <Text style={styles.roomText}>{showtime.roomType}</Text>
                    <Text style={styles.priceText}>{showtime.price}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={48}
              color="#6C47DB"
            />
            <Text style={styles.noShowtime}>Không có suất chiếu</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9CA3AF",
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  error: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  backButtonError: {
    backgroundColor: "#6C47DB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  dateContainer: {
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  dateList: {
    padding: 12,
  },
  dateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  dateButtonActive: {
    backgroundColor: "#6C47DB",
    borderColor: "#6C47DB",
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  dateTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  movieSection: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  movieHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
  },
  showtimeList: {
    paddingBottom: 8,
  },
  showtimeButton: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 100,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6C47DB",
  },
  timeText: {
    color: "#6C47DB",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  roomText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 4,
  },
  priceText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noShowtime: {
    color: "#9CA3AF",
    fontSize: 16,
    marginTop: 12,
  },
  error: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },
});
