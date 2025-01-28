const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected WebSocket clients
const clients = new Set();

// Broadcast leaderboard updates to all connected clients
const broadcastLeaderboard = () => {
  db.all('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 5', (err, rows) => {
    if (err) {
      console.error('Error fetching leaderboard:', err);
      return;
    }
    const leaderboardData = JSON.stringify(rows);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(leaderboardData);
      }
    });
  });
};

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected');

  // Send initial leaderboard data
  broadcastLeaderboard();

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// GET /leaderboard - Fetch top 5 scores
app.get('/leaderboard', (req, res) => {
  db.all('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 5', (err, rows) => {
    if (err) {
      console.error('Error fetching leaderboard:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(rows);
  });
});

// POST /leaderboard - Add new score
app.post('/leaderboard', (req, res) => {
  const { nickname, score, level, timestamp } = req.body;

  if (!nickname || score === undefined || level === undefined || !timestamp) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Validate data types
  if (typeof score !== 'number' || typeof level !== 'number' || typeof timestamp !== 'number') {
    res.status(400).json({ error: 'Invalid data types for score, level, or timestamp' });
    return;
  }

  const stmt = db.prepare('INSERT INTO leaderboard (nickname, score, level, timestamp) VALUES (?, ?, ?, ?)');
  
  try {
    stmt.run(nickname, score, level, timestamp, function(err) {
      if (err) {
        console.error('Error adding leaderboard entry:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Fetch and return the updated leaderboard
      db.all('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 5', (err, rows) => {
        if (err) {
          console.error('Error fetching updated leaderboard:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        // Broadcast updated leaderboard to all clients
        const leaderboardData = JSON.stringify(rows);
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(leaderboardData);
          }
        });
        res.status(201).json(rows);
      });
    });
  } catch (err) {
    console.error('Error executing prepared statement:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    stmt.finalize();
  }

});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});