
import { useEffect, useState } from 'react';
import mqtt from '@taoqf/react-native-mqtt';
import { useDispatch } from 'react-redux';
import { setWifiStatus, setRobotStatus, updateSensorData } from '~/src/redux/slices/hardwareSlice';

export const useMQTTClient = () => {
  const dispatch = useDispatch();
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const MQTT_BROKER = 'wss://2c142889200841e4a58e2e4ced8a2569.s1.eu.hivemq.cloud:8884/mqtt';
    const USERNAME = 'sheikh';
    const PASSWORD = 'Password123';

    const options = { username: USERNAME, password: PASSWORD, connectTimeout: 5000, clean: true };
    const mqttClient = mqtt.connect(MQTT_BROKER, options);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT Broker');
      dispatch(setWifiStatus('Connected'));
      mqttClient.subscribe([
        'sensors/ultrasonic/distance',
        'sensors/temperature/value',
        'sensors/humidity/value',
        'robot/status',
      ]);
    });

    mqttClient.on('message', (topic, payload) => {
      const message = payload.toString();
      console.log(`Message received on ${topic}: ${message}`);

      switch (topic) {
        case 'sensors/ultrasonic/distance':
        case 'sensors/temperature/value':
        case 'sensors/humidity/value':
          // Dispatch sensor data update for all sensor-related topics
          dispatch(updateSensorData({ topic, message }));
          break;

        case 'robot/status':
          // Update robot status
          dispatch(setRobotStatus(message === 'connected' ? 'Connected' : 'Disconnected'));
          break;

        default:
          console.log(`Unhandled topic: ${topic}`);
      }
    });

    mqttClient.on('disconnect', () => {
      dispatch(setWifiStatus('Disconnected'));
    });

    setClient(mqttClient);

    // Cleanup function
    return () => {
      mqttClient.end(true);
    };
  }, [dispatch]);

  return { client };
};
