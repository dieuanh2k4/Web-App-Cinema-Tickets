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
import { NOW_PLAYING_MOVIES } from "../../constants/mockData";

const { width: windowWidth } = Dimensions.get("window");

export default function NowPlayingScreen() {
  const [movies, setMovies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = () => {
    setRefreshing(true);
    // TODO: Thay thế bằng API call thực
    // try {
    //   const response = await fetch('/api/movies/now-playing');
    //   const moviesData = await response.json();
    //   setMovies(moviesData);
    // } catch (error) {
    //   console.error('Error loading movies:', error);
    // } finally {
    //   setRefreshing(false);
    // }

    // Mock data
    setTimeout(() => {
      setMovies(NOW_PLAYING_MOVIES);
      setRefreshing(false);
    }, 500);
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
      <Image source={{ uri: item.posterUrl }} style={styles.poster} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.movieGenre} numberOfLines={1}>
          {item.genre}
        </Text>
        <Text style={styles.movieDuration}>{item.duration}</Text>
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đang Chiếu</Text>
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
    paddingVertical: 15,
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
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poster: {
    width: 80,
    height: 120,
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
    marginBottom: 4,
  },
  movieGenre: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 4,
  },
  movieDuration: {
    color: "#999999",
    fontSize: 12,
    marginBottom: 8,
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
