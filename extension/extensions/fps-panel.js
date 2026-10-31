(function() {
  if (typeof Injector !== "undefined" && Injector.isMainFrame && Injector.isMainFrame()) return;
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  function ensureStyles(doc) {
    if (doc.getElementById("hbxfpsp-styles")) return;
    var style = doc.createElement("style");
    style.id = "hbxfpsp-styles";
    style.textContent = [ ".hbxfpsp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .16s ease;}", ".hbxfpsp-overlay.is-open{opacity:1;}", ".hbxfpsp-card{width:420px;max-width:92vw;max-height:86vh;background:var(--theme-bg-primary);border:1px solid var(--theme-border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;transform:translateY(10px) scale(.98);transition:transform .16s ease;}", ".hbxfpsp-overlay.is-open .hbxfpsp-card{transform:translateY(0) scale(1);}", ".hbxfpsp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--theme-border);flex-shrink:0;}", ".hbxfpsp-title{display:flex;align-items:center;gap:8px;color:var(--theme-text-primary);font-size:14px;font-weight:700;letter-spacing:.2px;}", ".hbxfpsp-close{width:26px;height:26px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);color:var(--theme-text-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}", ".hbxfpsp-close:hover{color:#dc2626;border-color:#dc2626;background:rgba(220,38,38,.08);}", ".hbxfpsp-body{overflow-y:auto;padding:14px 16px 18px;flex:1;display:flex;flex-direction:column;gap:12px;}", ".hbxfpsp-sectitle{color:var(--theme-text-primary);font-size:12.5px;font-weight:600;letter-spacing:.2px;margin-top:2px;}", ".hbxfpsp-hint{color:var(--theme-text-muted);font-size:10.5px;line-height:1.5;}", ".hbxfpsp-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;}", ".hbxfpsp-row .lbl{color:var(--theme-text-primary);font-size:12px;}", ".hbxfpsp-toggle{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:6px;cursor:pointer;}", ".hbxfpsp-toggle:hover{background:var(--theme-bg-hover);}", ".hbxfpsp-chk{width:17px;height:17px;border:2px solid var(--theme-border-light);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}", ".hbxfpsp-chk.on{background:#c9a227;border-color:#c9a227;}", ".hbxfpsp-range{flex:1;}", ".hbxfpsp-meta{color:var(--theme-text-muted);font-size:10.5px;min-width:34px;text-align:right;}", ".hbxfpsp-divider{height:1px;background:var(--theme-border);margin:2px 0;}", ".hbxfpsp-fade{transition:opacity .12s ease;}", ".hbxfpsp-fade.is-off{opacity:.4;pointer-events:none;}", ".hbxfpsp-btnrow{display:flex;gap:8px;flex-wrap:wrap;}", ".hbxfpsp-btn{padding:7px 12px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-primary);color:var(--theme-text-primary);font-size:11.5px;cursor:pointer;}", ".hbxfpsp-btn:hover{background:var(--theme-bg-hover);}", ".hbxfpsp-preview{display:flex;align-items:center;justify-content:center;margin-bottom:6px;padding:18px 0;}", ".hbxfpsp-pv-chip{display:inline-flex;align-items:baseline;gap:4px;border-radius:6px;}", ".hbxfpsp-pv-num{font-size:20px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;}", ".hbxfpsp-pv-label{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:rgba(255,255,255,.5);line-height:1;}" ].join("");
    doc.head.appendChild(style);
  }
  function el(doc, tag, cls, html) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function toggleRow(doc, label, hint, initial, onChange) {
    var row = el(doc, "div", "hbxfpsp-toggle");
    var chk = el(doc, "div", "hbxfpsp-chk", '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" style="opacity:0"><polyline points="20 6 9 17 4 12"/></svg>');
    var textWrap = el(doc, "div");
    textWrap.style.cssText = "flex:1;min-width:0;";
    var titleEl = el(doc, "div", null, label);
    titleEl.style.cssText = "color:var(--theme-text-primary);font-size:12.5px;font-weight:500;";
    textWrap.appendChild(titleEl);
    if (hint) {
      var hintEl = el(doc, "div", "hbxfpsp-hint", hint);
      textWrap.appendChild(hintEl);
    }
    row.appendChild(chk);
    row.appendChild(textWrap);
    var state = !!initial;
    function paint() {
      chk.className = "hbxfpsp-chk" + (state ? " on" : "");
      chk.querySelector("svg").style.opacity = state ? "1" : "0";
    }
    paint();
    row.onclick = function() {
      state = !state;
      paint();
      onChange(state);
    };
    row._setState = function(v) {
      state = !!v;
      paint();
    };
    return row;
  }
  function rangeRow(doc, label, min, max, initial, unit, onChange) {
    var row = el(doc, "div", "hbxfpsp-row");
    var lbl = el(doc, "span", "lbl", label);
    var right = el(doc, "div");
    right.style.cssText = "display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;";
    var input = doc.createElement("input");
    input.type = "range";
    input.className = "hbxfpsp-range";
    input.min = String(min);
    input.max = String(max);
    input.value = String(initial);
    var meta = el(doc, "span", "hbxfpsp-meta", initial + (unit || ""));
    input.oninput = function() {
      meta.textContent = input.value + (unit || "");
      onChange(parseFloat(input.value));
    };
    right.appendChild(input);
    right.appendChild(meta);
    row.appendChild(lbl);
    row.appendChild(right);
    return {
      row: row,
      input: input,
      meta: meta
    };
  }
  function colorRow(doc, label, initial, onChange) {
    var row = el(doc, "div", "hbxfpsp-row");
    var lbl = el(doc, "span", "lbl", label);
    var input = doc.createElement("input");
    input.type = "color";
    input.value = /^#/.test(initial) ? initial : "#ffffff";
    input.style.cssText = "width:34px;height:26px;padding:0;border:1px solid var(--theme-border);border-radius:5px;background:none;cursor:pointer;";
    input.oninput = function() {
      onChange(input.value);
    };
    row.appendChild(lbl);
    row.appendChild(input);
    return {
      row: row,
      input: input
    };
  }
  function buildPreview(doc, cfg) {
    var wrap = el(doc, "div", "hbxfpsp-preview");
    var chip = el(doc, "div", "hbxfpsp-pv-chip");
    var num = el(doc, "span", "hbxfpsp-pv-num", "60");
    var label = el(doc, "span", "hbxfpsp-pv-label", "FPS");
    chip.appendChild(num);
    chip.appendChild(label);
    wrap.appendChild(chip);
    function paint(c) {
      label.style.display = c.showLabel ? "inline" : "none";
      num.style.color = c.colorByFps ? "#07f361" : c.color || "#ffffff";
      var glass = !!c.bg;
      chip.style.background = glass ? "rgba(19,20,26,.55)" : "transparent";
      chip.style.boxShadow = glass ? "0 0 0 1px rgba(255,255,255,.06)" : "none";
      chip.style.padding = glass ? "5px 12px" : "0";
    }
    paint(cfg);
    wrap._paint = paint;
    return wrap;
  }
  function buildBody(doc) {
    var body = el(doc, "div", "hbxfpsp-body");
    function engine() {
      return window.DerviFps;
    }
    if (!engine()) {
      body.appendChild(el(doc, "div", "hbxfpsp-hint", t("DerviFps no está disponible todavía. Abrí el panel de nuevo cuando el juego termine de cargar.")));
      return body;
    }
    var init = engine().getConfig();
    var preview = buildPreview(doc, init);
    body.appendChild(preview);
    var enabledRow = toggleRow(doc, t("Contador de FPS"), t("Si lo apagás, no se muestra el contador en pantalla."), init.enabled, function(val) {
      engine().setEnabled(val);
      refreshVisibility();
    });
    body.appendChild(enabledRow);
    var fade = el(doc, "div", "hbxfpsp-fade");
    fade.style.cssText = "display:flex;flex-direction:column;gap:10px;";
    fade.appendChild(el(doc, "div", "hbxfpsp-divider"));
    fade.appendChild(el(doc, "div", "hbxfpsp-sectitle", t("Datos")));
    var labelRow = toggleRow(doc, t('Mostrar etiqueta "FPS"'), null, init.showLabel, function(val) {
      engine().setShowLabel(val);
    });
    fade.appendChild(labelRow);
    fade.appendChild(el(doc, "div", "hbxfpsp-divider"));
    fade.appendChild(el(doc, "div", "hbxfpsp-sectitle", t("Colores")));
    var autoRow = toggleRow(doc, t("Color según rendimiento"), t("Verde con FPS alto, amarillo/rojo cuando baja. Si lo apagás, se usa el color de abajo."), init.colorByFps, function(val) {
      engine().setColorByFps(val);
      refreshColorLink();
    });
    fade.appendChild(autoRow);
    var colorObj = colorRow(doc, t("Color manual"), init.color, function(v) {
      engine().setColor(v);
    });
    colorObj.row.classList.add("hbxfpsp-fade");
    fade.appendChild(colorObj.row);
    fade.appendChild(el(doc, "div", "hbxfpsp-divider"));
    fade.appendChild(el(doc, "div", "hbxfpsp-sectitle", t("Apariencia")));
    var bgRow = toggleRow(doc, t("Fondo"), t("Vidrio oscuro detrás del número."), init.bg, function(val) {
      engine().setBg(val);
    });
    fade.appendChild(bgRow);
    var opacityObj = rangeRow(doc, t("Opacidad"), 20, 100, init.opacity, "%", function(v) {
      engine().setOpacity(v);
    });
    fade.appendChild(opacityObj.row);
    var scaleObj = rangeRow(doc, t("Escala"), 50, 180, init.scale, "%", function(v) {
      engine().setScale(v);
    });
    fade.appendChild(scaleObj.row);
    fade.appendChild(el(doc, "div", "hbxfpsp-divider"));
    fade.appendChild(el(doc, "div", "hbxfpsp-sectitle", t("Posición")));
    var offXObj = rangeRow(doc, t("Horizontal"), -2e3, 2e3, init.offsetX, "px", function(v) {
      engine().setOffsetX(v);
    });
    fade.appendChild(offXObj.row);
    var offYObj = rangeRow(doc, t("Vertical"), -2e3, 2e3, init.offsetY, "px", function(v) {
      engine().setOffsetY(v);
    });
    fade.appendChild(offYObj.row);
    var resetRow = el(doc, "div", "hbxfpsp-btnrow");
    var resetBtn = el(doc, "button", "hbxfpsp-btn", t("Restablecer posición"));
    resetBtn.type = "button";
    resetBtn.onclick = function() {
      engine().resetPosition();
    };
    resetRow.appendChild(resetBtn);
    fade.appendChild(resetRow);
    fade.appendChild(el(doc, "div", "hbxfpsp-divider"));
    fade.appendChild(el(doc, "div", "hbxfpsp-sectitle", t("FPS extra")));
    fade.appendChild(el(doc, "div", "hbxfpsp-hint", t("Se suma al valor real, en vivo. 0 = no altera nada (predeterminado).")));
    var boostObj = rangeRow(doc, t("Sumar"), 0, 500, init.fpsBoost || 0, "", function(v) {
      engine().setFpsBoost(v);
    });
    fade.appendChild(boostObj.row);
    body.appendChild(fade);
    function refreshVisibility() {
      fade.classList.toggle("is-off", !engine().getConfig().enabled);
    }
    refreshVisibility();
    function refreshColorLink() {
      colorObj.row.classList.toggle("is-off", !!engine().getConfig().colorByFps);
    }
    refreshColorLink();
    function refresh() {
      var c = engine().getConfig();
      enabledRow._setState(c.enabled);
      labelRow._setState(c.showLabel);
      autoRow._setState(c.colorByFps);
      colorObj.input.value = /^#/.test(c.color) ? c.color : "#ffffff";
      bgRow._setState(c.bg);
      opacityObj.input.value = String(c.opacity);
      opacityObj.meta.textContent = c.opacity + "%";
      scaleObj.input.value = String(c.scale);
      scaleObj.meta.textContent = c.scale + "%";
      offXObj.input.value = String(c.offsetX);
      offXObj.meta.textContent = c.offsetX + "px";
      offYObj.input.value = String(c.offsetY);
      offYObj.meta.textContent = c.offsetY + "px";
      boostObj.input.value = String(c.fpsBoost || 0);
      boostObj.meta.textContent = String(c.fpsBoost || 0);
      preview._paint(c);
      refreshVisibility();
      refreshColorLink();
    }
    window.addEventListener("Dervi:fps", refresh);
    return body;
  }
  var overlayEl = null;
  function closePanel() {
    if (!overlayEl) return;
    overlayEl.classList.remove("is-open");
    var ref = overlayEl;
    setTimeout(function() {
      if (ref && ref.parentNode) ref.parentNode.removeChild(ref);
    }, 160);
    overlayEl = null;
  }
  function openPanel(doc) {
    doc = doc || document;
    ensureStyles(doc);
    if (overlayEl) closePanel();
    var overlay = el(doc, "div", "hbxfpsp-overlay");
    var card = el(doc, "div", "hbxfpsp-card");
    var head = el(doc, "div", "hbxfpsp-head");
    var titleWrap = el(doc, "div", "hbxfpsp-title", '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l6 3"/><path d="M12 2a10 10 0 0 1 8.66 5"/></svg><span>' + t("FPS") + "</span>");
    var closeBtn = el(doc, "button", "hbxfpsp-close", '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
    closeBtn.type = "button";
    closeBtn.onclick = closePanel;
    head.appendChild(titleWrap);
    head.appendChild(closeBtn);
    var body = buildBody(doc);
    card.appendChild(head);
    card.appendChild(body);
    overlay.appendChild(card);
    overlay.onclick = function(ev) {
      if (ev.target === overlay) closePanel();
    };
    doc.body.appendChild(overlay);
    overlayEl = overlay;
    requestAnimationFrame(function() {
      overlay.classList.add("is-open");
    });
  }
  window.HbxFps = {
    openPanel: function(doc) {
      openPanel(doc || document);
    },
    closePanel: closePanel
  };
})();