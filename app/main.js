const { app, BrowserWindow, dialog, autoUpdater } = require('electron')
const path = require('path');
let appVersion = app.getVersion()


updateApp();

function createWindow () {
  let platform = 'windows';
  switch (process.platform) {
    case 'darwin':
      platform = 'osx';
      break;
    case 'win32':
      platform = 'windows';
      break;
    case 'linux':
      platform = 'linux';
      break;
    default:
      break;
  }
  const updateUrl = `https://github.com/NazarK0/test-electron-app-update/${platform}/releases/latest`;
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




if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false
  }

  const ChildProcess = require('child_process')
  const path = require('path')
  const appFolder = path.resolve(process.execPath, '..')
  const rootAtomFolder = path.resolve(appFolder, '..')
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
  const exeName = path.basename(process.execPath)

  const spawn = function (command, args) {
    let spawnedProcess, error
    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
    } catch (error) { }
    return spawnedProcess
  }

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args)
  }

  const squirrelEvent = process.argv[1]

  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //  explorer context menus
      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName])
      setTimeout(app.quit, 1000)
      return true
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers
      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName])
      setTimeout(app.quit, 1000)
      return true
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit()
      return true
  }
}
