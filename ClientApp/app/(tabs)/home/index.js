import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { MovieCard } from "../../../components/MovieCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  NOW_PLAYING_MOVIES,
  UPCOMING_MOVIES,
} from "../../../constants/mockData";

export default function HomeScreen() {
  const [movies, setMovies] = useState({
    featured: [],
    nowPlaying: [],
    upcoming: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    loadMovies();

    // auto scroll
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
  }, [activeSlide]);

  const loadMovies = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMovies({
      featured: NOW_PLAYING_MOVIES.slice(0, 5),
      nowPlaying: NOW_PLAYING_MOVIES,
      upcoming: UPCOMING_MOVIES,
    });
    setRefreshing(false);
  };

  const renderFeaturedItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.featuredItem, { width: windowWidth }]}
      onPress={() => handleMoviePress(item.id)}
    >
      <Image
        source={{ uri: item.poster }}
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

  const handleRefresh = () => {
    setRefreshing(true);
    loadMovies();
  };

  const handleMoviePress = (movieId) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movieId },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#E31C25"
          colors={["#E31C25"]}
        />
      }
    >
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
              event.nativeEvent.contentOffset.x / windowWidth
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

      {/* Đang Chiếu */}
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
              movie={movie}
              onPress={() => handleMoviePress(movie.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* sắp chiếu */}
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
              movie={movie}
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
    height: 300,
    marginBottom: 20,
  },
  featuredItem: {
    height: 300,
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
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featuredRating: {
    color: "#FFFFFF",
    fontSize: 16,
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
