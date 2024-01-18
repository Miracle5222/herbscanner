import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  userNameHandler,
  userPassHandler,
  userIdHandler,
} from "../redux/userReducer";

export default function SettingsScreen({ navigation }) {
  const { backgroundColor } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

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

  const Logout = () => {
    dispatch(userNameHandler(""));
    dispatch(userIdHandler(""));
    dispatch(userPassHandler(""));
    navigation.replace("LoginScreen");
  };
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.textContainer,
          { backgroundColor: backgroundColor.four },
        ]}
      >
        {/* <TouchableOpacity onPress={() => navigation.push("UserProfileScreen")}>
          <Text style={styles.textLabel}>Profile</Text>
        </TouchableOpacity> */}
      </View>
      {/* <View
        style={[
          styles.textContainer,
          { backgroundColor: backgroundColor.four },
        ]}
      >
        <TouchableOpacity>
          <Text style={styles.textLabel}>App Permissions</Text>
        </TouchableOpacity>
      </View> */}
      <View
        style={[
          styles.textContainer,
          { backgroundColor: backgroundColor.four },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.push("AboutScreen")}>
          <Text style={styles.textLabel}>About</Text>
        </TouchableOpacity>
      </View>
      {/* <View
        style={[
          styles.textContainer,
          { backgroundColor: backgroundColor.four },
        ]}
      >
        <TouchableOpacity>
          <Text style={styles.textLabel}>Mision & Vision</Text>
        </TouchableOpacity>
      </View> */}
      <View
        style={[
          styles.textContainer,
          { backgroundColor: backgroundColor.four },
        ]}
      >
        <TouchableOpacity onPress={Logout}>
          <Text style={styles.textLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
  },
  textContainer: {
    paddingHorizontal: 10,
  },
  textLabel: {
    paddingVertical: 10,
    color: "#363636",
    fontSize: 18,
    fontWeight: "500",
  },
});
