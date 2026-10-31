(function() {
  "use strict";
  if (window.__DerviFieldGallery) return;
  window.__DerviFieldGallery = true;
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  var ASSET_BASE = function() {
    try {
      if (document.currentScript && document.currentScript.dataset.assetsBase) {
        return document.currentScript.dataset.assetsBase;
      }
    } catch (e) {}
    return "assets/fields/";
  }();
  var CATALOG = [ {
    id: "",
    label: t("Canchas"),
    files: [ "basket.png", "cemento.avif", "cesped.avif", "hielo.png", "madera.png", "noche.jpg", "nubes.jpeg", "playa.png", "street.png" ]
  } ];
  function assetUrl(categoryId, file) {
    var rel = (categoryId ? categoryId + "/" : "") + file;
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(ASSET_BASE) || ASSET_BASE.indexOf("chrome-extension://") === 0) {
      return ASSET_BASE + rel;
    }
    var path = ASSET_BASE + rel;
    try {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
        return chrome.runtime.getURL(path);
      }
    } catch (e) {}
    return path;
  }
  function ensureStyles(doc) {
    if (doc.getElementById("hbxfg-styles")) return;
    var style = doc.createElement("style");
    style.id = "hbxfg-styles";
    style.textContent = [ ".hbxfg-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1000010;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .16s ease;}", ".hbxfg-overlay.is-open{opacity:1;}", ".hbxfg-card{width:480px;max-width:92vw;max-height:86vh;background:var(--theme-bg-primary);border:1px solid var(--theme-border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;transform:translateY(10px) scale(.98);transition:transform .16s ease;}", ".hbxfg-overlay.is-open .hbxfg-card{transform:translateY(0) scale(1);}", ".hbxfg-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--theme-border);flex-shrink:0;}", ".hbxfg-title{display:flex;align-items:center;gap:8px;color:var(--theme-text-primary);font-size:14px;font-weight:700;letter-spacing:.2px;}", ".hbxfg-close{width:26px;height:26px;border-radius:7px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);color:var(--theme-text-muted);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}", ".hbxfg-close:hover{color:#dc2626;border-color:#dc2626;background:rgba(220,38,38,.08);}", ".hbxfg-tabs{display:flex;gap:6px;padding:10px 16px;border-bottom:1px solid var(--theme-border);flex-shrink:0;overflow-x:auto;}", ".hbxfg-tabs.is-single{display:none;}", ".hbxfg-tabbtn{flex:0 0 auto;padding:7px 11px;border-radius:8px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);color:var(--theme-text-muted);font-size:11.5px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s,color .15s,border-color .15s;}", ".hbxfg-tabbtn.is-active{background:#c9a227;border-color:#c9a227;color:#000;}", ".hbxfg-body{overflow-y:auto;padding:14px 16px 18px;flex:1;}", ".hbxfg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:10px;}", ".hbxfg-item{display:flex;flex-direction:column;align-items:center;gap:5px;padding:6px 4px 8px;border-radius:10px;border:1px solid var(--theme-border);background:var(--theme-bg-secondary);cursor:pointer;transition:border-color .12s,background .12s,transform .12s;}", ".hbxfg-item:hover{border-color:#c9a227;transform:translateY(-1px);}", ".hbxfg-item.is-active{border-color:#c9a227;background:rgba(201,162,39,.12);}", ".hbxfg-thumb{width:100%;aspect-ratio:16/10;border-radius:7px;background:var(--theme-bg-primary) center/cover no-repeat;border:2px solid var(--theme-border-light);flex-shrink:0;}", ".hbxfg-item-label{font-size:9px;color:var(--theme-text-muted);text-align:center;line-height:1.25;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}", ".hbxfg-empty{color:var(--theme-text-muted);font-size:11.5px;text-align:center;padding:30px 10px;}" ].join("");
    doc.head.appendChild(style);
  }
  function el(doc, tag, cls, html) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function prettyName(file) {
    return file.replace(/\.[a-z0-9]+$/i, "").replace(/-/g, " ");
  }
  var overlayEl = null;
  function close() {
    if (!overlayEl) return;
    overlayEl.classList.remove("is-open");
    var ref = overlayEl;
    setTimeout(function() {
      if (ref && ref.parentNode) ref.parentNode.removeChild(ref);
    }, 160);
    overlayEl = null;
  }
  function open(doc, onPick, opts) {
    doc = doc || document;
    opts = opts || {};
    ensureStyles(doc);
    if (overlayEl) close();
    var overlay = el(doc, "div", "hbxfg-overlay");
    var card = el(doc, "div", "hbxfg-card");
    var head = el(doc, "div", "hbxfg-head");
    var titleWrap = el(doc, "div", "hbxfg-title", '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M12 5.5v13"/><circle cx="12" cy="12" r="2.4"/></svg><span>' + t("Galería de canchas") + "</span>");
    var closeBtn = el(doc, "button", "hbxfg-close", '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
    closeBtn.type = "button";
    closeBtn.onclick = close;
    head.appendChild(titleWrap);
    head.appendChild(closeBtn);
    var tabs = el(doc, "div", "hbxfg-tabs" + (CATALOG.length <= 1 ? " is-single" : ""));
    var body = el(doc, "div", "hbxfg-body");
    var grid = el(doc, "div", "hbxfg-grid");
    body.appendChild(grid);
    var currentUrl = opts.currentUrl || "";
    function renderCategory(cat) {
      grid.innerHTML = "";
      if (!cat.files.length) {
        grid.appendChild(el(doc, "div", "hbxfg-empty", t("No hay canchas en esta categoría todavía.")));
        return;
      }
      cat.files.forEach(function(file) {
        var url = assetUrl(cat.id, file);
        var item = el(doc, "button", "hbxfg-item" + (url === currentUrl ? " is-active" : ""));
        item.type = "button";
        var thumb = el(doc, "div", "hbxfg-thumb");
        thumb.style.backgroundImage = "url(" + url + ")";
        var label = el(doc, "div", "hbxfg-item-label", prettyName(file));
        item.appendChild(thumb);
        item.appendChild(label);
        item.title = prettyName(file);
        item.onclick = function() {
          currentUrl = url;
          Array.prototype.forEach.call(grid.children, function(c) {
            c.classList.remove("is-active");
          });
          item.classList.add("is-active");
          onPick(url);
          close();
        };
        grid.appendChild(item);
      });
    }
    var tabBtns = CATALOG.map(function(cat) {
      var b = el(doc, "button", "hbxfg-tabbtn", cat.label);
      b.type = "button";
      b.onclick = function() {
        tabBtns.forEach(function(o) {
          o.classList.remove("is-active");
        });
        b.classList.add("is-active");
        renderCategory(cat);
      };
      tabs.appendChild(b);
      return b;
    });
    if (CATALOG.length) {
      tabBtns[0].classList.add("is-active");
      renderCategory(CATALOG[0]);
    }
    card.appendChild(head);
    card.appendChild(tabs);
    card.appendChild(body);
    overlay.appendChild(card);
    overlay.onclick = function(ev) {
      if (ev.target === overlay) close();
    };
    doc.body.appendChild(overlay);
    overlayEl = overlay;
    requestAnimationFrame(function() {
      overlay.classList.add("is-open");
    });
  }
  window.DerviFieldGallery = {
    open: open,
    close: close,
    CATALOG: CATALOG,
    assetUrl: assetUrl
  };
})();