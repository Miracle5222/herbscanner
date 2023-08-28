import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Image, Platform } from "react-native";
import { Camera } from "expo-camera";
// import * as MediaLibrary from "expo-media-library";

export default function TestScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

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
      //   saveToCameraRoll(photo.uri);
      console.log(photo.uri);
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
      />
      <Button title="Scan" onPress={takePicture} />
      {capturedImage && (
        <Image
          source={{ uri: capturedImage.uri }}
          style={{ width: 200, height: 200 }}
        />
      )}
    </View>
  );
}
