(function() {
  "use strict";
  if (window.__DerviFpsSkin) return;
  window.__DerviFpsSkin = true;
  if (typeof Injector === "undefined" || Injector.isMainFrame && Injector.isMainFrame()) return;
  var STORAGE_KEY = "Dervi_fps_cfg";
  var CHANGE_EVENT = "Dervi:fps";
  var STYLE_ID = "dervi-fps-style";
  var WRAP_ID = "dervi-fps-wrap";
  var state = {
    enabled: false,
    showLabel: true,
    colorByFps: false,
    color: "#ffffff",
    scale: 100,
    opacity: 100,
    bg: false,
    offsetX: 0,
    offsetY: 0,
    fpsBoost: 0
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
    if (typeof parsed.colorByFps === "boolean") state.colorByFps = parsed.colorByFps;
    if (typeof parsed.color === "string" && parsed.color) state.color = parsed.color;
    if (typeof parsed.scale === "number") state.scale = parsed.scale;
    if (typeof parsed.opacity === "number") state.opacity = parsed.opacity;
    if (typeof parsed.bg === "boolean") state.bg = parsed.bg;
    if (typeof parsed.offsetX === "number") state.offsetX = parsed.offsetX;
    if (typeof parsed.offsetY === "number") state.offsetY = parsed.offsetY;
    if (typeof parsed.fpsBoost === "number") state.fpsBoost = parsed.fpsBoost;
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
  function autoColor(fps) {
    if (fps >= 50) return "#07f361";
    if (fps >= 30) return "#ffd166";
    return "#ff6b6b";
  }
  var wrapEl = null, numEl = null, labelEl = null;
  var lastFps = 0;
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
    numEl.className = "dervi-fps-num";
    numEl.textContent = "0";
    labelEl = document.createElement("span");
    labelEl.className = "dervi-fps-label";
    labelEl.textContent = "FPS";
    wrapEl.appendChild(numEl);
    wrapEl.appendChild(labelEl);
  }
  function buildCSS() {
    var op = clamp(state.opacity, 0, 100, 100) / 100;
    var sc = clamp(state.scale, 50, 180, 100) / 100;
    var color = state.colorByFps ? autoColor(lastFps) : state.color || "#ffffff";
    var glassBg = state.bg ? "background: #14151a !important; border-color: rgba(255,255,255,0.08) !important; box-shadow: 0 8px 24px rgba(0,0,0,.5) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; padding: 4px 10px !important;" : "background: rgba(0,0,0,0.35) !important; border-color: rgba(255,255,255,0.06) !important; box-shadow: 0 4px 16px rgba(0,0,0,.25) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important; padding: 4px 10px !important;";
    return [ "#" + WRAP_ID + " {", "  position: fixed !important;", "  left: 16px !important;", "  top: 16px !important;", "  right: auto !important; bottom: auto !important;", "  transform: translate(" + (state.offsetX || 0) + "px, " + (state.offsetY || 0) + "px) scale(" + sc + ") !important;", "  transform-origin: left top !important;", "  display: " + (state.enabled ? "inline-flex" : "none") + " !important;", "  align-items: baseline !important;", "  gap: 4px !important;", "  border-radius: 6px !important;", "  border: 1px solid transparent !important;", "  opacity: " + op + " !important;", "  z-index: 498000 !important;", "  pointer-events: none !important;", "  " + glassBg, "}", ".dervi-fps-num {", "  font-size: 15px !important; font-weight: 800 !important;", "  color: " + color + " !important;", "  line-height: 1 !important;", "  transition: color .15s ease !important;", "  font-variant-numeric: tabular-nums !important;", "}", ".dervi-fps-label {", "  display: " + (state.showLabel ? "inline" : "none") + " !important;", "  font-size: 10px !important; font-weight: 700 !important;", "  letter-spacing: .04em !important; text-transform: uppercase !important;", "  color: rgba(255,255,255,.5) !important;", "  line-height: 1 !important;", "}" ].join("\n");
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
    if (numEl) numEl.textContent = String(lastFps);
    var styleEl = document.getElementById(STYLE_ID);
    if (styleEl) styleEl.textContent = buildCSS();
  }
  var nativeRealFps = null;
  function readNativeFps() {
    if (nativeRealFps !== null) return nativeRealFps;
    var elFps = document.querySelector('.stats-view [data-hook="fps"]');
    if (elFps) {
      var m = String(elFps.textContent || "").match(/(\d+)/);
      if (m) return parseInt(m[1], 10);
    }
    var statsEl = document.querySelector(".stats-view");
    if (statsEl) {
      var m2 = String(statsEl.textContent || "").match(/Fps:\s*(\d+)/i);
      if (m2) return parseInt(m2[1], 10);
    }
    return null;
  }
  var writingNative = false;
  function rewriteNativeNode(node, mode, realValue) {
    var boosted = Math.max(0, Math.round(realValue + (state.fpsBoost || 0)));
    writingNative = true;
    if (mode === "hook") {
      node.textContent = String(boosted);
    } else {
      node.textContent = String(node.textContent || "").replace(/Fps:\s*\d+/i, "Fps: " + boosted);
    }
    setTimeout(function() {
      writingNative = false;
    }, 0);
  }
  function attachNativeObserver() {
    var elFps = document.querySelector('.stats-view [data-hook="fps"]');
    var mode = elFps ? "hook" : null;
    var target = elFps;
    if (!target) {
      target = document.querySelector(".stats-view");
      if (target) mode = "text";
    }
    if (!target) return false;
    var obs = new MutationObserver(function() {
      if (writingNative) return;
      var raw = mode === "hook" ? target.textContent : (String(target.textContent || "").match(/Fps:\s*\d+/i) || [ null ])[0];
      var m = raw ? String(raw).match(/(\d+)/) : null;
      if (!m) return;
      var real = parseInt(m[1], 10);
      nativeRealFps = real;
      if (state.fpsBoost) rewriteNativeNode(target, mode, real);
    });
    obs.observe(target, {
      characterData: true,
      childList: true,
      subtree: true
    });
    return true;
  }
  if (typeof Injector !== "undefined" && Injector.waitForElement) {
    Injector.waitForElement(".stats-view").then(function() {
      attachNativeObserver();
    }).catch(function() {});
  } else {
    var attachTries = 0;
    var attachTimer = setInterval(function() {
      attachTries++;
      if (attachNativeObserver() || attachTries > 40) clearInterval(attachTimer);
    }, 250);
  }
  var frames = 0;
  var windowStart = 0;
  var rafId = null;
  var REFRESH_MS = 500;
  try {
    if (localStorage.getItem("less_refresh") === "true") REFRESH_MS = 1500;
  } catch (e) {}
  function tick(ts) {
    rafId = requestAnimationFrame(tick);
    if (document.hidden) return;
    if (!windowStart) windowStart = ts;
    frames += 1;
    var elapsed = ts - windowStart;
    if (elapsed >= REFRESH_MS) {
      var selfMeasured = Math.round(frames * 1e3 / elapsed);
      frames = 0;
      windowStart = ts;
      var native = readNativeFps();
      var real = native !== null ? native : selfMeasured;
      lastFps = Math.max(0, real + (state.fpsBoost || 0));
      if (state.enabled) paintValue();
    }
  }
  function startLoop() {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  }
  window.DerviFps = {
    setRefreshRate: function(ms) {
      REFRESH_MS = ms > 0 ? ms : 500;
      try {
        localStorage.setItem("less_refresh", ms > 500 ? "true" : "false");
      } catch (e) {}
    },
    getConfig: function() {
      return {
        enabled: state.enabled,
        showLabel: state.showLabel,
        colorByFps: state.colorByFps,
        color: state.color,
        scale: state.scale,
        opacity: state.opacity,
        bg: state.bg,
        offsetX: state.offsetX,
        offsetY: state.offsetY,
        fpsBoost: state.fpsBoost,
        currentFps: lastFps
      };
    },
    setFpsBoost: function(v) {
      state.fpsBoost = clamp(v, 0, 500, state.fpsBoost);
      notify();
    },
    setEnabled: function(v) {
      state.enabled = !!v;
      notify();
    },
    setShowLabel: function(v) {
      state.showLabel = !!v;
      notify();
    },
    setColorByFps: function(v) {
      state.colorByFps = !!v;
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
  console.log("[Dervi] FPS configurable cargado (color, escala, posición, etiqueta — en vivo, sin recargar)");
})();