import { API_URL } from './config';

export async function setGlobalReminderTime(hour: number, minute: number) {
  const res = await fetch(`${API_URL}/push/reminder-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hour, minute }),
  });
  if (!res.ok) throw new Error('No se pudo guardar la hora');
  return res.json();
}

export async function createPatientReminder(id_pac: number, hour: number, minute: number, created_by: number) {
  const res = await fetch(`${API_URL}/push/patient-reminder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_pac, hour, minute, created_by }),
  });
  if (!res.ok) throw new Error('No se pudo crear el recordatorio');
  return res.json();
}

export async function listPatientReminders(id_pac: number) {
  const res = await fetch(`${API_URL}/push/patient-reminder?id_pac=${id_pac}`);
  if (!res.ok) throw new Error('No se pudieron obtener los recordatorios');
  return res.json();
}

export async function setPatientReminderActive(id: number, active: boolean) {
  const res = await fetch(`${API_URL}/push/patient-reminder/${id}/active`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active: active ? 1 : 0 }),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el recordatorio');
  return res.json();
}

export async function deletePatientReminder(id: number) {
  const res = await fetch(`${API_URL}/push/patient-reminder/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('No se pudo eliminar el recordatorio');
  return res.json();
}
