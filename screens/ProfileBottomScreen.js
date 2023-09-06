import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Sharing from "expo-sharing";
import { captureScreen } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const { width, height } = Dimensions.get("screen");

const WIDTH = width;
const HEIGHT = height;

export default function ProfileScreen({ navigation }) {
  const [chatmsg, setChatMsg] = useState("");

  const { rootRoute } = useSelector((state) => state.mainRoute);

  const { herbdata, match, herbsUses, image } = useSelector(
    (state) => state.herbData
  );
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Profile",
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

  if (status === null) {
    requestPermission();
  }
  const shareImage = async () => {
    const imageUri = image; // Update this with your image file path or URL

    try {
      await Sharing.shareAsync(imageUri, {
        mimeType: "image/jpg",
        dialogTitle: "Share this image",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  const handleCapture = async () => {
    try {
      const imageURI = await captureScreen({
        format: "jpg", // or 'png'
        quality: 1, // 0.0 - 1.0
      });

      const asset = await MediaLibrary.createAssetAsync(imageURI);
      await MediaLibrary.createAlbumAsync("ExpoScreenshots", asset, false);

      console.log("Screenshot saved to album");
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {image ? (
          <View>
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{ width: WIDTH, height: 200 }}
            />
            <TouchableOpacity onPress={shareImage}>
              <Text>Share</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>Image Not available</Text>
        )}
      </View>

      <TouchableOpacity onPress={handleCapture}>
        <Text>ScreenShot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FFEE",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
