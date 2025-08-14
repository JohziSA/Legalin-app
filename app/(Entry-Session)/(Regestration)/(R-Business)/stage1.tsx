import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { BackgroundContainer } from "@/components/BackgroundContainer";
import { InputBox } from "@/components/InputBox";
import { ButtonComponent } from "@/components/ButtonComponent";
import { ComboBox } from "@/components/ComboBox";




/**
 * Business account registration screen with multi-step form.
 */
export default function Stage1() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [current_termsAgreed, setTermsAgreed] = useState(false);
  const [lockScroll, setLockScroll] = useState(false);

  const current_usertype = "business";

  const [current_email, setEmail] = useState("");
  const [current_phone, setPhone] = useState("");
  const [current_password, setPassword] = useState("");
  const [current_confirmPassword, setConfirmPassword] = useState("");
  const [current_firstName, setFirstName] = useState("");
  const [current_lastName, setLastName] = useState("");
  const [current_gender, setGender] = useState("");
  const [current_date_of_birth, setDate_of_birth] = useState("");

  const [errormessageemail, setErrorMessageEmail] = useState("");
  const [errormessagephone, setErrorMessagePhone] = useState("");    
  const [errormessagepassword, setErrorMessagePassword] = useState("");
  const [errormessageconfirmPassword, setErrorMessageConfirmPassword] = useState("");
  const [errormessagefirstName, setErrorMessageFirstName] = useState("");
  const [errormessagelastName, setErrorMessageLastName] = useState("");
  const [errormessagegender, setErrorMessageGender] = useState("");
  const [errormessagedate_of_birth, setErrorMessageDate_of_birth] = useState("");



  useEffect(() => {
    if (current_password && current_password.length < 6) {
      setErrorMessagePassword("Password must be at least 6 characters long");
    } else {
      setErrorMessagePassword("");
    }
    if (current_confirmPassword && current_password !== current_confirmPassword) {
      setErrorMessageConfirmPassword("Passwords do not match");
    } else {
      setErrorMessageConfirmPassword("");
    }
  }, [current_password, current_confirmPassword]);

  const validateInputs = () => {
    let isValid = true;

    if (!current_email || !/^\S+@\S+\.\S+$/.test(current_email)) {
      setErrorMessageEmail("Please enter a valid email address");
      isValid = false;
    } else {
      setErrorMessageEmail("");
    }

    if (!current_phone || !/^\+?[\d\s-]{10,}$/.test(current_phone)) {
      setErrorMessagePhone("Please enter a valid phone number");
      isValid = false;
    } else {
      setErrorMessagePhone("");
    }

    if (!current_firstName || !current_lastName) {
      setErrorMessageFirstName("Please enter both first and last name");
      setErrorMessageLastName("Please enter both first and last name");
      isValid = false;
    } else {
      setErrorMessageFirstName("");
      setErrorMessageLastName("");
    }

    if (!current_gender) {
      setErrorMessageGender("Please select a gender");
      isValid = false;
    } else {
      setErrorMessageGender("");
    }

    if (!current_date_of_birth) {
      setErrorMessageDate_of_birth("Please enter your date of birth");
      isValid = false;
    } else {
      setErrorMessageDate_of_birth("");
    }

    if (!current_termsAgreed) {
      Alert.alert("Error", "Please agree to the Terms of Service and Privacy Policy");
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
  if (!validateInputs()) return;

  setLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({
      email: current_email,
      password: current_password,
      phone: current_phone,
      options: {
        data: {
          user_type: current_usertype,
          user_firstname: current_firstName,
          user_lastname: current_lastName,
          user_gender: current_gender,
          user_date_of_birth: current_date_of_birth,
          user_profile_picture_url: null,
          user_bio: null,
          user_agreed_to_terms: current_termsAgreed,
        },
      },
    });

    if (error) throw error;
    Alert.alert("Success", "Account created successfully! Please check your email to verify.");
    // Pass the email to Stage2
    router.push({
      pathname: '/(Entry-Session)/(Regestration)/(R-Business)/stage2',
      params: { email: current_email },
    });
  } catch (error: any) {
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
};

  

  const screens = [
    <View key="screen1">
      <View style={styles.screenContent}>
        <View style={styles.noteBox}>
          <View style={styles.noteHeader}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#fff"
            />
            <Text style={styles.noteTitle}>Note</Text>
          </View>
          <Text style={styles.noteText}>
            You are on the business account registration page. Do you wish to go
            to the personal account page?
          </Text>
          




        
          <ButtonComponent
            buttonText="Click here"
            middleIconName="arrow-forward"
            backgroundColor="#026c75"
            height={40}
            onPress={() =>
              console.log("Navigate to personal account page")
            }
          />
        </View>
        
        <InputBox
          inputTitle="Email Address"
          inputSubText="Enter a valid email address."
          value={current_email}
          onChangeText={setEmail}
          keyboardType="email-address"
          errorMessage={errormessageemail}
        />
        <InputBox
          inputTitle="Phone Number"
          inputSubText="Enter your phone number"
          value={current_phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          errorMessage={errormessagephone}
        />
        <InputBox
          inputTitle="Password"
          inputSubText="Enter your password"
          type="password"
          keyboardType="default"
          value={current_password}
          onChangeText={setPassword}
         
          errorMessage={errormessagepassword}
        />
        <InputBox
          inputTitle="Confirm Password"
          inputSubText="Repeat password"
          type="password"
          keyboardType="default"
          value={current_confirmPassword}
          onChangeText={setConfirmPassword}
       
          errorMessage={errormessageconfirmPassword}
        />
        <ButtonComponent
          buttonText="Continue to next page"
          height={50}
          textFontSize={16}
          rightIconName="arrow-forward"
          onPress={() => setSelectedIndex(1)}
          textAlign="left"
        />
      </View>
    </View>,
    <View key="screen2">
      <View style={styles.screenContent}>
        <InputBox
          inputTitle="First name"
          inputSubText="Enter your first name"
          value={current_firstName}
          onChangeText={setFirstName}
       
          errorMessage={errormessagefirstName}
        />
        <InputBox
          inputTitle="Last name"
          inputSubText="Enter your last name"
          value={current_lastName}
          onChangeText={setLastName}
         
          errorMessage={errormessagelastName}
        />
        <ComboBox
          
          comboTitle="Gender"
          comboSubText="Select your Gender"
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Prefer not to say", value: "Prefer not to say" },
          ]}
          value={current_gender}
          onChangeText={setGender}
          errorMessage={errormessagegender}
          onOpen={() => setLockScroll(true)}
          onClose={() => setLockScroll(false)}
        />
        <InputBox
          inputTitle="Date of Birth"
          inputSubText="Enter your date of birth"
          type="date"
          value={current_date_of_birth}
          onChangeText={setDate_of_birth}
          
          errorMessage={errormessagedate_of_birth}
        />
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setTermsAgreed(!current_termsAgreed)}
          >
            <Ionicons
              name={current_termsAgreed ? "checkbox" : "square-outline"}
              size={24}
              color="#026c75"
            />
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.linkText}>Terms of Service</Text>{" "}
            and <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </View>
        <ButtonComponent
          buttonText="Sign Up"
          height={50}
          textFontSize={16}
          rightIconName="arrow-forward"
          onPress={handleSignUp}
          textAlign="left"
        />
      </View>
    </View>,
  ];

  const screenNames = [
    "Login",
    "Personal Info",
  ];

  const screenSubText = [
    "Enter your login credentials",
    "Provide your personal and professional details",
  ];

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
        screenTitle="Business Account"
        headerSpace="5%"
        showBackButton
        backButtonText="Go Back"
        onBackPress={() => router.back()}
        multiscreen
        screencount={2}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        screenNames={screenNames}
        screenSubText={screenSubText}
        showMultiscreenbuttons
        lockScroll={lockScroll}
       
      >
        {screens[selectedIndex]}
      </BackgroundContainer>

  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
   
  },
  checkbox: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxText: {
    color: "#333",
    fontSize: 13,
    paddingLeft: 10,
  },
  linkText: {
    color: "#00a9b7",
    textDecorationLine: "underline",
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