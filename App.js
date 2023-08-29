import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";

//navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import TabScreen from "./screens/TabScreen";
import LandingScreen from "./screens/LandingScreen";
//redux
import { Provider } from "react-redux";
import { store } from "./redux/store";
//redux accessor
import { useSelector, useDispatch } from "react-redux";
import TestScreen from "./Test/CameraTest";
import ScanScreen from "./screens/Scan";

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LandingScreen"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#608246",
          },
          headerTitleStyle: {
            fontWeight: "300",
            fontSize: 18,
          },
          headerShadowVisible: false,
          headerTintColor: "#ffffff", //color of title
        }}
      >
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="TabScreen" component={TabScreen} />
        {/* <Stack.Screen name="TestScreen" component={TestScreen} /> */}
        <Stack.Screen name="ScanScreen" component={ScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <Navigator />
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({});
