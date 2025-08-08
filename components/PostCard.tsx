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
  author: string;
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
  author,
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

  // Construir la fuente de imagen
  const imageSource = image?.filename 
    ? { uri: getImageUrl(image.filename) }
    : image?.uri 
    ? { uri: image.uri }
    : image;

  return (
    <View style={[styles.cardContainer, { width: postWidth, alignSelf: 'center' }]}>
      <Text style={styles.author}>{author}</Text>

      {/* Multimedia del post (imágenes, videos, enlaces) */}
      <PostMultimedia postId={id} width={postWidth} />

      {/* Backward compatibility: mostrar imagen si existe en la prop */}
      {imageSource && (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <PostMedia source={imageSource} />
          </TouchableOpacity>
          <Modal visible={modalVisible} transparent animationType="fade">
            <PostMediaModal source={imageSource} onClose={() => setModalVisible(false)} />
          </Modal>
        </>
      )}

      <View style={styles.infoRow}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.area, { color: areaColor }]}>{area}</Text>
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
          <Text style={styles.seeMore}>
            {expanded ? 'Ver menos' : 'Ver más'}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 15,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
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
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
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
    marginTop: 10,
  },
  seeMore: {
    fontSize: 14,
    color: '#003087',
    fontWeight: '600',
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    marginTop: 8,
    color: '#777',
  },
});
