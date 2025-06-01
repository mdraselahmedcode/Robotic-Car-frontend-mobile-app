
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InteractionState } from '~/src/types/interactionTypes';
import { RootState } from '~/src/types/state';

const initialState: InteractionState = {
  responseText: '',
  userInputText: '',
  loading: false,
  error: null,
};

// Async thunk for API call
export const fetchMyRobotResponse = createAsyncThunk<
  string,  // Type of the return value
  string,  // Type of the input value (user input text)
  { rejectValue: string, state: RootState }  // Typing the state and rejectValue
>(
  'myRobot/fetchResponse',
  async (text: string, { rejectWithValue, getState }) => {
    try {
      const prompt = text;
      const apiUrl = `${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v1/myRobot/chat/generate`;

      // Retrieve the token from the Redux state (or AsyncStorage if you're storing it elsewhere)
      const token = getState().auth.token; // Now `getState` is typed with RootState
      const token_from_async_storage = await AsyncStorage.getItem('token');
      // console.log('token from getState: (from myRobotSlice) ', token)
      // console.log('token from asyncStorage: (from myRobotSlice) ', token_from_async_storage)
      if (!token) {
        throw new Error('Token is missing');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include Bearer token here
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from server');
      }

      const data = await response.json();
      return data.text || 'No response from the server';
    } catch (error) {
      console.error('Error fetching response:', error);
      return rejectWithValue('Error occurred while fetching response');
    }
  }
);

const myRobotSlice = createSlice({
  name: 'myRobot',
  initialState,
  reducers: {
    setUserInput(state, action: PayloadAction<string>) {
      state.userInputText = action.payload;
    },
    reset(state) {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRobotResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRobotResponse.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.responseText = action.payload;
      })
      .addCase(fetchMyRobotResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserInput: setMyRobotUserInput, reset: resetMyRobot } = myRobotSlice.actions;

export default myRobotSlice.reducer;
