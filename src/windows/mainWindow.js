const path = require("path");

const electron = require("electron");

const Karmand = require("../models/Karmand");

let mainWindow = null;
const mainMenu = new electron.Menu.buildFromTemplate([
  {
    label: "back",
    click: () => mainWindow.webContents.send("back"),
  },
  {
    role: "quit",
  },
  {
    role: "toggleDevTools",
  },
]);

module.exports = async () => {
  mainWindow = new electron.BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
    },
  });

  // !electron.app.isPackaged && mainWindow.webContents.openDevTools();
  mainWindow.setMenu(mainMenu);
  mainWindow.loadFile("./views/index.html");

  //? check kardan tarikh tavalod karmandan
  const now = new Date();
  const karmand = await Karmand.findAll();

  karmand.forEach(({ dataValues }) => {
    console.log(dataValues);
    if (
      now.getFullYear() == dataValues.dateOfBirth.getFullYear() &&
      now.getMonth() == dataValues.dateOfBirth.getMonth() &&
      now.getDay() == dataValues.dateOfBirth.getDay()
    ) {
      new electron.Notification({
        silent: true,
        title: `تبریک عرض میکنم امروز تولد آقا/خانم ${dataValues.name} است`,
      }).show();
    }
  });
};
