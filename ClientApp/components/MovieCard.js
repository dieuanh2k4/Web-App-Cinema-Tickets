import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export function MovieCard({ title, poster, rating, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{rating}/10</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 16,
    backgroundColor: "#242424",
    borderRadius: 8,
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: 240,
    borderRadius: 12,
  },
  info: {
    padding: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "#6C47DB",
    fontSize: 12,
    fontWeight: "500",
  },
});
