(function() {
  if (Injector.isMainFrame()) return;
  function t(key) {
    return window.__t ? window.__t(key) : key;
  }
  function modifySettingsDialog(doc) {
    var dialog = doc.querySelector(".dialog.settings-view");
    if (!dialog) return;
    if (doc.getElementById("settings-sidebar-panel")) return;
    if (!doc.getElementById("settings-sidebar-anim")) {
      var animStyle = doc.createElement("style");
      animStyle.id = "settings-sidebar-anim";
      animStyle.textContent = [ "@keyframes sbSlideIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)}}", "@keyframes sbFadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}", ".settings-sidebar-btn{transition:background 0.18s,color 0.18s,box-shadow 0.18s,transform 0.12s!important;}", ".settings-sidebar-btn:active{transform:scale(0.88)!important;}", ".settings-sidebar-btn.selected{box-shadow:inset 2px 0 0 #c9a227!important;}", "#settings-sidebar-panel .settings-sidebar-btn{animation:sbSlideIn 0.22s ease both;}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(1){animation-delay:0.02s}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(2){animation-delay:0.04s}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(3){animation-delay:0.06s}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(4){animation-delay:0.08s}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(5){animation-delay:0.10s}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(6){animation-delay:0.12s}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(7){animation-delay:0.14s}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(8){animation-delay:0.16s}", "#settings-sidebar-panel .settings-sidebar-btn:nth-child(9){animation-delay:0.18s}", ".perf-option-row{transition:background 0.15s!important;}", ".perf-checkbox{transition:background 0.18s,border-color 0.18s!important;}", ".theme-option{transition:background 0.18s,border-color 0.18s,box-shadow 0.18s!important;}", ".theme-option.selected{box-shadow:0 0 0 1px #c9a227!important;}", ".theme-option:hover{box-shadow:0 2px 8px rgba(0,0,0,0.3)!important;}", "#settings-sidebar-tooltip{transition:opacity 0.14s,transform 0.14s!important;transform:translateX(0);}", "#settings-sidebar-tooltip.visible{opacity:1!important;transform:translateX(0)!important;}", "#settings-sidebar-tooltip.hidden{opacity:0!important;transform:translateX(-4px)!important;}", '.tabcontents>.section[data-hook="theme-section"],.tabcontents>.section[data-hook="perf-section"],.tabcontents>.section[data-hook="multiauth-section"],.tabcontents>.section[data-hook="geo-section"],.tabcontents>.section[data-hook="avatarsec"],.theme-section,.perf-section,.multiauth-section{animation:sbFadeIn 0.2s ease both!important;}' ].join("");
      doc.head && doc.head.appendChild(animStyle);
    }
    var tooltip = doc.getElementById("settings-sidebar-tooltip");
    if (!tooltip) {
      tooltip = doc.createElement("div");
      tooltip.id = "settings-sidebar-tooltip";
      tooltip.style.cssText = [ "position:fixed", "background:var(--theme-tooltip-bg)", "color:var(--theme-text-primary)", "padding:5px 10px", "border-radius:6px", "font-size:11px", "font-weight:500", "pointer-events:none", "opacity:0", "z-index:10001", "white-space:nowrap", "border:1px solid var(--theme-tooltip-border)", "box-shadow:0 4px 16px rgba(0,0,0,0.4)", "letter-spacing:0.3px" ].join(";");
      doc.body.appendChild(tooltip);
    }
    var tooltipTimer = null;
    function showTooltip(el, text) {
      clearTimeout(tooltipTimer);
      var rect = el.getBoundingClientRect();
      tooltip.textContent = text;
      tooltip.style.left = rect.right + 10 + "px";
      tooltip.style.top = rect.top + rect.height / 2 - 14 + "px";
      tooltip.className = "visible";
      tooltip.style.opacity = "1";
    }
    function hideTooltip() {
      tooltip.className = "hidden";
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
    var sidebar = doc.createElement("div");
    sidebar.id = "settings-sidebar-panel";
    sidebar.style.cssText = [ "position:absolute", "left:6px", "top:46px", "bottom:10px", "width:42px", "background:var(--theme-bg-primary)", "border:1px solid var(--theme-border)", "border-radius:8px", "display:flex", "flex-direction:column", "align-items:center", "gap:4px", "padding:10px 0 8px 0", "box-sizing:border-box", "z-index:1", "overflow-y:auto", "overflow-x:hidden", "scrollbar-width:none" ].join(";");
    var sbScrollStyle = doc.createElement("style");
    sbScrollStyle.textContent = "#settings-sidebar-panel::-webkit-scrollbar{display:none!important;}";
    doc.head && doc.head.appendChild(sbScrollStyle);
    sidebar.addEventListener("mouseleave", hideTooltip);
    var tabs = dialog.querySelector(".tabs");
    var tabIcons = {
      soundbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
        tooltip: t("Som"),
        order: 1
      },
      videobtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        tooltip: t("Vídeo"),
        order: 2
      },
      inputbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h12"/></svg>',
        tooltip: t("Controles"),
        order: 3
      },
      perfbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        tooltip: t("Desempenho"),
        order: 4
      },
      fpslimitbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19a8 8 0 1 1 16 0"/><path d="M12 15l4-4"/><circle cx="12" cy="15" r="1"/></svg>',
        tooltip: t("FPS"),
        order: 5
      },
      avatarbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>',
        tooltip: t("Avatares"),
        order: 5
      },
      tokenbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
        tooltip: t("Host Token"),
        order: 6
      },
      themebtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
        tooltip: t("Temas"),
        order: 7
      },
      multiauthbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="4"/><path d="M9 13c-4 0-6 2-6 5v1h12v-1c0-3-2-5-6-5"/><path d="M16 11h6m-3-3v6"/></svg>',
        tooltip: t("Multi-Auth"),
        order: 8
      },
      geobtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        tooltip: t("Geo Bypass"),
        order: 9
      },
      miscbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
        tooltip: t("Diversos"),
        order: 10
      },
      enhancementsbtn: {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 6h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a2 2 0 0 0 0 4h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1a2 2 0 0 0-4 0v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a2 2 0 0 0 0-4H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3a1 1 0 0 0 1-1V4a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1z"/></svg>',
        tooltip: t("HaxNew"),
        order: 12
      }
    };
    var tabOrder = [ "soundbtn", "videobtn", "inputbtn", "avatarbtn", "tokenbtn", "themebtn", "multiauthbtn", "geobtn", "miscbtn", "enhancementsbtn" ];
    function createThemeTab(doc, tabs) {
      if (tabs.querySelector('button[data-hook="themebtn"]')) return;
      var themeBtn = doc.createElement("button");
      themeBtn.setAttribute("data-hook", "themebtn");
      themeBtn.textContent = t("Temas");
      themeBtn.style.display = "none";
      tabs.appendChild(themeBtn);
      var themeSection = doc.createElement("section");
      themeSection.className = "theme-section section";
      themeSection.setAttribute("data-hook", "theme-section");
      themeSection.style.display = "none";
      var container = doc.createElement("div");
      container.className = "theme-container";
      var themeGroup = doc.createElement("div");
      themeGroup.className = "settings-group";
      var themeLabel = doc.createElement("div");
      themeLabel.className = "settings-group-label";
      themeLabel.textContent = t("Tema");
      themeGroup.appendChild(themeLabel);
      var themeOptions = doc.createElement("div");
      themeOptions.className = "theme-options";
      var themes = window.HaxThemes ? window.HaxThemes.getThemes() : {
        default: {
          name: t("Padrão")
        },
        dark: {
          name: t("Escuro")
        },
        light: {
          name: t("Claro")
        }
      };
      var currentTheme = window.HaxThemes ? window.HaxThemes.getCurrent() : "dark";
      var themeDescs = {
        default: t("Sem alterações de cor"),
        dark: t("Reduz o cansaço visual"),
        light: t("Melhor visibilidade"),
        onix: t("Preto total, escuridão absoluta")
      };
      for (var key in themes) {
        var option = doc.createElement("div");
        option.className = "theme-option" + (key === currentTheme ? " selected" : "");
        option.setAttribute("data-theme", key);
        var textWrapper = doc.createElement("div");
        textWrapper.className = "theme-text";
        var name = doc.createElement("span");
        name.className = "theme-name";
        name.textContent = themes[key].name;
        textWrapper.appendChild(name);
        var desc = doc.createElement("span");
        desc.className = "theme-desc";
        desc.textContent = themeDescs[key] || "";
        textWrapper.appendChild(desc);
        option.appendChild(textWrapper);
        var check = doc.createElement("div");
        check.className = "theme-check";
        check.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
        option.appendChild(check);
        option.addEventListener("click", function(themeKey) {
          return function() {
            var allOptions = themeOptions.querySelectorAll(".theme-option");
            for (var i = 0; i < allOptions.length; i++) allOptions[i].classList.remove("selected");
            this.classList.add("selected");
            if (window.HaxThemes) window.HaxThemes.apply(themeKey);
          };
        }(key));
        themeOptions.appendChild(option);
      }
      themeGroup.appendChild(themeOptions);
      container.appendChild(themeGroup);
      themeSection.appendChild(container);
      var dialogContent = dialog.querySelector(".section") || dialog;
      dialogContent.parentNode.insertBefore(themeSection, dialogContent.nextSibling);
      themeBtn.addEventListener("click", function() {
        var sections = dialog.querySelectorAll(".tabcontents > .section");
        for (var i = 0; i < sections.length; i++) sections[i].style.display = "none";
        themeSection.style.display = "block";
        var allTabs = tabs.querySelectorAll("button");
        for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove("selected");
        themeBtn.classList.add("selected");
      });
      var originalTabs = tabs.querySelectorAll('button:not([data-hook="themebtn"])');
      for (var i = 0; i < originalTabs.length; i++) {
        originalTabs[i].addEventListener("click", function() {
          themeSection.style.display = "none";
          var sections = dialog.querySelectorAll(".tabcontents > .section");
          for (var j = 0; j < sections.length; j++) sections[j].style.display = "";
        });
      }
      return themeBtn;
    }
    function createFpsLimitTab(doc, tabs) {
      if (tabs.querySelector('button[data-hook="fpslimitbtn"]')) return null;
      var fpsBtn = doc.createElement("button");
      fpsBtn.setAttribute("data-hook", "fpslimitbtn");
      fpsBtn.textContent = t("FPS");
      fpsBtn.style.display = "none";
      tabs.appendChild(fpsBtn);

      var fpsSection = doc.createElement("section");
      fpsSection.className = "fpslimit-section section";
      fpsSection.setAttribute("data-hook", "fpslimit-section");
      fpsSection.style.display = "none";

      var container = doc.createElement("div");
      container.style.cssText = "display:flex;flex-direction:column;gap:10px;padding:4px 2px;";
      var heading = doc.createElement("div");
      heading.textContent = t("Límite FPS");
      heading.style.cssText = "color:var(--theme-text-primary);font-size:14px;font-weight:600;";
      container.appendChild(heading);

      var row = doc.createElement("div");
      row.style.cssText = "display:flex;flex-direction:column;gap:6px;";
      var label = doc.createElement("label");
      label.textContent = t("FPS máximo");
      label.style.cssText = "color:var(--theme-text-secondary);font-size:12px;";
      var select = doc.createElement("select");
      select.id = "danubio-fps-limit-select";
      select.style.cssText = "width:100%;padding:9px 10px;background:var(--theme-bg-secondary);border:1px solid var(--theme-border);border-radius:6px;color:var(--theme-text-primary);font-size:12px;";
      var choices = [
        { value: "0", label: t("Sin límite (recomendado)") },
        { value: "30", label: "30 FPS" },
        { value: "60", label: "60 FPS" },
        { value: "75", label: "75 FPS" },
        { value: "120", label: "120 FPS" },
        { value: "144", label: "144 FPS" },
        { value: "165", label: "165 FPS" },
        { value: "240", label: "240 FPS" },
        { value: "300", label: "300 FPS" }
      ];
      choices.forEach(function(choice) {
        var option = doc.createElement("option");
        option.value = choice.value;
        option.textContent = choice.label;
        select.appendChild(option);
      });
      var savedLimit = "0";
      try {
        var storedLimit = localStorage.getItem("danubio.fpsLimit");
        if (storedLimit !== null && choices.some(function(choice) { return choice.value === storedLimit; })) {
          savedLimit = storedLimit;
        }
      } catch (e) {}
      select.value = savedLimit;
      select.addEventListener("change", function() {
        var value = Number(select.value);
        try {
          localStorage.setItem("danubio.fpsLimit", String(value));
        } catch (e) {}
        window.dispatchEvent(new CustomEvent("danubio:fps-limit-change", { detail: value }));
      });
      row.appendChild(label);
      row.appendChild(select);
      container.appendChild(row);

      var hint = doc.createElement("div");
      hint.textContent = t("Este valor limita el renderizado. El FPS real depende de tu monitor, la PC y la sala.");
      hint.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;line-height:1.45;";
      container.appendChild(hint);
      fpsSection.appendChild(container);

      var tabContents = dialog.querySelector(".tabcontents");
      if (tabContents) tabContents.appendChild(fpsSection);
      else dialog.appendChild(fpsSection);

      fpsBtn.addEventListener("click", function() {
        var sections = dialog.querySelectorAll(".tabcontents > .section");
        for (var i = 0; i < sections.length; i++) sections[i].style.display = "none";
        [ "theme-section", "perf-section", "multiauth-section", "geo-section", "enhancements-section" ].forEach(function(hook) {
          var section = dialog.querySelector('[data-hook="' + hook + '"]');
          if (section) section.style.display = "none";
        });
        fpsSection.style.display = "block";
        var allTabs = tabs.querySelectorAll("button");
        for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove("selected");
        fpsBtn.classList.add("selected");
      });
      var otherTabs = tabs.querySelectorAll('button:not([data-hook="fpslimitbtn"])');
      for (var i = 0; i < otherTabs.length; i++) {
        otherTabs[i].addEventListener("click", function() {
          fpsSection.style.display = "none";
        });
      }
      return fpsBtn;
    }
    function createPerfTab(doc, tabs) {
      if (tabs.querySelector('button[data-hook="perfbtn"]')) return;
      var perfBtn = doc.createElement("button");
      perfBtn.setAttribute("data-hook", "perfbtn");
      perfBtn.textContent = t("Desempenho");
      perfBtn.style.display = "none";
      tabs.appendChild(perfBtn);
      var perfSection = doc.createElement("section");
      perfSection.className = "perf-section section";
      perfSection.setAttribute("data-hook", "perf-section");
      perfSection.style.display = "none";
      var PERF_OPTIONS = [ {
        hook: "tmisc-simplelines",
        title: "Lineas simplificadas",
        desc: "Reduce el grosor de lineas de 3px a 1px."
      }, {
        hook: "tmisc-ultrasimplelines",
        title: "Curvas en lineas rectas",
        desc: "Convierte curvas en lineas rectas."
      }, {
        hook: "tmisc-culling",
        title: "Culling de viewport",
        desc: "No dibuja objetos fuera de pantalla."
      }, {
        hook: "tmisc-showavatars",
        title: "Desactivar avatares y colores",
        desc: "Elimina avatares y usa colores estandar."
      }, {
        hook: "tmisc-shownames",
        title: "Desactivar nombres",
        desc: "Oculta los nombres de los jugadores."
      }, {
        hook: "tmisc-simplefield",
        title: "Campo simplificado",
        desc: "Usa colores solidos en lugar de gradientes."
      }, {
        hook: "tmisc-lowqualitycircles",
        title: "Circulos baja calidad",
        desc: "Pre-renderiza circulos. Mas rapido pero pixelado."
      }, {
        hook: "tmisc-showanimations",
        title: "Desactivar animaciones de gol",
        desc: "Elimina animaciones al marcar gol."
      }, {
        hook: "tmisc-showindicator",
        title: "Desactivar indicador",
        desc: "El circulo que muestra donde estas."
      }, {
        hook: "tmisc-showchat",
        title: "Desactivar indicador de chat",
        desc: "El globo que aparece cuando alguien habla."
      }, {
        hook: "tmisc-imgsmoothing",
        title: "Sin suavizado de imagen",
        desc: "Desactiva el antialiasing. Visual pixelado pero mas rapido."
      }, {
        hook: "noGoalGray",
        title: "Sin gris al gol",
        desc: "Elimina el efecto gris del canvas al marcar gol.",
        custom: true
      }, {
        hook: "noGoalBar",
        title: "Sin barra de gol",
        desc: "Oculta la barra blanca animada al marcar gol.",
        custom: true
      }, {
        hook: "noGoalAnim",
        title: "Sin texto de gol",
        desc: "Elimina el texto Scores!/Victorious! al gol.",
        custom: true
      }, {
        hook: "showKickRange",
        title: "Sin kick range",
        desc: "Oculta el circulo de alcance de patada.",
        custom: true,
        inverted: true
      }, {
        hook: "no_hover_fx",
        title: "Sin efectos al pasar el mouse",
        desc: "Apaga brillos y movimientos al pasar el cursor. Cada hover fuerza un repintado.",
        custom: true,
        directKey: true
      }, {
        hook: "flat_backgrounds",
        title: "Fondos planos",
        desc: "Reemplaza los degradados animados de fondo por color solido.",
        custom: true,
        directKey: true
      }, {
        hook: "less_refresh",
        title: "Menos refrescos",
        desc: "Baja la frecuencia de actualizacion del panel de FPS y de ping.",
        custom: true,
        directKey: true
      } ];
      var container = doc.createElement("div");
      container.style.cssText = "display:flex;flex-direction:column;gap:2px;";
      var header = doc.createElement("div");
      header.style.cssText = "color:var(--theme-text-muted);font-size:11px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--theme-border);letter-spacing:0.3px;";
      header.innerHTML = "Activa las opciones para mejorar el FPS.";
      container.appendChild(header);
      var maxPerfBtn = doc.createElement("button");
      maxPerfBtn.style.cssText = "width:100%;margin-bottom:10px;padding:10px;background:#c9a227;border:none;border-radius:6px;color:#000;cursor:pointer;font-size:12px;font-weight:700;letter-spacing:0.2px;";
      maxPerfBtn.textContent = "Maximo rendimiento (activar todo)";
      maxPerfBtn.onmouseenter = function() {
        maxPerfBtn.style.opacity = "0.9";
      };
      maxPerfBtn.onmouseleave = function() {
        maxPerfBtn.style.opacity = "1";
      };
      maxPerfBtn.onclick = function() {
        var miscSection = dialog.querySelector('[data-hook="miscsec"]');
        PERF_OPTIONS.forEach(function(opt) {
          var isActive = false;
          if (opt.directKey) {
            try {
              isActive = localStorage.getItem(opt.hook) === "true";
            } catch (e) {}
          } else if (opt.custom) {
            try {
              var _po = JSON.parse(localStorage.getItem("hbx_perf_opts") || "{}");
              var _v = _po[opt.hook];
              isActive = opt.inverted ? _v === false || _v === "false" : _v === true || _v === "true";
            } catch (e) {}
          } else if (miscSection) {
            var originalToggle = miscSection.querySelector('[data-hook="' + opt.hook + '"]');
            if (originalToggle) {
              var icons = originalToggle.getElementsByTagName("i");
              var isToggleActive = false;
              for (var i = 0; i < icons.length; i++) {
                if (icons[i].classList.contains("icon-ok")) {
                  isToggleActive = true;
                  break;
                }
              }
              var isInverted = [ "tmisc-showavatars", "tmisc-shownames", "tmisc-showanimations", "tmisc-showindicator", "tmisc-showchat" ].indexOf(opt.hook) !== -1;
              isActive = isInverted ? !isToggleActive : isToggleActive;
            }
          }
          if (!isActive) {
            var row = container.querySelector('[data-perf-hook="' + opt.hook + '"]');
            if (row) row.click();
          }
        });
        setTimeout(updatePerfCheckboxes, 150);
      };
      container.appendChild(maxPerfBtn);
      if (typeof window._stretchedBuildRow === "function") {
        window._stretchedBuildRow(doc, container);
      }
      PERF_OPTIONS.forEach(function(opt) {
        var row = doc.createElement("div");
        row.className = "perf-option-row";
        row.style.cssText = "display:flex;align-items:flex-start;gap:10px;padding:7px 8px;border-radius:6px;cursor:pointer;";
        row.setAttribute("data-perf-hook", opt.hook);
        row.onmouseenter = function() {
          row.style.background = "var(--theme-bg-hover)";
        };
        row.onmouseleave = function() {
          row.style.background = "";
        };
        var checkbox = doc.createElement("div");
        checkbox.className = "perf-checkbox";
        checkbox.style.cssText = "width:17px;height:17px;border:2px solid var(--theme-border-light);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;";
        checkbox.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="opacity:0;"><polyline points="20 6 9 17 4 12"/></svg>';
        var textDiv = doc.createElement("div");
        textDiv.style.cssText = "flex:1;min-width:0;";
        var titleRow = doc.createElement("div");
        titleRow.style.cssText = "display:flex;align-items:center;gap:8px;margin-bottom:2px;";
        var title = doc.createElement("span");
        title.style.cssText = "color:var(--theme-text-primary);font-size:12.5px;font-weight:500;";
        title.textContent = opt.title;
        titleRow.appendChild(title);
        if (opt.warning) {
          var warning = doc.createElement("span");
          warning.style.cssText = "color:#f59e0b;font-size:9.5px;font-weight:600;padding:2px 5px;background:rgba(245,158,11,0.12);border-radius:4px;letter-spacing:0.3px;";
          warning.textContent = "Cuidado";
          titleRow.appendChild(warning);
        }
        textDiv.appendChild(titleRow);
        var desc = doc.createElement("div");
        desc.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;line-height:1.4;";
        desc.textContent = opt.desc;
        textDiv.appendChild(desc);
        row.appendChild(checkbox);
        row.appendChild(textDiv);
        (function(hookName, isCustom, isDirectKey) {
          row.onclick = function() {
            if (isDirectKey) {
              try {
                var newVal = localStorage.getItem(hookName) !== "true";
                localStorage.setItem(hookName, newVal ? "true" : "false");
                if (hookName === "no_hover_fx" && window.__hbxSetNoHoverFx) {
                  window.__hbxSetNoHoverFx(newVal);
                } else if (hookName === "flat_backgrounds" && window.HaxThemes) {
                  window.HaxThemes.refreshFx();
                } else if (hookName === "less_refresh") {
                  if (window.DerviFps && window.DerviFps.setRefreshRate) window.DerviFps.setRefreshRate(newVal ? 1500 : 500);
                  if (window.DerviPing && window.DerviPing.setRefreshRate) window.DerviPing.setRefreshRate(newVal ? 1500 : 500);
                }
              } catch (e) {}
              setTimeout(updatePerfCheckboxes, 50);
            } else if (isCustom) {
              try {
                var _po = JSON.parse(localStorage.getItem("hbx_perf_opts") || "{}");
                if (hookName === "showKickRange") {
                  _po[hookName] = _po[hookName] === false ? true : false;
                } else {
                  _po[hookName] = !(_po[hookName] === true || _po[hookName] === "true");
                }
                localStorage.setItem("hbx_perf_opts", JSON.stringify(_po));
                var _api = window._hbxGameAPI;
                if (_api) _api.refresh();
              } catch (e) {}
              setTimeout(updatePerfCheckboxes, 50);
            } else {
              var miscSection = dialog.querySelector('[data-hook="miscsec"]');
              if (miscSection) {
                var originalToggle = miscSection.querySelector('[data-hook="' + hookName + '"]');
                if (originalToggle) {
                  originalToggle.click();
                  setTimeout(updatePerfCheckboxes, 100);
                }
              }
            }
          };
        })(opt.hook, !!opt.custom, !!opt.directKey);
        container.appendChild(row);
      });
      var exportImportSection = doc.createElement("div");
      exportImportSection.style.cssText = "display:flex;gap:8px;margin-top:16px;padding-top:12px;border-top:1px solid var(--theme-border);";
      var PERF_STORAGE_KEYS = [ "simple_lines", "ultra_simple_lines", "culling_enabled", "show_avatars", "show_names", "simple_field", "low_quality_circles", "show_animations", "show_indicator", "show_chat_indicator", "high_priority", "canvas_boost_scale", "input_boost_enabled", "fps_limit", "resolution_scale", "viewmode" ];
      function generatePerfCode() {
        var config = {};
        PERF_STORAGE_KEYS.forEach(function(key) {
          var val = localStorage.getItem(key);
          if (val !== null) config[key] = val;
        });
        return btoa(JSON.stringify(config)).replace(/=/g, "");
      }
      function applyPerfCode(code) {
        try {
          while (code.length % 4 !== 0) code += "=";
          var config = JSON.parse(atob(code));
          PERF_STORAGE_KEYS.forEach(function(key) {
            localStorage.removeItem(key);
          });
          for (var key in config) {
            if (PERF_STORAGE_KEYS.indexOf(key) !== -1) localStorage.setItem(key, config[key]);
          }
          return true;
        } catch (e) {
          return false;
        }
      }
      function makePerfBtn(innerHTML, onCk) {
        var btn = doc.createElement("button");
        btn.style.cssText = "flex:1;padding:9px;background:var(--theme-bg-secondary);border:1px solid var(--theme-border);border-radius:6px;color:var(--theme-text-primary);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-size:11.5px;";
        btn.innerHTML = innerHTML;
        btn.onmouseenter = function() {
          btn.style.background = "var(--theme-bg-hover)";
        };
        btn.onmouseleave = function() {
          btn.style.background = "var(--theme-bg-secondary)";
        };
        btn.onclick = onCk;
        return btn;
      }
      var exportBtn = makePerfBtn('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' + "Exportar", function() {
        var code = generatePerfCode();
        var orig = exportBtn.innerHTML;
        navigator.clipboard.writeText(code).then(function() {
          exportBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' + "Copiado!";
          exportBtn.style.borderColor = "#22c55e";
          setTimeout(function() {
            exportBtn.innerHTML = orig;
            exportBtn.style.borderColor = "";
          }, 2e3);
        });
      });
      var importBtn = makePerfBtn('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' + "Importar", function() {
        var orig = importBtn.innerHTML;
        navigator.clipboard.readText().then(function(code) {
          code = code.trim();
          if (!code) {
            importBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' + "Portapapeles vacio";
            importBtn.style.borderColor = "#dc2626";
            setTimeout(function() {
              importBtn.innerHTML = orig;
              importBtn.style.borderColor = "";
            }, 2e3);
            return;
          }
          if (applyPerfCode(code)) {
            importBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' + "Aplicado! Recarga la pagina";
            importBtn.style.borderColor = "#22c55e";
            setTimeout(function() {
              importBtn.innerHTML = orig;
              importBtn.style.borderColor = "";
            }, 3e3);
          } else {
            importBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' + "Codigo invalido";
            importBtn.style.borderColor = "#dc2626";
            setTimeout(function() {
              importBtn.innerHTML = orig;
              importBtn.style.borderColor = "";
            }, 2e3);
          }
        }).catch(function() {
          importBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' + "Sin permiso";
          importBtn.style.borderColor = "#dc2626";
          setTimeout(function() {
            importBtn.innerHTML = importBtn.innerHTML;
            importBtn.style.borderColor = "";
          }, 2e3);
        });
      });
      exportImportSection.appendChild(exportBtn);
      exportImportSection.appendChild(importBtn);
      container.appendChild(exportImportSection);
      var exportImportTip = doc.createElement("div");
      exportImportTip.style.cssText = "color:var(--theme-text-muted);font-size:10px;margin-top:5px;text-align:center;";
      exportImportTip.textContent = "Comparte tu configuracion con amigos!";
      container.appendChild(exportImportTip);
      var LW_DEFAULTS = {
        line_width_players: 2,
        line_width_ball: 2,
        line_width_field: 3,
        line_width_goal: 3
      };
      var LW_ROWS = [ {
        key: "line_width_players",
        label: "Jugadores"
      }, {
        key: "line_width_ball",
        label: "Pelota"
      }, {
        key: "line_width_field",
        label: "Cancha"
      }, {
        key: "line_width_goal",
        label: "Arco"
      } ];
      var lwHeader = doc.createElement("div");
      lwHeader.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;margin-top:16px;padding-top:12px;border-top:1px solid var(--theme-border);letter-spacing:0.5px;text-transform:uppercase;";
      lwHeader.textContent = "Grosor de lineas";
      container.appendChild(lwHeader);
      var lwValueEls = {};
      function readLW(key) {
        var v = null;
        try {
          v = localStorage.getItem(key);
        } catch (e) {}
        return v !== null && v !== "" ? parseFloat(v) : LW_DEFAULTS[key];
      }
      function paintLWLabel(key) {
        var el = lwValueEls[key];
        if (!el) return;
        var raw = null;
        try {
          raw = localStorage.getItem(key);
        } catch (e) {}
        var val = readLW(key);
        el.textContent = val.toFixed(1).replace(/\.0$/, "") + "px" + (raw === null || raw === "" ? " (default)" : "");
        el.style.color = raw === null || raw === "" ? "var(--theme-text-muted)" : "#c9a227";
      }
      LW_ROWS.forEach(function(row) {
        var lwRow = doc.createElement("div");
        lwRow.style.cssText = "display:flex;align-items:center;gap:10px;padding:6px 8px;";
        var lbl = doc.createElement("div");
        lbl.style.cssText = "width:70px;flex-shrink:0;color:var(--theme-text-primary);font-size:12px;";
        lbl.textContent = row.label;
        var slider = doc.createElement("input");
        slider.type = "range";
        slider.min = "0.5";
        slider.max = "5";
        slider.step = "0.1";
        slider.value = String(readLW(row.key));
        slider.style.cssText = "flex:1;";
        var valEl = doc.createElement("div");
        valEl.style.cssText = "width:80px;flex-shrink:0;text-align:right;font-size:11px;";
        lwValueEls[row.key] = valEl;
        paintLWLabel(row.key);
        slider.oninput = function() {
          try {
            localStorage.setItem(row.key, slider.value);
          } catch (e) {}
          paintLWLabel(row.key);
        };
        lwRow.appendChild(lbl);
        lwRow.appendChild(slider);
        lwRow.appendChild(valEl);
        container.appendChild(lwRow);
        row._slider = slider;
      });
      var satHeader = doc.createElement("div");
      satHeader.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;margin-top:16px;padding-top:12px;border-top:1px solid var(--theme-border);letter-spacing:0.5px;text-transform:uppercase;";
      satHeader.textContent = "Saturacion";
      container.appendChild(satHeader);
      var satRow = doc.createElement("div");
      satRow.style.cssText = "display:flex;align-items:center;gap:10px;padding:6px 8px;";
      var satLbl = doc.createElement("div");
      satLbl.style.cssText = "width:70px;flex-shrink:0;color:var(--theme-text-primary);font-size:12px;";
      satLbl.textContent = "Color";
      var satSlider = doc.createElement("input");
      satSlider.type = "range";
      satSlider.min = "1";
      satSlider.max = "100";
      satSlider.step = "1";
      satSlider.style.cssText = "flex:1;";
      var satValEl = doc.createElement("div");
      satValEl.style.cssText = "width:80px;flex-shrink:0;text-align:right;font-size:11px;color:var(--theme-text-muted);";
      function paintSatLabel(v) {
        satValEl.textContent = v == 50 ? "Normal" : String(v);
      }
      function readSatValue() {
        return window.DerviSaturation && window.DerviSaturation.getValue ? window.DerviSaturation.getValue() : 50;
      }
      satSlider.value = String(readSatValue());
      paintSatLabel(satSlider.value);
      satSlider.oninput = function() {
        paintSatLabel(satSlider.value);
        if (window.DerviSaturation) window.DerviSaturation.setValue(satSlider.value);
      };
      satRow.appendChild(satLbl);
      satRow.appendChild(satSlider);
      satRow.appendChild(satValEl);
      container.appendChild(satRow);
      var satHint = doc.createElement("div");
      satHint.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;line-height:1.4;padding:0 8px;";
      satHint.textContent = "50 = normal. Menos desatura, mas intensifica los colores. Se aplica a todo (menu y juego).";
      container.appendChild(satHint);
      var resetBtn = doc.createElement("button");
      resetBtn.style.cssText = "width:100%;margin-top:10px;padding:9px;background:var(--theme-bg-secondary);border:1px solid var(--theme-border);border-radius:6px;color:var(--theme-text-primary);cursor:pointer;font-size:11.5px;";
      resetBtn.textContent = "Resetear a valores por defecto";
      resetBtn.onmouseenter = function() {
        resetBtn.style.background = "var(--theme-bg-hover)";
      };
      resetBtn.onmouseleave = function() {
        resetBtn.style.background = "var(--theme-bg-secondary)";
      };
      resetBtn.onclick = function() {
        LW_ROWS.forEach(function(row) {
          try {
            localStorage.removeItem(row.key);
          } catch (e) {}
          if (row._slider) row._slider.value = String(LW_DEFAULTS[row.key]);
          paintLWLabel(row.key);
        });
        try {
          localStorage.setItem("no_hover_fx", "false");
          localStorage.setItem("flat_backgrounds", "false");
          localStorage.setItem("less_refresh", "false");
          localStorage.removeItem("avatar_font");
        } catch (e) {}
        if (window.__hbxSetNoHoverFx) window.__hbxSetNoHoverFx(false);
        if (window.HaxThemes) window.HaxThemes.refreshFx();
        if (window.DerviFps && window.DerviFps.setRefreshRate) window.DerviFps.setRefreshRate(500);
        if (window.DerviPing && window.DerviPing.setRefreshRate) window.DerviPing.setRefreshRate(500);
        if (window.DerviSaturation) window.DerviSaturation.reset();
        satSlider.value = "50";
        paintSatLabel("50");
        if (typeof avatarFontSelect !== "undefined" && avatarFontSelect) avatarFontSelect.value = "default";
        updatePerfCheckboxes();
      };
      container.appendChild(resetBtn);
      var avHeader = doc.createElement("div");
      avHeader.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;margin-top:16px;padding-top:12px;border-top:1px solid var(--theme-border);letter-spacing:0.5px;text-transform:uppercase;";
      avHeader.textContent = "Fuente del avatar";
      container.appendChild(avHeader);
      var AVATAR_FONTS = [ {
        value: "default",
        label: "Arial Black (default)",
        family: "'Arial Black','Arial Bold',Gadget,sans-serif"
      }, {
        value: "comicsans",
        label: "Comic Sans",
        family: "'Comic Sans MS','Comic Sans',cursive"
      }, {
        value: "impact",
        label: "Impact",
        family: "Impact,Haettenschweiler,sans-serif"
      }, {
        value: "courier",
        label: "Courier New",
        family: "'Courier New',Courier,monospace"
      }, {
        value: "georgia",
        label: "Georgia",
        family: "Georgia,'Times New Roman',serif"
      }, {
        value: "verdana",
        label: "Verdana",
        family: "Verdana,Geneva,sans-serif"
      }, {
        value: "trebuchet",
        label: "Trebuchet MS",
        family: "'Trebuchet MS',sans-serif"
      } ];
      var avatarFontSelect = doc.createElement("select");
      avatarFontSelect.style.cssText = "width:100%;margin-top:6px;padding:8px;background:var(--theme-bg-secondary);border:1px solid var(--theme-border);border-radius:6px;color:var(--theme-text-primary);font-size:12px;";
      AVATAR_FONTS.forEach(function(f) {
        var option = doc.createElement("option");
        option.value = f.value;
        option.textContent = f.label;
        avatarFontSelect.appendChild(option);
      });
      var savedFontFamily = null;
      try {
        savedFontFamily = localStorage.getItem("avatar_font");
      } catch (e) {}
      var matchedFont = AVATAR_FONTS.filter(function(f) {
        return f.family === savedFontFamily;
      })[0];
      avatarFontSelect.value = matchedFont ? matchedFont.value : "default";
      avatarFontSelect.onchange = function() {
        var picked = AVATAR_FONTS.filter(function(f) {
          return f.value === avatarFontSelect.value;
        })[0];
        try {
          if (!picked || picked.value === "default") localStorage.removeItem("avatar_font"); else localStorage.setItem("avatar_font", picked.family);
        } catch (e) {}
      };
      container.appendChild(avatarFontSelect);
      var avHint = doc.createElement("div");
      avHint.style.cssText = "color:var(--theme-text-muted);font-size:10px;margin-top:5px;";
      avHint.textContent = "Se aplica a los avatares de texto la proxima vez que se dibujen (propio o al reconectar).";
      container.appendChild(avHint);
      var fpsHeader = doc.createElement("div");
      fpsHeader.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;margin-top:16px;padding-top:12px;border-top:1px solid var(--theme-border);letter-spacing:0.5px;text-transform:uppercase;";
      fpsHeader.textContent = "FPS";
      container.appendChild(fpsHeader);
      var fpsHint = doc.createElement("div");
      fpsHint.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;line-height:1.4;padding:6px 8px 2px;";
      fpsHint.textContent = "El contador FPS está disponible. Danubio conserva los límites normales de Chromium para evitar inestabilidad.";
      container.appendChild(fpsHint);
      function updatePerfCheckboxes() {
        var miscSection = dialog.querySelector('[data-hook="miscsec"]');
        if (!miscSection) return;
        PERF_OPTIONS.forEach(function(opt) {
          var perfRow = perfSection.querySelector('[data-perf-hook="' + opt.hook + '"]');
          if (!perfRow) return;
          var perfCheckbox = perfRow.querySelector(".perf-checkbox");
          if (!perfCheckbox) return;
          var svg = perfCheckbox.querySelector("svg");
          if (!svg) return;
          var isActive = false;
          if (opt.directKey) {
            try {
              isActive = localStorage.getItem(opt.hook) === "true";
            } catch (e) {}
          } else if (opt.custom) {
            try {
              var _po = JSON.parse(localStorage.getItem("hbx_perf_opts") || "{}");
              var _v = _po[opt.hook];
              if (opt.inverted) {
                isActive = _v === false || _v === "false";
              } else {
                isActive = _v === true || _v === "true";
              }
            } catch (e) {}
          } else {
            var originalToggle = miscSection.querySelector('[data-hook="' + opt.hook + '"]');
            if (!originalToggle) return;
            var icons = originalToggle.getElementsByTagName("i");
            var isToggleActive = false;
            for (var i = 0; i < icons.length; i++) {
              if (icons[i].classList.contains("icon-ok")) {
                isToggleActive = true;
                break;
              }
            }
            var isInverted = [ "tmisc-showavatars", "tmisc-shownames", "tmisc-showanimations", "tmisc-showindicator", "tmisc-showchat" ].indexOf(opt.hook) !== -1;
            isActive = isInverted ? !isToggleActive : isToggleActive;
          }
          if (isActive) {
            perfCheckbox.style.background = "#c9a227";
            perfCheckbox.style.borderColor = "#c9a227";
            svg.style.opacity = "1";
            svg.style.stroke = "#000";
          } else {
            perfCheckbox.style.background = "";
            perfCheckbox.style.borderColor = "";
            svg.style.opacity = "0";
          }
        });
      }
      var dialogContent = dialog.querySelector(".section") || dialog;
      dialogContent.parentNode.insertBefore(perfSection, dialogContent.nextSibling);
      perfBtn.addEventListener("click", function() {
        var sections = dialog.querySelectorAll(".tabcontents > .section");
        for (var i = 0; i < sections.length; i++) sections[i].style.display = "none";
        var themeSection = dialog.querySelector('[data-hook="theme-section"]');
        if (themeSection) themeSection.style.display = "none";
        perfSection.style.display = "block";
        dialog.style.maxHeight = "90vh";
        dialog.style.height = "auto";
        var tabcontents = dialog.querySelector(".tabcontents");
        if (tabcontents) {
          tabcontents.style.maxHeight = "calc(90vh - 100px)";
          tabcontents.style.overflowY = "auto";
        }
        updatePerfCheckboxes();
        var allTabs = tabs.querySelectorAll("button");
        for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove("selected");
        perfBtn.classList.add("selected");
      });
      var originalTabs2 = tabs.querySelectorAll('button:not([data-hook="perfbtn"])');
      for (var i = 0; i < originalTabs2.length; i++) {
        originalTabs2[i].addEventListener("click", function() {
          perfSection.style.display = "none";
          dialog.style.maxHeight = "";
          dialog.style.height = "";
          var tabcontents = dialog.querySelector(".tabcontents");
          if (tabcontents) {
            tabcontents.style.maxHeight = "";
            tabcontents.style.overflowY = "";
          }
        });
      }
      return perfBtn;
    }
    function createMultiAuthTab(doc, tabs) {
      if (tabs.querySelector('button[data-hook="multiauthbtn"]')) return;
      var multiAuthBtn = doc.createElement("button");
      multiAuthBtn.setAttribute("data-hook", "multiauthbtn");
      multiAuthBtn.textContent = t("Multi-Auth");
      multiAuthBtn.style.display = "none";
      tabs.appendChild(multiAuthBtn);
      var multiAuthSection = doc.createElement("section");
      multiAuthSection.className = "multiauth-section section";
      multiAuthSection.setAttribute("data-hook", "multiauth-section");
      multiAuthSection.style.display = "none";
      var MAX_AUTHS = 5;
      var STORAGE_KEY = "haxdesk_multi_auths";
      var CURRENT_AUTH_KEY = "player_auth_key";
      function getStoredAuths() {
        try {
          var d = localStorage.getItem(STORAGE_KEY);
          return d ? JSON.parse(d) : [];
        } catch (e) {
          return [];
        }
      }
      function saveAuths(auths) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auths));
      }
      function getCurrentAuth() {
        return localStorage.getItem(CURRENT_AUTH_KEY) || "";
      }
      function setCurrentAuth(authKey) {
        if (authKey) localStorage.setItem(CURRENT_AUTH_KEY, authKey);
      }
      function truncateAuth(auth) {
        if (!auth || auth.length < 20) return auth || "";
        return auth.substring(0, 8) + "..." + auth.substring(auth.length - 8);
      }
      function isValidAuth(auth) {
        if (!auth || typeof auth !== "string") return false;
        var parts = auth.split(".");
        return parts.length === 4 && parts[0].length > 0;
      }
      var container = doc.createElement("div");
      container.style.cssText = "display:flex;flex-direction:column;gap:12px;";
      var header = doc.createElement("div");
      header.style.cssText = "color:var(--theme-text-muted);font-size:11px;margin-bottom:4px;padding-bottom:8px;border-bottom:1px solid var(--theme-border);";
      var currentAuth = getCurrentAuth();
      var auths = getStoredAuths();
      var currentAuthObj = auths.find(function(a) {
        return a.key === currentAuth;
      });
      var currentName = currentAuthObj ? currentAuthObj.name : "";
      if (currentAuth) {
        header.innerHTML = t("Auth atual: ") + '<span style="color:var(--theme-text-primary);font-family:monospace;">' + truncateAuth(currentAuth) + "</span>" + (currentName ? " (" + currentName + ")" : "");
      } else {
        header.innerHTML = t("Nenhuma auth ativa. Máximo de 5 auths.");
      }
      container.appendChild(header);
      function updateHeader() {
        var current = getCurrentAuth();
        var al = getStoredAuths();
        var found = al.find(function(a) {
          return a.key === current;
        });
        var name = found ? found.name : "";
        if (current) {
          header.innerHTML = t("Auth atual: ") + '<span style="color:var(--theme-text-primary);font-family:monospace;">' + truncateAuth(current) + "</span>" + (name ? " (" + name + ")" : "");
        } else {
          header.innerHTML = t("Nenhuma auth ativa. Máximo de 5 auths.");
        }
      }
      var listContainer = doc.createElement("div");
      listContainer.style.cssText = "display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;";
      function renderAuthList() {
        listContainer.innerHTML = "";
        var al = getStoredAuths();
        var ca = getCurrentAuth();
        if (al.length === 0) {
          var emptyMsg = doc.createElement("div");
          emptyMsg.style.cssText = "color:var(--theme-text-muted);font-size:12px;text-align:center;padding:20px;";
          emptyMsg.textContent = t("Nenhuma auth salva. Adicione uma abaixo.");
          listContainer.appendChild(emptyMsg);
          return;
        }
        al.forEach(function(authObj, index) {
          var row = doc.createElement("div");
          var isActive = authObj.key === ca;
          row.style.cssText = "display:flex;align-items:center;gap:8px;padding:10px;background:" + (isActive ? "rgba(201,162,39,0.08)" : "var(--theme-bg-secondary)") + ";border:1px solid " + (isActive ? "#c9a227" : "var(--theme-border)") + ";border-radius:6px;";
          var indicator = doc.createElement("div");
          indicator.style.cssText = "width:7px;height:7px;border-radius:50%;flex-shrink:0;background:" + (isActive ? "#c9a227" : "var(--theme-border)") + ";";
          row.appendChild(indicator);
          var info = doc.createElement("div");
          info.style.cssText = "flex:1;min-width:0;";
          var name = doc.createElement("div");
          name.style.cssText = "color:var(--theme-text-primary);font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
          name.textContent = authObj.name || t("Auth ") + (index + 1);
          info.appendChild(name);
          var keyPreview = doc.createElement("div");
          keyPreview.style.cssText = "color:var(--theme-text-muted);font-size:10px;font-family:monospace;";
          keyPreview.textContent = truncateAuth(authObj.key);
          info.appendChild(keyPreview);
          row.appendChild(info);
          if (!isActive) {
            var useBtn = doc.createElement("button");
            useBtn.style.cssText = "padding:5px 11px;background:#c9a227;border:none;border-radius:4px;color:#000;font-size:11px;font-weight:600;cursor:pointer;";
            useBtn.textContent = t("Usar");
            useBtn.onmouseenter = function() {
              useBtn.style.background = "#b8911f";
            };
            useBtn.onmouseleave = function() {
              useBtn.style.background = "#c9a227";
            };
            useBtn.onclick = function() {
              setCurrentAuth(authObj.key);
              updateHeader();
              renderAuthList();
              if (window.showToast) window.showToast(t("Auth alterada! Feche e abra o app para aplicar."), "success");
            };
            row.appendChild(useBtn);
          }
          var removeBtn = doc.createElement("button");
          removeBtn.style.cssText = "padding:5px 7px;background:transparent;border:1px solid var(--theme-border);border-radius:4px;color:var(--theme-text-muted);font-size:11px;cursor:pointer;";
          removeBtn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
          removeBtn.onmouseenter = function() {
            removeBtn.style.borderColor = "#dc2626";
            removeBtn.style.color = "#dc2626";
          };
          removeBtn.onmouseleave = function() {
            removeBtn.style.borderColor = "";
            removeBtn.style.color = "";
          };
          removeBtn.onclick = function() {
            var newAuths = al.filter(function(_, i) {
              return i !== index;
            });
            saveAuths(newAuths);
            renderAuthList();
            if (window.showToast) window.showToast(t("Auth removida"), "info");
          };
          row.appendChild(removeBtn);
          listContainer.appendChild(row);
        });
      }
      container.appendChild(listContainer);
      var addSection = doc.createElement("div");
      addSection.style.cssText = "margin-top:12px;padding-top:12px;border-top:1px solid var(--theme-border);";
      var addLabel = doc.createElement("div");
      addLabel.style.cssText = "color:var(--theme-text-primary);font-size:12px;font-weight:500;margin-bottom:8px;";
      addLabel.textContent = t("Adicionar Nova Auth");
      addSection.appendChild(addLabel);
      var inputCss = "width:100%;padding:8px 12px;background:var(--theme-bg-secondary);border:1px solid var(--theme-border);border-radius:6px;color:var(--theme-text-primary);font-size:12px;margin-bottom:8px;box-sizing:border-box;";
      var nameInput = doc.createElement("input");
      nameInput.type = "text";
      nameInput.placeholder = t("Nome (opcional)");
      nameInput.style.cssText = inputCss;
      addSection.appendChild(nameInput);
      var authInput = doc.createElement("input");
      authInput.type = "text";
      authInput.placeholder = t("Auth Key (ex: idkey.xxx.xxx.xxx)");
      authInput.style.cssText = inputCss + "font-family:monospace;";
      addSection.appendChild(authInput);
      var btnRow = doc.createElement("div");
      btnRow.style.cssText = "display:flex;gap:8px;";
      var addBtn = doc.createElement("button");
      addBtn.style.cssText = "flex:1;padding:9px;background:#c9a227;border:none;border-radius:6px;color:#000;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;";
      addBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' + t("Adicionar");
      addBtn.onmouseenter = function() {
        addBtn.style.background = "#b8911f";
      };
      addBtn.onmouseleave = function() {
        addBtn.style.background = "#c9a227";
      };
      addBtn.onclick = function() {
        var authKey = authInput.value.trim();
        var authName = nameInput.value.trim();
        if (!authKey) {
          if (window.showToast) window.showToast(t("Digite uma auth key"), "error");
          return;
        }
        if (!isValidAuth(authKey)) {
          if (window.showToast) window.showToast(t("Formato inválido. Use: idkey.xxx.xxx.xxx"), "error");
          return;
        }
        var al = getStoredAuths();
        if (al.some(function(a) {
          return a.key === authKey;
        })) {
          if (window.showToast) window.showToast(t("Esta auth já está salva"), "error");
          return;
        }
        if (al.length >= MAX_AUTHS) {
          if (window.showToast) window.showToast(t("Limite de " + MAX_AUTHS + " auths atingido"), "error");
          return;
        }
        al.push({
          name: authName || "",
          key: authKey
        });
        saveAuths(al);
        authInput.value = "";
        nameInput.value = "";
        renderAuthList();
        if (window.showToast) window.showToast(t("Auth adicionada!"), "success");
      };
      btnRow.appendChild(addBtn);
      var saveCurrentBtn = doc.createElement("button");
      saveCurrentBtn.style.cssText = "padding:9px 14px;background:var(--theme-bg-secondary);border:1px solid var(--theme-border);border-radius:6px;color:var(--theme-text-primary);font-size:12px;cursor:pointer;";
      saveCurrentBtn.textContent = t("Salvar Atual");
      saveCurrentBtn.onmouseenter = function() {
        saveCurrentBtn.style.background = "var(--theme-bg-hover)";
      };
      saveCurrentBtn.onmouseleave = function() {
        saveCurrentBtn.style.background = "var(--theme-bg-secondary)";
      };
      saveCurrentBtn.onclick = function() {
        var ca = getCurrentAuth();
        if (!ca) {
          if (window.showToast) window.showToast(t("Nenhuma auth atual para salvar"), "error");
          return;
        }
        var al = getStoredAuths();
        if (al.some(function(a) {
          return a.key === ca;
        })) {
          if (window.showToast) window.showToast(t("Auth atual já está salva"), "info");
          return;
        }
        if (al.length >= MAX_AUTHS) {
          if (window.showToast) window.showToast(t("Limite de " + MAX_AUTHS + " auths atingido"), "error");
          return;
        }
        var authName = nameInput.value.trim() || t("Auth ") + (al.length + 1);
        al.push({
          name: authName,
          key: ca
        });
        saveAuths(al);
        nameInput.value = "";
        renderAuthList();
        if (window.showToast) window.showToast(t("Auth atual salva!"), "success");
      };
      btnRow.appendChild(saveCurrentBtn);
      addSection.appendChild(btnRow);
      container.appendChild(addSection);
      var tip = doc.createElement("div");
      tip.style.cssText = "color:var(--theme-text-muted);font-size:10px;margin-top:10px;padding:8px;background:var(--theme-bg-secondary);border-radius:6px;";
      tip.textContent = t("Após trocar de auth, feche e abra o app para aplicar.");
      container.appendChild(tip);
      multiAuthSection.appendChild(container);
      renderAuthList();
      var dialogContent = dialog.querySelector(".section") || dialog;
      dialogContent.parentNode.insertBefore(multiAuthSection, dialogContent.nextSibling);
      multiAuthBtn.addEventListener("click", function() {
        var sections = dialog.querySelectorAll(".tabcontents > .section");
        for (var i = 0; i < sections.length; i++) sections[i].style.display = "none";
        var ts = dialog.querySelector('[data-hook="theme-section"]');
        if (ts) ts.style.display = "none";
        var ps = dialog.querySelector('[data-hook="perf-section"]');
        if (ps) ps.style.display = "none";
        multiAuthSection.style.display = "block";
        updateHeader();
        renderAuthList();
        var allTabs = tabs.querySelectorAll("button");
        for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove("selected");
        multiAuthBtn.classList.add("selected");
      });
      var originalTabsM = tabs.querySelectorAll('button:not([data-hook="multiauthbtn"])');
      for (var i = 0; i < originalTabsM.length; i++) {
        originalTabsM[i].addEventListener("click", function() {
          multiAuthSection.style.display = "none";
        });
      }
      return multiAuthBtn;
    }
    function createGeoTab(doc, tabs) {
      if (tabs.querySelector('button[data-hook="geobtn"]')) return;
      var geoBtn = doc.createElement("button");
      geoBtn.setAttribute("data-hook", "geobtn");
      geoBtn.textContent = t("Geo");
      geoBtn.style.display = "none";
      tabs.appendChild(geoBtn);
      var geoSection = doc.createElement("section");
      geoSection.className = "geo-section section";
      geoSection.setAttribute("data-hook", "geo-section");
      geoSection.style.display = "none";
      var container = doc.createElement("div");
      container.style.cssText = "display:flex;flex-direction:column;gap:14px;padding:4px 0;";
      var infoBox = doc.createElement("div");
      infoBox.style.cssText = "color:var(--theme-text-muted);font-size:11px;padding-bottom:10px;border-bottom:1px solid var(--theme-border);line-height:1.6;";
      infoBox.innerHTML = t("Sincroniza tu ubicación real con la bandera elegida. Útil para evitar restricciones geográficas.");
      container.appendChild(infoBox);
      var statusRow = doc.createElement("div");
      statusRow.style.cssText = "display:flex;flex-direction:column;gap:8px;";
      function getGeoInfo() {
        try {
          var realRaw = localStorage.getItem("geo");
          var overrideRaw = localStorage.getItem("geo_override");
          var isActive = localStorage.getItem("geo_bypass_tick") === "true";
          var real = realRaw ? JSON.parse(realRaw) : null;
          var override = overrideRaw ? JSON.parse(overrideRaw) : null;
          return {
            real: real,
            override: override,
            isActive: isActive
          };
        } catch (e) {
          return {
            real: null,
            override: null,
            isActive: false
          };
        }
      }
      function renderStatus() {
        statusRow.innerHTML = "";
        var info = getGeoInfo();
        function makeRow(label, value, flagCode) {
          var row = doc.createElement("div");
          row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--theme-bg-secondary);border:1px solid var(--theme-border);border-radius:6px;";
          var lbl = doc.createElement("span");
          lbl.style.cssText = "color:var(--theme-text-muted);font-size:11.5px;";
          lbl.textContent = label;
          var val = doc.createElement("span");
          val.style.cssText = "color:var(--theme-text-primary);font-size:12px;font-weight:500;display:flex;align-items:center;gap:6px;";
          if (flagCode) {
            var flag = doc.createElement("span");
            flag.className = "flagico f-" + flagCode.toLowerCase();
            flag.style.cssText = "display:inline-block;width:18px;height:14px;";
            val.appendChild(flag);
          }
          var txt = doc.createElement("span");
          txt.textContent = value || "—";
          val.appendChild(txt);
          row.appendChild(lbl);
          row.appendChild(val);
          return row;
        }
        var realCode = info.real ? info.real.code : null;
        var realCoords = info.real ? info.real.lat.toFixed(2) + ", " + info.real.lon.toFixed(2) : "—";
        statusRow.appendChild(makeRow(t("Ubicación real:"), (realCode ? realCode.toUpperCase() : "—") + "  " + realCoords, realCode));
        var ovCode = info.override ? info.override.code : null;
        statusRow.appendChild(makeRow(t("Override activo:"), ovCode ? ovCode.toUpperCase() : t("Ninguno"), ovCode));
        var statusIndicator = doc.createElement("div");
        statusIndicator.style.cssText = "display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:6px;background:" + (info.isActive ? "rgba(201,162,39,0.1)" : "var(--theme-bg-secondary)") + ";border:1px solid " + (info.isActive ? "#c9a227" : "var(--theme-border)") + ";";
        var dot = doc.createElement("div");
        dot.style.cssText = "width:7px;height:7px;border-radius:50%;background:" + (info.isActive ? "#c9a227" : "var(--theme-text-muted)") + ";flex-shrink:0;";
        var statusTxt = doc.createElement("span");
        statusTxt.style.cssText = "font-size:12px;color:" + (info.isActive ? "#c9a227" : "var(--theme-text-muted)") + ";font-weight:500;";
        statusTxt.textContent = info.isActive ? t("Bypass ACTIVO — usando coords reales + bandera override") : t("Bypass inactivo");
        statusIndicator.appendChild(dot);
        statusIndicator.appendChild(statusTxt);
        statusRow.appendChild(statusIndicator);
      }
      container.appendChild(statusRow);
      var btnGroup = doc.createElement("div");
      btnGroup.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-top:4px;";
      function makeGeoBtn(label, icon, style, onClick) {
        var btn = doc.createElement("button");
        btn.style.cssText = "width:100%;padding:10px 14px;border:1px solid var(--theme-border);border-radius:6px;font-size:12.5px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;" + style;
        btn.innerHTML = icon + label;
        btn.onclick = function() {
          onClick();
          renderStatus();
        };
        return btn;
      }
      var syncBtn = makeGeoBtn(t("Sincronizar Bypass"), '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>', "background:#c9a227;color:#000;border-color:#c9a227;", function() {
        if (window.GeoManager) {
          window.GeoManager.sync(true);
          if (window.showToast) window.showToast(t("¡Bypass activado y sincronizado!"), "success");
        } else {
          if (window.showToast) window.showToast(t("GeoManager no disponible"), "error");
        }
      });
      syncBtn.onmouseenter = function() {
        syncBtn.style.background = "#b8911f";
      };
      syncBtn.onmouseleave = function() {
        syncBtn.style.background = "#c9a227";
      };
      var deactivateBtn = makeGeoBtn(t("Desactivar Bypass"), '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>', "background:var(--theme-bg-secondary);color:var(--theme-text-primary);", function() {
        if (window.GeoManager) {
          window.GeoManager.sync(false);
          if (window.showToast) window.showToast(t("Bypass desactivado"), "info");
        }
      });
      deactivateBtn.onmouseenter = function() {
        deactivateBtn.style.background = "var(--theme-bg-hover)";
      };
      deactivateBtn.onmouseleave = function() {
        deactivateBtn.style.background = "var(--theme-bg-secondary)";
      };
      var removeBtn = makeGeoBtn(t("Eliminar Override"), '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>', "background:var(--theme-bg-secondary);color:#dc2626;border-color:var(--theme-border);", function() {
        localStorage.removeItem("geo_override");
        localStorage.setItem("geo_bypass_tick", "false");
        if (window.showToast) window.showToast(t("Override eliminado"), "info");
      });
      removeBtn.onmouseenter = function() {
        removeBtn.style.borderColor = "#dc2626";
        removeBtn.style.background = "rgba(220,38,38,0.08)";
      };
      removeBtn.onmouseleave = function() {
        removeBtn.style.borderColor = "var(--theme-border)";
        removeBtn.style.background = "var(--theme-bg-secondary)";
      };
      btnGroup.appendChild(syncBtn);
      btnGroup.appendChild(deactivateBtn);
      btnGroup.appendChild(removeBtn);
      container.appendChild(btnGroup);
      var tip = doc.createElement("div");
      tip.style.cssText = "color:var(--theme-text-muted);font-size:10px;padding:8px;background:var(--theme-bg-secondary);border-radius:6px;line-height:1.5;";
      tip.textContent = t("Selecciona una bandera desde la pantalla de sala y luego activa el bypass aquí.");
      container.appendChild(tip);
      geoSection.appendChild(container);
      var dialogContent = dialog.querySelector(".section") || dialog;
      dialogContent.parentNode.insertBefore(geoSection, dialogContent.nextSibling);
      geoBtn.addEventListener("click", function() {
        var sections = dialog.querySelectorAll(".tabcontents > .section");
        for (var i = 0; i < sections.length; i++) sections[i].style.display = "none";
        [ "theme-section", "perf-section", "multiauth-section" ].forEach(function(h) {
          var s = dialog.querySelector('[data-hook="' + h + '"]');
          if (s) s.style.display = "none";
        });
        geoSection.style.display = "block";
        renderStatus();
        var allTabs = tabs.querySelectorAll("button");
        for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove("selected");
        geoBtn.classList.add("selected");
      });
      var originalTabsG = tabs.querySelectorAll('button:not([data-hook="geobtn"])');
      for (var i = 0; i < originalTabsG.length; i++) {
        originalTabsG[i].addEventListener("click", function() {
          geoSection.style.display = "none";
        });
      }
      return geoBtn;
    }
    function createEnhancementsTab(doc, tabs) {
      if (tabs.querySelector('button[data-hook="enhancementsbtn"]')) return;
      var enhBtn = doc.createElement("button");
      enhBtn.setAttribute("data-hook", "enhancementsbtn");
      enhBtn.textContent = t("HaxNew");
      enhBtn.style.display = "none";
      tabs.appendChild(enhBtn);
      var enhSection = doc.createElement("section");
      enhSection.className = "enhancements-section section";
      enhSection.setAttribute("data-hook", "enhancements-section");
      enhSection.style.display = "none";
      var ENH_STORAGE_PREFIX = "hbx_enh_";
      var ENHANCEMENT_OPTIONS = [];
      var container = doc.createElement("div");
      container.style.cssText = "display:flex;flex-direction:column;gap:2px;";
      var header = doc.createElement("div");
      header.style.cssText = "color:var(--theme-text-muted);font-size:11px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--theme-border);letter-spacing:0.3px;";
      header.textContent = t("Avatar, pelota y marcador.");
      container.appendChild(header);
      function buildBigTile(opts) {
        var tile = doc.createElement("div");
        tile.setAttribute("data-hook", opts.hook);
        tile.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:22px 10px;border:1px solid var(--theme-border);border-radius:12px;cursor:pointer;text-align:center;background:var(--theme-bg-secondary);transition:background .15s,border-color .15s,transform .1s;flex:1;min-width:0;";
        var icon = doc.createElement("div");
        icon.innerHTML = opts.iconSvg;
        tile.appendChild(icon);
        var title = doc.createElement("div");
        title.style.cssText = "color:var(--theme-text-primary);font-size:14px;font-weight:700;letter-spacing:0.2px;";
        title.textContent = opts.title;
        tile.appendChild(title);
        var desc = doc.createElement("div");
        desc.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;";
        desc.textContent = opts.desc;
        tile.appendChild(desc);
        tile.onmouseenter = function() {
          tile.style.background = "var(--theme-bg-hover)";
          tile.style.borderColor = "#c9a227";
        };
        tile.onmouseleave = function() {
          tile.style.background = "var(--theme-bg-secondary)";
          tile.style.borderColor = "var(--theme-border)";
        };
        tile.onmousedown = function() {
          tile.style.transform = "scale(0.98)";
        };
        tile.onmouseup = function() {
          tile.style.transform = "scale(1)";
        };
        tile.onclick = function() {
          var mod = window[opts.globalName];
          if (mod && typeof mod.openPanel === "function") {
            mod.openPanel(doc);
          } else if (window.showToast) {
            window.showToast(opts.missingMsg, "error");
          } else {
            console.warn("[settings] window." + opts.globalName + " no está disponible.");
          }
        };
        return tile;
      }
      var tilesRow = doc.createElement("div");
      tilesRow.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;";
      var abTile = buildBigTile({
        hook: "ab-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><circle cx="19" cy="18" r="3.2" stroke-width="1.4"/></svg>',
        title: t("Ball & Avatar"),
        desc: t("Personalizá tu avatar y tu pelota"),
        globalName: "HbxAvatarBall",
        missingMsg: t("Ball & Avatar no está disponible (falta cargar avatar-ball-panel.js)")
      });
      tilesRow.appendChild(abTile);
      var fsTile = buildBigTile({
        hook: "fs-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M12 5.5v13"/><circle cx="12" cy="12" r="2.4"/></svg>',
        title: t("Field Skin"),
        desc: t("Personalizá el pasto, el fondo y las líneas"),
        globalName: "HbxFieldSkin",
        missingMsg: t("Field Skin no está disponible (falta cargar field-skin-panel.js)")
      });
      // función HaxNew desactivada
      var sbTile = buildBigTile({
        hook: "sb-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.7" stroke-linecap="round"><rect x="2.5" y="8" width="19" height="8" rx="2"/><circle cx="7" cy="12" r="1.4" fill="#c9a227" stroke="none"/><circle cx="17" cy="12" r="1.4" fill="#c9a227" stroke="none"/></svg>',
        title: t("Scoreboard"),
        desc: t("Personalizá colores, fondo, escala y posición"),
        globalName: "HbxScoreboard",
        missingMsg: t("Scoreboard no está disponible (falta cargar scoreboard-panel.js)")
      });
      tilesRow.appendChild(sbTile);
      var ksTile = buildBigTile({
        hook: "ks-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6.5" width="19" height="12" rx="2"/><path d="M7 11v1M11 11v1M15 11v1M9 15h6"/></svg>',
        title: t("Keystrokes"),
        desc: t("Personalizá el HUD de teclas y su color"),
        globalName: "HbxKeystrokes",
        missingMsg: t("Keystrokes no está disponible (falta cargar keystroke-panel.js)")
      });
      // función HaxNew desactivada
      var fpsTile = buildBigTile({
        hook: "fps-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l6 3"/><path d="M12 2a10 10 0 0 1 8.66 5"/></svg>',
        title: t("FPS"),
        desc: t("Contador de FPS real, color y posición"),
        globalName: "HbxFps",
        missingMsg: t("FPS no está disponible (falta cargar fps-panel.js)")
      });
      // función HaxNew desactivada
      var pingTile = buildBigTile({
        hook: "ping-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12" y2="20"/></svg>',
        title: t("Ping"),
        desc: t("Latencia real, color según calidad y posición"),
        globalName: "HbxPing",
        missingMsg: t("Ping no está disponible (falta cargar ping-panel.js)")
      });
      // función HaxNew desactivada
      var clockTile = buildBigTile({
        hook: "clock-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 1.8"/></svg>',
        title: t("Clock"),
        desc: t("Reloj con formato, color y posición"),
        globalName: "HbxClock",
        missingMsg: t("Clock no está disponible (falta cargar clock-panel.js)")
      });
      // función HaxNew desactivada
      var riTile = buildBigTile({
        hook: "ri-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M7 13h5"/><path d="M7 16.5h8"/></svg>',
        title: t("Room Info"),
        desc: t("Nombre de sala, jugadores y mapa"),
        globalName: "HbxRoomInfo",
        missingMsg: t("Room Info no está disponible (falta cargar room-info-panel.js)")
      });
      // función HaxNew desactivada
      var spTile = buildBigTile({
        hook: "sp-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 168 168" fill="#1DB954"><path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.744-83.742zm38.404 120.78a5.222 5.222 0 01-7.19 1.73c-19.692-12.03-44.483-14.755-73.687-8.084a5.222 5.222 0 01-2.322-10.184c31.9-7.291 59.263-4.15 81.485 9.35a5.222 5.222 0 011.729 7.188h-.015zm10.25-22.805a6.531 6.531 0 01-8.98 2.152c-22.548-13.858-56.928-17.869-83.622-9.775a6.53 6.53 0 11-3.783-12.5c30.492-9.252 68.436-4.771 94.334 11.144a6.53 6.53 0 012.052 8.979zm.876-23.744c-27.01-16.04-71.652-17.51-97.454-9.688a7.834 7.834 0 11-4.549-14.985c29.623-8.985 78.842-7.246 109.907 11.202a7.834 7.834 0 01-7.898 13.536l-.006-.065z"/></svg>',
        title: t("Spotify"),
        desc: t("Now playing, controles, 5 diseños y colores"),
        globalName: "HbxSpotify",
        missingMsg: t("Spotify no está disponible (falta cargar spotify-panel.js)")
      });
      // función HaxNew desactivada
      var svTile = buildBigTile({
        hook: "sv-tile",
        iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M10 9.5v5l4-2.5z" fill="#c9a227" stroke="none"/></svg>',
        title: t("Screen Video"),
        desc: t("Overlay de YouTube, TikTok o video directo"),
        globalName: "HbxScreenVideo",
        missingMsg: t("Screen Video no está disponible (falta cargar screen-video-panel.js)")
      });
      // función HaxNew desactivada
      container.appendChild(tilesRow);
      function getEnh(hook) {
        try {
          return localStorage.getItem(ENH_STORAGE_PREFIX + hook) === "true";
        } catch (e) {
          return false;
        }
      }
      function setEnh(hook, val) {
        try {
          localStorage.setItem(ENH_STORAGE_PREFIX + hook, val ? "true" : "false");
        } catch (e) {}
      }
      var enhRows = [];
      function buildEnhRow(opt) {
        var row = doc.createElement("div");
        row.className = "perf-option-row";
        row.style.cssText = "display:flex;align-items:flex-start;gap:10px;padding:7px 8px;border-radius:6px;cursor:pointer;";
        row.setAttribute("data-enh-hook", opt.hook);
        row.onmouseenter = function() {
          row.style.background = "var(--theme-bg-hover)";
        };
        row.onmouseleave = function() {
          row.style.background = "";
        };
        var checkbox = doc.createElement("div");
        checkbox.className = "perf-checkbox";
        checkbox.style.cssText = "width:17px;height:17px;border:2px solid var(--theme-border-light);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;";
        checkbox.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="opacity:0;"><polyline points="20 6 9 17 4 12"/></svg>';
        var textDiv = doc.createElement("div");
        textDiv.style.cssText = "flex:1;min-width:0;";
        var title = doc.createElement("div");
        title.style.cssText = "color:var(--theme-text-primary);font-size:12.5px;font-weight:500;margin-bottom:2px;";
        title.textContent = opt.title;
        textDiv.appendChild(title);
        var desc = doc.createElement("div");
        desc.style.cssText = "color:var(--theme-text-muted);font-size:10.5px;line-height:1.4;";
        desc.textContent = opt.desc;
        textDiv.appendChild(desc);
        row.appendChild(checkbox);
        row.appendChild(textDiv);
        function refresh() {
          var on = getEnh(opt.hook);
          checkbox.style.background = on ? "var(--theme-accent, #c9a227)" : "";
          checkbox.style.borderColor = on ? "var(--theme-accent, #c9a227)" : "var(--theme-border-light)";
          checkbox.firstChild.style.opacity = on ? "1" : "0";
        }
        row.onclick = function() {
          var newVal = !getEnh(opt.hook);
          setEnh(opt.hook, newVal);
          refresh();
          if (typeof opt.onToggle === "function") opt.onToggle(newVal);
        };
        refresh();
        enhRows.push(refresh);
        return row;
      }
      var emptyState = doc.createElement("div");
      emptyState.style.cssText = "color:var(--theme-text-muted);font-size:11.5px;text-align:center;padding:24px 8px;";
      emptyState.textContent = t("Todavía no hay mejoras agregadas.");
      emptyState.setAttribute("data-enh-empty", "true");
      if (ENHANCEMENT_OPTIONS.length === 0) {
        container.appendChild(emptyState);
      } else {
        ENHANCEMENT_OPTIONS.forEach(function(opt) {
          container.appendChild(buildEnhRow(opt));
        });
      }
      enhSection.appendChild(container);
      var dialogContent = dialog.querySelector(".section") || dialog;
      dialogContent.parentNode.insertBefore(enhSection, dialogContent.nextSibling);
      enhBtn.addEventListener("click", function() {
        var sections = dialog.querySelectorAll(".tabcontents > .section");
        for (var i = 0; i < sections.length; i++) sections[i].style.display = "none";
        [ "theme-section", "perf-section", "multiauth-section", "geo-section" ].forEach(function(h) {
          var s = dialog.querySelector('[data-hook="' + h + '"]');
          if (s) s.style.display = "none";
        });
        enhSection.style.display = "block";
        enhRows.forEach(function(fn) {
          fn();
        });
        var allTabs = tabs.querySelectorAll("button");
        for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove("selected");
        enhBtn.classList.add("selected");
      });
      var originalTabsE = tabs.querySelectorAll('button:not([data-hook="enhancementsbtn"])');
      for (var i = 0; i < originalTabsE.length; i++) {
        originalTabsE[i].addEventListener("click", function() {
          enhSection.style.display = "none";
        });
      }
      return enhBtn;
    }
    var sidebarButtons = [];
    var pendingButtons = {};
    function createSidebarButton(originalBtn) {
      var hook = originalBtn.getAttribute("data-hook");
      if (sidebar.querySelector('[data-hook-ref="' + hook + '"]')) return;
      var iconData = tabIcons[hook] || {
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
        tooltip: originalBtn.textContent,
        order: 99
      };
      var sidebarBtn = doc.createElement("button");
      sidebarBtn.className = "settings-sidebar-btn";
      sidebarBtn.setAttribute("data-hook-ref", hook);
      sidebarBtn.setAttribute("data-order", iconData.order || 99);
      sidebarBtn.innerHTML = iconData.icon;
      if (originalBtn.classList.contains("selected")) sidebarBtn.classList.add("selected");
      addTooltip(sidebarBtn, iconData.tooltip);
      sidebarBtn.setAttribute("aria-label", iconData.tooltip);
      sidebarBtn.onclick = function() {
        var allBtns = sidebar.querySelectorAll(".settings-sidebar-btn:not([data-close])");
        for (var j = 0; j < allBtns.length; j++) allBtns[j].classList.remove("selected");
        sidebarBtn.classList.add("selected");
        if (hook !== "themebtn") {
          var themeSection = dialog.querySelector('[data-hook="theme-section"]');
          if (themeSection) themeSection.style.display = "none";
        }
        if (hook !== "perfbtn") {
          var perfSection = dialog.querySelector('[data-hook="perf-section"]');
          if (perfSection) perfSection.style.display = "none";
          dialog.style.maxHeight = "";
          dialog.style.height = "";
          var tabcontents = dialog.querySelector(".tabcontents");
          if (tabcontents) {
            tabcontents.style.maxHeight = "";
            tabcontents.style.overflowY = "";
          }
        }
        if (hook !== "fpslimitbtn") {
          var fpsLimitSection = dialog.querySelector('[data-hook="fpslimit-section"]');
          if (fpsLimitSection) fpsLimitSection.style.display = "none";
        }
        if (hook !== "multiauthbtn") {
          var multiAuthSection = dialog.querySelector('[data-hook="multiauth-section"]');
          if (multiAuthSection) multiAuthSection.style.display = "none";
        }
        if (hook !== "geobtn") {
          var geoSection = dialog.querySelector('[data-hook="geo-section"]');
          if (geoSection) geoSection.style.display = "none";
        }
        if (hook !== "enhancementsbtn") {
          var enhSectionEl = dialog.querySelector('[data-hook="enhancements-section"]');
          if (enhSectionEl) enhSectionEl.style.display = "none";
        }
        if (hook !== "themebtn" && hook !== "perfbtn" && hook !== "multiauthbtn" && hook !== "geobtn" && hook !== "enhancementsbtn" && hook !== "fpslimitbtn") {
          var sections = dialog.querySelectorAll(".tabcontents > .section");
          for (var k = 0; k < sections.length; k++) sections[k].style.display = "";
        }
        originalBtn.click();
      };
      originalBtn.addEventListener("click", function() {
        var allBtns = sidebar.querySelectorAll(".settings-sidebar-btn:not([data-close])");
        for (var j = 0; j < allBtns.length; j++) allBtns[j].classList.remove("selected");
        sidebarBtn.classList.add("selected");
      });
      pendingButtons[hook] = sidebarBtn;
      sidebarButtons.push(sidebarBtn);
    }
    function insertButtonsInOrder() {
      var spacer = sidebar.querySelector("[data-spacer]");
      for (var i = 0; i < tabOrder.length; i++) {
        var hook = tabOrder[i];
        if (pendingButtons[hook]) {
          if (spacer) sidebar.insertBefore(pendingButtons[hook], spacer); else sidebar.appendChild(pendingButtons[hook]);
        }
      }
    }
    var tabButtons = tabs ? tabs.querySelectorAll("button") : [];
    for (var i = 0; i < tabButtons.length; i++) createSidebarButton(tabButtons[i]);
    if (tabs) {
      var themeTabBtn = null;
      if (themeTabBtn) createSidebarButton(themeTabBtn);
      var multiAuthTabBtn = createMultiAuthTab(doc, tabs);
      if (multiAuthTabBtn) createSidebarButton(multiAuthTabBtn);
      var geoTabBtn = null;
      var enhancementsTabBtn = createEnhancementsTab(doc, tabs);
      if (enhancementsTabBtn) createSidebarButton(enhancementsTabBtn);
    }
    var spacer = doc.createElement("div");
    spacer.style.cssText = "flex:1;min-height:8px;";
    spacer.setAttribute("data-spacer", "true");
    sidebar.appendChild(spacer);
    insertButtonsInOrder();
    var divider = doc.createElement("div");
    divider.style.cssText = "width:28px;height:1px;background:var(--theme-border);margin:2px auto;flex-shrink:0;";
    sidebar.appendChild(divider);
    var closeBtn = dialog.querySelector('button[data-hook="close"]');
    if (closeBtn) {
      var sidebarCloseBtn = doc.createElement("button");
      sidebarCloseBtn.className = "settings-sidebar-btn";
      sidebarCloseBtn.setAttribute("data-close", "true");
      sidebarCloseBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      sidebarCloseBtn.style.cssText = sidebarCloseBtn.style.cssText + ";color:var(--theme-text-muted)!important;";
      addTooltip(sidebarCloseBtn, t("Fechar"));
      sidebarCloseBtn.onmouseenter = function() {
        sidebarCloseBtn.style.color = "#dc2626";
      };
      sidebarCloseBtn.onmouseleave = function() {
        sidebarCloseBtn.style.color = "";
      };
      sidebarCloseBtn.onclick = function() {
        closeBtn.click();
      };
      sidebar.appendChild(sidebarCloseBtn);
    }
    if (tabs) {
      var tabsObserver = new MutationObserver(function(mutations) {
        var needsReorder = false;
        for (var m = 0; m < mutations.length; m++) {
          var added = mutations[m].addedNodes;
          for (var n = 0; n < added.length; n++) {
            if (added[n].tagName === "BUTTON") {
              createSidebarButton(added[n]);
              needsReorder = true;
            }
          }
        }
        if (needsReorder) insertButtonsInOrder();
      });
      tabsObserver.observe(tabs, {
        childList: true
      });
    }
    var settingsContents = dialog.querySelector(".tabcontents");
    if (settingsContents) {
      settingsContents.style.marginLeft = "48px";
      settingsContents.style.boxSizing = "border-box";
    }
    if (tabs) tabs.style.display = "none";
    if (closeBtn) closeBtn.style.display = "none";
    dialog.style.position = "relative";
    dialog.appendChild(sidebar);
  }
  function hideTooltip() {
    var tooltip = document.getElementById("settings-sidebar-tooltip");
    if (tooltip) {
      tooltip.className = "hidden";
      tooltip.style.opacity = "0";
    }
  }
  function init() {
    if (!Injector.isGameFrame()) return;
    Injector.onSettingsView(function() {
      modifySettingsDialog(document);
    });
    var settingsDialog = document.querySelector(".dialog.settings-view");
    if (settingsDialog && !document.getElementById("settings-sidebar-panel")) {
      modifySettingsDialog(document);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();