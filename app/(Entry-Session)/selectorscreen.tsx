import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';

export default function SelectorScreen() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleButtonPress = (option, pressOption) => {
    if (option === 'Sign In') {
      router.push('/(Entry-Session)/(Authentication)/loginscreen');
    } else if (option === 'Create Account' && pressOption === 'Personal') {
      router.push('/(Entry-Session)/(Regestration)/regpersonal');
    } else if (option === 'Create Account' && pressOption === 'Business') {
      router.push('/(Entry-Session)/(Regestration)/(R-Business)/stage1');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/Background-2.png')}
      resizeMode="cover"
      style={styles.maincontainer}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -50 }}>
        <Image
          source={require('../../assets/images/App_Icon_AnimReady.png')}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 20 }}>
          Legalin
        </Text>
        <Text style={{ fontSize: 24, color: '#fff' }}>Select an Option</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, selectedOption === 'Sign In' && styles.selected]}
            onPress={() => handleOptionSelect('Sign In')}
          >
            <Text style={[styles.buttonText, selectedOption === 'Sign In' && styles.buttonTextSelected]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedOption === 'Create Account' && styles.selected]}
            onPress={() => handleOptionSelect('Create Account')}
          >
            <Text style={[styles.buttonText, selectedOption === 'Create Account' && styles.buttonTextSelected]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
        {selectedOption === 'Sign In' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button,{width:"50%"}]}
              onPress={() => handleButtonPress('Sign In', null)}
            >
              <Text style={styles.buttonText}>Sign into Account</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedOption === 'Create Account' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress('Create Account', 'Personal')}
            >
              <Text style={styles.buttonText}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress('Create Account', 'Business')}
            >
              <Text style={styles.buttonText}>Business</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  buttonRow: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    padding: 0,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    backgroundColor: 'rgba(33, 33, 33, 0.0)',
    width: 140,
    height: 40,
    justifyContent: 'center',
    margin: 5,
  },
  selected: {
    backgroundColor: '#ffffff',
    borderColor: '#fff',
    borderWidth: 2,
  },
  buttonText: {
    color: '#f0f0f0ff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight:'bold',
  },
  buttonTextSelected: {
    color: '#00a9b7',
  },
});