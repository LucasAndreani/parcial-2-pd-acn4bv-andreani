import Database from "better-sqlite3";

// Crea o abre la base de datos SQLite
const db = new Database("database.sqlite");

// Crea la tabla de tareas si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );
`);

export default db;


