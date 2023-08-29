import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProfileScreen({ navigation }) {
  const [chatmsg, setChatMsg] = useState("");

  const { rootRoute } = useSelector((state) => state.mainRoute);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Scan Herbs",
      headerStyle: {
        backgroundColor: "#608246",
      },
      headerTitleStyle: {
        fontWeight: "300",
        fontSize: 18,
      },
      headerShadowVisible: false,
      headerTintColor: "#ffffff", //color of title
    });
  }, [navigation]);

  const sendMessageToServer = async () => {
    try {
      const response = await fetch(`${rootRoute}receive-message`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "what is the largest country in the world?",
        }), // Sending a message in the request body
      });

      const responseData = await response.json();
      console.log("Server response:", responseData.response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={sendMessageToServer}>
        <Text>Profile Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FFEE",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
