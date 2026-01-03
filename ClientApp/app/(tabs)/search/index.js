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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { movieService, searchService } from "../../../services";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("all");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([{ id: "all", name: "TẤT CẢ" }]);
  const [filteredData, setFilteredData] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchQuery, activeGenre, movies]);

  const loadData = async () => {
    try {
      const moviesData = await movieService.getAllMovies();
      setMovies(moviesData);

      const uniqueGenres = [
        ...new Set(moviesData.map((m) => m.genre).filter(Boolean)),
      ];
      const genreList = [
        { id: "all", name: "TẤT CẢ" },
        ...uniqueGenres.map((g) => ({
          id: g.toLowerCase(),
          name: g.toUpperCase(),
        })),
      ];
      setGenres(genreList);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const filterData = async () => {
    const query = searchQuery.toLowerCase().trim();
    let filtered = movies;

    if (query) {
      try {
        setSearching(true);
        const searchResults = await searchService.searchMovieByName(query);
        filtered = searchResults;
      } catch (error) {
        console.error("Search error:", error);
        filtered = movies.filter(
          (movie) =>
            movie.title?.toLowerCase().includes(query) ||
            movie.genre?.toLowerCase().includes(query) ||
            movie.director?.toLowerCase().includes(query)
        );
      } finally {
        setSearching(false);
      }
    }

    if (activeGenre !== "all") {
      filtered = filtered.filter(
        (movie) => movie.genre?.toLowerCase() === activeGenre.toLowerCase()
      );
    }

    setFilteredData(filtered);
  };

  const getGenreCount = (genreId) => {
    if (genreId === "all") return movies.length;
    return movies.filter(
      (movie) => movie.genre?.toLowerCase() === genreId.toLowerCase()
    ).length;
  };
  const renderMovieItem = (movie) => (
    <Pressable
      key={movie.id}
      style={styles.movieCard}
      onPress={() =>
        router.push({
          pathname: "/movies/detail",
          params: { id: movie.id },
        })
      }
    >
      <Image source={{ uri: movie.posterUrl }} style={styles.moviePoster} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.movieMeta}>{movie.genre}</Text>
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
          <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
          <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
          <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
          <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
          <Text style={styles.ratingText}>({movie.rating || "5/5"})</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={["#0F0F0F", "#0F0F0F", "rgba(108, 71, 219, 0.15)"]}
      locations={[0, 0.7, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Genre Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
          >
            {genres.map((genre) => {
              const count = getGenreCount(genre.id);
              const isActive = activeGenre === genre.id;
              return (
                <Pressable
                  key={genre.id}
                  style={[styles.genreTab, isActive && styles.genreTabActive]}
                  onPress={() => setActiveGenre(genre.id)}
                >
                  <Text
                    style={[
                      styles.genreText,
                      isActive && styles.genreTextActive,
                    ]}
                  >
                    {genre.name}
                    {count > 0 && ` (${count})`}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Results Title */}
        {filteredData.length > 0 && (
          <Text style={styles.resultsTitle}>Kết quả tìm kiếm</Text>
        )}

        {/* Results */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="magnify" size={64} color="#444" />
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Không tìm thấy kết quả"
                  : "Tìm kiếm phim theo tên, thể loại..."}
              </Text>
            </View>
          ) : (
            filteredData.map((movie) => renderMovieItem(movie))
          )}
        </ScrollView>
      </SafeAreaView>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#000000",
    fontSize: 15,
  },
  tabContainer: {
    marginBottom: 16,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  genreTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    marginRight: 8,
  },
  genreTabActive: {
    backgroundColor: "#FFB800",
  },
  genreText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  genreTextActive: {
    color: "#000000",
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    color: "#666",
    fontSize: 15,
    marginTop: 16,
    textAlign: "center",
  },
  // Movie Card
  movieCard: {
    flexDirection: "row",
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  movieMeta: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    color: "#AAAAAA",
    fontSize: 13,
    marginLeft: 6,
  },
});
