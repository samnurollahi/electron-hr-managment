const electron = require("electron");

//! database config
const db = require("./config/db");

//? window
const mainWindow = require("./windows/mainWindow");

//? handler
require("./handler/mainHandler");

electron.app
  .whenReady()
  .then(() => {
    mainWindow();
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("app is ready!");
  });

db.sync().then(() => {
  console.log("db connected");
});
