import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { url } from "../constants/Endpoint";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setErrorText("");
    if (!email || !password) {
      setErrorText("All fields are required");
      return;
    }
    if (email === "" || password === "") {
      setErrorText("Enter valid details.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        Alert.alert("Success", `Login successful.`, [
          { text: "OK", onPress: () => router.push({ pathname: "/(tabs)" }) },
        ]);
      } else {
        console.log(data.message);
        setErrorText(data.message ? data.message : "Login failed. Try again.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setErrorText("");
    if (!email || !password || !userName) {
      setErrorText("All fields are required");
      return;
    }
    if (email === "" || password === "" || userName === "") {
      setErrorText("Enter valid details.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorText("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await axios
        .post(`${url}/auth/register`, {
          email: email,
          password: password,
          userName: userName,
        })
        .then((response) => {
          Alert.alert(
            "Success",
            `Registration successful. You can now login!`,
            [
              {
                text: "OK",
                onPress: () => {
                  resetFormFields();
                  setLogin(true);
                },
              },
            ]
          );
        })
        .catch((error) => {
          setErrorText(
            error.response.data.error
              ? error.response.data.error
              : "Registration failed. Try again."
          );
        });
    } catch (error) {
      console.log("error:", error);
      setErrorText("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetFormFields = () => {
    setEmail("");
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setErrorText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChamaPay</Text>
      <Text style={styles.welcome}>Hello, Welcome back,</Text>

      {/* Toggle Button for Login/Signup */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, login ? styles.activeToggle : null]}
          onPress={() => {
            resetFormFields();
            setLogin(true);
          }}
        >
          <Text style={styles.toggleText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !login ? styles.activeToggle : null]}
          onPress={() => {
            resetFormFields();
            setLogin(false);
          }}
        >
          <Text style={styles.toggleText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Login or Signup Form */}
      <View style={styles.formContainer}>
        {errorText ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={20} color="#ff4444" />
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
        ) : null}
        {login ? (
          <>
            <Text style={styles.formTitle}>Log In</Text>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Pressable>
              <Button
                title={loading ? "Loading..." : "Log In"}
                style={styles.actionButton}
                color="#00796b"
                onPress={handleLogin}
              />
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.formTitle}>Sign Up</Text>
            <TextInput
              placeholder="UserName"
              value={userName}
              style={styles.input}
              onChangeText={(text) => setUserName(text)}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              value={confirmPassword}
              secureTextEntry
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <Pressable>
              <Button
                title={loading ? "Loading..." : "Sign Up"}
                style={styles.actionButton}
                color="#00796b"
                onPress={handleSignUp}
              />
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
      <Pressable style={styles.googleButton}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 48 48"
          >
            <Path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></Path>
            <Path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></Path>
            <Path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></Path>
            <Path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></Path>
          </Svg>
          <Text style={styles.googleText}>Continue with google</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E0F7FA",
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffeeee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
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
  actionButton: {
    padding: 15,
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
    padding: 12,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    color: "#333333",
    marginLeft: 15,
  },
});

export default LoginScreen;
