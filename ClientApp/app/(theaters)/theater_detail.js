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
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theaterService } from "../../services/theaterService";
import { showtimeService } from "../../services/showtimeService";
import { movieService } from "../../services/movieService";

export default function TheaterDetailScreen() {
  const { theaterId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [theater, setTheater] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheaterDetail();
  }, [theaterId]);

  const loadTheaterDetail = async () => {
    try {
      setLoading(true);
      const theaterData = await theaterService.getTheaterById(theaterId);
      setTheater(theaterData);

      console.log("🏢 Theater data:", theaterData);

      // Load all showtimes for this theater
      const allShowtimes = await showtimeService.getAllShowtimes();
      console.log("🎞️ All showtimes:", allShowtimes);

      // Match by theater name instead of theaterId
      const theaterShowtimes = allShowtimes.filter((st) => {
        return st.theaterName === theaterData.name;
      });

      console.log("✅ Filtered showtimes for this theater:", theaterShowtimes);

      setShowtimes(theaterShowtimes);

      // Load movies for poster and details
      const allMovies = await movieService.getAllMovies();
      setMovies(allMovies);
    } catch (error) {
      console.error("Error loading theater detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tạo danh sách 7 ngày với format DD-MM-YYYY
  const [dates] = useState(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      list.push({
        date,
        label: `${day}-${month}-${year}`,
        fullDate: `${year}-${month}-${day}`, // For filtering
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

  const selectedDate = dates[selectedDateIndex];
  const selectedDateStr = selectedDate.fullDate; // Format: YYYY-MM-DD

  // Lọc suất chiếu theo ngày và nhóm theo phim
  const movieShowtimes = showtimes
    .filter((st) => {
      const showtimeDate = st.date?.split("T")[0] || st.date;
      return showtimeDate === selectedDateStr;
    })
    .reduce((acc, showtime) => {
      const movieId = showtime.movieId;
      const movie = movies.find((m) => m.id === movieId);
      const movieTitle =
        movie?.title || showtime.movieTitle || `Phim ${movieId}`;
      const moviePoster = movie?.posterUrl || null;
      const ageRating = movie?.ageRating || "P";

      if (!acc[movieId]) {
        acc[movieId] = {
          movieId,
          movieTitle,
          moviePoster,
          ageRating,
          showtimes: [],
        };
      }

      acc[movieId].showtimes.push({
        id: showtime.id,
        time: showtime.start?.substring(0, 5) || showtime.start,
        roomId: showtime.roomId,
        roomName: showtime.roomName || `Phòng ${showtime.roomId}`,
      });

      return acc;
    }, {});

  const moviesList = Object.values(movieShowtimes);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.theaterName} numberOfLines={1}>
            {theater.name}
          </Text>
          <View style={styles.addressRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color="#9CA3AF"
            />
            <Text style={styles.address} numberOfLines={2}>
              {theater.address}
            </Text>
          </View>
        </View>
      </View>

      {/* Date Selection - Horizontal Tabs */}
      <View style={styles.dateContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScrollContent}
        >
          {dates.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.dateTab,
                index === selectedDateIndex && styles.dateTabActive,
              ]}
              onPress={() => setSelectedDateIndex(index)}
            >
              <Text
                style={[
                  styles.dateTabText,
                  index === selectedDateIndex && styles.dateTabTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Movie Showtimes List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {moviesList.length > 0 ? (
          moviesList.map((movie) => (
            <View key={movie.movieId} style={styles.movieCard}>
              {/* Movie Info */}
              <View style={styles.movieInfo}>
                {/* Poster */}
                <View style={styles.posterContainer}>
                  {movie.moviePoster ? (
                    <Image
                      source={{ uri: movie.moviePoster }}
                      style={styles.poster}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.posterPlaceholder}>
                      <MaterialCommunityIcons
                        name="movie-open"
                        size={40}
                        color="#6C47DB"
                      />
                    </View>
                  )}
                </View>

                {/* Movie Details */}
                <View style={styles.movieDetails}>
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    {movie.movieTitle}
                  </Text>
                  <View style={styles.ageRatingBadge}>
                    <Text style={styles.ageRatingText}>{movie.ageRating}</Text>
                  </View>
                </View>
              </View>

              {/* Showtimes Grid */}
              <View style={styles.showtimesGrid}>
                {movie.showtimes.map((showtime, idx) => (
                  <Pressable
                    key={`${showtime.id}-${idx}`}
                    style={styles.timeButton}
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
                    <Text style={styles.timeButtonText}>{showtime.time}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-blank"
              size={64}
              color="#4A4A4A"
            />
            <Text style={styles.noShowtime}>Không có suất chiếu</Text>
            <Text style={styles.noShowtimeSubtext}>
              Vui lòng chọn ngày khác
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
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

  // Header Styles
  header: {
    backgroundColor: "#1C1C1C",
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  backButton: {
    padding: 4,
    marginRight: 12,
    marginTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  theaterName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  address: {
    fontSize: 13,
    color: "#9CA3AF",
    flex: 1,
    lineHeight: 18,
  },

  // Date Tabs Styles
  dateContainer: {
    backgroundColor: "#1C1C1C",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingVertical: 12,
  },
  dateScrollContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  dateTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#2A2A2A",
    borderRadius: 6,
    minWidth: 110,
    alignItems: "center",
  },
  dateTabActive: {
    backgroundColor: "#6C47DB",
  },
  dateTabText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
  },
  dateTabTextActive: {
    color: "#FFFFFF",
  },

  // Content Styles
  content: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },

  // Movie Card Styles
  movieCard: {
    backgroundColor: "#1C1C1C",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  movieInfo: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 12,
  },
  posterContainer: {
    width: 90,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#2A2A2A",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
  },
  movieDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "flex-start",
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    lineHeight: 22,
  },
  ageRatingBadge: {
    backgroundColor: "#FF6B6B",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ageRatingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Showtimes Grid Styles
  showtimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  timeButton: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#4A4A4A",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 70,
    alignItems: "center",
  },
  timeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Empty State Styles
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  noShowtime: {
    color: "#9CA3AF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  noShowtimeSubtext: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
