import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundContainer } from '@/components/BackgroundContainer'; // From provided code
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { InputBox } from '@/components/InputBox'; // From artifact_id="adabdf2d-6720-4365-8d88-549b9b56085d"

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { session, primary } = useAuth();

  async function signInWithEmail() {
    if (!email) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    if (password.length < 1) {
      Alert.alert('Error', 'Please provide a password to your account.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
  }

  useEffect(() => {
    if (session && primary?.user_type === 'personal') {
      router.push('/(Auth_Session)/(A-Personal)/homescreen');
    } else if (session && primary?.user_type === 'business') {
      router.push('/(Auth_Session)/(A-Business)/homescreen');
    }
    console.log('Primary user type:', primary?.user_type);
    console.log('Session user:', session?.user);
  }, [session, primary]);

  return (
    <BackgroundContainer
      headerSpace="0%"
      screenTitle='Login Screen'
      screenSubTitle='Please enter your account details'
      showBackButton = {true}
      imageSource={require('../../../assets/images/Background-1.png')} 
      onBackPress={() => router.push('/selectorscreen')}
      
    >
      <Image
        source={require('../../../assets/images/App_Icon.png')}
        style={styles.iconImage}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => console.log('Google login')}
      >
        <Ionicons name="logo-google" size={20} color="#000" />
        <Text style={styles.googleText}>Log in with Google</Text>
      </TouchableOpacity>
      <InputBox
        inputTitle="Email"
        inputSubText='Provide us your email that is linked to your account'
        type="normal"
        value={email}
        onChangeText={setEmail}
        inputStyle={{ fontSize: 16 }}
        placeholder="Enter your email"
        keyboardType="email-address"
        
      />
      <InputBox
        inputTitle="Password"
        inputSubText='Provide us your password that is linked to your account'
        type="password"
        value={password}
        onChangeText={setPassword}
        inputStyle={{ fontSize: 16 }}
        placeholder="Enter your password"
       
      />
      <View style={styles.rememberMe}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <View style={styles.checkboxBase}>
            {rememberMe && (
              <Ionicons name="checkmark" size={16} color="#007AFF" />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.rememberText}>Remember me</Text>
      </View>
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.buttonDisabled]}
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(Entry-Session)/forgot-password')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={styles.forgotpassowrdContainer}>
        <Text style={styles.text}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(Entry-Session)/selectorscreen')}>
          <Text style={styles.signUp}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.appvTest}>App version 1.1 beta</Text>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  iconImage: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  googleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxBase: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  rememberText: {
    fontSize: 14,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#00a9b7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0d1d7',
    opacity: 0.6,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#00a9b7',
    textAlign: 'center',
    marginBottom: 10,
  },
  forgotpassowrdContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signUp: {
    color: '#00a9b7',
    textAlign: 'center',
  },
  text: {
    color: '#666',
    textAlign: 'center',
  },
  appvTest: {
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 12,
  },
});