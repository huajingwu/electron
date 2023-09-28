// electron-main/index.js
const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
import path from "path";

import autoUpdate  from "./update.js";

const createWindow = () => {
  console.log(path.join(__dirname, "../electron/preload/index.js"));
  const win = new BrowserWindow({
    webPreferences: {
      width: 600,
      height: 800,

      contextIsolation: true, // 是否开启隔离上下文,默认开启
      nodeIntegration: false, // 渲染进程使用Node API
      preload: path.join(__dirname, "../electron/preload/index.js"), // 需要引用js文件
    },
  });
  // 如果打包了，渲染index.html
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    let url = "http://127.0.0.1:5173/"; // 本地启动的vue项目路径
    win.loadURL(url);
  }

  win.on("ready-to-show", () => {
    console.log("ready-to-show");
    autoUpdate.handleUpdate(win);
  });

  ipcMain.on("set-title", (event) => {
    console.log(1212);

    win.setTitle("ReeeeeBar");
  });
  const contents = win.webContents;
  contents.openDevTools();
};

// 在 Electron 中，只有在 app 模块的 ready 事件触发后才能创建 BrowserWindows 实例
app.whenReady().then(() => {
  createWindow(); // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭所有窗口时退出应用 (Windows & Linux)
app.on("window-all-closed", () => {
  console.log(888);
  if (process.platform !== "darwin") {
    app.quit();
  }
});
