import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import { useDispatch, useSelector } from "react-redux";
// import * as MediaLibrary from "expo-media-library";
import { camerahandler } from "../redux/camerareducer";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  //reduer
  const { herbImage } = useSelector((state) => state.camera);
  const { rootRoute } = useSelector((state) => state.mainRoute);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const pictureOptions = {
        quality: 1, // Adjust quality (0.0 - 1.0)
        base64: false, // Set to true to get base64-encoded image data
      };
      const photo = await cameraRef.takePictureAsync(pictureOptions);
      setCapturedImage(photo);
      dispatch(camerahandler(photo.uri));
      console.log(photo);
      //   saveToCameraRoll(photo.uri);
      // console.log(photo.uri);
    }
  };

  //   const saveToCameraRoll = async (uri) => {
  //     if (Platform.OS === "android") {
  //       const asset = await MediaLibrary.createAssetAsync(uri);
  //       await MediaLibrary.createAlbumAsync("CameraScanApp", asset, false);
  //     } else {
  //       await MediaLibrary.saveToLibraryAsync(uri);
  //     }
  //   };

  useEffect(() => {
    if (hasPermission && herbImage) {
      const uploadImage = async () => {
        const formData = new FormData();
        formData.append("image", {
          uri: herbImage,
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
            // setHerbData(responseData.data.results);
            console.log(responseData.data.result);
          } else {
            console.error("Error uploading image:", response.statusText);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          console.log("clear state");
          dispatch(camerahandler(""));
        }
      };
      uploadImage();
    }
  }, [herbImage]);

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
