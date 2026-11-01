(function() {
  var STORAGE_KEY = "stretched_resolution";
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  var PRESETS = [ {
    value: "native",
    label: t("Nativo"),
    width: 0,
    height: 0
  }, {
    value: "800x600",
    label: "800×600",
    width: 800,
    height: 600
  }, {
    value: "1024x768",
    label: "1024×768",
    width: 1024,
    height: 768
  }, {
    value: "1280x720",
    label: "1280×720",
    width: 1280,
    height: 720
  }, {
    value: "1280x960",
    label: "1280×960",
    width: 1280,
    height: 960
  }, {
    value: "1600x900",
    label: "1600×900",
    width: 1600,
    height: 900
  }, {
    value: "1920x1080",
    label: "1920×1080",
    width: 1920,
    height: 1080
  }, {
    value: "custom",
    label: t("Personalizada"),
    width: null,
    height: null
  } ];
  function getSavedRes() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      var parsed = s ? JSON.parse(s) : null;
      if (parsed && typeof parsed === "object") {
        var w = parseInt(parsed.width, 10) || 0;
        var h = parseInt(parsed.height, 10) || 0;
        return {
          width: w,
          height: h,
          preset: parsed.preset || (w > 0 ? "custom" : "native")
        };
      }
    } catch (e) {}
    return {
      width: 0,
      height: 0,
      preset: "native"
    };
  }
  function saveRes(width, height, preset) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        width: width,
        height: height,
        preset: preset
      }));
    } catch (e) {}
  }
  var _lastCanvas = null;
  var _isApplyingStretch = false;
  function overrideBackingStore(canvas) {
    if (!canvas || canvas.__hxdResPatched) return;
    var widthDesc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, "width");
    var heightDesc = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, "height");
    if (!widthDesc || !heightDesc || !widthDesc.set || !heightDesc.set) return;
    canvas.__hxdResPatched = true;
    Object.defineProperty(canvas, "width", {
      configurable: true,
      get: function() {
        return widthDesc.get.call(canvas);
      },
      set: function(v) {
        var res = getSavedRes();
        widthDesc.set.call(canvas, res.width > 0 && res.height > 0 ? res.width : v);
      }
    });
    Object.defineProperty(canvas, "height", {
      configurable: true,
      get: function() {
        return heightDesc.get.call(canvas);
      },
      set: function(v) {
        var res = getSavedRes();
        heightDesc.set.call(canvas, res.width > 0 && res.height > 0 ? res.height : v);
      }
    });
  }
  function forceReapply(canvas) {
    var res = getSavedRes();
    var dimensionsChanged = false;
    if (res.width > 0 && res.height > 0) {
      if (canvas.width !== res.width) {
        canvas.width = res.width;
        dimensionsChanged = true;
      }
      if (canvas.height !== res.height) {
        canvas.height = res.height;
        dimensionsChanged = true;
      }
    }
    try {
      window.__hxdInvalidateCanvas = true;
    } catch (e) {}
    if (dimensionsChanged) {
      try {
        window.dispatchEvent(new Event("resize"));
      } catch (e2) {}
    }
  }
  function applyStretch() {
    if (_isApplyingStretch) return;
    _isApplyingStretch = true;
    try {
    var res = getSavedRes();
    var canvas = _lastCanvas || document.querySelector("canvas");
    if (!canvas) return;
    if (canvas !== _lastCanvas) overrideBackingStore(canvas);
    _lastCanvas = canvas;
    if (res.width === 0) {
      canvas.style.removeProperty("width");
      canvas.style.removeProperty("height");
      canvas.style.removeProperty("object-fit");
      canvas.style.removeProperty("position");
      canvas.style.removeProperty("top");
      canvas.style.removeProperty("left");
      canvas.style.removeProperty("transform");
      if (canvas.parentElement) {
        canvas.parentElement.style.removeProperty("width");
        canvas.parentElement.style.removeProperty("height");
        canvas.parentElement.style.removeProperty("overflow");
      }
    } else {
      canvas.style.setProperty("width", "100vw", "important");
      canvas.style.setProperty("height", "100vh", "important");
      canvas.style.setProperty("object-fit", "fill", "important");
      canvas.style.setProperty("position", "fixed", "important");
      canvas.style.setProperty("top", "0", "important");
      canvas.style.setProperty("left", "0", "important");
      canvas.style.setProperty("transform", "translateZ(0)", "important");
      if (canvas.parentElement) {
        canvas.parentElement.style.setProperty("width", "100vw", "important");
        canvas.parentElement.style.setProperty("height", "100vh", "important");
        canvas.parentElement.style.setProperty("overflow", "hidden", "important");
      }
    }
    forceReapply(canvas);
    } finally {
      _isApplyingStretch = false;
    }
  }
  function buildRow(videoSec) {
    if (document.getElementById("stretched-res-row")) return;
    var current = getSavedRes();
    var wrap = document.createElement("div");
    wrap.id = "stretched-res-row";
    wrap.style.cssText = "display:flex;flex-direction:column;padding:4px 0;margin-top:4px;gap:6px;";
    var row1 = document.createElement("div");
    row1.style.cssText = "display:flex;align-items:center;gap:6px;";
    var lbl = document.createElement("span");
    lbl.textContent = t("Resolución") + ":";
    lbl.style.cssText = "font-size:13px;white-space:nowrap;";
    var sel = document.createElement("select");
    PRESETS.forEach(function(p) {
      var opt = document.createElement("option");
      opt.value = p.value;
      opt.textContent = p.label;
      if (p.value === current.preset) opt.selected = true;
      sel.appendChild(opt);
    });
    row1.appendChild(lbl);
    row1.appendChild(sel);
    var row2 = document.createElement("div");
    row2.id = "stretched-res-custom";
    row2.style.cssText = "display:" + (current.preset === "custom" ? "flex" : "none") + ";align-items:center;gap:6px;";
    var wIn = document.createElement("input");
    wIn.type = "number";
    wIn.min = "1";
    wIn.style.cssText = "width:70px;";
    wIn.value = current.width || 1280;
    var xLbl = document.createElement("span");
    xLbl.textContent = "×";
    xLbl.style.cssText = "font-size:13px;";
    var hIn = document.createElement("input");
    hIn.type = "number";
    hIn.min = "1";
    hIn.style.cssText = "width:70px;";
    hIn.value = current.height || 720;
    var applyBtn = document.createElement("button");
    applyBtn.type = "button";
    applyBtn.textContent = t("Aplicar");
    applyBtn.style.cssText = "font-size:12px;padding:3px 10px;cursor:pointer;";
    row2.appendChild(wIn);
    row2.appendChild(xLbl);
    row2.appendChild(hIn);
    row2.appendChild(applyBtn);
    sel.onchange = function() {
      var val = sel.value;
      if (val === "custom") {
        row2.style.display = "flex";
        return;
      }
      row2.style.display = "none";
      var preset = null;
      for (var i = 0; i < PRESETS.length; i++) {
        if (PRESETS[i].value === val) {
          preset = PRESETS[i];
          break;
        }
      }
      if (!preset) return;
      saveRes(preset.width, preset.height, val);
      applyStretch();
    };
    applyBtn.onclick = function() {
      var w = Math.max(1, parseInt(wIn.value, 10) || 0);
      var h = Math.max(1, parseInt(hIn.value, 10) || 0);
      if (!w || !h) return;
      saveRes(w, h, "custom");
      applyStretch();
    };
    [ sel, wIn, hIn, applyBtn ].forEach(function(el) {
      [ "keydown", "keyup", "keypress" ].forEach(function(ev) {
        el.addEventListener(ev, function(e) {
          e.stopImmediatePropagation();
        }, true);
      });
    });
    wrap.appendChild(row1);
    wrap.appendChild(row2);
    videoSec.appendChild(wrap);
  }
  function tryInsert() {
    if (document.getElementById("stretched-res-row")) return;
    var videoSec = document.querySelector('[data-hook="videosec"]');
    if (videoSec) buildRow(videoSec);
  }
  var _obs = new MutationObserver(function(mutations) {
    var needsCheck = false;
    var canvasChanged = false;
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === "childList" && m.addedNodes.length > 0) {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var n = m.addedNodes[j];
          if (n.nodeType === 1) {
            needsCheck = true;
            if (n.tagName === "CANVAS" || n.querySelector && n.querySelector("canvas")) {
              canvasChanged = true;
            }
            break;
          }
        }
      }
      if (m.type === "attributes") {
        var mt = m.target;
        if (mt && mt.getAttribute && mt.getAttribute("data-hook") === "videosec") needsCheck = true;
        if (mt && mt.classList && mt.classList.contains("section")) needsCheck = true;
      }
      if (needsCheck && canvasChanged) break;
    }
    if (needsCheck) setTimeout(tryInsert, 30);
    if (canvasChanged) setTimeout(applyStretch, 30);
  });
  function startObs() {
    if (!document.body) {
      setTimeout(startObs, 100);
      return;
    }
    _obs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [ "style", "class", "data-hook" ]
    });
  }
  startObs();
  window.addEventListener("resize", applyStretch, {
    passive: true
  });
  function tryApply() {
    if (document.querySelector("canvas")) applyStretch(); else requestAnimationFrame(tryApply);
  }
  tryApply();
  setInterval(function() {
    var canvas = document.querySelector("canvas");
    if (canvas && canvas !== _lastCanvas) applyStretch();
  }, 1e3);
  window._stretchedAddToVideosec = tryInsert;
})();
