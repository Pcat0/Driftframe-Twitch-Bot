const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const _IconPath = path.join(__dirname, 'assets', 'icons');

var mainWindow;

app.on('ready', function () {
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow = createMainWindow();


    
});

function createMainWindow(){
    //TODO look into preload.js
    var window = new BrowserWindow({
        icon: path.join(_IconPath, 'icon1024.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });


    window.loadFile('assets/ui/main.html');

    //Quit app when closed
    window.on('close', app.quit);
    return window;
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