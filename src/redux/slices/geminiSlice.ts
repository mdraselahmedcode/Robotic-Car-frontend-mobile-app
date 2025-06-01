
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { InteractionState } from '~/src/types/interactionTypes';
// import { RootState } from '~/src/types/state'; // Assuming RootState is available for type-checking

// const initialState: InteractionState = {
//   responseText: '',
//   userInputText: '',
//   loading: false,
//   error: null,
// };

// // Async thunk for API call
// export const fetchGeminiResponse = createAsyncThunk<
//   string,  // Type of the return value
//   string,  // Type of the input value (user input text)
//   { rejectValue: string, state: RootState }  // Typing the state and rejectValue
// >(
//   'gemini/fetchResponse',
//   async (text: string, { rejectWithValue, getState }) => {
//     try {
//       const prompt = text;
//       const apiUrl = `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v1/gemini/chat/generate`;

//       // Retrieve the token from the Redux state (or AsyncStorage if you're storing it elsewhere)
//       const token = getState().auth.token; // Assuming `auth.token` is where the token is stored in Redux state
//       const token_from_async_storage = await AsyncStorage.getItem('token');
      
//       if (!token && !token_from_async_storage) {
//         throw new Error('Token is missing');
//       }
      
//       const tokenToUse = token || token_from_async_storage; // Use the token from Redux state if available, otherwise from AsyncStorage

//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${tokenToUse}`,  // Include Bearer token here
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch response from server');
//       }

//       const data = await response.json();
//       return data.text || 'No response from the server';
//     } catch (error) {
//       console.error('Error fetching response:', error);
//       return rejectWithValue('Error occurred while fetching response');
//     }
//   }
// );

// const geminiSlice = createSlice({
//   name: 'gemini',
//   initialState,
//   reducers: {
//     setUserInput(state, action: PayloadAction<string>) {
//       state.userInputText = action.payload;
//     },
//     reset(state) {
//       return initialState;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchGeminiResponse.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchGeminiResponse.fulfilled, (state, action: PayloadAction<string>) => {
//         state.loading = false;
//         state.responseText = action.payload;
//       })
//       .addCase(fetchGeminiResponse.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { setUserInput: setGeminiUserInput, reset: resetGemini } = geminiSlice.actions;

// export default geminiSlice.reducer;
