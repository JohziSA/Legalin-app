import React, { useCallback, useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Slot, SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

// Define the onLayoutRootView function
SplashScreen.preventAutoHideAsync();
import { useFonts } from "expo-font";
import AuthProvider from "@/providers/AuthProvider";
export default function RootLayout() {
 const colorScheme =  useColorScheme();
  const [loaded, error] = useFonts ({
  
  });

   const onLayoutRootView = useCallback(async () => {
    if (loaded || error) {
      await SplashScreen.hideAsync().catch(console.warn);
    }
  }, [loaded, error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [loaded, error]);

  // Show nothing until fonts are loaded or an error occurs
  if (!loaded && !error) {
    return null;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>  
      <StatusBar style="dark" />
      <Slot/>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// Optional: Define styles using StyleSheet (best practice)
const styles = StyleSheet.create({});
