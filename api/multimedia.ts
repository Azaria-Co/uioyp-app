// api/multimedia.ts
import { API_URL } from './config';
import { getToken } from '../utils/auth';

export interface MultimediaFile {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  id_post: number | null;
}

export async function uploadImage(imageUri: string, idPost?: number): Promise<MultimediaFile> {
  const token = await getToken();
  if (!token) throw new Error('No autenticado');

  const formData = new FormData();
  
  // Crear el objeto File para React Native
  const uriParts = imageUri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  
  formData.append('file', {
    uri: imageUri,
    name: `image.${fileType}`,
    type: `image/${fileType}`,
  } as any);

  if (idPost) {
    formData.append('id_post', idPost.toString());
  }

  try {
    const response = await fetch(`${API_URL}/multimedia/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error uploading image: ${errorText}`);
    }

    const result = await response.json();
    return result.file;
  } catch (error: any) {
    if (error.message?.includes('Network request failed') || error.name === 'TypeError') {
      throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
    }
    throw error;
  }
}

export async function getPostMedia(postId: number): Promise<MultimediaFile[]> {
  try {
    const response = await fetch(`${API_URL}/multimedia/post/${postId}`);
    
    if (!response.ok) {
      throw new Error('Error fetching post media');
    }

    return await response.json();
  } catch (error: any) {
    if (error.message?.includes('Network request failed') || error.name === 'TypeError') {
      console.warn(`No hay conexión para obtener multimedia del post ${postId}`);
      return []; // Retornar array vacío en lugar de fallar
    }
    throw error;
  }
}

export function getImageUrl(filename: string): string {
  return `${API_URL}/multimedia/file/${filename}`;
}