import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { BackgroundContainer } from "@/components/BackgroundContainer";
import { ButtonComponent } from "@/components/ButtonComponent";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Stage2() {
  const { email } = useLocalSearchParams<{ email: string }>(); // Get email from navigation params
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (timeLeft > 0 && !canResend) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft, canResend]);

  

const handleVerify = async () => {
  const code = verificationCode.join("");
  if (!code || !/^\d{6}$/.test(code)) {
    Alert.alert("Error", "Please enter a valid 6-digit verification code");
    return;
  }

  setLoading(true);
  try {
    // Get user ID from AsyncStorage
    const userId = await AsyncStorage.getItem("pending_user_id");
    if (!userId) {
      throw new Error("User ID not found. Please try signing up again.");
    }

    // Fetch user email from Supabase
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();

    if (userError || !userData?.email) {
      throw new Error("Unable to retrieve user email.");
    }

    const { error } = await supabase.auth.verifyOtp({
      email: userData.email,
      token: code,
      type: "signup",
    });

    if (error) throw error;
    // Clear stored user ID
    await AsyncStorage.removeItem("pending_user_id");
    Alert.alert("Success", "Account verified successfully!");
    router.push("/(Entry-Session)/(Regestration)/(R-Business)/stage3");
  } catch (error: any) {
    Alert.alert("Error", error.message || "Verification failed.");
  } finally {
    setLoading(false);
  }
};

const handleResendCode = async () => {
  setLoading(true);
  try {
    const userId = await AsyncStorage.getItem("pending_user_id");
    if (!userId) {
      throw new Error("User ID not found. Please try signing up again.");
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", userId)
      .single();

    if (userError || !userData?.email) {
      throw new Error("Unable to retrieve user email.");
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: userData.email,
    });

    if (error) throw error;
    setTimeLeft(180);
    setCanResend(false);
    Alert.alert("Success", "Verification code resent to your email");
  } catch (error: any) {
    Alert.alert("Error", error.message || "Failed to resend verification code.");
  } finally {
    setLoading(false);
  }
};

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleInputChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newCode = [...verificationCode];
      newCode[index] = text;
      setVerificationCode(newCode);

      // Auto-focus next input if a digit is entered
      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      // Auto-focus previous input on backspace
      if (!text && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const screens = [
    <View key="screen1" style={styles.screenContent}>
      <View style={styles.noteBox}>
        <View style={styles.noteHeader}>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
          <Text style={styles.noteTitle}>Note</Text>
        </View>
        <Text style={styles.noteText}>
          A 6-digit verification code has been sent to your email. Please enter it below to verify your account.
        </Text>
      </View>
      <View style={styles.codeContainer}>
        {verificationCode.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            autoFocus={index === 0}
            returnKeyType={index < 5 ? "next" : "done"}
            onSubmitEditing={() => {
              if (index < 5) {
                inputRefs.current[index + 1]?.focus();
              } else {
                handleVerify();
              }
            }}
          />
        ))}
      </View>
      <Text style={styles.timerText}>
        Resend code in {formatTime(timeLeft)}
      </Text>
      {canResend && (
        <ButtonComponent
          buttonText="Resend Code"
          backgroundColor="#026c75"
          height={40}
          onPress={handleResendCode}
          disabled={loading}
        />
      )}
      <ButtonComponent
        buttonText="Verify"
        height={50}
        textFontSize={16}
        rightIconName="arrow-forward"
        onPress={handleVerify}
        textAlign="left"
        disabled={loading}
      />
    </View>,
  ];

  const screenNames = ["Verification"];
  const screenSubText = ["Enter your verification code"];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a9b7" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }


  return (
    <BackgroundContainer
      screenTitle="Verify Account"
      screenSubTitle="Please enter the verification code sent to your email"
      headerSpace="5%"
      showBackButton
      backButtonText="Go Back"
      onBackPress={() => router.back()}
      screencount={1}
      selectedIndex={0}
      screenNames={screenNames}
      screenSubText={screenSubText}
      showMultiscreenbuttons
    >
      {screens[0]}
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    padding: 10,
  },
  noteBox: {
    backgroundColor: "#00a9b7",
    padding: 10,
    borderRadius: 5,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 20,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 5,
  },
  noteTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noteText: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 10,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#f0f0f0",
  },
  timerText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#00a9b7",
  },
});