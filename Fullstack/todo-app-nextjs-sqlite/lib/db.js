import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'tasks.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        text    TEXT    NOT NULL,
        done    INTEGER NOT NULL DEFAULT 0,
        created INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);
  }
  return db;
}

export const taskQueries = {
  getAll:  ()         => getDb().prepare('SELECT * FROM tasks ORDER BY created DESC').all(),
  insert:  (text)     => getDb().prepare('INSERT INTO tasks (text) VALUES (?)').run(text),
  toggle:  (id, done) => getDb().prepare('UPDATE tasks SET done = ? WHERE id = ?').run(done, id),
  delete:  (id)       => getDb().prepare('DELETE FROM tasks WHERE id = ?').run(id),
  clearDone: ()       => getDb().prepare('DELETE FROM tasks WHERE done = 1').run(),
};
