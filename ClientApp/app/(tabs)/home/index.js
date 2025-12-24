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
        source={{ uri: item.posterUrl }}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title, onSeeAll) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>Xem thêm</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="#6C47DB"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Image
          source={require("../../../assets/icons/logo.png")}
          style={styles.logo}
        />
        <TouchableOpacity
          style={styles.accountIcon}
          onPress={() => router.push("/(tabs)/account")}
        >
          <MaterialCommunityIcons
            name="account-circle"
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>
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
                    index === activeSlide ? "#6C47DB" : "#FFFFFF",
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* now playing */}
      <View style={styles.section}>
        {renderSectionHeader("Đang Chiếu", () =>
          router.push("/movies/now-playing")
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieList}
        >
          {movies.nowPlaying.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              poster={movie.posterUrl}
              onPress={() => handleMoviePress(movie.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* upcoming */}
      <View style={styles.section}>
        {renderSectionHeader("Sắp Chiếu", () =>
          router.push("/movies/upcoming")
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieList}
        >
          {movies.upcoming.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              poster={movie.posterUrl}
              onPress={() => handleMoviePress(movie.id)}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },

  featuredContainer: {
    height: 250,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#1A1A1A",
  },
  headerSpacer: {
    width: 32,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  accountIcon: {
    padding: 4,
  },
  featuredItem: {
    height: 250,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  paginationDots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: "#6C47DB",
    fontSize: 14,
    marginRight: 4,
  },
  movieList: {
    paddingRight: 16,
  },
});
