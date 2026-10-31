(function() {
  if (typeof Injector !== "undefined" && Injector.isMainFrame && Injector.isMainFrame()) return;
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  function ensureStyles(doc) {
    if (doc.getElementById("hbxclkp-styles")) return;
    var style = doc.createElement("style");
    style.id = "hbxclkp-styles";
    style.textContent = [ ".hbxclkp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .16s ease;}", ".hbxclkp-overlay.is-open{opacity:1;}", ".hbxclkp-card{width:420px;max-width:92vw;max-height:86vh;background:var(--theme-bg-primary);border:1px solid var(--theme-border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;transform:translateY(10px) scale(.98);transition:transform .16s ease;}", ".hbxclkp-overlay.is-open .hbxclkp-card{transform:translateY(0) scale(1);}", ".hbxclkp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--theme-border);flex-shrink:0;}", ".hbxclkp-title{display:flex;align-items:center;gap:8px;color:var(--theme-text-primary);font-size:14px;font-weight:700;letter-spacing:.2px;}", ".hbxclkp-close{width:26px;height:26px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);color:var(--theme-text-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}", ".hbxclkp-close:hover{color:#dc2626;border-color:#dc2626;background:rgba(220,38,38,.08);}", ".hbxclkp-body{overflow-y:auto;padding:14px 16px 18px;flex:1;display:flex;flex-direction:column;gap:12px;}", ".hbxclkp-sectitle{color:var(--theme-text-primary);font-size:12.5px;font-weight:600;letter-spacing:.2px;margin-top:2px;}", ".hbxclkp-hint{color:var(--theme-text-muted);font-size:10.5px;line-height:1.5;}", ".hbxclkp-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;}", ".hbxclkp-row .lbl{color:var(--theme-text-primary);font-size:12px;}", ".hbxclkp-toggle{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:6px;cursor:pointer;}", ".hbxclkp-toggle:hover{background:var(--theme-bg-hover);}", ".hbxclkp-chk{width:17px;height:17px;border:2px solid var(--theme-border-light);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}", ".hbxclkp-chk.on{background:#c9a227;border-color:#c9a227;}", ".hbxclkp-range{flex:1;}", ".hbxclkp-meta{color:var(--theme-text-muted);font-size:10.5px;min-width:34px;text-align:right;}", ".hbxclkp-divider{height:1px;background:var(--theme-border);margin:2px 0;}", ".hbxclkp-fade{transition:opacity .12s ease;}", ".hbxclkp-fade.is-off{opacity:.4;pointer-events:none;}", ".hbxclkp-btnrow{display:flex;gap:8px;flex-wrap:wrap;}", ".hbxclkp-btn{padding:7px 12px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-primary);color:var(--theme-text-primary);font-size:11.5px;cursor:pointer;}", ".hbxclkp-btn:hover{background:var(--theme-bg-hover);}", ".hbxclkp-preview{display:flex;align-items:center;justify-content:center;margin-bottom:6px;padding:18px 0;}", ".hbxclkp-pv-chip{display:inline-flex;align-items:baseline;gap:4px;border-radius:6px;}", ".hbxclkp-pv-num{font-size:20px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;}", ".hbxclkp-pv-label{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:rgba(255,255,255,.5);line-height:1;}" ].join("");
    doc.head.appendChild(style);
  }
  function el(doc, tag, cls, html) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function toggleRow(doc, label, hint, initial, onChange) {
    var row = el(doc, "div", "hbxclkp-toggle");
    var chk = el(doc, "div", "hbxclkp-chk", '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" style="opacity:0"><polyline points="20 6 9 17 4 12"/></svg>');
    var textWrap = el(doc, "div");
    textWrap.style.cssText = "flex:1;min-width:0;";
    var titleEl = el(doc, "div", null, label);
    titleEl.style.cssText = "color:var(--theme-text-primary);font-size:12.5px;font-weight:500;";
    textWrap.appendChild(titleEl);
    if (hint) {
      var hintEl = el(doc, "div", "hbxclkp-hint", hint);
      textWrap.appendChild(hintEl);
    }
    row.appendChild(chk);
    row.appendChild(textWrap);
    var state = !!initial;
    function paint() {
      chk.className = "hbxclkp-chk" + (state ? " on" : "");
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
    var row = el(doc, "div", "hbxclkp-row");
    var lbl = el(doc, "span", "lbl", label);
    var right = el(doc, "div");
    right.style.cssText = "display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;";
    var input = doc.createElement("input");
    input.type = "range";
    input.className = "hbxclkp-range";
    input.min = String(min);
    input.max = String(max);
    input.value = String(initial);
    var meta = el(doc, "span", "hbxclkp-meta", initial + (unit || ""));
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
    var row = el(doc, "div", "hbxclkp-row");
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
  function formatPreview(c) {
    var h = 14, m = 35, s = 9;
    var suffix = "";
    if (c.hour12) {
      suffix = h >= 12 ? " PM" : " AM";
      h = h % 12;
      if (h === 0) h = 12;
    }
    var text = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
    if (c.showSeconds) text += ":" + String(s).padStart(2, "0");
    return text + suffix;
  }
  function buildPreview(doc, cfg) {
    var wrap = el(doc, "div", "hbxclkp-preview");
    var chip = el(doc, "div", "hbxclkp-pv-chip");
    var num = el(doc, "span", "hbxclkp-pv-num", formatPreview(cfg));
    var label = el(doc, "span", "hbxclkp-pv-label", "CLOCK");
    chip.appendChild(num);
    chip.appendChild(label);
    wrap.appendChild(chip);
    function paint(c) {
      label.style.display = c.showLabel ? "inline" : "none";
      num.textContent = formatPreview(c);
      num.style.color = c.color || "#ffffff";
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
    var body = el(doc, "div", "hbxclkp-body");
    function engine() {
      return window.DerviClock;
    }
    if (!engine()) {
      body.appendChild(el(doc, "div", "hbxclkp-hint", t("DerviClock no está disponible todavía. Abrí el panel de nuevo cuando el juego termine de cargar.")));
      return body;
    }
    var init = engine().getConfig();
    var preview = buildPreview(doc, init);
    body.appendChild(preview);
    var enabledRow = toggleRow(doc, t("Reloj"), t("Si lo apagás, no se muestra la hora en pantalla."), init.enabled, function(val) {
      engine().setEnabled(val);
      refreshVisibility();
    });
    body.appendChild(enabledRow);
    var fade = el(doc, "div", "hbxclkp-fade");
    fade.style.cssText = "display:flex;flex-direction:column;gap:10px;";
    fade.appendChild(el(doc, "div", "hbxclkp-divider"));
    fade.appendChild(el(doc, "div", "hbxclkp-sectitle", t("Formato")));
    var hour12Row = toggleRow(doc, t("Formato 12 horas"), t("AM/PM en vez de formato 24 horas."), init.hour12, function(val) {
      engine().setHour12(val);
      preview._paint(engine().getConfig());
    });
    fade.appendChild(hour12Row);
    var secRow = toggleRow(doc, t("Mostrar segundos"), null, init.showSeconds, function(val) {
      engine().setShowSeconds(val);
      preview._paint(engine().getConfig());
    });
    fade.appendChild(secRow);
    var labelRow = toggleRow(doc, t('Mostrar etiqueta "CLOCK"'), null, init.showLabel, function(val) {
      engine().setShowLabel(val);
    });
    fade.appendChild(labelRow);
    fade.appendChild(el(doc, "div", "hbxclkp-divider"));
    fade.appendChild(el(doc, "div", "hbxclkp-sectitle", t("Apariencia")));
    var colorObj = colorRow(doc, t("Color"), init.color, function(v) {
      engine().setColor(v);
    });
    fade.appendChild(colorObj.row);
    var bgRow = toggleRow(doc, t("Fondo"), t("Vidrio oscuro detrás de la hora."), init.bg, function(val) {
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
    fade.appendChild(el(doc, "div", "hbxclkp-divider"));
    fade.appendChild(el(doc, "div", "hbxclkp-sectitle", t("Posición")));
    var offXObj = rangeRow(doc, t("Horizontal"), -2e3, 2e3, init.offsetX, "px", function(v) {
      engine().setOffsetX(v);
    });
    fade.appendChild(offXObj.row);
    var offYObj = rangeRow(doc, t("Vertical"), -2e3, 2e3, init.offsetY, "px", function(v) {
      engine().setOffsetY(v);
    });
    fade.appendChild(offYObj.row);
    var resetRow = el(doc, "div", "hbxclkp-btnrow");
    var resetBtn = el(doc, "button", "hbxclkp-btn", t("Restablecer posición"));
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
    function refresh() {
      var c = engine().getConfig();
      enabledRow._setState(c.enabled);
      hour12Row._setState(c.hour12);
      secRow._setState(c.showSeconds);
      labelRow._setState(c.showLabel);
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
    }
    window.addEventListener("Dervi:clock", refresh);
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
    var overlay = el(doc, "div", "hbxclkp-overlay");
    var card = el(doc, "div", "hbxclkp-card");
    var head = el(doc, "div", "hbxclkp-head");
    var titleWrap = el(doc, "div", "hbxclkp-title", '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 1.8"/></svg><span>' + t("Clock") + "</span>");
    var closeBtn = el(doc, "button", "hbxclkp-close", '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
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
  window.HbxClock = {
    openPanel: function(doc) {
      openPanel(doc || document);
    },
    closePanel: closePanel
  };
})();