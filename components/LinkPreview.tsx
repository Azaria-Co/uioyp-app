// components/LinkPreview.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

interface LinkPreviewProps {
  url: string;
  titulo?: string;
  descripcion?: string;
  width?: number;
}

export default function LinkPreview({ 
  url, 
  titulo, 
  descripcion,
  width = 300 
}: LinkPreviewProps) {
  
  const openLink = async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir el enlace');
    }
  };

  const getDomainFromUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Enlace externo';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { width }]} 
      onPress={openLink}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <AntDesign name="link" size={24} color="#007bff" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.titulo} numberOfLines={2}>
          {titulo || 'Enlace sin título'}
        </Text>
        
        {descripcion && (
          <Text style={styles.descripcion} numberOfLines={3}>
            {descripcion}
          </Text>
        )}
        
        <View style={styles.urlContainer}>
          <Ionicons name="earth" size={12} color="#666" />
          <Text style={styles.domain} numberOfLines={1}>
            {getDomainFromUrl(url)}
          </Text>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <AntDesign name="right" size={16} color="#007bff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 4,
    lineHeight: 20,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  domain: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
