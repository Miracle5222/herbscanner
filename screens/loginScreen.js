import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableHighlightBase,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
const { width, height } = Dimensions.get("screen");
import {
  userNameHandler,
  userPassHandler,
  userIdHandler,
} from "../redux/userReducer";
const WIDTH = width;
const HEIGHT = height;

export default function LoginScreen({ navigation }) {
  const [imageWidth, setImageWidth] = useState(350);
  const { userPass, userId, userName } = useSelector((state) => state.user);
  const { rootRoute } = useSelector((state) => state.mainRoute); //root route to connect server
  const [keyboardStatus, setKeyboardStatus] = useState("");
  const dispatch = useDispatch();

  const changeImageWidth = () => {
    setImageWidth(200);
  };
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
      setImageWidth(350);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const loginUser = async () => {
    if (userPass != "" && userName != "") {
      try {
        const loginResponse = await fetch(`${rootRoute}api/login`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
            userPass,
          }),
        });

        const response = await loginResponse.json();
        console.log(response);
        if (response?.data?.ok) {
          if (
            response?.data.id != null &&
            response?.data.username != null &&
            response?.data.password != null
          ) {
            // dispatch(userPassHandler(response.data.password));
            dispatch(userNameHandler(response.data.username));
            dispatch(userIdHandler(response.data.id));
          } else {
            console.log(response.data.message);
          }
          navigation.navigate("TabScreen");
        } else {
          Alert.alert(response?.data?.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <View style={{ flex: 1 }} onTouchStart={() => setImageWidth(350)}>
      <StatusBar style="light" />
      <Image
        style={{ height: imageWidth, width: WIDTH }}
        source={require("../assets/sunflower.jpg")}
      />
      <View>
        <View style={styles.form}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>Username</Text>
            <TextInput
              style={styles.input}
              onFocus={changeImageWidth}
              placeholder="Enter Username"
              onChangeText={(e) => dispatch(userNameHandler(e))}
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.username}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              onFocus={changeImageWidth}
              placeholder="Enter Password"
              onChangeText={(e) => dispatch(userPassHandler(e))}
            />
          </View>
          <View style={styles.submitContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={loginUser}>
              <Text style={styles.login}>Login</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 12,
              marginTop: 60,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("RegistrationScreen")}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "400", color: "#608246" }}
              >
                Sign up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  color: "#608246",
                  textDecorationLine: "underline",
                }}
              >
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 18,
  },
  username: {
    paddingLeft: 12,
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#608246",
  },
  input: {
    borderColor: "#608246",
    marginBottom: 20,
    height: 50,
    padding: 12,
    margin: 12,
    borderWidth: 2,
    borderRadius: 8,
  },
  login: {
    borderRadius: 8,
    padding: 14,
    marginHorizontal: 12,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "#608246",
    color: "#ffffff",
  },

  passwordContainer: { marginTop: -20 },
  usernameContainer: {},
});
