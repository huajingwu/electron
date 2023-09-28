const { ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");

// 更新地址,该地址下放的是安装包和latest.yml
const updateURL = "http://你的软件下载网络地址/";

const message = {
  error: "软件更新异常,请重试",
  checking: "正在检查更新",
  updateAva: "检测到新版本，准备下载",
  updateDown: "软件下载中,请耐心等待",
  updateSet: "下载完成,准备安装",
  updateNotAva: "已经是最新版本",
};

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function handleUpdate(mainWindow, callback) {
  // 设置是否自动下载，默认是true,当点击检测到新版本时，会自动下载安装包，所以设置为false
  autoUpdater.autoDownload = true;

  // 如果安装包下载好了，当应用退出后是否自动安装更新
  autoUpdater.autoInstallOnAppQuit = false;

  // 设置版本更新服务器地址
  autoUpdater.setFeedURL(updateURL);

  // 更新发生错误时触发
  autoUpdater.on("error", function () {
    sendUpdateMessage(message.error);
  });

  // 开始检查更新事件
  autoUpdater.on("checking-for-update", function () {
    sendUpdateMessage(message.checking);
  });

  // 没有可更新版本
  autoUpdater.on("update-not-available", function (info) {
    sendUpdateMessage(message.updateNotAva);
  });

  // 发现可更新版本
  autoUpdater.on("update-available", function (info) {
    sendUpdateMessage(message.updateAva);
  });

  // 更新下载进度事件
  autoUpdater.on("download-progress", function (progressObj) {
    sendUpdateMessage(message.updateDown);
    mainWindow.webContents.send("on-soft-download", progressObj.percent);
  });

  // 下载监听
  autoUpdater.on(
    "update-downloaded",
    function (
      event,
      releaseNotes,
      releaseName,
      releaseDate,
      updateUrl,
      quitAndUpdate
    ) {
      mainWindow.webContents.send("on-soft-download", 100);
      sendUpdateMessage(message.updateSet);
      //3秒后更新
      setTimeout(() => {
        autoUpdater.quitAndInstall();
      }, 3000);
    }
  );

  // 向渲染进程发送消息
  function sendUpdateMessage(text) {
    mainWindow.webContents.send("on-soft-message", text);
  }
}

export default {
  handleUpdate,
};
