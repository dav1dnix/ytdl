// NodeJS modules can be used since nodeIntegration is enabled.
const { ipcRenderer, Notification } = require("electron");

text = document.querySelector("input");
buttonmp3 = document.getElementById("mp3");
buttonmp4 = document.getElementById("mp4");

buttonmp3.addEventListener("click", () => {
    val = text.value;

    ipcRenderer.send("download_mp3", val);
})

buttonmp4.addEventListener("click", () => {
   // Get text value
   val = text.value;

   // Send value to main.js
   ipcRenderer.send("download_mp4", val);
});