const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DB

const db = new sqlite3.Database("./restaurant.db", (err) => {
  if (err) console.log("❌ DB Error:", err);
  else console.log("✅ Connected to SQLite DB");
});

module.exports = db;

// // ✅ CREATE TABLE + DEFAULT DATA
// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS tables (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       table_number INTEGER,
//       is_active INTEGER DEFAULT 1
//     )
//   `);

//   // insert default tables if empty
//   db.all("SELECT COUNT(*) as count FROM tables", (err, rows) => {
//     if (rows[0].count === 0) {
//       for (let i = 1; i <= 10; i++) {
//         db.run("INSERT INTO tables (table_number, is_active) VALUES (?, 1)", [
//           i,
//         ]);
//       }
//       console.log("✅ Default tables added");
//     }
//   });
// });

// // ✅ GET TABLES API
// app.get("/api/tables", (req, res) => {
//   db.all(
//     "SELECT * FROM tables WHERE is_active = 1 ORDER BY table_number",
//     (err, rows) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send(err);
//       }
//       res.json(rows);
//     },
//   );
// });

// // ✅ ADD MULTIPLE TABLES (SMART)
// app.post("/api/add-multiple-tables", (req, res) => {
//   const { count } = req.body;

//   db.all("SELECT * FROM tables", (err, rows) => {
//     const existing = rows.map((r) => r.table_number);

//     for (let i = 1; i <= count; i++) {
//       if (!existing.includes(i)) {
//         db.run("INSERT INTO tables (table_number, is_active) VALUES (?, 1)", [
//           i,
//         ]);
//       } else {
//         db.run("UPDATE tables SET is_active = 1 WHERE table_number = ?", [i]);
//       }
//     }

//     rows.forEach((t) => {
//       if (t.table_number > count) {
//         db.run("UPDATE tables SET is_active = 0 WHERE table_number = ?", [
//           t.table_number,
//         ]);
//       }
//     });

//     res.json({ message: "Tables updated" });
//   });
// });

// // // ✅ START SERVER
// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log("Server running on port", PORT);
// // });
