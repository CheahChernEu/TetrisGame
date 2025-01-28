const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ensure the data directory exists
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, 'data', 'tetris.db');

// Ensure the data directory exists
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create and initialize the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to the SQLite database.');

    // Create tables
    db.serialize(() => {
        // Create leaderboard table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            level INTEGER NOT NULL,
            lines_cleared INTEGER NOT NULL,
            game_mode TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
                return;
            }
            console.log('Database initialized successfully');
        });
    });
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
        return;
    }
    console.log('Database connection closed.');
});