# Dialysis Clock - Guía de Uso

## 🩺 Descripción

Dialysis Clock es una aplicación web diseñada para reducir la ansiedad y desorientación temporal en pacientes de diálisis, especialmente personas mayores o con demencia leve.

## 🚀 Instalación y Configuración

### Para iPad/Tablet (Modo Kiosko)

1. Abrir Safari en el iPad
2. Navegar a la carpeta donde está la aplicación
3. Abrir `index.html`
4. Tocar el botón "Compartir" en Safari
5. Seleccionar "Agregar a Pantalla de Inicio"
6. La aplicación aparecerá como una app independiente

### Para Configuración Inicial

1. **Acceder al modo configuración**: Mantener pulsado 5 segundos en la esquina inferior derecha de la pantalla
2. **Configurar días de diálisis**: Marcar los días de la semana (por defecto: Martes, Jueves, Sábado)
3. **Establecer hora de ambulancia**: Configurar la hora habitual de recogida
4. **Ajustar horario nocturno**: Definir cuándo activar el modo noche (por defecto: 22:00 - 06:00)
5. **Personalizar colores**: Ajustar los colores para cada estado según preferencias
6. **Guardar configuración**: Tocar "Guardar" para aplicar los cambios

## 📱 Estados de la Aplicación

### 🟢 Hoy hay diálisis

- **Mensaje**: "HOY HAY DIÁLISIS"
- **Submensaje**: "La ambulancia viene a las [hora]"
- **Color**: Verde claro
- **Animación**: Parpadeo suave 15 minutos antes de la hora de ambulancia

### 🟡 Mañana hay diálisis

- **Mensaje**: "MAÑANA HAY DIÁLISIS"
- **Submensaje**: "Prepárate esta noche"
- **Color**: Amarillo/naranja cálido

### 🔵 Hoy descanso

- **Mensaje**: "HOY DESCANSO"
- **Submensaje**: "No hay diálisis hoy"
- **Color**: Azul suave

### 🌙 Modo noche

- **Mensaje**: "Es de noche. [Mensaje según el día siguiente]"
- **Color**: Azul oscuro/lavanda
- **Horario**: 22:00 - 06:00 (configurable)

## ⚙️ Opciones de Configuración

### Días de Diálisis

- Seleccionar los días de la semana en que hay tratamiento
- Por defecto: Martes, Jueves, Sábado

### Hora de Ambulancia

- Establecer la hora habitual de recogida
- Formato 24 horas (ej: 06:30)

### Horario Modo Noche

- **Inicio**: Hora de inicio del modo nocturno
- **Fin**: Hora de finalización del modo nocturno
- Por defecto: 22:00 - 06:00

### Colores Personalizables

- **Hoy diálisis**: Verde claro
- **Mañana diálisis**: Amarillo/naranja
- **Descanso**: Azul suave
- **Modo noche**: Azul oscuro/lavanda

### Opciones Adicionales

- **Mostrar hora**: Activar/desactivar visualización de la hora actual
- **Animaciones**: Activar/desactivar transiciones suaves
- **Audio**: Activar/desactivar mensajes de voz (requiere archivos de audio)

## 🔧 Funciones Avanzadas

### Exportar/Importar Configuración

- **Exportar**: Guardar la configuración actual en un archivo JSON
- **Importar**: Cargar una configuración desde un archivo JSON
- Útil para transferir configuración entre dispositivos o hacer copias de seguridad

### Modo Kiosko

- Pantalla completa sin controles del navegador
- Prevención de zoom y scroll accidental
- Ideal para uso continuo en tablet

## 🎯 Casos de Uso Típicos

### Configuración Inicial

1. El cuidador configura los días de diálisis
2. Establece la hora de ambulancia
3. Ajusta colores según preferencias del paciente
4. Guarda la configuración

### Uso Diario

1. El paciente ve inmediatamente el estado del día
2. Durante la noche, recibe mensajes tranquilizadores
3. En días de diálisis, recibe recordatorios claros
4. En días de descanso, se tranquiliza sabiendo que no hay tratamiento

### Mantenimiento

1. Acceder a configuración con pulsación prolongada
2. Ajustar horarios si cambian
3. Modificar días de diálisis según programación médica
4. Exportar configuración para respaldo

## 🔋 Consideraciones Técnicas

### Compatibilidad

- Safari iOS 9+ (iPad 2 compatible)
- Funciona offline completamente
- No requiere conexión a internet

### Rendimiento

- Optimizado para ejecución continua
- Consumo mínimo de batería
- Actualización automática cada minuto

### Accesibilidad

- Texto grande y legible desde 2 metros
- Alto contraste configurable
- Compatible con lectores de pantalla

## 🆘 Solución de Problemas

### La aplicación no se actualiza

- Verificar que la configuración esté guardada
- Reiniciar la aplicación
- Comprobar que la fecha/hora del dispositivo sea correcta

### No se puede acceder a la configuración

- Mantener pulsado exactamente 5 segundos en la esquina inferior derecha
- Asegurarse de que no hay otros elementos interfiriendo

### Los colores no se aplican

- Verificar que las animaciones estén habilitadas
- Comprobar que el navegador soporte CSS moderno
- Reiniciar la aplicación

### Problemas de audio

- Verificar que los archivos de audio estén en la carpeta `audio/`
- Comprobar que el audio esté habilitado en configuración
- Asegurarse de que el volumen del dispositivo esté activado

## 📞 Soporte

Para problemas técnicos o sugerencias de mejora, contactar al desarrollador o cuidador técnico.
