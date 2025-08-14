import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const TestScreen = () => {
  // Shared value for synchronized scale animation
  const scale = useSharedValue(1);
  // Shared value for color index
  

  // Animation configuration
  useEffect(() => {
    const duration = 1000; // Duration for each grow/shrink phase
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), // Start at base size
        withTiming(2.05, { duration, easing: Easing.inOut(Easing.ease) }) // Grow to max (used for Circle 4)
      ),
      -1, // Infinite loop
      true // Reverse
    );
  }, [scale]);

  // Animated styles for each circle
  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: 1 }], 
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value > 1 ? scale.value * (1.35 / 2.05) : 1 }], // Scale to 1.1 max
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value > 1 ? scale.value * (1.70 / 2.05) : 1 }], // Scale to 1.35 max
  }));
  const animatedStyle4 = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }], // Scale to 1.6 max
  }));

  return (
    <View style={styles.mainbackground}>
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, styles.circle4, animatedStyle4]} />
        <Animated.View style={[styles.circle, styles.circle3, animatedStyle3]} />
        <Animated.View style={[styles.circle, styles.circle2, animatedStyle2]} />
        <Animated.View style={[styles.circle, styles.circle1, animatedStyle1]} />
      </View>
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  mainbackground: {
    flex: 1,
    backgroundColor: '#00a9b7',
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
  },
  circle1: {
    width: 100,
    height: 100,
    zIndex: 4, // Topmost
    backgroundColor:"#fff",
  },
  circle2: {
    width: 100,
    height: 100,
    zIndex: 3, // Above Circle 3
    backgroundColor:"#03bac9",
  },
  circle3: {
    width: 100,
    height: 100,
    zIndex: 2, // Above Circle 4
    backgroundColor:"#00b2c1",
  },
  circle4: {
    width: 100,
    height: 100,
    zIndex: 1, // Backmost
    backgroundColor:"#00afbe",
  },
});