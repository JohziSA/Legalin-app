import { Button, StyleSheet, View } from "react-native";
import React from "react";
import { router } from "expo-router";



const simpledebug = () => {
  
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button title="stage1" onPress={() => router.push('/(Entry-Session)/(Regestration)/(R-Business)/stage1')} />
      <Button title="stage2" onPress={() => router.push('/(Entry-Session)/(Regestration)/(R-Business)/stage2')} />
      <Button title="home" onPress={() => router.push('/(Entry-Session)/(Authentication)/loginscreen')} />
    </View>
  );
};

export default simpledebug;

const styles = StyleSheet.create({});
