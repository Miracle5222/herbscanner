import { StyleSheet, Text, View } from "react-native";
import React from "react";

//bottom navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//screen
import SettingsScreen from "./SettingBottomScreen";
import ProfileScreen from "./ProfileBottomScreen";
import ScannerScreen from "./ScannerBottomScreen";
import ShareScreen from "./ShareBottomScreen";
import HomeScreen from "./HomeBottomScreen";

//icons
import {
  HomeIcon,
  ScannerIcon,
  SettingsIcon,
  ProfileIcon,
} from "../src/icons/icons";

const Tab = createBottomTabNavigator();

export default function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          height: 75,
          borderTopWidth: 0,

          elevation: 0,
        },
        tabBarActiveBackgroundColor: "#F7FFEF",
        tabBarInactiveBackgroundColor: "#FDFFFA",
        tabBarActiveTintColor: "#316805",
        tabBarInactiveTintColor: "#608246",
        tabBarLabelStyle: {
          fontSize: 14,
          paddingBottom: 10,
          marginTop: -5,
        },
      }}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <HomeIcon />,
        }}
        component={HomeScreen}
      />

      <Tab.Screen
        name="Scan"
        options={{
          tabBarLabel: "Scan",
          tabBarIcon: () => <ScannerIcon />,
        }}
        component={ScannerScreen}
      />

      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <ProfileIcon />,
        }}
        component={ProfileScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ size, color }) => <SettingsIcon />,
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
