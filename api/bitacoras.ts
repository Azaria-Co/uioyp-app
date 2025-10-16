// api/bitacoras.ts
import { API_URL } from './config';

export async function getBitacoras(id_pac?: number) {
  const url = id_pac 
    ? `${API_URL}/bitacoras?id_pac=${id_pac}`
    : `${API_URL}/bitacoras`;
    
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener bitácoras');
  return await res.json();
}

export async function getBitacora(id: number) {
  const res = await fetch(`${API_URL}/bitacoras/${id}`);
  if (!res.ok) throw new Error('Error al obtener bitácora');
  return await res.json();
}

export async function crearBitacora(fecha: string, presion_ar: string, glucosa: number, id_pac: number, comidas?: string, medicamentos?: string) {
  try {
    const res = await fetch(`${API_URL}/bitacoras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        fecha, 
        presion_ar, 
        glucosa: parseFloat(glucosa.toString()),
        id_pac,
        comidas,
        medicamentos
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`No se pudo crear la bitácora: ${res.status} ${res.statusText}`);
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
    console.log('Bitácora creada exitosamente:', data);
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return data;
  } catch (error) {
    console.error('Error completo:', error);
    throw error;
  }
}

export async function eliminarBitacora(id: number) {
  const res = await fetch(`${API_URL}/bitacoras/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('No se pudo eliminar la bitácora');
  return await res.json();
}
