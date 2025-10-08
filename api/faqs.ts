//api/faqs.ts
import { API_URL } from './config';

export type Faq = {
  id: number;
  pregunta: string;
  respuesta: string;
  id_esp: number;
};

export async function getFaqs(area?: string): Promise<Faq[]> {
  const qs = area ? `?area=${encodeURIComponent(area)}` : '';
  const res = await fetch(`${API_URL}/faqs${qs}`);
  if (!res.ok) return [];
  return await res.json();
}

export async function createFaq(input: { pregunta: string; respuesta: string; id_esp: number }) {
  const res = await fetch(`${API_URL}/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('No se pudo crear la FAQ');
  return await res.json();
}

export async function deleteFaq(id: number, id_esp: number) {
  const res = await fetch(`${API_URL}/faqs/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_esp }),
  });
  if (!res.ok) throw new Error('No se pudo eliminar la FAQ');
  return await res.json();
}



