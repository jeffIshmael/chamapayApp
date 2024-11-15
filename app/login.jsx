import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import axios from "axios";

const LoginScreen = () => {
  const [login, setLogin] = useState(true);
  const navigation = useNavigation(); // Initialize navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToHome = () => {
    navigation.navigate("(tabs)", { screen: "home" }); // Replace with the actual screen name for Home in your navigator
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    if (email === "" || password === "") {
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: email,
        password: password,
      });
      console.log(response.data);
      navigateToHome();
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      return;
    }
    if (email === "" || password === "") {
      return;
    }
    console.log(`${email}", "${password}`);
    try {
      const response = await axios.post("http://localhost:3000/register", {
        email:email,
        password:password,
      }).then(response => console.log(response.data))
      .catch(error => {
        console.error("Error response:", error.response.data); // Log the server response
        alert("Registration failed: " + error.response.data.error);
      });
      console.log(response.data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={navigateToHome}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Text style={styles.title}>ChamaPay</Text>
      <Text style={styles.welcome}>Hello, Welcome back,</Text>

      {/* Toggle Button for Login/Signup */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, login ? styles.activeToggle : null]}
          onPress={() => setLogin(true)}
        >
          <Text style={styles.toggleText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !login ? styles.activeToggle : null]}
          onPress={() => setLogin(false)}
        >
          <Text style={styles.toggleText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Login or Signup Form */}
      <View style={styles.formContainer}>
        {login ? (
          <>
            <Text style={styles.formTitle}>Log In</Text>
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              secureTextEntry
            />
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Pressable>
              <Button title="Log In" color="#00796b" onPress={handleLogin} />
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.formTitle}>Sign Up</Text>
            <TextInput placeholder="UserName" style={styles.input} />
            <TextInput
              placeholder="Email"
              style={styles.input}            
              keyboardType="email-address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
            
              secureTextEntry
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
            
              secureTextEntry
              onChange={(e) => setPassword(e.target.value)}
            />
            <Pressable >
              <Button title="Sign Up" color="#00796b" onPress={handleSignUp} />
            </Pressable>
          </>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Continue with Google */}
      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Continue with</Text>
        {/* Add Google Icon Here */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E0F7FA",
  },
  skipButton: {
    alignSelf: "flex-end",
  },
  skipText: {
    color: "#00796b",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  welcome: {
    fontSize: 30,
    fontWeight: "semibold",
    textAlign: "left",
    marginVertical: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginVertical: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: "#00796b",
  },
  toggleText: {
    color: "#FFF",
  },
  formContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderColor: "#cfd8dc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  forgotText: {
    color: "#00796b",
    textAlign: "right",
    marginBottom: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#b0bec5",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#607d8b",
  },
  googleButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    color: "#616161",
  },
});

export default LoginScreen;
