(function() {
  "use strict";
  if (Injector.isMainFrame()) return;
  var VERSION = "1.0";
  var DISCORD_URL = "https://discord.gg/hewdfvw9v";
  var SEEN_KEY = "haxball_welcome_seen";
  var currentPage = 0;
  var PAGES = [ {
    title: "Bienvenido a la version " + VERSION + "   de HaxNew",
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    render: function() {
      return list([ {
        icon: icCheck,
        text: "Lista de salas completamente rediseñada"
      }, {
        icon: icCheck,
        text: "Nuevo sistema de temas con 40+ opciones"
      }, {
        icon: icCheck,
        text: "Favoritos y salas fijadas en el topo"
      }, {
        icon: icCheck,
        text: "Filtro de búsqueda y por país"
      }, {
        icon: icCheck,
        text: "Sidebar minimalista con accesos rápidos"
      }, {
        icon: icCheck,
        text: "GeoManager: bypass de ubicación mejorado"
      }, {
        icon: icCheck,
        text: "Rendimiento optimizado en todos los módulos"
      } ]);
    }
  }, {
    title: "Nuevas Funciones",
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    render: function() {
      return list([ {
        icon: icShield,
        text: "<b>Fake Ping</b> — Puedes colocarte el ping que tu quieras."
      }, {
        icon: icMessage,
        text: "<b>Chat Bubbles</b> — Visualiza como si estuvieras escribiendo siempre."
      }, {
        icon: icZap,
        text: "<b>Discord Community</b> — Acceso directo a soporte y Sugerencias."
      } ]);
    }
  }, {
    title: "Atajos de Teclado",
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/></svg>',
    render: function() {
      return shortcuts([ {
        key: "Alt + R",
        desc: "Recargar el juego instantáneamente"
      }, {
        key: "Alt + F",
        desc: "Activar / Desactivar Pantalla Completa"
      }, {
        key: "F2",
        desc: "Mostrar / ocultar el header superior"
      }, {
        key: "F8",
        desc: "Abrir Menu Con Funciones en Modo Beta"
      }, {
        key: "Ctrl + F",
        desc: "Enfocar la búsqueda de salas"
      }, {
        key: "Esc",
        desc: "Limpiar búsqueda / cerrar menús / diálogos"
      }, {
        key: "Click derecho",
        desc: "Menú contextual sobre una sala"
      } ]);
    }
  }, {
    title: "Únete a la Comunidad",
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    render: function() {
      return '<div style="text-align:center; padding: 10px 0;">' + '<div style="color:var(--theme-text-secondary,#888);font-size:14px;line-height:1.7;margin-bottom:20px;">Forma parte de nuestro Discord oficial para obtener las últimas actualizaciones, reportar bugs y participar en la comunidad.</div>' + '<a href="' + DISCORD_URL + '" target="_blank" style="background:#5865F2; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block; transition:0.2s;">ENTRAR AL DISCORD</a>' + "</div>";
    }
  }, {
    title: "Lista de Salas",
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    render: function() {
      return list([ {
        icon: icStar,
        text: "<b>Favoritos</b> — click derecho sobre una sala → Añadir Favorito. El ícono del sidebar los filtra."
      }, {
        icon: icPin,
        text: "<b>Fijar arriba</b> — click derecho → Fijar en el Topo. La sala queda siempre primera."
      }, {
        icon: icGlobe,
        text: "<b>Filtro de país</b> — el botón del globo filtra salas por bandera."
      }, {
        icon: icSearch,
        text: "<b>Búsqueda</b> — escribe para filtrar en tiempo real. Ctrl+F la enfoca desde cualquier lugar."
      }, {
        icon: icLock,
        text: "<b>Salas con contraseña</b> — aparecen con menor opacidad para distinguirlas."
      } ]);
    }
  }, {
    title: "Temas",
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="1" fill="currentColor"/><circle cx="17.5" cy="10.5" r="1" fill="currentColor"/><circle cx="8.5" cy="7.5" r="1" fill="currentColor"/><circle cx="6.5" cy="12.5" r="1" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',
    render: function() {
      return '<div style="color:var(--theme-text-secondary,#888);font-size:13px;line-height:1.7;margin-bottom:16px;">Más de 40 temas para personalizar la interfaz. Cada tema adapta colores, bordes y efectos visuales de forma automática.</div>' + grid([ {
        name: "Dark Standard",
        dot: "#dddddd"
      }, {
        name: "Onix Pure",
        dot: "#e8e8e8"
      }, {
        name: "Onix Gold",
        dot: "#c9a227"
      }, {
        name: "Tokyo Night",
        dot: "#7aa2f7"
      }, {
        name: "Catppuccin Mocha",
        dot: "#cba6f7"
      }, {
        name: "Synthwave 84",
        dot: "#f062c0"
      }, {
        name: "Cyberpunk 2099",
        dot: "#00fff5"
      }, {
        name: "Aurora Borealis",
        dot: "#00e5b0"
      }, {
        name: "Matrix Console",
        dot: "#00dd38"
      }, {
        name: "Neon Tokyo",
        dot: "#ff00aa"
      }, {
        name: "Midnight Sky",
        dot: "#1a6fef"
      }, {
        name: "Vaporwave",
        dot: "#ff71ce"
      }, {
        name: "Blood Moon",
        dot: "#e03030"
      }, {
        name: "Deep Space",
        dot: "#4f46e5"
      }, {
        name: "Rosé Pine",
        dot: "#ebbcba"
      }, {
        name: "Dracula Pro",
        dot: "#bd93f9"
      } ]) + '<div style="color:var(--theme-text-secondary,#666);font-size:11px;margin-top:14px;">Cambiá el tema en Configuración → pestaña de temas.</div>';
    }
  }, {
    title: "Rendimiento",
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    render: function() {
      return list([ {
        icon: icPerf,
        text: "<b>Líneas simplificadas</b> — reduce grosor de líneas del campo de 3px a 1px"
      }, {
        icon: icPerf,
        text: "<b>Curvas en rectas</b> — elimina suavizado de curvas para mayor FPS"
      }, {
        icon: icPerf,
        text: "<b>Culling de viewport</b> — no dibuja objetos fuera de pantalla"
      }, {
        icon: icPerf,
        text: "<b>Campo simplificado</b> — colores sólidos en lugar de texturas"
      }, {
        icon: icPerf,
        text: "<b>Desactivar avatares</b> — elimina avatares y colores personalizados"
      }, {
        icon: icPerf,
        text: "<b>Alta prioridad</b> — otorga más recursos del sistema al juego"
      }, {
        icon: icPerf,
        text: "<b>Límite FPS</b> — fijá el framerate según tu monitor (30/60/75/144...)"
      } ]) + '<div style="margin-top:14px;padding:10px 12px;background:rgba(255,255,255,0.03);border:1px solid var(--theme-border,#232323);border-radius:6px;color:var(--theme-text-secondary,#666);font-size:11px;">Exportá e importá tu configuración desde la pestaña Rendimiento para compartir con amigos.</div>';
    }
  }, {
    title: "Comandos del Chat",
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    render: function() {
      return commands([ {
        cmd: "/gif [url]",
        desc: "Poner gif como avatar"
      }, {
        cmd: "/avatar [texto]",
        desc: "Cambiar tu avatar de texto"
      }, {
        cmd: "/input [ms]",
        desc: "Simular input lag (ej: /input 50)"
      }, {
        cmd: "/nick [nombre]",
        desc: "Cambiar tu nombre en sala"
      }, {
        cmd: "/help",
        desc: "Ver todos los comandos disponibles"
      }, {
        cmd: "/fakeping",
        desc: "Poner Ping Falso (Unicamente Visual)"
      }, {
        cmd: "/chatbubble",
        desc: "Activar el Escribir Siempre"
      } ]);
    }
  } ];
  var icCheck = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  var icStar = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-secondary,#888)" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
  var icPin = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>';
  var icGlobe = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-secondary,#888)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  var icSearch = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-secondary,#888)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';
  var icLock = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-secondary,#888)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var icPerf = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-secondary,#888)" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>';
  var icShield = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0080ff" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
  var icMessage = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0080ff" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var icZap = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0080ff" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
  function list(items) {
    var h = '<div style="display:flex;flex-direction:column;gap:11px;margin-top:4px;">';
    for (var i = 0; i < items.length; i++) {
      h += '<div style="display:flex;align-items:flex-start;gap:10px;">' + '<div style="flex-shrink:0;margin-top:1px;">' + items[i].icon + "</div>" + '<span style="color:var(--theme-text-primary,#ddd);font-size:13px;line-height:1.55;">' + items[i].text + "</span>" + "</div>";
    }
    return h + "</div>";
  }
  function shortcuts(items) {
    var h = '<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">';
    for (var i = 0; i < items.length; i++) {
      h += '<div style="display:flex;align-items:center;gap:12px;">' + '<kbd style="background:var(--theme-bg-tertiary,#272727);border:1px solid var(--theme-border,#333);border-radius:5px;padding:3px 8px;font-size:11px;color:var(--theme-text-primary,#fff);white-space:nowrap;font-family:monospace;min-width:90px;text-align:center;flex-shrink:0;">' + items[i].key + "</kbd>" + '<span style="color:var(--theme-text-primary,#ccc);font-size:13px;">' + items[i].desc + "</span>" + "</div>";
    }
    return h + "</div>";
  }
  function commands(items) {
    var h = '<div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">';
    for (var i = 0; i < items.length; i++) {
      h += '<div style="display:flex;align-items:center;gap:12px;">' + '<code style="background:var(--theme-bg-tertiary,#272727);border:1px solid var(--theme-border,#333);border-radius:5px;padding:3px 9px;font-size:11px;color:#4ade80;white-space:nowrap;font-family:monospace;min-width:140px;flex-shrink:0;">' + items[i].cmd + "</code>" + '<span style="color:var(--theme-text-primary,#ccc);font-size:13px;">' + items[i].desc + "</span>" + "</div>";
    }
    return h + "</div>";
  }
  function grid(items) {
    var h = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:4px;">';
    for (var i = 0; i < items.length; i++) {
      h += '<div style="display:flex;align-items:center;gap:6px;padding:5px 7px;background:var(--theme-bg-secondary,#1a1a1a);border:1px solid var(--theme-border,#222);border-radius:5px;">' + '<div style="width:8px;height:8px;border-radius:50%;background:' + items[i].dot + ';flex-shrink:0;"></div>' + '<span style="color:var(--theme-text-primary,#ccc);font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + items[i].name + "</span>" + "</div>";
    }
    return h + "</div>";
  }
  function renderPage(popup, index) {
    var page = PAGES[index];
    var isFirst = index === 0;
    var isLast = index === PAGES.length - 1;
    popup.innerHTML = '<div style="padding:18px 22px 16px;border-bottom:1px solid var(--theme-border,#222);display:flex;align-items:center;gap:12px;">' + '<div style="color:var(--theme-text-secondary,#666);">' + page.icon + "</div>" + '<span style="color:var(--theme-text-primary,#fff);font-size:16px;font-weight:600;flex:1;">' + page.title + "</span>" + '<span style="color:var(--theme-text-secondary,#444);font-size:11px;">' + (index + 1) + " / " + PAGES.length + "</span>" + "</div>" + '<div style="padding:20px 22px;overflow-y:auto;max-height:360px;">' + page.render() + "</div>" + '<div style="padding:14px 22px;border-top:1px solid var(--theme-border,#222);display:flex;justify-content:space-between;align-items:center;">' + '<div style="display:flex;gap:6px;">' + function() {
      var dots = "";
      for (var i = 0; i < PAGES.length; i++) {
        dots += '<div style="width:' + (i === index ? "16" : "6") + "px;height:6px;border-radius:3px;background:" + (i === index ? "var(--theme-text-primary,#fff)" : "var(--theme-border,#333)") + ';transition:all .2s;"></div>';
      }
      return dots;
    }() + "</div>" + '<div style="display:flex;gap:8px;">' + '<button id="wp-prev" style="padding:8px 16px;background:var(--theme-bg-secondary,#1a1a1a);border:1px solid var(--theme-border,#333);border-radius:6px;color:' + (isFirst ? "var(--theme-text-secondary,#444)" : "var(--theme-text-primary,#ccc)") + ";font-size:12px;cursor:" + (isFirst ? "default" : "pointer") + ';" ' + (isFirst ? "disabled" : "") + ">Anterior</button>" + '<button id="wp-next" style="padding:8px 20px;background:var(--theme-text-primary,#fff);border:none;border-radius:6px;color:#000;font-size:12px;font-weight:600;cursor:pointer;">' + (isLast ? "Comenzar ✓" : "Siguiente") + "</button>" + "</div>" + "</div>";
    popup.querySelector("#wp-prev").onclick = function() {
      if (index > 0) {
        currentPage--;
        renderPage(popup, currentPage);
      }
    };
    popup.querySelector("#wp-next").onclick = function() {
      if (isLast) {
        close();
      } else {
        currentPage++;
        renderPage(popup, currentPage);
      }
    };
  }
  function close() {
    var el = document.getElementById("wp-overlay");
    if (el) el.remove();
    localStorage.setItem(SEEN_KEY, VERSION);
  }
  function show() {
    if (document.getElementById("wp-overlay")) return;
    currentPage = 0;
    var overlay = document.createElement("div");
    overlay.id = "wp-overlay";
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:99999;display:flex;align-items:center;justify-content:center;";
    overlay.onclick = function(e) {
      if (e.target === overlay) close();
    };
    var popup = document.createElement("div");
    popup.style.cssText = "background:var(--theme-bg-primary,#111);border:1px solid var(--theme-border,#252525);border-radius:12px;width:540px;max-width:94vw;box-shadow:0 24px 80px rgba(0,0,0,0.7);";
    renderPage(popup, 0);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", onKey);
      }
      if (e.key === "ArrowRight" && currentPage < PAGES.length - 1) {
        currentPage++;
        renderPage(popup, currentPage);
      }
      if (e.key === "ArrowLeft" && currentPage > 0) {
        currentPage--;
        renderPage(popup, currentPage);
      }
    });
  }
  window.__showWelcomePopup = show;
  window.__closeWelcomePopup = close;
  Injector.waitForElement("body").then(function() {
    if (localStorage.getItem(SEEN_KEY) !== VERSION) setTimeout(show, 800);
  });
})();