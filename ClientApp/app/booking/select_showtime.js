import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { showtimeService } from "../../services/showtimeService";
import { theaterService } from "../../services/theaterService";

const formatDateForBackend = (date) => {
  if (!date) {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
};

export default function SelectShowtimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { movieId, movieTitle, thumbnail } = params;

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [dates, setDates] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    generateDates();
    loadCities();
  }, []);

  useEffect(() => {
    if (selectedCity && selectedDate) {
      loadTheaters();
    }
  }, [selectedCity, selectedDate]);

  const loadCities = async () => {
    try {
      const citiesData = await theaterService.getCities();
      setCities(citiesData);
      if (citiesData.length > 0) {
        setSelectedCity(citiesData[0]);
      }
    } catch (error) {
      console.error("Error loading cities:", error);
      // Fallback to default cities
      const defaultCities = ["Hà Nội", "TPHCM", "Huế", "Đà Nẵng"];
      setCities(defaultCities);
      setSelectedCity(defaultCities[0]);
    }
  };

  // Tạo danh sách 7 ngày từ hôm nay
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

  const loadTheaters = async () => {
    try {
      setLoading(true);
      const formattedDate = formatDateForBackend(selectedDate);
      const allTheaters = await theaterService.getAllTheaters();

      console.log("📅 Loading showtimes for:", {
        movieId,
        formattedDate,
        selectedCity,
      });

      const data = await showtimeService.getShowtimesByMovieAndDate(
        movieId,
        formattedDate,
        allTheaters
      );

      console.log("🎬 All theaters with showtimes:", data);

      // Tạm thời bỏ filter để xem tất cả rạp
      const filteredTheaters = selectedCity
        ? data.filter((theater) => theater.city === selectedCity)
        : data;

      console.log("🏙️ Filtered theaters by city:", {
        selectedCity,
        filteredTheaters,
        totalTheaters: data.length,
      });

      // Hiển thị tất cả rạp nếu không có rạp nào khớp với city
      const theatersToShow =
        filteredTheaters.length > 0 ? filteredTheaters : data;
      setTheaters(theatersToShow);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error loading theaters:", error);
      setTheaters([]);
      setLoading(false);
    }
  };

  const formatDateDisplay = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSelectShowtime = (theater, showtime) => {
    Alert.alert(
      "Thông báo đặt vé",
      "Bạn có 10 phút để hoàn tất đặt vé. Thời gian sẽ bắt đầu đếm ngược sau khi bạn xác nhận.",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: () => {
            router.push({
              pathname: "/booking/select_seat",
              params: {
                showtimeId: showtime.id,
                movieId: movieId,
                movieTitle: movieTitle,
                theaterId: theater.id,
                theaterName: theater.name,
                showtime: showtime.time,
                format: showtime.format,
                date: selectedDate.toISOString().split("T")[0],
              },
            });
          },
        },
      ]
    );
  };

  const renderDateItem = ({ item }) => {
    const isSelected =
      selectedDate && item.toDateString() === selectedDate.toDateString();

    return (
      <TouchableOpacity
        style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
        onPress={() => setSelectedDate(item)}
      >
        <Text
          style={[
            styles.dateButtonText,
            isSelected && styles.dateButtonTextSelected,
          ]}
        >
          {formatDateDisplay(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCityItem = ({ item }) => {
    const isSelected = selectedCity === item;

    return (
      <TouchableOpacity
        style={[styles.cityButton, isSelected && styles.cityButtonSelected]}
        onPress={() => setSelectedCity(item)}
      >
        <Text
          style={[
            styles.cityButtonText,
            isSelected && styles.cityButtonTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTheaterItem = ({ item: theater }) => {
    return (
      <View style={styles.theaterCard}>
        <View style={styles.theaterHeader}>
          <View style={styles.theaterInfo}>
            <Text style={styles.theaterName}>
              {theater.name} {theater.showtimes[0]?.format}
            </Text>
            <Text style={styles.theaterDistance}>{theater.distance} km</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-up" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.showtimesContainer}>
          {theater.showtimes.map((showtime) => (
            <TouchableOpacity
              key={showtime.id}
              style={styles.showtimeButton}
              onPress={() => handleSelectShowtime(theater, showtime)}
            >
              <Text style={styles.showtimeText}>{showtime.time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with movie info */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          {thumbnail && (
            <Image source={{ uri: thumbnail }} style={styles.moviePoster} />
          )}
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{movieTitle}</Text>
            <Text style={styles.movieSubtitle}>C13 • 125 phút</Text>
          </View>
        </View>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dates}
          renderItem={renderDateItem}
          keyExtractor={(item) => item.toISOString()}
          contentContainerStyle={styles.dateList}
        />
      </View>

      {/* City Selector */}
      <View style={styles.citySelector}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={cities}
          renderItem={renderCityItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.cityList}
        />
      </View>

      {/* Theaters List */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C47DB" />
          </View>
        ) : theaters.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              Không có rạp nào trong khu vực này
            </Text>
          </View>
        ) : (
          <FlatList
            data={theaters}
            renderItem={renderTheaterItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.theatersList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    backgroundColor: "#1A1A1A",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  moviePoster: {
    width: 50,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  movieSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  dateSelector: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  dateList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  dateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 4,
  },
  dateButtonSelected: {
    backgroundColor: "#FF0000",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
  },
  dateButtonTextSelected: {
    color: "#fff",
  },
  citySelector: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  cityList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  cityButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 4,
  },
  cityButtonSelected: {
    backgroundColor: "#6C47DB",
  },
  cityButtonText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  cityButtonTextSelected: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  theatersList: {
    padding: 16,
  },
  theaterCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  theaterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  theaterInfo: {
    flex: 1,
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  theaterDistance: {
    fontSize: 14,
    color: "#888",
  },
  showtimesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  showtimeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  showtimeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
