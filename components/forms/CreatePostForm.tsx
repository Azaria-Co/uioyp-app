// components/forms/CreatePostForm.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { getIdUs, getToken } from '../../utils/auth';
import { API_URL } from '../../api/config';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../api/multimedia';
import { AntDesign } from '@expo/vector-icons';

interface CreatePostFormProps {
  area: string;
  id_esp?: number;
  onPostCreated?: () => void;
}


export default function CreatePostForm({ area, id_esp, onPostCreated }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitamos permisos para acceder a tu galería');
      return;
    }

    // Abrir selector de imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

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
      
      // Primero crear el post
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
      
      // Si hay una imagen seleccionada, subirla
      if (selectedImage && data.id) {
        try {
          await uploadImage(selectedImage, data.id);
        } catch (imageError) {
          console.warn('Error uploading image:', imageError);
          // No fallar el post si la imagen no se puede subir
        }
      }
      
      Alert.alert('Éxito', 'Post creado correctamente');
      setTitle('');
      setDescription('');
      setSelectedImage(null);
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
      
      {/* Selector de imagen */}
      <View style={styles.imageSection}>
        <Text style={styles.label}>Imagen (opcional)</Text>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <AntDesign name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <AntDesign name="camera" size={24} color="#003087" />
            <Text style={styles.imagePickerText}>Seleccionar imagen</Text>
          </TouchableOpacity>
        )}
      </View>
      
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
  imageSection: {
    marginBottom: 15,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#003087',
    borderStyle: 'dashed',
    backgroundColor: '#f8f9fa',
    gap: 10,
  },
  imagePickerText: {
    color: '#003087',
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  selectedImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#dc3545',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
