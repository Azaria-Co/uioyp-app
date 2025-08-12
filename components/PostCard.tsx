// components/PostCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, useWindowDimensions } from 'react-native';
import { PostMedia } from './PostMedia';
import PostMediaModal from './PostMediaModal';
import PostMultimedia from './PostMultimedia';
import LikeButton from './LikeButton';
import { getImageUrl } from '../api/multimedia';

interface PostCardProps {
  id: number;
  title: string;
  area: string;
  areaColor: string;
  description: string;
  date: string;
  image?: any; // Puede ser un objeto multimedia de la API o null
  likes: number;
  tipo?: string; // 'normal' | 'investigacion'
}

export const PostCard: React.FC<PostCardProps> = ({
  id, // ← destructuramos
  title,
  area,
  areaColor,
  description,
  date,
  image,
  likes,
  tipo = 'normal',
}) => {
  const { width } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Mostrar primeras 3 líneas y permitir expandir
  const isLong = (description || '').split(' ').length > 35 || (description || '').length > 160;

  const postWidth = width > 600 ? Math.min(500, width * 0.7) : width - 40;

  // Construir la fuente de imagen (BACK-compat) — mostraremos solo si no hay multimedia cargada
  const imageSource = image?.filename 
    ? { uri: getImageUrl(image.filename) }
    : image?.uri 
    ? { uri: image.uri }
    : undefined;
  const [hasServerMedia, setHasServerMedia] = useState<boolean>(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    // Solo la fecha, sin hora, en español
    try {
      return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return d.toISOString().slice(0, 10);
    }
  };

  return (
    <View style={[
      styles.cardContainer, 
      { 
        width: postWidth, 
        alignSelf: 'center',
        borderColor: areaColor,
        borderWidth: 3,
      }
    ]}>
      {/* Marco superior con color del área */}
      <View style={[styles.areaHeader, { backgroundColor: areaColor }]}>
        <Text style={styles.areaText}>{area}</Text>
      </View>

      {/* Contenido principal con fondo blanco */}
      <View style={styles.contentContainer}>
        {/* Multimedia del post (imágenes, videos, enlaces) */}
        <PostMultimedia postId={id} width={postWidth - 30} onHasMedia={setHasServerMedia} />

        {/* Backward compatibility: si no viene multimedia desde servidor y sí hay imagen directa */}
        {!imageSource || hasServerMedia ? null : (
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <PostMedia source={imageSource} maxWidth={postWidth - 30} />
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent animationType="fade">
              <PostMediaModal source={imageSource} onClose={() => setModalVisible(false)} />
            </Modal>
          </>
        )}

        <View style={styles.infoRow}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}>{title}</Text>
          </View>
    
          <View style={{ marginTop: width < 400 ? 8 : 0 }}>
            <LikeButton id_post={id} initialCount={likes} tipo={tipo} />
          </View>
        </View>
        
        {!!description && (
          <Text style={styles.description} numberOfLines={expanded ? undefined : 3}>
            {description}
          </Text>
        )}

        {isLong && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={[styles.seeMore, { color: areaColor, fontWeight: 'bold' }]}>
              {expanded ? 'Ver menos' : 'Ver más'}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.date, { color: areaColor, fontWeight: '500' }]}>{formatDate(date)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    marginVertical: 15,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden', // Para que el header no se salga de los bordes redondeados
  },
  areaHeader: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  areaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentContainer: {
    padding: 20, // Más padding para que respire mejor
    backgroundColor: '#fff',
  },
  author: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  area: {
    fontSize: 14,
    fontWeight: '500',
  },
  likeButton: {
    fontSize: 14,
    color: '#003087',
    fontWeight: 'bold',
    maxWidth: 100,
    textAlign: 'right',
    flexShrink: 1,
  },
  description: {
    fontSize: 14,
    marginTop: 15,
    lineHeight: 22,
    color: '#555',
  },
  seeMore: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    marginTop: 12,
    fontWeight: '500',
  },
});
