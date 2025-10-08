// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { login } from '../api/usuarios';
import { saveToken, saveNombreUs, getIdUsFromToken, saveIdUs } from '../utils/auth';
import { scheduleDailyReminderIfNeeded } from '../utils/notifications';


export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nombreUs, setNombreUs] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(nombreUs);
      // response debe ser { token, rol }
      if (!response || !response.token || typeof response.rol !== 'number') {
        throw new Error('Respuesta inválida del servidor');
      }

      await saveToken(response.token);
      await saveNombreUs(response.nombre_us);
      // Extrae y guarda id_us del token
      const id_us = getIdUsFromToken(response.token);
      if (id_us) {
        await saveIdUs(id_us);
      } else {
        console.warn('No se pudo extraer id_us del token');
      }
      console.log('Token y datos guardados correctamente');

      // Programa recordatorio diario en segundo plano
      scheduleDailyReminderIfNeeded(21, 0).catch(() => {});

      // Redirige según el rol
      if (response.rol === 1) {
        navigation.replace('AdminScreen'); // Admin
      } else if (response.rol === 2) {
        navigation.replace('HomeSpecialist'); // Especialista
      } else if (response.rol === 3) {
        navigation.replace('Blog'); // Paciente
      } else {
        Alert.alert('Error', 'Rol de usuario desconocido');
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={{ width: '80%', height: 180, alignSelf: 'center' }}
        resizeMode="contain"
      />
      <Text style={styles.subTitle}>Inicio de Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={nombreUs}
        onChangeText={setNombreUs}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: 'white' },
  title: { textAlign: 'center', fontSize: 16, color: '#003087', marginTop: 10 },
  subTitle: { textAlign: 'center', fontSize: 18, marginVertical: 20, fontWeight: '600' },
  input: {
    borderColor: '#003087', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 8
  },
  button: {
    backgroundColor: '#003087', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
