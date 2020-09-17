// NodeJS modules can be used since nodeIntegration is enabled.
const { ipcRenderer, Notification } = require("electron");

text = document.querySelector("input");
buttonmp4 = document.getElementById("mp4");
buttonconverttomp3 = document.getElementById("converttomp3");

buttonmp4.addEventListener("click", () => {
   // Get text value
   val = text.value;

   // Send value to main.js
   ipcRenderer.send("download_mp4", val);
});

buttonconverttomp3.addEventListener("click", () => {
    val = text.value;

    ipcRenderer.send("converttomp3", val)
})