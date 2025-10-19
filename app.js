// Dialysis Clock - OpenCareClock v2 (ES5 compatible)
// Aplicación para reducir ansiedad en pacientes de diálisis

function DialysisClock() {
  this.config = this.loadConfig();
  this.isNightMode = false;
  this.configTriggerPressed = false;
  this.configTriggerTimeout = null;
  this.clockTimeout = null;

  this.initializeElements();
  this.setupEventListeners();
  this.updateDisplay();
  this.startClock();
}

DialysisClock.prototype.initializeElements = function () {
  this.mainScreen = document.getElementById("main-screen");
  this.configScreen = document.getElementById("config-screen");
  this.statusIcon = document.getElementById("status-icon");
  this.mainMessage = document.getElementById("main-message");
  this.subMessage = document.getElementById("sub-message");
  this.dayDisplay = document.getElementById("day-display");
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
  this.showDay = document.getElementById("show-day");
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
  this.messageNightTomorrow = document.getElementById("message-night-tomorrow");
  this.messageNightRest = document.getElementById("message-night-rest");

  this.saveConfigBtn = document.getElementById("save-config");
  this.exportConfigBtn = document.getElementById("export-config");
  this.importConfigBtn = document.getElementById("import-config");
  this.closeConfigBtn = document.getElementById("close-config");
  this.importFile = document.getElementById("import-file");
};

DialysisClock.prototype.setupEventListeners = function () {
  var self = this;
  // Trigger de configuración (pulsación prolongada)
  this.configTrigger.addEventListener("mousedown", function () {
    self.startConfigTrigger();
  });
  this.configTrigger.addEventListener("mouseup", function () {
    self.cancelConfigTrigger();
  });
  this.configTrigger.addEventListener("mouseleave", function () {
    self.cancelConfigTrigger();
  });

  // Touch events para dispositivos móviles
  this.configTrigger.addEventListener("touchstart", function (e) {
    if (e && e.preventDefault) e.preventDefault();
    self.startConfigTrigger();
  });
  this.configTrigger.addEventListener("touchend", function (e) {
    if (e && e.preventDefault) e.preventDefault();
    self.cancelConfigTrigger();
  });

  // Botones de configuración
  this.saveConfigBtn.addEventListener("click", function () {
    self.saveConfiguration();
  });
  this.exportConfigBtn.addEventListener("click", function () {
    self.exportConfiguration();
  });
  this.importConfigBtn.addEventListener("click", function () {
    self.importFile.click();
  });
  this.closeConfigBtn.addEventListener("click", function () {
    self.closeConfiguration();
  });
  this.importFile.addEventListener("change", function (e) {
    self.handleImportFile(e);
  });

  // Prevenir zoom en dispositivos móviles
  document.addEventListener("gesturestart", function (e) {
    if (e && e.preventDefault) e.preventDefault();
  });
  document.addEventListener("gesturechange", function (e) {
    if (e && e.preventDefault) e.preventDefault();
  });
  document.addEventListener("gestureend", function (e) {
    if (e && e.preventDefault) e.preventDefault();
  });
};

DialysisClock.prototype.startConfigTrigger = function () {
  var self = this;
  this.configTriggerPressed = true;
  this.configTriggerTimeout = setTimeout(function () {
    if (self.configTriggerPressed) {
      self.openConfiguration();
    }
  }, 5000); // 5 segundos
};

DialysisClock.prototype.cancelConfigTrigger = function () {
  this.configTriggerPressed = false;
  if (this.configTriggerTimeout) {
    clearTimeout(this.configTriggerTimeout);
    this.configTriggerTimeout = null;
  }
};

DialysisClock.prototype.loadConfig = function () {
  var defaultConfig = {
    dialysisDays: [2, 4, 6], // Martes, Jueves, Sábado
    ambulanceTime: "06:30",
    dialysisEndTime: "12:00",
    nightStart: "21:30",
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
      nightTomorrow: "Mañana hay diálisis. Duerme tranquilo, aún falta mucho.",
      nightRest: "No hay diálisis mañana. Duerme tranquilo.",
    },
    showDay: true,
    showTime: true,
    enableAnimations: true,
    enableAudio: false,
  };

  try {
    var saved = localStorage.getItem("dialysisClockConfig");
    if (saved) {
      var parsed = JSON.parse(saved);
      return this.mergeConfigs(defaultConfig, parsed);
    }
  } catch (e) {
    console.warn("Error cargando configuración:", e);
  }

  return this.cloneValue(defaultConfig);
};

DialysisClock.prototype.saveConfig = function () {
  try {
    localStorage.setItem("dialysisClockConfig", JSON.stringify(this.config));
  } catch (e) {
    console.warn("Error guardando configuración:", e);
  }
};

DialysisClock.prototype.getCurrentState = function () {
  var now = new Date();
  var currentDay = now.getDay();
  var currentTime = now.getHours() * 100 + now.getMinutes();

  // Verificar si estamos en modo noche
  var nightStart = this.parseTime(this.config.nightStart);
  var nightEnd = this.parseTime(this.config.nightEnd);
  var hasDialysisToday = this.hasDialysisDay(currentDay);
  var ambulanceTime = NaN;
  var dialysisEndTime = NaN;

  if (hasDialysisToday) {
    ambulanceTime = this.parseTime(this.config.ambulanceTime);
    dialysisEndTime = this.parseTime(this.config.dialysisEndTime);
  }

  this.isNightMode = this.isInNightMode(currentTime, nightStart, nightEnd);
  var ambulanceHasPriority =
    hasDialysisToday &&
    !isNaN(ambulanceTime) &&
    currentTime >= ambulanceTime;

  if (this.isNightMode && !ambulanceHasPriority) {
    var tomorrowN = new Date(now);
    tomorrowN.setDate(tomorrowN.getDate() + 1);
    var tomorrowDayN = tomorrowN.getDay();

    if (this.hasDialysisDay(tomorrowDayN)) {
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
  if (hasDialysisToday) {
    var timeUntilAmbulance = ambulanceTime - currentTime;
    var timeAfterDialysis = currentTime - dialysisEndTime;

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
      var subMessage = this.processMessage(this.config.messages.todaySub, {
        hora: this.config.ambulanceTime,
      });

      if (timeUntilAmbulance <= 15) {
        subMessage =
          "¡La ambulancia viene pronto! (" + this.config.ambulanceTime + ")";
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
    var subMessage2 = this.processMessage("En diálisis hasta las {horaFin}.", {
      horaFin: this.config.dialysisEndTime,
    });

    return {
      type: "today",
      message: this.config.messages.today,
      subMessage: subMessage2,
      color: this.config.colors.today,
      animate: false,
    };
  }

  // Verificar si mañana es día de diálisis
  var tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var tomorrowDay = tomorrow.getDay();

  if (this.hasDialysisDay(tomorrowDay)) {
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
};

DialysisClock.prototype.isInNightMode = function (
  currentTime,
  nightStart,
  nightEnd
) {
  if (nightStart <= nightEnd) {
    // Modo noche en el mismo día (ej: 22:00 - 06:00)
    return currentTime >= nightStart || currentTime < nightEnd;
  } else {
    // Modo noche cruza medianoche (ej: 22:00 - 06:00)
    return currentTime >= nightStart || currentTime < nightEnd;
  }
};

DialysisClock.prototype.parseTime = function (timeString) {
  var parts = timeString.split(":");
  var hours = Number(parts[0]);
  var minutes = Number(parts[1]);
  return hours * 100 + minutes;
};

DialysisClock.prototype.processMessage = function (message, variables) {
  var processedMessage = message;
  variables = variables || {};

  // Reemplazar variables
  for (var key in variables) {
    if (variables.hasOwnProperty(key)) {
      var placeholder = "{" + key + "}";
      processedMessage = processedMessage.replace(
        new RegExp(placeholder, "g"),
        variables[key]
      );
    }
  }

  return processedMessage;
};

DialysisClock.prototype.formatDay = function (date) {
  var days = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  var dayName = days[date.getDay()] || "";
  var capitalizedDay =
    dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
  return capitalizedDay;
};

DialysisClock.prototype.formatTime = function (date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var hoursText = hours < 10 ? "0" + hours : "" + hours;
  var minutesText = minutes < 10 ? "0" + minutes : "" + minutes;
  return hoursText + ":" + minutesText;
};

DialysisClock.prototype.updateDisplay = function () {
  var state = this.getCurrentState();

  // Actualizar mensajes
  this.mainMessage.textContent = state.message;
  this.subMessage.textContent = state.subMessage || "";

  // Actualizar icono de estado
  var iconMap = {
    today: "icons/ambulance.png",
    completed: "icons/completed.png",
    tomorrow: "icons/calendar.png",
    rest: "icons/rest.png",
    "night-tomorrow": "icons/sleep.png",
    "night-rest": "icons/sleep.png",
  };
  var icon = iconMap[state.type] || "";
  if (this.statusIcon) {
    if (icon) {
      this.statusIcon.innerHTML =
        '<img src="' + icon + '" alt="' + state.type + '">';
    } else {
      this.statusIcon.innerHTML = "";
    }
  }

  // Actualizar colores
  var stateClass = state.type;
  if (stateClass === "night-tomorrow" || stateClass === "night-rest") {
    stateClass = "night";
  }
  this.mainScreen.className = "main-screen state-" + stateClass;
  this.mainScreen.style.backgroundColor = state.color;

  // Aplicar animación si es necesario
  if (state.animate && this.config.enableAnimations) {
    this.mainScreen.classList.add("animating");
  } else {
    this.mainScreen.classList.remove("animating");
  }

  var now = null;

  if (this.dayDisplay) {
    if (this.config.showDay) {
      now = now || new Date();
      this.dayDisplay.textContent = this.formatDay(now);
      this.dayDisplay.style.display = "block";
    } else {
      this.dayDisplay.style.display = "none";
    }
  }

  if (this.timeDisplay) {
    if (this.config.showTime) {
      now = now || new Date();
      this.timeDisplay.textContent = this.formatTime(now);
      this.timeDisplay.style.display = "block";
    } else {
      this.timeDisplay.style.display = "none";
    }
  }

  // Reproducir audio si está habilitado
  if (
    this.config.enableAudio &&
    state.type !== "night-tomorrow" &&
    state.type !== "night-rest"
  ) {
    this.playAudio(state.type);
  }
};

DialysisClock.prototype.playAudio = function (type) {
  var audioFiles = {
    today: "audio/today-dialysis.mp3",
    completed: "audio/dialysis-completed.mp3",
    tomorrow: "audio/tomorrow-dialysis.mp3",
    rest: "audio/rest-day.mp3",
  };

  if (audioFiles[type]) {
    var audio = new Audio(audioFiles[type]);
    audio.volume = 0.7;
    var p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(function (e) {
        console.warn("No se pudo reproducir audio:", e);
      });
    }
  }
};

DialysisClock.prototype.openConfiguration = function () {
  this.loadConfigurationToForm();
  this.configScreen.classList.remove("hidden");
  this.cancelConfigTrigger();
};

DialysisClock.prototype.closeConfiguration = function () {
  this.configScreen.classList.add("hidden");
};

DialysisClock.prototype.loadConfigurationToForm = function () {
  for (var day in this.dayCheckboxes) {
    if (this.dayCheckboxes.hasOwnProperty(day)) {
      var dayNumber = this.getDayNumber(day);
      this.dayCheckboxes[day].checked = this.hasDialysisDay(dayNumber);
    }
  }

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
  this.showDay.checked = this.config.showDay;
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
};

DialysisClock.prototype.getDayNumber = function (dayName) {
  var dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return dayMap[dayName];
};

DialysisClock.prototype.saveConfiguration = function () {
  this.config.dialysisDays = [];
  for (var day in this.dayCheckboxes) {
    if (
      this.dayCheckboxes.hasOwnProperty(day) &&
      this.dayCheckboxes[day].checked
    ) {
      this.config.dialysisDays.push(this.getDayNumber(day));
    }
  }

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
  this.config.showDay = this.showDay.checked;
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

  alert("Configuración guardada correctamente.");
};

DialysisClock.prototype.exportConfiguration = function () {
  var configData = JSON.stringify(this.config, null, 2);
  var blob = new Blob([configData], { type: "application/json" });
  var url = URL.createObjectURL(blob);

  var a = document.createElement("a");
  a.href = url;
  a.download = "dialysis-clock-config.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

DialysisClock.prototype.handleImportFile = function (event) {
  var file = event.target.files[0];
  if (!file) return;

  var self = this;
  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var importedConfig = JSON.parse(e.target.result);
      self.config = self.mergeConfigs(self.config, importedConfig);
      self.saveConfig();
      self.updateDisplay();
      alert("Configuración importada correctamente.");
    } catch (error) {
      alert(
        "Error al importar la configuración. Verifique que el archivo sea válido."
      );
    }
  };
  reader.readAsText(file);
};

DialysisClock.prototype.hasDialysisDay = function (day) {
  if (!this.config || !this.config.dialysisDays) {
    return false;
  }

  var targetDay = parseInt(day, 10);
  if (isNaN(targetDay)) {
    return false;
  }

  for (var i = 0; i < this.config.dialysisDays.length; i++) {
    if (parseInt(this.config.dialysisDays[i], 10) === targetDay) {
      return true;
    }
  }

  return false;
};

DialysisClock.prototype.cloneValue = function (value) {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Object.prototype.toString.call(value) === "[object Array]") {
    var arr = [];
    for (var i = 0; i < value.length; i++) {
      arr[i] = this.cloneValue(value[i]);
    }
    return arr;
  }

  var clone = {};
  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      clone[key] = this.cloneValue(value[key]);
    }
  }
  return clone;
};

DialysisClock.prototype.mergeConfigs = function (base, overrides) {
  var result = this.cloneValue(base);

  if (!overrides || typeof overrides !== "object") {
    return result;
  }

  for (var key in overrides) {
    if (!overrides.hasOwnProperty(key)) {
      continue;
    }

    var overrideValue = overrides[key];
    if (
      overrideValue &&
      typeof overrideValue === "object" &&
      Object.prototype.toString.call(overrideValue) !== "[object Array]"
    ) {
      result[key] = this.mergeConfigs(result[key] || {}, overrideValue);
    } else {
      result[key] = this.cloneValue(overrideValue);
    }
  }

  return result;
};

DialysisClock.prototype.startClock = function () {
  var self = this;

  if (this.clockTimeout) {
    clearTimeout(this.clockTimeout);
    this.clockTimeout = null;
  }

  var scheduleNext = function () {
    var now = new Date();
    var delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    if (delay <= 0 || delay > 60000) {
      delay = 60000;
    }

    self.clockTimeout = setTimeout(function () {
      self.updateDisplay();
      scheduleNext();
    }, delay);
  };

  scheduleNext();
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  new DialysisClock();
});

// Prevenir acciones del navegador que puedan interferir
window.addEventListener("beforeunload", function (e) {
  if (e && e.preventDefault) e.preventDefault();
  e.returnValue = "";
});

// Prevenir zoom con doble toque
var lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (e) {
    var now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      if (e && e.preventDefault) e.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);
