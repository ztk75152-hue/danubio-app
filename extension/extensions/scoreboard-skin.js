(function() {
  "use strict";
  if (window.__DerviScoreboardSkin) return;
  window.__DerviScoreboardSkin = true;
  if (typeof Injector === "undefined" || Injector.isMainFrame && Injector.isMainFrame()) return;
  var STORAGE_KEY = "Dervi_scoreboard_cfg";
  var CHANGE_EVENT = "Dervi:scoreboard";
  var STYLE_ID = "custom-scoreboard-style";
  var CHIP_SOLID_COLOR = "#202126";
  var CHIP_BORDER_WIDTH = 3;
  var state = {
    enabled: true,
    bg: true,
    opacity: 100,
    scale: 115,
    redColor: "#e25555",
    blueColor: "#4a8fe8",
    showTimer: true,
    showOvertimeBanner: true,
    offsetX: 0,
    offsetY: -30
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
    if (typeof parsed.bg === "boolean") state.bg = parsed.bg;
    if (typeof parsed.opacity === "number") state.opacity = parsed.opacity;
    if (typeof parsed.scale === "number") state.scale = parsed.scale;
    if (typeof parsed.redColor === "string") state.redColor = parsed.redColor;
    if (typeof parsed.blueColor === "string") state.blueColor = parsed.blueColor;
    if (typeof parsed.showTimer === "boolean") state.showTimer = parsed.showTimer;
    if (typeof parsed.showOvertimeBanner === "boolean") state.showOvertimeBanner = parsed.showOvertimeBanner;
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
    refreshOvertimeVisibility();
    try {
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch (e) {}
  }
  function clamp(v, min, max, fallback) {
    v = parseFloat(v);
    if (isNaN(v)) return fallback;
    return Math.max(min, Math.min(max, v));
  }
  function hexToRgb(hex) {
    hex = String(hex || "").replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var num = parseInt(hex, 16);
    if (isNaN(num) || hex.length !== 6) return {
      r: 255,
      g: 255,
      b: 255
    };
    return {
      r: num >> 16 & 255,
      g: num >> 8 & 255,
      b: num & 255
    };
  }
  function rgba(hex, alpha) {
    var c = hexToRgb(hex);
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + alpha + ")";
  }
  function buildCSS() {
    if (!state.enabled) {
      return "";
    }
    var op = clamp(state.opacity, 0, 100, 100) / 100;
    var sc = clamp(state.scale, 50, 150, 100) / 100;
    var red = state.redColor || "#e25555";
    var blue = state.blueColor || "#4a8fe8";
    var top = 64 + (state.offsetY || 0);
    var leftShift = state.offsetX || 0;
    var barBg = state.bg ? "background: #14151a !important; border-color: rgba(255,255,255,0.08) !important; box-shadow: 0 8px 24px rgba(0,0,0,.5) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;" : "background: rgba(0,0,0,0.35) !important; border-color: rgba(255,255,255,0.06) !important; box-shadow: 0 4px 16px rgba(0,0,0,.25) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important;";
    var timerBg = "background: rgba(255,255,255,0.05) !important;";
    var LINE_DARK = "rgba(10,11,14,";
    var timerBorder = state.bg ? "border: " + CHIP_BORDER_WIDTH + "px solid #14151a !important; box-shadow: none !important;" : "border: none !important; box-shadow: inset 0 0 0 1px " + LINE_DARK + ".5), inset 0 0 " + CHIP_BORDER_WIDTH * 2 + "px 1px " + LINE_DARK + ".4) !important;";
    return [ ".bar-container {", "  position: fixed !important;", "  top: " + top + "px !important;", "  left: 50% !important;", "  right: auto !important;", "  bottom: auto !important;", "  transform: translateX(calc(-50% + " + leftShift + "px)) scale(" + sc + ") !important;", "  transform-origin: top center !important;", "  width: auto !important;", "  opacity: " + op + " !important;", "  z-index: 500000 !important;", "}", ".bar-container .bar.bar {", "  display: flex !important;", "  align-items: stretch !important;", "  height: 40px !important;", "  border-radius: 10px !important;", "  overflow: hidden !important;", "  border: 1px solid transparent !important;", "  " + barBg, "}", ".scoreboard { display: contents !important; }", ".scoreboard > .teamicon.red   { order: 1 !important; }", '[data-hook="red-score"]       { order: 2 !important; }', ".scoreboard > div:not(.teamicon):not(.score) { display: none !important; }", '[data-hook="blue-score"]      { order: 4 !important; }', ".scoreboard > .teamicon.blue  { order: 5 !important; }", ".fps-limit-fix                { display: none !important; }", ".game-timer-view              { order: 3 !important; }", ".teamicon {", "  display: none !important;", "}", ".score {", "  display: flex !important;", "  align-items: center !important;", "  height: 100% !important;", "  min-width: 22px !important;", "  padding: 0 !important;", "  font-size: 20px !important;", "  font-weight: 700 !important;", "  letter-spacing: -0.02em !important;", "  font-variant-numeric: tabular-nums !important;", "  color: #fff !important;", "}", '[data-hook="red-score"] {', "  justify-content: center !important;", "  padding: 0 10px !important;", "  background: transparent !important;", "  position: relative !important;", "}", '[data-hook="red-score"]::after {', '  content: "" !important;', "  position: absolute !important;", "  left: 10px !important;", "  right: 0 !important;", "  bottom: 0 !important;", "  height: 2px !important;", "  border-radius: 2px !important;", "  background: " + red + " !important;", "}", '[data-hook="blue-score"] {', "  justify-content: center !important;", "  padding: 0 10px !important;", "  background: transparent !important;", "  position: relative !important;", "}", '[data-hook="blue-score"]::after {', '  content: "" !important;', "  position: absolute !important;", "  left: 0 !important;", "  right: 10px !important;", "  bottom: 0 !important;", "  height: 2px !important;", "  border-radius: 2px !important;", "  background: " + blue + " !important;", "}", ".game-timer-view {", "  display: " + (state.showTimer ? "flex" : "none") + " !important;", "  align-items: center !important;", "  justify-content: center !important;", "  height: 100% !important;", "  gap: 1px !important;", "  padding: 0 14px !important;", "  font-size: 12px !important;", "  font-weight: 600 !important;", "  letter-spacing: .08em !important;", "  color: #fff !important;", "  opacity: 0.85 !important;", "  font-variant-numeric: tabular-nums !important;", "  box-sizing: border-box !important;", "  " + timerBg, "  " + timerBorder, "}", ".game-timer-view.time-warn { color: #ff3b3b !important; opacity: 1 !important; }", ".game-timer-view .overtime { display: none !important; }" ].join("\n");
  }
  var OVERTIME_BADGE_ID = "dervi-overtime-badge";
  var _overtimeEl = null;
  var _overtimeResizeObserver = null;
  function getDesiredParent() {
    var pill = _overtimeEl && _overtimeEl.closest(".bar-container");
    return pill && pill.parentNode || document.body || document.documentElement;
  }
  function getOvertimeBadge() {
    var el = document.getElementById(OVERTIME_BADGE_ID);
    var parent = getDesiredParent();
    if (!el) {
      el = document.createElement("div");
      el.id = OVERTIME_BADGE_ID;
      el.textContent = "overtime";
      parent.appendChild(el);
    } else if (el.parentNode !== parent) {
      parent.appendChild(el);
    }
    return el;
  }
  function styleOvertimeBadge() {
    var el = getOvertimeBadge();
    var bg = state.bg ? CHIP_SOLID_COLOR : "rgba(0,0,0,0.35)";
    var backdrop = state.bg ? "none" : "blur(10px)";
    var sc = clamp(state.scale, 50, 150, 100) / 100;
    var borderW = (CHIP_BORDER_WIDTH * sc).toFixed(2);
    var border, extraShadow;
    if (state.bg) {
      border = borderW + "px solid #14151a";
      extraShadow = "";
    } else {
      border = "none";
      extraShadow = ", inset 0 0 0 1px rgba(10,11,14,.5), inset 0 0 " + (borderW * 2).toFixed(2) + "px 1px rgba(10,11,14,.4)";
    }
    var timerFontFamily = "";
    var chipEl = _overtimeEl && _overtimeEl.closest(".game-timer-view");
    if (chipEl) {
      try {
        timerFontFamily = getComputedStyle(chipEl).fontFamily || "";
      } catch (e) {}
    }
    el.style.cssText = "position: fixed !important;" + "display: none !important;" + "align-items: center !important;" + "justify-content: center !important;" + "box-sizing: border-box !important;" + "padding: " + (5 * sc).toFixed(2) + "px " + (10 * sc).toFixed(2) + "px " + (6 * sc).toFixed(2) + "px !important;" + "border-radius: 0 0 " + (10 * sc).toFixed(2) + "px " + (10 * sc).toFixed(2) + "px !important;" + "background: " + bg + " !important;" + "backdrop-filter: " + backdrop + " !important;" + "-webkit-backdrop-filter: " + backdrop + " !important;" + "border: " + border + " !important;" + "border-top: none !important;" + "box-shadow: 0 8px 20px rgba(0,0,0,.5)" + extraShadow + " !important;" + "white-space: nowrap !important;" + "font-size: " + (14 * sc).toFixed(2) + "px !important;" + "font-weight: 800 !important;" + "letter-spacing: .08em !important;" + (timerFontFamily ? "font-family: " + timerFontFamily + " !important;" : "") + "font-variant-numeric: tabular-nums !important;" + "color: #fff !important;" + "text-align: center !important;" + "z-index: 499999 !important;" + "pointer-events: none !important;";
  }
  function syncOvertimePosition() {
    var badge = document.getElementById(OVERTIME_BADGE_ID);
    var chip = _overtimeEl && _overtimeEl.closest(".game-timer-view");
    var pill = _overtimeEl && _overtimeEl.closest(".bar");
    if (!badge || !chip || !pill) return;
    var chipRect = chip.getBoundingClientRect();
    var pillRect = pill.getBoundingClientRect();
    var centerX = chipRect.left + chipRect.width / 2;
    badge.style.setProperty("left", centerX + "px", "important");
    badge.style.setProperty("width", chipRect.width + "px", "important");
    badge.style.setProperty("top", pillRect.bottom - 1 + "px", "important");
    badge.style.setProperty("transform", "translateX(-50%)", "important");
  }
  function setOvertimeVisible(visible) {
    var badge = getOvertimeBadge();
    if (visible) {
      badge.style.setProperty("display", "inline-flex", "important");
      syncOvertimePosition();
      if (!_overtimeResizeObserver && typeof ResizeObserver !== "undefined") {
        var chip = _overtimeEl && _overtimeEl.closest(".game-timer-view");
        var pill = _overtimeEl && _overtimeEl.closest(".bar");
        if (chip && pill) {
          _overtimeResizeObserver = new ResizeObserver(function() {
            syncOvertimePosition();
          });
          _overtimeResizeObserver.observe(chip);
          _overtimeResizeObserver.observe(pill);
        }
      }
    } else {
      badge.style.setProperty("display", "none", "important");
      if (_overtimeResizeObserver) {
        _overtimeResizeObserver.disconnect();
        _overtimeResizeObserver = null;
      }
    }
  }
  function refreshOvertimeVisibility() {
    if (!_overtimeEl) return;
    setOvertimeVisible(state.enabled && state.showTimer && state.showOvertimeBanner && _overtimeEl.classList.contains("on"));
  }
  function watchOvertime() {
    var el = document.querySelector(".game-timer-view .overtime");
    if (!el) {
      setTimeout(watchOvertime, 500);
      return;
    }
    _overtimeEl = el;
    styleOvertimeBadge();
    var mo = new MutationObserver(refreshOvertimeVisibility);
    mo.observe(el, {
      attributes: true,
      attributeFilter: [ "class" ]
    });
    refreshOvertimeVisibility();
  }
  function apply() {
    var css = buildCSS();
    var styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = css;
    styleOvertimeBadge();
  }
  window.DerviScoreboard = {
    getConfig: function() {
      return {
        enabled: state.enabled,
        bg: state.bg,
        opacity: state.opacity,
        scale: state.scale,
        redColor: state.redColor,
        blueColor: state.blueColor,
        showTimer: state.showTimer,
        showOvertimeBanner: state.showOvertimeBanner,
        offsetX: state.offsetX,
        offsetY: state.offsetY
      };
    },
    setEnabled: function(v) {
      state.enabled = !!v;
      notify();
    },
    setBg: function(v) {
      state.bg = !!v;
      notify();
    },
    setOpacity: function(v) {
      state.opacity = clamp(v, 0, 100, state.opacity);
      notify();
    },
    setScale: function(v) {
      state.scale = clamp(v, 50, 150, state.scale);
      notify();
    },
    setRedColor: function(v) {
      if (typeof v === "string" && v) {
        state.redColor = v;
        notify();
      }
    },
    setBlueColor: function(v) {
      if (typeof v === "string" && v) {
        state.blueColor = v;
        notify();
      }
    },
    setShowTimer: function(v) {
      state.showTimer = !!v;
      notify();
    },
    setShowOvertimeBanner: function(v) {
      state.showOvertimeBanner = !!v;
      notify();
    },
    setOffsetX: function(v) {
      state.offsetX = clamp(v, -300, 300, state.offsetX);
      notify();
    },
    setOffsetY: function(v) {
      state.offsetY = clamp(v, -100, 300, state.offsetY);
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
  watchOvertime();
  window.addEventListener("storage", function(e) {
    if (!e || e.key === null || e.key === STORAGE_KEY) {
      loadState();
      apply();
    }
  });
  console.log("[Dervi] Scoreboard configurable cargado (colores, fondo, escala, posición — en vivo, sin recargar)");
})();