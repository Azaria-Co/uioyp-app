// components/forms/GlucoseInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface GlucoseInputProps {
  glucosa: string;
  setGlucosa: (value: string) => void;
}

export default function GlucoseInput({ glucosa, setGlucosa }: GlucoseInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Glucosa (mg/dL)</Text>
      <TextInput
        style={styles.input}
        value={glucosa}
        onChangeText={setGlucosa}
        placeholder="Ej: 95.5"
        keyboardType="numeric"
        maxLength={6}
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