// api/multimedia.ts
import { API_URL } from './config';
import { getToken } from '../utils/auth';

export interface MultimediaFile {
  id: number;
  tipo: string;
  filename?: string;
  original_name?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  url?: string;
  titulo?: string;
  descripcion?: string;
  id_post: number;
}

export async function uploadImage(imageUri: string, idPost?: number): Promise<MultimediaFile> {
  const token = await getToken();
  if (!token) throw new Error('No autenticado');

  const formData = new FormData();
  
  // Crear el objeto de archivo para React Native
  const fileExtension = imageUri.split('.').pop() || 'jpg';
  const fileName = `image_${Date.now()}.${fileExtension}`;
  
  formData.append('file', {
    uri: imageUri,
    name: fileName,
    type: `image/${fileExtension}`,
  } as any);

  if (idPost) {
    formData.append('id_post', idPost.toString());
  }

  const response = await fetch(`${API_URL}/multimedia/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al subir imagen');
  }

  const data = await response.json();
  return data.file;
}

export async function createAdvancedMultimedia(multimediaData: {
  tipo: 'video' | 'link';
  id_post: number;
  url: string;
  titulo?: string;
  descripcion?: string;
}): Promise<MultimediaFile> {
  const token = await getToken();
  if (!token) throw new Error('No autenticado');

  const response = await fetch(`${API_URL}/multimedia/advanced`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(multimediaData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear multimedia');
  }

  const data = await response.json();
  return data.multimedia;
}

export async function getPostMedia(postId: number): Promise<MultimediaFile[]> {
  try {
    const response = await fetch(`${API_URL}/multimedia/post/${postId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener multimedia del post');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Error fetching post media:', error);
    return [];
  }
}

export function getImageUrl(filename: string): string {
  return `${API_URL}/multimedia/file/${filename}`;
}

export function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}