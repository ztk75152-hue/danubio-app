(function() {
  if (window.__HAX_LINKS_LOADED) return;
  window.__HAX_LINKS_LOADED = true;
  const URL_REGEX = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[^\s<>"']+)/g;
  const ROOM_REGEX = /^https?:\/\/(?:www\.)?haxball\.com\/play\?c=([a-zA-Z0-9_-]{8,15})$/;
  const IMAGE_REGEX = /\.(jpe?g|png|gif|webp|bmp|svg)(\?[^\s]*)?$/i;
  const VIDEO_REGEX = /\.(mp4|webm|ogg|mov)(\?[^\s]*)?$/i;
  const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const TWITCH_CLIP_REGEX = /clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/;
  const STREAMABLE_REGEX = /streamable\.com\/([a-zA-Z0-9]+)/;
  const GFYCAT_REGEX = /gfycat\.com\/(?:ifr\/)?([a-zA-Z0-9]+)/i;
  const IMGUR_REGEX = /imgur\.com\/(?:a\/|gallery\/)?([a-zA-Z0-9]+)/;
  const TWITTER_REGEX = /(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/;
  const processed = new WeakSet;
  const STYLES = `\n        .chat-link {\n            color: #60a5fa !important;\n            cursor: pointer !important;\n            font-weight: 500;\n            transition: color 0.2s, filter 0.2s;\n            text-decoration: none;\n            position: relative;\n        }\n        .chat-link:hover { text-decoration: underline !important; filter: brightness(1.3); }\n        .chat-link-room  { color: #4ade80 !important; font-weight: bold; }\n\n\n        .hax-preview {\n            position: fixed;\n            z-index: 99999;\n            max-width: min(520px, 90vw);\n            background: #0f0f13;\n            border: 1px solid #2a2a38;\n            border-radius: 12px;\n            overflow: hidden;\n            box-shadow: 0 24px 64px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.05);\n            animation: hax-pop .18s cubic-bezier(.22,.68,0,1.2) both;\n            pointer-events: auto;\n        }\n        @keyframes hax-pop {\n            from { opacity:0; transform: scale(.9) translateY(6px); }\n            to   { opacity:1; transform: scale(1) translateY(0); }\n        }\n        .hax-preview-close {\n            position: absolute; top: 6px; right: 8px;\n            background: rgba(0,0,0,.55);\n            border: none; border-radius: 50%;\n            color: #fff; font-size: 16px;\n            width: 26px; height: 26px;\n            cursor: pointer; display: flex; align-items: center; justify-content: center;\n            line-height: 1; z-index: 1; transition: background .15s;\n        }\n        .hax-preview-close:hover { background: rgba(255,80,80,.7); }\n\n\n        .hax-preview img {\n            display: block; max-width: 100%; max-height: 70vh;\n            object-fit: contain; background: #050508;\n        }\n\n        .hax-preview video {\n            display: block; max-width: 100%; max-height: 70vh;\n            background: #000;\n        }\n\n        .hax-preview iframe {\n            display: block; width: 520px; max-width: 90vw;\n            height: 292px; border: none; background: #000;\n        }\n\n        .hax-preview .hax-tweet-wrap {\n            padding: 14px 16px;\n            font-family: -apple-system, sans-serif;\n            font-size: 13px; color: #ccc;\n        }\n        .hax-preview .hax-tweet-wrap a { color: #1d9bf0; }\n\n\n        .hax-spinner {\n            display: flex; align-items: center; justify-content: center;\n            width: 200px; height: 120px; color: #555; font-size: 28px;\n        }\n        .hax-spinner::after {\n            content: '';\n            width: 28px; height: 28px;\n            border: 3px solid #2a2a38;\n            border-top-color: #60a5fa;\n            border-radius: 50%;\n            animation: hax-spin .7s linear infinite;\n        }\n        @keyframes hax-spin { to { transform: rotate(360deg); } }\n\n\n        .chat-link[data-thumb]::after {\n            content: '🖼';\n            font-size: 11px;\n            margin-left: 3px;\n            opacity: .6;\n        }\n        .chat-link[data-type="video"]::after { content: '▶'; }\n        .chat-link[data-type="youtube"]::after { content: '▶'; color: #f00; }\n    `;
  function detectType(href) {
    if (ROOM_REGEX.test(href)) return {
      kind: "room"
    };
    if (IMAGE_REGEX.test(href)) return {
      kind: "image",
      src: href
    };
    if (VIDEO_REGEX.test(href)) return {
      kind: "video",
      src: href
    };
    let m;
    if (m = YOUTUBE_REGEX.exec(href)) return {
      kind: "youtube",
      id: m[1]
    };
    if (m = TWITCH_CLIP_REGEX.exec(href)) return {
      kind: "twitch-clip",
      id: m[1]
    };
    if (m = STREAMABLE_REGEX.exec(href)) return {
      kind: "streamable",
      id: m[1]
    };
    if (m = GFYCAT_REGEX.exec(href)) return {
      kind: "gfycat",
      id: m[1]
    };
    if (m = IMGUR_REGEX.exec(href)) return {
      kind: "imgur",
      id: m[1],
      href: href
    };
    if (m = TWITTER_REGEX.exec(href)) return {
      kind: "tweet",
      id: m[1],
      href: href
    };
    return {
      kind: "link"
    };
  }
  function buildPreviewContent(info) {
    const wrap = document.createElement("div");
    switch (info.kind) {
     case "image":
      {
        const img = document.createElement("img");
        img.src = info.src;
        img.alt = "preview";
        img.loading = "lazy";
        wrap.appendChild(img);
        break;
      }

     case "video":
      {
        const vid = document.createElement("video");
        vid.src = info.src;
        vid.controls = true;
        vid.autoplay = false;
        vid.preload = "metadata";
        vid.style.maxWidth = "520px";
        wrap.appendChild(vid);
        break;
      }

     case "youtube":
      {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${info.id}?autoplay=0&rel=0`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
        break;
      }

     case "twitch-clip":
      {
        const iframe = document.createElement("iframe");
        iframe.src = `https://clips.twitch.tv/embed?clip=${info.id}&parent=${location.hostname || "localhost"}`;
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
        break;
      }

     case "streamable":
      {
        const iframe = document.createElement("iframe");
        iframe.src = `https://streamable.com/e/${info.id}`;
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
        break;
      }

     case "gfycat":
      {
        const iframe = document.createElement("iframe");
        iframe.src = `https://gfycat.com/ifr/${info.id}`;
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
        break;
      }

     case "imgur":
      {
        if (/imgur\.com\/a\//.test(info.href) || /imgur\.com\/gallery\//.test(info.href)) {
          const iframe = document.createElement("iframe");
          iframe.src = `https://imgur.com/a/${info.id}/embed?pub=true`;
          iframe.allowFullscreen = true;
          wrap.appendChild(iframe);
        } else {
          const img = document.createElement("img");
          img.src = `https://i.imgur.com/${info.id}.jpg`;
          img.onerror = () => {
            img.src = `https://i.imgur.com/${info.id}.png`;
          };
          img.loading = "lazy";
          wrap.appendChild(img);
        }
        break;
      }

     case "tweet":
      {
        const tw = document.createElement("div");
        tw.className = "hax-tweet-wrap";
        tw.innerHTML = `<a href="${info.href}" target="_blank" rel="noopener">${info.href}</a><br><small style="color:#555">Cargando tweet…</small>`;
        wrap.appendChild(tw);
        fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(info.href)}&omit_script=1&dnt=1`).then(r => r.json()).then(d => {
          tw.innerHTML = d.html || tw.innerHTML;
          if (!window.__twttr && !document.querySelector('script[src*="widgets.js"]')) {
            const s = document.createElement("script");
            s.src = "https://platform.twitter.com/widgets.js";
            s.async = true;
            document.body.appendChild(s);
          } else {
            window.twttr?.widgets?.load(tw);
          }
        }).catch(() => {});
        break;
      }

     default:
      {
        return null;
      }
    }
    return wrap;
  }
  let activePopup = null;
  let activeAnchor = null;
  function closePopup() {
    if (activePopup) {
      activePopup.querySelectorAll("video, audio").forEach(m => {
        try {
          m.pause();
        } catch (e) {}
      });
      activePopup.querySelectorAll("iframe").forEach(f => {
        try {
          f.src = "";
        } catch (e) {}
      });
      activePopup.remove();
      activePopup = null;
      activeAnchor = null;
    }
  }
  function positionPopup(popup, anchor) {
    const rect = anchor.getBoundingClientRect();
    const pw = popup.offsetWidth || 520;
    const ph = popup.offsetHeight || 300;
    const margin = 10;
    let top = rect.bottom + margin;
    let left = rect.left;
    if (top + ph > window.innerHeight - margin) top = Math.max(margin, rect.top - ph - margin);
    left = Math.min(left, window.innerWidth - pw - margin);
    left = Math.max(margin, left);
    popup.style.top = `${top + window.scrollY}px`;
    popup.style.left = `${left + window.scrollX}px`;
  }
  function openPreview(span, info) {
    if (activeAnchor === span) {
      closePopup();
      return;
    }
    closePopup();
    const content = buildPreviewContent(info);
    if (!content) return;
    const popup = document.createElement("div");
    popup.className = "hax-preview";
    const closeBtn = document.createElement("button");
    closeBtn.className = "hax-preview-close";
    closeBtn.textContent = "✕";
    closeBtn.addEventListener("click", e => {
      e.stopPropagation();
      closePopup();
    });
    popup.appendChild(closeBtn);
    popup.appendChild(content);
    document.body.appendChild(popup);
    activePopup = popup;
    activeAnchor = span;
    requestAnimationFrame(() => positionPopup(popup, span));
  }
  function processChatMessage(p) {
    if (!p || processed.has(p)) return;
    processed.add(p);
    const text = p.textContent;
    if (!text || !text.includes("http") && !text.includes("www.")) return;
    const parts = [];
    let last = 0, match;
    URL_REGEX.lastIndex = 0;
    while ((match = URL_REGEX.exec(text)) !== null) {
      if (match.index > last) parts.push({
        t: text.slice(last, match.index)
      });
      const raw = match[0];
      const href = raw.startsWith("http") ? raw : "https://" + raw;
      parts.push({
        t: raw,
        link: true,
        href: href,
        info: detectType(href)
      });
      last = match.index + raw.length;
    }
    if (parts.length === 0) return;
    if (last < text.length) parts.push({
      t: text.slice(last)
    });
    const frag = document.createDocumentFragment();
    parts.forEach(part => {
      if (!part.link) {
        frag.appendChild(document.createTextNode(part.t));
        return;
      }
      const {info: info, href: href, t: t} = part;
      const span = document.createElement("span");
      span.textContent = t;
      span.dataset.href = href;
      if (info.kind === "room") {
        span.className = "chat-link chat-link-room";
      } else {
        span.className = "chat-link";
        if (info.kind !== "link") {
          span.dataset.type = info.kind === "image" || info.kind === "imgur" ? "image" : info.kind === "video" ? "video" : info.kind === "youtube" ? "youtube" : "embed";
          span.dataset.hasPreview = "1";
        }
      }
      frag.appendChild(span);
    });
    p.innerHTML = "";
    p.appendChild(frag);
  }
  document.addEventListener("click", e => {
    const t = e.target;
    if (activePopup && !activePopup.contains(t) && !t.classList.contains("chat-link")) {
      closePopup();
      return;
    }
    if (!t.classList.contains("chat-link")) return;
    e.preventDefault();
    e.stopPropagation();
    const href = t.dataset.href;
    const info = detectType(href);
    if (info.kind === "room") {
      window.top.location.href = href;
      return;
    }
    if (t.dataset.hasPreview) {
      openPreview(t, info);
      return;
    }
    navigator.clipboard.writeText(href).then(() => {
      const old = t.textContent;
      t.textContent = "¡Copiado!";
      setTimeout(() => t.textContent = old, 800);
    }).catch(() => {
      window.open(href, "_blank", "noopener");
    });
  }, true);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePopup();
  });
  function init() {
    if (typeof Injector !== "undefined") {
      Injector.injectCSS("hax-links-v2", STYLES);
    } else {
      const s = document.createElement("style");
      s.id = "hax-links-style";
      s.textContent = STYLES;
      document.head.appendChild(s);
    }
    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.tagName === "P") processChatMessage(node);
          node.querySelectorAll?.("p").forEach(processChatMessage);
        }
      }
    });
    function attach(logEl) {
      observer.observe(logEl, {
        childList: true,
        subtree: true
      });
      logEl.querySelectorAll("p").forEach(processChatMessage);
    }
    const log = document.querySelector(".log-contents");
    if (log) {
      attach(log);
    } else if (typeof Injector !== "undefined") {
      Injector.waitForElement(".log-contents").then(attach).catch(() => {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    } else {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
  if (document.readyState === "complete") init(); else window.addEventListener("load", init);
})();