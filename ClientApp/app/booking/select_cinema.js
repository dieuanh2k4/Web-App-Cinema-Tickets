import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theaterService } from "../../services/theaterService";
import { showtimeService } from "../../services/showtimeService";

export default function SelectCinemaScreen() {
  const router = useRouter();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheaters();
  }, []);

  const loadTheaters = async () => {
    try {
      setLoading(true);
      const theatersData = await theaterService.getAllTheaters();

      // Load showtimes and add to each theater
      const allShowtimes = await showtimeService.getAllShowtimes();

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
    }
  };

  const handleCinemaSelect = (theater) => {
    // Navigate to theater detail to see showtimes
    router.push({
      pathname: "/(theaters)/theater_detail",
      params: {
        theaterId: theater.id.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn rạp chiếu</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentGap}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Chọn rạp để xem lịch chiếu</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C47DB" />
          </View>
        ) : (
          theaters.map((theater) => (
            <TouchableOpacity
              key={theater.id || theater.theaterId}
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
                  <Text style={styles.metaText}>
                    {theater.city || "TP.HCM"}
                  </Text>
                  <View style={styles.dot} />
                  <Text style={styles.metaText}>
                    {theater.showtimeCount || 0} suất
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
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
  showtimesScroll: {
    marginTop: 12,
  },
  showtimeChip: {
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    minWidth: 90,
  },
  showtimeTime: {
    color: "#6C47DB",
    fontSize: 16,
    fontWeight: "bold",
  },
  showtimeMovie: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 4,
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
