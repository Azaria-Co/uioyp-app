// components/forms/CreatePostForm.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getIdUs, getToken } from '../../utils/auth';
import { API_URL } from '../../api/config';

interface CreatePostFormProps {
  area: string;
  id_esp?: number;
  onPostCreated?: () => void;
}


export default function CreatePostForm({ area, id_esp, onPostCreated }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Título y descripción son obligatorios');
      return;
    }
    if (!area) {
      Alert.alert('Error', 'No se detectó el área del especialista');
      return;
    }
    if (!id_esp) {
      Alert.alert('Error', 'No se detectó el id_esp del especialista');
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No autenticado');
      const body = {
        titulo: title,
        texto: description,
        id_esp: id_esp,
      };
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Error al crear post');
      Alert.alert('Éxito', 'Post creado correctamente');
      setTitle('');
      setDescription('');
      if (onPostCreated) onPostCreated();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formBox}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título del post"
      />
      <Text style={styles.label}>Área</Text>
      <Text style={[styles.input, { backgroundColor: '#eee', color: '#003087' }]}>{area}</Text>
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Publicar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formBox: { width: '100%', maxWidth: 400, backgroundColor: '#f7f7f7', borderRadius: 12, padding: 20, marginBottom: 30 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderColor: '#003087', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#fff',
  },
  button: { backgroundColor: '#003087', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
