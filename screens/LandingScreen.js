import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";

export default function LandingScreen({ navigation }) {
  let [fontsLoaded, fontError] = useFonts({
    Inter_900Black,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View>
          <Text style={styles.welcome}>Welcome to Herb Scanner App</Text>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity>
            <Text style={styles.bottomContainerLogin}>Sign-In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("TabScreen");
            }}
          >
            <Text style={styles.bottomContainerSkip}>Skip</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("TestScreen");
            }}
          >
            <Text style={styles.bottomContainerSkip}>Test Screen</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#F8FFEE",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    color: "#7AAD33",
    textAlign: "center",
    fontFamily: "Inter_900Black",
    fontSize: 40,
  },
  bottomContainer: {
    marginTop: 40,
  },
  bottomContainerLogin: {
    backgroundColor: "#497426",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  bottomContainerSkip: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#7AAD33",
    textDecorationLine: "underline",
  },
});
