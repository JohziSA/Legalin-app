import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Delay navigation until the layout is mounted
    const timer = setTimeout(() => {
      router.push('/simple');
    }, 100); // Small delay to ensure RootLayout is ready
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});