

import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchUserData = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
  
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };
  