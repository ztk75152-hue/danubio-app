(function() {
  if (typeof Injector !== "undefined" && Injector.isMainFrame && Injector.isMainFrame()) return;
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  function ensureStyles(doc) {
    if (doc.getElementById("hbxsbp-styles")) return;
    var style = doc.createElement("style");
    style.id = "hbxsbp-styles";
    style.textContent = [ ".hbxsbp-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .16s ease;}", ".hbxsbp-overlay.is-open{opacity:1;}", ".hbxsbp-card{width:420px;max-width:92vw;max-height:86vh;background:var(--theme-bg-primary);border:1px solid var(--theme-border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;transform:translateY(10px) scale(.98);transition:transform .16s ease;}", ".hbxsbp-overlay.is-open .hbxsbp-card{transform:translateY(0) scale(1);}", ".hbxsbp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--theme-border);flex-shrink:0;}", ".hbxsbp-title{display:flex;align-items:center;gap:8px;color:var(--theme-text-primary);font-size:14px;font-weight:700;letter-spacing:.2px;}", ".hbxsbp-close{width:26px;height:26px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);color:var(--theme-text-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}", ".hbxsbp-close:hover{color:#dc2626;border-color:#dc2626;background:rgba(220,38,38,.08);}", ".hbxsbp-body{overflow-y:auto;padding:14px 16px 18px;flex:1;display:flex;flex-direction:column;gap:12px;}", ".hbxsbp-sectitle{color:var(--theme-text-primary);font-size:12.5px;font-weight:600;letter-spacing:.2px;margin-top:2px;}", ".hbxsbp-hint{color:var(--theme-text-muted);font-size:10.5px;line-height:1.5;}", ".hbxsbp-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 2px;}", ".hbxsbp-row .lbl{color:var(--theme-text-primary);font-size:12px;}", ".hbxsbp-toggle{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:6px;cursor:pointer;}", ".hbxsbp-toggle:hover{background:var(--theme-bg-hover);}", ".hbxsbp-chk{width:17px;height:17px;border:2px solid var(--theme-border-light);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}", ".hbxsbp-chk.on{background:#c9a227;border-color:#c9a227;}", ".hbxsbp-range{flex:1;}", ".hbxsbp-meta{color:var(--theme-text-muted);font-size:10.5px;min-width:34px;text-align:right;}", ".hbxsbp-divider{height:1px;background:var(--theme-border);margin:2px 0;}", ".hbxsbp-fade{transition:opacity .12s ease;}", ".hbxsbp-fade.is-off{opacity:.4;pointer-events:none;}", ".hbxsbp-btnrow{display:flex;gap:8px;flex-wrap:wrap;}", ".hbxsbp-btn{padding:7px 12px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-primary);color:var(--theme-text-primary);font-size:11.5px;cursor:pointer;}", ".hbxsbp-btn:hover{background:var(--theme-bg-hover);}", ".hbxsbp-preview{display:flex;flex-direction:column;align-items:center;margin-bottom:6px;}", ".hbxsbp-pv-pill{display:flex;align-items:stretch;height:40px;border-radius:10px;position:relative;box-sizing:border-box;}", ".hbxsbp-pv-score{display:flex;align-items:center;height:100%;padding:0 18px;font-size:20px;font-weight:800;color:#fff;font-variant-numeric:tabular-nums;position:relative;}", ".hbxsbp-pv-underline{position:absolute;bottom:0;height:2px;border-radius:2px;}", ".hbxsbp-pv-timer{display:flex;align-items:center;justify-content:center;height:100%;padding:0 14px;font-size:12px;font-weight:600;letter-spacing:.08em;color:#fff;opacity:.85;font-variant-numeric:tabular-nums;box-sizing:border-box;}", ".hbxsbp-pv-ot{margin-top:-1px;padding:5px 10px 6px;border-radius:0 0 10px 10px;font-size:12px;font-weight:800;letter-spacing:.08em;color:#fff;box-sizing:border-box;white-space:nowrap;}" ].join("");
    doc.head.appendChild(style);
  }
  function el(doc, tag, cls, html) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function toggleRow(doc, label, hint, initial, onChange) {
    var row = el(doc, "div", "hbxsbp-toggle");
    var chk = el(doc, "div", "hbxsbp-chk", '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" style="opacity:0"><polyline points="20 6 9 17 4 12"/></svg>');
    var textWrap = el(doc, "div");
    textWrap.style.cssText = "flex:1;min-width:0;";
    var titleEl = el(doc, "div", null, label);
    titleEl.style.cssText = "color:var(--theme-text-primary);font-size:12.5px;font-weight:500;";
    textWrap.appendChild(titleEl);
    if (hint) {
      var hintEl = el(doc, "div", "hbxsbp-hint", hint);
      textWrap.appendChild(hintEl);
    }
    row.appendChild(chk);
    row.appendChild(textWrap);
    var state = !!initial;
    function paint() {
      chk.className = "hbxsbp-chk" + (state ? " on" : "");
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
    var row = el(doc, "div", "hbxsbp-row");
    var lbl = el(doc, "span", "lbl", label);
    var right = el(doc, "div");
    right.style.cssText = "display:flex;align-items:center;gap:8px;flex:1;justify-content:flex-end;";
    var input = doc.createElement("input");
    input.type = "range";
    input.className = "hbxsbp-range";
    input.min = String(min);
    input.max = String(max);
    input.value = String(initial);
    var meta = el(doc, "span", "hbxsbp-meta", initial + (unit || ""));
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
    var row = el(doc, "div", "hbxsbp-row");
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
  function buildPreview(doc, cfg) {
    var CHIP_SOLID = "#202126";
    var BORDER_W = 3;
    var wrap = el(doc, "div", "hbxsbp-preview");
    var pill = el(doc, "div", "hbxsbp-pv-pill");
    var redWrap = el(doc, "div", "hbxsbp-pv-score", "0");
    var redLine = el(doc, "div", "hbxsbp-pv-underline");
    redLine.style.cssText = "left:0;right:10px;";
    redWrap.appendChild(redLine);
    var timer = el(doc, "div", "hbxsbp-pv-timer", "3:45");
    var blueWrap = el(doc, "div", "hbxsbp-pv-score", "0");
    var blueLine = el(doc, "div", "hbxsbp-pv-underline");
    blueLine.style.cssText = "left:10px;right:0;";
    blueWrap.appendChild(blueLine);
    pill.appendChild(redWrap);
    pill.appendChild(timer);
    pill.appendChild(blueWrap);
    wrap.appendChild(pill);
    var ot = el(doc, "div", "hbxsbp-pv-ot", t("overtime"));
    wrap.appendChild(ot);
    function paint(c) {
      var glass = !c.bg;
      pill.style.background = glass ? "rgba(0,0,0,0.35)" : "#14151a";
      pill.style.backdropFilter = glass ? "blur(10px)" : "none";
      pill.style.webkitBackdropFilter = glass ? "blur(10px)" : "none";
      pill.style.border = glass ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.08)";
      wrap.style.opacity = String((c.opacity != null ? c.opacity : 100) / 100);
      redLine.style.background = c.redColor;
      blueLine.style.background = c.blueColor;
      timer.style.display = c.showTimer ? "flex" : "none";
      timer.style.background = "rgba(255,255,255,0.05)";
      timer.style.border = glass ? "none" : BORDER_W + "px solid #14151a";
      timer.style.boxShadow = glass ? "inset 0 0 0 1px rgba(10,11,14,.5), inset 0 0 " + BORDER_W * 2 + "px 1px rgba(10,11,14,.4)" : "none";
      var showOt = !!(c.showTimer && c.showOvertimeBanner);
      ot.style.display = showOt ? "block" : "none";
      ot.style.background = glass ? "rgba(0,0,0,0.35)" : CHIP_SOLID;
      ot.style.backdropFilter = glass ? "blur(10px)" : "none";
      ot.style.webkitBackdropFilter = glass ? "blur(10px)" : "none";
      ot.style.border = glass ? "none" : BORDER_W + "px solid #14151a";
      ot.style.borderTop = "none";
      ot.style.boxShadow = glass ? "0 8px 20px rgba(0,0,0,.5), inset 0 0 0 1px rgba(10,11,14,.5), inset 0 0 " + BORDER_W * 2 + "px 1px rgba(10,11,14,.4)" : "0 8px 20px rgba(0,0,0,.5)";
    }
    paint(cfg);
    wrap._paint = paint;
    return wrap;
  }
  function buildBody(doc) {
    var body = el(doc, "div", "hbxsbp-body");
    function engine() {
      return window.DerviScoreboard;
    }
    if (!engine()) {
      body.appendChild(el(doc, "div", "hbxsbp-hint", t("DerviScoreboard no está disponible todavía. Abrí el panel de nuevo cuando el juego termine de cargar.")));
      return body;
    }
    var init = engine().getConfig();
    var preview = buildPreview(doc, init);
    body.appendChild(preview);
    var enabledRow = toggleRow(doc, t("Scoreboard personalizado"), t("Si lo apagás, queda el scoreboard nativo de siempre."), init.enabled, function(val) {
      engine().setEnabled(val);
      refreshVisibility();
    });
    body.appendChild(enabledRow);
    var fade = el(doc, "div", "hbxsbp-fade");
    fade.style.cssText = "display:flex;flex-direction:column;gap:10px;";
    fade.appendChild(el(doc, "div", "hbxsbp-divider"));
    fade.appendChild(el(doc, "div", "hbxsbp-sectitle", t("Colores")));
    var redObj = colorRow(doc, t("Color equipo rojo"), init.redColor, function(v) {
      engine().setRedColor(v);
    });
    fade.appendChild(redObj.row);
    var blueObj = colorRow(doc, t("Color equipo azul"), init.blueColor, function(v) {
      engine().setBlueColor(v);
    });
    fade.appendChild(blueObj.row);
    fade.appendChild(el(doc, "div", "hbxsbp-divider"));
    fade.appendChild(el(doc, "div", "hbxsbp-sectitle", t("Apariencia")));
    var bgRow = toggleRow(doc, t("Fondo"), t("Pill oscura detrás del bar y de cada score."), init.bg, function(val) {
      engine().setBg(val);
    });
    fade.appendChild(bgRow);
    var timerRow = toggleRow(doc, t("Mostrar timer"), null, init.showTimer, function(val) {
      engine().setShowTimer(val);
    });
    fade.appendChild(timerRow);
    var otRow = toggleRow(doc, t("Mostrar aviso de overtime"), t('El "OT" que ya prende el juego cuando se juega alargue.'), init.showOvertimeBanner, function(val) {
      engine().setShowOvertimeBanner(val);
    });
    otRow.classList.add("hbxsbp-fade");
    fade.appendChild(otRow);
    var opacityObj = rangeRow(doc, t("Opacidad"), 20, 100, init.opacity, "%", function(v) {
      engine().setOpacity(v);
    });
    fade.appendChild(opacityObj.row);
    var scaleObj = rangeRow(doc, t("Escala"), 50, 150, init.scale, "%", function(v) {
      engine().setScale(v);
    });
    fade.appendChild(scaleObj.row);
    fade.appendChild(el(doc, "div", "hbxsbp-divider"));
    fade.appendChild(el(doc, "div", "hbxsbp-sectitle", t("Posición")));
    var offXObj = rangeRow(doc, t("Horizontal"), -300, 300, init.offsetX, "px", function(v) {
      engine().setOffsetX(v);
    });
    fade.appendChild(offXObj.row);
    var offYObj = rangeRow(doc, t("Vertical"), -100, 300, init.offsetY, "px", function(v) {
      engine().setOffsetY(v);
    });
    fade.appendChild(offYObj.row);
    var resetRow = el(doc, "div", "hbxsbp-btnrow");
    var resetBtn = el(doc, "button", "hbxsbp-btn", t("Restablecer posición"));
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
    function refreshTimerLink() {
      otRow.classList.toggle("is-off", !engine().getConfig().showTimer);
    }
    refreshTimerLink();
    function refresh() {
      var c = engine().getConfig();
      enabledRow._setState(c.enabled);
      redObj.input.value = /^#/.test(c.redColor) ? c.redColor : "#000000";
      blueObj.input.value = /^#/.test(c.blueColor) ? c.blueColor : "#000000";
      bgRow._setState(c.bg);
      timerRow._setState(c.showTimer);
      otRow._setState(c.showOvertimeBanner);
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
      refreshTimerLink();
    }
    window.addEventListener("Dervi:scoreboard", refresh);
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
    var overlay = el(doc, "div", "hbxsbp-overlay");
    var card = el(doc, "div", "hbxsbp-card");
    var head = el(doc, "div", "hbxsbp-head");
    var titleWrap = el(doc, "div", "hbxsbp-title", '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="2.5" y="8" width="19" height="8" rx="2"/><circle cx="7" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="17" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg><span>' + t("Scoreboard") + "</span>");
    var closeBtn = el(doc, "button", "hbxsbp-close", '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
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
  window.HbxScoreboard = {
    openPanel: function(doc) {
      openPanel(doc || document);
    },
    closePanel: closePanel
  };
})();