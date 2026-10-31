(function() {
  if (typeof Injector !== "undefined" && Injector.isMainFrame && Injector.isMainFrame()) return;
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  function ensureStyles(doc) {
    if (doc.getElementById("hbxksp-styles")) return;
    var style = doc.createElement("style");
    style.id = "hbxksp-styles";
    style.textContent = [ ".hbxksp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .16s ease;}", ".hbxksp-overlay.is-open{opacity:1;}", ".hbxksp-card{width:420px;max-width:92vw;max-height:86vh;background:var(--theme-bg-primary);border:1px solid var(--theme-border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;transform:translateY(10px) scale(.98);transition:transform .16s ease;}", ".hbxksp-overlay.is-open .hbxksp-card{transform:translateY(0) scale(1);}", ".hbxksp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--theme-border);flex-shrink:0;}", ".hbxksp-title{display:flex;align-items:center;gap:8px;color:var(--theme-text-primary);font-size:14px;font-weight:700;letter-spacing:.2px;}", ".hbxksp-close{width:26px;height:26px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);color:var(--theme-text-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}", ".hbxksp-close:hover{color:#dc2626;border-color:#dc2626;background:rgba(220,38,38,.08);}", ".hbxksp-body{overflow-y:auto;padding:14px 16px 18px;flex:1;display:flex;flex-direction:column;gap:12px;}", ".hbxksp-sectitle{color:var(--theme-text-primary);font-size:12.5px;font-weight:600;letter-spacing:.2px;margin-top:2px;}", ".hbxksp-hint{color:var(--theme-text-muted);font-size:10.5px;line-height:1.5;}", ".hbxksp-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;}", ".hbxksp-row .lbl{color:var(--theme-text-primary);font-size:12px;}", ".hbxksp-toggle{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:6px;cursor:pointer;}", ".hbxksp-toggle:hover{background:var(--theme-bg-hover);}", ".hbxksp-chk{width:17px;height:17px;border:2px solid var(--theme-border-light);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}", ".hbxksp-chk.on{background:#c9a227;border-color:#c9a227;}", ".hbxksp-range{flex:1;}", ".hbxksp-meta{color:var(--theme-text-muted);font-size:10.5px;min-width:34px;text-align:right;}", ".hbxksp-divider{height:1px;background:var(--theme-border);margin:2px 0;}", ".hbxksp-fade{transition:opacity .12s ease;}", ".hbxksp-fade.is-off{opacity:.4;pointer-events:none;}", ".hbxksp-btnrow{display:flex;gap:8px;flex-wrap:wrap;}", ".hbxksp-btn{padding:7px 12px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-primary);color:var(--theme-text-primary);font-size:11.5px;cursor:pointer;}", ".hbxksp-btn:hover{background:var(--theme-bg-hover);}", ".hbxksp-select{padding:6px 8px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-primary);color:var(--theme-text-primary);font-size:11.5px;cursor:pointer;}", ".hbxksp-keybind{padding:6px 12px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-primary);color:var(--theme-text-primary);font-size:11.5px;font-weight:700;letter-spacing:.04em;cursor:pointer;min-width:76px;text-align:center;}", ".hbxksp-keybind:hover{background:var(--theme-bg-hover);}", ".hbxksp-keybind.is-listening{color:#c9a227;border-color:#c9a227;}", ".hbxksp-preview{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;margin-bottom:6px;padding:14px 0;}", ".hbxksp-pv-pad{display:grid;grid-template-columns:repeat(3,30px);grid-template-rows:repeat(2,30px);gap:4px;}", ".hbxksp-pv-key{position:relative;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:6px;font-size:13px;font-weight:800;color:rgba(255,255,255,.45);user-select:none;}", '.hbxksp-pv-key::after{content:"";position:absolute;left:22%;right:22%;bottom:3px;height:2px;border-radius:1px;opacity:.95;}', '.hbxksp-pv-pad [data-k="up"]{grid-column:2;grid-row:1;}', '.hbxksp-pv-pad [data-k="left"]{grid-column:1;grid-row:2;}', '.hbxksp-pv-pad [data-k="down"]{grid-column:2;grid-row:2;}', '.hbxksp-pv-pad [data-k="right"]{grid-column:3;grid-row:2;}', ".hbxksp-pv-kick{position:relative;display:inline-flex;align-items:center;justify-content:center;height:26px;min-width:26px;padding:0 10px;border-radius:6px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.45);user-select:none;}", '.hbxksp-pv-kick::after{content:"";position:absolute;left:18%;right:18%;bottom:3px;height:2px;border-radius:1px;opacity:.95;}' ].join("");
    doc.head.appendChild(style);
  }
  function el(doc, tag, cls, html) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function toggleRow(doc, label, hint, initial, onChange) {
    var row = el(doc, "div", "hbxksp-toggle");
    var chk = el(doc, "div", "hbxksp-chk", '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" style="opacity:0"><polyline points="20 6 9 17 4 12"/></svg>');
    var textWrap = el(doc, "div");
    textWrap.style.cssText = "flex:1;min-width:0;";
    var titleEl = el(doc, "div", null, label);
    titleEl.style.cssText = "color:var(--theme-text-primary);font-size:12.5px;font-weight:500;";
    textWrap.appendChild(titleEl);
    if (hint) {
      var hintEl = el(doc, "div", "hbxksp-hint", hint);
      textWrap.appendChild(hintEl);
    }
    row.appendChild(chk);
    row.appendChild(textWrap);
    var state = !!initial;
    function paint() {
      chk.className = "hbxksp-chk" + (state ? " on" : "");
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
    var row = el(doc, "div", "hbxksp-row");
    var lbl = el(doc, "span", "lbl", label);
    var right = el(doc, "div");
    right.style.cssText = "display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;";
    var input = doc.createElement("input");
    input.type = "range";
    input.className = "hbxksp-range";
    input.min = String(min);
    input.max = String(max);
    input.value = String(initial);
    var meta = el(doc, "span", "hbxksp-meta", initial + (unit || ""));
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
    var row = el(doc, "div", "hbxksp-row");
    var lbl = el(doc, "span", "lbl", label);
    var input = doc.createElement("input");
    input.type = "color";
    input.value = /^#/.test(initial) ? initial : "#000000";
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
  function selectRow(doc, label, options, initial, onChange) {
    var row = el(doc, "div", "hbxksp-row");
    var lbl = el(doc, "span", "lbl", label);
    var select = doc.createElement("select");
    select.className = "hbxksp-select";
    options.forEach(function(opt) {
      var o = doc.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      select.appendChild(o);
    });
    select.value = initial;
    select.onchange = function() {
      onChange(select.value);
    };
    row.appendChild(lbl);
    row.appendChild(select);
    return {
      row: row,
      select: select
    };
  }
  function keybindRow(doc, label, initialLabel, onCapture) {
    var row = el(doc, "div", "hbxksp-row");
    var lbl = el(doc, "span", "lbl", label);
    var btn = el(doc, "button", "hbxksp-keybind", initialLabel);
    btn.type = "button";
    var cancelListen = null;
    function stopListening(newLabel) {
      btn.classList.remove("is-listening");
      if (cancelListen) {
        cancelListen();
        cancelListen = null;
      }
      if (newLabel != null) btn.textContent = newLabel;
    }
    btn.onclick = function() {
      if (cancelListen) {
        stopListening();
        return;
      }
      var engine = window.DerviKeystrokes;
      if (!engine || typeof engine.captureNextKey !== "function") return;
      btn.textContent = t("Presioná una tecla…");
      btn.classList.add("is-listening");
      cancelListen = engine.captureNextKey(function(code) {
        cancelListen = null;
        btn.classList.remove("is-listening");
        onCapture(code);
      });
    };
    row.appendChild(lbl);
    row.appendChild(btn);
    return {
      row: row,
      btn: btn,
      setLabel: function(v) {
        if (!btn.classList.contains("is-listening")) btn.textContent = v;
      }
    };
  }
  function buildPreview(doc, cfg) {
    var GLYPHS = {
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
    var wrap = el(doc, "div", "hbxksp-preview");
    var pad = el(doc, "div", "hbxksp-pv-pad");
    var keyEls = {};
    [ "up", "left", "down", "right" ].forEach(function(k) {
      var key = el(doc, "div", "hbxksp-pv-key");
      key.setAttribute("data-k", k);
      pad.appendChild(key);
      keyEls[k] = key;
    });
    wrap.appendChild(pad);
    var kick = el(doc, "div", "hbxksp-pv-kick", "SPACE");
    kick.style.width = "98px";
    wrap.appendChild(kick);
    function paint(c) {
      var glyphs = c.layout === "custom" && c.customKeyLabels ? c.customKeyLabels : GLYPHS[c.layout] || GLYPHS.arrows;
      keyEls.up.textContent = glyphs.up;
      keyEls.left.textContent = glyphs.left;
      keyEls.down.textContent = glyphs.down;
      keyEls.right.textContent = glyphs.right;
      kick.textContent = c.kickKeyLabel || "SPACE";
      kick.style.display = c.showKick ? "inline-flex" : "none";
      var glass = !!c.bg;
      var glassBg = glass ? "rgba(19,20,26,.55)" : "transparent";
      var glassShadow = glass ? "0 0 0 1px rgba(255,255,255,.06)" : "none";
      for (var k in keyEls) {
        var isSample = k === "up";
        keyEls[k].style.color = isSample ? "#fff" : "rgba(255,255,255,.45)";
        keyEls[k].style.background = glassBg;
        keyEls[k].style.boxShadow = glassShadow + (isSample ? ", inset 0 -2px 0 0 " + c.color : "");
      }
      kick.style.background = glassBg;
      kick.style.boxShadow = glassShadow;
    }
    paint(cfg);
    wrap._paint = paint;
    return wrap;
  }
  function buildBody(doc) {
    var body = el(doc, "div", "hbxksp-body");
    function engine() {
      return window.DerviKeystrokes;
    }
    if (!engine()) {
      body.appendChild(el(doc, "div", "hbxksp-hint", t("DerviKeystrokes no está disponible todavía. Abrí el panel de nuevo cuando el juego termine de cargar.")));
      return body;
    }
    var init = engine().getConfig();
    var preview = buildPreview(doc, init);
    body.appendChild(preview);
    var enabledRow = toggleRow(doc, t("Keystrokes personalizado"), t("Si lo apagás, no se muestra ningún indicador de teclas."), init.enabled, function(val) {
      engine().setEnabled(val);
      refreshVisibility();
    });
    body.appendChild(enabledRow);
    var fade = el(doc, "div", "hbxksp-fade");
    fade.style.cssText = "display:flex;flex-direction:column;gap:10px;";
    fade.appendChild(el(doc, "div", "hbxksp-divider"));
    fade.appendChild(el(doc, "div", "hbxksp-sectitle", t("Teclas")));
    var layoutObj = selectRow(doc, t("Layout"), [ {
      value: "arrows",
      label: t("Flechas")
    }, {
      value: "wasd",
      label: "WASD"
    }, {
      value: "custom",
      label: t("Personalizado")
    } ], init.layout, function(v) {
      engine().setLayout(v);
      refreshCustomKeysVisibility();
    });
    fade.appendChild(layoutObj.row);
    var customKeysWrap = el(doc, "div", "hbxksp-fade");
    customKeysWrap.style.cssText = "display:flex;flex-direction:column;gap:2px;";
    var customUpObj = keybindRow(doc, t("Arriba"), init.customKeyLabels.up, function(code) {
      engine().setCustomKey("up", code);
    });
    var customLeftObj = keybindRow(doc, t("Izquierda"), init.customKeyLabels.left, function(code) {
      engine().setCustomKey("left", code);
    });
    var customDownObj = keybindRow(doc, t("Abajo"), init.customKeyLabels.down, function(code) {
      engine().setCustomKey("down", code);
    });
    var customRightObj = keybindRow(doc, t("Derecha"), init.customKeyLabels.right, function(code) {
      engine().setCustomKey("right", code);
    });
    [ customUpObj, customLeftObj, customDownObj, customRightObj ].forEach(function(o) {
      customKeysWrap.appendChild(o.row);
    });
    fade.appendChild(customKeysWrap);
    var showKickRow = toggleRow(doc, t("Mostrar kick"), null, init.showKick, function(val) {
      engine().setShowKick(val);
      refreshKickLink();
    });
    fade.appendChild(showKickRow);
    var kickObj = keybindRow(doc, t("Tecla de kick"), init.kickKeyLabel, function(code) {
      engine().setKickKey(code);
    });
    kickObj.row.classList.add("hbxksp-fade");
    fade.appendChild(kickObj.row);
    fade.appendChild(el(doc, "div", "hbxksp-divider"));
    fade.appendChild(el(doc, "div", "hbxksp-sectitle", t("Colores")));
    var colorObj = colorRow(doc, t("Color de tecla activa"), init.color, function(v) {
      engine().setColor(v);
    });
    fade.appendChild(colorObj.row);
    fade.appendChild(el(doc, "div", "hbxksp-divider"));
    fade.appendChild(el(doc, "div", "hbxksp-sectitle", t("Apariencia")));
    var bgRow = toggleRow(doc, t("Fondo"), t("Vidrio oscuro detrás de cada tecla."), init.bg, function(val) {
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
    fade.appendChild(el(doc, "div", "hbxksp-divider"));
    fade.appendChild(el(doc, "div", "hbxksp-sectitle", t("Posición")));
    var offXObj = rangeRow(doc, t("Horizontal"), -2e3, 2e3, init.offsetX, "px", function(v) {
      engine().setOffsetX(v);
    });
    fade.appendChild(offXObj.row);
    var offYObj = rangeRow(doc, t("Vertical"), -2e3, 2e3, init.offsetY, "px", function(v) {
      engine().setOffsetY(v);
    });
    fade.appendChild(offYObj.row);
    var resetRow = el(doc, "div", "hbxksp-btnrow");
    var resetBtn = el(doc, "button", "hbxksp-btn", t("Restablecer posición"));
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
    function refreshKickLink() {
      kickObj.row.classList.toggle("is-off", !engine().getConfig().showKick);
    }
    refreshKickLink();
    function refreshCustomKeysVisibility() {
      customKeysWrap.classList.toggle("is-off", engine().getConfig().layout !== "custom");
    }
    refreshCustomKeysVisibility();
    function refresh() {
      var c = engine().getConfig();
      enabledRow._setState(c.enabled);
      layoutObj.select.value = c.layout;
      customUpObj.setLabel(c.customKeyLabels.up);
      customLeftObj.setLabel(c.customKeyLabels.left);
      customDownObj.setLabel(c.customKeyLabels.down);
      customRightObj.setLabel(c.customKeyLabels.right);
      showKickRow._setState(c.showKick);
      kickObj.setLabel(c.kickKeyLabel);
      colorObj.input.value = /^#/.test(c.color) ? c.color : "#000000";
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
      refreshKickLink();
      refreshCustomKeysVisibility();
    }
    window.addEventListener("Dervi:keystrokes", refresh);
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
    var overlay = el(doc, "div", "hbxksp-overlay");
    var card = el(doc, "div", "hbxksp-card");
    var head = el(doc, "div", "hbxksp-head");
    var titleWrap = el(doc, "div", "hbxksp-title", '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6.5" width="19" height="12" rx="2"/><path d="M7 11v1M11 11v1M15 11v1M9 15h6"/></svg><span>' + t("Keystrokes") + "</span>");
    var closeBtn = el(doc, "button", "hbxksp-close", '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
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
  window.HbxKeystrokes = {
    openPanel: function(doc) {
      openPanel(doc || document);
    },
    closePanel: closePanel
  };
})();