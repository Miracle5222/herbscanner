import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";

export default function UserProfileScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "User Profile",
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

  return (
    <View style={styles.container}>
      <Text>UserProfileScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#F8FFEE",
    flex: 1,
    justifyContent: "start",
    alignItems: "start",
  },
});
