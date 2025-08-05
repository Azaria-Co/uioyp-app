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

export async function crearBitacora(fecha: string, presion_ar: string, glucosa: number, id_pac: number) {
  try {
    
    
    const res = await fetch(`${API_URL}/bitacoras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        fecha, 
        presion_ar, 
        glucosa: parseFloat(glucosa.toString()), // Asegurar que sea número
        id_pac 
      }),
    });

    

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`No se pudo crear la bitácora: ${res.status} ${res.statusText}`);
    }

    // Si la respuesta es exitosa (201 Created) pero vacía, considerarla válida
    if (res.status === 201) {
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Respuesta vacía pero exitosa
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
    
    // Manejar la nueva estructura de respuesta
    if (data.success && data.data) {
      return data.data; // Retornar solo los datos de la bitácora
    }
    
    return data; // Retornar la respuesta completa si no tiene la estructura esperada
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