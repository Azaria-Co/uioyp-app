// screens/admin/AdminScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import LogoutButton from '../../components/LogoutButton';
import UserForm from '../../components/forms/UserForm';
import SpecialistForm from '../../components/forms/SpecialistForm';
import PatientForm from '../../components/forms/PatientForm';
import RolePicker from '../../components/forms/RolePicker';
import { API_URL } from '../../api/config';

export default function AdminScreen() {
  const [nombreUs, setNombreUs] = useState('');
  const [rol, setRol] = useState('');
  // Especialista
  const [area, setArea] = useState('');
  // Paciente
  const [masaMuscular, setMasaMuscular] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [enferPat, setEnferPat] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNombreUs(''); setRol(''); setArea(''); setMasaMuscular(''); setTipoSangre(''); setEnferPat(''); setTelefono('');
  };

  const handleSubmit = async () => {
    if (!nombreUs.trim() || !rol) {
      Alert.alert('Error', 'Nombre de usuario y rol son obligatorios');
      return;
    }
    if (rol === '2' && !area.trim()) {
      Alert.alert('Error', 'Selecciona el área del especialista');
      return;
    }
    if (rol === '3' && (!masaMuscular.trim() || !tipoSangre.trim() || !enferPat.trim() || !telefono.trim())) {
      Alert.alert('Error', 'Completa los campos de paciente');
      return;
    }
    setLoading(true);
    try {
      const body: any = { nombre_us: nombreUs, rol: Number(rol) };
      if (rol === '2') body.especialista = { estatus: 1, area }; // Estatus siempre 1
      if (rol === '3') body.paciente = { masa_muscular: masaMuscular, tipo_sangre: tipoSangre, enfer_pat: enferPat, telefono };
      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Error al crear usuario');
      Alert.alert('Éxito', 'Usuario creado correctamente');
      resetForm();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>
      <View style={styles.formBox}>
        <UserForm nombreUs={nombreUs} setNombreUs={setNombreUs} rol={rol} setRol={setRol} />
        {/* O usar <RolePicker rol={rol} setRol={setRol} /> */}
        {rol === '2' && (
          <SpecialistForm area={area} setArea={setArea} />
        )}
        {rol === '3' && (
          <PatientForm
            masaMuscular={masaMuscular} setMasaMuscular={setMasaMuscular}
            tipoSangre={tipoSangre} setTipoSangre={setTipoSangre}
            enferPat={enferPat} setEnferPat={setEnferPat}
            telefono={telefono} setTelefono={setTelefono}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear usuario</Text>}
        </TouchableOpacity>
      </View>
      <LogoutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#003087', marginBottom: 20 },
  formBox: { width: '100%', maxWidth: 400, backgroundColor: '#f7f7f7', borderRadius: 12, padding: 20, marginBottom: 30 },
  button: { backgroundColor: '#003087', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
