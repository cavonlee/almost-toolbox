
const { contextBridge, ipcRenderer } = require("electron");


ipcRenderer.on('onSerialDeviceFound', (e, arg) => {
  const event = new CustomEvent('onSerialDeviceFound', { detail: arg });
  document.dispatchEvent(event);
});

document.addEventListener("onSelectedSerialDevice", (event) => {
  let id = event.detail;
  ipcRenderer.send("onSelectedSerialDevice", id);
});

document.addEventListener("onCanceledSerialDevice", (event) => {
  let error = event.detail;
  ipcRenderer.send("onCanceledSerialDevice", error);
});
