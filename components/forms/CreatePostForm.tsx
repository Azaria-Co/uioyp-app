// components/forms/CreatePostForm.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { getIdUs, getToken } from '../../utils/auth';
import { API_URL } from '../../api/config';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile, createAdvancedMultimedia } from '../../api/multimedia';
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
  const [tipoPost, setTipoPost] = useState<string>('normal'); // 'normal' | 'investigacion'
  
  // Estados para multimedia
  const [multimediaType, setMultimediaType] = useState<string>(''); // '', 'image', 'video', 'link'
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDescription, setLinkDescription] = useState('');

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

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const clearMultimedia = () => {
    setMultimediaType('');
    setSelectedImage(null);
    setVideoUrl('');
    setLinkUrl('');
    setLinkTitle('');
    setLinkDescription('');
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
        tipo: tipoPost,
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
      
      // Manejar multimedia según el tipo
      if (multimediaType && data.id) {
        try {
          if (multimediaType === 'image' && selectedImage) {
            await uploadFile(selectedImage, data.id);
          } else if (multimediaType === 'video' && videoUrl) {
            await createAdvancedMultimedia({
              tipo: 'video',
              id_post: data.id,
              url: videoUrl,
              titulo: title, // Usar el título del post como título del video
            });
          } else if (multimediaType === 'link' && linkUrl) {
            await createAdvancedMultimedia({
              tipo: 'link',
              id_post: data.id,
              url: linkUrl,
              titulo: linkTitle || title,
              descripcion: linkDescription,
            });
          }
        } catch (multimediaError) {
          console.warn('Error uploading multimedia:', multimediaError);
          // No fallar el post si el multimedia no se puede subir
        }
      }
      
      Alert.alert('Éxito', 'Post creado correctamente');
      setTitle('');
      setDescription('');
      setTipoPost('normal');
      clearMultimedia(); // Limpiar todo el multimedia
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
      
      {/* Selector de tipo de post - solo para investigadores */}
      {area === 'Investigacion' && (
        <>
          <Text style={styles.label}>Tipo de publicación</Text>
          <View style={styles.tipoSelector}>
            <TouchableOpacity 
              style={[styles.tipoButton, tipoPost === 'normal' && styles.tipoButtonActive]}
              onPress={() => setTipoPost('normal')}
            >
              <Text style={[styles.tipoButtonText, tipoPost === 'normal' && styles.tipoButtonTextActive]}>
                Post Normal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tipoButton, tipoPost === 'investigacion' && styles.tipoButtonActive]}
              onPress={() => setTipoPost('investigacion')}
            >
              <Text style={[styles.tipoButtonText, tipoPost === 'investigacion' && styles.tipoButtonTextActive]}>
                Investigación
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción"
        multiline
      />
      
      {/* Selector de multimedia */}
      <View style={styles.multimediaSection}>
        <Text style={styles.label}>Multimedia (opcional)</Text>
        
        {/* Opciones de tipo de multimedia */}
        {!multimediaType && (
          <View style={styles.multimediaOptions}>
            <TouchableOpacity 
              style={styles.multimediaOption} 
              onPress={() => setMultimediaType('image')}
            >
              <AntDesign name="camera" size={24} color="#003087" />
              <Text style={styles.multimediaOptionText}>Imagen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.multimediaOption} 
              onPress={() => setMultimediaType('video')}
            >
              <AntDesign name="youtube" size={24} color="#ff0000" />
              <Text style={styles.multimediaOptionText}>Video YouTube</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.multimediaOption} 
              onPress={() => setMultimediaType('link')}
            >
              <AntDesign name="link" size={24} color="#007bff" />
              <Text style={styles.multimediaOptionText}>Enlace</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sección de imagen */}
        {multimediaType === 'image' && (
          <View style={styles.mediaContent}>
            <View style={styles.mediaHeader}>
              <Text style={styles.mediaTitle}>📷 Imagen</Text>
              <TouchableOpacity onPress={clearMultimedia} style={styles.clearButton}>
                <AntDesign name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
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
        )}

        {/* Sección de video de YouTube */}
        {multimediaType === 'video' && (
          <View style={styles.mediaContent}>
            <View style={styles.mediaHeader}>
              <Text style={styles.mediaTitle}>🎥 Video de YouTube</Text>
              <TouchableOpacity onPress={clearMultimedia} style={styles.clearButton}>
                <AntDesign name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={videoUrl}
              onChangeText={setVideoUrl}
              placeholder="https://www.youtube.com/watch?v=..."
              autoCapitalize="none"
            />
            {videoUrl && extractYouTubeId(videoUrl) && (
              <Text style={styles.videoPreview}>
                ✅ Video ID: {extractYouTubeId(videoUrl)}
              </Text>
            )}
          </View>
        )}

        {/* Sección de enlace */}
        {multimediaType === 'link' && (
          <View style={styles.mediaContent}>
            <View style={styles.mediaHeader}>
              <Text style={styles.mediaTitle}>🔗 Enlace</Text>
              <TouchableOpacity onPress={clearMultimedia} style={styles.clearButton}>
                <AntDesign name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={linkUrl}
              onChangeText={setLinkUrl}
              placeholder="https://ejemplo.com"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={linkTitle}
              onChangeText={setLinkTitle}
              placeholder="Título del enlace"
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={linkDescription}
              onChangeText={setLinkDescription}
              placeholder="Descripción del enlace (opcional)"
              multiline
            />
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Publicar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formBox: { 
    width: '100%', 
    maxWidth: 400, 
    backgroundColor: '#f7f7f7', 
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 100, // Más espacio para evitar solapamiento
    marginHorizontal: 20,
  },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderColor: '#003087', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#fff',
  },
  button: { backgroundColor: '#003087', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  multimediaSection: {
    marginBottom: 15,
  },
  multimediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
  },
  multimediaOption: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  multimediaOptionText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  mediaContent: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mediaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
  },
  clearButton: {
    padding: 5,
  },
  videoPreview: {
    marginTop: 5,
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
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
    width: 160,
    height: 120,
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
  tipoSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#003087',
  },
  tipoButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tipoButtonActive: {
    backgroundColor: '#003087',
  },
  tipoButtonText: {
    fontWeight: '600',
    color: '#003087',
  },
  tipoButtonTextActive: {
    color: '#fff',
  },
});
