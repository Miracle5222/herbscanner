import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { captureScreen } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Pluss, Share } from "../src/icons/icons";
const { width, height } = Dimensions.get("screen");

const WIDTH = width;
const HEIGHT = height;

export default function HerbsDetailsScreen({ navigation, route }) {
  const { userPass, userId, userName } = useSelector((state) => state.user);
  const { backgroundColor } = useSelector((state) => state.theme);
  const [data, setData] = useState(null);
  const { rootRoute } = useSelector((state) => state.mainRoute); //root route to connect server
  const [herbs, setHerbsData] = useState([]);
  const [saveherbs, setSaveHerbsData] = useState([]);
  const [screenShot, setScreenShot] = useState("");
  // const [image, setImage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Herbs Details",
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
  }, [navigation, herbs]);

  const shareImage = async () => {
    try {
      const imageURI = await captureScreen({
        format: "jpg", // or 'png'
        quality: 1, // 0.0 - 1.0
      });

      await Sharing.shareAsync(imageURI, {
        mimeType: "image/jpg",
        dialogTitle: "Share this Herb",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const saveScannedHerbs = async () => {
    console.log(route.params.herbId);
    console.log(userId);
    try {
      const response = await fetch(`${rootRoute}api/saveScannedHerbs`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: route.params.herbId,
          userId,
        }),
      });

      const responseData = await response.json(); // Await the response.json() promise
      // console.log(responseData);
      Alert.alert(responseData?.message);
    } catch (error) {
      // console.error("Error sending message:", error);
      console.log("failed to save herbs");
    }
  };

  const retrieveHerbsDetails = async () => {
    try {
      const response = await fetch(`${rootRoute}api/commonNames`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scannedId: route.params.herbId }),
      });

      if (!response.ok) {
        // throw new Error("Failed to fetch saved herbs data");
        console.log("failed to fetch commonNames");
      }
      const data = await response.json();
      setSaveHerbsData(data);
      // console.log(data);
    } catch (error) {
      // console.error(error);
    }
  };
  const saveToFavorites = async () => {
    try {
      const response = await fetch(`${rootRoute}api/saveFavoritesHerbs`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: route.params.herbId,
        }),
      });

      const responseData = await response.json(); // Await the response.json() promise
      console.log(responseData);
      // Alert.alert(responseData?.message);
    } catch (error) {
      // console.error("Error sending message:", error);
      console.log("failed to save herbs");
    }
  };
  useEffect(() => {
    retrieveHerbsDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <ScrollView>
          <Image
            style={{ height: 250, width: "100%" }}
            source={{ uri: `${rootRoute}upload/${route.params.herbImage}` }}
          />

          <View style={{ marginBottom: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[{ color: backgroundColor.tertiary }, styles.user]}>
                {route.params.herbName}
              </Text>

              <View style={{ marginRight: 30 }}>
                {route.params.action == "savedHerbs" && (
                  <TouchableOpacity onPress={saveToFavorites}>
                    <Pluss />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* herbId */}
            <View
              style={{
                paddingHorizontal: 10,
              }}
            >
              <Text style={styles.herbUses}>Common Names</Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                {saveherbs ? (
                  saveherbs.map((herb) => (
                    <View key={herb.commonId.toString()}>
                      <Text style={styles.bottomContentConBestMatchValue}>
                        {herb.commonNames}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text>No common names available</Text>
                )}
              </View>
              <Text style={styles.herbUses}>Herb Uses</Text>
              <View>
                <Text
                  style={[
                    styles.herbUsesCon,
                    { color: backgroundColor.tertiary },
                  ]}
                >
                  {route.params.herb}
                </Text>
              </View>
              {route.params.action == "savedHerbs" ? (
                <></>
              ) : (
                <TouchableOpacity onPress={saveScannedHerbs}>
                  <Text
                    style={{
                      padding: 12,
                      backgroundColor: "#B3E468",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#ffffff",
                      borderRadius: 12,
                      marginTop: 10,
                      marginBottom: 20,
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={shareImage}
                style={{
                  backgroundColor: backgroundColor.secondary,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 12,
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#ffffff",
                    borderRadius: 12,
                    paddingRight: 10,
                  }}
                >
                  Share Herbs
                </Text>
                <Share />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContentConBestMatchValue: {
    marginTop: 5,
    backgroundColor: "#B3E468",
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 8,
    color: "#316805",
    fontSize: 20,
  },
  container: {
    // paddingTop: 10,
    // paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "start",
    alignItems: "start",
  },
  herbUsesCon: {
    marginTop: -30,
    fontSize: 16,
    fontWeight: "400",
  },
  herbUses: {
    color: "#D1556C",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  user: {
    fontSize: 34,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  herbname: {
    paddingVertical: 4,
  },
});
