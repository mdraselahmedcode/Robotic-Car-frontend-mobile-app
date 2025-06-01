




// import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from '@react-native-async-storage/async-storage';
// import { Action, combineReducers } from 'redux';
// import authReducer from './slices/authSlice';
// import myRobotReducer from './slices/myRobotSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../types/state';

// const persistConfig = {
//   key: 'root',
//   storage,
//   blacklist: ['register'], // Prevent 'register' from being persisted
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   myRobot: myRobotReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'],
//         ignoredPaths: ['register'],
//       },
//     }),
// });

// export const persistor = persistStore(store);

// export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected): TSelected =>
//   useSelector(selector);












import { configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import { Action, combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import myRobotReducer from './slices/myRobotSlice';
import hardwareReducer from './slices/hardwareSlice';  // Import the new hardwareSlice
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types/state';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['register'], // Prevent 'register' from being persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  myRobot: myRobotReducer,
  hardware: hardwareReducer, // Add hardwareReducer here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['register'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected): TSelected =>
  useSelector(selector);
