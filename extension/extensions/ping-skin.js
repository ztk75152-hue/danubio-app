(function() {
  "use strict";
  if (window.__DerviPingSkin) return;
  window.__DerviPingSkin = true;
  if (typeof Injector === "undefined" || Injector.isMainFrame && Injector.isMainFrame()) return;
  var STORAGE_KEY = "Dervi_ping_cfg";
  var CHANGE_EVENT = "Dervi:ping";
  var STYLE_ID = "dervi-ping-style";
  var WRAP_ID = "dervi-ping-wrap";
  var state = {
    enabled: false,
    showLabel: true,
    showMs: true,
    colorByPing: true,
    color: "#707070",
    scale: 100,
    opacity: 100,
    bg: true,
    offsetX: 1628,
    offsetY: 0
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
    if (typeof parsed.showMs === "boolean") state.showMs = parsed.showMs;
    if (typeof parsed.colorByPing === "boolean") state.colorByPing = parsed.colorByPing;
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
  function autoColor(ping) {
    if (ping < 40) return "#07f361";
    if (ping < 80) return "#ffd166";
    return "#ff6b6b";
  }
  var wrapEl = null, numEl = null, labelEl = null;
  var lastPing = null;
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
    numEl.className = "dervi-ping-num";
    numEl.textContent = "—";
    labelEl = document.createElement("span");
    labelEl.className = "dervi-ping-label";
    labelEl.textContent = "PING";
    wrapEl.appendChild(numEl);
    wrapEl.appendChild(labelEl);
  }
  function buildCSS() {
    var op = clamp(state.opacity, 0, 100, 100) / 100;
    var sc = clamp(state.scale, 50, 180, 100) / 100;
    var color = state.colorByPing && lastPing !== null ? autoColor(lastPing) : state.color || "#ffffff";
    var glassBg = state.bg ? "background: #14151a !important; border-color: rgba(255,255,255,0.08) !important; box-shadow: 0 8px 24px rgba(0,0,0,.5) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; padding: 4px 10px !important;" : "background: rgba(0,0,0,0.35) !important; border-color: rgba(255,255,255,0.06) !important; box-shadow: 0 4px 16px rgba(0,0,0,.25) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important; padding: 4px 10px !important;";
    return [ "#" + WRAP_ID + " {", "  position: fixed !important;", "  left: 16px !important;", "  top: 42px !important;", "  right: auto !important; bottom: auto !important;", "  transform: translate(" + (state.offsetX || 0) + "px, " + (state.offsetY || 0) + "px) scale(" + sc + ") !important;", "  transform-origin: left top !important;", "  display: " + (state.enabled ? "inline-flex" : "none") + " !important;", "  align-items: baseline !important;", "  gap: 4px !important;", "  border-radius: 6px !important;", "  border: 1px solid transparent !important;", "  opacity: " + op + " !important;", "  z-index: 498000 !important;", "  pointer-events: none !important;", "  " + glassBg, "}", ".dervi-ping-num {", "  font-size: 15px !important; font-weight: 800 !important;", "  color: " + color + " !important;", "  line-height: 1 !important;", "  transition: color .15s ease !important;", "  font-variant-numeric: tabular-nums !important;", "}", ".dervi-ping-label {", "  display: " + (state.showLabel ? "inline" : "none") + " !important;", "  font-size: 10px !important; font-weight: 700 !important;", "  letter-spacing: .04em !important; text-transform: uppercase !important;", "  color: rgba(255,255,255,.5) !important;", "  line-height: 1 !important;", "}" ].join("\n");
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
    if (numEl) numEl.textContent = lastPing === null ? "—" : String(lastPing) + (state.showMs ? " ms" : "");
    var styleEl = document.getElementById(STYLE_ID);
    if (styleEl) styleEl.textContent = buildCSS();
  }
  function localPlayerId() {
    return window.__haxLocalPlayerId != null ? window.__haxLocalPlayerId : window._haxLocalPlayerId != null ? window._haxLocalPlayerId : window.__myLocalPlayerId != null ? window.__myLocalPlayerId : null;
  }
  function readNativePing() {
    var pid = localPlayerId();
    if (pid !== null) {
      var row = document.querySelector('.player-list-item[data-player-id="' + pid + '"] [data-hook="ping"]');
      if (row) {
        var mr = String(row.textContent || "").match(/(\d+)/);
        if (mr) return parseInt(mr[1], 10);
      }
    }
    var elPing = document.querySelector('.stats-view [data-hook="ping"]');
    if (elPing) {
      var m = String(elPing.textContent || "").match(/(\d+)/);
      if (m) return parseInt(m[1], 10);
    }
    var statsEl = document.querySelector(".stats-view");
    if (statsEl) {
      var m2 = String(statsEl.textContent || "").match(/Ping:\s*(\d+)/i);
      if (m2) return parseInt(m2[1], 10);
    }
    try {
      var net = window.__starNetStats;
      if (net && typeof net === "object" && typeof net.ping === "number") return net.ping;
    } catch (e) {}
    return null;
  }
  var pollId = null;
  var PING_REFRESH_MS = 500;
  try {
    if (localStorage.getItem("less_refresh") === "true") PING_REFRESH_MS = 1500;
  } catch (e) {}
  function tick() {
    var val = readNativePing();
    if (val !== lastPing) {
      lastPing = val;
      if (state.enabled) paintValue();
    }
  }
  function startLoop() {
    if (pollId) return;
    pollId = setInterval(tick, PING_REFRESH_MS);
    tick();
  }
  window.DerviPing = {
    setRefreshRate: function(ms) {
      PING_REFRESH_MS = ms > 0 ? ms : 500;
      try {
        localStorage.setItem("less_refresh", ms > 500 ? "true" : "false");
      } catch (e) {}
      if (pollId) {
        clearInterval(pollId);
        pollId = null;
        startLoop();
      }
    },
    getConfig: function() {
      return {
        enabled: state.enabled,
        showLabel: state.showLabel,
        showMs: state.showMs,
        colorByPing: state.colorByPing,
        color: state.color,
        scale: state.scale,
        opacity: state.opacity,
        bg: state.bg,
        offsetX: state.offsetX,
        offsetY: state.offsetY,
        currentPing: lastPing
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
    setShowMs: function(v) {
      state.showMs = !!v;
      notify();
    },
    setColorByPing: function(v) {
      state.colorByPing = !!v;
      notify();
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
  console.log("[Dervi] Ping configurable cargado (color, escala, posición, etiqueta — en vivo, sin recargar)");
})();