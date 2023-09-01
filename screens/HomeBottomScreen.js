import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";

export default function HomeScreen({ navigation }) {
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

  const recentScanned = ()=>{
    
  }
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FFEE",
    flex: 1,
    justifyContent: "start",
    alignItems: "center",
  },
});
