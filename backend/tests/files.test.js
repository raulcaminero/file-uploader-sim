import sqlite3 from 'sqlite3';
import { dbRun, dbAll, initializeDatabase } from '../database.js';

// Mock de la base de datos en memoria para pruebas
let testDb;

beforeAll(async () => {
  // Crear base de datos en memoria para pruebas
  testDb = new sqlite3.Database(':memory:');
  
  // Promesas para métodos de la base de datos de prueba
  const testDbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      testDb.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };

  const testDbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      testDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  // Inicializar tabla
  await testDbRun(
    `CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      size INTEGER NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );

  // Reemplazar temporalmente las funciones del módulo database
  // Esto es una aproximación simplificada - en producción usarías un mock más robusto
  global.testDbRun = testDbRun;
  global.testDbAll = testDbAll;
});

afterAll((done) => {
  if (testDb) {
    testDb.close(done);
  } else {
    done();
  }
});

describe('Files Database Tests', () => {
  beforeEach(async () => {
    // Limpiar tabla antes de cada test
    await global.testDbRun('DELETE FROM files');
  });

  test('should insert a file metadata', async () => {
    const result = await global.testDbRun(
      'INSERT INTO files (name, size) VALUES (?, ?)',
      ['test-file.txt', 1024]
    );

    expect(result.lastID).toBeGreaterThan(0);
    expect(result.changes).toBe(1);
  });

  test('should retrieve all files', async () => {
    // Insertar algunos archivos
    await global.testDbRun(
      'INSERT INTO files (name, size) VALUES (?, ?)',
      ['file1.txt', 1024]
    );
    await global.testDbRun(
      'INSERT INTO files (name, size) VALUES (?, ?)',
      ['file2.txt', 2048]
    );

    const files = await global.testDbAll('SELECT * FROM files ORDER BY id');

    expect(files).toHaveLength(2);
    expect(files[0].name).toBe('file1.txt');
    expect(files[0].size).toBe(1024);
    expect(files[1].name).toBe('file2.txt');
    expect(files[1].size).toBe(2048);
  });

  test('should handle file with large size', async () => {
    const largeSize = 1024 * 1024 * 100; // 100 MB
    const result = await global.testDbRun(
      'INSERT INTO files (name, size) VALUES (?, ?)',
      ['large-file.zip', largeSize]
    );

    const files = await global.testDbAll('SELECT * FROM files WHERE id = ?', [result.lastID]);
    
    expect(files).toHaveLength(1);
    expect(files[0].size).toBe(largeSize);
  });

  test('should include uploaded_at timestamp', async () => {
    const result = await global.testDbRun(
      'INSERT INTO files (name, size) VALUES (?, ?)',
      ['test.txt', 512]
    );

    const files = await global.testDbAll('SELECT * FROM files WHERE id = ?', [result.lastID]);
    
    expect(files[0].uploaded_at).toBeDefined();
    expect(new Date(files[0].uploaded_at).getTime()).toBeGreaterThan(0);
  });

  test('should handle special characters in filename', async () => {
    const specialName = 'test-file (1) - copia.txt';
    const result = await global.testDbRun(
      'INSERT INTO files (name, size) VALUES (?, ?)',
      [specialName, 256]
    );

    const files = await global.testDbAll('SELECT * FROM files WHERE id = ?', [result.lastID]);
    
    expect(files[0].name).toBe(specialName);
  });
});
