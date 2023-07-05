"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const isDevelopment = process.env.NODE_ENV !== "production";

log.transports.file.resolvePath = () =>
  path.join("E:/jsframework/electron/vuetify_au_app/", "logs/main.log");

log.log("version " + app.getVersion());

Object.defineProperty(app, "isPackaged", {
  get() {
    return true;
  },
});

autoUpdater.updateConfigPath = path.join(
  __dirname,
  "../dev-app-update.yml" // change path if needed
);

autoUpdater.setFeedURL({
  provider: "generic",
  url: "https://autoupdate-au.s3.ap-south-1.amazonaws.com",
});

// autoUpdater.setFeedURL({
//   provider: "github",
//   owner: "prajapatidk",
//   repo: "vuetify_au_app",
//   private: true,
// });

autoUpdater.autoDownload = false;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
  autoUpdater.checkForUpdates();
});

autoUpdater.on("checking-for-update", (info) => {
  log.info("checking-for-update", info);
});

autoUpdater.on("update-available", (info) => {
  log.info("update-available", info);
  autoUpdater.autoDownload = true;
});

autoUpdater.on("update-not-available", (info) => {
  log.info("update-not-available-3", info);
});

autoUpdater.on("error", (info) => {
  log.info("error-4", info);
});

autoUpdater.on("download-process", (progressTrack) => {
  log.info(progressTrack);
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("update-downloaded-6", info);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
