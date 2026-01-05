import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export function MovieCard({ title, poster, rating, onPress }) {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {poster && !imageError ? (
        <Image
          source={{ uri: poster }}
          style={styles.poster}
          resizeMode="cover"
          onError={() => {
            console.log("Failed to load image:", poster);
            setImageError(true);
          }}
        />
      ) : (
        <View style={[styles.poster, styles.placeholderContainer]}>
          <Text style={styles.placeholderText}>🎬</Text>
          <Text style={styles.placeholderTitle} numberOfLines={3}>
            {title}
          </Text>
        </View>
      )}
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
  placeholderContainer: {
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderTitle: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 16,
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
