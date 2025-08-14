import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface ButtonComponentProps {
  type?: 'basic';
  leftIconName?: any;
  middleIconName?: any;
  rightIconName?: any;
  buttonText?: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  height?: number;
  textFontSize?: number;
  textColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ButtonComponent({
  type = 'basic',
  leftIconName,
  middleIconName,
  rightIconName,
  buttonText,
  textAlign,
  backgroundColor = '#00a9b7',
  height = 40,
  textFontSize = 12,
  textColor = '#fff',
  onPress,
  style,
}: ButtonComponentProps) {
  // Default to center text if both left and right icons are present and textAlign is not specified
  const effectiveTextAlign = leftIconName && rightIconName && !textAlign ? 'center' : textAlign || 'center';

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <View
        style={[
          styles.button,
          { backgroundColor, height },
          style, // Apply external style (e.g., flex: 1)
        ]}
      >
        {leftIconName && (
          <Ionicons name={leftIconName} size={16} color="#fff" style={styles.icon} />
        )}
        {buttonText ? (
          <Text
            style={[
              styles.buttonText,
              { fontSize: textFontSize, color: textColor, textAlign: effectiveTextAlign },
            ]}
          >
            {buttonText}
          </Text>
        ) : middleIconName && (
          <View style={styles.iconContainer}>
            <Ionicons name={middleIconName} size={24} color="#fff" />
          </View>
        )}
        {rightIconName && (
          <Ionicons name={rightIconName} size={16} color="#fff" style={styles.icon} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10, // Reduced padding to control width
    justifyContent: 'center', // Center content horizontally
  },
  buttonText: {
    flex: 1,
    fontWeight: 'bold',
  },
  icon: {
    marginHorizontal: 5,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});