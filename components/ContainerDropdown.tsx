import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { Easing, LinearTransition } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

const ContainerDropdown = ({ iconName, title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggleSection}>
        <View style={styles.iconTextRow}>
          <Ionicons name={iconName} size={24} color="#000" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Ionicons
          name={isExpanded ? "arrow-up-circle-outline" : "arrow-down-circle-outline"}
          size={24}
          color="#000"
        />
      </TouchableOpacity>
      {isExpanded && (
        <Animated.View
          style={styles.sectionContent}
          layout={LinearTransition.duration(300).easing(Easing.ease)}
        >
          <ScrollView nestedScrollEnabled={true}>
            {children}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  sectionTitle: {
    fontSize: 15,
    color: "#333",
  },
  sectionContent: {
    padding: 15,
    maxHeight: 200,
  },
});

export default ContainerDropdown;