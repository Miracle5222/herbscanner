import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Share, Dotted } from "../src/icons/icons";

export default function UserProfileScreen({ navigation }) {
  const { userPass, userId, userName } = useSelector((state) => state.user);
  const { backgroundColor } = useSelector((state) => state.theme);
  const [saveherbs, setSaveHerbsData] = useState([]);
  const { rootRoute } = useSelector((state) => state.mainRoute); //root route to connect server
  const [selectedItemIndexHerbs, setSelectedItemIndexHerbs] = useState(0); //herbs tooltop
  const [toolTipVisibleHerbs, setToolTipVisibleHerbs] = useState(false); //herbs tooltop
  const [favorites, setFavorites] = useState([]);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "User Profile",
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

      // if (!response.ok) {
      //   // throw new Error("Failed to fetch saved herbs data");
      //   console.log("No saved data");
      // }
      const data = await response.json();
      setSaveHerbsData(data);
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    retrieveSaveHerbs();
  }, []);
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
        console.log(data);
        // Alert.alert(data?.message);
      }

      console.log(data);
      // setSaveHerbsData(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Periodically fetch data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      retrieveSaveHerbs();
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
              herbImage: item.image,
              herbId: item.scannedId,
              herb: item.herbUses,
              date: item.dateScanned,
              action: "savedHerbs",
            })
          }
        >
          <Image
            priority="high"
            style={{ height: 200, width: 200, borderRadius: 8 }}
            source={{ uri: `${rootRoute}upload/${item.image}` }}
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
                    addToFavorites(item.herbsId.toString()); // Pass the index to the addToFavorites function
                  }}
                >
                  <Text style={styles.popUp}>Add to Favorites</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    removeFromSavedHerbs(item.herbsId.toString());
                  }}
                >
                  <Text style={styles.popUp}>Remove saved Herbs</Text>
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
      <Text style={styles.username}>Hi, {userName}</Text>
      {/* <TouchableOpacity
        style={{
          backgroundColor: backgroundColor.secondary,
          padding: 15,
          width: 200,
          borderRadius: 8,
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Change Password
        </Text>
      </TouchableOpacity> */}
      <Text style={[{ color: backgroundColor.secondary }, styles.label]}>
        Your saved Herbs
      </Text>

      {saveherbs.length > 0 ? (
        <FlatList
          data={saveherbs}
          horizontal
          keyExtractor={(item) => item.herbsId.toString()}
          renderItem={renderItemSave}
          // contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <Text style={[{ color: backgroundColor.tertiary }, styles.label]}>
          No saved Herbs
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
  username: {
    fontSize: 34,
  },
  herbUses: {
    color: "#D1556C",
    fontSize: 16,
    paddingBottom: 10,
    fontWeight: "500",
  },
  label: {
    fontSize: 16,
    // paddingHorizontal: 10,
  },
  popUp: { fontSize: 16, paddingHorizontal: 10, paddingVertical: 10 },
});
