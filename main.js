const { app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');

const _IconPath = path.join(__dirname, 'assets', 'icons');

var mainWindow;
//TODO: add handler functions
var raceQueue = [
    {
        name: "bob",
    },
    {
        name: "pcat",
    },
    {
        name: "Xandy",
    },
    {
        name: "name",
    },
    {
        name: "jake"
    }
];

ipcMain.on("queue:next", function(event, first, last){
    event.reply("updateList", raceQueue.slice(0,4));
});



const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: 'Ctrl+Q',
                click: app.quit
            }
        ]
    },
    {//TODO: Hide dev tools when in production 6
        label: 'Developer Tools',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle DevTools',
                accelerator: 'Ctrl+I',
                click(item, focusedWindow) {
                    if(!focusedWindow.isDevToolsOpened()){
                        focusedWindow.openDevTools({ mode: 'detach' });
                    }else{
                        focusedWindow.closeDevTools();
                    }
                }
            }
        ]
    }
];

function createMainWindow(){
    //TODO look into preload.js
    var window = new BrowserWindow({
        icon: path.join(_IconPath, 'icon1024.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });


    window.loadFile('src/main.html');

    //Quit app when closed
    window.on('close', app.quit);
    return window;
}


app.on('ready', function () {
    mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow = createMainWindow();


    
});