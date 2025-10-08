// api/progresos.ts
import { API_URL } from './config';

export async function getProgresos(id_pac?: number) {
  const url = id_pac 
    ? `${API_URL}/progresos?id_pac=${id_pac}`
    : `${API_URL}/progresos`;
    
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener progresos');
  return await res.json();
}

export async function getProgreso(id: number) {
  const res = await fetch(`${API_URL}/progresos/${id}`);
  if (!res.ok) throw new Error('Error al obtener progreso');
  return await res.json();
}

export async function crearProgreso(fecha: string, etapa: string, id_pac: number) {
  try {
    const res = await fetch(`${API_URL}/progresos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        fecha, 
        etapa, 
        id_pac 
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`No se pudo crear el progreso: ${res.status} ${res.statusText}`);
    }

    if (res.status === 201) {
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { created: true, status: 'success' };
      }
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await res.text();
      throw new Error('Respuesta del servidor no es JSON válido');
    }

    const data = await res.json();
    console.log('Progreso creado exitosamente:', data);
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Error completo:', error);
    throw error;
  }
}

export async function eliminarProgreso(id: number) {
  const res = await fetch(`${API_URL}/progresos/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('No se pudo eliminar el progreso');
  return await res.json();
} 