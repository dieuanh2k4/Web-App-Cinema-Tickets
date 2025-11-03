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

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SectionList,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { MOCK_THEATERS, CITIES } from "../../../constants/mockData";

export default function ScheduleScreen() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const router = useRouter();

  // Nhóm rạp theo thành phố
  const theatersByCity = CITIES.map((city) => ({
    title: city,
    data: MOCK_THEATERS.filter((theater) => theater.city === city),
  }));

  const handleTheaterPress = (theaterId) => {
    router.push({
      pathname: "/(theaters)/theater_detail",
      params: { theaterId: theaterId.toString() },
    });
  };

  const renderTheater = ({ item }) => (
    <Pressable
      style={styles.theaterItem}
      onPress={() => handleTheaterPress(item.theaterId)}
    >
      <Text style={styles.theaterName}>{item.name}</Text>
      <Text style={styles.theaterAddress}>{item.address}</Text>
    </Pressable>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Pressable
      style={[
        styles.cityHeader,
        title === selectedCity && styles.cityHeaderActive,
      ]}
      onPress={() => setSelectedCity(title)}
    >
      <Text
        style={[
          styles.cityTitle,
          title === selectedCity && styles.cityTitleActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Đặt Vé Theo Rạp</Text>

      <SectionList
        sections={theatersByCity}
        renderItem={renderTheater}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item) => item.theaterId.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionFooter: {
    height: 20,
  },
  cityHeader: {
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  cityHeaderActive: {
    borderBottomColor: "#6C47DB",
    borderBottomWidth: 2,
  },
  cityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  cityTitleActive: {
    color: "#6C47DB",
  },
  theaterItem: {
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  theaterAddress: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
