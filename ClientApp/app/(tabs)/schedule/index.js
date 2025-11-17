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

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MOCK_THEATERS } from "../../../constants/mockData";

const getFeaturedMovies = (theater) => {
  if (!theater.showtimes?.length) {
    return [];
  }

  const today = new Date().toDateString();
  const todaySchedule =
    theater.showtimes.find(
      (showtime) => new Date(showtime.date).toDateString() === today
    ) || theater.showtimes[0];

  return todaySchedule?.movies || [];
};

const formatFeatures = (theater) => theater.features?.slice(0, 4) || [];

const formatDistance = (distance) => distance || "—";

export default function ScheduleScreen() {
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Khám phá rạp phim</Text>
      <Text style={styles.screenSubtitle}>
        Chọn rạp yêu thích và suất chiếu phù hợp trong ngày
      </Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_THEATERS.map((theater) => {
          const movies = getFeaturedMovies(theater);
          return (
            <View key={theater.theaterId} style={styles.theaterCard}>
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
                    <Text style={styles.theaterAddress}>{theater.address}</Text>
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

                <Text style={styles.description}>{theater.description}</Text>

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
                    {theater.screenType || theater.features?.[0] || "ScreenX"}
                  </Text>
                </View>

                <View style={styles.badgeRow}>
                  {formatFeatures(theater).map((feature) => (
                    <View key={feature} style={styles.badge}>
                      <Text style={styles.badgeText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Suất chiếu nổi bật</Text>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/(theaters)/theater_detail",
                        params: { theaterId: theater.theaterId.toString() },
                      })
                    }
                  >
                    <Text style={styles.sectionLink}>Xem chi tiết</Text>
                  </Pressable>
                </View>

                {movies.length === 0 ? (
                  <View style={styles.noShowtime}>
                    <MaterialCommunityIcons
                      name="calendar-blank-outline"
                      size={20}
                      color="#9CA3AF"
                    />
                    <Text style={styles.noShowtimeText}>
                      Chưa có suất chiếu cho ngày này.
                    </Text>
                  </View>
                ) : (
                  movies.map((movie) => (
                    <View key={movie.movieId} style={styles.movieBlock}>
                      <View style={styles.movieInfo}>
                        <Text style={styles.movieTitle}>
                          {movie.movieTitle}
                        </Text>
                        <Text style={styles.movieMeta}>
                          {movie.duration} phút • {movie.genre}
                        </Text>
                      </View>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.showtimeRow}
                      >
                        {movie.showtimes.map((showtime) => (
                          <Pressable
                            key={showtime.id}
                            style={styles.showtimeChip}
                            onPress={() =>
                              handleShowtimePress(
                                theater.theaterId,
                                movie.movieId,
                                showtime.id
                              )
                            }
                          >
                            <Text style={styles.showtimeTime}>
                              {showtime.start}
                            </Text>
                            <Text style={styles.showtimeRoom}>
                              {showtime.roomType}
                            </Text>
                            <Text style={styles.showtimePrice}>
                              {showtime.price}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  ))
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
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
  },
  sectionLink: {
    color: "#6C47DB",
    fontWeight: "600",
  },
  noShowtime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  noShowtimeText: {
    color: "#9CA3AF",
  },
  movieBlock: {
    gap: 8,
    marginTop: 12,
  },
  movieInfo: {
    gap: 2,
  },
  movieTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  movieMeta: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  showtimeRow: {
    gap: 12,
    paddingVertical: 4,
  },
  showtimeChip: {
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    marginRight: 12,
  },
  showtimeTime: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  showtimeRoom: {
    color: "#9CA3AF",
    fontSize: 12,
    marginVertical: 2,
  },
  showtimePrice: {
    color: "#6C47DB",
    fontSize: 12,
    fontWeight: "600",
  },
});
