import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { movieService } from "../../services/movieService";
import { showtimeService } from "../../services/showtimeService";
import { theaterService } from "../../services/theaterService";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    loadMovieDetail();
  }, [id]);

  const loadMovieDetail = async () => {
    try {
      setLoading(true);
      const movieData = await movieService.getMovieById(id);
      setMovie(movieData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading movie detail:", error);
      setLoading(false);
    }
  };

  const handleBookTicket = () => {
    if (!movie) return;

    console.log("🎬 Movie object:", movie);
    console.log("🎬 Movie title:", movie.title);
    console.log("🎬 Movie name:", movie.name);

    // Chuyển đến màn hình chọn rạp với thông tin phim
    router.push({
      pathname: "/booking/select_cinema",
      params: {
        movieId: movie.id,
        movieTitle: movie.title || movie.name || "Phim",
      },
    });
  };

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: movie.backdropUrl || movie.posterUrl }}
            style={styles.backdropImage}
            resizeMode="cover"
          />

          <View style={styles.backdropOverlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Thông tin phim overlay */}
          <View style={styles.movieInfoOverlay}>
            <View style={styles.posterContainer}>
              <Image
                source={{ uri: movie.posterUrl }}
                style={styles.posterImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.basicInfo}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.movieGenre}>{movie.genre}</Text>
              <View style={styles.movieMeta}>
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color="#CCCCCC"
                  />
                  <Text style={styles.metaText}>{movie.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons
                    name="star"
                    size={16}
                    color="#FFD700"
                  />
                  <Text style={styles.metaText}>{movie.rating}/10</Text>
                </View>
              </View>
              {movie.releaseDate && (
                <Text style={styles.releaseDate}>
                  Khởi chiếu: {movie.releaseDate}
                </Text>
              )}
            </View>
          </View>
        </View>
        {/* Thông tin chi tiết */}
        <View style={styles.detailsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>
              {movie.description ||
                "Câu chuyện hấp dẫn về những nhân vật đầy cá tính trong một thế giới đầy màu sắc. Phim mang đến những trải nghiệm thị giác tuyệt vời và cốt truyện lôi cuốn."}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin phim</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Đạo diễn</Text>
                <Text style={styles.infoValue}>
                  {movie.director || "Đang cập nhật"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Diễn viên</Text>
                <Text style={styles.infoValue}>
                  {movie.cast || "Đang cập nhật"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Quốc gia</Text>
                <Text style={styles.infoValue}>
                  {movie.country || "Việt Nam"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ngôn ngữ</Text>
                <Text style={styles.infoValue}>
                  {movie.language || "Tiếng Việt"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bookButtonContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookTicket}>
          <MaterialCommunityIcons name="ticket" size={20} color="#FFFFFF" />
          <Text style={styles.bookButtonText}>Đặt vé ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    height: windowHeight * 0.5,
    position: "relative",
  },
  backdropImage: {
    width: "100%",
    height: "100%",
  },
  backdropOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  movieInfoOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  posterContainer: {
    marginRight: 16,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  basicInfo: {
    flex: 1,
    paddingBottom: 10,
  },
  movieTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  movieGenre: {
    color: "#CCCCCC",
    fontSize: 16,
    marginBottom: 12,
  },
  movieMeta: {
    flexDirection: "row",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 4,
  },
  releaseDate: {
    color: "#6C47DB",
    fontSize: 14,
    fontWeight: "600",
  },
  detailsContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    color: "#CCCCCC",
    fontSize: 16,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    marginBottom: 16,
  },
  infoLabel: {
    color: "#999999",
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  ratingSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
  },
  ratingDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingNumber: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  ratingTotal: {
    color: "#CCCCCC",
    fontSize: 20,
  },
  ratingDescription: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
  },
  bookButtonContainer: {
    padding: 20,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  bookButton: {
    backgroundColor: "#6C47DB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  theaterCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  theaterHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  theaterInfo: {
    flex: 1,
    marginLeft: 12,
  },
  theaterName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  theaterAddress: {
    color: "#999999",
    fontSize: 14,
  },
  showtimesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  showtimeButton: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6C47DB",
    minWidth: 80,
    alignItems: "center",
  },
  showtimeTime: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  showtimeRoom: {
    color: "#999999",
    fontSize: 12,
  },
});
