import React, { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Animated, Button, Image, Pressable, SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons, Foundation } from "react-native-vector-icons";
import Toast from "react-native-toast-message";

import FilterScrollView from "../../components/FilitersScroll";
import TabBar from "../../components/TabBar";
import Chat from "../../components/ChatLists";
import Stories from "../../components/Stories";
import Map from "../../components/Map";
import Spotlight from "../../components/Spotlight";
import TabBarPreview from "../../components/TabBarPreview";
import Header from "../../components/Header";

const HomeScreen = () => {
  const [facing, setFacing] = useState("front");
  const [flash, setFlash] = useState("off");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState();
  const cameraRef = useRef();
  const [camera, setCamera] = useState(true);
  const [maps, setMaps] = useState(false);
  const [chat, setChat] = useState(false);
  const [stories, setStories] = useState(false);
  const [spotlight, setSpotlight] = useState(false);


  const showToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
    });
  };


  const handleCameraPress = () => {
    setCamera(true);
    setStories(false);
    setMaps(false);
    setChat(false);
    setSpotlight(false);
  };

  const handleChatPress = () => {
    setChat(true);
    setStories(false);
    setMaps(false);
    setCamera(false);
    setSpotlight(false);
  };

  const handleChatCam = () => {
    setCamera(true);
    setStories(false);
    setMaps(false);
    setChat(false);
    setSpotlight(false);
  };

  const handleStoriesPress = () => {
    setStories(true);
    setMaps(false);
    setCamera(false);
    setChat(false);
    setSpotlight(false);
  };

  const handleMapsPress = () => {
    setMaps(true);
    setCamera(false);
    setChat(false);
    setStories(false);
    setSpotlight(false);
  };

  const handleSpotlightPress = () => {
    setSpotlight(true);
    setMaps(false);
    setCamera(false);
    setChat(false);
    setStories(false);
  };

  useEffect(() => {
    if (!mediaPermission) {
      requestMediaPermission();
    }
  }, [mediaPermission, requestMediaPermission]);

  if (!cameraPermission || !mediaPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center", color: "white" }}>
          We need your permission to access the camera
        </Text>
        <Button onPress={requestCameraPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleCapture = async () => {
    const options = { quality: 1, base64: true, exif: false };
    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleCameraFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const handleDownload = () => {
    MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
      showToast('Saved!');
    });
  };

  const handleStory = () => {};

  const handleShare = async () => {
    await shareAsync(photo.uri);
    setPhoto(undefined);
  };

  return (
    <>
      <View style={[styles.container, (stories || chat) && styles.whiteBg]}>
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <View style={styles.cameraContainer}>
            {camera && (
              <CameraView
                style={styles.cameraView}
                facing={facing}
                flash={flash}
                autofocus="on"
                zoom={0}
                ref={cameraRef}
              >
                {photo && (
                  <View style={styles.photoContainer}>
                    <Image source={{ uri: photo.uri }} style={styles.fullSizeImage} resizeMode="cover" />
                    <View style={styles.photoControls}>
                      <TouchableOpacity onPress={() => setPhoto(undefined)}>
                        <Ionicons name="close" color="white" size={30} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setPhoto(null)}>
                        {/* Edit buttons go dey here */}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {!photo && (
                  <SafeAreaView style={{ flex: 1, justifyContent: "space-between", marginBottom: photo ? 0 : 80 }}>
                    <View style={{ flex: 1, justifyContent: "space-between" }}>
                      <>
                        <Header
                          header=""
                          toggleCameraFacing={toggleCameraFacing}
                          toggleCameraFlash={toggleCameraFlash}
                        />

                        {/* BOTTOM CAMERA ICONS */}
                        <View style={{}}>
                          <View style={styles.iconRow}>
                            <Pressable style={styles.iconButton}>
                              <Ionicons
                                name="images-outline"
                                size={23}
                                color="white"
                                style={styles.rotate90}
                              />
                            </Pressable>

                            <Pressable style={styles.iconButton}>
                              <Foundation
                                name="magnifying-glass"
                                size={25}
                                color="white"
                                style={styles.flipIcon}
                              />
                            </Pressable>
                          </View>

                          {/* FILTERS */}
                          <FilterScrollView handleCapture={handleCapture} />
                        </View>
                      </>
                    </View>
                  </SafeAreaView>
                )}
              </CameraView>
            )}

            {maps && <Map />}
            {chat && <Chat handleChatCam={handleChatCam} />}
            {stories && <Stories />}
            {spotlight && <Spotlight />}
          </View>
        </SafeAreaView>

        {!photo && (
          <TabBar
            onPressCamera={handleCameraPress}
            onPressChat={handleChatPress}
            onPressStories={handleStoriesPress}
            onPressMaps={handleMapsPress}
            onPressSpotlight={handleSpotlightPress}
          />
        )}

        {photo && (
          <TabBarPreview
            handleDownload={handleDownload}
            handleShare={handleShare}
            handleStory={handleStory}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    position: "relative",
  },
  whiteBg: {
    backgroundColor: "white",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  cameraView: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  fullSizeImage: {
    flex: 1,
  },
  photoControls: {
    position: "absolute",
    top: 20,
    left: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
  },
  iconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 9999,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  rotate90: {
    transform: [{ rotate: "90deg" }],
  },
  flipIcon: {
    transform: [{ scaleX: -1 }],
  },
  savedNotification: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  savedText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;