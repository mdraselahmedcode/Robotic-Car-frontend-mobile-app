
// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import Voice from '@react-native-voice/voice';
// import * as Speech from 'expo-speech';
// import { fetchResponse } from '../utils/fetchMyRobotandGeminiResponse';

// const SpeechText = () => {
//   const [started, setStarted] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [waiting, setWaiting] = useState(false); // New waiting state
//   const [result, setResult] = useState('');
//   const [responseText, setResponseText] = useState('');
//   const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     Voice.onSpeechStart = onSpeechStart;
//     Voice.onSpeechEnd = onSpeechEnd;
//     Voice.onSpeechResults = onSpeechResults;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//       stopInterval();
//     };
//   }, []);

//   const onSpeechStart = () => {
//     setStarted(true);
//     setProcessing(false);
//     setWaiting(false); // Stop waiting if speech starts
//   };

//   const onSpeechEnd = () => {
//     setStarted(false);
//     setProcessing(true);
//   };

//   const onSpeechResults = async (e: any) => {
//     const latestResult = e.value[0];
//     setResult(latestResult);
//     setProcessing(false);

//     // Handle the voice input as soon as it is recognized
//     await handleSubmit(latestResult);
//   };

//   const startRecognizing = useCallback(async () => {
//     try {
//       setWaiting(false); // Reset waiting state when starting recognition
//       await Voice.start('en-US');
//       setStarted(true);
//     } catch (error) {
//       console.log('Error starting recognition:', error);
//     }
//   }, []);

//   const stopRecognizing = useCallback(async () => {
//     try {
//       await Voice.stop();
//       setStarted(false);
//     } catch (error) {
//       console.log('Error stopping recognition:', error);
//     }
//   }, []);

//   const stopInterval = () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//     }
//     setWaiting(false); // Stop waiting if interval is cleared
//   };

//   const handleStartRecording = () => {
//     startRecognizing();
//     const id = setInterval(() => {
//       if (!started && !waiting) { // Only restart if not already waiting or started
//         setWaiting(true);         // Set waiting before restarting
//         setTimeout(() => {        // Small delay to show waiting status before restarting
//           startRecognizing();
//           setWaiting(false);      // Clear waiting when recognition restarts
//         }, 5000); // Adjust delay if needed to better show "Waiting..."
//       }
//     }, 5000);
//     setIntervalId(id);
//   };
  
//   const handleStopRecording = () => {
//     stopInterval();
//     stopRecognizing();
//     Speech.stop();
//     setResult('');
//   };

//   // Function to handle recognized voice input and fetch API response
//   const handleSubmit = async (voiceInput: string) => {
//     if (!voiceInput) return;

//     try {
//       const apiResponse = await fetchResponse(voiceInput);
//       setResponseText(apiResponse);

//       // Speak the response, and resume listening after speaking
//       Speech.speak(apiResponse, {
//         onDone: () => {
//           startRecognizing();  // Start listening after speaking is done
//         },
//       });

//       // Stop recognition temporarily while speaking
//       stopRecognizing();
//     } catch (error) {
//       console.error("Error in handleSubmit:", error);
//     }
//   };

//   return (
//     <View
//       style={[
//         styles.container,
//         started ? styles.listeningBackground : processing ? styles.processingBackground : styles.idleBackground,
//       ]}
//     >



//       <Text style={styles.resultsText}>{result}</Text>
//       <ScrollView
//         style={styles.responseContainer}
//         contentContainerStyle={styles.responseContent}
//         keyboardShouldPersistTaps="handled"
//         >
//         <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
//           {responseText}
//         </Text>
//       </ScrollView>
//         {/* Display loading spinner when waiting */}
//         {waiting && <ActivityIndicator size="large" color="#FF4500" />}
//       <Text style={styles.statusText}>
//         {waiting ? 'Waiting...' : started ? 'Listening...' : processing ? 'Processing...' : 'Idle'}
//       </Text>
//       <Button title="Start Recording" onPress={handleStartRecording} />
//       <Button title="Stop Recording" onPress={handleStopRecording} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   listeningBackground: {
//     backgroundColor: '#DFF0D8',
//   },
//   processingBackground: {
//     backgroundColor: '#FCF8E3',
//   },
//   idleBackground: {
//     backgroundColor: '#F5F5F5',
//   },
//   statusText: {
//     fontSize: 20,
//     color: 'black',
//     marginVertical: 10,
//   },
//   resultsText: {
//     fontSize: 16,
//     color: 'black',
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   responseText: {
//     fontSize: 16,
//     color: 'blue',
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   responseContainer: {
//     maxHeight: 200,
//     width: '100%',
//     marginBottom: 20,
//   },
//   responseContent: {
//     paddingHorizontal: 10,
//   },
// });

// export default SpeechText;















