const { app, BrowserWindow, dialog, autoUpdater } = require('electron')
const path = require('path');
let appVersion = app.getVersion()
let updateUrl = 'https://github.com/NazarK0/test-electron-app-update/releases/latest';

updateApp();

function createWindow () {
  autoUpdater.setFeedURL(updateUrl);
  autoUpdater.checkForUpdates();

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function updateApp () {
  autoUpdater.addListener("update-available", function(event) {
    console.log('Update Available')
  })

  autoUpdater.addListener("update-downloaded", function(event, releaseNotes, releaseName,
  releaseDate, updateURL) {
    console.log("Update Downloaded")
    console.log('releaseNotes', releaseNotes)
    console.log('releaseNotes', releaseName)
    console.log('releaseNotes', releaseDate)
    console.log('releaseNotes', updateURL)
  })
  autoUpdater.addListener("error", function(error) {
    console.log(Error, error)
  })
  autoUpdater.addListener("checking-for-update", function(event) {
    console.log('releaseNotes', 'Checking for Update')
  })
  autoUpdater.addListener("update-not-available", function(event) {
    console.log('releaseNotes', 'Update Not Available')
  })

  autoUpdater.addListener("update-available", function (event) {
    console.log('Update Available')
    dialog.showMessageBox({
      type: "info",
      title: "Update Available",
      message: 'There is an update available.' + appVersion,
      buttons: ["Update", "Skip"]
    }, function (index) {
      console.log(index)
    })
  })
  autoUpdater.addListener("update-downloaded", function (event, releaseNotes, releaseName,
  releaseDate, updateURL) {
    console.log('releaseNotes', "Update Downloaded")
    console.log('releaseNotes', releaseNotes)
    console.log('releaseNotes', releaseName)
    console.log('releaseNotes', releaseDate)
    console.log('releaseNotes', updateURL)
    dialog.showMessageBox({
      type: "info",
      title: "Update Downloaded",
      message: "Update has downloaded",
      detail: releaseNotes,
      buttons: ["Install", "Skip"]
    }, function (index) {
      if (index === 0) {
        autoUpdater.quitAndInstall()
      }
      autoUpdater.quitAndInstall()
    })
  })
  autoUpdater.addListener("error", function (error) {
    console.log('Error')
    console.log(error)
    dialog.showMessageBox({
      type: "warning",
      title: "Update Error",
      message: 'An error occurred. ' + error,
      buttons: ["OK"]
    })
  })
}
