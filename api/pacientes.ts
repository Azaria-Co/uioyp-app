// api/pacientes.ts
import { API_URL } from './config';

export async function getPacienteByUsuario(id_us: number) {
  const res = await fetch(`${API_URL}/pacientes/by-usuario/${id_us}`);
  if (!res.ok) throw new Error('Error al obtener paciente');
  return await res.json();
}

export async function getPaciente(id: number) {
  const res = await fetch(`${API_URL}/pacientes/${id}`);
  if (!res.ok) throw new Error('Error al obtener paciente');
  return await res.json();
}

export async function getPacientesByEspecialista(id_esp: number) {
  // Como cualquier especialista puede gestionar cualquier paciente,
  // simplemente obtenemos todos los pacientes
  const res = await fetch(`${API_URL}/pacientes/by-especialista/${id_esp}`);
  if (!res.ok) throw new Error('Error al obtener pacientes');
  return await res.json();
}
