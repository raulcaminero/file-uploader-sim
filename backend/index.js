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

// Inicializar base de datos
initializeDatabase().then(() => {
  console.log('Base de datos inicializada');
}).catch((err) => {
  console.error('Error al inicializar base de datos:', err);
  process.exit(1);
});

// Endpoint para login (usuario hardcoded)
app.post('/api/login', (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Usuario hardcoded
    if (username === 'demo' && password === 'demo123') {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      });

      res.json({ success: true, token });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint para logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Sesión cerrada' });
});

// Endpoint para subir metadata de archivos (múltiples)
app.post('/api/upload', authenticateToken, async (req, res, next) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de archivos'
      });
    }

    // Validar cada archivo
    for (const file of files) {
      if (!file.name || typeof file.name !== 'string' || file.name.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Todos los archivos deben tener un nombre válido'
        });
      }
      if (!file.size || typeof file.size !== 'number' || file.size <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Todos los archivos deben tener un tamaño válido mayor a 0'
        });
      }
    }

    // Guardar cada archivo en la base de datos
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
        console.error('Error al insertar archivo:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Error al guardar metadata de archivos'
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

// Endpoint para listar archivos
app.get('/api/files', authenticateToken, async (req, res, next) => {
  try {
    const files = await dbAll(
      'SELECT id, name, size, uploaded_at FROM files ORDER BY uploaded_at DESC'
    );
    
    res.json({
      success: true,
      files: files.map(file => ({
        ...file,
        size: parseInt(file.size) // Asegurar que size sea número
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo de errores (debe ir al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
