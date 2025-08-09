// components/PostMultimedia.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { getPostMedia, extractYouTubeId, MultimediaFile, getImageUrl } from '../api/multimedia';
import { PostMedia } from './PostMedia';
import YouTubeVideo from './YouTubeVideo';
import LinkPreview from './LinkPreview';

interface PostMultimediaProps {
  postId: number;
  width?: number;
  onHasMedia?: (has: boolean) => void;
}

export default function PostMultimedia({ postId, width = 300, onHasMedia }: PostMultimediaProps) {
  const [multimedia, setMultimedia] = useState<MultimediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMultimedia();
  }, [postId]);

  const loadMultimedia = async () => {
    try {
      const data = await getPostMedia(postId);
      setMultimedia(data);
      onHasMedia?.(Array.isArray(data) && data.length > 0);
    } catch (error) {
      console.warn('Error loading post multimedia:', error);
      setMultimedia([]);
      onHasMedia?.(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || multimedia.length === 0) return null;

  return (
    <View style={[styles.container, { width, alignSelf: 'center' }] }>
      {multimedia.map((item) => {
        if (item.tipo === 'image' && item.filename) {
          // Mostrar imagen usando el componente existente
          return (
            <PostMedia 
              key={item.id}
              source={{ uri: getImageUrl(item.filename) }}
              maxWidth={width}
            />
          );
        } else if (item.tipo === 'video' && item.url) {
          // Mostrar video de YouTube
          const videoId = extractYouTubeId(item.url);
          if (videoId) {
            return (
              <YouTubeVideo
                key={item.id}
                videoId={videoId}
                titulo={item.titulo}
                // Ocultamos descripcion y botón extra para un look más compacto
                url={item.url}
                width={width}
                height={Math.round(width * 9 / 16)}
              />
            );
          }
        } else if (item.tipo === 'link' && item.url) {
          // Mostrar enlace
          return (
            <LinkPreview
              key={item.id}
              url={item.url}
              titulo={item.titulo}
              descripcion={item.descripcion}
              width={width}
            />
          );
        }
        
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});
