import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AreaPicker from './AreaPicker';

interface SpecialistFormProps {
  estatus: string;
  setEstatus: (v: string) => void;
  area: string;
  setArea: (v: string) => void;
}

export default function SpecialistForm({ estatus, setEstatus, area, setArea }: SpecialistFormProps) {
  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>Estatus</Text>
      <TextInput
        style={styles.input}
        value={estatus}
        onChangeText={setEstatus}
        placeholder="Estatus"
      />
      <AreaPicker area={area} setArea={setArea} />
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderColor: '#003087', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10
  },
});
