// components/YouTubeVideo.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe'; 
import { AntDesign } from '@expo/vector-icons';

import StateChange from 'react-native-youtube-iframe'; 

interface YouTubeVideoProps {
  videoId: string;
  titulo?: string;
  descripcion?: string;
  url: string;
  width?: number;
  height?: number;
}

export default function YouTubeVideo({ 
  videoId, 
  titulo, 
  descripcion, 
  url,
  width = 300, 
  height = 200 
}: YouTubeVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  const openInYouTube = async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir YouTube');
    }
  };

  if (error) {
    return (
      <View style={[styles.errorContainer, { width }]}>
        <AntDesign name="video-camera" size={32} color="#ccc" />
        <Text style={styles.errorText}>Error al cargar video</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, alignSelf: 'center' }] }>
      {titulo && <Text style={styles.titulo}>{titulo}</Text>}
      
      <View style={[styles.videoOuter, { width: width - 20 }]}> 
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={height}
            width={width - 40}
            play={playing}
            videoId={videoId}
            // CORRECCIÓN FINAL: Usamos 'typeof StateChange' para obtener el tipo del valor importado
            onChangeState={(state: typeof StateChange) => { 
              setPlaying(state === 'playing');
            }}
            onError={handleError}
          />
        </View>
      </View>

      {/* Compacto: sin botón extra */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 8,
  },
  videoOuter: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  videoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff0000',
    gap: 5,
  },
  linkButtonText: {
    color: '#ff0000',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
});