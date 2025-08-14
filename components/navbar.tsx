import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Navbar = () => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navItem}>
        <View
          style={{
            backgroundColor: "#00a9b7",
            borderRadius: 360,
            width: 50,
            height: 50,
            position: "absolute",
          }}
        ></View>
        <Ionicons
          name="home-outline"
          size={25}
          color="#fff"
          style={{ zIndex: 0 }}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="chatbubbles-outline" size={25} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="person-outline" size={25} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
});