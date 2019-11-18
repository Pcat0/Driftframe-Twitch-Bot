const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const Queue = require('./src/js/queue.js');


const _IconPath = path.join(__dirname, 'assets', 'icons');
const _RendererPath = path.join(__dirname, 'src', 'renderer');

var mainWindow;
var terminalWindow;

//TODO: move in to module
var raceQueue = new Queue();
raceQueue.on("change", function (type, index, item){
    if(index < 10){
        mainWindow.webContents.send("update:queue", this.queue.slice(0, 10).map(el=>el.data));
    }
});

function Racer(tName, ign) {
    this.tName = tName;
    this.ign = ign;
}




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
    console.log(Queue);


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
            raceQueue.add(args[0], new Racer(args[0], args[1]));
            break;
        case "remove":
            raceQueue.splice(args[0], args[0]);
            updateQueue();
            break;
        default:
            break;
    }
    
});