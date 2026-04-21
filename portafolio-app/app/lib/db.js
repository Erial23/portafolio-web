import Database from 'better-sqlite3';
import path from 'path';

// Utilizaremos un archivo de SQLite en la raíz del proyecto para simplificar la persistencia
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Inicializar tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS asignaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materia_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('deber', 'examen')),
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE CASCADE
  );
`);

export default db;
