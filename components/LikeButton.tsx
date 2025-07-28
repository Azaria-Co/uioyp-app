// components/LikeButton.tsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { getIdUs } from '../utils/auth';
import {
  checkUserReaction,
  countReacciones,
  toggleReaccion,
} from '../api/reacciones';

interface LikeButtonProps {
  id_post: number;
}

export default function LikeButton({ id_post }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [idUs, setIdUs] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const id_us = await getIdUs();
      if (id_us) {
        setIdUs(id_us);
        const userLiked = await checkUserReaction(id_post, id_us);
        setLiked(userLiked);
      }

      const count = await countReacciones(id_post);
      setLikesCount(count);
    };

    fetchData();
  }, []);

  const handlePress = async () => {
    if (!idUs) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => prev + (newLiked ? 1 : -1));

    await toggleReaccion(id_post, idUs);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <AntDesign name={liked ? 'heart' : 'hearto'} size={20} color="crimson" />
      <Text style={styles.text}>{likesCount}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    marginLeft: 4,
    fontSize: 16,
    color: 'crimson',
  },
});
