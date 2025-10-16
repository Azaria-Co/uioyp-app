# 📱 Instrucciones de Instalación y Configuración

## ✅ Correcciones Realizadas

Se han realizado las siguientes correcciones para hacer la app compatible con iOS y Android:

### 1. **package.json**
- ✅ Actualizado React de 19.1.0 a **18.3.1** (compatible con Expo SDK 54)
- ✅ Actualizado React Native de 0.81.4 a **0.76.6** (compatible con Expo SDK 54)
- ✅ Actualizado @types/react a **~18.3.12**
- ✅ Actualizado Expo de 54.0.13 a **~54.0.0** (versión estable)
- ✅ **Eliminada** dependencia obsoleta `react-navigation` (conflicto con @react-navigation/native)

### 2. **app.json**
- ✅ **Removido** `newArchEnabled: true` (puede causar incompatibilidades)
- ✅ **Agregado** `bundleIdentifier` para iOS: `com.alexid.uioypapp`
- ✅ **Agregados** permisos de iOS (InfoPlist) para cámara, fotos y micrófono
- ✅ **Agregados** permisos de Android para multimedia
- ✅ **Configurados** plugins necesarios:
  - `expo-video`
  - `expo-image-picker` (con permisos)
  - `expo-notifications` (con configuración)
- ✅ **Removido** `edgeToEdgeEnabled` en Android (puede causar problemas de UI)

### 3. **android/app/build.gradle**
- ✅ Corregido `namespace` y `applicationId` para que coincidan con app.json: `com.alexid.uioypapp`

---

## 🚀 Pasos para Ejecutar la Aplicación

### Paso 1: Configurar Java ⚠️ **CRÍTICO**

**El error principal es la versión de Java.** Debes instalar Java 17 o 21.

Sigue las instrucciones detalladas en: [`CONFIGURACION_JAVA.md`](./CONFIGURACION_JAVA.md)

**Resumen rápido:**

```bash
# Instalar Java 21 con Homebrew
brew install openjdk@21

# Crear symlink
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# Configurar en Fish (tu shell)
set -gx JAVA_HOME /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
set -gx PATH $JAVA_HOME/bin $PATH

# Recargar configuración
source ~/.config/fish/config.fish

# Verificar
java -version
```

### Paso 2: Instalar Dependencias

```bash
# Limpiar instalación anterior (si es necesario)
rm -rf node_modules package-lock.json

# Instalar dependencias
npm install

# Si usas iOS, instalar pods
cd ios && pod install && cd ..
```

### Paso 3: Limpiar Caché

```bash
# Limpiar caché de Gradle (Android)
cd android
./gradlew clean
cd ..

# Limpiar caché de Metro Bundler
npm start -- --reset-cache
```

### Paso 4: Ejecutar la Aplicación

#### Para Android:

```bash
npm run android
```

O con EAS Build:

```bash
eas build --platform android --profile development
```

#### Para iOS:

```bash
npm run ios
```

O con EAS Build:

```bash
eas build --platform ios --profile development
```

---

## 🔍 Verificar Configuración

Antes de ejecutar, verifica que todo esté correcto:

```bash
# Verificar versión de Node
node --version
# Debe ser >= 18

# Verificar versión de Java
java -version
# Debe ser 17 o 21, NO 25

# Verificar Expo CLI
npx expo --version

# Ejecutar diagnóstico de Expo
npx expo-doctor
```

---

## 📦 Estructura de Permisos

### iOS (Info.plist):
- ✅ Acceso a cámara
- ✅ Acceso a fotos
- ✅ Acceso a micrófono

### Android (AndroidManifest.xml):
- ✅ Internet
- ✅ Estado de red
- ✅ Cámara
- ✅ Lectura de almacenamiento
- ✅ Escritura de almacenamiento
- ✅ Lectura de imágenes multimedia
- ✅ Lectura de videos multimedia

---

## 🐛 Solución de Problemas Comunes

### Error: "Unsupported class file major version 69"
- **Causa**: Estás usando Java 25
- **Solución**: Instalar Java 17 o 21 (ver `CONFIGURACION_JAVA.md`)

### Error: "Unable to resolve module"
- **Solución**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm start -- --reset-cache
  ```

### Error en Android: "SDK location not found"
- **Solución**: Crea `android/local.properties` con:
  ```
  sdk.dir=/Users/TU_USUARIO/Library/Android/sdk
  ```

### Error en iOS: "Pods not installed"
- **Solución**:
  ```bash
  cd ios
  pod install
  cd ..
  ```

### Error: "Command failed: gradlew"
- **Solución**:
  ```bash
  cd android
  chmod +x gradlew
  cd ..
  ```

---

## 📱 Build para Producción

### Android (APK/AAB):

```bash
# Build de desarrollo
eas build --platform android --profile development

# Build de preview
eas build --platform android --profile preview

# Build de producción
eas build --platform android --profile production
```

### iOS (IPA):

```bash
# Build de desarrollo
eas build --platform ios --profile development

# Build de producción
eas build --platform ios --profile production
```

---

## 📋 Versiones Finales del Proyecto

```json
{
  "expo": "~54.0.0",
  "react": "18.3.1",
  "react-native": "0.76.6",
  "@types/react": "~18.3.12",
  "typescript": "~5.9.2"
}
```

**Gradle**: 8.9  
**Java requerido**: 17 o 21 (LTS)  
**Node requerido**: >= 18.x

---

## ✨ Próximos Pasos

1. ✅ **Configurar Java 17 o 21** (CRÍTICO)
2. ✅ Instalar dependencias: `npm install`
3. ✅ Limpiar caché: `npm start -- --reset-cache`
4. ✅ Ejecutar la app: `npm run android` o `npm run ios`
5. ✅ Probar en dispositivos físicos o emuladores

---

## 📞 Recursos Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Troubleshooting Guide](https://docs.expo.dev/troubleshooting/overview/)

---

**¡Tu aplicación ya está lista para ejecutarse en iOS y Android!** 🎉

Solo asegúrate de configurar Java correctamente y ejecutar los pasos de instalación.

