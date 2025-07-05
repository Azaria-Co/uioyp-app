// components/PostCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PostMedia } from './PostMedia';

interface PostCardProps {
  author: string;
  title: string;
  area: string;
  areaColor: string;
  description: string;
  date: string;
  image: any;
}

export const PostCard: React.FC<PostCardProps> = ({
  author,
  title,
  area,
  areaColor,
  description,
  date,
  image,
}) => {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.author}>{author}</Text>
      <PostMedia source={image} />

      <View style={styles.infoRow}>
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.area, { color: areaColor }]}>{area}</Text>
        </View>

        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <Text style={styles.likeButton}>{liked ? '❤️ Me gusta' : '🤍 Me gusta'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{description}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
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
  textSection: {
    flexDirection: 'column',
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
  },
  description: {
    fontSize: 14,
    marginTop: 10,
  },
  date: {
    fontSize: 12,
    marginTop: 8,
    color: '#777',
  },
});
