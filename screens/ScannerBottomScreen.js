import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import Svg, { Rect } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { useDispatch, useSelector } from "react-redux";
//icons
import { Exit } from "../src/icons/icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

//bootomsheet
import { BottomSheet } from "react-native-btr";

const Top = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get("screen");

const WIDTH = width;
const HEIGHT = height;

export default function ScannerScreen({ navigation, route }) {
  const [popUp, setPopUp] = useState(false);
  const [image, setImage] = useState("");
  const [herbdata, setHerbData] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [visible, setVisibility] = useState(false);
  const [match, setBestMatch] = useState("");
  const [uses, setUses] = useState(``);
  const [benefits, setBenefits] = useState(``);
  const { rootRoute } = useSelector((state) => state.mainRoute);

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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const herbUses = async () => {
    try {
      const response = await fetch(`${rootRoute}uses`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `what are the uses and the benefits of ${match} and its name in the philippines`,
        }), // Sending a message in the request body
      });

      const responseData = await response.json();
      console.log("Server response:", responseData.response);
      setUses(responseData.response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // const herbBenefits = async () => {
  //   try {
  //     const response = await fetch(`${rootRoute}benefits`, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         message: `what is the benefits of ${benefits}`,
  //       }), // Sending a message in the request body
  //     });

  //     const responseData = await response.json();
  //     console.log("Server response:", responseData.response);

  //     setBenefits(responseData.response);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   }
  // };
  useEffect(() => {
    if (herbdata.length > 0) {
      setVisibility(!visible);
    }
    herbUses();
  }, [herbdata]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const toggleBottomNavigationView = () => {
    setVisibility(!visible);
  };

  //upload image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("image", {
      uri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    try {
      let response = await fetch(`${rootRoute}image`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(
          "Image uploaded successfully:",
          responseData.data.results[0].score
        );
        // console.log(herbdata.species.commonNames);
        setBestMatch(responseData.data.bestMatch);
        setHerbData(responseData.data.results[0]);
      } else {
        console.error("Error uploading image:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  //upload image end

  return (
    <View style={styles.container}>
      {/* <Camera
        style={{ flex: 1, width: 300 }}
        ref={(ref) => setCameraRef(ref)}
        type={Camera.Constants.Type.back}
      /> */}
      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
      >
        <View
          style={{
            flex: 0.8,

            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
          }}
        >
          <ScrollView>
            {image ? (
              <Image
                source={{ uri: image }}
                resizeMode="cover"
                style={{ width: WIDTH, height: 200 }}
              />
            ) : (
              <Text>No image available</Text>
            )}
            <View style={styles.bottomContainer}>
              <View style={styles.bottomHeaderCon}>
                <Text style={styles.bottomHeaderConBestMatch}>Best Match</Text>
                <Text style={styles.bottomHeaderConBestMatchValue}>
                  {match}
                </Text>
              </View>
              <View style={styles.bottomContentCon}>
                <Text style={styles.bottomHeaderConBestMatch}>
                  Common Names
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {herbdata && herbdata.species ? (
                    herbdata.species.commonNames.map((herb) => (
                      <View key={herb}>
                        <Text style={styles.bottomContentConBestMatchValue}>
                          {herb}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text>No common names available</Text>
                  )}
                </View>
              </View>
              <View style={styles.usesContainer}>
                <Text style={styles.HerbUses}>Herb Uses</Text>
                <View style={styles.herbUsesContent}>
                  {uses ? (
                    <Text>{`${uses}`}</Text>
                  ) : (
                    <Text>Uses Not Available</Text>
                  )}
                </View>
              </View>
              <View>
                <TouchableOpacity>
                  <Text
                    style={{
                      padding: 12,
                      backgroundColor: "#B3E468",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#ffffff",
                      borderRadius: 12,
                      marginTop: 10,
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
      {popUp && (
        <View style={styles.popup}>
          <View style={styles.exit}>
            <TouchableOpacity onPress={() => setPopUp(!popUp)}>
              {/* <Exit /> */}
            </TouchableOpacity>
          </View>
          <View style={styles.message}>
            <Text>Make sure to take high quality photo!</Text>
          </View>
          <View style={styles.continue}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ScanScreen");
              }}
            >
              <Text style={styles.continueMissage}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPopUp(!popUp)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.scannerContainer}>
        <TouchableOpacity
          style={styles.scannerCircle}
          onPress={() => setPopUp(!popUp)}
        >
          <Text style={styles.circle}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.scannerUpload}>Upload</Text>
        </TouchableOpacity>
        {herbdata.length != 0 && (
          <TouchableOpacity onPress={toggleBottomNavigationView}>
            <Text style={styles.scannerShow}>Show Result</Text>
          </TouchableOpacity>
        )}
        {/* {herbdata && (
          <TouchableOpacity onPress={toggleBottomNavigationView}>
            <Text style={styles.scannerShow}>Show Result</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  bottomHeaderCon: {
    marginTop: 20,
  },
  usesContainer: {},
  herbUsesContent: { marginTop: -20 },
  HerbUses: { color: "#D1556C", fontSize: 14 },
  benefitsContainer: {},
  herbbenefitsContent: { marginTop: -20, marginBottom: 10 },
  Herbbenefits: { color: "#D1556C", fontSize: 14 },

  bottomHeaderConBestMatch: {
    color: "#D1556C",
    fontSize: 14,
  },
  bottomHeaderConBestMatchValue: {
    color: "#316805",
    fontSize: 24,
  },
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
  bottomContentCon: {
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    backgroundColor: "#F8FFEE",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  continue: {
    flex: 1,
    marginTop: 10,
    width: "100%",
  },
  continueMissage: {
    textAlign: "center",
    padding: 10,
    backgroundColor: "#F6FFE9",
  },
  cancel: {
    marginTop: 10,
    textAlign: "center",
    padding: 10,
    backgroundColor: "#FF3838",
    borderRadius: 10,
    color: "white",
  },
  popup: {
    position: "absolute",
    top: 150,
    padding: 20,
    width: WIDTH - 100,
    borderRadius: 20,

    zIndex: 100,
    backgroundColor: "#FCFFF9",
  },
  exit: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  message: {
    textAlign: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerContainer: {},
  scannerCircle: {},
  scannerUpload: {
    fontSize: 20,
    borderColor: "#497426",
    marginTop: 30,
    borderWidth: 2,
    padding: 10,
    textAlign: "center",
    borderRadius: 20,
    color: "#497426",
  },
  scannerShow: {
    fontSize: 20,
    borderColor: "#D1556C",
    marginTop: 10,
    borderWidth: 2,
    padding: 10,
    textAlign: "center",
    borderRadius: 20,
    color: "#D1556C",
  },
  circle: {
    fontSize: 40,
    backgroundColor: "#497426",
    padding: 40,
    borderRadius: 200,
    color: "#ffffff",
  },
});
