(function() {
  "use strict";
  if (window.__DerviRoomInfoSkin) return;
  window.__DerviRoomInfoSkin = true;
  if (typeof Injector === "undefined" || Injector.isMainFrame && Injector.isMainFrame()) return;
  var STORAGE_KEY = "Dervi_roominfo_cfg";
  var CHANGE_EVENT = "Dervi:roominfo";
  var STYLE_ID = "dervi-roominfo-style";
  var WRAP_ID = "dervi-roominfo-wrap";
  var state = {
    enabled: false,
    showName: true,
    showPlayers: true,
    showMap: true,
    color: "#ffffff",
    scale: 100,
    opacity: 100,
    bg: true,
    offsetX: 10,
    offsetY: 323
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
    if (typeof parsed.showName === "boolean") state.showName = parsed.showName;
    if (typeof parsed.showPlayers === "boolean") state.showPlayers = parsed.showPlayers;
    if (typeof parsed.showMap === "boolean") state.showMap = parsed.showMap;
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
  function readRoomMeta() {
    var name = "";
    var map = "";
    try {
      var nameEl = document.querySelector('h1[data-hook="room-name"]') || document.querySelector('[data-hook="room-name"]');
      name = nameEl ? String(nameEl.textContent || "").trim() : "";
    } catch (eN) {}
    try {
      var stadEl = document.querySelector('[data-hook="stadium-name"]');
      map = stadEl ? String(stadEl.textContent || "").trim() : "";
    } catch (eM) {}
    return {
      name: name,
      map: map
    };
  }
  function countListAt(index, hookFallback) {
    var root = null;
    try {
      var views = document.querySelectorAll(".room-view .teams .player-list-view");
      if (!views || !views.length) views = document.querySelectorAll(".teams .player-list-view");
      if (views && views.length) root = views[index] || null;
    } catch (eV) {}
    if (!root) {
      try {
        root = document.querySelector('[data-hook="' + hookFallback + '"]');
      } catch (eH) {
        root = null;
      }
    }
    if (!root) return 0;
    try {
      return root.querySelectorAll(".player-list-item").length;
    } catch (eC) {
      return 0;
    }
  }
  function readPlayersText() {
    var red = countListAt(0, "red-list");
    var spec = countListAt(1, "spec-list");
    var blue = countListAt(2, "blue-list");
    var playing = red + blue;
    var total = playing + spec;
    return total > 0 ? String(playing) + "/" + String(total) : "";
  }
  var wrapEl = null, nameEl = null, metaEl = null;
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
    nameEl = document.createElement("div");
    nameEl.className = "dervi-ri-name";
    metaEl = document.createElement("div");
    metaEl.className = "dervi-ri-meta";
    wrapEl.appendChild(nameEl);
    wrapEl.appendChild(metaEl);
  }
  function buildCSS() {
    var op = clamp(state.opacity, 0, 100, 100) / 100;
    var sc = clamp(state.scale, 50, 180, 100) / 100;
    var color = state.color || "#ffffff";
    var glassBg = state.bg ? "background: #14151a !important; border-color: rgba(255,255,255,0.08) !important; box-shadow: 0 8px 24px rgba(0,0,0,.5) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; padding: 6px 12px !important;" : "background: rgba(0,0,0,0.35) !important; border-color: rgba(255,255,255,0.06) !important; box-shadow: 0 4px 16px rgba(0,0,0,.25) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important; padding: 6px 12px !important;";
    return [ "#" + WRAP_ID + " {", "  position: fixed !important;", "  left: 16px !important;", "  top: 56px !important;", "  right: auto !important; bottom: auto !important;", "  transform: translate(" + (state.offsetX || 0) + "px, " + (state.offsetY || 0) + "px) scale(" + sc + ") !important;", "  transform-origin: left top !important;", "  display: " + (state.enabled ? "flex" : "none") + " !important;", "  flex-direction: column !important;", "  align-items: flex-start !important;", "  gap: 1px !important;", "  border-radius: 8px !important;", "  border: 1px solid transparent !important;", "  max-width: 240px !important;", "  opacity: " + op + " !important;", "  z-index: 497000 !important;", "  pointer-events: none !important;", "  " + glassBg, "}", ".dervi-ri-name {", "  display: " + (state.showName ? "block" : "none") + " !important;", "  font-size: 13px !important; font-weight: 800 !important;", "  color: " + color + " !important;", "  line-height: 1.3 !important;", "  max-width: 220px !important;", "  overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;", "}", ".dervi-ri-meta {", "  display: " + (state.showPlayers || state.showMap ? "block" : "none") + " !important;", "  font-size: 10.5px !important; font-weight: 600 !important;", "  letter-spacing: .02em !important;", "  color: rgba(255,255,255,.55) !important;", "  line-height: 1.3 !important;", "  max-width: 220px !important;", "  overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;", "}" ].join("\n");
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
  var pollId = null;
  var cachedName = "";
  var cachedMap = "";
  var cachedPlayers = "";
  function refreshData() {
    if (!state.enabled) return;
    ensureDom();
    var meta = readRoomMeta();
    if (meta.name) cachedName = meta.name;
    if (meta.map) cachedMap = meta.map;
    var playersText = readPlayersText();
    if (playersText) cachedPlayers = playersText;
    if (nameEl) nameEl.textContent = cachedName || "—";
    var metaParts = [];
    if (state.showPlayers && cachedPlayers) metaParts.push(cachedPlayers);
    if (state.showMap && cachedMap) metaParts.push(cachedMap);
    if (metaEl) metaEl.textContent = metaParts.join(" · ");
  }
  function startPolling() {
    if (pollId) return;
    pollId = setInterval(function() {
      if (!document.hidden) refreshData();
    }, 1e3);
  }
  window.DerviRoomInfo = {
    getConfig: function() {
      return {
        enabled: state.enabled,
        showName: state.showName,
        showPlayers: state.showPlayers,
        showMap: state.showMap,
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
      if (v) refreshData();
    },
    setShowName: function(v) {
      state.showName = !!v;
      notify();
    },
    setShowPlayers: function(v) {
      state.showPlayers = !!v;
      notify();
      refreshData();
    },
    setShowMap: function(v) {
      state.showMap = !!v;
      notify();
      refreshData();
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
  refreshData();
  startPolling();
  window.addEventListener("storage", function(e) {
    if (!e || e.key === null || e.key === STORAGE_KEY) {
      loadState();
      apply();
      refreshData();
    }
  });
  console.log("[Dervi] Room Info configurable cargado (nombre de sala, jugadores, mapa — en vivo, sin recargar)");
})();