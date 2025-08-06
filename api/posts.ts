// api/posts.ts
import { API_URL } from './config';
import { getPostMedia } from './multimedia';

export async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error('No se pudieron obtener los posts');
    const posts = await res.json();
    
    // Para cada post, obtener sus imágenes
    const postsWithMedia = await Promise.all(
      posts.map(async (post: any) => {
        try {
          const media = await getPostMedia(post.id);
          return {
            ...post,
            multimedia: media,
            // Para compatibilidad con PostCard, usar la primera imagen
            image: media.length > 0 ? media[0] : null
          };
        } catch (error) {
          console.warn(`Error fetching media for post ${post.id}:`, error);
          return {
            ...post,
            multimedia: [],
            image: null
          };
        }
      })
    );
    
    return postsWithMedia;
  } catch (error: any) {
    if (error.message?.includes('Network request failed') || error.name === 'TypeError') {
      throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
    }
    throw error;
  }
}
