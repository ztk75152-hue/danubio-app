(function() {
  "use strict";
  if (window.__DerviClockSkin) return;
  window.__DerviClockSkin = true;
  if (typeof Injector === "undefined" || Injector.isMainFrame && Injector.isMainFrame()) return;
  var STORAGE_KEY = "Dervi_clock_cfg";
  var CHANGE_EVENT = "Dervi:clock";
  var STYLE_ID = "dervi-clock-style";
  var WRAP_ID = "dervi-clock-wrap";
  var state = {
    enabled: false,
    showLabel: false,
    showSeconds: true,
    hour12: false,
    color: "#ffffff",
    scale: 124,
    opacity: 100,
    bg: true,
    offsetX: -273,
    offsetY: 29
  };
  function loadState() {
    var raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    if (!raw) return;
    var parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!parsed) return;
    if (typeof parsed.enabled === "boolean") state.enabled = parsed.enabled;
    if (typeof parsed.showLabel === "boolean") state.showLabel = parsed.showLabel;
    if (typeof parsed.showSeconds === "boolean") state.showSeconds = parsed.showSeconds;
    if (typeof parsed.hour12 === "boolean") state.hour12 = parsed.hour12;
    if (typeof parsed.color === "string" && parsed.color) state.color = parsed.color;
    if (typeof parsed.scale === "number") state.scale = parsed.scale;
    if (typeof parsed.opacity === "number") state.opacity = parsed.opacity;
    if (typeof parsed.bg === "boolean") state.bg = parsed.bg;
    if (typeof parsed.offsetX === "number") state.offsetX = parsed.offsetX;
    if (typeof parsed.offsetY === "number") state.offsetY = parsed.offsetY;
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }
  function notify() {
    persist();
    apply();
    try {
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch (e) {}
  }
  function clamp(v, min, max, fallback) {
    v = parseFloat(v);
    if (isNaN(v)) return fallback;
    return Math.max(min, Math.min(max, v));
  }
  function formatTime(date) {
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var suffix = "";
    if (state.hour12) {
      suffix = h >= 12 ? " PM" : " AM";
      h = h % 12;
      if (h === 0) h = 12;
    }
    var text = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
    if (state.showSeconds) text += ":" + String(s).padStart(2, "0");
    return text + suffix;
  }
  var wrapEl = null, numEl = null, labelEl = null;
  function ensureDom() {
    if (wrapEl && document.body.contains(wrapEl)) return;
    wrapEl = document.getElementById(WRAP_ID);
    if (!wrapEl) {
      wrapEl = document.createElement("div");
      wrapEl.id = WRAP_ID;
      (document.body || document.documentElement).appendChild(wrapEl);
    } else {
      wrapEl.innerHTML = "";
    }
    numEl = document.createElement("span");
    numEl.className = "dervi-clock-num";
    numEl.textContent = formatTime(new Date);
    labelEl = document.createElement("span");
    labelEl.className = "dervi-clock-label";
    labelEl.textContent = "CLOCK";
    wrapEl.appendChild(numEl);
    wrapEl.appendChild(labelEl);
  }
  function buildCSS() {
    var op = clamp(state.opacity, 0, 100, 100) / 100;
    var sc = clamp(state.scale, 50, 180, 100) / 100;
    var color = state.color || "#ffffff";
    var glassBg = state.bg ? "background: #14151a !important; border-color: rgba(255,255,255,0.08) !important; box-shadow: 0 8px 24px rgba(0,0,0,.5) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; padding: 4px 10px !important;" : "background: rgba(0,0,0,0.35) !important; border-color: rgba(255,255,255,0.06) !important; box-shadow: 0 4px 16px rgba(0,0,0,.25) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important; padding: 4px 10px !important;";
    return [ "#" + WRAP_ID + " {", "  position: fixed !important;", "  right: 16px !important;", "  top: 16px !important;", "  left: auto !important; bottom: auto !important;", "  transform: translate(" + (state.offsetX || 0) + "px, " + (state.offsetY || 0) + "px) scale(" + sc + ") !important;", "  transform-origin: right top !important;", "  display: " + (state.enabled ? "inline-flex" : "none") + " !important;", "  align-items: baseline !important;", "  gap: 4px !important;", "  border-radius: 6px !important;", "  border: 1px solid transparent !important;", "  opacity: " + op + " !important;", "  z-index: 498000 !important;", "  pointer-events: none !important;", "  " + glassBg, "}", ".dervi-clock-num {", "  font-size: 15px !important; font-weight: 800 !important;", "  color: " + color + " !important;", "  line-height: 1 !important;", "  font-variant-numeric: tabular-nums !important;", "}", ".dervi-clock-label {", "  display: " + (state.showLabel ? "inline" : "none") + " !important;", "  font-size: 10px !important; font-weight: 700 !important;", "  letter-spacing: .04em !important; text-transform: uppercase !important;", "  color: rgba(255,255,255,.5) !important;", "  line-height: 1 !important;", "}" ].join("\n");
  }
  function apply() {
    ensureDom();
    var styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = buildCSS();
  }
  function paintValue() {
    if (numEl) numEl.textContent = formatTime(new Date);
  }
  var tickId = null;
  function startLoop() {
    if (tickId) return;
    tickId = setInterval(function() {
      if (state.enabled) paintValue();
    }, 1e3);
  }
  window.DerviClock = {
    getConfig: function() {
      return {
        enabled: state.enabled,
        showLabel: state.showLabel,
        showSeconds: state.showSeconds,
        hour12: state.hour12,
        color: state.color,
        scale: state.scale,
        opacity: state.opacity,
        bg: state.bg,
        offsetX: state.offsetX,
        offsetY: state.offsetY
      };
    },
    setEnabled: function(v) {
      state.enabled = !!v;
      notify();
    },
    setShowLabel: function(v) {
      state.showLabel = !!v;
      notify();
    },
    setShowSeconds: function(v) {
      state.showSeconds = !!v;
      notify();
      paintValue();
    },
    setHour12: function(v) {
      state.hour12 = !!v;
      notify();
      paintValue();
    },
    setColor: function(v) {
      if (typeof v === "string" && v) {
        state.color = v;
        notify();
      }
    },
    setScale: function(v) {
      state.scale = clamp(v, 50, 180, state.scale);
      notify();
    },
    setOpacity: function(v) {
      state.opacity = clamp(v, 20, 100, state.opacity);
      notify();
    },
    setBg: function(v) {
      state.bg = !!v;
      notify();
    },
    setOffsetX: function(v) {
      state.offsetX = clamp(v, -2e3, 2e3, state.offsetX);
      notify();
    },
    setOffsetY: function(v) {
      state.offsetY = clamp(v, -2e3, 2e3, state.offsetY);
      notify();
    },
    resetPosition: function() {
      state.offsetX = 0;
      state.offsetY = 0;
      notify();
    }
  };
  loadState();
  apply();
  startLoop();
  window.addEventListener("storage", function(e) {
    if (!e || e.key === null || e.key === STORAGE_KEY) {
      loadState();
      apply();
    }
  });
  console.log("[Dervi] Clock configurable cargado (formato, color, escala, posición — en vivo, sin recargar)");
})();