(function() {
  const HEADER_HEIGHT = 52;
  const onF2 = e => {
    if (e.key !== "F2") return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (Injector.isMainFrame()) {
      window.dispatchEvent(new CustomEvent("toggle-ult-ui"));
    } else {
      try {
        window.top.dispatchEvent(new CustomEvent("toggle-ult-ui"));
      } catch (_) {
        window.parent.postMessage({
          action: "FORCE_TOGGLE_UI"
        }, "*");
      }
    }
  };
  window.addEventListener("keydown", onF2, true);
  if (Injector.isMainFrame()) {
    window.addEventListener("message", e => {
      if (e.data?.action === "FORCE_TOGGLE_UI") {
        window.dispatchEvent(new CustomEvent("toggle-ult-ui"));
        return;
      }
      if (e.data?.channel !== "danubio-discord-presence" || !e.source) return;
      const fromGameFrame = Array.from(document.querySelectorAll("iframe")).some(frame => frame.contentWindow === e.source);
      if (!fromGameFrame) return;
      const request = e.data;
      const discord = window.danubioDiscord;
      if (!discord || !request.requestId) {
        e.source.postMessage({ channel: "danubio-discord-presence-result", requestId: request.requestId, connected: false, reason: "unavailable" }, e.origin);
        return;
      }
      Promise.resolve(discord.getPresenceState()).then(state => {
        return Promise.resolve(state.connected ? discord.disablePresence() : discord.enablePresence()).then(result => ({ ...result, wasConnected: state.connected }));
      }).then(result => {
        e.source.postMessage({ channel: "danubio-discord-presence-result", requestId: request.requestId, ...result }, e.origin);
      }).catch(() => {
        e.source.postMessage({ channel: "danubio-discord-presence-result", requestId: request.requestId, connected: false, reason: "unavailable" }, e.origin);
      });
    });
  }
  if (!Injector.isMainFrame()) return;
  if (window.__headerInjected) return;
  window.__headerInjected = true;
  const LOGO_URL = document.currentScript?.dataset.logoUrl || "logo.png";
  const HX_LOGO_SVG = `<img id="logo-hx" src="${LOGO_URL}" width="34" height="34"\n         style="cursor:pointer; display:block; border-radius:8px;" alt="logo">`;
  const DISCORD_SVG = `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/></svg>`;
  const GITHUB_SVG = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`;
  const CHEVRON_UP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
  const CHEVRON_DOWN = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
  const CSS = `\n        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@300;500;700&display=swap');\n\n        :root { --hbx-h: ${HEADER_HEIGHT}px; --hbx-ease: cubic-bezier(0.22,1,0.36,1); }\n\n        #ult-header {\n            position: fixed; top: 0; left: 0; right: 0;\n            height: var(--hbx-h);\n            display: grid;\n            grid-template-columns: 1fr 2fr 1fr;\n            align-items: center;\n            padding: 0 24px;\n            z-index: 999999;\n            font-family: 'Outfit', sans-serif;\n            user-select: none;\n            background: #000;\n            backdrop-filter: blur(28px) saturate(160%);\n            -webkit-backdrop-filter: blur(28px) saturate(160%);\n            border-bottom: 1px solid rgba(255,255,255,0.08);\n            box-shadow: 0 4px 32px -4px rgba(0,0,0,0.5);\n            will-change: transform, opacity;\n            contain: layout style;\n            transition: transform .42s var(--hbx-ease), opacity .42s var(--hbx-ease), box-shadow .3s ease;\n            --local-accent: #ffffff;\n        }\n        #ult-header.hidden {\n            transform: translateY(-100%);\n            opacity: 0;\n            pointer-events: none;\n        }\n\n        .hdr-left { display:flex; align-items:center; }\n        #logo-hx-wrap {\n            display: flex; align-items: center;\n            text-decoration: none; cursor: pointer;\n            transition: transform .25s var(--hbx-ease), filter .25s ease;\n        }\n        #logo-hx-wrap:hover {\n            transform: translateY(-2px);\n            filter: drop-shadow(0 0 10px var(--local-accent));\n        }\n\n        .hdr-center { display:flex; justify-content:center; }\n        .input-wrap { width:100%; max-width:420px; position:relative; }\n\n        #room-input {\n            width: 100%; box-sizing: border-box;\n            background: color-mix(in srgb, var(--theme-text-primary,#fff) 3%, transparent);\n            border: 1px solid color-mix(in srgb, var(--local-accent) 20%, transparent);\n            border-radius: 7px;\n            padding: 8px 16px;\n            color: var(--theme-text-primary, #e8e8e8);\n            font-family: 'DM Mono', monospace;\n            font-size: 10px; letter-spacing: 2.2px; text-transform: uppercase;\n            text-align: center; outline: none;\n            transition: border-color .25s ease, background .25s ease, box-shadow .25s ease;\n        }\n        #room-input::placeholder {\n            color: color-mix(in srgb, var(--theme-text-secondary,#fff) 30%, transparent);\n            letter-spacing: 1.8px;\n        }\n        #room-input:focus {\n            border-color: var(--local-accent);\n            background: color-mix(in srgb, var(--local-accent) 6%, transparent);\n            box-shadow: 0 0 0 3px color-mix(in srgb, var(--local-accent) 14%, transparent),\n                        inset 0 1px 0 color-mix(in srgb, var(--local-accent) 10%, transparent);\n        }\n\n        .hdr-right { display:flex; justify-content:flex-end; align-items:center; gap:4px; }\n\n        .action-btn {\n            background: none; border: none; cursor: pointer;\n            padding: 7px; border-radius: 6px;\n            color: #ffffff;\n            display: flex; align-items:center; justify-content:center;\n            transition: color .2s ease, background .2s ease, transform .2s var(--hbx-ease), filter .2s ease;\n        }\n        .action-btn:hover {\n            color: #ffffff;\n            background: rgba(255,255,255,0.1);\n            transform: translateY(-2px);\n            filter: drop-shadow(0 0 6px var(--local-accent));\n        }\n        .action-btn:active { transform: translateY(0); }\n\n        #btn-close-ui { position:relative; }\n        #btn-close-ui::after {\n            content: 'F2';\n            position: absolute; bottom: -1px; right: -1px;\n            font-family: 'DM Mono', monospace; font-size: 7px; font-weight: 500;\n            letter-spacing: .5px;\n            color: color-mix(in srgb, var(--local-accent) 65%, transparent);\n            line-height: 1;\n        }\n\n        #trigger-pill {\n            position: fixed; top: 0; left: 50%;\n            transform: translateX(-50%) translateY(-100%);\n            display: flex; align-items: center; gap: 5px;\n            padding: 5px 14px 5px 12px;\n            background: color-mix(in srgb, var(--theme-bg-primary, #08080c) 88%, transparent);\n            backdrop-filter: blur(16px);\n            border: 1px solid color-mix(in srgb, var(--local-accent,#a78bfa) 18%, transparent);\n            border-top: none;\n            border-radius: 0 0 10px 10px;\n            cursor: pointer; z-index: 999998;\n            color: color-mix(in srgb, var(--theme-text-secondary,#fff) 40%, transparent);\n            font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1.5px;\n            text-transform: uppercase;\n            will-change: transform;\n            transition: transform .36s var(--hbx-ease), background .2s ease, color .2s ease, box-shadow .2s ease;\n            --local-accent: var(--theme-accent, var(--theme-text-secondary, #a78bfa));\n        }\n        #trigger-pill.visible { transform: translateX(-50%) translateY(0%); }\n        #trigger-pill:hover {\n            background: color-mix(in srgb, var(--local-accent) 12%, var(--theme-bg-primary,#08080c));\n            color: var(--local-accent);\n            box-shadow: 0 4px 20px color-mix(in srgb, var(--local-accent) 15%, transparent);\n        }\n\n        iframe {\n            transition: top .42s var(--hbx-ease), height .42s var(--hbx-ease) !important;\n        }\n    `;
  function updateLayout(visible) {
    const h = visible ? HEADER_HEIGHT : 0;
    document.querySelectorAll("iframe").forEach(f => {
      f.style.setProperty("top", `${h}px`, "important");
      f.style.setProperty("height", `calc(100vh - ${h}px)`, "important");
      f.style.setProperty("position", "fixed", "important");
    });
  }
  let syncRaf = null;
  Injector.waitForElement("body").then(() => {
    Injector.injectCSS("ult-v18-prestige", CSS);
    const header = document.createElement("div");
    header.id = "ult-header";
    header.innerHTML = `\n            <div class="hdr-left">\n                <div id="logo-hx-wrap" title="Ir a Haxball" onclick="window.location.href='https://www.haxball.com/play'">\n                    ${HX_LOGO_SVG}\n                </div>\n            </div>\n            <div class="hdr-center">\n                <div class="input-wrap">\n                    <input type="text" id="room-input"\n                           placeholder="Pega el link de la sala…"\n                           autocomplete="off" spellcheck="false">\n                </div>\n            </div>\n            <div class="hdr-right">\n                <button class="action-btn" onclick="window.open('https://discord.gg/hewdfvw9v','_blank')" title="Discord">\n                    ${DISCORD_SVG}\n                </button>\n                <button class="action-btn" title="GitHub">\n                    ${GITHUB_SVG}\n                </button>\n                <button id="btn-close-ui" class="action-btn" title="Ocultar (F2)">\n                    ${CHEVRON_UP}\n                </button>\n            </div>`;
    document.body.prepend(header);
    const trigger = document.createElement("div");
    trigger.id = "trigger-pill";
    trigger.innerHTML = `${CHEVRON_DOWN}<span>F2</span>`;
    document.body.appendChild(trigger);
    let visible = true;
    const toggle = () => {
      visible = !visible;
      header.classList.toggle("hidden", !visible);
      trigger.classList.toggle("visible", !visible);
      updateLayout(visible);
    };
    document.getElementById("btn-close-ui").addEventListener("click", toggle);
    trigger.addEventListener("click", toggle);
    window.addEventListener("toggle-ult-ui", toggle);
    const input = document.getElementById("room-input");
    input.addEventListener("keydown", e => {
      e.stopPropagation();
      if (e.key !== "Enter") return;
      const val = input.value.trim();
      if (!val) return;
      const cMatch = val.match(/c=([a-zA-Z0-9_-]+)/);
      const pwMatch = val.match(/pw=([a-zA-Z0-9_-]+)/);
      if (cMatch) {
        let url = `https://www.haxball.com/play?c=${cMatch[1]}`;
        if (pwMatch) url += `&pw=${pwMatch[1]}`;
        window.location.href = url;
      } else if (val.startsWith("http")) {
        window.location.href = val;
      } else {
        window.location.href = `https://www.haxball.com/play?c=${val}`;
      }
    });
    updateLayout(true);
  });
})();
