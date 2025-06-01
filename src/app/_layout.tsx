
// _layout.tsx
import 'react-native-get-random-values';  // Required for unique IDs in MQTT
import 'react-native-url-polyfill/auto';  // Required for URL handling

import React from 'react';
import { View } from 'react-native';
import { Provider, } from 'react-redux';
import { persistor, store } from '../redux/store'; // Assuming store is correctly defined
import { Slot } from 'expo-router';
import AuthCheck from './index'; // Importing AuthCheck component
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from 'react-native';


LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method',
]);

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <AuthCheck />  */}
        <View style={{ flex: 1 }}>
          <Slot /> 
        </View>
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
