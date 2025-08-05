// components/PostCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, useWindowDimensions } from 'react-native';
import { PostMedia } from './PostMedia';
import PostMediaModal from './PostMediaModal';
import LikeButton from './LikeButton';

interface PostCardProps {
  id: number; // ← Agregamos esto
  author: string;
  title: string;
  area: string;
  areaColor: string;
  description: string;
  date: string;
  image?: any;
  likes: number;
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
}) => {
  const { width } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const MAX_WORDS = 25;
  const words = description.split(' ');
  const isLong = words.length > MAX_WORDS;
  const preview = words.slice(0, MAX_WORDS).join(' ') + '...';

  const postWidth = width > 600 ? Math.min(500, width * 0.7) : width - 40;

  return (
    <View style={[styles.cardContainer, { width: postWidth, alignSelf: 'center' }]}>
      <Text style={styles.author}>{author}</Text>

      {image && (
        <>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <PostMedia source={image} />
          </TouchableOpacity>
          <Modal visible={modalVisible} transparent animationType="fade">
            <PostMediaModal source={image} onClose={() => setModalVisible(false)} />
          </Modal>
        </>
      )}

      <View style={styles.infoRow}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.area, { color: areaColor }]}>{area}</Text>
        </View>
  
        <View style={{ marginTop: width < 400 ? 8 : 0 }}>
          <LikeButton id_post={id} initialCount={likes} />
        </View>
      </View>


      <Text style={styles.description}>
        {expanded || !isLong ? description : preview}
      </Text>

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
