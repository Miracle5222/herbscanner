import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useSelector } from "react-redux";

const AboutScreen = ({ navigation }) => {
  const { backgroundColor } = useSelector((state) => state.theme);

  const dev = [
    {
      id: "1",
      name: "Evelyn M. Bihag",
      position: "Project Manager",
      image: require("../assets/eve.jpg"),
    },
    {
      id: "2",
      name: "Junalyn P. Duhaylungosod",
      position: "Fullstack Developer",
      image: require("../assets/jun.jpg"),
    },
    {
      id: "3",
      name: "Marjean M. Lebonfacil",
      position: "UI/UX Designer",
      image: require("../assets/mar.jpg"),
    },
    {
      id: "4",
      name: "Marilou P. Maribao",
      position: "Pentester",
      image: require("../assets/mari.jpg"),
    },
  ];
  const RenderDeveloper = ({ item, index }) => (
    <View
      style={{
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginRight: 20,
      }}
    >
      <View>
        <Image
          source={item.image}
          style={{ height: 280, width: 350, borderRadius: 8 }}
        />
      </View>
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingVertical: 10,
          width: "100%",
          borderRadius: 10,
          marginVertical: 10,
        }}
      >
        <Text style={styles.devName}>Name: {item.name}</Text>
        <Text style={styles.devPosition}>Position: {item.position}</Text>
      </View>
    </View>
  );
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
  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={[{ color: backgroundColor.secondary }, styles.herbUses]}>
            About
          </Text>
          <Text style={styles.about}>
            The Herb Scanner App is a powerful tool for identifying herbs and
            understanding their uses. Our app is designed for anyone interested
            in discovering and utilizing the potential of herbs in their daily
            lives.
          </Text>
          <Text style={[{ color: backgroundColor.secondary }, styles.herbUses]}>
            The Team
          </Text>
          <View>
            <FlatList
              data={dev}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={RenderDeveloper}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;

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
    fontSize: 34,
    paddingBottom: 10,
    fontWeight: "500",
  },
  label: {
    fontSize: 16,
    // paddingHorizontal: 10,
  },
  about: {
    color: "#363636",
    fontSize: 18,
    paddingBottom: 10,
    fontWeight: "500",
  },
  devName: {
    color: "#D1556C",
    fontSize: 18,
    paddingBottom: 10,
    paddingLeft: 10,
    fontWeight: "500",
  },
  devPosition: {
    color: "#316805",
    paddingLeft: 10,
    fontSize: 16,
    paddingBottom: 10,
  },
});
