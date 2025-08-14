import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MenuButton from "@/components/MenuButton";
import HeaderComponent from "@/components/HeaderComponent";

const ProfileScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const toggleSwitch = (value) => setIsNotificationsEnabled(value);

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout pressed");
  };

  const handleEditPress = () => {
    // Add edit personal details logic here
    console.log("Edit personal details pressed");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/Background-1.png")} // Replace with actual background image
      style={styles.background}
      resizeMode="cover"
    >
      <HeaderComponent
        profileImage={null} // Replace with actual image source if available
        name="Profile Namesdfsdfsdf"
        location="Location"
        notificationCount={0} // Set to 0 or manage state as needed
        onLogout={handleLogout}
        textButton="Edit personal details"
        onTextButtonPress={handleEditPress}
        headerStyle={2}
      />
      <Text style={styles.title}>Account options</Text>

      <View style={styles.containerMain}>
        <ScrollView>
          <View style={styles.containerContent}>
            {/* Profile Section */}
            <Text style={styles.sectionSubHeadings}>Profile</Text>
            <View>
              <MenuButton
                iconName="person-outline"
                text="Profile Details"
                onPress={() => {}}
              />
              <MenuButton
                iconName="lock-closed-outline"
                text="Privacy Setting"
                onPress={() => {}}
              />
              <MenuButton
                iconName="wallet-outline"
                text="wallet"
                onPress={() => {}}
              />
            </View>

            {/* Notifications Section */}
            <Text style={styles.sectionSubHeadings}>Notifications</Text>
            <View>
              <MenuButton
                iconName="notifications-outline"
                text="Allow Notifications"
                isToggle={true}
                onToggle={toggleSwitch}
                onPress={() => {}}
              />
            </View>

            {/* Regional Section */}
            <Text style={styles.sectionSubHeadings}>Regional</Text>
            <View>
              <MenuButton
                iconName="location-outline"
                text="Loaction Details"
                onPress={() => {}}
              />
              <MenuButton
                iconName="language-outline"
                text="Language Settings"
                onPress={() => {}}
              />
            </View>
            <Text style={styles.sectionSubHeadings}>Regional</Text>
            <View>
              <MenuButton
                iconName="location-outline"
                text="Loaction Details"
                onPress={() => {}}
              />
              <MenuButton
                iconName="language-outline"
                text="Language Settings"
                onPress={() => {}}
              />
            </View>
            <Text style={styles.sectionSubHeadings}>Regional</Text>
            <View>
              <MenuButton
                iconName="location-outline"
                text="Loaction Details"
                onPress={() => {}}
              />
              <MenuButton
                iconName="language-outline"
                text="Language Settings"
                onPress={() => {}}
              />
            </View>
            <View style={{ alignItems: "center", backgroundColor: "#fff" }}>
              <Text style={styles.appVersion}>App version 1.1 beta</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  title: {
    position: "absolute",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    marginTop: 120,
    marginLeft: 20,
    marginBottom: 10,
  },
  containerMain: {
    flex: 1,
    marginTop: "40%",
    padding: 10,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  containerContent: {
    marginBottom: "20%",
    padding: 10,
    backgroundColor: "transparent",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  sectionSubHeadings: {
    fontSize: 15,
    fontWeight: "bold",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 20,
    color: "#000",
  },
  appVersion: {
    textAlign: "center",
    color: "#000",
    marginVertical: 10,
  },
});

export default ProfileScreen;