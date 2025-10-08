// api/especialistas.ts
import { API_URL } from './config';

export async function getEspecialistaByUserId(id_us: number) {
  const res = await fetch(`${API_URL}/especialistas/por-usuario/${id_us}`);
  if (!res.ok) throw new Error('No se pudo obtener el especialista');
  return await res.json();
}
