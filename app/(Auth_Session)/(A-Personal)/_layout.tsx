import { StyleSheet, View, Pressable } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ClientTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.navBar,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#333',
      }}
    >
      <Tabs.Screen
        name="homescreen"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.navItem}>
              {focused && (
                <View
                  style={{
                    backgroundColor: '#00a9b7',
                    borderRadius: 360,
                    width:80,
                    height: 50,
                    position: 'absolute',
                  }}
                />
              )}
              <Ionicons
                name="home-outline"
                size={25}
                color={color}
                style={{ zIndex: 0 }}
              />
            </View>
          ),
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <Pressable
              {...props}
              style={styles.navItem}
              android_ripple={null} // Disable Android ripple effect
              activeOpacity={1} // Disable iOS opacity change on press
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chatscreen"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.navItem}>
              {focused && (
                <View
                  style={{
                    backgroundColor: '#00a9b7',
                    borderRadius: 360,
                    width: 80,
                    height: 50,
                    position: 'absolute',
                  }}
                />
              )}
              <Ionicons
                name="chatbubbles-outline"
                size={25}
                color={color}
                style={{ zIndex: 0 }}
              />
            </View>
          ),
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <Pressable
              {...props}
              style={styles.navItem}
              android_ripple={null} // Disable Android ripple effect
              activeOpacity={1} // Disable iOS opacity change on press
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profilescreen"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.navItem}>
              {focused && (
                <View
                  style={{
                    backgroundColor: '#00a9b7',
                    borderRadius: 360,
                    width: 80,
                    height: 50,
                    position: 'absolute',
                  }}
                />
              )}
              <Ionicons
                name="person-outline"
                size={25}
                color={color}
                style={{ zIndex: 0 }}
              />
            </View>
          ),
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <Pressable
              {...props}
              style={styles.navItem}
              android_ripple={null} // Disable Android ripple effect
              activeOpacity={1} // Disable iOS opacity change on press
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 100,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});