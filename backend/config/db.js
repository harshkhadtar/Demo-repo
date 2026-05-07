const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// ✅ Create DB
const db = new sqlite3.Database('./app.db', (err) => {
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
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending','Rejected','In Progress','Completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER,
    type TEXT,
    title TEXT,
    body TEXT,
    media_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Seed default admin account if not exists (password: admin123)
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@lonere.gov');
if (!existing) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')")
        .run('Admin', 'admin@lonere.gov', hash);
    console.log('✅ Default admin created: admin@lonere.gov / admin123');
}

module.exports = db;
