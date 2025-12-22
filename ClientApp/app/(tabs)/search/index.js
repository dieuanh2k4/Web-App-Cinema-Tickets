import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { movieService } from "../../../services/movieService";
import { theaterService } from "../../../services/theaterService";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("movie"); // movie, theater
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, activeTab, movies, theaters]);

  const loadData = async () => {
    try {
      const [moviesData, theatersData] = await Promise.all([
        movieService.getAllMovies(),
        theaterService.getAllTheaters(),
      ]);
      setMovies(moviesData);
      setTheaters(theatersData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const filterData = () => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      // Hiển thị tất cả khi không có search
      if (activeTab === "movie") {
        setFilteredData(movies);
      } else {
        setFilteredData(theaters);
      }
      return;
    }

    // Tìm kiếm theo tab
    if (activeTab === "movie") {
      const filtered = movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          movie.genre.toLowerCase().includes(query) ||
          movie.director.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    } else {
      const filtered = theaters.filter(
        (theater) =>
          theater.name.toLowerCase().includes(query) ||
          theater.address.toLowerCase().includes(query) ||
          theater.city.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
  };
  const renderMovieItem = (movie) => (
    <Pressable
      key={movie.id}
      style={styles.movieCard}
      onPress={() =>
        router.push({
          pathname: "/movies/detail",
          params: { movieId: movie.id },
        })
      }
    >
      <Image source={{ uri: movie.thumbnail }} style={styles.moviePoster} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.movieMeta}>
          {movie.duration} phút • {movie.genre}
        </Text>
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons name="star" size={16} color="#F5B301" />
          <Text style={styles.ratingText}>{movie.rating}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{movie.status}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderTheaterItem = (theater) => (
    <Pressable
      key={theater.id}
      style={styles.theaterCard}
      onPress={() =>
        router.push({
          pathname: "/(theaters)/theater_detail",
          params: { theaterId: theater.id },
        })
      }
    >
      <View style={styles.theaterHeader}>
        <MaterialCommunityIcons name="theater" size={32} color="#6C47DB" />
        <View style={styles.theaterInfo}>
          <Text style={styles.theaterName}>{theater.name}</Text>
          <Text style={styles.theaterAddress}>{theater.address}</Text>
          <Text style={styles.theaterCity}>{theater.city}</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#9CA3AF"
        />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm phim, rạp..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color="#9CA3AF"
            />
          </Pressable>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "movie" && styles.tabActive]}
          onPress={() => setActiveTab("movie")}
        >
          <MaterialCommunityIcons
            name="movie-open"
            size={20}
            color={activeTab === "movie" ? "#6C47DB" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "movie" && styles.tabTextActive,
            ]}
          >
            Phim
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === "theater" && styles.tabActive]}
          onPress={() => setActiveTab("theater")}
        >
          <MaterialCommunityIcons
            name="theater"
            size={20}
            color={activeTab === "theater" ? "#6C47DB" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "theater" && styles.tabTextActive,
            ]}
          >
            Rạp
          </Text>
        </Pressable>
      </View>

      {/* Results */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="magnify" size={64} color="#4B5563" />
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Không tìm thấy kết quả"
                : activeTab === "movie"
                ? "Tìm kiếm phim theo tên, thể loại, đạo diễn..."
                : "Tìm kiếm rạp theo tên, địa chỉ..."}
            </Text>
          </View>
        ) : (
          <>
            {activeTab === "movie" &&
              filteredData.map((movie) => renderMovieItem(movie))}
            {activeTab === "theater" &&
              filteredData.map((theater) => renderTheaterItem(theater))}
          </>
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
  header: {
    padding: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    gap: 6,
  },
  tabActive: {
    backgroundColor: "#6C47DB20",
    borderColor: "#6C47DB",
  },
  tabText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#6C47DB",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  // Movie Card
  movieCard: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  moviePoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  movieMeta: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: "#F5B301",
    fontSize: 14,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#6C47DB20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: {
    color: "#6C47DB",
    fontSize: 11,
    fontWeight: "600",
  },
  // Theater Card
  theaterCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  theaterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  theaterInfo: {
    flex: 1,
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  theaterAddress: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  theaterCity: {
    fontSize: 12,
    color: "#6B7280",
  },
  // Showtime Section
  showtimeSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#6C47DB",
  },
  showtimeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  showtimeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  showtimeTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C47DB",
    minWidth: 60,
  },
  showtimeDetails: {
    flex: 1,
  },
  showtimeMovie: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  showtimeTheater: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});
