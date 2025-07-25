import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface RolePickerProps {
  rol: string;
  setRol: (v: string) => void;
}

export default function RolePicker({ rol, setRol }: RolePickerProps) {
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.label}>Rol</Text>
      <Picker
        selectedValue={rol}
        style={styles.picker}
        onValueChange={setRol}
      >
        <Picker.Item label="Selecciona un rol" value="" enabled={false} />
        <Picker.Item label="Administrador" value="1" />
        <Picker.Item label="Especialista" value="2" />
        <Picker.Item label="Paciente" value="3" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  picker: { borderColor: '#003087', borderWidth: 1, borderRadius: 10 },
});
