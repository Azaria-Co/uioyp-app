// api/reacciones.ts
import { API_URL } from './config';

export async function getReaccion(id_us: number, id_post: number) {
  const res = await fetch(`${API_URL}/reacciones?id_us=${id_us}&id_post=${id_post}`);
  if (!res.ok) throw new Error('No se pudo obtener la reacción');
  return await res.json(); // null si no existe
}

export async function getReaccionesCount(id_post: number) {
  const res = await fetch(`${API_URL}/reacciones/count?id_post=${id_post}`);
  if (!res.ok) throw new Error('No se pudo obtener el conteo de reacciones');
  const data = await res.json();
  return data.count;
}

export async function crearReaccion(id_us: number, id_post: number) {
  const res = await fetch(`${API_URL}/reacciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_us, id_post }),
  });

  if (!res.ok) throw new Error('No se pudo crear la reacción');
  return await res.json();
}

export async function eliminarReaccion(id_us: number, id_post: number) {
  const res = await fetch(`${API_URL}/reacciones?id_us=${id_us}&id_post=${id_post}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('No se pudo eliminar la reacción');
  return await res.json();
}
