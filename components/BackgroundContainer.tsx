import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  ScrollView,
  DimensionValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface BackgroundContainerProps {
  headerSpace?: DimensionValue;
  imageSource?: any;
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackPress?: () => void;
  multiscreen?: boolean;
  screencount?: number;
  selectedIndex?: number;
  setSelectedIndex?: (index: number) => void;
  screenNames?: (string | undefined)[];
  screenSubText?: (string | undefined)[];
  showMultiscreenbuttons?: boolean;
  screenTitle?: string;
  screenSubTitle?: string;
  lockScroll?: boolean;
  onFocus?: () => void; // Retained onFocus prop
}

export function BackgroundContainer({
  headerSpace = "30%",
  imageSource = require("../assets/images/Background-1.png"),
  children,
  showBackButton = false,
  backButtonText = "Go Back",
  onBackPress,
  multiscreen = false,
  screencount = 1,
  selectedIndex: externalSelectedIndex,
  setSelectedIndex,
  screenNames = [],
  screenSubText = [],
  showMultiscreenbuttons = false,
  screenTitle,
  screenSubTitle,
  lockScroll = false,
  onFocus, // Destructured onFocus prop
}: BackgroundContainerProps) {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  const selectedIndex = externalSelectedIndex !== undefined ? externalSelectedIndex : internalSelectedIndex;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSetSelectedIndex = (index: number) => {
    if (setSelectedIndex) {
      setSelectedIndex(index);
    } else {
      setInternalSelectedIndex(index);
    }
    // Ensure the ScrollView stays at the top when switching screens
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  };

  const renderScreenTitle = () => {
    if (!screenTitle) return null;
    return <Text style={styles.screenTitle}>{screenTitle}</Text>;
  };

  const renderScreenSubTitle = () => {
    if (!screenSubTitle) return null;
    return <Text style={styles.screenSubTitle}>{screenSubTitle}</Text>;
  };

  const renderDots = () => {
    if (!multiscreen || screencount <= 1) return null;
    return (
      <View style={styles.dotContainer}>
        {showMultiscreenbuttons && (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() =>
              handleSetSelectedIndex(Math.max(selectedIndex - 1, 0))
            }
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
        )}
        {Array.from({ length: screencount }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === selectedIndex ? "#fff" : "#026c75" },
            ]}
            onPress={() => handleSetSelectedIndex(index)}
          />
        ))}
        {showMultiscreenbuttons && (
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() =>
              handleSetSelectedIndex(Math.min(selectedIndex + 1, screencount - 1))
            }
          >
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderScreenName = () => {
    if (!multiscreen || !screenNames?.[selectedIndex]) return null;
    return <Text style={styles.screenName}>{screenNames[selectedIndex]}</Text>;
  };

  const renderScreenSubText = () => {
    if (!multiscreen || !screenSubText?.[selectedIndex]) return null;
    return (
      <Text style={styles.screenSubText}>{screenSubText[selectedIndex]}</Text>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imageSource}
        style={styles.background}
        resizeMode="cover"
      >
        {showBackButton && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="#fff"
              style={styles.backArrow}
            />
            <Text style={styles.backText}>{backButtonText}</Text>
          </TouchableOpacity>
        )}
       <LinearGradient
        colors={['#ddddddff','#0bbcccff', '#3aeafaff']} 
        style={styles.screenTitlebox}
        start={{ x: 0, y: 0 }} // 
        end={{ x: 1, y: 1 }}>
        {renderScreenTitle()}
        
        </LinearGradient>
        {renderScreenSubTitle()}
        
        {renderScreenName()}
        {renderScreenSubText()}
        {renderDots()}
        <View style={[styles.containerMainContent, { marginTop: headerSpace }]}>
          <ScrollView
            ref={scrollViewRef}
            scrollEnabled={!lockScroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 0,
            }}
         
          >
            <View style={styles.containerSecondContent}>{children}</View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  containerMainContent: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  containerSecondContent: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingBottom: 250,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  backArrow: {
    marginRight: 5,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,

    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  screenName: {
    marginTop: 10,
    textAlign: "center",
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  screenSubText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 20,
  },
  screenTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 20,

  },
  screenTitlebox: {
   backgroundColor:"#a3adadff",
   marginHorizontal:80,
   borderRadius:50,
    paddingVertical: 10,
  },
  screenSubTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 10,
  },
});