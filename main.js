const {app, BrowserWindow, Menu} = require('electron');

var mainWindow;
app.on('ready', function(){
    //TODO look into preload.js
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });


    mainWindow.loadFile('ui/main.html');


    //Quit app when closed
    mainWindow.on('close', app.quit);
});