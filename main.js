const { app, BrowserWindow, webFrameMain, ipcMain, session, dialog } = require("electron");
const { autoUpdater } = require('electron-updater');
const path = require("path");
const fs = require("fs");

const settingsPath = path.join(app.getPath("userData"), "danubio-settings.json");
const imageTypes = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".bmp": "image/bmp" };
const defaultTheme = { name: "Mi tema", background: "#111111", panel: "#242424", text: "#f5f5f5", accent: "#ffffff" };
function sanitizeTheme(value) { if (!value || typeof value !== "object") return null; const color=(v,f)=>typeof v==="string" && /^#[0-9a-f]{6}$/i.test(v) ? v : f; return { name: typeof value.name==="string" ? value.name.trim().slice(0,24)||"Mi tema" : "Mi tema", background:color(value.background,defaultTheme.background), panel:color(value.panel,defaultTheme.panel), text:color(value.text,defaultTheme.text), accent:color(value.accent,defaultTheme.accent) }; }

function readSettings() {
    try {
        const stored = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        const userDir = path.resolve(app.getPath("userData")) + path.sep;
        const imagePath = typeof stored.backgroundImagePath === "string" ? path.resolve(stored.backgroundImagePath) : "";
        const imageIsLocal = imagePath.startsWith(userDir) && fs.existsSync(imagePath) && imageTypes[path.extname(imagePath).toLowerCase()];
        return {
            showFps: stored.showFps !== false,
            backgroundMode: ["crest", "monochrome", "plain", "custom"].includes(stored.backgroundMode) ? stored.backgroundMode : "crest",
            backgroundImagePath: imageIsLocal ? imagePath : null,
            nickname: typeof stored.nickname === "string" ? stored.nickname.slice(0, 25) : "",
            customTheme: sanitizeTheme(stored.customTheme)
        };
    } catch {
        return { showFps: true, backgroundMode: "crest", backgroundImagePath: null, nickname: "", customTheme: null };
    }
}
const userSettings = readSettings();

function saveSettings() {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(userSettings, null, 2), "utf8");
}
function publicSettings() {
    return {
        showFps: userSettings.showFps,
        backgroundMode: userSettings.backgroundMode,
        backgroundImageName: userSettings.backgroundImagePath ? path.basename(userSettings.backgroundImagePath) : "",
        nickname: userSettings.nickname,
        customTheme: userSettings.customTheme
    };
}

ipcMain.handle("danubio:get-settings", () => publicSettings());
ipcMain.handle("danubio:update-settings", (_event, patch) => {
    if (typeof patch?.showFps === "boolean") userSettings.showFps = patch.showFps;
    if (["crest", "monochrome", "plain", "custom"].includes(patch?.backgroundMode)) userSettings.backgroundMode = patch.backgroundMode;
    if (typeof patch?.nickname === "string") userSettings.nickname = patch.nickname.trim().slice(0, 25);
    if (patch?.customTheme && typeof patch.customTheme === "object") userSettings.customTheme = sanitizeTheme(patch.customTheme);
    saveSettings();
    return publicSettings();
});
ipcMain.handle("danubio:get-background-preview", () => { const file=userSettings.backgroundImagePath; if(!file||!fs.existsSync(file)) return ""; const type=imageTypes[path.extname(file).toLowerCase()]; return type ? "data:"+type+";base64,"+fs.readFileSync(file).toString("base64") : ""; });
ipcMain.handle("danubio:choose-background", async (event) => {
    const parent = BrowserWindow.fromWebContents(event.sender);
    const result = await dialog.showOpenDialog(parent, {
        title: "Elegí la imagen de fondo",
        properties: ["openFile"],
        filters: [{ name: "Imágenes", extensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"] }]
    });
    if (result.canceled || !result.filePaths[0]) return { selected: false };
    const source = result.filePaths[0];
    const ext = path.extname(source).toLowerCase();
    if (!imageTypes[ext]) return { selected: false, error: "Formato de imagen no compatible." };
    const stat = fs.statSync(source);
    if (stat.size > 8 * 1024 * 1024) return { selected: false, error: "La imagen debe pesar menos de 8 MB." };
    const destination = path.join(app.getPath("userData"), "danubio-background" + ext);
    fs.copyFileSync(source, destination);
    userSettings.backgroundImagePath = destination;
    userSettings.backgroundMode = "custom";
    saveSettings();
    return { selected: true, settings: publicSettings(), dataUrl: "data:" + imageTypes[ext] + ";base64," + fs.readFileSync(destination).toString("base64") };
});
ipcMain.handle("danubio:clear-background", () => {
    userSettings.backgroundImagePath = null;
    userSettings.backgroundMode = "crest";
    saveSettings();
    return publicSettings();
});

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "Danubio App",
        icon: path.join(__dirname, "icon.ico.ico"),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    win.loadFile(path.join(__dirname, "index.html"));
    applyDanubioAppearance(win);
}
function getBackgroundRules(crestData) {
    const crest = "html{background-color:#050505!important;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.12) 0 2px,transparent 2px 26px),radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.08),rgba(0,0,0,0) 68%),linear-gradient(rgba(5,5,5,.58),rgba(5,5,5,.58)),url(\"data:image/png;base64," + crestData + "\")!important;background-position:center,center,center,center!important;background-repeat:repeat,no-repeat,no-repeat,no-repeat!important;background-size:auto,cover,cover,min(38vw,420px)!important;background-attachment:fixed,fixed,fixed,fixed!important}";
    const custom = userSettings.backgroundImagePath && fs.existsSync(userSettings.backgroundImagePath)
        ? "html{background-color:#050505!important;background-image:linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.05)),url(\"data:" + imageTypes[path.extname(userSettings.backgroundImagePath).toLowerCase()] + ";base64," + fs.readFileSync(userSettings.backgroundImagePath).toString("base64") + "\")!important;background-position:center!important;background-repeat:no-repeat!important;background-size:cover!important;background-attachment:fixed!important}"
        : crest;
    return {
        crest,
        monochrome: "html{background-color:#050505!important;background-image:repeating-linear-gradient(135deg,#050505 0 22px,#f2f2f2 22px 25px,#050505 25px 48px)!important;background-size:auto!important}",
        plain: "html{background-color:#050505!important;background-image:none!important}",
        custom
    };
}
function applyDanubioAppearance(win) {
    const crestData = fs.readFileSync(path.join(__dirname, "danubio.png")).toString("base64");
    win.webContents.on("did-frame-finish-load", (_event, _isMainFrame, processId, routingId) => {
        const frame = webFrameMain.fromId(processId, routingId);
        if (!frame || !/^https:\/\/(www|html5)\.haxball\.com\//.test(frame.url)) return;

        // Read preferences here, after the user may have chosen an image in the splash menu.
        const backgroundRules = getBackgroundRules(crestData);
        const initialBackground = backgroundRules[userSettings.backgroundMode] || backgroundRules.crest;
        const theme = userSettings.customTheme || { background:"#141414", panel:"#202024", text:"#f5f5f5", accent:"#999999" };
        const themeCss = ":root{--theme-bg-primary:"+theme.background+";--theme-bg-secondary:"+theme.panel+";--theme-bg-tertiary:"+theme.panel+";--theme-bg-hover:"+theme.accent+";--theme-bg-selected:"+theme.panel+";--theme-border:"+theme.accent+";--theme-border-light:"+theme.accent+";--theme-text-primary:"+theme.text+";--theme-text-secondary:"+theme.text+";--theme-text-muted:"+theme.text+";--theme-scrollbar-track:"+theme.background+";--theme-scrollbar-thumb:"+theme.accent+";--theme-tooltip-bg:"+theme.panel+";--theme-tooltip-border:"+theme.accent+"}html,body{color:"+theme.text+"!important;background-color:transparent!important}html .roomlist-view,html .scene{background:transparent!important;background-color:transparent!important}html .roomlist-view .dialog{background:color-mix(in srgb,var(--theme-bg-secondary) 78%,transparent)!important;background-color:color-mix(in srgb,var(--theme-bg-secondary) 78%,transparent)!important;color:"+theme.text+"!important;border:1px solid "+theme.accent+"!important;backdrop-filter:blur(4px)!important}html .roomlist-view .dialog .content{background:transparent!important}html .roomlist-view .content table{background:rgba(0,0,0,.14)!important;color:"+theme.text+"!important}html .roomlist-view .content table tr:hover{background:rgba(255,255,255,.08)!important}html .roomlist-view button{color:"+theme.text+"!important}";
        const roomPanelCss = themeCss + "html[data-app-bg-image=\"1\"] body,html:not([data-theme=\"default\"])[data-app-bg-image=\"1\"] body{background:transparent!important;background-color:transparent!important;background-image:none!important}.scene,html[data-app-bg-image=\"1\"] .scene,.roomlist-view{background:transparent!important;background-color:transparent!important;background-image:none!important}html[data-app-bg-image=\"1\"] .roomlist-view .dialog{background:rgba(12,12,14,.58)!important;background-color:rgba(12,12,14,.58)!important;backdrop-filter:blur(3px)!important;border:1px solid rgba(255,255,255,.3)!important}html[data-app-bg-image=\"1\"] .roomlist-view .dialog .content{background:transparent!important}html[data-app-bg-image=\"1\"] .roomlist-view .dialog table{background:rgba(0,0,0,.16)!important}html[data-app-bg-image=\"1\"] body::before{content:none!important;display:none!important;background:none!important}";
        const fpsScript = userSettings.showFps ? "(function(){if(!document.querySelector('canvas')||document.getElementById('danubio-fps-counter'))return;var c=document.createElement('div');c.id='danubio-fps-counter';c.textContent='FPS --';c.style.cssText='position:fixed;top:8px;left:8px;z-index:2147483647;padding:5px 8px;border:1px solid rgba(255,255,255,.3);border-radius:6px;background:rgba(0,0,0,.72);color:#fff;font:12px Arial,sans-serif;pointer-events:none';(document.body||document.documentElement).appendChild(c);var f=0,s=performance.now();function t(n){f++;if(n-s>=500){c.textContent='FPS '+Math.round(f*1000/(n-s));f=0;s=n}requestAnimationFrame(t)}requestAnimationFrame(t)})();" : "";
        const shortcutScript = "(function(){if(window.__danubioShortcuts)return;window.__danubioShortcuts=true;var modes=['crest','monochrome','plain','custom'];var mode=" + JSON.stringify(userSettings.backgroundMode) + ";var rules=" + JSON.stringify(backgroundRules) + ";var bg=document.createElement('style');bg.id='danubio-shortcut-background';(document.head||document.documentElement).appendChild(bg);function setBg(){bg.textContent=rules[mode]||rules.crest}function ensureFps(){var c=document.getElementById('danubio-fps-counter');if(c)return c;c=document.createElement('div');c.id='danubio-fps-counter';c.textContent='FPS --';c.style.cssText='position:fixed;top:8px;left:8px;z-index:2147483647;padding:5px 8px;border:1px solid rgba(255,255,255,.3);border-radius:6px;background:rgba(0,0,0,.72);color:#fff;font:12px Arial,sans-serif;pointer-events:none';(document.body||document.documentElement).appendChild(c);var f=0,s=performance.now();function t(n){f++;if(n-s>=500){c.textContent='FPS '+Math.round(f*1000/(n-s));f=0;s=n}requestAnimationFrame(t)}requestAnimationFrame(t);return c}document.addEventListener('keydown',function(e){if(!e.altKey||!e.shiftKey||e.repeat)return;if(e.code==='KeyF'){var c=ensureFps();c.style.display=c.style.display==='none'?'':'none'}else if(e.code==='KeyB'){mode=modes[(modes.indexOf(mode)+1)%modes.length];setBg()}},true)})();";
        const backgroundMessageScript = "(function(){if(window.__danubioBgSync)return;window.__danubioBgSync=true;function apply(d){if(typeof d!=='string'||d.indexOf('data:image/')!==0||d.length>16000000)return;var id='danubio-room-background-image';var s=document.getElementById(id);if(!s){s=document.createElement('style');s.id=id;(document.head||document.documentElement).appendChild(s)}s.textContent='html{background-color:#050505!important;background-image:linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.05)),url('+JSON.stringify(d)+')!important;background-position:center!important;background-repeat:no-repeat!important;background-size:cover!important;background-attachment:fixed!important}html[data-app-bg-image=\"1\"] body,html:not([data-theme=\"default\"])[data-app-bg-image=\"1\"] body{background:transparent!important;background-color:transparent!important;background-image:none!important}.scene,.roomlist-view{background:transparent!important;background-color:transparent!important;background-image:none!important}html[data-app-bg-image=\"1\"] .roomlist-view .dialog{background:rgba(12,12,14,.58)!important;background-color:rgba(12,12,14,.58)!important;backdrop-filter:blur(3px)!important;border:1px solid rgba(255,255,255,.3)!important}html[data-app-bg-image=\"1\"] .roomlist-view .dialog .content{background:transparent!important}html[data-app-bg-image=\"1\"] .roomlist-view .dialog table{background:rgba(0,0,0,.16)!important}html[data-app-bg-image=\"1\"] body::before{content:none!important;display:none!important;background:none!important}';document.documentElement.setAttribute('data-app-bg-image','1');if(document.body){document.body.style.setProperty('background','transparent','important');document.body.style.setProperty('background-color','transparent','important')}document.querySelectorAll('.scene,.roomlist-view').forEach(function(el){el.style.setProperty('background','transparent','important');el.style.setProperty('background-color','transparent','important');el.style.setProperty('background-image','none','important')});document.querySelectorAll('.roomlist-view .dialog').forEach(function(el){el.style.setProperty('background','rgba(12,12,14,.58)','important');el.style.setProperty('background-color','rgba(12,12,14,.58)','important')})}window.addEventListener('message',function(e){var m=e.data;if(!m||m.type!=='danubio-bg-image')return;apply(m.dataUrl);if(window.top===window)document.querySelectorAll('iframe').forEach(function(f){try{f.contentWindow.postMessage(m,'*')}catch(_){}})},false)})();";
        const script = "(function(){var id='danubio-haxball-style';var style=document.getElementById(id);if(!style){style=document.createElement('style');style.id=id;(document.head||document.documentElement).appendChild(style)}style.textContent=" + JSON.stringify(initialBackground + roomPanelCss + "body{min-height:100vh!important;background:transparent!important}") + ";" + (userSettings.backgroundMode === "custom" ? "document.documentElement.setAttribute('data-app-bg-image','1');" : "") + fpsScript + shortcutScript + backgroundMessageScript + "})();";
        frame.executeJavaScript(script).catch((error) => console.error("No se pudo aplicar el tema Danubio:", error));
        const roomImageButtonScript = "(function(){if(window.top!==window||window.__danubioRoomImageButton)return;window.__danubioRoomImageButton=true;var tries=0;function mount(){var bar=document.querySelector('.hdr-right');if(!bar){if(++tries<40)setTimeout(mount,250);return}var b=document.createElement('button');b.className='action-btn';b.type='button';b.title='Cambiar imagen de fondo';b.setAttribute('aria-label','Cambiar imagen de fondo');b.textContent='▧';b.style.fontSize='18px';b.addEventListener('click',async function(){if(!window.danubioSettings){b.title='El selector no está disponible en esta página';return}var result=await window.danubioSettings.chooseBackground();if(result.selected&&result.dataUrl){window.top.postMessage({type:'danubio-bg-image',dataUrl:result.dataUrl},'*');b.title='Fondo actualizado: '+result.settings.backgroundImageName}else if(result.error){b.title=result.error}});bar.insertBefore(b,bar.firstChild)}mount()})();";
        frame.executeJavaScript(roomImageButtonScript).catch((error) => console.error("No se pudo agregar el botón de fondo:", error));
    });
}
app.whenReady().then(async () => {
    if (app.isPackaged) {
        autoUpdater.autoDownload = false;
        autoUpdater.on("update-available", async (info) => {
            const result = await dialog.showMessageBox({ type: "info", title: "Actualización disponible", message: "Hay una nueva versión de Danubio (" + info.version + "). ¿Querés descargarla?", buttons: ["Descargar", "Más tarde"], defaultId: 0, cancelId: 1 });
            if (result.response === 0) autoUpdater.downloadUpdate();
        });
        autoUpdater.on("update-downloaded", async () => {
            const result = await dialog.showMessageBox({ type: "info", title: "Actualización lista", message: "Danubio se reiniciará para instalar la actualización.", buttons: ["Reiniciar ahora", "Al cerrar"], defaultId: 0, cancelId: 1 });
            if (result.response === 0) autoUpdater.quitAndInstall();
        });
        autoUpdater.checkForUpdates().catch((error) => console.warn("No se pudo comprobar actualizaciones:", error.message));
    }
    const extensionPath = app.isPackaged
        ? path.join(process.resourcesPath, "app.asar.unpacked", "extension")
        : path.join(__dirname, "extension");
    try {
        await session.defaultSession.extensions.loadExtension(extensionPath);
        console.log("Extensión visual de Danubio cargada.");
    } catch (error) {
        console.error("No se pudo cargar la extensión visual de Danubio:", error);
    }
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});