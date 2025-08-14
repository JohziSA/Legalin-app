import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { BackgroundContainer } from "@/components/BackgroundContainer";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { InputBox } from "@/components/InputBox";
import { ButtonComponent } from "@/components/ButtonComponent";
import { ComboBox } from "@/components/ComboBox";
import { supabase } from "@/lib/supabase";

export default function RegPersonal() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [bio, setBio] = useState("");
  const [idtype, setidtype] = useState("");
  const [idnumber, setidnumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idImage, setIdImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  async function uploadImage(
    uri: string,
    bucket: string,
    fileNamePrefix: string,
    userId: string
  ): Promise<string> {
    try {
      console.log(
        `Uploading image to bucket: ${bucket}, path: ${userId}/${fileNamePrefix}_${Date.now()}`
      );
      const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());
      const fileExt = uri.split(".").pop()?.toLowerCase() ?? "jpeg";
      if (!["jpg", "jpeg", "png"].includes(fileExt)) {
        throw new Error("Only JPG or PNG files are allowed");
      }
      const timestamp = Date.now();
      const path = `${userId}/${fileNamePrefix}_${timestamp}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, arraybuffer, {
          cacheControl: "3600",
          upsert: true,
          contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      console.log(`Image uploaded, public URL: ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    } catch (error) {
      throw new Error(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  const handleSignUp = async () => {
    try {
      setUploading(true);
      console.log("Starting signup process...");

      if (!email || !password || !confirmPassword) {
        alert("Please fill in email and password");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // 1. Sign up user
      console.log("Signing up user with email:", email);
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          phone,
          options: {
            data: {
              user_firstname: firstName,
              user_lastname: lastName,
              user_gender: gender,
              user_birthday: birthday,
              user_bio: bio,
              user_type: "personal",
              user_phone: phone,
              user_id_type: idtype,
              user_idnumber: idnumber,
            },
          },
        });

      if (signUpError) throw signUpError;
      if (!signUpData?.user?.id) throw new Error("No user ID returned");

      const userId = signUpData.user.id;
      console.log("User signed up with ID:", userId);

      // 2. Upload profile image
      let profileUrl = "";
      if (profileImage) {
        console.log("Uploading profile image...");
        profileUrl = await uploadImage(
          profileImage,
          "storage-profilepictures",
          "profile",
          userId
        );
        console.log("Profile image uploaded, URL:", profileUrl);
      } else {
        console.log("No profile image provided");
      }

      // 3. Upload ID image
      let idUrl = "";
      if (idImage) {
        console.log("Uploading ID image...");
        idUrl = await uploadImage(idImage, "storage-idpictures", "id", userId);
        console.log("ID image uploaded, URL:", idUrl);
      } else {
        console.log("No ID image provided");
      }

      // 4. Update RLS tables with image URLs
      const updates = [];
      if (profileUrl) {
        updates.push(
          supabase
            .from("User_Profile_RLS")
            .upsert({ id: userId, user_profileurl: profileUrl })
            .eq("id", userId)
        );
      }
      if (idUrl) {
        updates.push(
          supabase
            .from("User_Identification_RLS")
            .update({ id: userId, user_idurl: idUrl })
            .eq("id", userId)
        );
      }

      if (updates.length > 0) {
        console.log("Updating RLS tables...");
        const results = await Promise.all(updates);
        const errors = results.filter((result) => result.error != null);
        if (errors.length > 0) {
          throw new Error(
            "Failed to update image URLs in user tables: " +
              errors.map((e) => e.error!.message).join(", ")
          );
        }
        console.log("RLS tables updated successfully");
      }

      alert("Account created");
      router.push("/(Entry-Session)/(Authentication)/loginscreen");
    } catch (error: any) {
      console.error("Signup error:", error.message);
      alert(`Signup failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    isProfileImage: boolean
  ) => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access media library is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const uri = result.assets[0].uri;
        const fileExt = uri.split(".").pop()?.toLowerCase();
        if (!fileExt || !["jpg", "jpeg", "png"].includes(fileExt)) {
          alert("Only JPG or PNG files are allowed");
          return;
        }

        // Check file size
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileSize = blob.size;
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (fileSize > maxSize) {
          alert(`File size exceeds "5MB" limit`);
          return;
        }

        setImage(uri);
      }
    } catch (error) {
      alert(
        `Error selecting image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const takePhoto = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    isProfileImage: boolean
  ) => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const uri = result.assets[0].uri;
        const fileExt = uri.split(".").pop()?.toLowerCase();

        if (!fileExt || !["jpg", "jpeg", "png"].includes(fileExt)) {
          alert("Only JPG or PNG files are allowed");
          return;
        }

        // Check file size
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileSize = blob.size;
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (fileSize > maxSize) {
          alert(`File size exceeds 5MB limit`);
          return;
        }

        setImage(uri);
      }
    } catch (error) {
      alert(
        `Error taking photo: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const screens = [
    <View key="screen1">
      <View style={styles.noteBox}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="information-circle-outline" size={24} color="#fff" />
          <Text style={styles.noteTitle}>Note</Text>
        </View>
        <Text style={styles.noteText}>
          You are on the personal account registration page. Do you wish to go
          to the business account page?
        </Text>
        <ButtonComponent
          buttonText="Click here"
          middleIconName="arrow-forward"
          backgroundColor="#026c75"
          height={40}
          onPress={() =>
            router.push("/(Entry-Session)/(Regestration)/regbusiness")
          }
        />
      </View>

      <InputBox
        inputTitle="Email Address"
        inputSubText="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <InputBox
        inputTitle="Phone Number"
        inputSubText="Enter your phone number"
        value={phone}
        onChangeText={setPhone}
      />
      <InputBox
        inputTitle="Password"
        inputSubText="Enter your password"
        type="password"
        value={password}
        onChangeText={setPassword}
      />
      <InputBox
        inputTitle="Confirm Password"
        inputSubText="Repeat password"
        type="password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <ButtonComponent
        buttonText="Continue to next page"
        height={50}
        textFontSize={16}
        rightIconName="arrow-forward"
        onPress={() => setSelectedIndex(1)}
        textAlign="left"
      />
    </View>,

    <View key="screen2">
      <View style={styles.uploadBox}>
        <View style={styles.imageBox}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.imagePreview} />
          ) : (
            <Ionicons name="person-outline" size={100} color="#ccc" />
          )}
        </View>
        <View style={styles.imageTextBox}>
          <Text style={styles.imageTitle}>Upload a profile picture</Text>
          <Text style={styles.imageSubText}>
            Image must be under 5MB (JPG or PNG)
          </Text>
          <View style={styles.buttonRow}>
            <ButtonComponent
              buttonText={uploading ? "Uploading..." : "Upload"}
              backgroundColor="#026c75"
              height={40}
              textFontSize={14}
              onPress={() => pickImage(setProfileImage)}
              style={{ flex: 1 }}
            />
            <ButtonComponent
              middleIconName="camera-outline"
              backgroundColor="#026c75"
              height={40}
              onPress={() => takePhoto(setProfileImage)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>

      <InputBox
        inputTitle="First Name"
        inputSubText="Enter your first name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <InputBox
        inputTitle="Last Name"
        inputSubText="Enter your last name"
        value={lastName}
        onChangeText={setLastName}
      />
      <ComboBox
        comboTitle="Select your gender"
        comboSubText="Choose your gender"
        value={gender}
        onChangeText={setGender}
        options={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Prefer not to say", value: "Prefer not to say" },
        ]}
        enableSearch
        width="100%"
        errorMessage=""
      />
      <InputBox
        inputTitle="Birthday"
        inputSubText="Enter your birthday"
        type="birthday"
        value={birthday}
        onChangeText={setBirthday}
      />
      <InputBox
        inputTitle="Profile Bio"
        inputSubText="Tell us about yourself"
        type="multiline"
        value={bio}
        onChangeText={setBio}
      />
      <ButtonComponent
        buttonText="Continue to next page"
        height={50}
        textFontSize={16}
        rightIconName="arrow-forward"
        onPress={() => setSelectedIndex(2)}
        textAlign="left"
      />
    </View>,

    <View key="screen3">
      <View style={styles.uploadBox}>
        <View style={styles.imageBox}>
          {idImage ? (
            <Image source={{ uri: idImage }} style={styles.imagePreview} />
          ) : (
            <Ionicons name="card-outline" size={100} color="#ccc" />
          )}
        </View>
        <View style={styles.imageTextBox}>
          <Text style={styles.imageTitle}>Upload your ID</Text>
          <Text style={styles.imageSubText}>Max 5MB, JPG or PNG format</Text>
          <View style={styles.buttonRow}>
            <ButtonComponent
              buttonText={uploading ? "Uploading..." : "Upload"}
              backgroundColor="#026c75"
              height={40}
              textFontSize={14}
              onPress={() => pickImage(setIdImage)}
              style={{ flex: 1 }}
            />
            <ButtonComponent
              middleIconName="camera-outline"
              backgroundColor="#026c75"
              height={40}
              onPress={() => takePhoto(setIdImage)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>

      <ComboBox
        comboTitle="Select ID Type"
        comboSubText="Choose your ID type"
        value={idtype}
        onChangeText={setidtype}
        options={[
          { label: "Federal", value: "Federal" },
          { label: "State", value: "State" },
          { label: "Universal", value: "Universal" },
        ]}
        enableSearch
        width="100%"
        errorMessage=""
      />
      <InputBox
        inputTitle="ID Number"
        inputSubText="Enter your ID number"
        value={idnumber}
        onChangeText={setidnumber}
      />
      <ButtonComponent
        buttonText="Continue to next page"
        height={50}
        textFontSize={16}
        rightIconName="arrow-forward"
        onPress={() => setSelectedIndex(3)}
        textAlign="left"
      />
    </View>,

    <View key="screen4">
      <Text style={styles.title}>Review Your Information</Text>
      <Text style={styles.subText}>Please review before submitting.</Text>
      <View style={{ marginBottom: 20 }}>
        <Text>Email: {email}</Text>
        <Text>Phone: {phone}</Text>
        <Text>First Name: {firstName}</Text>
        <Text>Last Name: {lastName}</Text>
        <Text>Gender: {gender}</Text>
        <Text>Birthday: {birthday}</Text>
        <Text>Profile Bio: {bio}</Text>
        <Text>ID Type: {idtype}</Text>
        <Text style={{ marginBottom: 50 }}>ID Number: {idnumber}</Text>
        <Text style={{ marginBottom: 10, alignSelf: "center" }}>
          Your account will be pending until verification.
        </Text>
        <ButtonComponent
          buttonText={uploading ? "Signing up..." : "Sign up"}
          height={50}
          textFontSize={16}
          rightIconName="arrow-forward"
          onPress={handleSignUp}
          textAlign="center"
        />
      </View>
    </View>,
  ];

 const screenNames = ["Login", "Personal Info", "Identification",  "Review & Submit"];

const screenSubText = [
  "Enter your login credentials",
  "Provide your personal and professional details",
  "Upload proof of identification",
  "Review your information and submit",
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
      screenTitle="Personal Account"
      headerSpace="5%"
      showBackButton={true}
      backButtonText="Go Back"
      onBackPress={() => router.back()}
      multiscreen
      screencount={4}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      screenNames={screenNames}
      screenSubText={screenSubText}
      showMultiscreenbuttons
    >
      {screens[selectedIndex]}
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  noteBox: {
    backgroundColor: "#00a9b7",
    padding: 10,
    borderRadius: 5,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 20,
  },
  noteTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noteText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },
  uploadBox: {
    backgroundColor: "#00a9b7",
    padding: 10,
    borderRadius: 5,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  imageBox: {
    backgroundColor: "#fff",
    height: 100,
    width: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageTextBox: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
    gap: 5,
    padding: 5,
  },
  imageTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  imageSubText: {
    color: "#fff",
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
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
