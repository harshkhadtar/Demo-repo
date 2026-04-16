const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// ✅ Create DB
const db = new sqlite3.Database('./new_database.sqlite', (err) => {
  if (err) {
    console.error('❌ DB Error:', err.message);
  } else {
    console.log('✅ Connected to SQLite');
  }
});

db.serialize(() => {

  // USERS
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

  // COMPLAINTS
db.run(`
  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    category TEXT,
    location TEXT,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'Pending',  -- ✅ MUST EXIST
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

  // 🔥 FORCE ADD COLUMN (VERY IMPORTANT)
db.run(`ALTER TABLE complaints ADD COLUMN status TEXT DEFAULT 'Pending'`, (err) => {
  if (err) {
    console.log("ℹ️ status column may already exist");
  } else {
    console.log("✅ status column added");
  }
});

  // ANNOUNCEMENTS
db.run(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    type TEXT,
    title TEXT,
    body TEXT,
    media_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

  // ✅ Default Admin
  db.get(
    'SELECT id FROM users WHERE email = ?',
    ['admin@lonere.gov'],
    (err, row) => {
      if (!row) {
        const hash = bcrypt.hashSync('admin123', 10);

        db.run(
          "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
          ['Admin', 'admin@lonere.gov', hash],
          () => console.log('✅ Admin created')
        );
      }
    }
  );

});

module.exports = db;
