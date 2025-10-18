# 🩺 Dialysis Clock - Instrucciones de Instalación

## 📋 Requisitos del Sistema

- **Dispositivo**: iPad 2 o superior, tablet Android, o cualquier dispositivo con navegador web
- **Navegador**: Safari iOS 9+, Chrome, Firefox, Edge
- **Almacenamiento**: 10 MB de espacio libre
- **Conexión**: No requiere internet (funciona offline)

## 🚀 Instalación Rápida

### Opción 1: Instalación Local (Recomendada)

1. **Descargar archivos**:

   - Descargar todos los archivos de la aplicación
   - Colocar en una carpeta local (ej: `C:\DialysisClock\`)

2. **Abrir aplicación**:

   - Abrir `index.html` en el navegador
   - La aplicación se cargará automáticamente

3. **Configurar**:
   - Mantener pulsado 5 segundos en la esquina inferior derecha
   - Configurar días de diálisis y horarios
   - Guardar configuración

### Opción 2: Servidor Web Local

1. **Instalar servidor web** (opcional):

   ```bash
   # Con Python 3
   python -m http.server 8000

   # Con Node.js
   npx http-server -p 8000
   ```

2. **Acceder**:
   - Abrir navegador en `http://localhost:8000`
   - Seguir pasos de configuración

## 📱 Instalación en iPad (Modo Kiosko)

### Paso 1: Preparar Archivos

1. Copiar todos los archivos a una carpeta accesible
2. Asegurarse de que `index.html` esté en la raíz

### Paso 2: Instalar en iPad

1. **Abrir Safari** en el iPad
2. **Navegar** a la ubicación de los archivos:

   - Si están en un servidor: `http://[IP]:8000`
   - Si están en iCloud: Abrir desde iCloud Drive
   - Si están en USB: Conectar y abrir desde Files

3. **Abrir aplicación**:

   - Tocar `index.html`
   - La aplicación se abrirá en Safari

4. **Agregar a pantalla de inicio**:
   - Tocar el botón "Compartir" (cuadrado con flecha)
   - Seleccionar "Agregar a Pantalla de Inicio"
   - Personalizar nombre: "Dialysis Clock"
   - Tocar "Agregar"

### Paso 3: Configurar Modo Kiosko

1. **Abrir la aplicación** desde la pantalla de inicio
2. **Configurar**:

   - Mantener pulsado 5 segundos en esquina inferior derecha
   - Establecer días de diálisis
   - Configurar horarios y colores
   - Guardar

3. **Activar modo pantalla completa**:
   - En Configuración > Pantalla y Brillo > Bloquear Automáticamente > Nunca
   - En Configuración > Accesibilidad > Control por Botones > Activar

## 🔧 Configuración Avanzada

### Configuración de Red (Opcional)

Si se desea acceso remoto a la configuración:

1. **Instalar servidor web**:

   ```bash
   # Python
   python -m http.server 8000 --bind 0.0.0.0

   # Node.js
   npx http-server -p 8000 -a 0.0.0.0
   ```

2. **Acceder desde iPad**:
   - Conectar iPad y computadora a la misma red WiFi
   - En iPad, abrir Safari
   - Navegar a `http://[IP-COMPUTADORA]:8000`

### Configuración de Audio (Opcional)

1. **Crear archivos de audio**:

   - Grabar mensajes en español
   - Convertir a MP3 (128 kbps)
   - Guardar en carpeta `audio/`:
     - `today-dialysis.mp3`
     - `tomorrow-dialysis.mp3`
     - `rest-day.mp3`

2. **Habilitar audio**:
   - Acceder a configuración
   - Activar opción "Audio"
   - Guardar

## 🧪 Verificación de Instalación

### Pruebas Básicas

1. **Abrir** `test.html` en el navegador
2. **Ejecutar pruebas**:

   - Probar localStorage
   - Verificar lógica de fechas
   - Comprobar estados
   - Validar modo noche

3. **Verificar funcionalidad**:
   - Cambiar fecha/hora del sistema
   - Comprobar que los estados cambien correctamente
   - Verificar persistencia de configuración

### Pruebas en iPad

1. **Modo kiosko**:

   - Verificar que no aparezcan controles del navegador
   - Comprobar que no se pueda hacer zoom
   - Validar que no se pueda salir accidentalmente

2. **Configuración**:
   - Probar acceso con pulsación prolongada
   - Verificar guardado de configuración
   - Comprobar exportación/importación

## 🔄 Actualizaciones

### Actualizar Aplicación

1. **Reemplazar archivos**:

   - Descargar nueva versión
   - Reemplazar archivos existentes
   - Mantener configuración (no sobrescribir)

2. **Actualizar en iPad**:
   - Abrir Safari
   - Navegar a la nueva ubicación
   - Agregar nuevamente a pantalla de inicio

### Respaldo de Configuración

1. **Exportar configuración**:

   - Acceder a configuración
   - Tocar "Exportar"
   - Guardar archivo JSON

2. **Restaurar configuración**:
   - Acceder a configuración
   - Tocar "Importar"
   - Seleccionar archivo JSON guardado

## 🆘 Solución de Problemas

### La aplicación no carga

- Verificar que todos los archivos estén presentes
- Comprobar que `index.html` esté en la raíz
- Verificar permisos de archivos

### No se puede acceder a configuración

- Mantener pulsado exactamente 5 segundos
- Verificar que no haya otros elementos interfiriendo
- Probar en diferentes navegadores

### Configuración no se guarda

- Verificar que localStorage esté habilitado
- Comprobar espacio disponible
- Probar en modo incógnito/privado

### Problemas de audio

- Verificar que los archivos MP3 estén en carpeta `audio/`
- Comprobar que el volumen esté activado
- Verificar que el navegador soporte audio

## 📞 Soporte Técnico

Para problemas específicos:

1. Revisar archivo `test.html` para diagnósticos
2. Verificar consola del navegador para errores
3. Comprobar compatibilidad del navegador
4. Contactar soporte técnico si persisten los problemas

## 📚 Documentación Adicional

- `USAGE.md` - Guía de uso detallada
- `README.md` - Documento funcional original
- `config-example.json` - Ejemplo de configuración
