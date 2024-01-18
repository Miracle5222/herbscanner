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

    const [indicatorVisible, setIndicatorVisible] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const takePicture = async () => {
        setIndicatorVisible(true);
        if (cameraRef) {
            const pictureOptions = {
                quality: 1, // Adjust quality (0.0 - 1.0)
                base64: false, // Set to true to get base64-encoded image data
            };
            const photo = await cameraRef.takePictureAsync(pictureOptions);
            setCapturedImage(photo);
            dispatch(camerahandler(photo.uri));
            dispatch(herbImageHandler(photo.uri));

            console.log(photo);
            //   saveToCameraRoll(photo.uri);
            // console.log(photo.uri);
        }
    };
    // console.log(herbdata.species.commonNames);

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
                        // console.log(
                        //   "Image uploaded successfully:",
                        //   responseData.data.results[0].score
                        // );
                        // setHerbData(responseData.data.results);
                        // console.log(responseData);

                        dispatch(herbBestMatchHandler(responseData.data.bestMatch));
                        dispatch(herbDataHandler(responseData.data.results[0]));
                        setIndicatorVisible(false);
                        navigation.navigate("Scan");
                    } else {
                        console.error("Error uploading image:", response.statusText);
                    }
                } catch (error) {
                    console.log("Error uploading image:", error);
                } finally {
                    // console.log("clear state");
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
            {indicatorVisible && (
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
