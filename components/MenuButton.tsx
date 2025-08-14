import React, { useState, ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the props interface
interface MenuButtonProps {
  iconName: string;
  text: string;
  onPress: () => void;
  isToggle?: boolean;
  onToggle?: (value: boolean) => void;
  moreInfo?: string; // Optional more info text
}

const MenuButton: React.FC<MenuButtonProps> = ({ iconName, text, onPress, isToggle = false, onToggle, moreInfo }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (value: boolean) => {
    setIsEnabled(value);
    if (onToggle) onToggle(value);
  };

  const handleExpand = () => {
    if (moreInfo) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={isToggle ? handleExpand : onPress}
      >
        <Ionicons name={iconName} size={24} color="#000" />
        <Text style={styles.buttonText}>{text}</Text>
        {isToggle ? (
          <Switch
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={isEnabled ? "#00a9b7" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggle}
            value={isEnabled}
          />
        ) : (
          <Ionicons name="chevron-forward-outline" size={24} color="#000" />
        )}
      </TouchableOpacity>
      {moreInfo && isExpanded && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{moreInfo}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginHorizontal: 15,
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
});

export default MenuButton;