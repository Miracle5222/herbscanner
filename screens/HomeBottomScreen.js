import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { savedHerbHandler } from "../redux/herbdatareducer";

export default function HomeScreen({ navigation }) {
  const { userPass, userId, userName } = useSelector((state) => state.user);
  const { backgroundColor } = useSelector((state) => state.theme);
  const [data, setData] = useState(null);
  const { rootRoute } = useSelector((state) => state.mainRoute); //root route to connect server
  const [herbs, setHerbsData] = useState([]);
  const [saveherbs, setSaveHerbsData] = useState([]);
  const { savedHerbsData } = useSelector((state) => state.herbData);
  const herb = [
    {
      id: "2757280",
      herbName: "Moringa",
      image: require("../assets/sunflower.jpg"),
    },
    {
      id: "3054181",
      herbName: "Zingiber",
      image: require("../assets/sunflower.jpg"),
    },
    {
      id: "5420380",
      herbName: "Psidium ",
      image: require("../assets/sunflower.jpg"),
    },
    {
      id: "2754280",
      herbName: "Moringa",
      image: require("../assets/sunflower.jpg"),
    },
    {
      id: "3054281",
      herbName: "Zingiber",
      image: require("../assets/sunflower.jpg"),
    },
    {
      id: "5420680",
      herbName: "Psidium ",
      image: require("../assets/sunflower.jpg"),
    },
  ];

  const dispatch = useDispatch();

  // const [image, setImage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Home",
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

  // Use useMemo to ensure fetchData is only created once
  // const fetchData = useMemo(() => {
  //   return async () => {
  //     try {
  //       const response = await fetch("your-api-endpoint");
  //       const result = await response.json();
  //       setData(result);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   // Call fetchData when the component mounts
  //   fetchData();
  // }, [fetchData]); // Add fetchData as a dependency to trigger the effect only once
  const retrieveRecentScanned = async () => {
    try {
      const response = await fetch(`${rootRoute}api/recentScanned`);
      if (!response.ok) {
        throw new Error("Failed to fetch recent scanned data");
      }
      const data = await response.json();
      setHerbsData(data);
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const retrieveSaveHerbs = async () => {
    try {
      const getAllSaveHerbs = await fetch(`${rootRoute}api/retrieveAllHerbs`);

      // if (!response.ok) {
      //   // throw new Error("Failed to fetch saved herbs data");
      //   console.log("No saved data");
      // }
      const res = await getAllSaveHerbs.json();
      setSaveHerbsData(res.data);
      
      // console.log(res.data);
      dispatch(savedHerbHandler(res.data));
      // console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveRecentScanned();
    retrieveSaveHerbs();
  }, []);

  // Periodically fetch data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      retrieveRecentScanned();
      retrieveSaveHerbs();
    }, 5000);

    return () => clearInterval(interval); // Clear the interval on unmount
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ marginTop: 10, marginHorizontal: 5 }} key={item.herbId}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("HerbsDetailsScreen", {
            herbName: item.herbName,
            herbImage: item.image,
            herbId: item.scannedId,
            herb: item.herbUses,
            date: item.dateScanned,
            action: "recentHerbs",
          })
        }
      >
        <Image
          priority="high"
          style={{ height: 200, width: 200, borderRadius: 8 }}
          source={{ uri: `${rootRoute}upload/${item.image}` }}
        />
        <Text style={[{ color: backgroundColor.tertiary }, styles.herbname]}>
          {item.herbName}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItemSave = ({ item }) => (
    <View
      style={{ marginTop: 10, marginHorizontal: 5, width: 80 }}
      key={item.herbId}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("HerbsDetailsScreen", {
            herbName: item.herbName,
            herbImage: item.herbImage,
            description: item.description,
            herbId: item.herbId,
            medicalUse: item.medicinalUses,
            commonName: item.commonName,
            howtouse: item.medicinalHowToUse,
            herb: item.herbUses,
            partUse: item.partUse,
            date: item.dateScanned,
            action: "allherbs",
          })
        }
      >
        <Image
          priority="high"
          style={{ height: 80, width: 80, borderRadius: 8 }}
          source={{ uri: `${rootRoute}upload/${item.herbImage}` }}
        />
        <Text style={[{ color: backgroundColor.tertiary }, styles.herbname]}>
          {item.herbName}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        {herbs.length > 0 || savedHerbsData.length > 0 ? (
          <>
            <Text style={[{ color: backgroundColor.secondary }, styles.user]}>
              Welcome, {userName}
            </Text>
            <Text style={[{ color: backgroundColor.secondary }, styles.label]}>
              Recent Scanned Herbs
            </Text>

            {/* {herbs.length > 0 ? (
              <FlatList
                data={herbs}
                horizontal
                keyExtractor={(item) => item.herbId}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContainer}
              />
            ) : (
              <Text style={[{ color: backgroundColor.tertiary }, styles.label]}>
                no recent scanned
              </Text>
            )} */}
            <Text style={[{ color: backgroundColor.secondary }, styles.label]}>
              All herbs
            </Text>
            {savedHerbsData.length > 0 ? (
              <FlatList
                data={saveherbs}
                horizontal
                keyExtractor={(item) => item.herbId}
                renderItem={renderItemSave}
                contentContainerStyle={styles.flatListContainer}
              />
            ) : (
              <Text style={[{ color: backgroundColor.tertiary }, styles.label]}>
                you don't have saved herbs
              </Text>
            )}
          </>
        ) : (
          <ActivityIndicator size="large" color="#00ff00" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "start",
    alignItems: "start",
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
