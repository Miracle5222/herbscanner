import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";

export default function ProfileScreen({ navigation }) {
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
  return (
    <View>
      <Text>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
