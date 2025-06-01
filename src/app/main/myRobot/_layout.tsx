import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { handleLogout } from '~/src/utils/logoutHelper'
import * as Speech from 'expo-speech';
import { useVoiceRecognition } from '~/src/hooks/useVoiceRecognition'  // RED ALERT HERE TO IMPORT __________
import { useAppDispatch } from '~/src/redux/store'
import { logOut } from '~/src/redux/slices/authSlice'

const _layout = () => {
// shouldn't use useVoiceRecognition here. the voice cammand will not work if that is import here
  
const dispatch = useAppDispatch();

return (
    <>
      <Stack
        screenOptions={{
          animation: 'slide_from_right', // Smooth slide from right
        }}
      >
        <Stack.Screen 
            name='index' 
            options={{
              title: 'My Robot',
              headerRight: () => (
                <>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 15 }}
                    onPress={() => {
                      router.push('/main/myRobot/gemini');
                    }}
                  />
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 15 }}
                    onPress={() => {
                      dispatch(logOut())
                      router.replace("/auth/login")
                      // console.log('logout pressed')
                    }}
                  />
                </>
              ),
            }} 
          />


        <Stack.Screen
          name="gemini"
          options={{
            title: 'Control',
            headerLeft: () => (
              <Ionicons
                name="arrow-back"           // Arrow icon
                size={24}                    // Icon size
                color="black"                // Customize color
                style={{ marginLeft: 5, marginRight: 6 }}   // Optional: adjust positioning
                onPress={()=> {router.replace('/main/myRobot')}}
              />
            ),
            headerRight: () => (
              <>
                {/* Logout button */}
                <Ionicons
                  name="log-out-outline"  // Icon for logout
                  size={24}               // Customize icon size
                  color="black"           // Customize icon color
                  style={{ marginRight: 15 }} // Optional: adjust icon position
                  onPress={()=>{
                    dispatch(logOut());
                  }}  
                />
              </>
            ),
          }}
        />
      </Stack>
    </>
  )
}

export default _layout

const styles = StyleSheet.create({})





