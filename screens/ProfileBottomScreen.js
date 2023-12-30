import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
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
  const [selectedItemIndex, setSelectedItemIndex] = useState(0); //favorites tooltop
  const [toolTipVisible, setToolTipVisible] = useState(false); //favorites tooltop

  const [selectedItemIndexHerbs, setSelectedItemIndexHerbs] = useState(0); //herbs tooltop
  const [toolTipVisibleHerbs, setToolTipVisibleHerbs] = useState(false); //herbs tooltop
  const [favorites, setFavorites] = useState([]);

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

  const removeFromFavorites = async (id) => {
    try {
      const response = await fetch(`${rootRoute}api/removeFavorites`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        // throw new Error("Failed to fetch saved herbs data");
        console.log("No saved data");
      } else {
        setToolTipVisible(false);
        const data = await response.json();
        Alert.alert(data?.message);
      }

      // console.log(response);
      // const data = await response.json();
      // setSaveHerbsData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromSavedHerbs = async (id) => {
    try {
      const response = await fetch(`${rootRoute}api/removeSaveHerbs`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        // throw new Error("Failed to fetch saved herbs data");
        console.log("can't delete save herbs");
      } else {
        setToolTipVisibleHerbs(false);
        const data = await response.json();
        Alert.alert(data?.message);
      }

      console.log(data);
      // setSaveHerbsData(data);
    } catch (error) {
      console.error(error);
    }
  };
  //add favorite herbs from save herbs
  const addToFavorites = async (id) => {
    // Pass the index as an argument
    try {
      const response = await fetch(`${rootRoute}api/saveFavoritesHerbs`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        console.log("No saved data");
      } else {
        setToolTipVisibleHerbs(false);
        const data = await response.json();
        Alert.alert(data?.message);

        // Update the selectedItemIndexHerbs with the new index
      }
    } catch (error) {
      console.error(error);
    }
  };

  //retrieve saved herbs
  const retrieveSaveHerbs = async () => {
    try {
      const getSavedHerbs = await fetch(`${rootRoute}api/saveHerbs`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await getSavedHerbs.json();
      console.log(data);
      setSaveHerbsData(data);
      // if (!getSavedHerbs.ok) {
      //   console.log("No saved data");
      // } else {
      //   setToolTipVisibleHerbs(false);
      //   const data = await getSavedHerbs.json();
      //   Alert.alert(data?.message);

      //   // Update the selectedItemIndexHerbs with the new index
      // }
    } catch (error) {
      console.error(error);
    }
    // if (!response.ok) {
    //   // throw new Error("Failed to fetch saved herbs data");
    //   console.log("No saved data");
    // }

    // console.log(res.data);
  };

  //retrieve favorites herbs
  const retrieveFavoriteHerbs = async () => {
    try {
      const response = await fetch(`${rootRoute}api/getFavorites`, {
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
      // setSaveHerbsData(data);
      console.log(data);
      setFavorites(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveSaveHerbs();
    retrieveFavoriteHerbs();
  }, []);

  // Periodically fetch data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      retrieveSaveHerbs();
      retrieveFavoriteHerbs();
    }, 5000);

    return () => clearInterval(interval); // Clear the interval on unmount
  }, []);

  const renderItemSave = ({ item, index }) => (
    <View style={{ marginTop: 10, marginHorizontal: 5, width: 200 }}>
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("HerbsDetailsScreen", {
              herbName: item.herbName,
              herbImage: item.herbImage,
              description: item.description,
              herbId: item.scannedId,
              medicalUse: item.medicinalUses,
              commonName: item.commonName,
              howtouse: item.medicinalHowToUse,
              herb: item.herbUses,
              partUse: item.partUse,
              date: item.dateScanned,
              action: "savedHerbs",
            })
          }
        >
          <Image
            priority="high"
            style={{ height: 200, width: 200, borderRadius: 8 }}
            source={{ uri: `${rootRoute}upload/${item.herbImage}` }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "relative",
            right: -18,
            top: 8,
            zIndex: 2, // Set a higher z-index to bring it to the front
            width: 30,
            height: 20,
          }}
          onPress={() => {
            setSelectedItemIndexHerbs(index);
            setToolTipVisibleHerbs(
              (prevToolTipVisibleHerbs) => !prevToolTipVisibleHerbs
            );
          }}
        >
          <View
            style={{
              // backgroundColor: "red",
              position: "abosolute",
              right: -160,
              top: -195,
              zIndex: 2, // Set a higher z-index to bring it to the front
              width: 40,
              height: 40,
            }}
          >
            <Dotted />
          </View>
          <View
            style={{
              backgroundColor: "#ffffff",
              position: "absolute",
              zIndex: 200, // Set a higher z-index to bring it to the front
              width: 200,
              left: 0,
              top: -160,
            }}
          >
            {toolTipVisibleHerbs && selectedItemIndexHerbs === index && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    addToFavorites(item.herbId); // Pass the index to the addToFavorites function
                  }}
                >
                  <Text style={styles.popUp}>Add to Favorites</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => {
                    removeFromSavedHerbs(item.herbId);
                  }}
                >
                  <Text style={styles.popUp}>Remove saved Herbs</Text>
                </TouchableOpacity> */}
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

  const renderItemFavorites = ({ item, index }) => (
    <View style={{ marginTop: 10, marginHorizontal: 5, width: 200 }}>
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("HerbsDetailsScreen", {
              herbName: item.herbName,
              herbImage: item.herbImage,
              description: item.description,
              herbId: item.scannedId,
              medicalUse: item.medicinalUses,
              commonName: item.commonName,
              howtouse: item.medicinalHowToUse,
              herb: item.herbUses,
              partUse: item.partUse,
              date: item.dateScanned,
              action: "savedHerbs",
            })
          }
        >
          <Image
            priority="high"
            style={{ height: 200, width: 200, borderRadius: 8 }}
            source={{ uri: `${rootRoute}upload/${item.herbImage}` }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: "relative",
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
          <View
            style={{
              // backgroundColor: "red",
              position: "abosolute",
              right: -160,
              top: -195,
              zIndex: 2, // Set a higher z-index to bring it to the front
              width: 40,
              height: 40,
            }}
          >
            <Dotted />
          </View>
          <View
            style={{
              backgroundColor: "#ffffff",
              position: "absolute",
              zIndex: 3, // Set a higher z-index to bring it to the front
              width: 200,
              left: 0,
              top: -150,
            }}
          >
            {toolTipVisible && selectedItemIndex === index && (
              <View>
                {/* <TouchableOpacity
                  onPress={() => {
                    removeFromFavorites(item.herbsId.toString());
                  }}
                >
                  <Text style={styles.popUp}>Add to Favorites</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    removeFromFavorites(item.herbsId.toString());
                  }}
                >
                  <Text style={styles.popUp}>Remove from Favorites</Text>
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
    <ScrollView>
      <View style={styles.container}>
        {/* {favorites.length > 0 || saveherbs.length > 0 ? ( */}
        <>
          <Text style={styles.herbUses}>Favorites</Text>
          {favorites.length > 0 ? (
            <FlatList
              data={favorites}
              horizontal
              keyExtractor={(item) => item.herbId}
              renderItem={renderItemFavorites}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <Text style={[{ color: backgroundColor.tertiary }, styles.label]}>
              No saved Favorites
            </Text>
          )}

          <Text
            style={[
              { color: backgroundColor.secondary, paddingTop: 15 },
              styles.herbUses,
            ]}
          >
            Saved Herbs
          </Text>

          {saveherbs.length > 0 ? (
            <FlatList
              data={saveherbs}
              horizontal
              keyExtractor={(item) => item.herbsId}
              renderItem={renderItemSave}
              // contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <Text style={[{ color: backgroundColor.tertiary }, styles.label]}>
              No saved Herbs
            </Text>
          )}
        </>
        {/* // ) : ( // <ActivityIndicator size="large" color="#00ff00" />
        // )} */}
      </View>
    </ScrollView>
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
    paddingBottom: 10,
    fontWeight: "500",
  },
  popUp: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 10 },
  label: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
