import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("screen");

const WIDTH = width;
const HEIGHT = height;

export default function HerbsDetailsScreen({ navigation, route }) {
  const { userPass, userId, userName } = useSelector((state) => state.user);
  const { backgroundColor } = useSelector((state) => state.theme);
  const [data, setData] = useState(null);
  const { rootRoute } = useSelector((state) => state.mainRoute); //root route to connect server
  const [herbs, setHerbsData] = useState([]);
  const [saveherbs, setSaveHerbsData] = useState([]);

  // const [image, setImage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Herbs Details",
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

  const retrieveHerbsDetails = async () => {
    try {
      const response = await fetch(`${rootRoute}api/commonNames`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scannedId: route.params.herbId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch saved herbs data");
      }
      const data = await response.json();
      setSaveHerbsData(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveHerbsDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Image
          style={{ height: 250, width: "100%" }}
          source={{ uri: `${rootRoute}upload/${route.params.herbImage}` }}
        />
        <Text style={[{ color: backgroundColor.tertiary }, styles.user]}>
          {route.params.herbName}
        </Text>
        {/* herbId */}
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            {saveherbs ? (
              saveherbs.map((herb) => (
                <View key={herb.commonId.toString()}>
                  <Text style={styles.bottomContentConBestMatchValue}>
                    {herb.commonNames}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No common names available</Text>
            )}
          </View>
          <Text style={styles.HerbUses}>Herb Uses</Text>
          <View>
            <Text style={styles.HerbUses}> {route.params.herb}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContentConBestMatchValue: {
    marginTop: 5,
    backgroundColor: "#B3E468",
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 8,
    color: "#316805",
    fontSize: 20,
  },
  container: {
    // paddingTop: 10,
    // paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "start",
    alignItems: "start",
  },
  HerbUses: {
    color: "#D1556C",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
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
