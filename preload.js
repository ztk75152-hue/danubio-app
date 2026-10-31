const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("danubioSettings", {
    get: () => ipcRenderer.invoke("danubio:get-settings"),
    getBackgroundPreview: () => ipcRenderer.invoke("danubio:get-background-preview"),
    update: (patch) => ipcRenderer.invoke("danubio:update-settings", patch),
    chooseBackground: () => ipcRenderer.invoke("danubio:choose-background"),
    clearBackground: () => ipcRenderer.invoke("danubio:clear-background")
});

contextBridge.exposeInMainWorld("danubioUpdater", {
    onStatus: (callback) => {
        if (typeof callback !== "function") return;
        ipcRenderer.on("danubio:update-status", (_event, status) => callback(status));
    },
    download: () => ipcRenderer.invoke("danubio:update-download"),
    install: () => ipcRenderer.invoke("danubio:update-install")
});
