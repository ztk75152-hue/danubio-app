(function() {
  "use strict";
  if (window.__DerviSaturation) return;
  window.__DerviSaturation = true;
  var STORAGE_KEY = "hbx_saturation";
  var CHANGE_EVENT = "Dervi:saturation";
  var STYLE_ID = "dervi-saturation-style";
  var DEFAULT_VALUE = 50;
  function clamp(v) {
    v = parseInt(v, 10);
    if (isNaN(v)) return DEFAULT_VALUE;
    return Math.max(1, Math.min(100, v));
  }
  function readValue() {
    var raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    return raw === null || raw === "" ? DEFAULT_VALUE : clamp(raw);
  }
  function ensureStyleEl() {
    var styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }
    return styleEl;
  }
  function apply() {
    var value = readValue();
    var pct = value * 2;
    ensureStyleEl().textContent = "html{filter:saturate(" + pct + "%) !important;}";
  }
  window.DerviSaturation = {
    getValue: readValue,
    setValue: function(v) {
      var clamped = clamp(v);
      try {
        localStorage.setItem(STORAGE_KEY, String(clamped));
      } catch (e) {}
      apply();
      try {
        window.dispatchEvent(new Event(CHANGE_EVENT));
      } catch (e) {}
    },
    reset: function() {
      window.DerviSaturation.setValue(DEFAULT_VALUE);
    }
  };
  window.addEventListener("storage", function(e) {
    if (!e || e.key === null || e.key === STORAGE_KEY) apply();
  });
  apply();
})();