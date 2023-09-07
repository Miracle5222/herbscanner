import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Sharing from "expo-sharing";
import { captureScreen } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Share, Dotted } from "../src/icons/icons";
import Tooltip from "react-native-walkthrough-tooltip";

const { width, height } = Dimensions.get("screen");

const WIDTH = width;
const HEIGHT = height;

export default function ProfileScreen({ navigation }) {
  const { rootRoute } = useSelector((state) => state.mainRoute);
  const [saveherbs, setSaveHerbsData] = useState([]);
  const { backgroundColor } = useSelector((state) => state.theme);
  const { userPass, userId, userName } = useSelector((state) => state.user);
  const [tooltip, setToolTip] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [toolTipVisible, setToolTipVisible] = useState(false);

  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Herb Profile",
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

  const retrieveSaveHerbs = async () => {
    try {
      const response = await fetch(`${rootRoute}api/saveHerbs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        // throw new Error("Failed to fetch saved herbs data");
        console.log("No saved data");
      }
      const data = await response.json();
      setSaveHerbsData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveSaveHerbs();
  }, []);

  // Periodically fetch data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      retrieveSaveHerbs();
    }, 5000);

    return () => clearInterval(interval); // Clear the interval on unmount
  }, []);
  const renderItemSave = ({ item, index }) => (
    <View style={{ marginTop: 10, marginHorizontal: 5, width: 80 }}>
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("HerbsDetailsScreen", {
              herbName: item.herbName,
              herbImage: item.image,
              herbId: item.scannedId,
              herb: item.herbUses,
              date: item.dateScanned,
            })
          }
        >
          <Image
            style={{ height: 80, width: 80, borderRadius: 8 }}
            source={{ uri: `${rootRoute}upload/${item.image}` }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: -18,
            top: 8,
            zIndex: 2, // Set a higher z-index to bring it to the front
            width: 30,
            height: 20,
          }}
          onPress={() => {
            setSelectedItemIndex(index);
            setToolTipVisible(!toolTipVisible);
          }}
        >
          <Dotted />
          <View
            style={{
              backgroundColor: "#ffffff",
              position: "fixed",
              zIndex: 3, // Set a higher z-index to bring it to the front
              width: 200,
              left: 0,
              top: 10,
            }}
          >
            {toolTipVisible && selectedItemIndex === index && (
              <View>
                <TouchableOpacity>
                  <Text>Remove from Favorites</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <Text style={[{ color: backgroundColor.tertiary }, styles.herbname]}>
        {item.herbName}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.herbUses}>Favorites</Text>
      {saveherbs.length > 0 ? (
        <FlatList
          data={saveherbs}
          horizontal
          keyExtractor={(item) => item.scannedId.toString()}
          renderItem={renderItemSave}
          // contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <Text style={[{ color: backgroundColor.tertiary }, styles.label]}>
          you don't have saved herbs
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#F8FFEE",
    flex: 1,
    justifyContent: "start",
    alignItems: "start",
  },
  herbUses: {
    color: "#D1556C",
    fontSize: 16,
    fontWeight: "500",
  },
  label: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
