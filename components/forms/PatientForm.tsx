import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import BloodTypePicker from './BloodTypePicker';

interface PatientFormProps {
  masaMuscular: string;
  setMasaMuscular: (v: string) => void;
  tipoSangre: string;
  setTipoSangre: (v: string) => void;
  enferPat: string;
  setEnferPat: (v: string) => void;
  telefono: string;
  setTelefono: (v: string) => void;
}

export default function PatientForm({ masaMuscular, setMasaMuscular, tipoSangre, setTipoSangre, enferPat, setEnferPat, telefono, setTelefono }: PatientFormProps) {
  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>Masa muscular</Text>
      <TextInput
        style={styles.input}
        value={masaMuscular}
        onChangeText={setMasaMuscular}
        placeholder="Masa muscular"
        keyboardType="numeric"
      />
      <BloodTypePicker tipoSangre={tipoSangre} setTipoSangre={setTipoSangre} />
      <Text style={styles.label}>Enfermedades</Text>
      <TextInput
        style={styles.input}
        value={enferPat}
        onChangeText={setEnferPat}
        placeholder="Enfermedades"
      />
      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Teléfono"
        keyboardType="phone-pad"
      />
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
