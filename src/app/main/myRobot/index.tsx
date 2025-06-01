





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


//       const normalizedInput = input.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();

//       // Check for logout intent
//       if (input.includes("log me out") || input.includes("logout") || input.includes("log out") || input.includes("i want to logout") || input.includes("signout")) {
//         const logoutMessage = "Logging you out...";
//         dispatch(setMyRobotUserInput('')); // Reset user input
//         dispatch(resetMyRobot()); // Reset the slice state

//         Speech.speak(logoutMessage, {
//           onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//           onDone: () => {
//             setIsSpeaking(false); // Set isSpeaking to false when speech ends
//             dispatch(logOut()); // Dispatch the logout action from authSlice ------------(######)
//             stopRecognizing();
//             Speech.stop();
//           },
//         });
//         return;
//       }

//       if (input.includes("i want to talk with gemini")) {
//         const transitionMessage = "Okay, you are navigating to Gemini...";
//         dispatch(setMyRobotUserInput(''));
//         dispatch(resetMyRobot());

//         Speech.speak(transitionMessage, {
//           onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//           onDone: () => {
//               setIsSpeaking(false); // Set isSpeaking to false when speech ends
//               handleStopListening();
//               router.push('/main/myRobot/gemini');
//           },
//         });
//         return;
//       }

  
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
      
//       <Text style={styles.title}>Robo Nikelo</Text>
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
//   const [isVoiceError, setIsVoiceError] = useState<Boolean>(false);
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


//       const normalizedInput = input.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();

//       // Check for logout intent
//       if (input.includes("log me out") || input.includes("logout") || input.includes("log out") || input.includes("i want to logout") || input.includes("signout")) {
//         const logoutMessage = "Logging you out...";
//         dispatch(setMyRobotUserInput('')); // Reset user input
//         dispatch(resetMyRobot()); // Reset the slice state

//         Speech.speak(logoutMessage, {
//           onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//           onDone: () => {
//             dispatch(logOut()); // Dispatch the logout action from authSlice ------------(######)
//             handleStopListening();
//             // Speech.stop();
//             // setIsSpeaking(false); // /Set isSpeaking to false when speech ends
//             // stopRecognizing();
//           },
//         });
//         return;
//       }

//       if (input.includes("i want to talk with gemini")) {
//         const transitionMessage = "Okay, you are navigating to Gemini...";
//         dispatch(setMyRobotUserInput(''));
//         dispatch(resetMyRobot());

//         Speech.speak(transitionMessage, {
//           onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
//           onDone: () => {
//               // setIsSpeaking(false); // Set isSpeaking to false when speech ends
//               handleStopListening();
//               router.push('/main/myRobot/gemini');
//           },
//         });
//         return;
//       }

  
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
//   if (state.results && state.results.length > 0) {
//     handleSubmit();
//   }
// }, [state.results?.[0]]); // Only calls when the first result changes



//   const handleStopListening = () => {
//     Speech.stop();
//     stopRecognizing();
//     setIsSpeaking(false);
//   };

//   return (
//     <View style={styles.container}>
      
//       <Text style={styles.title}>Robo Nikelo</Text>
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
//       {state.error && <Text style={styles.errorText}>Error: {state.error}</Text>}

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























// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableHighlight,
// } from 'react-native';
// import Voice, {
//   SpeechRecognizedEvent,
//   SpeechResultsEvent,
//   SpeechErrorEvent,
// } from '@react-native-voice/voice';
// import { router, useFocusEffect } from 'expo-router';

// const VoiceTest = () => {
//   const [recognized, setRecognized] = useState('');
//   const [pitch, setPitch] = useState('');
//   const [error, setError] = useState('');
//   const [end, setEnd] = useState('');
//   const [started, setStarted] = useState('');
//   const [results, setResults] = useState<string[]>([]);
//   const [partialResults, setPartialResults] = useState<string[]>([]);
//   const [isRecognizing, setIsRecognizing] = useState(false);


//   useEffect(() => {
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechRecognized = onSpeechRecognized;
//     Voice.onSpeechEnd = onSpeechEnd;
//     Voice.onSpeechError = onSpeechError;
//     Voice.onSpeechResults = onSpeechResults;
//     Voice.onSpeechPartialResults = onSpeechPartialResults;
//     Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

//     // Cleanup on component unmount
//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   const onSpeechStart = useCallback(() => {
//     console.log('onSpeechStart');
//     setStarted('√');
//     setIsRecognizing(true);
//   }, []);

//   const onSpeechRecognized = useCallback(() => {
//     console.log('onSpeechRecognized');
//     setRecognized('√');
//   }, []);

//   const onSpeechEnd = useCallback(() => {
//     console.log('onSpeechEnd');
//     setEnd('√');
//     setIsRecognizing(false);
//   }, []);

//   const onSpeechError = useCallback((e: SpeechErrorEvent) => {
//     console.log('onSpeechError: ', e);
//     setError(JSON.stringify(e.error));
//     setIsRecognizing(false);
//   }, []);

//   const onSpeechResults = useCallback((e: SpeechResultsEvent) => {
//     console.log('onSpeechResults: ', e);
//     setResults(e.value || []);
//   }, []);

//   const onSpeechPartialResults = useCallback((e: SpeechResultsEvent) => {
//     console.log('onSpeechPartialResults: ', e);
//     setPartialResults(e.value || []);
//   }, []);

//   const onSpeechVolumeChanged = useCallback((e: any) => {
//     console.log('onSpeechVolumeChanged: ', e);
//     setPitch(e.value);
//   }, []);

//   const startRecognizing = async () => {
//     resetState();
//     try {
//       await Voice.start('en-US');
//       setIsRecognizing(true);
//     } catch (e) {
//       console.error('Error starting recognition:', e);
//     }
//   };

//   const stopRecognizing = async () => {
//     try {
//       await Voice.stop();
//       setIsRecognizing(false);
//     } catch (e) {
//       console.error('Error stopping recognition:', e);
//     }
//   };

//   const cancelRecognizing = async () => {
//     try {
//       await Voice.cancel();
//       setIsRecognizing(false);
//     } catch (e) {
//       console.error('Error canceling recognition:', e);
//     }
//   };

//   const destroyRecognizer = async () => {
//     try {
//       await Voice.destroy();
//       setIsRecognizing(false);
//     } catch (e) {
//       console.error('Error destroying recognizer:', e);
//     }
//     resetState();
//   };

//   const resetState = () => {
//     setRecognized('');
//     setPitch('');
//     setError('');
//     setEnd('');
//     setStarted('');
//     setResults([]);
//     setPartialResults([]);
//     setIsRecognizing(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
//       <Text style={styles.instructions}>
//         Press the button and start speaking.
//       </Text>
//       <Text style={styles.stat}>{`Started: ${started}`}</Text>
//       <Text style={styles.stat}>{`Recognized: ${recognized}`}</Text>
//       <Text style={styles.stat}>{`Pitch: ${pitch}`}</Text>
//       <Text style={styles.stat}>{`Error: ${error}`}</Text>
//       <Text style={styles.stat}>Results</Text>
//       {results.map((result, index) => (
//         <Text key={`result-${index}`} style={styles.stat}>
//           {result}
//         </Text>
//       ))}
//       <Text style={styles.stat}>Partial Results</Text>
//       {partialResults.map((result, index) => (
//         <Text key={`partial-result-${index}`} style={styles.stat}>
//           {result}
//         </Text>
//       ))}
//       <Text style={styles.stat}>{`End: ${end}`}</Text>
//       <Text style={styles.stat}>{`Is Recognizing: ${isRecognizing}`}</Text>
//       <TouchableHighlight onPress={startRecognizing}>
//         <Image style={styles.button} source={require('../../../../assets/icon.png')} />
//       </TouchableHighlight>
//       <TouchableHighlight onPress={stopRecognizing}>
//         <Text style={styles.action}>Stop Recognizing</Text>
//       </TouchableHighlight>
//       <TouchableHighlight onPress={cancelRecognizing}>
//         <Text style={styles.action}>Cancel</Text>
//       </TouchableHighlight>
//       <TouchableHighlight onPress={destroyRecognizer}>
//         <Text style={styles.action}>Destroy</Text>
//       </TouchableHighlight>
//       <TouchableHighlight onPress={() => router.push('/main/myRobot/gemini')}>
//         <Text style={styles.action}>Go to Gemini</Text>
//       </TouchableHighlight>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     width: 50,
//     height: 50,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   action: {
//     textAlign: 'center',
//     color: '#0000FF',
//     marginVertical: 5,
//     fontWeight: 'bold',
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
//   stat: {
//     textAlign: 'center',
//     color: '#B0171F',
//     marginBottom: 1,
//   },
// });

// export default VoiceTest;



















import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import { useVoiceRecognition } from '~/src/hooks/useVoiceRecognition';
import { useAppDispatch, useAppSelector } from '~/src/redux/store';
import { fetchMyRobotResponse, setMyRobotUserInput, resetMyRobot } from '~/src/redux/slices/myRobotSlice';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import React from 'react';
import { logOut } from '~/src/redux/slices/authSlice';

export default function TalkWithMyRobot() {
  const [textInput, setTextInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);  // New state to track if speaking
  const [isVoiceError, setIsVoiceError] = useState<string>('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { responseText, userInputText, loading, error } = useAppSelector((state) => state.myRobot);
  const { state, startRecognizing, stopRecognizing, destroyRecognizer, resetState } = useVoiceRecognition();

  const startListening = async () => {
    resetState()
    setIsVoiceError(""); // Clear any existing error when starting a new command
    dispatch(resetMyRobot());
    await startRecognizing();
  };

  const handleSubmit = useCallback(async () => {
    
    // Ensure input is valid before submitting
    const input = textInput || (state.results[0] ? state.results[0].toLowerCase() : '');
    console.log('Input:', input); // For debugging purposes
    if (!input) return;


      const normalizedInput = input.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();

      // Check for logout intent
      if (input.includes("log me out") || input.includes("logout") || input.includes("log out") || input.includes("i want to logout") || input.includes("signout")) {
        const logoutMessage = "Logging you out...";
        dispatch(setMyRobotUserInput('')); // Reset user input
        dispatch(resetMyRobot()); // Reset the slice state

        Speech.speak(logoutMessage, {
          onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
          onDone: () => {
            setIsSpeaking(false); // Set isSpeaking to false when speech ends
            dispatch(logOut()); // Dispatch the logout action from authSlice ------------(######)
            stopRecognizing();
            Speech.stop();
          },
        });
        return;
      }

      if (input.includes("i want to talk with gemini")) {
        const transitionMessage = "Okay, you are navigating to Gemini...";
        dispatch(setMyRobotUserInput(''));
        dispatch(resetMyRobot());

        Speech.speak(transitionMessage, {
          onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
          onDone: () => {
              
              setIsSpeaking(false); // Set isSpeaking to false when speech ends
              handleStopListening();
              router.push('/main/myRobot/gemini');
          },
        });
        return;
      }

  
    try {
      setTextInput(''); // Clear the text input after submitting
      dispatch(setMyRobotUserInput(input)); // Set user input
  
      const response = await dispatch(fetchMyRobotResponse(input)).unwrap(); // Fetch response
      Speech.speak(response, {
        onStart: () => setIsSpeaking(true), // Set isSpeaking to true when speech starts
        onDone: () => {
          setIsSpeaking(false); // Set isSpeaking to false when speech ends
          startListening(); // Restart listening after speaking
        },
      });
  
      stopRecognizing(); // Stop recognition once done
    } catch (error) {
      console.error("Error in handleSubmit:", error); // Log any errors
    }
  },[textInput, state.results, dispatch]);
  

  const handleFetchResponse = async () => {
    try {
      const input = textInput || (state.results[0] ? state.results[0].toLowerCase() : '');
      if (!input) return;

      const normalizedInput = input.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();

      await dispatch(fetchMyRobotResponse(input)).unwrap();
    } catch (error) {
      console.error("Error in handleFetchResponse:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const startListeningWithDelay = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        startListening();
      };
      startListeningWithDelay();

      return () => {
        
        resetState();
        destroyRecognizer();
        Speech.stop();
        setIsVoiceError(""); // Reset isVoiceError on cleanup
        dispatch(resetMyRobot());
      };
    }, [router]) // this router dependency making it stop after navigating to another screen
  );

  useEffect(() => {
    // Ensure there's a valid result before calling handleSubmit
    if (state.results && state.results.length > 0) {
      handleSubmit();
    }
  }, [state.results, handleSubmit]);


  // UseEffect to track state.error
  useEffect(() => {
    if(state.error){
      // Update isVoiceError with the current error
      setIsVoiceError(state.error);
    }else{
      // Clear isVoiceError if no error
      setIsVoiceError("");
    }
    console.log(isVoiceError)
  },[state.error]);

  const handleStopListening = () => {
    Speech.stop();
    stopRecognizing();
    setIsSpeaking(false);
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Robo Nikelo</Text>
      <Text style={styles.subtitle}>
        The TalkWithMyRobot will listen to you and respond automatically.
      </Text>

      <Text style={styles.label}>Your message: </Text>

      <ScrollView
        style={styles.responseContainer}
        contentContainerStyle={styles.responseContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.messageText}>
          <Text style={styles.userText}>You said: </Text>{userInputText}
        </Text>
        <Text style={styles.messageText}>
          <Text style={styles.robotText}>Robot says: </Text>{responseText}
        </Text>
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Type your message"
        value={textInput}
        onChangeText={setTextInput}
        onSubmitEditing={handleSubmit}
      />

      {isSpeaking && <Text style={styles.speakingText}>Speaking...</Text>}
      {/* {loading && <ActivityIndicator size="small" color="#4CAF50" />}   */}
      {loading && <Text style={styles.generatingText}>Generating...</Text>}  
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {(state.error && !isSpeaking) && <Text style={styles.errorText}>Error: {isVoiceError}</Text>}

      <View style={styles.buttonContainer}>
        <CustomButton title="Stop Listening" onPress={handleStopListening} />
        <CustomButton title="Start Listening" onPress={startListening} />
        <CustomButton title="Fetch Response" onPress={handleFetchResponse} />
      </View>
    </View>
  );
}

// Define prop types for CustomButton component
interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

function CustomButton({ title, onPress }: CustomButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    textAlign: "center",
    color: "#1E90FF",
    marginVertical: 5,
    fontWeight: '600',
    fontSize: 16,
  },
  label: {
    marginVertical: 10,
    fontSize: 17,
    fontWeight: '500',
    color: '#666',
  },
  responseContainer: {
    maxHeight: 200,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  responseContent: {
    paddingHorizontal: 10,
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  userText: {
    color: '#FF6347',
  },
  robotText: {
    color: '#4CAF50',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold',
  },
  speakingText: {
    color: '#4CAF50',
    marginTop: 10,
    fontWeight: 'bold',
  },
  generatingText: {
    color: '#1E90FF',
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,//
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

