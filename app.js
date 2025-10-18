// Dialysis Clock - OpenCareClock v2
// Aplicación para reducir ansiedad en pacientes de diálisis

class DialysisClock {
  constructor() {
    this.config = this.loadConfig();
    this.isNightMode = false;
    this.configTriggerPressed = false;
    this.configTriggerTimeout = null;

    this.initializeElements();
    this.setupEventListeners();
    this.startClock();
    this.updateDisplay();

    // Actualizar cada minuto
    setInterval(() => {
      this.updateDisplay();
    }, 60000);
  }

  initializeElements() {
    this.mainScreen = document.getElementById("main-screen");
    this.configScreen = document.getElementById("config-screen");
    this.statusIcon = document.getElementById("status-icon");
    this.mainMessage = document.getElementById("main-message");
    this.subMessage = document.getElementById("sub-message");
    this.timeDisplay = document.getElementById("time-display");
    this.configTrigger = document.getElementById("config-trigger");

    // Elementos de configuración
    this.dayCheckboxes = {
      monday: document.getElementById("day-monday"),
      tuesday: document.getElementById("day-tuesday"),
      wednesday: document.getElementById("day-wednesday"),
      thursday: document.getElementById("day-thursday"),
      friday: document.getElementById("day-friday"),
      saturday: document.getElementById("day-saturday"),
      sunday: document.getElementById("day-sunday"),
    };

    this.ambulanceTime = document.getElementById("ambulance-time");
    this.dialysisEndTime = document.getElementById("dialysis-end-time");
    this.nightStart = document.getElementById("night-start");
    this.nightEnd = document.getElementById("night-end");
    this.colorToday = document.getElementById("color-today");
    this.colorCompleted = document.getElementById("color-completed");
    this.colorTomorrow = document.getElementById("color-tomorrow");
    this.colorRest = document.getElementById("color-rest");
    this.colorNight = document.getElementById("color-night");
    this.showTime = document.getElementById("show-time");
    this.enableAnimations = document.getElementById("enable-animations");
    this.enableAudio = document.getElementById("enable-audio");

    // Elementos de mensajes configurables
    this.messageToday = document.getElementById("message-today");
    this.submessageToday = document.getElementById("submessage-today");
    this.messageCompleted = document.getElementById("message-completed");
    this.submessageCompleted = document.getElementById("submessage-completed");
    this.messageTomorrow = document.getElementById("message-tomorrow");
    this.submessageTomorrow = document.getElementById("submessage-tomorrow");
    this.messageRest = document.getElementById("message-rest");
    this.submessageRest = document.getElementById("submessage-rest");
    this.messageNightTomorrow = document.getElementById(
      "message-night-tomorrow"
    );
    this.messageNightRest = document.getElementById("message-night-rest");

    this.saveConfigBtn = document.getElementById("save-config");
    this.exportConfigBtn = document.getElementById("export-config");
    this.importConfigBtn = document.getElementById("import-config");
    this.closeConfigBtn = document.getElementById("close-config");
    this.importFile = document.getElementById("import-file");
  }

  setupEventListeners() {
    // Trigger de configuración (pulsación prolongada)
    this.configTrigger.addEventListener("mousedown", () =>
      this.startConfigTrigger()
    );
    this.configTrigger.addEventListener("mouseup", () =>
      this.cancelConfigTrigger()
    );
    this.configTrigger.addEventListener("mouseleave", () =>
      this.cancelConfigTrigger()
    );

    // Touch events para dispositivos móviles
    this.configTrigger.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.startConfigTrigger();
    });
    this.configTrigger.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.cancelConfigTrigger();
    });

    // Botones de configuración
    this.saveConfigBtn.addEventListener("click", () =>
      this.saveConfiguration()
    );
    this.exportConfigBtn.addEventListener("click", () =>
      this.exportConfiguration()
    );
    this.importConfigBtn.addEventListener("click", () =>
      this.importFile.click()
    );
    this.closeConfigBtn.addEventListener("click", () =>
      this.closeConfiguration()
    );
    this.importFile.addEventListener("change", (e) => this.handleImportFile(e));

    // Prevenir zoom en dispositivos móviles
    document.addEventListener("gesturestart", (e) => e.preventDefault());
    document.addEventListener("gesturechange", (e) => e.preventDefault());
    document.addEventListener("gestureend", (e) => e.preventDefault());
  }

  startConfigTrigger() {
    this.configTriggerPressed = true;
    this.configTriggerTimeout = setTimeout(() => {
      if (this.configTriggerPressed) {
        this.openConfiguration();
      }
    }, 5000); // 5 segundos
  }

  cancelConfigTrigger() {
    this.configTriggerPressed = false;
    if (this.configTriggerTimeout) {
      clearTimeout(this.configTriggerTimeout);
      this.configTriggerTimeout = null;
    }
  }

  loadConfig() {
    const defaultConfig = {
      dialysisDays: [2, 4, 6], // Martes, Jueves, Sábado
      ambulanceTime: "06:30",
      dialysisEndTime: "12:00",
      nightStart: "22:00",
      nightEnd: "06:00",
      colors: {
        today: "#66BB6A",
        completed: "#388E3C",
        tomorrow: "#FFB74D",
        rest: "#42A5F5",
        night: "#5E35B1",
      },
      messages: {
        today: "HOY HAY DIÁLISIS",
        todaySub: "La ambulancia viene a las {hora}.",
        completed: "YA HAS IDO A DIÁLISIS",
        completedSub: "Descansa tranquilo, ya ha pasado.",
        tomorrow: "MAÑANA HAY DIÁLISIS",
        tomorrowSub: "Descansa tranquilo, mañana te recogerá la ambulancia.",
        rest: "HOY DESCANSO",
        restSub: "No hay diálisis hoy ni mañana. Descansa tranquilo.",
        nightTomorrow:
          "Mañana hay diálisis. Duerme tranquilo, aún falta mucho.",
        nightRest: "No hay diálisis mañana. Duerme tranquilo.",
      },
      showTime: true,
      enableAnimations: true,
      enableAudio: false,
    };

    try {
      const saved = localStorage.getItem("dialysisClockConfig");
      if (saved) {
        return { ...defaultConfig, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Error cargando configuración:", e);
    }

    return defaultConfig;
  }

  saveConfig() {
    try {
      localStorage.setItem("dialysisClockConfig", JSON.stringify(this.config));
    } catch (e) {
      console.warn("Error guardando configuración:", e);
    }
  }

  getCurrentState() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    // Verificar si estamos en modo noche
    const nightStart = this.parseTime(this.config.nightStart);
    const nightEnd = this.parseTime(this.config.nightEnd);

    this.isNightMode = this.isInNightMode(currentTime, nightStart, nightEnd);

    if (this.isNightMode) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = tomorrow.getDay();

      if (this.config.dialysisDays.includes(tomorrowDay)) {
        return {
          type: "night-tomorrow",
          message: this.config.messages.nightTomorrow,
          color: this.config.colors.night,
        };
      } else {
        return {
          type: "night-rest",
          message: this.config.messages.nightRest,
          color: this.config.colors.night,
        };
      }
    }

    // Verificar si hoy es día de diálisis
    if (this.config.dialysisDays.includes(currentDay)) {
      const ambulanceTime = this.parseTime(this.config.ambulanceTime);
      const dialysisEndTime = this.parseTime(this.config.dialysisEndTime);
      const timeUntilAmbulance = ambulanceTime - currentTime;
      const timeAfterDialysis = currentTime - dialysisEndTime;

      // Si ya pasó la hora de fin de diálisis, mostrar estado completada
      if (timeAfterDialysis >= 0) {
        return {
          type: "completed",
          message: this.config.messages.completed,
          subMessage: this.config.messages.completedSub,
          color: this.config.colors.completed,
        };
      }

      // Si aún no es hora de ambulancia, mostrar preparación
      if (timeUntilAmbulance > 0) {
        let subMessage = this.processMessage(this.config.messages.todaySub, {
          hora: this.config.ambulanceTime,
        });

        if (timeUntilAmbulance <= 15) {
          subMessage = `¡La ambulancia viene pronto! (${this.config.ambulanceTime})`;
        }

        return {
          type: "today",
          message: this.config.messages.today,
          subMessage: subMessage,
          color: this.config.colors.today,
          animate: timeUntilAmbulance <= 15,
        };
      }

      // Si es hora de ambulancia o durante la diálisis
      const subMessage = this.processMessage(
        "En diálisis hasta las {horaFin}.",
        {
          horaFin: this.config.dialysisEndTime,
        }
      );

      return {
        type: "today",
        message: this.config.messages.today,
        subMessage: subMessage,
        color: this.config.colors.today,
        animate: false,
      };
    }

    // Verificar si mañana es día de diálisis
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDay();

    if (this.config.dialysisDays.includes(tomorrowDay)) {
      return {
        type: "tomorrow",
        message: this.config.messages.tomorrow,
        subMessage: this.config.messages.tomorrowSub,
        color: this.config.colors.tomorrow,
      };
    }

    // Día de descanso
    return {
      type: "rest",
      message: this.config.messages.rest,
      subMessage: this.config.messages.restSub,
      color: this.config.colors.rest,
    };
  }

  isInNightMode(currentTime, nightStart, nightEnd) {
    if (nightStart <= nightEnd) {
      // Modo noche en el mismo día (ej: 22:00 - 06:00)
      return currentTime >= nightStart || currentTime < nightEnd;
    } else {
      // Modo noche cruza medianoche (ej: 22:00 - 06:00)
      return currentTime >= nightStart || currentTime < nightEnd;
    }
  }

  parseTime(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 100 + minutes;
  }

  processMessage(message, variables = {}) {
    let processedMessage = message;

    // Reemplazar variables
    Object.keys(variables).forEach((key) => {
      const placeholder = `{${key}}`;
      processedMessage = processedMessage.replace(
        new RegExp(placeholder, "g"),
        variables[key]
      );
    });

    return processedMessage;
  }

  updateDisplay() {
    const state = this.getCurrentState();

    // Actualizar mensajes
    this.mainMessage.textContent = state.message;
    this.subMessage.textContent = state.subMessage || "";

    // Actualizar icono de estado (solo 3 casos: hoy, completado, noche)
    const iconMap = {
      today: "🚑",
      completed: "✅",
      tomorrow: "📅",
      rest: "🌤️",
      "night-tomorrow": "🌙",
      "night-rest": "🌙",
    };
    const icon = iconMap[state.type] || "";
    if (this.statusIcon) {
      if (icon) {
        this.statusIcon.textContent = icon;
        this.statusIcon.style.display = "block";
      } else {
        this.statusIcon.textContent = "";
        this.statusIcon.style.display = "none";
      }
    }

    // Actualizar colores
    this.mainScreen.className = `main-screen state-${state.type}`;
    this.mainScreen.style.backgroundColor = state.color;

    // Aplicar animación si es necesario
    if (state.animate && this.config.enableAnimations) {
      this.mainScreen.classList.add("animating");
    } else {
      this.mainScreen.classList.remove("animating");
    }

    // Actualizar hora
    if (this.config.showTime) {
      const now = new Date();
      this.timeDisplay.textContent = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
      this.timeDisplay.style.display = "block";
    } else {
      this.timeDisplay.style.display = "none";
    }

    // Reproducir audio si está habilitado
    if (
      this.config.enableAudio &&
      state.type !== "night-tomorrow" &&
      state.type !== "night-rest"
    ) {
      this.playAudio(state.type);
    }
  }

  playAudio(type) {
    // Implementación básica de audio (requiere archivos MP3)
    const audioFiles = {
      today: "audio/today-dialysis.mp3",
      completed: "audio/dialysis-completed.mp3",
      tomorrow: "audio/tomorrow-dialysis.mp3",
      rest: "audio/rest-day.mp3",
    };

    if (audioFiles[type]) {
      const audio = new Audio(audioFiles[type]);
      audio.volume = 0.7;
      audio
        .play()
        .catch((e) => console.warn("No se pudo reproducir audio:", e));
    }
  }

  openConfiguration() {
    this.loadConfigurationToForm();
    this.configScreen.classList.remove("hidden");
    this.cancelConfigTrigger();
  }

  closeConfiguration() {
    this.configScreen.classList.add("hidden");
  }

  loadConfigurationToForm() {
    // Cargar días de diálisis
    Object.keys(this.dayCheckboxes).forEach((day) => {
      const dayNumber = this.getDayNumber(day);
      this.dayCheckboxes[day].checked =
        this.config.dialysisDays.includes(dayNumber);
    });

    // Cargar otros valores
    this.ambulanceTime.value = this.config.ambulanceTime;
    this.dialysisEndTime.value = this.config.dialysisEndTime;
    this.nightStart.value = this.config.nightStart;
    this.nightEnd.value = this.config.nightEnd;
    this.colorToday.value = this.config.colors.today;
    this.colorCompleted.value = this.config.colors.completed;
    this.colorTomorrow.value = this.config.colors.tomorrow;
    this.colorRest.value = this.config.colors.rest;
    this.colorNight.value = this.config.colors.night;
    this.showTime.checked = this.config.showTime;
    this.enableAnimations.checked = this.config.enableAnimations;
    this.enableAudio.checked = this.config.enableAudio;

    // Cargar mensajes configurables
    this.messageToday.value = this.config.messages.today;
    this.submessageToday.value = this.config.messages.todaySub;
    this.messageCompleted.value = this.config.messages.completed;
    this.submessageCompleted.value = this.config.messages.completedSub;
    this.messageTomorrow.value = this.config.messages.tomorrow;
    this.submessageTomorrow.value = this.config.messages.tomorrowSub;
    this.messageRest.value = this.config.messages.rest;
    this.submessageRest.value = this.config.messages.restSub;
    this.messageNightTomorrow.value = this.config.messages.nightTomorrow;
    this.messageNightRest.value = this.config.messages.nightRest;
  }

  getDayNumber(dayName) {
    const dayMap = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    return dayMap[dayName];
  }

  saveConfiguration() {
    // Recopilar días de diálisis
    this.config.dialysisDays = [];
    Object.keys(this.dayCheckboxes).forEach((day) => {
      if (this.dayCheckboxes[day].checked) {
        this.config.dialysisDays.push(this.getDayNumber(day));
      }
    });

    // Recopilar otros valores
    this.config.ambulanceTime = this.ambulanceTime.value;
    this.config.dialysisEndTime = this.dialysisEndTime.value;
    this.config.nightStart = this.nightStart.value;
    this.config.nightEnd = this.nightEnd.value;
    this.config.colors.today = this.colorToday.value;
    this.config.colors.completed = this.colorCompleted.value;
    this.config.colors.tomorrow = this.colorTomorrow.value;
    this.config.colors.rest = this.colorRest.value;
    this.config.colors.night = this.colorNight.value;
    this.config.showTime = this.showTime.checked;
    this.config.enableAnimations = this.enableAnimations.checked;
    this.config.enableAudio = this.enableAudio.checked;

    // Guardar mensajes configurables
    this.config.messages.today =
      this.messageToday.value.trim() || "HOY HAY DIÁLISIS";
    this.config.messages.todaySub =
      this.submessageToday.value.trim() || "La ambulancia viene a las {hora}.";
    this.config.messages.completed =
      this.messageCompleted.value.trim() || "YA FUE A DIÁLISIS";
    this.config.messages.completedSub =
      this.submessageCompleted.value.trim() || "Descansa, ya pasó.";
    this.config.messages.tomorrow =
      this.messageTomorrow.value.trim() || "MAÑANA HAY DIÁLISIS";
    this.config.messages.tomorrowSub =
      this.submessageTomorrow.value.trim() || "Prepárate esta noche.";
    this.config.messages.rest = this.messageRest.value.trim() || "HOY DESCANSO";
    this.config.messages.restSub =
      this.submessageRest.value.trim() || "No hay diálisis hoy.";
    this.config.messages.nightTomorrow =
      this.messageNightTomorrow.value.trim() ||
      "Es de noche. Mañana hay diálisis. Duerme tranquilo.";
    this.config.messages.nightRest =
      this.messageNightRest.value.trim() ||
      "Es de noche. Mañana no hay diálisis. Descansa.";

    this.saveConfig();
    this.updateDisplay();
    this.closeConfiguration();

    // Mostrar confirmación
    alert("Configuración guardada correctamente.");
  }

  exportConfiguration() {
    const configData = JSON.stringify(this.config, null, 2);
    const blob = new Blob([configData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "dialysis-clock-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target.result);
        this.config = { ...this.config, ...importedConfig };
        this.saveConfig();
        this.updateDisplay();
        alert("Configuración importada correctamente.");
      } catch (error) {
        alert(
          "Error al importar la configuración. Verifique que el archivo sea válido."
        );
      }
    };
    reader.readAsText(file);
  }

  startClock() {
    // Actualizar inmediatamente
    this.updateDisplay();
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new DialysisClock();
});

// Prevenir acciones del navegador que puedan interferir
window.addEventListener("beforeunload", (e) => {
  // No mostrar mensaje de confirmación en modo kiosko
  e.preventDefault();
  e.returnValue = "";
});

// Prevenir zoom con doble toque
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (e) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);
