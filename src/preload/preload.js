const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myApi", {
  add: async (data) => await ipcRenderer.invoke("add", data),
  selectFile: async () => await ipcRenderer.invoke("selectFile"),
  importExcel: async (path) => await ipcRenderer.invoke("importExcel", path),
  getKarmands: async () => await ipcRenderer.invoke("getKarmands"),
  removeKarmand: async (id) => await ipcRenderer.invoke("removeKarmand", id),
  getKarmand: async (id) => await ipcRenderer.invoke("getKarmand", id),
  desToKarmand: async (data) => await ipcRenderer.invoke("desToKarmand", data),
  changeSalary: async (data) => await ipcRenderer.invoke("changeSalary", data),
  changeStatus: async (data) => await ipcRenderer.invoke("changeStatus", data),
  search: async (search) => await ipcRenderer.invoke("search", search),
  editKarmand: async ({ id, data }) =>
    await ipcRenderer.invoke("editKarmand", { id, data }),
  sendMail: async (data) => await ipcRenderer.invoke("sendMail", data),
  exportCsv: async () => await ipcRenderer.invoke("exportCsv"),
  amar: async () => await ipcRenderer.invoke("amar"),
});

ipcRenderer.on("back", () => {
  console.log("back");
  history.back();
});
