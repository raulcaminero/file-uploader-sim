import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { initializeDatabase, dbRun, dbAll } from './database.js';
import { authenticateToken, JWT_SECRET } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Initialize database
initializeDatabase().then(() => {
  console.log('Database initialized');
}).catch((err) => {
  console.error('Error initializing database:', err);
  process.exit(1);
});

// Login endpoint (hardcoded user)
app.post('/api/login', (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Hardcoded user
    if (username === 'demo' && password === 'demo123') {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json({ success: true, token });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    next(error);
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Session closed' });
});

// Upload file metadata endpoint (multiple files)
app.post('/api/upload', authenticateToken, async (req, res, next) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Files array is required'
      });
    }

    // Validate each file
    for (const file of files) {
      if (!file.name || typeof file.name !== 'string' || file.name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'All files must have a valid name'
        });
      }
      if (!file.size || typeof file.size !== 'number' || file.size <= 0) {
        return res.status(400).json({
          success: false,
          message: 'All files must have a valid size greater than 0'
        });
      }
    }

    // Save each file to the database
    const insertedFiles = [];
    for (const file of files) {
      try {
        const result = await dbRun(
          'INSERT INTO files (name, size) VALUES (?, ?)',
          [file.name.trim(), file.size]
        );
        insertedFiles.push({
          id: result.lastID,
          name: file.name.trim(),
          size: file.size
        });
      } catch (dbError) {
        console.error('Error inserting file:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Error saving file metadata'
        });
      }
    }

    res.json({
      success: true,
      files: insertedFiles,
      count: insertedFiles.length
    });
  } catch (error) {
    next(error);
  }
});

// List files endpoint
app.get('/api/files', authenticateToken, async (req, res, next) => {
  try {
    const files = await dbAll(
      'SELECT id, name, size, uploaded_at FROM files ORDER BY uploaded_at DESC'
    );
    
    res.json({
      success: true,
      files: files.map(file => ({
        ...file,
        size: parseInt(file.size) // Ensure size is a number
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Handle routes not found
app.use(notFoundHandler);

// Error handling (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
