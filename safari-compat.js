// Safari iOS 9 Compatibility Layer
// Polyfills y mejoras de compatibilidad para Safari iOS 9

(function () {
  "use strict";

  // Polyfill para Object.assign (no disponible en iOS 9)
  if (typeof Object.assign !== "function") {
    Object.assign = function (target) {
      "use strict";
      if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  // Polyfill para Array.includes (no disponible en iOS 9)
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);
      var len = parseInt(o.length) || 0;
      if (len === 0) {
        return false;
      }

      var n = parseInt(fromIndex) || 0;
      var k = n >= 0 ? n : Math.max(len + n, 0);

      function sameValueZero(x, y) {
        return (
          x === y ||
          (typeof x === "number" &&
            typeof y === "number" &&
            isNaN(x) &&
            isNaN(y))
        );
      }

      for (; k < len; k++) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
      }
      return false;
    };
  }

  // Polyfill para String.startsWith (no disponible en iOS 9)
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }

  // Polyfill para String.endsWith (no disponible en iOS 9)
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, length) {
      if (length === undefined || length > this.length) {
        length = this.length;
      }
      return (
        this.substring(length - searchString.length, length) === searchString
      );
    };
  }

  // Mejoras para CSS Grid en Safari iOS 9
  if (window.CSS && window.CSS.supports) {
    if (!window.CSS.supports("display", "grid")) {
      // Fallback para navegadores sin soporte de Grid
      var style = document.createElement("style");
      style.textContent =
        ".days-selector {\n" +
        "  display: -webkit-flex;\n" +
        "  display: flex;\n" +
        "  -webkit-flex-wrap: wrap;\n" +
        "  flex-wrap: wrap;\n" +
        "}\n" +
        ".days-selector label {\n" +
        "  -webkit-flex: 1 1 120px;\n" +
        "  flex: 1 1 120px;\n" +
        "  min-width: 120px;\n" +
        "}\n" +
        ".color-config {\n" +
        "  display: -webkit-flex;\n" +
        "  display: flex;\n" +
        "  -webkit-flex-wrap: wrap;\n" +
        "  flex-wrap: wrap;\n" +
        "}\n" +
        ".color-config label {\n" +
        "  -webkit-flex: 1 1 200px;\n" +
        "  flex: 1 1 200px;\n" +
        "  min-width: 200px;\n" +
        "}\n";
      document.head.appendChild(style);
    }
  }

  // Mejoras para localStorage en Safari privado
  var localStorageAvailable = (function () {
    try {
      var test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  })();

  if (!localStorageAvailable) {
    // Fallback usando sessionStorage o memoria
    window.localStorage = {
      _data: {},
      setItem: function (key, value) {
        this._data[key] = value;
      },
      getItem: function (key) {
        return this._data[key] || null;
      },
      removeItem: function (key) {
        delete this._data[key];
      },
      clear: function () {
        this._data = {};
      },
    };
  }

  // Mejoras para eventos táctiles en Safari iOS 9
  if ("ontouchstart" in window) {
    // Prevenir zoom en doble toque
    var lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      function (event) {
        var now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false
    );

    // Prevenir scroll en elementos específicos
    document.addEventListener(
      "touchmove",
      function (event) {
        if (event.target.classList && event.target.classList.contains("no-scroll")) {
          event.preventDefault();
        }
      },
      false
    );
  }

  // Mejoras para viewport en Safari iOS 9
  var viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, orientation=portrait"
    );
  }

  // Mejoras para fullscreen en Safari iOS 9
  if (window.navigator.standalone === true) {
    // La app está en modo standalone (agregada a pantalla de inicio)
    document.body.classList.add("standalone");
  }

  // Prevenir selección de texto en modo kiosko
  document.addEventListener("selectstart", function (e) {
    e.preventDefault();
  });

  // Prevenir menú contextual
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  console.log("Safari iOS 9 compatibility layer loaded");
})();
