

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SensorData {
  ultrasonic: string;
  temperature: string;
  humidity: string;
}

export interface NetworkState {
  isInternetReachable: boolean;
  isConnected: boolean;
  type: string; // E.g., 'wifi', 'cellular'
  ipAddress: any; // IP address can be string or null
}

export interface HardwareState {
  wifiStatus: string;
  robotStatus: string;
  sensorData: SensorData;
  networkState: NetworkState; // Add NetworkState to HardwareState
}

const initialState: HardwareState = {
  wifiStatus: 'Disconnected',
  robotStatus: 'Disconnected',
  sensorData: {
    ultrasonic: '',
    temperature: '',
    humidity: '',
  },
  networkState: {
    isConnected: false,
    isInternetReachable: false,
    type: 'Unknown',
    ipAddress: 'N/A',
  },
};

const hardwareSlice = createSlice({
  name: 'hardware',
  initialState,
  reducers: {
    setWifiStatus(state, action: PayloadAction<string>) {
      state.wifiStatus = action.payload;
    },
    setRobotStatus(state, action: PayloadAction<string>) {
      state.robotStatus = action.payload;
    },
    updateSensorData(state, action: PayloadAction<{ topic: string; message: string }>) {
      const { topic, message } = action.payload;

      try {
        switch (topic) {
          case 'sensors/ultrasonic/distance': {
            const distanceData = JSON.parse(message); // Assuming JSON payload
            state.sensorData.ultrasonic = distanceData.distance || 'Invalid Data';
            break;
          }
          case 'sensors/temperature/value':
            state.sensorData.temperature = message;
            break;
          case 'sensors/humidity/value':
            state.sensorData.humidity = message;
            break;
          default:
            console.warn(`Unhandled topic: ${topic}`);
        }
      } catch (error) {
        console.error(`Error parsing MQTT message for topic ${topic}:`, error);
      }
    },
    setNetworkState(state, action: PayloadAction<NetworkState>) {
      state.networkState = action.payload;
    },
  },
});

export const { setWifiStatus, setRobotStatus, updateSensorData, setNetworkState } =
  hardwareSlice.actions;
export default hardwareSlice.reducer;
