(function() {
  if (typeof Injector !== "undefined" && Injector.isMainFrame && Injector.isMainFrame()) return;
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  function ensureStyles(doc) {
    if (doc.getElementById("hbxrip-styles")) return;
    var style = doc.createElement("style");
    style.id = "hbxrip-styles";
    style.textContent = [ ".hbxrip-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .16s ease;}", ".hbxrip-overlay.is-open{opacity:1;}", ".hbxrip-card{width:420px;max-width:92vw;max-height:86vh;background:var(--theme-bg-primary);border:1px solid var(--theme-border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;transform:translateY(10px) scale(.98);transition:transform .16s ease;}", ".hbxrip-overlay.is-open .hbxrip-card{transform:translateY(0) scale(1);}", ".hbxrip-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--theme-border);flex-shrink:0;}", ".hbxrip-title{display:flex;align-items:center;gap:8px;color:var(--theme-text-primary);font-size:14px;font-weight:700;letter-spacing:.2px;}", ".hbxrip-close{width:26px;height:26px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);color:var(--theme-text-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}", ".hbxrip-close:hover{color:#dc2626;border-color:#dc2626;background:rgba(220,38,38,.08);}", ".hbxrip-body{overflow-y:auto;padding:14px 16px 18px;flex:1;display:flex;flex-direction:column;gap:12px;}", ".hbxrip-sectitle{color:var(--theme-text-primary);font-size:12.5px;font-weight:600;letter-spacing:.2px;margin-top:2px;}", ".hbxrip-hint{color:var(--theme-text-muted);font-size:10.5px;line-height:1.5;}", ".hbxrip-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;}", ".hbxrip-row .lbl{color:var(--theme-text-primary);font-size:12px;}", ".hbxrip-toggle{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:6px;cursor:pointer;}", ".hbxrip-toggle:hover{background:var(--theme-bg-hover);}", ".hbxrip-chk{width:17px;height:17px;border:2px solid var(--theme-border-light);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}", ".hbxrip-chk.on{background:#c9a227;border-color:#c9a227;}", ".hbxrip-range{flex:1;}", ".hbxrip-meta{color:var(--theme-text-muted);font-size:10.5px;min-width:34px;text-align:right;}", ".hbxrip-divider{height:1px;background:var(--theme-border);margin:2px 0;}", ".hbxrip-fade{transition:opacity .12s ease;}", ".hbxrip-fade.is-off{opacity:.4;pointer-events:none;}", ".hbxrip-btnrow{display:flex;gap:8px;flex-wrap:wrap;}", ".hbxrip-btn{padding:7px 12px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-primary);color:var(--theme-text-primary);font-size:11.5px;cursor:pointer;}", ".hbxrip-btn:hover{background:var(--theme-bg-hover);}", ".hbxrip-preview{display:flex;align-items:center;justify-content:center;margin-bottom:6px;padding:16px 0;}", ".hbxrip-pv-card{display:flex;flex-direction:column;align-items:flex-start;gap:1px;border-radius:8px;max-width:220px;}", ".hbxrip-pv-name{font-size:13px;font-weight:800;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px;}", ".hbxrip-pv-meta{font-size:10.5px;font-weight:600;letter-spacing:.02em;color:rgba(255,255,255,.55);line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px;}" ].join("");
    doc.head.appendChild(style);
  }
  function el(doc, tag, cls, html) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function toggleRow(doc, label, hint, initial, onChange) {
    var row = el(doc, "div", "hbxrip-toggle");
    var chk = el(doc, "div", "hbxrip-chk", '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" style="opacity:0"><polyline points="20 6 9 17 4 12"/></svg>');
    var textWrap = el(doc, "div");
    textWrap.style.cssText = "flex:1;min-width:0;";
    var titleEl = el(doc, "div", null, label);
    titleEl.style.cssText = "color:var(--theme-text-primary);font-size:12.5px;font-weight:500;";
    textWrap.appendChild(titleEl);
    if (hint) {
      var hintEl = el(doc, "div", "hbxrip-hint", hint);
      textWrap.appendChild(hintEl);
    }
    row.appendChild(chk);
    row.appendChild(textWrap);
    var state = !!initial;
    function paint() {
      chk.className = "hbxrip-chk" + (state ? " on" : "");
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
    var row = el(doc, "div", "hbxrip-row");
    var lbl = el(doc, "span", "lbl", label);
    var right = el(doc, "div");
    right.style.cssText = "display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;";
    var input = doc.createElement("input");
    input.type = "range";
    input.className = "hbxrip-range";
    input.min = String(min);
    input.max = String(max);
    input.value = String(initial);
    var meta = el(doc, "span", "hbxrip-meta", initial + (unit || ""));
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
    var row = el(doc, "div", "hbxrip-row");
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
    var wrap = el(doc, "div", "hbxrip-preview");
    var card = el(doc, "div", "hbxrip-pv-card");
    var name = el(doc, "div", "hbxrip-pv-name", t("Mi Sala de Prueba"));
    var meta = el(doc, "div", "hbxrip-pv-meta", "6/10 · " + t("Estadio Panorama"));
    card.appendChild(name);
    card.appendChild(meta);
    wrap.appendChild(card);
    function paint(c) {
      name.style.display = c.showName ? "block" : "none";
      name.style.color = c.color || "#ffffff";
      var metaParts = [];
      if (c.showPlayers) metaParts.push("6/10");
      if (c.showMap) metaParts.push(t("Estadio Panorama"));
      meta.textContent = metaParts.join(" · ");
      meta.style.display = metaParts.length ? "block" : "none";
      var glass = !!c.bg;
      card.style.background = glass ? "rgba(19,20,26,.55)" : "transparent";
      card.style.boxShadow = glass ? "0 0 0 1px rgba(255,255,255,.06)" : "none";
      card.style.padding = glass ? "8px 14px" : "0";
    }
    paint(cfg);
    wrap._paint = paint;
    return wrap;
  }
  function buildBody(doc) {
    var body = el(doc, "div", "hbxrip-body");
    function engine() {
      return window.DerviRoomInfo;
    }
    if (!engine()) {
      body.appendChild(el(doc, "div", "hbxrip-hint", t("DerviRoomInfo no está disponible todavía. Abrí el panel de nuevo cuando el juego termine de cargar.")));
      return body;
    }
    var init = engine().getConfig();
    var preview = buildPreview(doc, init);
    body.appendChild(preview);
    var enabledRow = toggleRow(doc, t("Room Info"), t("Si lo apagás, no se muestra ningún dato de la sala."), init.enabled, function(val) {
      engine().setEnabled(val);
      refreshVisibility();
    });
    body.appendChild(enabledRow);
    var fade = el(doc, "div", "hbxrip-fade");
    fade.style.cssText = "display:flex;flex-direction:column;gap:10px;";
    fade.appendChild(el(doc, "div", "hbxrip-divider"));
    fade.appendChild(el(doc, "div", "hbxrip-sectitle", t("Líneas")));
    var nameRow = toggleRow(doc, t("Mostrar nombre de sala"), null, init.showName, function(val) {
      engine().setShowName(val);
    });
    fade.appendChild(nameRow);
    var playersRow = toggleRow(doc, t("Mostrar jugadores"), t("Jugando / total en la sala."), init.showPlayers, function(val) {
      engine().setShowPlayers(val);
    });
    fade.appendChild(playersRow);
    var mapRow = toggleRow(doc, t("Mostrar mapa"), null, init.showMap, function(val) {
      engine().setShowMap(val);
    });
    fade.appendChild(mapRow);
    fade.appendChild(el(doc, "div", "hbxrip-divider"));
    fade.appendChild(el(doc, "div", "hbxrip-sectitle", t("Colores")));
    var colorObj = colorRow(doc, t("Color del nombre"), init.color, function(v) {
      engine().setColor(v);
    });
    fade.appendChild(colorObj.row);
    fade.appendChild(el(doc, "div", "hbxrip-divider"));
    fade.appendChild(el(doc, "div", "hbxrip-sectitle", t("Apariencia")));
    var bgRow = toggleRow(doc, t("Fondo"), t("Vidrio oscuro detrás del texto."), init.bg, function(val) {
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
    fade.appendChild(el(doc, "div", "hbxrip-divider"));
    fade.appendChild(el(doc, "div", "hbxrip-sectitle", t("Posición")));
    var offXObj = rangeRow(doc, t("Horizontal"), -2e3, 2e3, init.offsetX, "px", function(v) {
      engine().setOffsetX(v);
    });
    fade.appendChild(offXObj.row);
    var offYObj = rangeRow(doc, t("Vertical"), -2e3, 2e3, init.offsetY, "px", function(v) {
      engine().setOffsetY(v);
    });
    fade.appendChild(offYObj.row);
    var resetRow = el(doc, "div", "hbxrip-btnrow");
    var resetBtn = el(doc, "button", "hbxrip-btn", t("Restablecer posición"));
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
      nameRow._setState(c.showName);
      playersRow._setState(c.showPlayers);
      mapRow._setState(c.showMap);
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
    window.addEventListener("Dervi:roominfo", refresh);
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
    var overlay = el(doc, "div", "hbxrip-overlay");
    var card = el(doc, "div", "hbxrip-card");
    var head = el(doc, "div", "hbxrip-head");
    var titleWrap = el(doc, "div", "hbxrip-title", '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M7 13h5"/><path d="M7 16.5h8"/></svg><span>' + t("Room Info") + "</span>");
    var closeBtn = el(doc, "button", "hbxrip-close", '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
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
  window.HbxRoomInfo = {
    openPanel: function(doc) {
      openPanel(doc || document);
    },
    closePanel: closePanel
  };
})();