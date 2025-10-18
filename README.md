🩺 Documento Funcional — Aplicación “Dialysis Clock” (OpenCareClock v2)

1. 📘 Descripción general

Dialysis Clock es una aplicación web de propósito único diseñada para reducir la ansiedad y la desorientación temporal en personas mayores o con demencia leve que asisten regularmente a tratamientos de diálisis.

La aplicación actúa como un reloj emocional y contextual, mostrando de forma muy clara y visual si hoy hay diálisis, si será mañana o si puede descansar, sin requerir interpretación cognitiva compleja.

El sistema está pensado para funcionar 24h al día en modo kiosko, en una tableta (por ejemplo, un iPad 2 con iOS 9), sin conexión a internet y sin depender de servidores externos.

2. 🎯 Objetivos

Disminuir la ansiedad nocturna y los despertares relacionados con la confusión sobre los días de diálisis.

Ofrecer una señal clara, inmediata y comprensible de si hay o no diálisis.

Adaptarse al contexto de la persona: hora del día, momento de descanso y día siguiente.

Facilitar al cuidador la configuración inicial sin interferir con el uso diario.

3. 🧱 Arquitectura general

Aplicación web estática: HTML, CSS y JavaScript puro (sin dependencias externas).

Datos y configuración almacenados en localStorage.

Funcionamiento offline 100%.

Compatible con navegadores antiguos (Safari iOS 9).

Modo kiosko por defecto (pantalla completa, sin controles del sistema).

Modo configuración accesible solo mediante gesto o pulsación prolongada.

4. 🧠 Lógica funcional principal
   4.1. Días de diálisis

Configurables (por defecto: martes, jueves y sábado).

El sistema determina automáticamente el estado actual y el estado del día siguiente.

4.2. Estados posibles
Estado Descripción Mensaje principal Color sugerido Ejemplo
Hoy hay diálisis Día actual coincide con día de diálisis "HOY HAY DIÁLISIS"
"La ambulancia viene a las 6:30." 🟢 Verde claro / turquesa Martes, 06:00
Diálisis completada Día de diálisis y hora ≥ horaFinDialisis "YA FUE A DIÁLISIS"
"Descansa, ya pasó." 🟢 Verde apagado / azul verdoso Martes, 14:00
Mañana hay diálisis El siguiente día es de diálisis "MAÑANA HAY DIÁLISIS"
"Prepárate esta noche." 🟡 Amarillo cálido / naranja suave Lunes noche
Hoy descanso Día actual no coincide ni precede a día de diálisis "HOY DESCANSO"
"No hay diálisis hoy." 🔵 Azul suave Domingo
Modo noche Entre 22:00 y 06:00 (configurable) Si mañana hay diálisis → "Mañana hay diálisis, duerme tranquilo."
Si no hay → "Mañana no hay diálisis, descansa." 🌙 Azul oscuro / lavanda Cualquier noche

4.3. Estado "Diálisis completada"

Condición: el día actual es de diálisis y la hora ≥ horaFinDialisis (configurable).

Mensaje: "YA FUE A DIÁLISIS — Descansa, ya pasó."

Color: verde apagado / azul verdoso.

Objetivo: confirmar que el evento ya ocurrió y reducir la ansiedad post-sesión.

Duración: hasta el inicio del modo noche (22:00).

5. 🕓 Comportamiento por hora
   Hora Comportamiento
   06:00–22:00 Muestra el estado diurno correspondiente (“Hoy” / “Mañana” / “Descanso”).
   22:00–06:00 Activa modo noche: fondo oscuro, texto relajante, sin reloj visible (opcional).
   Hora configurable de ambulancia Si hoy hay diálisis, el color puede animarse suavemente 15 minutos antes de la hora (transición de azul a verde). 6. 💬 Mensajes y animaciones
   6.1. Mensajes visuales

Texto principal muy grande (mínimo 20% de la pantalla).

Subtexto con recordatorio o mensaje tranquilizador.

Opción de mostrar la hora actual (pequeña, esquina inferior).

6.2. Animaciones

Transiciones suaves de color (sin parpadeo).

En días de diálisis: transición lenta hacia tonos más luminosos al acercarse la hora configurada (por ejemplo, 06:00).

En modo noche: brillo reducido y fondo fijo.

7. 🔈 Mensajes de voz (opcional / fase 2)
   7.1. Reproducción de audio local

Archivos MP3 precargados en el dispositivo (hoy-dialisis.mp3, manana-dialisis.mp3, descanso.mp3).

Reproducción automática al iniciar el día (tras las 06:00).

Compatible con Safari iOS 9 (sin Web Speech API).

7.2. Alternativa futura (SpeechSynthesis)

Si se ejecuta en un navegador moderno, usar window.speechSynthesis para leer el mensaje.

Configurable idioma y velocidad de voz (lang: es-ES, rate: 0.9).

8. ⚙️ Configuración
   8.1. Modo configuración (oculto por defecto)

Acceso: mantener pulsado 5 segundos el icono o zona inferior derecha.

Parámetros configurables:

Días de diálisis (checkbox L–D).

Hora habitual de ambulancia.

Hora de fin de diálisis.

Horario de modo noche.

Colores de cada estado.

Activar/desactivar animaciones.

Activar/desactivar voz.

Botón Guardar → persiste en localStorage.

8.2. Respaldo

Opción de Exportar configuración a JSON y Importar.
(Ideal para restaurar en otro dispositivo o hacer copia de seguridad.)

9. 📱 Interfaz de usuario (UI)
   9.1. Diseño general

Tipografía grande y sans-serif (por ejemplo, “Arial Rounded” o “Nunito”).

Fondo completo del color correspondiente al estado.

Textos centrados vertical y horizontalmente.

Sin scroll, sin botones visibles en modo kiosko.

9.2. Accesibilidad

Contraste mínimo 7:1.

Compatible con pantallas de 9,7" (resolución 1024x768).

Colores personalizables para adaptar a visión reducida.

10. 🧭 Flujo diario (ejemplo)
    Hora Día Pantalla
    22:30 Lunes "Es de noche. Mañana hay diálisis. Duerme tranquilo." (azul oscuro)
    06:00 Martes "HOY HAY DIÁLISIS. La ambulancia viene a las 6:30." (verde claro)
    09:00 Martes "HOY HAY DIÁLISIS. En diálisis hasta las 12:00." (verde claro)
    14:00 Martes "YA FUE A DIÁLISIS. Descansa, ya pasó." (verde apagado)
    22:00 Martes "Es de noche. Mañana no hay diálisis." (azul oscuro)
    06:00 Miércoles "HOY DESCANSO. No hay diálisis hoy." (azul claro)
11. 🔋 Consideraciones técnicas

Offline first: todo el contenido (HTML, CSS, JS, audios) debe funcionar sin conexión.

Persistencia local: localStorage o IndexedDB para configuración.

Compatibilidad mínima: Safari 9 / iOS 9.

Optimización:

Evitar animaciones CSS pesadas.

No usar librerías externas (jQuery, etc.).

Ejecución continua:

Pantalla siempre encendida (opcional: mediante configuración del sistema).

Auto-refresh diario para actualizar estado.

12. 🧩 Fase 2 (futuras mejoras)

Editor visual de configuración completo.

Modo cuidador remoto (enviar configuración vía QR o archivo).

Temas alternativos (modo alto contraste, letras extra grandes).

Soporte multilenguaje.

Integración con altavoces inteligentes (Google Home / Alexa).

Modo “resumen del día” (por ejemplo: “Hoy fue día de diálisis. Próxima el jueves.”).

13. ✅ Criterios de aceptación

El sistema muestra automáticamente el estado correcto cada día.

Cambia al modo noche entre las horas configuradas.

Los mensajes y colores corresponden correctamente a cada estado.

Persiste la configuración tras reiniciar.

Funciona offline en un navegador antiguo.

Opción de reproducción de audio local según día.

Entrar en modo configuración requiere gesto prolongado.

El diseño es legible desde 2 metros de distancia.
