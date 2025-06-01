
import { AppState, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { router } from 'expo-router';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useAppDispatch } from '../redux/store';
import { resetMyRobot, setMyRobotUserInput } from '../redux/slices/myRobotSlice';
import { clearAuthData } from '../redux/slices/authSlice';

export const handleLogout = async (dispatch : any) => {
  // Stop any ongoing speech
  Speech.stop();
  dispatch(setMyRobotUserInput('')); // Reset user input
  dispatch(resetMyRobot());          // Reset the slice state
  await AsyncStorage.removeItem('token');  // Remove token from AsyncStorage
  dispatch(clearAuthData());         // Clear Redux state data
  console.log('Logged out successfully (from logoutHeloper)');

  // Navigate to the login screen
  router.replace('/auth/login');
};
