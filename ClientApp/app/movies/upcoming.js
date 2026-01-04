import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MovieCard } from "../../components/MovieCard";
import { movieService } from "../../services/movieService";

const { width: windowWidth } = Dimensions.get("window");

export default function UpcomingScreen() {
  const [movies, setMovies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setRefreshing(true);
      const moviesData = await movieService.getUpcoming();
      setMovies(moviesData);
      setRefreshing(false);
    } catch (error) {
      console.error("Error loading movies:", error);
      setRefreshing(false);
    }
  };

  const handleMoviePress = (movieId) => {
    router.push({
      pathname: "/movies/detail",
      params: { id: movieId },
    });
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.movieItem}
      onPress={() => handleMoviePress(item.id)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.genreRow}>
          <MaterialCommunityIcons name="tag" size={14} color="#999" />
          <Text style={styles.movieGenre} numberOfLines={1}>
            {item.genre}
          </Text>
        </View>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons name="calendar" size={14} color="#6C47DB" />
          <Text style={styles.releaseDate}>
            Khởi chiếu: {new Date(item.startDate).toLocaleDateString("vi-VN")}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sắp Chiếu</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Movies List */}
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadMovies}
            tintColor="#E31C25"
            colors={["#E31C25"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  movieItem: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 12,
    marginRight: 16,
  },
  movieInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  movieTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  genreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  movieGenre: {
    color: "#CCCCCC",
    fontSize: 14,
    marginLeft: 6,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  releaseDate: {
    color: "#6C47DB",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
});
