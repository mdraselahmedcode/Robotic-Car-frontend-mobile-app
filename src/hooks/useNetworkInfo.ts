
import { useEffect, useState, useCallback } from 'react';
import * as Network from 'expo-network';
import { useDispatch } from 'react-redux';
import { setWifiStatus, setNetworkState } from '~/src/redux/slices/hardwareSlice';

export const useNetworkInfo = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const fetchNetworkInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const ip = await Network.getIpAddressAsync();
      const state = await Network.getNetworkStateAsync();
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable ?? false;
      const type = state.type ?? 'unknown';

      dispatch(setNetworkState({
        type,
        ipAddress: ip,
        isConnected,
        isInternetReachable,
      }));

      dispatch(setWifiStatus(isConnected && type === 'WIFI' ? 'Connected' : 'Disconnected'));
    } catch (error) {
      console.error('Error fetching network info:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNetworkInfo();
  }, [fetchNetworkInfo]);

  return { isLoading, refresh: fetchNetworkInfo };
};
