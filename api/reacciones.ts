// api/reacciones.ts
import { API_URL } from './config';

export async function toggleReaccion(id_post: number, id_us: number) {
  await fetch(`${API_URL}/reacciones/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_post, id_us }),
  });
}

export async function countReacciones(id_post: number): Promise<number> {
  const res = await fetch(`${API_URL}/reacciones/count?id_post=${id_post}`);
  const data = await res.json();
  return data.count || 0;
}

export async function checkUserReaction(id_post: number, id_us: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/reacciones/check?id_post=${id_post}&id_us=${id_us}`);
  const data = await res.json();
  return data.liked || false;
}
