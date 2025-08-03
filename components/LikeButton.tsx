// components/LikeButton.tsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { getIdUs } from '../utils/auth';
import {
  getReaccion,
  getReaccionesCount,
  crearReaccion,
  eliminarReaccion,
} from '../api/reacciones';



interface LikeButtonProps {
  id_post: number;
}

export default function LikeButton({ id_post }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [idUs, setIdUs] = useState<number | null>(null);

  useEffect(() => {
  const fetchReaccionInfo = async () => {
    const id_us = await getIdUs();
    if (!id_us) return;

    setIdUs(id_us);

    // Verifica si ya reaccionó
    const reaccion = await getReaccion(id_us, id_post);
    setLiked(!!reaccion);

    // Trae el número total de likes
    const count = await getReaccionesCount(id_post);
    setLikesCount(count);
  };

    fetchReaccionInfo();
  }, [id_post]);

  const handlePress = async () => {
    if (!idUs) return;

    if (liked) {
      await eliminarReaccion(idUs, id_post);
      setLiked(false);
      setLikesCount((prev) => Math.max(prev - 1, 0));
    } else {
      await crearReaccion(idUs, id_post);
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
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
