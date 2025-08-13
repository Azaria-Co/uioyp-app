// api/usuarios.ts
import { API_URL } from "./config";

export {};

export async function login(nombre_us: string) {
  const res = await fetch(`${API_URL}/usuarios/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre_us }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error || "Error al iniciar sesión");
  }

  return { token: data.token, rol: data.rol, nombre_us: data.nombre_us };
}
