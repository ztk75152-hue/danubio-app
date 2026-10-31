(function() {
  if (Injector.isMainFrame()) return;
  var roomListObserver = null;
  var cachedRows = null;
  var selectedCountry = "all";
  var searchTimeout = null;
  var isFilteringFavs = false;
  var _cachedAccent = "";
  function getAccentColor() {
    if (!_cachedAccent) _cachedAccent = getComputedStyle(document.documentElement).getPropertyValue("--theme-text-secondary").trim() || "#f59e0b";
    return _cachedAccent;
  }
  new MutationObserver(function() {
    _cachedAccent = "";
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: [ "style", "data-theme" ]
  });
  var FAV_STORAGE_KEY = "fav_rooms";
  function getFavRooms() {
    try {
      return JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveFavRooms(rooms) {
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(rooms));
  }
  function toggleFavRoom(roomName) {
    var cleanName = roomName.trim();
    var favRooms = getFavRooms();
    var index = favRooms.indexOf(cleanName);
    if (index === -1) {
      favRooms.push(cleanName);
      saveFavRooms(favRooms);
      return true;
    } else {
      favRooms.splice(index, 1);
      saveFavRooms(favRooms);
      return false;
    }
  }
  function isFavRoom(roomName) {
    return getFavRooms().indexOf(roomName) !== -1;
  }
  var PINNED_STORAGE_KEY = "pinned_rooms";
  function getPinnedRooms() {
    try {
      return JSON.parse(sessionStorage.getItem(PINNED_STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }
  function savePinnedRooms(rooms) {
    sessionStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(rooms));
  }
  function togglePinnedRoom(roomName) {
    var cleanName = roomName.trim();
    var pinnedRooms = getPinnedRooms();
    var index = pinnedRooms.indexOf(cleanName);
    if (index === -1) {
      pinnedRooms.push(cleanName);
      savePinnedRooms(pinnedRooms);
      return true;
    } else {
      pinnedRooms.splice(index, 1);
      savePinnedRooms(pinnedRooms);
      return false;
    }
  }
  function isPinnedRoom(roomName) {
    return getPinnedRooms().indexOf(roomName.trim()) !== -1;
  }
  function clearPinnedRooms() {
    sessionStorage.removeItem(PINNED_STORAGE_KEY);
  }
  function movePinnedToTop(listContainer) {
    if (!listContainer) return;
    var pinned = getPinnedRooms();
    if (!pinned.length) return;
    var rows = listContainer.querySelectorAll("tr");
    var pinnedArr = [];
    for (var i = 0; i < rows.length; i++) {
      var nc = rows[i].querySelector('[data-hook="name"]');
      if (nc && pinned.indexOf((nc.textContent || "").trim()) !== -1) pinnedArr.push(rows[i]);
    }
    if (!pinnedArr.length) return;
    if (rows[0] === pinnedArr[0] && pinnedArr.length === 1) return;
    for (var j = pinnedArr.length - 1; j >= 0; j--) listContainer.prepend(pinnedArr[j]);
  }
  function updatePinnedHighlight(container) {
    var rows = container.querySelectorAll("tr");
    var pinnedRooms = getPinnedRooms();
    for (var i = 0; i < rows.length; i++) {
      var nameCell = rows[i].querySelector('[data-hook="name"]');
      if (!nameCell) continue;
      var name = (nameCell.textContent || "").trim();
      if (pinnedRooms.indexOf(name) !== -1) {
        rows[i].classList.add("pinned-room");
      } else {
        rows[i].classList.remove("pinned-room");
      }
    }
  }
  function cleanupRoomList() {
    if (roomListObserver) {
      roomListObserver.disconnect();
      roomListObserver = null;
    }
    cachedRows = null;
  }
  function buildCache(iframeDoc) {
    var table = iframeDoc.querySelector("[data-hook='list']");
    if (!table) return [];
    cachedRows = [];
    var rows = table.querySelectorAll("tr");
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var nameCell = row.querySelector("[data-hook='name']");
      var flagCell = row.querySelector("[data-hook='flag']");
      cachedRows.push({
        row: row,
        name: nameCell ? (nameCell.textContent || "").toLowerCase() : "",
        country: function(fc) {
          if (!fc) return "";
          var cls = fc.className;
          var idx = cls.indexOf("f-");
          return idx !== -1 ? cls.slice(idx + 2).split(" ")[0] : "";
        }(flagCell)
      });
    }
    return cachedRows;
  }
  function doSearch(iframeDoc, searchTerm) {
    // La lista de salas se puede actualizar sola (llegan salas nuevas por
    // websocket) sin que el usuario toque "Actualizar". Antes, si eso pasaba,
    // la busqueda seguia mirando la caché vieja y las salas nuevas quedaban
    // afuera del filtro (parecia que "no buscaba"). Ahora comparamos la
    // cantidad de filas reales contra la caché y la reconstruimos si cambio.
    var table = iframeDoc.querySelector("[data-hook='list']");
    var liveCount = table ? table.querySelectorAll("tr").length : 0;
    if (!cachedRows || cachedRows.length !== liveCount) {
      cachedRows = buildCache(iframeDoc);
    }
    var rows = cachedRows;
    var len = rows.length;
    if (!len) return;
    var all = selectedCountry === "all";
    var empty = searchTerm === "";
    for (var i = 0; i < len; i++) {
      var item = rows[i];
      var ok = (empty || item.name.indexOf(searchTerm) !== -1) && (all || item.country === selectedCountry);
      item.row.classList.toggle("search-hidden", !ok);
    }
  }
  function modifyRoomList(iframeDoc) {
    var listContainer = iframeDoc.querySelector('.roomlist-view tbody[data-hook="list"]');
    var roomlistView = iframeDoc.querySelector(".roomlist-view");
    if (!listContainer || !roomlistView) {
      cleanupRoomList();
      return;
    }
    var dialog = roomlistView.querySelector(".dialog");
    if (!dialog) return;
    if (!iframeDoc.getElementById("sidebar-panel")) {
      var tooltip = iframeDoc.createElement("div");
      tooltip.id = "sidebar-tooltip";
      tooltip.style.cssText = "position:fixed;background:var(--theme-tooltip-bg, #222);color:var(--theme-text-primary, #fff);padding:6px 10px;border-radius:6px;font-size:12px;pointer-events:none;opacity:0;transition:opacity 0.15s;z-index:10000;white-space:nowrap;border:1px solid var(--theme-tooltip-border, #333);box-shadow:0 4px 16px rgba(0,0,0,0.3);";
      iframeDoc.body.appendChild(tooltip);
      function showTooltip(el, text) {
        var rect = el.getBoundingClientRect();
        tooltip.textContent = text;
        tooltip.style.left = rect.right + 8 + "px";
        tooltip.style.top = rect.top + rect.height / 2 - 12 + "px";
        tooltip.style.opacity = "1";
      }
      function hideTooltip() {
        tooltip.style.opacity = "0";
      }
      function addTooltip(el, text) {
        if (!el) return;
        el.addEventListener("mouseenter", function() {
          showTooltip(el, text);
        });
        el.addEventListener("mouseleave", hideTooltip);
        el.addEventListener("click", hideTooltip);
      }
      var sidebar = iframeDoc.createElement("div");
      sidebar.id = "sidebar-panel";
      sidebar.style.cssText = "position:absolute;right:-50px;top:5px;bottom:5px;width:50px;background:var(--theme-bg-primary, #141414);border:1px solid var(--theme-border, #232323);border-radius:0 8px 8px 0;display:flex;flex-direction:column;gap:8px;padding:10px 6px;box-sizing:border-box;z-index:-1;";
      sidebar.addEventListener("mouseleave", hideTooltip);
      var refreshBtn = iframeDoc.querySelector('.roomlist-view button[data-hook="refresh"]');
      var joinBtn = iframeDoc.querySelector('.roomlist-view button[data-hook="join"]');
      var createBtn = iframeDoc.querySelector('.roomlist-view button[data-hook="create"]');
      var replaysLabel = iframeDoc.querySelector('.roomlist-view label[for="replayfile"]');
      var settingsBtn = iframeDoc.querySelector('.roomlist-view button[data-hook="settings"]');
      if (refreshBtn) {
        refreshBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>';
        var t = window.__t || function(k) {
          return k;
        };
        addTooltip(refreshBtn, t("Atualizar"));
        sidebar.appendChild(refreshBtn);
      }
      if (joinBtn) {
        var joinWrapper = iframeDoc.createElement("div");
        joinWrapper.style.cssText = "display:flex;justify-content:center;";
        joinBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>';
        addTooltip(joinWrapper, t("Entrar"));
        joinWrapper.appendChild(joinBtn);
        sidebar.appendChild(joinWrapper);
      }
      if (createBtn) {
        createBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
        addTooltip(createBtn, t("Criar Sala"));
        sidebar.appendChild(createBtn);
      }
      var sep = iframeDoc.createElement("div");
      sep.style.cssText = "height:1px;background:var(--theme-border,#232323);margin:2px 4px;flex-shrink:0";
      sidebar.appendChild(sep);
      var favBtn = iframeDoc.createElement("button");
      favBtn.id = "fav-filter-btn";
      addTooltip(favBtn, t("Favoritos"));
      favBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
      favBtn.onclick = function() {
        isFilteringFavs = !isFilteringFavs;
        var svgEl = favBtn.querySelector("svg");
        if (isFilteringFavs) {
          var ac = getAccentColor();
          svgEl.setAttribute("fill", ac);
          svgEl.setAttribute("stroke", ac);
          var favRooms = getFavRooms();
          if (favRooms.length === 0) {
            isFilteringFavs = false;
            svgEl.setAttribute("fill", "none");
            svgEl.setAttribute("stroke", "currentColor");
            return;
          }
          var rows = listContainer.querySelectorAll("tr");
          for (var i = 0; i < rows.length; i++) {
            var nameEl = rows[i].querySelector('[data-hook="name"]');
            if (!nameEl) continue;
            var rn = (nameEl.textContent || "").trim();
            rows[i].classList.toggle("fav-hidden", favRooms.indexOf(rn) === -1);
          }
        } else {
          svgEl.setAttribute("fill", "none");
          svgEl.setAttribute("stroke", "currentColor");
          var rows = listContainer.querySelectorAll("tr");
          for (var i = 0; i < rows.length; i++) rows[i].classList.remove("fav-hidden");
        }
      };
      sidebar.appendChild(favBtn);
      var spacer = iframeDoc.createElement("div");
      spacer.style.cssText = "flex:1;";
      sidebar.appendChild(spacer);
      if (replaysLabel) {
        replaysLabel.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        addTooltip(replaysLabel, t("Replays"));
        sidebar.appendChild(replaysLabel);
      }
      if (settingsBtn) {
        settingsBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>';
        addTooltip(settingsBtn, t("Configurações"));
        sidebar.appendChild(settingsBtn);
      }
      var buttonsContainer = iframeDoc.querySelector(".roomlist-view .buttons");
      if (buttonsContainer) {
        buttonsContainer.style.display = "none";
      }
      var backBtn = iframeDoc.createElement("button");
      backBtn.id = "back-btn";
      addTooltip(backBtn, t("Voltar"));
      backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>';
      backBtn.onclick = function() {
        window.top.location.reload();
      };
      sidebar.insertBefore(backBtn, sidebar.firstChild);
      dialog.style.position = "relative";
      dialog.appendChild(sidebar);
      if (refreshBtn) {
        refreshBtn.addEventListener("click", function() {
          cachedRows = null;
          isFilteringFavs = false;
          var favBtnEl = iframeDoc.getElementById("fav-filter-btn");
          if (favBtnEl) {
            var favSvgR = favBtnEl.querySelector("svg");
            if (favSvgR) {
              favSvgR.setAttribute("fill", "none");
              favSvgR.setAttribute("stroke", "currentColor");
              isFilteringFavs = false;
            }
          }
        });
      }
      var contextMenu = null;
      function createContextMenu() {
        var menu = iframeDoc.createElement("div");
        menu.id = "room-context-menu";
        menu.style.cssText = "position:fixed;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:8px;padding:6px;min-width:180px;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,0.5);display:none;animation:ctxFadeIn .1s ease;";
        if (!iframeDoc.getElementById("ctx-menu-styles")) {
          var ctxStyle = iframeDoc.createElement("style");
          ctxStyle.id = "ctx-menu-styles";
          ctxStyle.textContent = "@keyframes ctxFadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}";
          iframeDoc.head.appendChild(ctxStyle);
        }
        iframeDoc.body.appendChild(menu);
        return menu;
      }
      function showContextMenu(e, roomName) {
        e.preventDefault();
        if (!contextMenu) contextMenu = createContextMenu();
        var isFav = isFavRoom(roomName);
        var isPinned = isPinnedRoom(roomName);
        var _ac = getAccentColor();
        var bookmarkIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (isFav ? _ac : "none") + '" stroke="' + (isFav ? _ac : "var(--theme-text-secondary, #888)") + '" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
        var pinIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (isPinned ? "#3b82f6" : "none") + '" stroke="' + (isPinned ? "#3b82f6" : "var(--theme-text-secondary, #888)") + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>';
        var t = window.__t || function(k) {
          return k;
        };
        contextMenu.innerHTML = '<div class="ctx-item ctx-pin" style="padding:10px 14px;cursor:pointer;color:var(--theme-text-primary, #fff);font-size:13px;display:flex;align-items:center;gap:10px;border-radius:6px;transition:background 0.1s;">' + pinIcon + "<span>" + (isPinned ? t("Desafixar Sala") : t("Fixar no Topo")) + "</span></div>" + '<div class="ctx-item ctx-fav" style="padding:10px 14px;cursor:pointer;color:var(--theme-text-primary, #fff);font-size:13px;display:flex;align-items:center;gap:10px;border-radius:6px;transition:background 0.1s;">' + bookmarkIcon + "<span>" + (isFav ? t("Remover dos Favoritos") : t("Adicionar aos Favoritos")) + "</span></div>";
        var items = contextMenu.querySelectorAll(".ctx-item");
        for (var i = 0; i < items.length; i++) {
          (function(item) {
            item.onmouseenter = function() {
              item.style.background = "rgba(255,255,255,0.05)";
            };
            item.onmouseleave = function() {
              item.style.background = "";
            };
          })(items[i]);
        }
        var pinItem = contextMenu.querySelector(".ctx-pin");
        pinItem.onclick = function() {
          togglePinnedRoom(roomName);
          contextMenu.style.display = "none";
          updatePinnedHighlight(listContainer);
          movePinnedToTop(listContainer);
        };
        var favItem = contextMenu.querySelector(".ctx-fav");
        favItem.onclick = function() {
          toggleFavRoom(roomName);
          contextMenu.style.display = "none";
          updateFavHighlight(listContainer);
          if (isFilteringFavs && !isFavRoom(roomName)) {
            var rows = listContainer.querySelectorAll("tr");
            for (var i = 0; i < rows.length; i++) {
              var nameCell = rows[i].querySelector('[data-hook="name"]');
              if (nameCell && (nameCell.textContent || "").trim() === roomName) {
                rows[i].classList.add("fav-hidden");
              }
            }
          }
        };
        contextMenu.style.display = "block";
        var _mw = contextMenu.offsetWidth || 200;
        var _mh = contextMenu.offsetHeight || 80;
        var _vw = window.innerWidth || 800;
        var _vh = window.innerHeight || 600;
        var _x = Math.min(e.clientX, _vw - _mw - 8);
        var _y = Math.min(e.clientY, _vh - _mh - 8);
        contextMenu.style.left = Math.max(0, _x) + "px";
        contextMenu.style.top = Math.max(0, _y) + "px";
      }
      iframeDoc.addEventListener("click", function() {
        if (contextMenu) contextMenu.style.display = "none";
      });
      iframeDoc.addEventListener("contextmenu", function(e) {
        var target = e.target;
        var row = target.closest ? target.closest("tr") : null;
        if (!row) {
          var el = target;
          while (el && el.tagName !== "TR") el = el.parentElement;
          row = el;
        }
        if (row && listContainer.contains(row)) {
          var nameCell = row.querySelector('[data-hook="name"]');
          if (nameCell) {
            var roomName = (nameCell.textContent || "").trim();
            if (roomName) showContextMenu(e, roomName);
          }
        }
      });
      function updateFavHighlight(container) {
        var rows = container.querySelectorAll("tr");
        var favRooms = getFavRooms();
        for (var i = 0; i < rows.length; i++) {
          var nameCell = rows[i].querySelector('[data-hook="name"]');
          if (!nameCell) continue;
          var name = (nameCell.textContent || "").trim();
          if (favRooms.indexOf(name) !== -1) {
            nameCell.classList.add("fav-room");
          } else {
            nameCell.classList.remove("fav-room");
          }
        }
      }
      var observerTimeout = null;
      var isReordering = false;
      var favObserver = new MutationObserver(function(mutations) {
        if (isReordering) return;
        if (observerTimeout) clearTimeout(observerTimeout);
        observerTimeout = setTimeout(function() {
          updateFavHighlight(listContainer);
          updatePinnedHighlight(listContainer);
          isReordering = true;
          movePinnedToTop(listContainer);
          isReordering = false;
        }, 100);
      });
      favObserver.observe(listContainer, {
        childList: true
      });
      updateFavHighlight(listContainer);
      updatePinnedHighlight(listContainer);
      movePinnedToTop(listContainer);
    }
    if (!iframeDoc.getElementById("room-search-input")) {
      var searchContainer = iframeDoc.createElement("div");
      searchContainer.id = "room-search";
      searchContainer.style.cssText = "margin:8px 12px 12px 12px;padding:10px;display:flex;gap:8px;align-items:center;background:var(--theme-bg-secondary,#1a1a1a);border:1px solid var(--theme-border,#232323);border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.15);box-sizing:border-box;";
      var inputWrap = iframeDoc.createElement("div");
      inputWrap.style.cssText = "position:relative;flex:1;display:flex;align-items:center;";
      var svgNS = "http://www.w3.org/2000/svg";
      var svg = iframeDoc.createElementNS(svgNS, "svg");
      svg.setAttribute("width", "15");
      svg.setAttribute("height", "15");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "var(--theme-text-muted,#666)");
      svg.setAttribute("stroke-width", "2");
      svg.style.cssText = "position:absolute;left:10px;top:50%;transform:translateY(-50%);pointer-events:none;";
      var circle = iframeDoc.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", "11");
      circle.setAttribute("cy", "11");
      circle.setAttribute("r", "8");
      var path = iframeDoc.createElementNS(svgNS, "path");
      path.setAttribute("d", "m21 21-4.35-4.35");
      svg.appendChild(circle);
      svg.appendChild(path);
      var input = iframeDoc.createElement("input");
      input.type = "text";
      input.id = "room-search-input";
      var t = window.__t || function(k) {
        return k;
      };
      input.placeholder = t("Buscar salas por nombre...");
      input.autocomplete = "off";
      input.style.cssText = "width:100%;box-sizing:border-box;background:var(--theme-bg-primary,#121212);border:1px solid var(--theme-border,#232323);border-radius:7px;padding:8px 12px 8px 32px;color:var(--theme-text-primary,#fff);font-size:13px;outline:none;transition:border-color .15s;";
      var clearBtn = iframeDoc.createElement("button");
      clearBtn.type = "button";
      clearBtn.id = "room-search-clear";
      clearBtn.title = t("Limpiar");
      clearBtn.style.cssText = "position:absolute;right:6px;top:50%;transform:translateY(-50%);width:20px;height:20px;border:none;background:none;color:var(--theme-text-muted,#666);cursor:pointer;display:none;align-items:center;justify-content:center;border-radius:5px;padding:0;";
      clearBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      clearBtn.onmouseenter = function() {
        clearBtn.style.color = "var(--theme-text-primary,#fff)";
      };
      clearBtn.onmouseleave = function() {
        clearBtn.style.color = "var(--theme-text-muted,#666)";
      };
      function refreshClearBtn() {
        clearBtn.style.display = input.value ? "flex" : "none";
      }
      clearBtn.onclick = function() {
        input.value = "";
        refreshClearBtn();
        sessionStorage.setItem("roomlist_search_term", "");
        doSearch(iframeDoc, "");
        input.focus();
      };
      var _rafSearch = null;
      input.oninput = function() {
        var val = input.value;
        refreshClearBtn();
        sessionStorage.setItem("roomlist_search_term", val);
        if (_rafSearch) cancelAnimationFrame(_rafSearch);
        _rafSearch = requestAnimationFrame(function() {
          _rafSearch = null;
          doSearch(iframeDoc, val.toLowerCase());
        });
      };
      input.onfocus = function() {
        input.style.borderColor = "var(--theme-border-light, #444)";
      };
      input.onblur = function() {
        input.style.borderColor = "var(--theme-border, #232323)";
      };
      var savedSearch = sessionStorage.getItem("roomlist_search_term");
      if (savedSearch) {
        input.value = savedSearch;
        setTimeout(function() {
          doSearch(iframeDoc, savedSearch.toLowerCase());
        }, 100);
      }
      refreshClearBtn();
      var refreshBtn = iframeDoc.querySelector('[data-hook="refresh"]');
      if (refreshBtn) {
        refreshBtn.addEventListener("click", function() {
          cachedRows = null;
          setTimeout(function() {
            var currentSearch = input.value.toLowerCase();
            if (currentSearch) {
              doSearch(iframeDoc, currentSearch);
            }
          }, 200);
        });
      }
      var filterBtn = iframeDoc.createElement("button");
      filterBtn.id = "country-filter-btn";
      filterBtn.style.cssText = "background:var(--theme-bg-tertiary, #272727);border:1px solid var(--theme-border, #232323);padding:0 10px;color:var(--theme-text-secondary, #888);cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:6px;font-size:12px;font-weight:600;height:34px;transition:background .15s,color .15s;";
      filterBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
      filterBtn.onmouseenter = function() {
        filterBtn.style.background = "var(--theme-bg-hover, #333)";
        filterBtn.style.color = "var(--theme-text-primary, #fff)";
      };
      filterBtn.onmouseleave = function() {
        if (selectedCountry === "all") {
          filterBtn.style.background = "var(--theme-bg-secondary, #1a1a1a)";
          filterBtn.style.color = "var(--theme-text-muted, #666)";
        }
      };
      var dropdown = iframeDoc.createElement("div");
      dropdown.id = "country-dropdown";
      dropdown.style.cssText = "display:none;position:absolute;top:100%;right:0;background:var(--theme-bg-secondary, #1a1a1a);border:1px solid var(--theme-border-light, #333);border-radius:8px;max-height:240px;overflow-y:auto;z-index:1000;min-width:160px;margin-top:4px;box-shadow:0 8px 32px rgba(0,0,0,0.4);padding:4px 0;";
      var filterWrapper = iframeDoc.createElement("div");
      filterWrapper.style.cssText = "position:relative;";
      filterWrapper.appendChild(filterBtn);
      filterWrapper.appendChild(dropdown);
      function updateCountryList() {
        var table = iframeDoc.querySelector("[data-hook='list']");
        if (!table) return;
        var countries = {};
        var rows = table.querySelectorAll("tr");
        for (var i = 0; i < rows.length; i++) {
          var flagCell = rows[i].querySelector("[data-hook='flag']");
          if (flagCell) {
            var code = flagCell.className.replace("flagico f-", "").trim();
            if (code) countries[code] = true;
          }
        }
        dropdown.innerHTML = "";
        var sortedCountries = [];
        for (var c in countries) {
          sortedCountries.push(c);
        }
        sortedCountries.sort();
        var t = window.__t || function(k) {
          return k;
        };
        var allItem = iframeDoc.createElement("div");
        allItem.style.cssText = "padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;border-radius:4px;margin:0 4px;";
        allItem.onmouseenter = function() {
          allItem.style.background = "var(--theme-bg-tertiary, #272727)";
        };
        allItem.onmouseleave = function() {
          allItem.style.background = "";
        };
        allItem.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-muted, #666)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span style="color:var(--theme-text-primary, #fff);font-size:13px;">' + t("Todos os países") + "</span>";
        allItem.onclick = function() {
          selectedCountry = "all";
          dropdown.style.display = "none";
          filterBtn.style.background = "var(--theme-bg-secondary, #1a1a1a)";
          filterBtn.style.color = "var(--theme-text-muted, #666)";
          filterBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
          clearPinnedRooms();
          updatePinnedHighlight(listContainer);
          doSearch(iframeDoc, input.value.toLowerCase());
        };
        dropdown.appendChild(allItem);
        for (var j = 0; j < sortedCountries.length; j++) {
          (function(code) {
            var item = iframeDoc.createElement("div");
            item.style.cssText = "padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;border-radius:4px;margin:0 4px;";
            item.onmouseenter = function() {
              item.style.background = "rgba(255,255,255,0.05)";
            };
            item.onmouseleave = function() {
              item.style.background = "";
            };
            item.innerHTML = '<span class="flagico f-' + code + '" style="width:20px;height:15px;display:inline-block;"></span><span style="color:var(--theme-text-primary, #fff);font-size:13px;">' + code.toUpperCase() + "</span>";
            item.onclick = function() {
              selectedCountry = code;
              dropdown.style.display = "none";
              filterBtn.style.background = "var(--theme-bg-hover, #333)";
              filterBtn.style.color = "var(--theme-text-primary, #fff)";
              filterBtn.innerHTML = '<span style="font-size:12px;font-weight:600;">' + code.toUpperCase() + "</span>";
              clearPinnedRooms();
              updatePinnedHighlight(listContainer);
              doSearch(iframeDoc, input.value.toLowerCase());
            };
            dropdown.appendChild(item);
          })(sortedCountries[j]);
        }
      }
      filterBtn.onclick = function(e) {
        e.stopPropagation();
        updateCountryList();
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
      };
      iframeDoc.addEventListener("click", function() {
        dropdown.style.display = "none";
      });
      inputWrap.appendChild(svg);
      inputWrap.appendChild(input);
      inputWrap.appendChild(clearBtn);
      searchContainer.appendChild(inputWrap);
      searchContainer.appendChild(filterWrapper);
      var dialog = roomlistView.querySelector(".dialog");
      if (dialog) {
        var headerTable = dialog.querySelector("table.header");
        var content = dialog.querySelector(".content");
        if (headerTable && headerTable.parentNode) {
          headerTable.parentNode.insertBefore(searchContainer, headerTable);
        } else if (content && content.parentNode) {
          content.parentNode.insertBefore(searchContainer, content);
        } else if (dialog.firstChild) {
          // Ultimo recurso: si no encontramos ninguno de los puntos de
          // referencia de arriba (por un cambio de version de Haxball), lo
          // metemos igual al principio del dialogo para que nunca falte.
          dialog.insertBefore(searchContainer, dialog.firstChild);
        } else {
          dialog.appendChild(searchContainer);
        }
      }
    }
    if (roomListObserver && listContainer.dataset.observing) return;
    listContainer.dataset.observing = "true";
    function applyPasswordOpacity() {
      var rows = listContainer.querySelectorAll("tr");
      for (var i = 0, len = rows.length; i < len; i++) {
        var pc = rows[i].querySelector('[data-hook="pass"]');
        if (pc) rows[i].classList.toggle("has-password", (pc.textContent || "").indexOf("Yes") !== -1);
      }
    }
    cleanupRoomList();
    roomListObserver = new MutationObserver(function() {
      applyPasswordOpacity();
      // La lista puede llegar/renovarse sola (websocket). Si hay un termino
      // de busqueda activo, lo reaplicamos para que las salas nuevas
      // tambien queden filtradas sin que el usuario tenga que tocar nada.
      var searchInput = iframeDoc.getElementById("room-search-input");
      if (searchInput) doSearch(iframeDoc, searchInput.value.toLowerCase());
    });
    roomListObserver.observe(listContainer, {
      childList: true
    });
    applyPasswordOpacity();
  }
  function init() {
    if (!Injector.isGameFrame()) return;
    function hideTooltipAndMenu() {
      var tooltip = document.getElementById("sidebar-tooltip");
      if (tooltip) tooltip.style.opacity = "0";
      var ctxMenu = document.getElementById("room-context-menu");
      if (ctxMenu) ctxMenu.remove();
    }
    function checkAndModify() {
      var roomlistView = document.querySelector(".roomlist-view");
      var sidebar = document.getElementById("sidebar-panel");
      if (roomlistView && !sidebar) modifyRoomList(document); else if (!roomlistView) hideTooltipAndMenu();
    }
    Injector.onView("roomlist-view", function() {
      checkAndModify();
    });
    Injector.onViewLeave("roomlist-view", function() {
      hideTooltipAndMenu();
    });
    Injector.onView("game-view", function() {
      hideTooltipAndMenu();
    });
    checkAndModify();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();