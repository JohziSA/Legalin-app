import Navbar from "@/components/navbar";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import ContainerDropdown from "@/components/ContainerDropdown";
import HeaderComponent from "@/components/HeaderComponent";

const HomeScreen = () => {
  const [notificationCount, setNotificationCount] = useState(1); // Placeholder, adjust based on database later

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout pressed");
  };

  return (
    <>
      <ImageBackground
        source={require("../../../assets/images/Background-1.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <HeaderComponent
          profileImage={null} // Replace with actual image source if available
          name="Name and Surname"
          location="Location"
          notificationCount={notificationCount}
          onLogout={handleLogout}
          headerStyle={1}
        />
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.containerMain}>
          <ScrollView>
            <View style={styles.containerContent}>
              <Text style={styles.sectionSubHeadings}>Connected Lawyers</Text>
              <ContainerDropdown
                iconName="person-outline"
                title="View All Lawyers"
              >
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>
                    Connect to a Lawyer
                  </Text>
                  <Text style={styles.addButtonAction}>ADD</Text>
                </TouchableOpacity>
              </ContainerDropdown>

              <Text style={styles.sectionSubHeadings}>Upcoming Meetings</Text>
              <ContainerDropdown
                iconName="calendar-outline"
                title="View all upcoming meetings"
              >
                <Text>View all upcoming meetings</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>
                    Schedule a Meeting
                  </Text>
                  <Text style={styles.addButtonAction}>SCHEDULE</Text>
                </TouchableOpacity>
              </ContainerDropdown>

              <Text style={styles.sectionSubHeadings}>Cases</Text>
              <ContainerDropdown
                iconName="briefcase-outline"
                title="View all Cases & Documents"
              >
                <Text>View all cases & Documents</Text>
              </ContainerDropdown>

              <Text style={styles.sectionSubHeadings}>
                Transcripts & Recordings
              </Text>
              <ContainerDropdown
                iconName="document-outline"
                title="View all Transcripts & Recordings"
              >
                <Text>View Transcripts & Recordings</Text>
              </ContainerDropdown>

              <Text style={styles.sectionSubHeadings}>Quick Links</Text>
              <View style={styles.sectionContainer}>
                <View style={styles.quickActionButtons}>
                  <TouchableOpacity style={styles.quickActionButton}>
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color="#fff"
                    />
                    <Text style={styles.quickActionText}>ADD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickActionButton}>
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      size={24}
                      color="#fff"
                    />
                    <Text style={styles.quickActionText}>CHAT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickActionButton}>
                    <Ionicons name="call-outline" size={24} color="#fff" />
                    <Text style={styles.quickActionText}>CALL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  containerMain: {
    flex: 1,
    marginTop: "40%",
    padding: 10,
    backgroundColor: "white",
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
  sectionSubHeadings: {
    fontSize: 15,
    fontWeight: "bold",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 20,
    color: "#000",
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#00a9b7",
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  addButtonAction: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  quickActionButtons: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginTop: 10,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#00a9b7",
    borderRadius: 5,
    margin: 5,
    height: 35,
    paddingLeft: 10,
  },
  quickActionText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 10,
    textAlign: "center",
  },
});

export default HomeScreen;