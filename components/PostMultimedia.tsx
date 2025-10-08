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

  const innerWidth = width - 20; // breathing space

  return (
    <View style={[styles.container, { width, alignSelf: 'center', paddingHorizontal: 10 }] }>
      {multimedia.map((item) => {
        if (item.tipo === 'image' && item.filename) {
          return (
            <PostMedia 
              key={item.id}
              source={{ uri: getImageUrl(item.filename) }}
              maxWidth={innerWidth}
            />
          );
        } else if (item.tipo === 'video' && item.url) {
          const videoId = extractYouTubeId(item.url);
          if (videoId) {
            return (
              <YouTubeVideo
                key={item.id}
                videoId={videoId}
                titulo={item.titulo}
                url={item.url}
                width={innerWidth}
                height={Math.round(innerWidth * 9 / 16)}
              />
            );
          }
        } else if (item.tipo === 'link' && item.url) {
          return (
            <LinkPreview
              key={item.id}
              url={item.url}
              titulo={item.titulo}
              descripcion={item.descripcion}
              width={innerWidth}
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
