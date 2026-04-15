const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../database/app.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to SQLite database.');
});

// Create tables
db.serialize(() => {

  // ✅ FIRST create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      type TEXT DEFAULT 'text',
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      media_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 🔥 THEN delete users (AFTER table exists)
  db.run("DELETE FROM users");
  console.log("🔥 All users deleted");

  // Check admin exists
  db.get(
    'SELECT id FROM users WHERE email = ?',
    ['admin@lonere.gov'],
    (err, row) => {
      if (!row) {
        const hash = bcrypt.hashSync('admin123', 10);
        db.run(
          "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
          ['Admin', 'admin@lonere.gov', hash],
          () => {
            console.log('✅ Default admin created');
          }
        );
      }
    }
  );
});
module.exports = db;
