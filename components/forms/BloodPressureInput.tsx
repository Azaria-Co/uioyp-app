// components/forms/BloodPressureInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface BloodPressureInputProps {
  presionAr: string;
  setPresionAr: (value: string) => void;
}

export default function BloodPressureInput({ presionAr, setPresionAr }: BloodPressureInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Presión Arterial</Text>
      <TextInput
        style={styles.input}
        value={presionAr}
        onChangeText={setPresionAr}
        placeholder="Ej: 120 80"
        keyboardType="numeric"
        maxLength={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderColor: '#003087',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
});