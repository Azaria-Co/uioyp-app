import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface UserFormProps {
  nombreUs: string;
  setNombreUs: (v: string) => void;
  rol: string;
  setRol: (v: string) => void;
}

export default function UserForm({ nombreUs, setNombreUs, rol, setRol }: UserFormProps) {
  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>Nombre de usuario</Text>
      <TextInput
        style={styles.input}
        value={nombreUs}
        onChangeText={setNombreUs}
        placeholder="Nombre de usuario"
      />
      <Text style={styles.label}>Rol</Text>
      <Picker
        selectedValue={rol}
        style={styles.input}
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
  formSection: { marginBottom: 20 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderColor: '#003087', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10
  },
});
