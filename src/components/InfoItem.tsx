// components/InfoItem.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface InfoItemProps {
  label: string;
  value: string | number;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <Text style={styles.infoText}>
    {label}: {value}
  </Text>
);

const styles = StyleSheet.create({
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
