// api/reacciones.ts
import { API_URL } from './config';

export async function getReaccion(id_us: number, id_post: number) {
  if (!id_us || !id_post) return null; // evita llamadas inválidas
  const res = await fetch(`${API_URL}/reacciones?id_us=${id_us}&id_post=${id_post}`);
  if (!res.ok) throw new Error('Error al obtener reacción');
  const data = await res.json();
  // La nueva estructura devuelve { exists: boolean, reaccion: object }
  return data.exists ? data.reaccion : null;
}

export async function getReaccionesCount(id_post?: number) {
  if (!id_post) return 0;

  try {
    const res = await fetch(`${API_URL}/reacciones/count?id_post=${id_post}`);

    if (!res.ok) {
      console.error('Respuesta no OK al cargar reacciones:', res.status);
      return 0;
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const raw = await res.text();
      console.warn('Respuesta no JSON al contar reacciones:', raw);
      return 0;
    }

    const data = await res.json();
    return data.count ?? 0;
  } catch (error) {
    console.error('Error al cargar reacciones:', error);
    return 0;
  }
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