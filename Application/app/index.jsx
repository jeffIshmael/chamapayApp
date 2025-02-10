
import { Link } from "expo-router";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
} from "react-native";


export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>ChamaPay</Text>
        <Text style={styles.tagline}>Making Saving & Sharing Easy</Text>
      </View>

      <View style={styles.content}>
        <Image
          source={require("../assets/images/iso.png")}
          style={styles.image}
        />
        <Text style={styles.description}>
          Create a chama with family, friends, or your community and start
          saving together effortlessly.
        </Text>
      </View>

      <Link href="/login" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8", // Light background for a friendly feel
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#222B45",
  },
  tagline: {
    fontSize: 18,
    color: "#6C757D",
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  image: {
    width: "80%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#4CBE9E", // Soft teal for the button
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignSelf: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
