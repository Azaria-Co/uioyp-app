# UIOYP App - React Native

Aplicación móvil para el sistema UIOYP (Órtesis y Prótesis) desarrollada con React Native y Expo.

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio o Xcode para emuladores

### Pasos de instalación

1. **Instalar dependencias**
   ```bash
   cd uioyp-app
   npm install
   ```

2. **Configurar la URL de la API**
   
   Edita el archivo `api/config.ts` y reemplaza `[IP_ADD]` con la IP local donde está corriendo tu API:
   ```typescript
   export const API_URL = "http://192.168.1.100:3001"; // Reemplaza con tu IP
   ```

3. **Instalar dependencias adicionales**
   ```bash
   npx expo install expo-image-picker
   ```

4. **Ejecutar la aplicación**
   ```bash
   npx expo start
   ```

## 📱 Funcionalidades

### Para Pacientes
- ✅ Ver blog de posts de especialistas
- ✅ Filtrar posts por área de especialidad
- ✅ Dar likes a publicaciones
- ✅ Gestionar bitácora médica
- ✅ Ver progreso personal

### Para Especialistas
- ✅ Crear posts con texto e imágenes
- ✅ Gestionar progreso de pacientes
- ✅ Revisar bitácoras de pacientes
- ✅ Subir multimedia a publicaciones

## 🔧 Configuración de Multimedia

La app ahora soporta subida de imágenes:

1. **Permisos**: La app solicita automáticamente permisos de galería
2. **Formatos soportados**: JPG, JPEG, PNG, GIF, WEBP
3. **Tamaño máximo**: 10MB por imagen
4. **Almacenamiento**: Las imágenes se guardan en el servidor en la carpeta `uploads/`

## 🌐 Conexión con la API

Asegúrate de que:
- La API esté corriendo en el puerto 3001
- La carpeta `uploads/` exista en el directorio de la API
- CORS esté habilitado para la IP de tu dispositivo móvil

## 📂 Estructura de archivos relevantes

```
uioyp-app/
├── api/
│   ├── config.ts              # Configuración de URL de API
│   ├── multimedia.ts          # Funciones para manejo de multimedia
│   └── posts.ts               # Funciones para posts con multimedia
├── components/
│   ├── forms/
│   │   └── CreatePostForm.tsx # Formulario con selector de imágenes
│   ├── PostCard.tsx           # Tarjeta de post con imágenes
│   ├── PostMedia.tsx          # Componente para mostrar multimedia
│   └── PostMediaModal.tsx     # Modal de imagen en pantalla completa
└── screens/
    ├── pacientes/
    │   └── BlogScreen.tsx     # Pantalla de blog con posts
    └── especialistas/
        └── HomeSpecialist.tsx # Pantalla principal de especialistas
```

## 🐛 Troubleshooting

### Error de conexión a la API
- Verifica que la IP en `config.ts` sea correcta
- Asegúrate de que tu dispositivo esté en la misma red que el servidor
- Confirma que la API esté corriendo en el puerto 3001

### Problemas con imágenes
- Verifica que la carpeta `uploads/` exista en el servidor
- Comprueba que el archivo tenga permisos de escritura
- Revisa que el formato de imagen sea compatible

### Errores de permisos
- En iOS: Permite acceso a la galería cuando la app lo solicite
- En Android: Verifica permisos en Configuración > Apps > UIOYP > Permisos

## 📝 Notas importantes

- Siempre configura la IP correcta antes de probar en dispositivos físicos
- Para desarrollo, usa `expo start --tunnel` si tienes problemas de red
- Las imágenes se comprimen automáticamente para optimizar el rendimiento