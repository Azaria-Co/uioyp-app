//components/LikeButton.tsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
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
  initialCount: number;
  tipo?: string; // 'normal' | 'investigacion'
}

export default function LikeButton({ id_post, initialCount, tipo = 'normal' }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [idUs, setIdUs] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchReaccionInfo = async () => {
      try {
        const id_us = await getIdUs();
        if (!id_us) {
          console.log('No se pudo obtener id_us');
          setLoading(false);
          return;
        }

        setIdUs(id_us);

        const reaccion = await getReaccion(id_us, id_post);
        setLiked(!!reaccion);

        setLikesCount(initialCount);
      } catch (error) {
        console.error('Error al cargar reacciones:', error);
        // En caso de error, asumimos que no hay like
        setLiked(false);
        setLikesCount(initialCount);
      } finally {
        setLoading(false);
      }
    };

    fetchReaccionInfo();
  }, [id_post]);

  const handlePress = async () => {
    if (!idUs || processing) return;

    setProcessing(true);

    try {
      if (liked) {
        await eliminarReaccion(idUs, id_post);
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await crearReaccion(idUs, id_post);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error al actualizar reacción:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <TouchableOpacity style={styles.button}>
        <ActivityIndicator size="small" color="crimson" />
      </TouchableOpacity>
    );
  }

  // Configurar texto e ícono según el tipo
  const isInvestigacion = tipo === 'investigacion';
  const buttonText = isInvestigacion ? 'Quiero participar' : 'Me gusta';
  const iconName = isInvestigacion 
    ? (liked ? 'star' : 'staro') 
    : (liked ? 'heart' : 'hearto');
  const iconColor = isInvestigacion ? '#003087' : 'crimson';

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button} disabled={processing}>
      <AntDesign name={iconName as any} size={20} color={iconColor} />
      <Text style={[styles.text, { color: iconColor }]}>
        {likesCount} {liked ? (isInvestigacion ? 'Participando' : 'Me gusta') : buttonText}
      </Text>
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