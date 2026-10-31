(function() {
  if (typeof Injector !== "undefined" && Injector.isMainFrame()) return;
  var STORAGE_KEY = "quick_avatars_v2";
  var data = {
    activePack: 0,
    packs: [ {
      name: "Default",
      bindings: []
    } ]
  };
  function loadBindings() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) data = JSON.parse(saved);
    } catch (e) {
      data = {
        activePack: 0,
        packs: [ {
          name: "Default",
          bindings: []
        } ]
      };
    }
  }
  function saveBindings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  function setupChatCleaner() {
    const targetTexts = [ "avatar set", "avatar definido", "avatar cambiado" ];
    const cleanNode = node => {
      if (node.nodeType === 1) {
        const text = (node.textContent || "").toLowerCase();
        if (targetTexts.some(msg => text.includes(msg))) {
          node.style.display = "none";
          node.remove();
        }
      }
    };
    const attachToChat = () => {
      const chatLog = document.querySelector('div[data-hook="log-contents"]');
      if (chatLog && !chatLog.dataset.cleanerActive) {
        chatLog.dataset.cleanerActive = "true";
        new MutationObserver(mutations => {
          for (const mutation of mutations) mutation.addedNodes.forEach(cleanNode);
        }).observe(chatLog, {
          childList: true
        });
      }
    };
    const bodyObserver = new MutationObserver(attachToChat);
    function startBodyObserver() {
      if (!document.body) {
        setTimeout(startBodyObserver, 100);
        return;
      }
      bodyObserver.observe(document.body, {
        childList: true,
        subtree: false
      });
      attachToChat();
    }
    startBodyObserver();
  }
  function applyAvatar(avatar) {
    if (!avatar) return;
    var chatInput = document.querySelector('input[data-hook="input"]');
    if (chatInput) {
      var originalValue = chatInput.value;
      chatInput.value = "/avatar " + avatar;
      chatInput.dispatchEvent(new Event("input", {
        bubbles: true
      }));
      chatInput.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true
      }));
      setTimeout(function() {
        chatInput.value = originalValue;
      }, 50);
    }
  }
  function setupKeyListener() {
    document.addEventListener("keydown", function(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if ([ "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Enter", "Escape" ].indexOf(e.code) !== -1) return;
      var bindings = data.packs[data.activePack].bindings;
      for (var i = 0; i < bindings.length; i++) {
        if (bindings[i].key === e.code) {
          e.preventDefault();
          applyAvatar(bindings[i].avatar);
          break;
        }
      }
    }, {
      passive: false
    });
  }
  function injectSettingsTab(doc) {
    var settingsView = doc.querySelector(".settings-view");
    if (!settingsView || settingsView.dataset.quickAvatarSetup) return;
    settingsView.dataset.quickAvatarSetup = "true";
    var tabs = settingsView.querySelector(".tabs");
    var tabContents = settingsView.querySelector(".tabcontents");
    if (!tabs || !tabContents) return;
    var avatarTabBtn = doc.createElement("button");
    avatarTabBtn.setAttribute("data-hook", "avatarbtn");
    avatarTabBtn.textContent = "Avatars";
    avatarTabBtn.style.display = "none";
    tabs.appendChild(avatarTabBtn);
    var avatarSection = doc.createElement("div");
    avatarSection.className = "section";
    avatarSection.setAttribute("data-hook", "avatarsec");
    avatarSection.style.display = "none";
    tabContents.appendChild(avatarSection);
    function renderAvatarSection() {
      var currentPack = data.packs[data.activePack];
      var packOptions = data.packs.map((p, i) => `<option value="${i}" ${i === data.activePack ? "selected" : ""}>${p.name}</option>`).join("");
      var html = '<div style="padding:16px 20px; box-sizing:border-box; width:100%;">';
      html += '<div style="display:flex; gap:6px; margin-bottom:15px; box-sizing:border-box;">' + '<select id="pack-sel" style="flex:1; background:#1a1a1a; color:#fff; border:1px solid #333; padding:8px; border-radius:4px; font-size:13px; outline:none;">' + packOptions + "</select>" + '<button id="ren-pack" style="padding:8px; background:#272727; color:#fff; border:none; border-radius:4px; cursor:pointer; width:35px;">⚙</button>' + '<button id="add-pack" style="padding:8px 12px; background:#272727; color:#4ade80; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">+</button>' + "</div>";
      if (currentPack.bindings.length > 0) {
        html += '<div style="margin-bottom:16px;">';
        for (var i = 0; i < currentPack.bindings.length; i++) {
          var b = currentPack.bindings[i];
          var keyDisplay = b.key.replace("Key", "").replace("Digit", "").replace("Numpad", "Num");
          html += '<div style="display:flex; align-items:center; gap:12px; padding:10px; background:#1a1a1a; border-radius:6px; margin-bottom:8px; border:1px solid #222; box-sizing:border-box;">' + '<div style="min-width:45px; padding:5px; background:#272727; border-radius:4px; text-align:center; font-weight:bold; font-size:11px; color:#4ade80;">' + keyDisplay + "</div>" + '<div style="flex:1; font-weight:bold; color:#eee;">' + (b.avatar || "--") + "</div>" + '<button class="edit-avatar-btn" data-index="' + i + '" style="padding:5px 8px; background:#272727; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:14px;">🖌</button>' + '<button class="remove-avatar-btn" data-index="' + i + '" style="padding:5px 10px; background:#272727; color:#ff4444; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">✕</button>' + "</div>";
        }
        html += "</div>";
      }
      html += '<button id="add-avatar-binding" style="padding:10px; background:#272727; color:#4ade80; border:none; border-radius:6px; cursor:pointer; width:100%; font-weight:bold; font-size:22px; line-height:1;">+</button></div>';
      avatarSection.innerHTML = html;
      avatarSection.querySelector("#pack-sel").onchange = e => {
        data.activePack = parseInt(e.target.value);
        saveBindings();
        renderAvatarSection();
      };
      avatarSection.querySelector("#ren-pack").onclick = () => {
        var newName = prompt("Nombre del pack:", data.packs[data.activePack].name);
        if (newName && newName.trim()) {
          data.packs[data.activePack].name = newName.trim();
          saveBindings();
          renderAvatarSection();
        }
      };
      avatarSection.querySelector("#add-pack").onclick = () => {
        var name = prompt("Nuevo pack:");
        if (name && name.trim()) {
          data.packs.push({
            name: name.trim(),
            bindings: []
          });
          data.activePack = data.packs.length - 1;
          saveBindings();
          renderAvatarSection();
        }
      };
      avatarSection.querySelectorAll(".remove-avatar-btn").forEach(btn => {
        btn.onclick = () => {
          currentPack.bindings.splice(parseInt(btn.dataset.index), 1);
          saveBindings();
          renderAvatarSection();
        };
      });
      avatarSection.querySelectorAll(".edit-avatar-btn").forEach(btn => {
        btn.onclick = () => {
          showEditDialog(doc, parseInt(btn.dataset.index));
        };
      });
      avatarSection.querySelector("#add-avatar-binding").onclick = () => {
        showEditDialog(doc, -1);
      };
    }
    function showEditDialog(doc, index) {
      var isNew = index === -1;
      var binding = isNew ? {
        key: "",
        avatar: ""
      } : data.packs[data.activePack].bindings[index];
      var overlay = doc.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:10001;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px);";
      overlay.innerHTML = `\n                <div style="background:#111; padding:25px; border-radius:10px; min-width:280px; border:1px solid #333; box-sizing:border-box; font-family:sans-serif;">\n                    <h3 style="margin:0 0 20px 0; text-align:center; color:#4ade80; font-size:13px; font-weight:bold; letter-spacing:1px;">CONFIGURAR</h3>\n                    <button id="key-cap" style="width:100%; padding:12px; margin-bottom:15px; background:#1a1a1a; border:1px solid #444; color:#fff; cursor:pointer; border-radius:4px; font-weight:bold; outline:none; font-size:12px;">${binding.key || "ASIGNAR TECLA"}</button>\n                    <input id="av-in" type="text" maxlength="2" style="width:100%; box-sizing:border-box; padding:12px; margin-bottom:20px; background:#1a1a1a; border:1px solid #444; color:#fff; text-align:center; border-radius:4px; font-size:18px; font-weight:bold; outline:none;" value="${binding.avatar}" placeholder="--">\n                    <div style="display:flex; gap:10px;">\n                        <button id="close-dlg" style="flex:1; padding:10px; background:#222; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;">CANCELAR</button>\n                        <button id="save-dlg" style="flex:1; padding:10px; background:#4ade80; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px;">GUARDAR</button>\n                    </div>\n                </div>`;
      doc.body.appendChild(overlay);
      var currentKey = binding.key;
      var capBtn = overlay.querySelector("#key-cap");
      capBtn.onclick = () => {
        capBtn.textContent = "...";
        const handler = e => {
          e.preventDefault();
          currentKey = e.code;
          capBtn.textContent = e.code.replace("Key", "").replace("Digit", "");
          doc.removeEventListener("keydown", handler, true);
        };
        doc.addEventListener("keydown", handler, true);
      };
      overlay.querySelector("#close-dlg").onclick = () => overlay.remove();
      overlay.querySelector("#save-dlg").onclick = () => {
        var val = overlay.querySelector("#av-in").value.trim();
        if (!currentKey) return;
        if (isNew) data.packs[data.activePack].bindings.push({
          key: currentKey,
          avatar: val
        }); else data.packs[data.activePack].bindings[index] = {
          key: currentKey,
          avatar: val
        };
        saveBindings();
        overlay.remove();
        renderAvatarSection();
      };
    }
    avatarTabBtn.onclick = function() {
      var dialog = doc.querySelector(".dialog.settings-view");
      if (dialog) {
        dialog.querySelectorAll(".tabcontents > .section").forEach(s => {
          s.style.display = "none";
        });
        [ "theme-section", "perf-section", "multiauth-section", "geo-section" ].forEach(h => {
          var s = dialog.querySelector('[data-hook="' + h + '"]');
          if (s) s.style.display = "none";
        });
        dialog.style.maxHeight = "";
        dialog.style.height = "";
        var tc = dialog.querySelector(".tabcontents");
        if (tc) {
          tc.style.maxHeight = "";
          tc.style.overflowY = "";
        }
      }
      avatarSection.style.display = "block";
      renderAvatarSection();
    };
  }
  function init() {
    loadBindings();
    setupKeyListener();
    setupChatCleaner();
    Injector.onSettingsView(function(sv) {
      if (sv && !sv.dataset.quickAvatarSetup) injectSettingsTab(document);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();