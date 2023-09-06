import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function HomeScreen({ navigation }) {
  const { userPass, userId, userName } = useSelector((state) => state.user);
  const { backgroundColor } = useSelector((state) => state.theme);
  const [data, setData] = useState(null);
  const { rootRoute } = useSelector((state) => state.mainRoute); //root route to connect server
  const [herbs, setHerbsData] = useState([]);
  const [saveherbs, setSaveHerbsData] = useState([]);
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
  }, [navigation, herbs]);

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
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

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
        throw new Error("Failed to fetch saved herbs data");
      }
      const data = await response.json();
      setSaveHerbsData(data);
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
    <View style={{ marginTop: 10, marginHorizontal: 5 }}>
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
    <View style={{ marginTop: 10, marginHorizontal: 5, width: 80 }}>
      <TouchableOpacity activeOpacity={0.8}>
        <Image
          style={{ height: 80, width: 80, borderRadius: 8 }}
          source={{ uri: `${rootRoute}upload/${item.image}` }}
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
        <Text style={[{ color: backgroundColor.secondary }, styles.user]}>
          Welcome, {userName}
        </Text>
        <Text style={[{ color: backgroundColor.secondary }, styles.label]}>
          recent scanned
        </Text>
        {/* {image && (
          <Image
            style={{ height: 80, width: 80, borderRadius: 8 }}
            source={{ uri: `${rootRoute}upload/${image}` }}
          />
        )} */}
        <FlatList
          data={herbs}
          horizontal
          keyExtractor={(item) => item.scannedId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
        />
        <Text style={[{ color: backgroundColor.secondary }, styles.label]}>
          save herbs
        </Text>
        <FlatList
          data={saveherbs}
          horizontal
          keyExtractor={(item) => item.scannedId.toString()}
          renderItem={renderItemSave}
          contentContainerStyle={styles.flatListContainer}
        />
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
