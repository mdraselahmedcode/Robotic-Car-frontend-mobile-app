
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '~/src/types/state'; // Make sure RootState is imported
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleLogout } from '~/src/utils/logoutHelper';
import { router } from 'expo-router';
import { useVoiceRecognition } from '~/src/hooks/useVoiceRecognition';


// Define types for user data
interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  location: {
    lat: number;
    lon: number;
  };
}

interface AuthResponse {
  user: User;
  token: string;
}

interface SignUpPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  location: {
    lat: number;
    lon: number;
  };
}

interface LogInPayload {
  usernameOrEmail: string;
  password: string;
}

// Thunks for signing up, logging in, and logging out
export const signUp = createAsyncThunk<AuthResponse, SignUpPayload, { rejectValue: string }>(
  'auth/signUp',
  async ({ fullName, username, email, password, location }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v1/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({ fullName, username, email, password, location }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data: AuthResponse = await response.json();
      await AsyncStorage.setItem('token', data.token); // Save token to AsyncStorage
      return data; // Return user and token
    } catch (error) {
      return rejectWithValue('Failed to sign up');
    }
  }
);

export const logIn = createAsyncThunk<AuthResponse, LogInPayload, { rejectValue: string }>(
  'auth/logIn',
  async ({ usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v1/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }

      const data: AuthResponse = await response.json();
      console.log(data);

      await AsyncStorage.setItem('token', data.token); // Save token to AsyncStorage
      return data; // Return user and token
    } catch (error) {
      return rejectWithValue('Failed to log in');
    }
  }
);

// New async thunk for logging out
export const logOut = createAsyncThunk(
  'auth/logOut',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('logout response backend from authSlice: ---------', response)
      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      // On success, clear token and user from Redux and AsyncStorage
      // await AsyncStorage.removeItem('token');  // Remove token from AsyncStorage
      // dispatch(clearAuthData());  // Clear Redux state data
      // router.replace('/auth/login'); // back to log in page
      // Call handleLogout with dispatch to handle clearing data and navigation
      
      console.log('logout pressed from auth slice')
      await handleLogout(dispatch);
      return true;
    } catch (error) {
      return rejectWithValue('Failed to log out'); // Ensure error is a string
    }
  }
);

// Auth Slice Reducer
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null; // Error can only be a string or null
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthData: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        // Ensure action.payload is a string or null
        if (typeof action.payload === 'string') {
          state.error = action.payload;  // If payload is a string, assign it directly
        } else {
          state.error = 'An error occurred during sign up'; // Fallback to a string error message
        }
        state.loading = false;
      })
      .addCase(logIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        console.log('Token stored in auth state from authslice:', state.token); // Log token here
      })
      
      .addCase(logIn.rejected, (state, action) => {
        // Ensure action.payload is a string or null
        if (typeof action.payload === 'string') {
          state.error = action.payload;  // If payload is a string, assign it directly
        } else {
          state.error = 'An error occurred during login'; // Fallback to a string error message
        }
        state.loading = false;
      })
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        // Ensure action.payload is a string or null
        if (typeof action.payload === 'string') {
          state.error = action.payload;  // If payload is a string, assign it directly
        } else {
          state.error = 'An error occurred during logout'; // Fallback to a string error message
        }
        state.loading = false;
      });
  },
});

export const { clearAuthData } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
