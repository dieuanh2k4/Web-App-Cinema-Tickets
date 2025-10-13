import { View, Image, ImageBackground, StyleSheet } from "react-native";

export default function AuthLayout({ children }) {
  return (
    <ImageBackground
      source={require("../../ClientApp/assets/images/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../../ClientApp/assets/icons/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 25,
  },
});
