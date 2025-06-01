




// import { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
// import * as Speech from 'expo-speech';
// import { useVoiceRecognition } from '~/src/hooks/useVoiceRecognition';
// import { useAppDispatch, useAppSelector } from '~/src/redux/store';
// import { fetchMyRobotResponse, setMyRobotUserInput, resetMyRobot } from '~/src/redux/slices/myRobotSlice';
// import { useRouter, useFocusEffect, Stack } from 'expo-router';
// import React from 'react';
// import { logOut } from '~/src/redux/slices/authSlice';

// export default function TalkWithMyRobot() {
//   const [textInput, setTextInput] = useState('');
//   const [isSpeaking, setIsSpeaking] = useState(false);  // New state to track if speaking
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const { responseText, userInputText, loading, error } = useAppSelector((state) => state.myRobot);
//   const { state, startRecognizing, stopRecognizing, resetState } = useVoiceRecognition();

//   const startListening = async () => {
//     await startRecognizing();
//   };

//   const handleSubmit = async () => {
//     // Ensure input is valid before submitting
//     const input = textInput || (state.results[0] ? state.results[0].toLowerCase() : '');
//     console.log('Input:', input); // For debugging purposes
//     if (!input) return;

//     const normalizedInput = input.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();

//     // Check for logout intent
//     if (
//       input.includes("log me out") || input.includes("logout") || input.includes("log out") || input.includes("i want to logout") || input.includes("signout")) {
//       const logoutMessage = "Logging you out...";
//       dispatch(setMyRobotUserInput('')); // Reset user input
//       dispatch(resetMyRobot()); // Reset the slice state

//       Speech.speak(logoutMessage, {
//         onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//         onDone: () => {
//           setIsSpeaking(false); // Set isSpeaking to false when speech ends
//           dispatch(logOut()); // Dispatch the logout action from authSlice ------------(######)
//           stopRecognizing();
//           Speech.stop();
//         },
//       });
//       return;
//     }

//     if (input.includes("i want to talk with my robot") || input.includes("i want to go back to my robot") || input.includes("go back")) {
//       const transitionMessage = "Okay, you are navigating back to your personal robot...";
//       dispatch(setMyRobotUserInput(''));
//       dispatch(resetMyRobot());

//       Speech.speak(transitionMessage, {
//         onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//         onDone: () => {
//           setIsSpeaking(false); // Set isSpeaking to false when speech ends
//           handleStopListening();
//           router.push('/main/myRobot');
//         },
//       });
//       return;
//     }

//     try {
//       setTextInput(''); // Clear the text input after submitting
//       dispatch(setMyRobotUserInput(input)); // Set user input

//       const response = await dispatch(fetchMyRobotResponse(input)).unwrap(); // Fetch response
//       Speech.speak(response, {
//         onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//         onDone: () => {
//           setIsSpeaking(false); // Set isSpeaking to false when speech ends
//           startListening(); // Restart listening after speaking
//         },
//       });

//       stopRecognizing(); // Stop recognition once done
//     } catch (error) {
//       console.error("Error in handleSubmit:", error); // Log any errors
//     }
//   };

//   const handleFetchResponse = async () => {
//     try {
//       const input = textInput || (state.results[0] ? state.results[0].toLowerCase() : '');
//       if (!input) return;

//       const normalizedInput = input.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();

//       await dispatch(fetchMyRobotResponse(input)).unwrap();
//     } catch (error) {
//       console.error("Error in handleFetchResponse:", error);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       const startListeningWithDelay = async () => {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         startListening();
//       };
//       startListeningWithDelay();

//       return () => {
//         resetState();
//         Speech.stop(); 
//         setIsSpeaking(false)
//         dispatch(resetMyRobot());
//       };
//     }, [router]) // this router dependency making it stop after navigating to another screen
//   );

//   useEffect(() => {
//     // Ensure there's a valid result before calling handleSubmit
//     if (state.results && state.results.length > 0) {
//       handleSubmit();
//     }
//   }, [state.results]);

//   const handleStopListening = () => {
//     Speech.stop();
//     stopRecognizing();
//     setIsSpeaking(false);
//   };

//   return (
//     <View style={styles.container}>
      
//       <Text style={styles.title}>GEMINI</Text>
//       <Text style={styles.subtitle}>
//         The TalkWithMyRobot will listen to you and respond automatically.
//       </Text>

//       <Text style={styles.label}>Your message: </Text>

//       <ScrollView
//         style={styles.responseContainer}
//         contentContainerStyle={styles.responseContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.messageText}>
//           <Text style={styles.userText}>You said: </Text>{userInputText}
//         </Text>
//         <Text style={styles.messageText}>
//           <Text style={styles.robotText}>Robot says: </Text>{responseText}
//         </Text>
//       </ScrollView>

//       <TextInput
//         style={styles.input}
//         placeholder="Type your message"
//         value={textInput}
//         onChangeText={setTextInput}
//         onSubmitEditing={handleSubmit}
//       />

//       {isSpeaking && <Text style={styles.speakingText}>Speaking...</Text>}
//       {/* {loading && <ActivityIndicator size="small" color="#4CAF50" />}   */}
//       {loading && <Text style={styles.generatingText}>Generating...</Text>}  
//       {error && <Text style={styles.errorText}>Error: {error}</Text>}

//       <View style={styles.buttonContainer}>
//         <CustomButton title="Stop Listening" onPress={handleStopListening} />
//         <CustomButton title="Start Listening" onPress={startListening} />
//         <CustomButton title="Fetch Response" onPress={handleFetchResponse} />
//       </View>

//     </View>
//   );
// }

// // Define prop types for CustomButton component
// interface CustomButtonProps {
//   title: string;
//   onPress: () => void;
// }

// function CustomButton({ title, onPress }: CustomButtonProps) {
//   return (
//     <TouchableOpacity style={styles.button} onPress={onPress}>
//       <Text style={styles.buttonText}>{title}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   subtitle: {
//     textAlign: "center",
//     color: "#1E90FF",
//     marginVertical: 5,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   label: {
//     marginVertical: 10,
//     fontSize: 17,
//     fontWeight: '500',
//     color: '#666',
//   },
//   responseContainer: {
//     maxHeight: 200,
//     width: '100%',
//     marginBottom: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   responseContent: {
//     paddingHorizontal: 10,
//   },
//   messageText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 5,
//   },
//   userText: {
//     color: '#FF6347',
//   },
//   robotText: {
//     color: '#4CAF50',
//   },
//   input: {
//     width: '100%',
//     height: 45,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginVertical: 10,
//     backgroundColor: '#FFF',
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//     fontWeight: 'bold',
//   },
//   speakingText: {
//     color: '#4CAF50',
//     marginTop: 10,
//     fontWeight: 'bold',
//   },
//   generatingText: {
//     color: '#1E90FF',
//     marginTop: 10,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 20,
//     gap: 10,
//   },
//   button: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 12,
//     borderRadius: 5,//
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });





























// import { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
// import * as Speech from 'expo-speech';
// import { useVoiceRecognition } from '~/src/hooks/useVoiceRecognition';
// import { useAppDispatch, useAppSelector } from '~/src/redux/store';
// import { fetchMyRobotResponse, setMyRobotUserInput, resetMyRobot } from '~/src/redux/slices/myRobotSlice';
// import { useRouter, useFocusEffect, Stack } from 'expo-router';
// import React from 'react';
// import { logOut } from '~/src/redux/slices/authSlice';

// export default function TalkWithMyRobot() {
//   const [textInput, setTextInput] = useState('');
//   const [isSpeaking, setIsSpeaking] = useState(false);  // New state to track if speaking
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const { responseText, userInputText, loading, error } = useAppSelector((state) => state.myRobot);
//   const { state, startRecognizing, stopRecognizing, resetState, } = useVoiceRecognition();

//   const startListening = async () => {
//     await startRecognizing();
//   };

//   const handleSubmit = async () => {
//     // Ensure input is valid before submitting
//     const input = textInput || (state.results[0] ? state.results[0].toLowerCase() : '');
//     console.log('Input:', input); // For debugging purposes
//     if (!input) return;

//     const normalizedInput = input.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();

//     // Check for logout intent
//     if (
//       input.includes("log me out") || input.includes("logout") || input.includes("log out") || input.includes("i want to logout") || input.includes("signout")) {
//       const logoutMessage = "Logging you out...";
//       dispatch(setMyRobotUserInput('')); // Reset user input
//       dispatch(resetMyRobot()); // Reset the slice state

//       Speech.speak(logoutMessage, {
//         onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//         onDone: () => {
//           dispatch(logOut()); // Dispatch the logout action from authSlice ------------(######)
//           handleStopListening();
//           // Speech.stop();
//           // setIsSpeaking(false); // Set isSpeaking to false when speech ends
//           // stopRecognizing();
//         },
//       });
//       return;
//     }

//     if (input.includes("go back")) {
//       const transitionMessage = "Okay, you are navigating back to your personal robot...";
//       dispatch(setMyRobotUserInput(''));
//       dispatch(resetMyRobot());

//       Speech.speak(transitionMessage, {
//         onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//         onDone: () => {
//           // setIsSpeaking(false); // Set isSpeaking to false when speech ends
//           handleStopListening();
//           router.push('/main/myRobot');
//         },
//       });
//       return;
//     }

//     try {
//       setTextInput(''); // Clear the text input after submitting
//       dispatch(setMyRobotUserInput(input)); // Set user input

//       const response = await dispatch(fetchMyRobotResponse(input)).unwrap(); // Fetch response
//       Speech.speak(response, {
//         onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//         onDone: () => {
//           // setIsSpeaking(false); // Set isSpeaking to false when speech ends
//           handleStopListening();
//           startListening(); // Restart listening after speaking
//         },
//       });

//       stopRecognizing(); // Stop recognition once done
//     } catch (error) {
//       console.error("Error in handleSubmit:", error); // Log any errors
//     }
//   };

//   const handleFetchResponse = async () => {
//     try {
//       const input = textInput || (state.results[0] ? state.results[0].toLowerCase() : '');
//       if (!input) return;

//       const normalizedInput = input.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();

//       await dispatch(fetchMyRobotResponse(input)).unwrap();
//     } catch (error) {
//       console.error("Error in handleFetchResponse:", error);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       const startListeningWithDelay = async () => {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         startListening();
//       };
//       startListeningWithDelay();

//       return () => {
//         resetState();
//         Speech.stop(); 
//         setIsSpeaking(false)
//         dispatch(resetMyRobot());
//       };
//     }, [router]) // this router dependency making it stop after navigating to another screen
//   );

//   // useEffect(() => {
//   //   // Ensure there's a valid result before calling handleSubmit
//   //   if (state.results && state.results.length > 0) {
//   //     handleSubmit();
//   //   }
//   // }, [state.results]);

//   useEffect(() => {
//     if (state.results && state.results.length > 0) {
//       handleSubmit();
//     }
//   }, [state.results?.[0]]); // Only calls when the first result changes


//   const handleStopListening = () => {
//     Speech.stop();
//     stopRecognizing();
//     setIsSpeaking(false);
//   };

//   return (
//     <View style={styles.container}>
      
//       <Text style={styles.title}>GEMINI</Text>
//       <Text style={styles.subtitle}>
//         The TalkWithMyRobot will listen to you and respond automatically.
//       </Text>

//       <Text style={styles.label}>Your message: </Text>

//       <ScrollView
//         style={styles.responseContainer}
//         contentContainerStyle={styles.responseContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Text style={styles.messageText}>
//           <Text style={styles.userText}>You said: </Text>{userInputText}
//         </Text>
//         <Text style={styles.messageText}>
//           <Text style={styles.robotText}>Robot says: </Text>{responseText}
//         </Text>
//       </ScrollView>

//       <TextInput
//         style={styles.input}
//         placeholder="Type your message"
//         value={textInput}
//         onChangeText={setTextInput}
//         onSubmitEditing={handleSubmit}
//       />

//       {isSpeaking && <Text style={styles.speakingText}>Speaking...</Text>}
//       {/* {loading && <ActivityIndicator size="small" color="#4CAF50" />}   */}
//       {loading && <Text style={styles.generatingText}>Generating...</Text>}  
//       {error && <Text style={styles.errorText}>Error: {error}</Text>}

//       <View style={styles.buttonContainer}>
//         <CustomButton title="Stop Listening" onPress={handleStopListening} />
//         <CustomButton title="Start Listening" onPress={startListening} />
//         <CustomButton title="Fetch Response" onPress={handleFetchResponse} />
//       </View>

//     </View>
//   );
// }

// // Define prop types for CustomButton component
// interface CustomButtonProps {
//   title: string;
//   onPress: () => void;
// }

// function CustomButton({ title, onPress }: CustomButtonProps) {
//   return (
//     <TouchableOpacity style={styles.button} onPress={onPress}>
//       <Text style={styles.buttonText}>{title}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   subtitle: {
//     textAlign: "center",
//     color: "#1E90FF",
//     marginVertical: 5,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   label: {
//     marginVertical: 10,
//     fontSize: 17,
//     fontWeight: '500',
//     color: '#666',
//   },
//   responseContainer: {
//     maxHeight: 200,
//     width: '100%',
//     marginBottom: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   responseContent: {
//     paddingHorizontal: 10,
//   },
//   messageText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 5,
//   },
//   userText: {
//     color: '#FF6347',
//   },
//   robotText: {
//     color: '#4CAF50',
//   },
//   input: {
//     width: '100%',
//     height: 45,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginVertical: 10,
//     backgroundColor: '#FFF',
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//     fontWeight: 'bold',
//   },
//   speakingText: {
//     color: '#4CAF50',
//     marginTop: 10,
//     fontWeight: 'bold',
//   },
//   generatingText: {
//     color: '#1E90FF',
//     marginTop: 10,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 20,
//     gap: 10,
//   },
//   button: {
//     flex: 1,
//     backgroundColor: '#4CAF50',
//     paddingVertical: 12,
//     borderRadius: 5,//
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });


























// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import axios from 'axios';
// import Slider from '@react-native-community/slider';
// import { debounce } from 'lodash';
// import Toast from 'react-native-toast-message';

// const ESP8266_IP_ADDRESS = '192.168.0.100'; // Replace with your ESP8266 IP

// export default function App() {
//   const [motorSpeed, setMotorSpeed] = useState<number>(100); // Default speed
//   const [servoAngle, setServoAngle] = useState<number>(90); // Default servo angle
//   const [carMoving, setCarMoving] = useState<boolean>(false); // Track if the car is moving
//   const [currentDirection, setCurrentDirection] = useState<string>(''); // Track current direction

//   const sendCommand = async (endpoint: string, params: Record<string, any>) => {
//     try {
//       await axios.get(`http://${ESP8266_IP_ADDRESS}/${endpoint}`, { params });
//     } catch (error: any) {
//       console.error(`Error sending command to ${endpoint}:`, error);
//       Toast.show({
//         type: 'error',
//         position: 'top',
//         text1: 'Error',
//         text2: `Failed to communicate with ESP8266: ${error.message}`,
//       });
//     }
//   };

//   const moveCar = (direction: string) => {
//     // Send the selected direction and speed
//     sendCommand('move', { direction, speed: motorSpeed });
//     setCarMoving(true); // Set car as moving
//     setCurrentDirection(direction); // Track the current direction
//   };

//   const stopCar = () => {
//     // Stop the car
//     sendCommand('move', { direction: 'stop', speed: 0 });
//     setCarMoving(false); // Set car as not moving
//     setCurrentDirection(''); // Reset direction
//   };

//   const controlLight = (state: 'on' | 'off') => sendCommand('light', { state });
//   const controlServo = (angle: number) => sendCommand('servo', { angle });

//   // Handle motor speed and update while car is moving
//   const handleMotorSpeed = debounce((speed: number) => {
//     setMotorSpeed(speed); // Always update speed locally
//     if (carMoving && currentDirection) {
//       sendCommand('move', { direction: currentDirection, speed }); // Update speed with the current direction
//     }
//   }, 0); // Debounce time: 300ms

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>Car Control System</Text>

//       {/* Movement Controls */}
//       <View style={styles.buttonContainer}>
//         {['forward', 'backward', 'left', 'right'].map((direction) => (
//           <TouchableOpacity
//             key={direction}
//             onPressIn={() => moveCar(direction)}  // Start moving on press
//             onPressOut={stopCar}  // Stop the car on release
//             style={styles.button}
//           >
//             <Text style={styles.buttonText}>{`Move ${direction.charAt(0).toUpperCase() + direction.slice(1)}`}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Stop Button */}
//       <TouchableOpacity
//         onPress={stopCar}  // Immediately stop the car when pressed
//         style={[styles.button, { backgroundColor: '#F44336' }]} >
//         <Text style={styles.buttonText}>Stop</Text>
//       </TouchableOpacity>

//       {/* Motor Speed Control */}
//       <Text style={styles.text}>Motor Speed: {motorSpeed}</Text>
//       <Slider
//         style={styles.slider}
//         minimumValue={0}
//         maximumValue={255}
//         value={motorSpeed}
//         step={1}
//         onValueChange={(value) => handleMotorSpeed(value)} // Use debounced handler
//       />

//       {/* Light Control */}
//       <Text style={styles.text}>Control Lights</Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress={() => controlLight('on')}
//           style={styles.button}
//         >
//           <Text style={styles.buttonText}>Turn On Light</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => controlLight('off')}
//           style={[styles.button, { backgroundColor: '#F44336' }]} >
//           <Text style={styles.buttonText}>Turn Off Light</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Servo Control */}
//       <Text style={styles.text}>Servo Angle: {servoAngle}</Text>
//       <Slider
//         style={styles.slider}
//         minimumValue={0}
//         maximumValue={180}
//         value={servoAngle}
//         step={1}
//         onValueChange={(value) => setServoAngle(value)}
//         onSlidingComplete={(value) => controlServo(value)}
//       />

//       {/* Toast container */}
//       <Toast />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   text: {
//     fontSize: 18,
//     marginVertical: 10,
//     color: '#555',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginVertical: 15,
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     margin: 5,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     elevation: 3,
//   },
//   buttonText: {
//     fontSize: 16,
//     color: 'white',
//     textAlign: 'center',
//   },
//   slider: {
//     width: '90%',
//     height: 40,
//   },
// });







// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import mqtt from '@taoqf/react-native-mqtt';
// import { RootState } from '~/src/types/state';
// import * as Network from 'expo-network'; // Import expo-network
// import { setWifiStatus, setRobotStatus, setSensorData, setNetworkState, setIpAddress } from '../../../redux/slices/hardwareSlice'; // Import actions

// const MQTT_BROKER = 'wss://2c142889200841e4a58e2e4ced8a2569.s1.eu.hivemq.cloud:8884/mqtt'; // WebSocket URL
// const USERNAME = 'sheikh';
// const PASSWORD = 'Password123';

// const App = () => {
//   const dispatch = useDispatch();
//   const { wifiStatus, robotStatus, sensorData, networkState, ipAddress } = useSelector(
//     (state: RootState) => state.hardware
//   ); // Access hardware state
//   const [client, setClient] = useState<mqtt.MqttClient | null>(null);
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   // Monitor Network State and IP Address
//   useEffect(() => {
//     const fetchNetworkInfo = async () => {
//       try {
//         const ip = await Network.getIpAddressAsync();
//         // console.log(ip)
//         dispatch(setIpAddress(ip));
    
//         const state = await Network.getNetworkStateAsync();
    
//         // Use fallback values to handle undefined
//         const isConnected = state.isConnected ?? false; // Default to false if undefined
//         const isInternetReachable = state.isInternetReachable ?? false; // Default to false if undefined
//         const type = state.type ?? 'unknown'; // Default to 'unknown' if undefined
//         // console.log(isConnected, isInternetReachable, type)
//         dispatch(setNetworkState({
//           isConnected,
//           isInternetReachable,
//           type,
//         }));
    
//         // Update Wi-Fi status based on the connection state
//         if (isConnected && type === Network.NetworkStateType.WIFI) {
//           dispatch(setWifiStatus('Connected'));
//         } else {
//           dispatch(setWifiStatus('Disconnected'));
//         }
//       } catch (error) {
//         console.error('Error fetching network info:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    

//     fetchNetworkInfo();
//     // Periodically check network info
//     const interval = setInterval(() => {
//       fetchNetworkInfo();
//     }, 5000); // Every 5 seconds

//     return () => clearInterval(interval);
//   }, [dispatch]);

//   // MQTT Connection setup
//   useEffect(() => {
//     const options = {
//       username: USERNAME,
//       password: PASSWORD,
//       connectTimeout: 5000,
//       clean: true,
//     };

//     const mqttClient = mqtt.connect(MQTT_BROKER, options);

//     mqttClient.on('connect', () => {
//       console.log('Connected to MQTT Broker');
//       dispatch(setWifiStatus('Connected'));

//       // Subscribe to topics
//       const topics = [
//         'sensors/ultrasonic/distance',
//         'sensors/temperature/value',
//         'sensors/humidity/value',
//         'robot/status',
//       ];

//       topics.forEach((topic) => {
//         mqttClient.subscribe(topic, (err) => {
//           if (!err) {
//             console.log(`Subscribed to ${topic}`);
//           } else {
//             console.error(`Failed to subscribe to ${topic}:`, err);
//           }
//         });
//       });
//     });

//     mqttClient.on('message', (topic, payload) => {
//       const message = payload.toString();
//       console.log(`Message received on ${topic}: ${message}`);

//       // Update state based on the topic
//       switch (topic) {
//         case 'sensors/ultrasonic/distance':
//           try {
//             const distanceData = JSON.parse(message);
//             dispatch(
//               setSensorData({
//                 ultrasonic: distanceData.distance || 'Invalid Data',
//                 temperature: sensorData.temperature,
//                 humidity: sensorData.humidity,
//               })
//             );
//           } catch (error) {
//             console.error('Failed to parse ultrasonic distance:', error);
//           }
//           break;
//         case 'sensors/temperature/value':
//           dispatch(
//             setSensorData({
//               ultrasonic: sensorData.ultrasonic,
//               temperature: message,
//               humidity: sensorData.humidity,
//             })
//           );
//           break;
//         case 'sensors/humidity/value':
//           dispatch(
//             setSensorData({
//               ultrasonic: sensorData.ultrasonic,
//               temperature: sensorData.temperature,
//               humidity: message,
//             })
//           );
//           break;
//         case 'robot/status':
//           dispatch(setRobotStatus(message === 'connected' ? 'Connected' : 'Disconnected'));
//           break;
//         default:
//           console.log(`Unhandled topic: ${topic}`);
//       }
//     });

//     mqttClient.on('error', (err) => {
//       console.error('Connection error:', err);
//     });

//     mqttClient.on('disconnect', () => {
//       console.log('Disconnected from MQTT Broker');
//       dispatch(setWifiStatus('Disconnected'));
//     });

//     setClient(mqttClient);

//     return () => {
//       if (mqttClient) {
//         mqttClient.end();
//       }
//     };
//   }, [dispatch, sensorData]);

//   const sendMessage = () => {
//     if (client && message.trim()) {
//       client.publish('test/topic', message);
//       setMessage('');
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <Text>Loading network state...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>MQTT Expo App</Text>
//       <TextInput
//         placeholder="Type a message"
//         value={message}
//         onChangeText={setMessage}
//         style={styles.input}
//       />
//       <Button title="Send Message" onPress={sendMessage} />

//       <View style={styles.infoContainer}>
//         <Text style={styles.infoText}>IP Address: {ipAddress}</Text>
//         <Text style={styles.infoText}>Wi-Fi Status: {wifiStatus}</Text>
//         <Text style={styles.infoText}>Robot Status: {robotStatus}</Text>
//         <Text style={styles.infoText}>
//           Internet Reachable: {networkState?.isInternetReachable ? 'Yes' : 'No'}
//         </Text>
//         <Text style={styles.infoText}>
//           Connection Type: {networkState?.type ?? 'Unknown'}
//         </Text>
//         <Text style={styles.infoText}>Ultrasonic Distance: {sensorData.ultrasonic}</Text>
//         <Text style={styles.infoText}>Temperature: {sensorData.temperature}</Text>
//         <Text style={styles.infoText}>Humidity: {sensorData.humidity}</Text>

//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     borderColor: '#000',
//     borderWidth: 1,
//     padding: 10,
//     marginVertical: 10,
//   },
//   infoContainer: {
//     marginTop: 20,
//   },
//   infoText: {
//     fontSize: 16,
//     marginVertical: 5,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default App;











// // App.tsx
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useNetworkInfo } from '~/src/hooks/useNetworkInfo'; 
// import { useMQTTClient } from '~/src/hooks/useMQTTClient'; 
// import { InfoItem } from '~/src/components/InfoItem'; 
// import { RootState } from '~/src/types/state';

// const App = () => {
//   const { wifiStatus, robotStatus, sensorData, networkState, ipAddress } = useSelector(
//     (state: RootState) => state.hardware
//   );

//   const [message, setMessage] = useState('');
//   const { isLoading } = useNetworkInfo();
//   const { client } = useMQTTClient();

//   const sendMessage = () => {
//     if (client && message.trim()) {
//       client.publish('test/topic', message);
//       setMessage('');
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <Text>Loading network state...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>MQTT Expo App</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Type a message"
//         value={message}
//         onChangeText={setMessage}
//       />
//       <Button title="Send Message" onPress={sendMessage} />

//       <View style={styles.infoContainer}>
//         <InfoItem label="IP Address" value={ipAddress} />
//         <InfoItem label="Wi-Fi Status" value={wifiStatus} />
//         <InfoItem label="Robot Status" value={robotStatus} />
//         <InfoItem label="Internet Reachable" value={networkState?.isInternetReachable ? 'Yes' : 'No'} />
//         <InfoItem label="Connection Type" value={networkState?.type ?? 'Unknown'} />
//         <InfoItem label="Ultrasonic Distance" value={sensorData.ultrasonic} />
//         <InfoItem label="Temperature" value={sensorData.temperature} />
//         <InfoItem label="Humidity" value={sensorData.humidity} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20, flex: 1 },
//   header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   input: { borderColor: '#000', borderWidth: 1, padding: 10, marginVertical: 10 },
//   infoContainer: { marginTop: 20 },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

// export default App;










import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useNetworkInfo } from '~/src/hooks/useNetworkInfo';
import { useMQTTClient } from '~/src/hooks/useMQTTClient';
import { InfoItem } from '~/src/components/InfoItem';
import { RootState } from '~/src/types/state';
import { useDispatch } from 'react-redux';

const App = () => {
  const { wifiStatus, robotStatus, sensorData, networkState } = useSelector(
    (state: RootState) => state.hardware
  );
  const {isLoading, refresh} = useNetworkInfo();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { client } = useMQTTClient();
  
    useNetworkInfo();

  const sendMessage = () => {
    if (client && message.trim()) {
      client.publish('test/topic', message, (error) => {
        if (error) {
          console.error('Failed to publish message:', error);
          Alert.alert('Error', 'Failed to send the message. Please try again.');
        } else {
          Alert.alert('Success', 'Message sent successfully!');
          setMessage('');
        }
      });
    } else {
      Alert.alert('Error', 'Client not connected or message is empty.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MQTT Expo App</Text>

      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />

      <View style={styles.infoContainer}>
        <InfoItem label="IP Address" value={networkState.ipAddress || 'Fetching...'} />
        <InfoItem label="Wi-Fi Status" value={wifiStatus || 'Disconnected'} />
        <InfoItem label="Robot Status" value={robotStatus || 'Unknown'} />
        <InfoItem
          label="Internet Reachable"
          value={networkState.isInternetReachable ? 'Yes' : 'No'}
        />
        <InfoItem label="Connection Type" value={networkState.type ?? 'Unknown'} />
        <InfoItem label="Ultrasonic Distance" value={sensorData.ultrasonic || 'N/A'} />
        <InfoItem label="Temperature" value={sensorData.temperature || 'N/A'} />
        <InfoItem label="Humidity" value={sensorData.humidity || 'N/A'} />
        <Button title="Refresh Network Info" onPress={refresh} disabled={isLoading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderColor: '#000', borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  infoContainer: { marginTop: 20 },
});

export default App;
