import { useState } from "react";
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

export default function SelectCinemaScreen() {
  const router = useRouter();

  const cinemas = [
    {
      id: 1,
      name: "CGV Vincom Center",
      address: "72 Lê Thánh Tôn, Quận 1, TP.HCM",
      distance: "0.5 km",
    },
    {
      id: 2,
      name: "Lotte Cinema Landmark",
      address: "Vinhomes Central Park, Quận Bình Thạnh, TP.HCM",
      distance: "1.2 km",
    },
    {
      id: 3,
      name: "Galaxy Cinema Nguyễn Du",
      address: "116 Nguyễn Du, Quận 1, TP.HCM",
      distance: "0.8 km",
    },
    {
      id: 4,
      name: "CGV Crescent Mall",
      address: "101 Tôn Dật Tiên, Quận 7, TP.HCM",
      distance: "2.1 km",
    },
  ];

  const handleCinemaSelect = (cinema) => {
    console.log("Selected cinema:", cinema);
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
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rạp chiếu gần bạn</Text>
          <Text style={styles.sectionSubtitle}>
            Chọn rạp chiếu phù hợp để xem phim
          </Text>
        </View>

        <View style={styles.cinemaList}>
          {cinemas.map((cinema) => (
            <TouchableOpacity
              key={cinema.id}
              style={styles.cinemaItem}
              onPress={() => handleCinemaSelect(cinema)}
            >
              <View style={styles.cinemaIcon}>
                <MaterialCommunityIcons
                  name="movie-open"
                  size={24}
                  color="#6C47DB"
                />
              </View>
              <View style={styles.cinemaInfo}>
                <Text style={styles.cinemaName}>{cinema.name}</Text>
                <Text style={styles.cinemaAddress}>{cinema.address}</Text>
                <View style={styles.cinemaMeta}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color="#999999"
                  />
                  <Text style={styles.cinemaDistance}>{cinema.distance}</Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#666666"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.placeholderSection}>
          <Text style={styles.placeholderTitle}>Tính năng sắp có</Text>
          <View style={styles.placeholderItem}>
            <MaterialCommunityIcons name="calendar" size={20} color="#666666" />
            <Text style={styles.placeholderText}>Chọn suất chiếu</Text>
          </View>
          <View style={styles.placeholderItem}>
            <MaterialCommunityIcons name="seat" size={20} color="#666666" />
            <Text style={styles.placeholderText}>Chọn ghế ngồi</Text>
          </View>
          <View style={styles.placeholderItem}>
            <MaterialCommunityIcons
              name="credit-card"
              size={20}
              color="#666666"
            />
            <Text style={styles.placeholderText}>Thanh toán</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: "#CCCCCC",
    fontSize: 16,
  },
  cinemaList: {
    marginBottom: 32,
  },
  cinemaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cinemaIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cinemaInfo: {
    flex: 1,
  },
  cinemaName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cinemaAddress: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 8,
  },
  cinemaMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  cinemaDistance: {
    color: "#999999",
    fontSize: 12,
    marginLeft: 4,
  },
  placeholderSection: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 20,
  },
  placeholderTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  placeholderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  placeholderText: {
    color: "#999999",
    fontSize: 14,
    marginLeft: 12,
  },
});
