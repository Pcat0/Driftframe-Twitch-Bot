const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');


const _IconPath = path.join(__dirname, 'assets', 'icons');
const _RendererPath = path.join(__dirname, 'src', 'renderer');

var mainWindow;
var terminalWindow;

//TODO: move in to module
var raceQueue = [];
function add(racer) {
    raceQueue.push(racer);
    console.log(raceQueue)
    updateQueue();
}
//TODO: unhack
function updateList() {
    mainWindow.webContents.send("updateList", raceQueue.slice(0, 4));
}

function updateQueue() {
    mainWindow.webContents.send("update:queue", raceQueue.slice(0, 10));
}

function Racer(tName, ign) {
    this.tName = tName;
    this.ign = ign;
}

ipcMain.on("queue:next", function (event) {
    event.reply("updateList", raceQueue.slice(0, 4));
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
    {//TODO: Hide dev tools when in production
        label: 'Developer Tools',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle Terminal',
                accelerator: "Ctrl+T",
                click: toggleTermalWindow
            },
            {
                label: 'Toggle DevTools',
                accelerator: 'Ctrl+I',
                click(item, focusedWindow) {
                    if (!focusedWindow.isDevToolsOpened()) {
                        focusedWindow.openDevTools({ mode: 'detach' });
                    } else {
                        focusedWindow.closeDevTools();
                    }
                }
            }
        ]
    }
];



function createMainWindow() {
    //TODO look into preload.js
    var window = new BrowserWindow({
        icon: path.join(_IconPath, 'icon1024-gray.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });


    window.loadFile(path.join(_RendererPath, "main.html"));

    //Quit app when closed
    window.on('close', app.quit);
    return window;
}


app.on('ready', function () {

    mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow = createMainWindow();
    


});


//DEV
function toggleTermalWindow() {
    if (terminalWindow == null) {
        terminalWindow = new BrowserWindow({
            width: 400,
            height: 50,
            useContentSize: true,
            icon: path.join(_IconPath, 'icon1024-gray.png'),
            parent: mainWindow,
            webPreferences: {
                nodeIntegration: true
            }
        });
        terminalWindow.setMenu(null);

        terminalWindow.on('closed', () => {
            terminalWindow = null;
        });
        terminalWindow.loadFile(path.join(_RendererPath, "terminal.html"));
    } else {
        terminalWindow.close();
    }
}
ipcMain.on('term:line', function(event, line){
    var [command, ...args] = line.split(' ');
    switch (command) {
        case "add":
            add(new Racer(args[0], args[1]));
            break;
        case "remove":
            raceQueue.splice(args[0], args[0]);
            updateQueue();
            break;
        default:
            break;
    }
    
});