require("dotenv").config();
const client = require("discord-rich-presence")(process.env.DISCORD_CLIENT_ID);

exports.presence = client.updatePresence({
    state: "Using YTDL",
    details: "test",
    startTimestamp: Date.now(),
    largeImageKey: "ytdl_logo",
});