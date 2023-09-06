import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";

export default function SettingsScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Settings",
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
      <Text>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
