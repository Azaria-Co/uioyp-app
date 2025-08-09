// api/posts.ts
import { API_URL } from './config';
import { getPostMedia } from './multimedia';

export async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error('No se pudieron obtener los posts');
    const posts = await res.json();
    
    // Para cada post, obtener su multimedia
    const postsWithMedia = await Promise.all(
      posts.map(async (post: any) => {
        try {
          const media = await getPostMedia(post.id);
          // Elegir solo la primera imagen (si existe) para compatibilidad visual
          const firstImage = Array.isArray(media)
            ? media.find((m: any) => m?.tipo === 'image' && m?.filename)
            : null;
          return {
            ...post,
            multimedia: media,
            // Solo establecer image cuando realmente hay imagen
            image: firstImage ? firstImage : null,
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

export async function getTopLikedPosts() {
  const res = await fetch(`${API_URL}/posts/stats/top-liked`);
  if (!res.ok) throw new Error('No se pudieron obtener los posts más likeados');
  return res.json();
}

export async function getTopLikedPostsByEspecialista(id_esp: number) {
  const res = await fetch(`${API_URL}/posts/stats/top-liked/${id_esp}`);
  if (!res.ok) throw new Error('No se pudieron obtener los posts más likeados del especialista');
  return res.json();
}
