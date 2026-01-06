// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   SectionList,
// } from "react-native";
// import { useRouter } from "expo-router";
// import {
//   MOCK_SHOWTIMES,
//   NOW_PLAYING_MOVIES,
// } from "../../../constants/mockData";

// export default function ScheduleScreen() {
//   const router = useRouter();

//   // Nhóm suất chiếu theo phim
//   const groupedShowtimes = NOW_PLAYING_MOVIES.map((movie) => {
//     const showtimes = MOCK_SHOWTIMES.filter(
//       (s) => s.MovieTitle === movie.title
//     ).map((s) => ({
//       ...s,
//       timeDisplay: new Date(s.Start).toLocaleTimeString("vi-VN", {
//         hour: "2-digit",
//         minute: "2-digit",
//         timeZone: "Asia/Ho_Chi_Minh",
//       }),
//     }));

//     return {
//       movie,
//       showtimes,
//     };
//   }).filter((item) => item.showtimes.length > 0);

//   const renderShowtimeItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.showtimeCard}
//       onPress={() =>
//         router.push({
//           pathname: "/(tabs)/booking",
//           params: {
//             showtimeId: item.Id,
//             movieTitle: item.MovieTitle,
//             theaterName: item.TheaterName,
//             roomName: item.RooomName,
//             time: item.timeDisplay,
//           },
//         })
//       }
//     >
//       <Text style={styles.time}>{item.timeDisplay}</Text>
//       <Text style={styles.room}>
//         {item.RooomName} • {item.RoomType}
//       </Text>
//       <Text style={styles.theater}>{item.TheaterName}</Text>
//     </TouchableOpacity>
//   );

//   const renderMovieSection = ({ item }) => (
//     <View style={styles.movieSection}>
//       <Text style={styles.movieTitle}>{item.movie.title}</Text>
//       <Text style={styles.movieInfo}>
//         {item.movie.duration} • {item.movie.genre}
//       </Text>
//       <FlatList
//         data={item.showtimes}
//         renderItem={renderShowtimeItem}
//         keyExtractor={(s) => s.Id.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.showtimeList}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Lịch Chiếu Hôm Nay</Text>
//       <SectionList
//         sections={[{ data: groupedShowtimes }]}
//         renderItem={renderMovieSection}
//         keyExtractor={(item) => item.movie.id.toString()}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>Không có suất chiếu nào hôm nay.</Text>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0a0a0a",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     padding: 16,
//     paddingTop: 20,
//     backgroundColor: "#1a1a1a",
//     color: "#ffffff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#6C47DB",
//   },
//   movieSection: {
//     backgroundColor: "#1a1a1a",
//     padding: 16,
//     marginBottom: 12,
//     marginHorizontal: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#2a2a2a",
//   },
//   movieTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#ffffff",
//     marginBottom: 4,
//   },
//   movieInfo: {
//     fontSize: 14,
//     color: "#9ca3af",
//     marginBottom: 12,
//   },
//   showtimeList: {
//     paddingRight: 16,
//   },
//   showtimeCard: {
//     backgroundColor: "#2a2a2a",
//     padding: 14,
//     borderRadius: 10,
//     marginRight: 12,
//     minWidth: 120,
//     borderWidth: 1,
//     borderColor: "#6C47DB",
//   },
//   time: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#6C47DB",
//     marginBottom: 6,
//   },
//   room: {
//     fontSize: 13,
//     color: "#d1d5db",
//     marginBottom: 4,
//   },
//   theater: {
//     fontSize: 12,
//     color: "#9ca3af",
//   },
//   emptyText: {
//     textAlign: "center",
//     padding: 20,
//     color: "#9ca3af",
//     fontStyle: "italic",
//     fontSize: 16,
//   },
// });

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theaterService } from "../../../services/theaterService";
import { showtimeService } from "../../../services/showtimeService";

const formatFeatures = (theater) =>
  [theater.city ? `Thành phố ${theater.city}` : "", "Rạp hiện đại"]
    .filter(Boolean)
    .slice(0, 4);

const formatDistance = (distance) => distance || "—";

export default function ScheduleScreen() {
  const router = useRouter();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTheaters();
  }, []);

  const loadTheaters = async () => {
    try {
      setLoading(true);
      const theatersData = await theaterService.getAllTheaters();

      // Load showtimes and group by theater
      const allShowtimes = await showtimeService.getAllShowtimes();

      // Add showtimes to each theater
      const theatersWithShowtimes = theatersData.map((theater) => {
        const theaterShowtimes = allShowtimes.filter(
          (st) => st.theaterName === theater.name
        );
        return {
          ...theater,
          showtimes: theaterShowtimes,
          showtimeCount: theaterShowtimes.length,
        };
      });

      setTheaters(theatersWithShowtimes);
    } catch (error) {
      console.error("Error loading theaters:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleShowtimePress = (theaterId, movieId, showtimeId) => {
    router.push({
      pathname: "/booking/select_seat",
      params: {
        theaterId: theaterId.toString(),
        movieId: movieId.toString(),
        showtimeId,
      },
    });
  };

  return (
    <LinearGradient
      colors={["#0F0F0F", "#0F0F0F", "rgba(108, 71, 219, 0.15)"]}
      locations={[0, 0.7, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.screenTitle}>Khám phá rạp phim</Text>
        <Text style={styles.screenSubtitle}>
          Chọn rạp yêu thích và suất chiếu phù hợp trong ngày
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C47DB" />
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadTheaters();
                }}
                tintColor="#6C47DB"
                colors={["#6C47DB"]}
              />
            }
          >
            {theaters.map((theater) => {
              return (
                <View
                  key={theater.id || theater.theaterId}
                  style={styles.theaterCard}
                >
                  {theater.imageUrl && (
                    <Image
                      source={{ uri: theater.imageUrl }}
                      style={styles.theaterImage}
                    />
                  )}
                  <View style={styles.cardBody}>
                    <View style={styles.headerRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.theaterName}>{theater.name}</Text>
                        <Text style={styles.theaterAddress}>
                          {theater.address}
                        </Text>
                      </View>
                      <View style={styles.ratingBadge}>
                        <MaterialCommunityIcons
                          name="star"
                          size={16}
                          color="#F5B301"
                        />
                        <Text style={styles.ratingText}>
                          {theater.rating?.toFixed(1) || "4.5"}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.description}>
                      {theater.description}
                    </Text>

                    <View style={styles.metaRow}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={16}
                        color="#6C47DB"
                      />
                      <Text style={styles.metaText}>
                        {formatDistance(theater.distance)}
                      </Text>
                      <View style={styles.dot} />
                      <MaterialCommunityIcons
                        name="seat"
                        size={16}
                        color="#6C47DB"
                      />
                      <Text style={styles.metaText}>
                        {theater.screenType ||
                          theater.features?.[0] ||
                          "ScreenX"}
                      </Text>
                    </View>

                    <View style={styles.badgeRow}>
                      {formatFeatures(theater).map((feature, index) => (
                        <View
                          key={`${
                            theater.id || theater.theaterId
                          }-feature-${index}`}
                          style={styles.badge}
                        >
                          <Text style={styles.badgeText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>
                        Lịch chiếu ({theater.showtimeCount || 0} suất)
                      </Text>
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: "/(theaters)/theater_detail",
                            params: { theaterId: theater.id.toString() },
                          })
                        }
                        style={styles.viewAllButton}
                      >
                        <Text style={styles.sectionLink}>Xem tất cả</Text>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={20}
                          color="#6C47DB"
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
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
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 30,
  },
  screenSubtitle: {
    color: "#9CA3AF",
    marginTop: 4,
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 36,
    gap: 20,
  },
  theaterCard: {
    backgroundColor: "#141414",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    overflow: "hidden",
  },
  theaterImage: {
    width: "100%",
    height: 160,
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  theaterName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  theaterAddress: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ratingText: {
    color: "#F5B301",
    fontWeight: "bold",
  },
  description: {
    color: "#D1D5DB",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#444",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#1F1F1F",
    marginVertical: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectionLink: {
    color: "#6C47DB",
    fontWeight: "600",
    fontSize: 14,
  },
});
