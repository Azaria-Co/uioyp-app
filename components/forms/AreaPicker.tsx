import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface AreaPickerProps {
  area: string;
  setArea: (v: string) => void;
}

const areas = [
  '',
  'Neuropsicologia',
  'Ortesis y Protesis',
  'Medicina General',
  'Nutricion',
  'Fisioterapia',
  'Investigacion',
];

export default function AreaPicker({ area, setArea }: AreaPickerProps) {
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.label}>Área</Text>
      <Picker
        selectedValue={area}
        style={styles.picker}
        onValueChange={setArea}
      >
        <Picker.Item label="Selecciona área" value="" />
        {areas.filter(a => a).map(a => (
          <Picker.Item key={a} label={a} value={a} />
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
