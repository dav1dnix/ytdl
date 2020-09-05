const { Database } = require("sqlite3").verbose();
exports.db = new Database("ytdl.db");