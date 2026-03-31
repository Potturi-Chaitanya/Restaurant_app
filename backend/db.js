const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./restaurant.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number TEXT,
      type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number TEXT,
    is_active INTEGER DEFAULT 1
  )
 `);

  db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    stock INTEGER DEFAULT 10,
    is_available INTEGER DEFAULT 1
  )
`);
  db.run(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER,
      item_name TEXT,
      price INTEGER,
      quantity INTEGER
    )
  `);
});

module.exports = db;
