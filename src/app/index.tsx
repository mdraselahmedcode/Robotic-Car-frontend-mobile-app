// index.tsx
import 'react-native-get-random-values';  // Required for unique IDs in MQTT
import 'react-native-url-polyfill/auto';  // Required for URL handling

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, router } from 'expo-router';
import { LogBox } from 'react-native';


LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method',
]);


const AuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Function to check if the token exists
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
          router.replace('/main/myRobot/'); // Navigate to protected route if authenticated
        } else {
          setIsAuthenticated(false);
          router.replace('/auth/login'); // Navigate to login if unauthenticated
        }
      } catch (error) {
        console.error("Error checking token", error);
        setIsAuthenticated(false);
        router.replace('/auth/login');
      }
    };

    // Run checkAuth initially
    checkAuth();
  }, []);

  // Loading state while checking for authentication
  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return null; // This component doesn't render anything when done
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthCheck;
