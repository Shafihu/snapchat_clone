import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../../Firebase/config";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const index = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const showSuccessToast = (message) => {
    Toast.show({
      type: "customSuccessToast",
      text1: message,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/verified");
        showSuccessToast("Success");
      } else {
        router.push("/auth/splash");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#00AFFF" />
      </View>
    );
  }

  return null;
};

export default index;
