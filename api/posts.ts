// api/posts.ts
import { API_URL } from './config';

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error('No se pudieron obtener los posts');
  return await res.json();
}
