// screens/admin/AdminScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LogoutButton from '../../components/LogoutButton';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>
      {/* Aquí va el contenido para administradores */}
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003087' },
});
