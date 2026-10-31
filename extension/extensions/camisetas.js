(function() {
  if (window.__HAX_MENU_V12_LOADED) return;
  window.__HAX_MENU_V12_LOADED = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;900&display=swap";
  document.head.appendChild(link);
  let shirt = {
    team: "red",
    angle: 90,
    textColor: "#ffffff",
    c1: "#de0019",
    c2: "#b80017",
    c3: "#820217",
    count: 3
  };
  const $ = id => document.getElementById(id);
  function getGradient(s) {
    const ang = (parseInt(s.angle) || 0) + 90;
    if (s.count === 1) return s.c1;
    if (s.count === 2) return `linear-gradient(${ang}deg, ${s.c1} 50%, ${s.c2} 50%)`;
    return `linear-gradient(${ang}deg, ${s.c1} 33%, ${s.c2} 33% 66%, ${s.c3} 66%)`;
  }
  function syncPreview() {
    const p = $("hm-preview");
    if (!p) return;
    p.style.background = getGradient(shirt);
    p.style.color = shirt.textColor;
    $("hm-c2-row").style.display = shirt.count >= 2 ? "flex" : "none";
    $("hm-c3-row").style.display = shirt.count >= 3 ? "flex" : "none";
  }
  function updateInputs() {
    $("hm-team").value = shirt.team;
    $("hm-mode").value = shirt.count;
    $("hm-angle").value = shirt.angle;
    $("hm-ctext").value = shirt.textColor;
    $("hm-c1").value = shirt.c1;
    $("hm-c2").value = shirt.c2;
    $("hm-c3").value = shirt.c3;
  }
  const CSS = `\n        #hm-root {\n            position: fixed; top: 50%; left: 20px;\n            transform: translateY(-50%) translateX(-110%) scale(0.96);\n            width: 250px;\n            background: #080808;\n            border: 1px solid rgba(255,255,255,0.07);\n            border-radius: 16px;\n            z-index: 999999;\n            font-family: 'Syne', sans-serif;\n            color: #fff;\n            display: flex;\n            flex-direction: column;\n            overflow: hidden;\n            box-shadow: 0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04);\n            opacity: 0;\n            pointer-events: none;\n            transition:\n                transform 0.42s cubic-bezier(0.16, 1, 0.3, 1),\n                opacity   0.42s cubic-bezier(0.16, 1, 0.3, 1);\n            will-change: transform, opacity;\n        }\n        #hm-root.open {\n            transform: translateY(-50%) translateX(0) scale(1);\n            opacity: 1;\n            pointer-events: all;\n        }\n\n        #hm-tabs {\n            display: flex;\n            background: #050505;\n            border-bottom: 1px solid rgba(255,255,255,0.05);\n            position: relative;\n        }\n        .hm-tab {\n            flex: 1; padding: 14px 8px;\n            font-size: 9px; font-weight: 900;\n            letter-spacing: 2.5px; text-transform: uppercase;\n            color: rgba(255,255,255,0.2);\n            background: none; border: none;\n            cursor: pointer;\n            transition: color 0.25s ease;\n        }\n        .hm-tab.active { color: #fff; }\n        #hm-tab-bar {\n            position: absolute; bottom: 0; height: 2px;\n            background: #fff;\n            box-shadow: 0 0 8px rgba(255,255,255,0.35);\n            transition: left 0.35s cubic-bezier(0.16, 1, 0.3, 1);\n            width: 50%;\n        }\n\n        #hm-close {\n            position: absolute; top: 13px; right: 14px;\n            background: none; border: none;\n            color: rgba(255,255,255,0.18);\n            font-size: 14px; cursor: pointer;\n            line-height: 1;\n            transition: color 0.2s ease;\n            z-index: 10;\n        }\n        #hm-close:hover { color: rgba(255,255,255,0.6); }\n\n        #hm-preview-wrap {\n            padding: 20px;\n            background: radial-gradient(circle at 50% 40%, #0d0d0d, #000);\n            display: flex; justify-content: center; align-items: center;\n        }\n        #hm-preview {\n            width: 70px; height: 70px; border-radius: 50%;\n            border: 2px solid rgba(255,255,255,0.06);\n            font-weight: 900; font-size: 20px;\n            display: flex; align-items: center; justify-content: center;\n            transition: background 0.3s ease;\n            letter-spacing: 1px;\n        }\n\n        .hm-view { display: none; flex-direction: column; }\n        .hm-view.active { display: flex; }\n\n        #hm-studio { padding: 16px 18px 18px; gap: 10px; }\n        .hm-row {\n            display: flex; align-items: center;\n            justify-content: space-between;\n        }\n        .hm-label {\n            font-size: 9px; font-weight: 900;\n            letter-spacing: 1.5px; text-transform: uppercase;\n            color: rgba(255,255,255,0.3);\n        }\n        .hm-input {\n            background: rgba(255,255,255,0.04);\n            border: 1px solid rgba(255,255,255,0.08);\n            color: #fff; padding: 6px 10px;\n            border-radius: 6px; font-size: 10px;\n            font-weight: 700; font-family: 'Syne', sans-serif;\n            width: 100px; text-align: center; outline: none;\n            transition: border-color 0.2s ease;\n        }\n        .hm-input:focus { border-color: rgba(255,255,255,0.25); }\n        select.hm-input { cursor: pointer; }\n        input[type="color"].hm-input {\n            padding: 2px 4px; height: 30px; cursor: pointer;\n            width: 60px;\n        }\n\n        #hm-btns { display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }\n        #hm-apply {\n            background: #fff; color: #000;\n            padding: 12px; border-radius: 8px;\n            border: none; font-weight: 900; cursor: pointer;\n            font-size: 10px; letter-spacing: 2px; text-transform: uppercase;\n            font-family: 'Syne', sans-serif;\n            transition: opacity 0.2s ease, transform 0.15s ease;\n        }\n        #hm-apply:hover  { opacity: 0.88; }\n        #hm-apply:active { transform: scale(0.97); }\n        #hm-save {\n            background: none; color: rgba(255,255,255,0.18);\n            border: none; font-size: 8px; font-weight: 900;\n            letter-spacing: 2px; text-transform: uppercase;\n            cursor: pointer; padding: 6px;\n            font-family: 'Syne', sans-serif;\n            transition: color 0.2s ease;\n        }\n        #hm-save:hover { color: rgba(255,255,255,0.5); }\n\n        #hm-library {\n            padding: 14px; gap: 0;\n            max-height: 340px; overflow-y: auto;\n        }\n        #hm-library::-webkit-scrollbar { width: 0; }\n        .hm-lib-item {\n            display: flex; align-items: center; gap: 12px;\n            background: rgba(255,255,255,0.02);\n            border: 1px solid rgba(255,255,255,0.05);\n            padding: 11px 12px; border-radius: 10px;\n            cursor: pointer; margin-bottom: 7px;\n            transition: background 0.2s ease, border-color 0.2s ease;\n        }\n        .hm-lib-item:hover {\n            background: rgba(255,255,255,0.05);\n            border-color: rgba(255,255,255,0.1);\n        }\n        .hm-lib-dot {\n            width: 28px; height: 28px; border-radius: 50%;\n            border: 1.5px solid rgba(255,255,255,0.08);\n            flex-shrink: 0;\n        }\n        .hm-lib-name {\n            flex: 1; font-size: 10px; font-weight: 900;\n            color: rgba(255,255,255,0.5);\n            text-transform: uppercase; letter-spacing: 1.5px;\n        }\n        .hm-lib-del {\n            color: rgba(255,255,255,0.15); font-size: 11px;\n            background: none; border: none; cursor: pointer;\n            padding: 4px; transition: color 0.2s ease;\n            line-height: 1;\n        }\n        .hm-lib-del:hover { color: rgba(255,80,80,0.8); }\n        .hm-empty {\n            text-align: center; padding: 50px 20px;\n            font-size: 9px; font-weight: 900;\n            letter-spacing: 3px; color: rgba(255,255,255,0.08);\n        }\n\n        .hm-divider {\n            height: 1px;\n            background: rgba(255,255,255,0.05);\n            margin: 4px 0 10px;\n        }\n    `;
  const HTML = `\n        <button id="hm-close" title="Cerrar (F4)">✕</button>\n\n        <div id="hm-tabs">\n            <button class="hm-tab active" data-tab="studio">Design</button>\n            <button class="hm-tab"        data-tab="library">Library</button>\n            <div id="hm-tab-bar" style="left:0"></div>\n        </div>\n\n        <div id="hm-preview-wrap">\n            <div id="hm-preview">TL</div>\n        </div>\n\n        <div id="hm-studio" class="hm-view active">\n            <div class="hm-row">\n                <span class="hm-label">Team</span>\n                <select class="hm-input" id="hm-team">\n                    <option value="red">RED</option>\n                    <option value="blue">BLUE</option>\n                </select>\n            </div>\n            <div class="hm-row">\n                <span class="hm-label">Style</span>\n                <select class="hm-input" id="hm-mode">\n                    <option value="1">Solid</option>\n                    <option value="2">Split</option>\n                    <option value="3" selected>Triple</option>\n                </select>\n            </div>\n            <div class="hm-row">\n                <span class="hm-label">Angle</span>\n                <input type="number" class="hm-input" id="hm-angle" value="90" min="0" max="360">\n            </div>\n            <div class="hm-divider"></div>\n            <div class="hm-row">\n                <span class="hm-label">Text color</span>\n                <input type="color" class="hm-input" id="hm-ctext" value="#ffffff">\n            </div>\n            <div class="hm-row">\n                <span class="hm-label">Color 1</span>\n                <input type="color" class="hm-input" id="hm-c1" value="#de0019">\n            </div>\n            <div class="hm-row" id="hm-c2-row">\n                <span class="hm-label">Color 2</span>\n                <input type="color" class="hm-input" id="hm-c2" value="#b80017">\n            </div>\n            <div class="hm-row" id="hm-c3-row">\n                <span class="hm-label">Color 3</span>\n                <input type="color" class="hm-input" id="hm-c3" value="#820217">\n            </div>\n            <div id="hm-btns">\n                <button id="hm-apply">Apply design</button>\n                <button id="hm-save">Save to library</button>\n            </div>\n        </div>\n\n        <div id="hm-library" class="hm-view"></div>\n    `;
  function init() {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    const root = document.createElement("div");
    root.id = "hm-root";
    root.innerHTML = HTML;
    document.body.appendChild(root);
    let activeTab = "studio";
    function setTab(tab) {
      activeTab = tab;
      document.querySelectorAll(".hm-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
      $("hm-tab-bar").style.left = tab === "studio" ? "0" : "50%";
      $("hm-studio").classList.toggle("active", tab === "studio");
      $("hm-library").classList.toggle("active", tab === "library");
      $("hm-preview-wrap").style.display = tab === "studio" ? "flex" : "none";
      if (tab === "library") renderLibrary();
    }
    document.querySelectorAll(".hm-tab").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
    function openMenu() {
      root.classList.add("open");
      syncPreview();
    }
    function closeMenu() {
      root.classList.remove("open");
    }
    function toggleMenu() {
      root.classList.contains("open") ? closeMenu() : openMenu();
    }
    $("hm-close").addEventListener("click", closeMenu);
    window.addEventListener("keydown", e => {
      if (e.key === "F4") {
        e.stopImmediatePropagation();
        toggleMenu();
      }
    }, true);
    window.__haxToggleMenu = toggleMenu;
    function bind(id, key, parser) {
      const el = $(id);
      if (!el) return;
      el.addEventListener("input", e => {
        shirt[key] = parser ? parser(e.target.value) : e.target.value;
        syncPreview();
      });
    }
    bind("hm-team", "team");
    bind("hm-mode", "count", v => parseInt(v));
    bind("hm-angle", "angle", v => parseInt(v) || 0);
    bind("hm-ctext", "textColor");
    bind("hm-c1", "c1");
    bind("hm-c2", "c2");
    bind("hm-c3", "c3");
    $("hm-apply").addEventListener("click", () => {
      const cl = c => c.replace("#", "");
      let cmd = `/colors ${shirt.team} ${shirt.angle} ${cl(shirt.textColor)} ${cl(shirt.c1)}`;
      if (shirt.count >= 2) cmd += ` ${cl(shirt.c2)}`;
      if (shirt.count === 3) cmd += ` ${cl(shirt.c3)}`;
      const chatInput = document.querySelector('[data-hook="input"]') || document.querySelector('textarea[name="chat"]') || document.querySelector('input[type="text"]');
      if (chatInput) {
        chatInput.value = cmd;
        chatInput.dispatchEvent(new Event("input", {
          bubbles: true
        }));
        chatInput.dispatchEvent(new Event("change", {
          bubbles: true
        }));
        chatInput.focus();
      }
    });
    $("hm-save").addEventListener("click", () => {
      const name = prompt("Nombre del jersey:");
      if (!name?.trim()) return;
      const db = getDB();
      db.push({
        ...shirt,
        name: name.trim()
      });
      saveDB(db);
    });
    function getDB() {
      return JSON.parse(localStorage.getItem("hax_v12_db") || "[]");
    }
    function saveDB(db) {
      localStorage.setItem("hax_v12_db", JSON.stringify(db));
    }
    function renderLibrary() {
      const lib = $("hm-library");
      const db = getDB();
      if (!db.length) {
        lib.innerHTML = '<div class="hm-empty">LIBRARY EMPTY</div>';
        return;
      }
      lib.innerHTML = "";
      db.forEach((item, i) => {
        const row = document.createElement("div");
        row.className = "hm-lib-item";
        const dot = document.createElement("div");
        dot.className = "hm-lib-dot";
        dot.style.background = getGradient(item);
        const name = document.createElement("div");
        name.className = "hm-lib-name";
        name.textContent = item.name;
        const del = document.createElement("button");
        del.className = "hm-lib-del";
        del.textContent = "✕";
        del.title = "Eliminar";
        del.addEventListener("click", e => {
          e.stopPropagation();
          const updated = getDB();
          updated.splice(i, 1);
          saveDB(updated);
          renderLibrary();
        });
        row.appendChild(dot);
        row.appendChild(name);
        row.appendChild(del);
        row.addEventListener("click", () => {
          shirt = {
            ...item
          };
          updateInputs();
          setTab("studio");
          syncPreview();
        });
        lib.appendChild(row);
      });
    }
    updateInputs();
    syncPreview();
  }
  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();