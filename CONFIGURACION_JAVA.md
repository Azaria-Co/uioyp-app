# 🔧 Configuración de Java para el Proyecto

## ⚠️ Problema Actual

El proyecto actualmente tiene un **error crítico** debido a una incompatibilidad de versiones de Java:

```
Error: Unsupported class file major version 69
```

Este error indica que estás usando **Java 25**, pero **Gradle 8.9** solo soporta hasta **Java 21**.

---

## ✅ Solución: Instalar y Configurar Java 17 o Java 21

### Opción 1: Instalar Java 21 (LTS - Recomendado)

#### En macOS usando Homebrew:

```bash
# Instalar Java 21
brew install openjdk@21

# Crear un symlink
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# Verificar la instalación
java -version
```

#### Configurar JAVA_HOME en tu shell:

**Si usas Fish (tu caso):**

Edita tu archivo `~/.config/fish/config.fish` y agrega:

```fish
set -gx JAVA_HOME /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
set -gx PATH $JAVA_HOME/bin $PATH
```

Luego recarga la configuración:

```bash
source ~/.config/fish/config.fish
```

**Si usas Bash/Zsh:**

Edita `~/.zshrc` o `~/.bash_profile` y agrega:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH=$JAVA_HOME/bin:$PATH
```

Luego recarga:

```bash
source ~/.zshrc  # o source ~/.bash_profile
```

---

### Opción 2: Instalar Java 17 (LTS)

```bash
# Instalar Java 17
brew install openjdk@17

# Crear symlink
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Configurar JAVA_HOME (en Fish)
set -gx JAVA_HOME /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
set -gx PATH $JAVA_HOME/bin $PATH
```

---

## 🔍 Verificar la Configuración

Después de instalar y configurar Java, verifica:

```bash
# Ver la versión de Java
java -version

# Debería mostrar algo como:
# openjdk version "21.x.x" (para Java 21)
# o
# openjdk version "17.x.x" (para Java 17)

# Verificar JAVA_HOME
echo $JAVA_HOME

# Debería mostrar la ruta a la instalación de Java
```

---

## 🚀 Después de Configurar Java

Una vez que hayas configurado Java correctamente, ejecuta:

```bash
# Limpiar caché de Gradle
cd android
./gradlew clean

# Regresar a la raíz del proyecto
cd ..

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Limpiar caché de Metro
npm start -- --reset-cache
```

---

## 📱 Ejecutar la App

### Para Android:

```bash
npm run android
```

### Para iOS:

```bash
npm run ios
```

---

## 🆘 Solución de Problemas Adicionales

### Si sigues viendo errores de Java:

1. **Reinicia tu terminal completamente** después de cambiar JAVA_HOME
2. Verifica que no tengas múltiples versiones de Java en conflicto:
   ```bash
   /usr/libexec/java_home -V
   ```
3. Asegúrate de que Android Studio también esté usando la misma versión de Java:
   - Android Studio → Settings → Build, Execution, Deployment → Build Tools → Gradle
   - Gradle JDK: Selecciona Java 17 o 21

### Si hay errores de permisos:

```bash
# Dale permisos de ejecución a gradlew
cd android
chmod +x gradlew
cd ..
```

---

## 📋 Resumen de Versiones Actualizadas

Las versiones del proyecto han sido actualizadas a:

- **Expo SDK**: ~54.0.0
- **React**: 18.3.1
- **React Native**: 0.76.6
- **Java requerido**: 17 o 21 (NO 25)
- **Gradle**: 8.9

---

## ℹ️ Notas Importantes

- **Java 21** es la versión LTS (Long Term Support) más reciente compatible
- **Java 17** también es LTS y funciona perfectamente
- **Java 25** es demasiado nuevo y no es compatible con las herramientas actuales de React Native/Expo
- Siempre usa versiones LTS para proyectos de producción

---

**¿Necesitas ayuda?** Revisa la documentación oficial:
- [Expo Environment Setup](https://docs.expo.dev/get-started/set-up-your-environment/)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

