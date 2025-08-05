//components/forms/BloodTypePicker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface BloodTypePickerProps {
  tipoSangre: string;
  setTipoSangre: (v: string) => void;
}

const bloodTypes = [
  '', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export default function BloodTypePicker({ tipoSangre, setTipoSangre }: BloodTypePickerProps) {
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.label}>Tipo de sangre</Text>
      <Picker
        selectedValue={tipoSangre}
        style={styles.picker}
        onValueChange={setTipoSangre}
      >
        <Picker.Item label="Selecciona tipo de sangre" value="" />
        {bloodTypes.filter(t => t).map(t => (
          <Picker.Item key={t} label={t} value={t} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  picker: { borderColor: '#003087', borderWidth: 1, borderRadius: 10 },
});
