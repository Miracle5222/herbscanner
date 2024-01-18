import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import { useDispatch, useSelector } from "react-redux";
// import * as MediaLibrary from "expo-media-library";
import { camerahandler } from "../redux/camerareducer";
import {
  herbBestMatchHandler,
  herbDataHandler,
  herbImageHandler,
} from "../redux/herbdatareducer";

const { width, height } = Dimensions.get("screen");

const WIDTH = width;
const HEIGHT = height;

export default function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  //reduer
  const { herbImage } = useSelector((state) => state.camera);
  const { rootRoute } = useSelector((state) => state.mainRoute);
  const { herbdata, match, herbsUses, image } = useSelector(
    (state) => state.herbData
  );

  const { savedHerbsData } = useSelector((state) => state.herbData);
  const [indicator, setIndicatorVisibility] = useState(false);


  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    setIndicatorVisibility(true);
    if (cameraRef) {
      const pictureOptions = {
        quality: 1, // Adjust quality (0.0 - 1.0)
        base64: false, // Set to true to get base64-encoded image data
      };
      const photo = await cameraRef.takePictureAsync(pictureOptions);
      setCapturedImage(photo);
      dispatch(camerahandler(photo.uri));
      dispatch(herbImageHandler(photo.uri));
      uploadImage((photo.uri));
      console.log(photo);
      //   saveToCameraRoll(photo.uri);
      // console.log(photo.uri);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("image", {
      uri,
      name: "image.jpg",
      type: "image/jpeg",
    });
    const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

    try {
      let response = await Promise.race([
        fetch(`${rootRoute}newimage`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        wait(55000), // 15 seconds timeout
      ]);

      if (response && response.ok) {
        const responseData = await response.json();
        console.log(
          "Image uploaded successfully:",
          // responseData.data.results[0].gbif.id
        );

        console.log(responseData.herbsIds[0].data);

        // console.log(savedHerbsData);
        if (savedHerbsData) {
          const filter = savedHerbsData.map(entry => entry.herbId);
          const isHerbIdPresent = filter.includes(responseData.herbsIds[0].data);

          if (isHerbIdPresent) {

            const matchingEntry = savedHerbsData.find(entry => entry.herbId === responseData.herbsIds[0].data);
            if (isHerbIdPresent) {
              navigation.navigate("HerbsDetailsScreen", {
                herbName: matchingEntry.herbName,
                herbImage: matchingEntry.herbImage,
                description: matchingEntry.description,
                herbId: matchingEntry.herbId,
                medicalUse: matchingEntry.medicinalUses,
                commonName: matchingEntry.commonName,
                howtouse: matchingEntry.medicinalHowToUse,
                herb: matchingEntry.herbUses,
                partUse: matchingEntry.partUse,
                date: matchingEntry.dateScanned,
                action: "allherbs",
              })
              setIndicatorVisibility(false);
            }
            // Now 'matchingEntry' contains the specific data you want
            console.log("Matching entry found:", matchingEntry.herbName);
            // console.log("Replace this with savedHerbsData data if filter.includes is true with the same herbsIds to savedHerbsData");
          }
        }
        // console.log(herbdata.species.commonNames);
        // setBestMatch(responseData.data.bestMatch);

        // setHerbData(responseData.data.results[0]);
        // console.log(savedHerbsData);

        // dispatch(herbBestMatchHandler(responseData.data.bestMatch));
        // dispatch(herbDataHandler(responseData.data.results[0]));
      } else {
        Alert.alert("Herbs doesn't exist!")
        setIndicatorVisibility(false)
        navigation.goBack();
        // console.error("Error uploading image:");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };



  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={(ref) => setCameraRef(ref)}
        type={Camera.Constants.Type.back}
        ratio="16:9"
        zoom={0}
      />
      {indicator && (
        <View
          style={{
            position: "absolute",
            top: HEIGHT / 2.5,
            left: WIDTH / 2.3,
          }}
        >
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}

      <View style={{ alignSelf: "center", backgroundColor: "#ffffff" }}>
        <TouchableOpacity
          title="Scan"
          onPress={takePicture}
          activeOpacity={0.5}
        >
          <Text style={styles.button}>Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#7AAD33",
    padding: 20,
    paddingHorizontal: 40,
    color: "#fff",
    fontSize: 20,
  },
});
