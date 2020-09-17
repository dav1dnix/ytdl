const { app, BrowserWindow, ipcMain, Notification } = require("electron");
require("electron-reload")(__dirname);

const { createWriteStream, existsSync } = require("fs");
const ytdl = require("ytdl-core");

const p = require("./drpc");
const { getInfo } = require("ytdl-core");
p.presence

const database = require("./db");
const db = database.db;

const { exec } = require("child_process");

const options = {
    width: 800,
    height: 600,
    center: true,
    icon: __dirname + "./icons/ytdl_icon.icns",
    webPreferences: {
        nodeIntegration: true,
        devTools: true
    },
};

function windowCreate() {
    const window = new BrowserWindow(options);

    window.loadFile("./web/index.html");
};

// Method is called when Electron has finished initialisation.
app.whenReady().then(windowCreate);

// Quit when windows are closed unless on macOS, where it it common that windows will stay active
// unless Cmd+Q is used.
app.on("window-all-closed", () => {
    // If OS is not macOS quit window
    if (process.platform !== "darwin") {
        app.quit();
    };
});

app.on("activate", () => {
    // If no windows, create window.
    if (BrowserWindow.getAllWindows().length === 0) {
        windowCreate();
    };
});

ipcMain.on("download_mp4", (event, arg) => {
    try {
        const title = ytdl.getInfo(arg).then((info) => {
            // Put execution mode into serialized, this means that at most only one statement obj can execute at a time.
            // Other statements wait in a queue until previous statements are executed.
            // Callbacks are called immediately
            db.serialize(() => {
                db.run("CREATE TABLE IF NOT EXISTS video_info (id int primary key, text title)");
                const stmt = db.prepare("INSERT INTO video_info VALUES (?, ?)");
                stmt.run(info.videoDetails.title);
                stmt.finalize();
            });
            db.close();
            return info.videoDetails.title;
        });

        title.then((t) => {
            ytdl(arg).pipe(createWriteStream(`${t.split(" ").join("")}.mp4`))
        });

    } catch (error) {
        console.error("Invalid URL", error)
    };
});

ipcMain.on("converttomp3", (event, arg) => {
    // After downloading, get video name from title. If video exists, convert video to mp3 using ffmpeg.
    // This will allow mp3 to actually work on macOS, it is not working with ytdl, really not sure why.
    if (existsSync(arg)) {
        exec(`ffmpeg -i ${arg} ${arg.split(".")[0]}.mp3`, (error, stdout, stderr) => {
        if (error) {
            console.log(error + error.code)
                return;
            }
            console.log(stdout)
            console.log(stderr)
        })
    }
})