import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MOCK_THEATERS } from "../../constants/mockData";

const findFirstShowtime = (theater) => {
  const daySchedule = theater.showtimes?.[0];
  if (!daySchedule) {
    return null;
  }
  for (const movie of daySchedule.movies) {
    if (movie.showtimes?.length) {
      return {
        movieId: movie.movieId,
        showtime: movie.showtimes[0],
      };
    }
  }
  return null;
};

export default function SelectCinemaScreen() {
  const router = useRouter();

  const handleCinemaSelect = (theater) => {
    const found = findFirstShowtime(theater);
    if (!found) {
      return;
    }

    router.push({
      pathname: "/booking/select_seat",
      params: {
        theaterId: theater.theaterId.toString(),
        movieId: found.movieId.toString(),
        showtimeId: found.showtime.id,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentGap}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn rạp chiếu</Text>
          <Text style={styles.sectionSubtitle}>
            Chạm vào rạp để đến bước chọn ghế phù hợp
          </Text>
        </View>

        {MOCK_THEATERS.map((theater) => (
          <TouchableOpacity
            key={theater.theaterId}
            style={styles.cinemaItem}
            onPress={() => handleCinemaSelect(theater)}
            activeOpacity={0.85}
          >
            <View style={styles.cinemaIcon}>
              <MaterialCommunityIcons
                name="movie-open"
                size={24}
                color="#6C47DB"
              />
            </View>
            <View style={styles.cinemaInfo}>
              <View style={styles.cinemaHeader}>
                <Text style={styles.cinemaName}>{theater.name}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#666666"
                />
              </View>
              <Text style={styles.cinemaAddress}>{theater.address}</Text>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color="#999999"
                />
                <Text style={styles.metaText}>{theater.distance}</Text>
                <View style={styles.dot} />
                <MaterialCommunityIcons name="star" size={14} color="#F5B301" />
                <Text style={styles.metaText}>{theater.rating.toFixed(1)}</Text>
              </View>
              <View style={styles.badgeRow}>
                {theater.features.slice(0, 3).map((feature) => (
                  <View key={feature} style={styles.badge}>
                    <Text style={styles.badgeText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentGap: {
    gap: 16,
    paddingBottom: 40,
  },
  section: {
    gap: 4,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    color: "#9CA3AF",
    fontSize: 15,
  },
  cinemaItem: {
    flexDirection: "row",
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    alignItems: "center",
  },
  cinemaIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cinemaInfo: {
    flex: 1,
  },
  cinemaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cinemaName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  cinemaAddress: {
    color: "#9CA3AF",
    fontSize: 14,
    marginVertical: 6,
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
    marginTop: 10,
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
});
