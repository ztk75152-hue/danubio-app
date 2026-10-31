(function() {
  if (typeof Injector !== "undefined" && Injector.isMainFrame && Injector.isMainFrame()) return;
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  function ensureStyles(doc) {
    if (doc.getElementById("hbxpngp-styles")) return;
    var style = doc.createElement("style");
    style.id = "hbxpngp-styles";
    style.textContent = [ ".hbxpngp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .16s ease;}", ".hbxpngp-overlay.is-open{opacity:1;}", ".hbxpngp-card{width:420px;max-width:92vw;max-height:86vh;background:var(--theme-bg-primary);border:1px solid var(--theme-border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;transform:translateY(10px) scale(.98);transition:transform .16s ease;}", ".hbxpngp-overlay.is-open .hbxpngp-card{transform:translateY(0) scale(1);}", ".hbxpngp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--theme-border);flex-shrink:0;}", ".hbxpngp-title{display:flex;align-items:center;gap:8px;color:var(--theme-text-primary);font-size:14px;font-weight:700;letter-spacing:.2px;}", ".hbxpngp-close{width:26px;height:26px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);color:var(--theme-text-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}", ".hbxpngp-close:hover{color:#dc2626;border-color:#dc2626;background:rgba(220,38,38,.08);}", ".hbxpngp-body{overflow-y:auto;padding:14px 16px 18px;flex:1;display:flex;flex-direction:column;gap:12px;}", ".hbxpngp-sectitle{color:var(--theme-text-primary);font-size:12.5px;font-weight:600;letter-spacing:.2px;margin-top:2px;}", ".hbxpngp-hint{color:var(--theme-text-muted);font-size:10.5px;line-height:1.5;}", ".hbxpngp-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;}", ".hbxpngp-row .lbl{color:var(--theme-text-primary);font-size:12px;}", ".hbxpngp-toggle{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:6px;cursor:pointer;}", ".hbxpngp-toggle:hover{background:var(--theme-bg-hover);}", ".hbxpngp-chk{width:17px;height:17px;border:2px solid var(--theme-border-light);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}", ".hbxpngp-chk.on{background:#c9a227;border-color:#c9a227;}", ".hbxpngp-range{flex:1;}", ".hbxpngp-meta{color:var(--theme-text-muted);font-size:10.5px;min-width:34px;text-align:right;}", ".hbxpngp-divider{height:1px;background:var(--theme-border);margin:2px 0;}", ".hbxpngp-fade{transition:opacity .12s ease;}", ".hbxpngp-fade.is-off{opacity:.4;pointer-events:none;}", ".hbxpngp-btnrow{display:flex;gap:8px;flex-wrap:wrap;}", ".hbxpngp-btn{padding:7px 12px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-primary);color:var(--theme-text-primary);font-size:11.5px;cursor:pointer;}", ".hbxpngp-btn:hover{background:var(--theme-bg-hover);}", ".hbxpngp-preview{display:flex;align-items:center;justify-content:center;margin-bottom:6px;padding:18px 0;}", ".hbxpngp-pv-chip{display:inline-flex;align-items:baseline;gap:4px;border-radius:6px;}", ".hbxpngp-pv-num{font-size:20px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;}", ".hbxpngp-pv-label{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:rgba(255,255,255,.5);line-height:1;}" ].join("");
    doc.head.appendChild(style);
  }
  function el(doc, tag, cls, html) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function toggleRow(doc, label, hint, initial, onChange) {
    var row = el(doc, "div", "hbxpngp-toggle");
    var chk = el(doc, "div", "hbxpngp-chk", '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" style="opacity:0"><polyline points="20 6 9 17 4 12"/></svg>');
    var textWrap = el(doc, "div");
    textWrap.style.cssText = "flex:1;min-width:0;";
    var titleEl = el(doc, "div", null, label);
    titleEl.style.cssText = "color:var(--theme-text-primary);font-size:12.5px;font-weight:500;";
    textWrap.appendChild(titleEl);
    if (hint) {
      var hintEl = el(doc, "div", "hbxpngp-hint", hint);
      textWrap.appendChild(hintEl);
    }
    row.appendChild(chk);
    row.appendChild(textWrap);
    var state = !!initial;
    function paint() {
      chk.className = "hbxpngp-chk" + (state ? " on" : "");
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
    var row = el(doc, "div", "hbxpngp-row");
    var lbl = el(doc, "span", "lbl", label);
    var right = el(doc, "div");
    right.style.cssText = "display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;";
    var input = doc.createElement("input");
    input.type = "range";
    input.className = "hbxpngp-range";
    input.min = String(min);
    input.max = String(max);
    input.value = String(initial);
    var meta = el(doc, "span", "hbxpngp-meta", initial + (unit || ""));
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
    var row = el(doc, "div", "hbxpngp-row");
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
    var wrap = el(doc, "div", "hbxpngp-preview");
    var chip = el(doc, "div", "hbxpngp-pv-chip");
    var num = el(doc, "span", "hbxpngp-pv-num", "35");
    var label = el(doc, "span", "hbxpngp-pv-label", "PING");
    chip.appendChild(num);
    chip.appendChild(label);
    wrap.appendChild(chip);
    function paint(c) {
      label.style.display = c.showLabel ? "inline" : "none";
      num.textContent = "35" + (c.showMs ? " ms" : "");
      num.style.color = c.colorByPing ? "#07f361" : c.color || "#ffffff";
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
    var body = el(doc, "div", "hbxpngp-body");
    function engine() {
      return window.DerviPing;
    }
    if (!engine()) {
      body.appendChild(el(doc, "div", "hbxpngp-hint", t("DerviPing no está disponible todavía. Abrí el panel de nuevo cuando el juego termine de cargar.")));
      return body;
    }
    var init = engine().getConfig();
    var preview = buildPreview(doc, init);
    body.appendChild(preview);
    var enabledRow = toggleRow(doc, t("Contador de Ping"), t("Si lo apagás, no se muestra el valor en pantalla."), init.enabled, function(val) {
      engine().setEnabled(val);
      refreshVisibility();
    });
    body.appendChild(enabledRow);
    var fade = el(doc, "div", "hbxpngp-fade");
    fade.style.cssText = "display:flex;flex-direction:column;gap:10px;";
    fade.appendChild(el(doc, "div", "hbxpngp-divider"));
    fade.appendChild(el(doc, "div", "hbxpngp-sectitle", t("Datos")));
    var labelRow = toggleRow(doc, t('Mostrar etiqueta "PING"'), null, init.showLabel, function(val) {
      engine().setShowLabel(val);
    });
    fade.appendChild(labelRow);
    var msRow = toggleRow(doc, t('Mostrar sufijo "ms"'), null, init.showMs, function(val) {
      engine().setShowMs(val);
    });
    fade.appendChild(msRow);
    fade.appendChild(el(doc, "div", "hbxpngp-divider"));
    fade.appendChild(el(doc, "div", "hbxpngp-sectitle", t("Colores")));
    var autoRow = toggleRow(doc, t("Color según calidad"), t("Verde con ping bajo, amarillo/rojo cuando sube. Si lo apagás, se usa el color de abajo."), init.colorByPing, function(val) {
      engine().setColorByPing(val);
      refreshColorLink();
    });
    fade.appendChild(autoRow);
    var colorObj = colorRow(doc, t("Color manual"), init.color, function(v) {
      engine().setColor(v);
    });
    colorObj.row.classList.add("hbxpngp-fade");
    fade.appendChild(colorObj.row);
    fade.appendChild(el(doc, "div", "hbxpngp-divider"));
    fade.appendChild(el(doc, "div", "hbxpngp-sectitle", t("Apariencia")));
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
    fade.appendChild(el(doc, "div", "hbxpngp-divider"));
    fade.appendChild(el(doc, "div", "hbxpngp-sectitle", t("Posición")));
    var offXObj = rangeRow(doc, t("Horizontal"), -2e3, 2e3, init.offsetX, "px", function(v) {
      engine().setOffsetX(v);
    });
    fade.appendChild(offXObj.row);
    var offYObj = rangeRow(doc, t("Vertical"), -2e3, 2e3, init.offsetY, "px", function(v) {
      engine().setOffsetY(v);
    });
    fade.appendChild(offYObj.row);
    var resetRow = el(doc, "div", "hbxpngp-btnrow");
    var resetBtn = el(doc, "button", "hbxpngp-btn", t("Restablecer posición"));
    resetBtn.type = "button";
    resetBtn.onclick = function() {
      engine().resetPosition();
    };
    resetRow.appendChild(resetBtn);
    fade.appendChild(resetRow);
    body.appendChild(fade);
    function refreshVisibility() {
      fade.classList.toggle("is-off", !engine().getConfig().enabled);
    }
    refreshVisibility();
    function refreshColorLink() {
      colorObj.row.classList.toggle("is-off", !!engine().getConfig().colorByPing);
    }
    refreshColorLink();
    function refresh() {
      var c = engine().getConfig();
      enabledRow._setState(c.enabled);
      labelRow._setState(c.showLabel);
      msRow._setState(c.showMs);
      autoRow._setState(c.colorByPing);
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
      preview._paint(c);
      refreshVisibility();
      refreshColorLink();
    }
    window.addEventListener("Dervi:ping", refresh);
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
    var overlay = el(doc, "div", "hbxpngp-overlay");
    var card = el(doc, "div", "hbxpngp-card");
    var head = el(doc, "div", "hbxpngp-head");
    var titleWrap = el(doc, "div", "hbxpngp-title", '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12" y2="20"/></svg><span>' + t("Ping") + "</span>");
    var closeBtn = el(doc, "button", "hbxpngp-close", '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
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
  window.HbxPing = {
    openPanel: function(doc) {
      openPanel(doc || document);
    },
    closePanel: closePanel
  };
})();