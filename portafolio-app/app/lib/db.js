import Database from 'better-sqlite3';
import path from 'path';

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    // Utilizaremos un archivo de SQLite en la carpeta data/ para simplificar la persistencia
    const dbPath = process.env.DB_PATH || path.resolve(process.cwd(), 'data/database.sqlite');
    dbInstance = new Database(dbPath);

    dbInstance.pragma('journal_mode = WAL');

    // Inicializar tablas si no existen
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS materias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        file_url TEXT
      );

      CREATE TABLE IF NOT EXISTS asignaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        materia_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        file_url TEXT,
        parcial INTEGER DEFAULT 1,
        semana INTEGER DEFAULT 1,
        FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE CASCADE
      );
    `);

    // Migración para añadir columnas si no existen
    try { dbInstance.exec('ALTER TABLE materias ADD COLUMN file_url TEXT'); } catch(e) {}
    try { dbInstance.exec('ALTER TABLE asignaciones ADD COLUMN file_url TEXT'); } catch(e) {}
    try { dbInstance.exec('ALTER TABLE asignaciones ADD COLUMN parcial INTEGER DEFAULT 1'); } catch(e) {}
    try { dbInstance.exec('ALTER TABLE asignaciones ADD COLUMN semana INTEGER DEFAULT 1'); } catch(e) {}

    // Migración para actualizar la tabla si aún tiene el constraint CHECK
    const currentSchema = dbInstance.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='asignaciones'").get();
    if (currentSchema && currentSchema.sql.includes("CHECK(type")) {
      console.log('Migrando tabla asignaciones para eliminar restricciones...');
      dbInstance.transaction(() => {
        // 1. Renombrar tabla vieja
        dbInstance.exec('ALTER TABLE asignaciones RENAME TO asignaciones_old');
        
        // 2. Crear tabla nueva sin constraint
        dbInstance.exec(`
          CREATE TABLE asignaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            materia_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT,
            file_url TEXT,
            parcial INTEGER DEFAULT 1,
            FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE CASCADE
          )
        `);
        
        // 3. Copiar datos
        dbInstance.exec('INSERT INTO asignaciones (id, materia_id, type, title, description, date, file_url, parcial, semana) SELECT id, materia_id, type, title, description, date, file_url, parcial, COALESCE(semana, 1) FROM asignaciones_old');
        
        // 4. Borrar tabla vieja
        dbInstance.exec('DROP TABLE asignaciones_old');
      })();
      console.log('Migración completada con éxito.');
    }
  }
  return dbInstance;
}

// Creamos un Proxy para que actúe exactamente como el objeto de base de datos original.
// La conexión real solo se creará de forma "perezosa" (lazy) cuando se intente llamar a db.prepare(), db.exec(), etc.
const db = new Proxy({}, {
  get: function(target, prop) {
    return getDb()[prop];
  }
});

export default db;
