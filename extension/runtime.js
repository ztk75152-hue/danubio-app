"use strict";
(function() {
  if (window.__HAXBALL_RUNTIME_LOADED__) return;
  if (window.location.href.includes("cpmstar") || window.location.href.includes("google")) return;
  window.__HAXBALL_RUNTIME_LOADED__ = true;
  document.addEventListener("contextmenu", function(e) { e.preventDefault(); }, true);
  function preventTranslation() {
    const meta = document.createElement("meta");
    meta.name = "google";
    meta.content = "notranslate";
    (document.head || document.documentElement).appendChild(meta);
    document.documentElement.setAttribute("lang", "es");
    document.documentElement.classList.add("notranslate");
    if (document.body) document.body.translate = false;
  }
  function applyDanubioNick() {
    const requested = new URLSearchParams(window.location.search).get("danubioNick");
    if (!requested) return;
    const nick = requested.slice(0, 25);
    let tries = 0;
    const timer = setInterval(function() {
      const inputs = Array.from(document.querySelectorAll('input[type="text"], input:not([type])'));
      const input = inputs.find(function(el) {
        const context = [
          el.placeholder, el.getAttribute("aria-label"), el.name,
          el.parentElement && el.parentElement.innerText
        ].filter(Boolean).join(" ").toLowerCase();
        return /nick|nickname|apodo|choose name|nombre/.test(context);
      }) || (document.body.innerText.toLowerCase().includes("choose nickname") ? inputs.find(function(el) { return el.offsetParent !== null; }) : null);
      if (input) {
        input.value = nick;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        clearInterval(timer);
      } else if (++tries >= 60) {
        clearInterval(timer);
      }
    }, 250);
  }  function injectScript(fileName) {
    return new Promise(resolve => {
      const fullUrl = chrome.runtime.getURL(fileName);
      const script = document.createElement("script");
      script.src = fullUrl;
      script.async = false;
      if (fileName === "extensions/header.js") script.dataset.logoUrl = chrome.runtime.getURL("danubio.png");
      if (fileName === "extensions/ball-gallery.js") script.dataset.assetsBase = chrome.runtime.getURL("assets/balls/");
      if (fileName === "extensions/field-gallery.js") script.dataset.assetsBase = chrome.runtime.getURL("assets/fields/");
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      (document.head || document.documentElement).appendChild(script);
    });
  }
  function injectParallel(paths) { return Promise.all(paths.map(injectScript)); }
  function injectParallelIdle(paths, timeout) {
    const run = () => injectParallel(paths);
    if (typeof requestIdleCallback === "function") requestIdleCallback(run, { timeout: timeout || 2000 });
    else setTimeout(run, 300);
  }
  async function initializeApp() {
    preventTranslation();
    window.Modernizr = {
      canvas:true, datachannel:true, dataview:true, es6collections:true,
      peerconnection:true, promises:true, websockets:true
    };
    window.__HAXBALL_DESKTOP_LOADED__ = true;
    await injectScript("extensions/core.js");
    await injectParallel(["extensions/stretched.js","extensions/header.js","extensions/settings.js","extensions/avatar-image.js","extensions/ball-skin.js","extensions/scoreboard-skin.js"]);
    injectParallelIdle(["extensions/ball-gallery.js","extensions/avatar-ball-panel.js","extensions/scoreboard-panel.js"]);
  }
  if (document.readyState === "complete" || document.readyState === "interactive") initializeApp();
  else window.addEventListener("DOMContentLoaded", initializeApp);
})();
