// screens/especialistas/HomeSpecialist.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LogoutButton from '../../components/LogoutButton';

export default function HomeSpecialist() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido Especialista</Text>
      {/* Aquí va el contenido para especialistas */}
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003087' },
});
