import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HeaderComponent = ({
  profileImage,
  name,
  location,
  notificationCount,
  onLogout,
  textButton,
  onTextButtonPress,
  headerStyle = 1, // Default to Home Screen style (1)
}) => {
  const renderHeader = () => {
    switch (headerStyle) {
      case 1: // Home Screen style
        return (
          <View style={styles.headerMainContent}>
            <View style={styles.profileCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person" size={30} color="#000" />
              )}
            </View>
            <View style={styles.profileSection}>
              <Text style={styles.accountName}>{name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#fff" />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                {notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2: // Profile Screen style
        return (
          <View style={styles.headerMainContent}>
            <View style={styles.profileCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person" size={30} color="#000" />
              )}
            </View>
            <View style={styles.profileSection}>
              <Text style={styles.accountName}>{name}</Text>
              
              {textButton && (
                <TouchableOpacity
                  style={styles.editTouchable}
                  onPress={onTextButtonPress}
                >
                  <Text style={styles.editText}>{textButton}</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color="#666"
                    style={styles.chevronIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.headerMainContent}>
            {/* Default to Home Screen style for unrecognized styles */}
            <View style={styles.profileCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person" size={30} color="#000" />
              )}
            </View>
            <View style={styles.profileSection}>
              <Text style={styles.accountName}>{name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color="#fff" />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                {notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return renderHeader();
};

const styles = StyleSheet.create({
  headerMainContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    height: 150,
    position: "absolute",
    width: "100%",
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#00a9b7",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  profileSection: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 20,
    marginRight: 20,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 5,
    textAlign: "left",
  },
  editTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
  },
  editText: {
    color: "#fff", // Changed to white
    fontSize: 12, // Matched to locationText size
  },
  chevronIcon: {
    marginLeft: 5, // Space between text and icon
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "absolute",
    right: 20,
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
  logoutButton: {},
});

export default HeaderComponent;