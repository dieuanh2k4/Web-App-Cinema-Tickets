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
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theaterService } from "../../services/theaterService";
import { showtimeService } from "../../services/showtimeService";

export default function SelectCinemaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { movieId, movieTitle } = params;

  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Hà Nội");
  const [dates, setDates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    generateDates();
    loadCities();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadTheaters();
    }
  }, [selectedDate, selectedCity]);

  const generateDates = () => {
    const dateList = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateList.push(date);
    }
    setDates(dateList);
    setSelectedDate(dateList[0]);
  };

  const loadCities = async () => {
    try {
      const citiesData = await theaterService.getCities();
      setCities(citiesData);
      if (!selectedCity && citiesData.length > 0) {
        setSelectedCity(citiesData[0]);
      }
    } catch (error) {
      const defaultCities = ["Hà Nội", "TPHCM", "Huế", "Đà Nẵng"];
      setCities(defaultCities);
    }
  };

  const formatDateForBackend = (date) => {
    return date.toISOString().split("T")[0];
  };

  const loadTheaters = async () => {
    try {
      setLoading(true);
      const theatersData = await theaterService.getAllTheaters();
      const allShowtimes = await showtimeService.getAllShowtimes();

      const formattedDate = formatDateForBackend(selectedDate);

      console.log("🎬 Loading showtimes with:", {
        movieTitle,
        selectedDate: formattedDate,
        selectedCity,
      });
      console.log("🎞️ All showtimes:", allShowtimes);

      // Lọc showtimes theo phim và ngày
      const relevantShowtimes = allShowtimes.filter((st) => {
        const matchMovie =
          st.movieTitle?.toLowerCase() === movieTitle?.toLowerCase();
        const matchDate = st.date === formattedDate;
        console.log(`Checking showtime ${st.id}:`, {
          movieTitle: st.movieTitle,
          matchMovie,
          date: st.date,
          formattedDate,
          matchDate,
        });
        return matchMovie && matchDate;
      });

      console.log("✅ Filtered showtimes:", relevantShowtimes);

      // Nhóm showtimes theo rạp
      const theatersWithShowtimes = theatersData.map((theater) => {
        const theaterShowtimes = relevantShowtimes
          .filter((st) => st.theaterName === theater.name)
          .sort((a, b) => a.start.localeCompare(b.start));

        console.log(`Theater ${theater.name}:`, {
          city: theater.city,
          showtimes: theaterShowtimes.length,
        });

        return {
          ...theater,
          showtimes: theaterShowtimes,
          showtimeCount: theaterShowtimes.length,
        };
      });

      // Lọc theo city và chỉ hiển thị rạp có suất chiếu
      const filteredTheaters = theatersWithShowtimes.filter(
        (t) => t.city === selectedCity && t.showtimeCount > 0
      );

      console.log("🏢 Final theaters to show:", filteredTheaters);

      setTheaters(filteredTheaters);
      setLoading(false);
    } catch (error) {
      console.error("Error loading theaters:", error);
      setLoading(false);
    }
  };

  const handleShowtimeSelect = (theater, showtime) => {
    router.push({
      pathname: "/booking/select_seat",
      params: {
        showtimeId: showtime.id,
        movieId: movieId,
        movieTitle: movieTitle,
        theaterId: theater.id,
        theaterName: theater.name,
        showtime: showtime.start,
        format: showtime.format || "2D",
        roomName: showtime.roomName,
        date: formatDateForBackend(selectedDate),
      },
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // "14:30:00" -> "14:30"
  };

  const formatDateDisplay = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}-${month}`;
  };

  const getDayOfWeek = (date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Chọn rạp chiếu</Text>
          {movieTitle && (
            <Text style={styles.headerSubtitle}>{movieTitle}</Text>
          )}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chọn ngày */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
          contentContainerStyle={styles.dateScrollContent}
        >
          {dates.map((date, index) => {
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  isSelected && styles.dateButtonActive,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[styles.dateDay, isSelected && styles.dateDayActive]}
                >
                  {formatDateDisplay(date)}
                </Text>
                <Text
                  style={[
                    styles.dateDayOfWeek,
                    isSelected && styles.dateDayOfWeekActive,
                  ]}
                >
                  {getDayOfWeek(date)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Chọn thành phố */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityScroll}
          contentContainerStyle={styles.cityScrollContent}
        >
          {cities.map((city, index) => {
            const isSelected = city === selectedCity;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cityButton,
                  isSelected && styles.cityButtonActive,
                ]}
                onPress={() => setSelectedCity(city)}
              >
                <Text
                  style={[styles.cityText, isSelected && styles.cityTextActive]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C47DB" />
          </View>
        ) : theaters.length > 0 ? (
          <View style={styles.theatersContainer}>
            {theaters.map((theater) => (
              <View key={theater.id} style={styles.theaterCard}>
                <View style={styles.theaterHeader}>
                  <Text style={styles.theaterName}>{theater.name}</Text>
                  <View style={styles.theaterBadge}>
                    <Text style={styles.theaterBadgeText}>2D SUB</Text>
                  </View>
                </View>
                <View style={styles.theaterMeta}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color="#999"
                  />
                  <Text style={styles.theaterDistance}>2.0 km</Text>
                </View>

                {/* Khung giờ chiếu */}
                <View style={styles.showtimesContainer}>
                  {theater.showtimes.map((showtime) => (
                    <TouchableOpacity
                      key={showtime.id}
                      style={styles.showtimeButton}
                      onPress={() => handleShowtimeSelect(theater, showtime)}
                    >
                      <Text style={styles.showtimeText}>
                        {formatTime(showtime.start)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-remove"
              size={64}
              color="#444"
            />
            <Text style={styles.emptyText}>Không có suất chiếu</Text>
            <Text style={styles.emptySubtext}>
              Vui lòng chọn ngày hoặc rạp khác
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    marginTop: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  dateScroll: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  dateScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  dateButtonActive: {
    backgroundColor: "#6C47DB",
  },
  dateDay: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dateDayActive: {
    color: "#FFFFFF",
  },
  dateDayOfWeek: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  dateDayOfWeekActive: {
    color: "#FFFFFF",
  },
  cityScroll: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  cityScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  cityButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cityButtonActive: {
    backgroundColor: "#6C47DB",
  },
  cityText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  cityTextActive: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    paddingTop: 100,
    alignItems: "center",
  },
  theatersContainer: {
    padding: 20,
    gap: 16,
  },
  theaterCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
  },
  theaterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  theaterName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  theaterBadge: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  theaterBadgeText: {
    color: "#6C47DB",
    fontSize: 11,
    fontWeight: "600",
  },
  theaterMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  theaterDistance: {
    color: "#888",
    fontSize: 13,
  },
  showtimesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  showtimeButton: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  showtimeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 100,
    gap: 12,
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#888",
    fontSize: 14,
  },
});
