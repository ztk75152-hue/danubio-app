(function() {
  "use strict";
  if (window.__DerviKeystrokesSkin) return;
  window.__DerviKeystrokesSkin = true;
  if (typeof Injector === "undefined" || Injector.isMainFrame && Injector.isMainFrame()) return;
  var STORAGE_KEY = "Dervi_keystrokes_cfg";
  var CHANGE_EVENT = "Dervi:keystrokes";
  var STYLE_ID = "dervi-keystrokes-style";
  var WRAP_ID = "dervi-keystrokes-wrap";
  var state = {
    enabled: false,
    layout: "wasd",
    customKeys: {
      up: "KeyW",
      left: "KeyA",
      down: "KeyS",
      right: "KeyD"
    },
    showKick: true,
    kickKey: "Space",
    scale: 100,
    opacity: 100,
    color: "#0040ff",
    bg: true,
    offsetX: 0,
    offsetY: -810
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
    if (parsed.layout === "arrows" || parsed.layout === "wasd" || parsed.layout === "custom") state.layout = parsed.layout;
    if (parsed.customKeys && typeof parsed.customKeys === "object") {
      [ "up", "left", "down", "right" ].forEach(function(k) {
        if (typeof parsed.customKeys[k] === "string" && parsed.customKeys[k]) state.customKeys[k] = parsed.customKeys[k];
      });
    }
    if (typeof parsed.showKick === "boolean") state.showKick = parsed.showKick;
    if (typeof parsed.kickKey === "string" && parsed.kickKey) state.kickKey = parsed.kickKey;
    if (typeof parsed.scale === "number") state.scale = parsed.scale;
    if (typeof parsed.opacity === "number") state.opacity = parsed.opacity;
    if (typeof parsed.color === "string" && parsed.color) state.color = parsed.color;
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
  var LAYOUT_CODES = {
    arrows: {
      up: "ArrowUp",
      left: "ArrowLeft",
      down: "ArrowDown",
      right: "ArrowRight"
    },
    wasd: {
      up: "KeyW",
      left: "KeyA",
      down: "KeyS",
      right: "KeyD"
    }
  };
  var LAYOUT_GLYPHS = {
    arrows: {
      up: "↑",
      left: "←",
      down: "↓",
      right: "→"
    },
    wasd: {
      up: "W",
      left: "A",
      down: "S",
      right: "D"
    }
  };
  var CODE_LABELS = {
    Space: "SPACE",
    KeyX: "X",
    ControlLeft: "CTRL",
    ControlRight: "CTRL",
    ShiftLeft: "SHIFT",
    ShiftRight: "SHIFT",
    AltLeft: "ALT",
    AltRight: "ALT",
    Numpad0: "NUM0",
    Enter: "ENTER"
  };
  function codeLabel(code) {
    code = String(code || "");
    if (CODE_LABELS[code]) return CODE_LABELS[code];
    if (/^Key[A-Z]$/.test(code)) return code.slice(3);
    if (/^Digit[0-9]$/.test(code)) return code.slice(5);
    return code.toUpperCase();
  }
  function getCodes() {
    if (state.layout === "custom") return state.customKeys;
    return LAYOUT_CODES[state.layout] || LAYOUT_CODES.arrows;
  }
  var wrapEl = null, padEl = null, kickEl = null;
  var keyEls = {};
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
    padEl = document.createElement("div");
    padEl.className = "dervi-ks-pad";
    [ "up", "left", "down", "right" ].forEach(function(k) {
      var key = document.createElement("div");
      key.className = "dervi-ks-key";
      key.setAttribute("data-k", k);
      padEl.appendChild(key);
      keyEls[k] = key;
    });
    wrapEl.appendChild(padEl);
    kickEl = document.createElement("div");
    kickEl.className = "dervi-ks-kick";
    wrapEl.appendChild(kickEl);
    paintGlyphs();
  }
  function paintGlyphs() {
    if (!keyEls.up) return;
    if (state.layout === "custom") {
      keyEls.up.textContent = codeLabel(state.customKeys.up);
      keyEls.left.textContent = codeLabel(state.customKeys.left);
      keyEls.down.textContent = codeLabel(state.customKeys.down);
      keyEls.right.textContent = codeLabel(state.customKeys.right);
    } else {
      var glyphs = LAYOUT_GLYPHS[state.layout] || LAYOUT_GLYPHS.arrows;
      keyEls.up.textContent = glyphs.up;
      keyEls.left.textContent = glyphs.left;
      keyEls.down.textContent = glyphs.down;
      keyEls.right.textContent = glyphs.right;
    }
    kickEl.textContent = codeLabel(state.kickKey);
  }
  function buildCSS() {
    var op = clamp(state.opacity, 0, 100, 100) / 100;
    var sc = clamp(state.scale, 50, 180, 100) / 100;
    var color = state.color || "#07f361";
    var glassBg = state.bg ? "background: #14151a !important; border-color: rgba(255,255,255,0.08) !important; box-shadow: 0 8px 24px rgba(0,0,0,.5) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;" : "background: rgba(0,0,0,0.35) !important; border-color: rgba(255,255,255,0.06) !important; box-shadow: 0 4px 16px rgba(0,0,0,.25) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important;";
    return [ "#" + WRAP_ID + " {", "  position: fixed !important;", "  left: 16px !important;", "  bottom: 22px !important;", "  right: auto !important; top: auto !important;", "  transform: translate(" + (state.offsetX || 0) + "px, " + (state.offsetY || 0) + "px) scale(" + sc + ") !important;", "  transform-origin: left bottom !important;", "  display: " + (state.enabled ? "flex" : "none") + " !important;", "  flex-direction: column !important;", "  align-items: stretch !important;", "  gap: 4px !important;", "  opacity: " + op + " !important;", "  z-index: 498000 !important;", "  pointer-events: none !important;", "}", ".dervi-ks-pad {", "  display: grid !important;", "  grid-template-columns: repeat(3, 28px) !important;", "  grid-template-rows: repeat(2, 28px) !important;", "  gap: 4px !important;", "}", ".dervi-ks-key {", "  position: relative !important;", "  display: flex !important;", "  align-items: center !important;", "  justify-content: center !important;", "  width: 28px !important; height: 28px !important;", "  border-radius: 6px !important;", "  border: 1px solid transparent !important;", "  font-size: 12.5px !important; font-weight: 800 !important;", "  letter-spacing: .02em !important;", "  color: rgba(255,255,255,.45) !important;", "  " + glassBg, "  transition: color .08s ease, background .08s ease !important;", "  user-select: none !important;", "}", '.dervi-ks-pad [data-k="up"] { grid-column: 2; grid-row: 1; }', '.dervi-ks-pad [data-k="left"] { grid-column: 1; grid-row: 2; }', '.dervi-ks-pad [data-k="down"] { grid-column: 2; grid-row: 2; }', '.dervi-ks-pad [data-k="right"] { grid-column: 3; grid-row: 2; }', ".dervi-ks-key::after {", '  content: "" !important;', "  position: absolute !important;", "  left: 22% !important; right: 22% !important; bottom: 3px !important;", "  height: 2px !important; border-radius: 1px !important;", "  background: " + color + " !important;", "  opacity: 0 !important; transform: scaleX(.4) !important;", "  transition: opacity .08s ease, transform .08s ease !important;", "}", ".dervi-ks-key.is-down {", "  color: #fff !important;", "}", ".dervi-ks-key.is-down::after {", "  opacity: .95 !important; transform: scaleX(1) !important;", "}", ".dervi-ks-kick {", "  display: " + (state.showKick ? "inline-flex" : "none") + " !important;", "  align-items: center !important; justify-content: center !important;", "  height: 24px !important; min-width: 24px !important;", "  padding: 0 9px !important;", "  border-radius: 6px !important;", "  border: 1px solid transparent !important;", "  font-size: 10.5px !important; font-weight: 800 !important;", "  letter-spacing: .06em !important; text-transform: uppercase !important;", "  color: rgba(255,255,255,.45) !important;", "  " + glassBg, "  position: relative !important;", "  transition: color .08s ease, background .08s ease !important;", "  user-select: none !important;", "}", ".dervi-ks-kick::after {", '  content: "" !important;', "  position: absolute !important;", "  left: 18% !important; right: 18% !important; bottom: 3px !important;", "  height: 2px !important; border-radius: 1px !important;", "  background: " + color + " !important;", "  opacity: 0 !important; transform: scaleX(.4) !important;", "  transition: opacity .08s ease, transform .08s ease !important;", "}", ".dervi-ks-kick.is-down {", "  color: #fff !important;", "}", ".dervi-ks-kick.is-down::after {", "  opacity: .95 !important; transform: scaleX(1) !important;", "}" ].join("\n");
  }
  function apply() {
    ensureDom();
    paintGlyphs();
    var styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = buildCSS();
  }
  var downCodes = {};
  function setKeyVisual(which, isDown) {
    var el = keyEls[which];
    if (!el) return;
    el.classList.toggle("is-down", !!isDown);
  }
  function onKeyDown(e) {
    if (!state.enabled || !e || !e.code) return;
    downCodes[e.code] = true;
    var codes = getCodes();
    for (var k in codes) {
      if (codes[k] === e.code) setKeyVisual(k, true);
    }
    if (state.showKick && e.code === state.kickKey) {
      if (kickEl) kickEl.classList.add("is-down");
    }
  }
  function onKeyUp(e) {
    if (!e || !e.code) return;
    downCodes[e.code] = false;
    var codes = getCodes();
    for (var k in codes) {
      if (codes[k] === e.code) setKeyVisual(k, false);
    }
    if (e.code === state.kickKey) {
      if (kickEl) kickEl.classList.remove("is-down");
    }
  }
  function resetAllVisual() {
    downCodes = {};
    [ "up", "left", "down", "right" ].forEach(function(k) {
      setKeyVisual(k, false);
    });
    if (kickEl) kickEl.classList.remove("is-down");
  }
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  window.addEventListener("blur", resetAllVisual);
  function captureNextKey(callback) {
    function handler(e) {
      if (!e || !e.code) return;
      e.preventDefault();
      e.stopPropagation();
      cleanup();
      callback(e.code);
    }
    function cleanup() {
      window.removeEventListener("keydown", handler, true);
    }
    window.addEventListener("keydown", handler, true);
    return cleanup;
  }
  window.DerviKeystrokes = {
    getConfig: function() {
      return {
        enabled: state.enabled,
        layout: state.layout,
        customKeys: {
          up: state.customKeys.up,
          left: state.customKeys.left,
          down: state.customKeys.down,
          right: state.customKeys.right
        },
        customKeyLabels: {
          up: codeLabel(state.customKeys.up),
          left: codeLabel(state.customKeys.left),
          down: codeLabel(state.customKeys.down),
          right: codeLabel(state.customKeys.right)
        },
        showKick: state.showKick,
        kickKey: state.kickKey,
        kickKeyLabel: codeLabel(state.kickKey),
        scale: state.scale,
        opacity: state.opacity,
        color: state.color,
        bg: state.bg,
        offsetX: state.offsetX,
        offsetY: state.offsetY
      };
    },
    setEnabled: function(v) {
      state.enabled = !!v;
      notify();
    },
    setLayout: function(v) {
      state.layout = v === "wasd" || v === "custom" ? v : "arrows";
      resetAllVisual();
      notify();
    },
    setCustomKey: function(which, code) {
      if (!state.customKeys.hasOwnProperty(which)) return;
      if (typeof code !== "string" || !code) return;
      state.customKeys[which] = code;
      resetAllVisual();
      notify();
    },
    setShowKick: function(v) {
      state.showKick = !!v;
      notify();
    },
    setKickKey: function(code) {
      if (typeof code === "string" && code) {
        state.kickKey = code;
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
    setColor: function(v) {
      if (typeof v === "string" && v) {
        state.color = v;
        notify();
      }
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
    },
    captureNextKey: captureNextKey
  };
  loadState();
  apply();
  window.addEventListener("storage", function(e) {
    if (!e || e.key === null || e.key === STORAGE_KEY) {
      loadState();
      apply();
    }
  });
  console.log("[Dervi] Keystrokes configurable cargado (layout, kick key, color, escala, posición — en vivo, sin recargar)");
})();