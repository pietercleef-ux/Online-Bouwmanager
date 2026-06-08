// =========================
// server.js - Backend API
// Online Bouwmanager 2026
// =========================

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// =========================
// DATABASE SETUP
// =========================

const dbPath = path.join(__dirname, 'bouwmanager.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database error:', err);
    else console.log('Connected to SQLite database');
});

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Projects table
    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            budget REAL,
            region TEXT,
            data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);
});

// =========================
// HELPER: VERIFY JWT
// =========================

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
}

// =========================
// AUTH ENDPOINTS
// =========================

// REGISTER
app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
        [email, hashedPassword, name || 'User'],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Registration failed' });
            }

            const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ 
                message: 'Registration successful',
                token,
                user: { id: this.lastID, email, name: name || 'User' }
            });
        }
    );
});

// LOGIN
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        (err, user) => {
            if (err || !user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const passwordMatch = bcrypt.compareSync(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ 
                message: 'Login successful',
                token,
                user: { id: user.id, email: user.email, name: user.name }
            });
        }
    );
});

// VERIFY TOKEN (test endpoint)
app.get('/api/auth/verify', verifyToken, (req, res) => {
    res.json({ message: 'Token is valid', userId: req.userId });
});

// =========================
// PROJECT ENDPOINTS
// =========================

// GET ALL PROJECTS FOR USER
app.get('/api/projects', verifyToken, (req, res) => {
    db.all(
        `SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC`,
        [req.userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows || []);
        }
    );
});

// GET SINGLE PROJECT
app.get('/api/projects/:id', verifyToken, (req, res) => {
    db.get(
        `SELECT * FROM projects WHERE id = ? AND user_id = ?`,
        [req.params.id, req.userId],
        (err, row) => {
            if (err || !row) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json(row);
        }
    );
});

// CREATE PROJECT
app.post('/api/projects', verifyToken, (req, res) => {
    const { name, budget, region, data } = req.body;

    db.run(
        `INSERT INTO projects (user_id, name, budget, region, data) VALUES (?, ?, ?, ?, ?)`,
        [req.userId, name || 'Nieuw Project', budget || 0, region || 'Zuid', data || '[]'],
        function(err) {
            if (err) return res.status(500).json({ error: 'Failed to create project' });
            res.status(201).json({ 
                id: this.lastID,
                user_id: req.userId,
                name: name || 'Nieuw Project',
                budget: budget || 0,
                region: region || 'Zuid',
                data: data || '[]',
                created_at: new Date().toISOString()
            });
        }
    );
});

// UPDATE PROJECT
app.put('/api/projects/:id', verifyToken, (req, res) => {
    const { name, budget, region, data } = req.body;

    db.run(
        `UPDATE projects SET name = ?, budget = ?, region = ?, data = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? AND user_id = ?`,
        [name, budget, region, data, req.params.id, req.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Failed to update project' });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json({ message: 'Project updated successfully' });
        }
    );
});

// DELETE PROJECT
app.delete('/api/projects/:id', verifyToken, (req, res) => {
    db.run(
        `DELETE FROM projects WHERE id = ? AND user_id = ?`,
        [req.params.id, req.userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Failed to delete project' });
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json({ message: 'Project deleted successfully' });
        }
    );
});

// =========================
// ERROR HANDLING
// =========================

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
