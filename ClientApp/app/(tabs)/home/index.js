import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MovieCard } from "../../../components/MovieCard";
import { movieService } from "../../../services/movieService";

export default function HomeScreen() {
  const [movies, setMovies] = useState({
    featured: [],
    nowPlaying: [],
    upcoming: [],
  });
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();
  const windowWidth = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (movies.featured.length > 0) {
        const nextSlide = (activeSlide + 1) % movies.featured.length;
        flatListRef.current?.scrollToIndex({
          index: nextSlide,
          animated: true,
        });
        setActiveSlide(nextSlide);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSlide, movies.featured]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [nowPlaying, upcoming] = await Promise.all([
        movieService.getNowPlaying(),
        movieService.getUpcoming(),
      ]);
      setMovies({
        featured: nowPlaying.slice(0, 3),
        nowPlaying,
        upcoming,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading movies:", error);
      setLoading(false);
    }
  };

  const handleMoviePress = (movieId) => {
    router.push({
      pathname: "/movies/detail",
      params: { id: movieId },
    });
  };

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.featuredItem, { width: windowWidth - 32 }]}
      onPress={() => handleMoviePress(item.id)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0F0F0F", "#0F0F0F", "#260d71ff"]}
        locations={[0, 0.7, 1]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <Image
            source={require("../../../assets/icons/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Section: Nổi bật */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <View style={styles.dotIndicator} />
              <Text style={styles.sectionTitle}>Nổi bật</Text>
            </View>
            <View style={styles.featuredContainer}>
              <FlatList
                ref={flatListRef}
                data={movies.featured}
                renderItem={renderFeaturedItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const slideIndex = Math.round(
                    event.nativeEvent.contentOffset.x / (windowWidth - 32)
                  );
                  setActiveSlide(slideIndex);
                }}
              />
              <View style={styles.paginationDots}>
                {movies.featured.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          index === activeSlide
                            ? "#6C47DB"
                            : "rgba(255,255,255,0.3)",
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Section: Phim đang chiếu */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderContainer}>
                <View style={styles.dotIndicator} />
                <Text style={styles.sectionTitle}>Phim đang chiếu</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/movies/now-playing")}
              >
                <Text style={styles.viewAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.movieList}
            >
              {movies.nowPlaying.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  poster={movie.thumbnail}
                  onPress={() => handleMoviePress(movie.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Section: Phim sắp chiếu */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderContainer}>
                <View style={styles.dotIndicator} />
                <Text style={styles.sectionTitle}>Phim sắp chiếu</Text>
              </View>
              <TouchableOpacity onPress={() => router.push("/movies/upcoming")}>
                <Text style={styles.viewAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.movieList}
            >
              {movies.upcoming.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  poster={movie.thumbnail}
                  onPress={() => handleMoviePress(movie.id)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 10,
    backgroundColor: "transparent",
  },
  headerIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  headerTitlePurple: {
    color: "#6C47DB",
  },
  section: {
    marginTop: 20,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: "#6C47DB",
  },
  featuredContainer: {
    height: 200,
    marginHorizontal: 16,
  },
  featuredItem: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  paginationDots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  movieList: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});
