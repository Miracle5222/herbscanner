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

export default function ForgetPasswordScreen({ navigation }) {
  const [imageWidth, setImageWidth] = useState(250);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmPass, setConPassword] = useState("");
  const { rootRoute } = useSelector((state) => state.mainRoute); //root route to connect server
  const dispatch = useDispatch();

  const [keyboardStatus, setKeyboardStatus] = useState("");

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
      setImageWidth(250);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const changeImageWidth = () => {
    setImageWidth(150);
  };
  const forgetPass = async () => {
    if (password != "" && newpassword != "" && username != "") {
      try {
        const reg = await fetch(`${rootRoute}api/changePass`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            newpassword,
          }),
        });
        const res = await reg.json();
        console.log(res);
        if (res?.message) {
          Alert.alert(res.message);
        }
        if (res?.ok) {
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert("Passwords don't match.");
    }
  };

  return (
    <View style={{ flex: 1 }} onTouchStart={() => setImageWidth(250)}>
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
              onChangeText={(e) => setUsername(e)}
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.username}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              onFocus={changeImageWidth}
              placeholder="Enter current Password"
              onChangeText={(e) => setPassword(e)}
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.username}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              onFocus={changeImageWidth}
              placeholder="Enter new Password"
              onChangeText={(e) => setNewPassword(e)}
            />
          </View>
          <View style={styles.submitContainer}>
            <TouchableOpacity activeOpacity={0.5} onPress={forgetPass}>
              <Text style={styles.login}>Change Password</Text>
            </TouchableOpacity>
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingHorizontal: 12,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: "#608246",
                paddingRight: 5,
              }}
            >
              already registered?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "400", color: "#D1556C" }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View> */}
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
