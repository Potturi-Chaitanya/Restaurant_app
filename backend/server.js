const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

/* Save Order */
app.post("/save-order", (req, res) => {
  const { table, type, cart } = req.body;

  db.run(
    `INSERT INTO bills (table_number, type) VALUES (?, ?)`,
    [table, type],
    function (err) {
      if (err) return res.status(500).send(err);

      const billId = this.lastID;

      cart.forEach((item) => {
        db.run(
          `INSERT INTO cart_items (bill_id, item_name, price, quantity)
           VALUES (?, ?, ?, ?)`,
          [billId, item.name, item.price, item.qty],
        );
      });

      res.send({ message: "Order saved", billId });
    },
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});

/* Get Report */
app.get("/report", (req, res) => {
  db.all(
    `
    SELECT item_name, SUM(quantity) as total_sold
    FROM cart_items
    GROUP BY item_name
  `,
    (err, rows) => {
      if (err) return res.status(500).send(err);
      res.send(rows);
    },
  );
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});

// Add table
app.post("/add-table", (req, res) => {
  const { table_number } = req.body;

  db.run(
    "INSERT INTO tables (table_number) VALUES (?)",
    [table_number],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Table added" });
    },
  );
});

// Get tables
app.get("/tables", (req, res) => {
  db.all(
    "SELECT * FROM tables ORDER BY CAST(table_number AS INTEGER)",
    (err, rows) => {
      if (err) return res.status(500).send(err);
      res.send(rows); // MUST be array
    },
  );
});

// Add Item
app.post("/add-item", (req, res) => {
  const { name, price } = req.body;

  db.run("INSERT INTO items (name, price) VALUES (?, ?)", [name, price], () =>
    res.send({ message: "Item added" }),
  );
});

// Get Items
app.get("/items", (req, res) => {
  db.all("SELECT * FROM items WHERE is_available = 1", (err, rows) => {
    res.send(rows);
  });
});

// ✅ Create multiple
app.post("/add-multiple-tables", (req, res) => {
  const { count } = req.body;

  db.all("SELECT * FROM tables", (err, rows) => {
    if (err) return res.status(500).send(err);

    const existing = rows.map((r) => parseInt(r.table_number));

    // ✅ Add missing tables
    for (let i = 1; i <= count; i++) {
      if (!existing.includes(i)) {
        db.run("INSERT INTO tables (table_number, is_active) VALUES (?, 1)", [
          i,
        ]);
      } else {
        // ensure active if within range
        db.run("UPDATE tables SET is_active = 1 WHERE table_number = ?", [i]);
      }
    }

    // ✅ Disable extra tables
    rows.forEach((t) => {
      const num = parseInt(t.table_number);

      if (num > count) {
        db.run("UPDATE tables SET is_active = 0 WHERE table_number = ?", [num]);
      }
    });

    res.send({ message: "Tables updated with smart logic" });
  });
});
// Toggle table active/inactive
app.post("/toggle-table", (req, res) => {
  const { id, is_active } = req.body;

  db.run(
    "UPDATE tables SET is_active = ? WHERE id = ?",
    [is_active, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Table updated" });
    },
  );
});

// toggle item
app.post("/toggle-item", (req, res) => {
  const { id, is_available } = req.body;

  db.run(
    "UPDATE items SET is_available = ? WHERE id = ?",
    [is_available, id],
    () => res.send({ message: "updated" }),
  );
});

// 📊 REPORTS API
app.get("/api/reports", (req, res) => {
  db.all(
    `
    SELECT 
      COUNT(*) as total_orders,
      SUM(total_amount) as total_revenue
    FROM orders
  `,
    [],
    (err, result) => {
      if (err) return res.status(500).json(err);

      db.all(
        `
      SELECT item_name, SUM(qty) as total_sold
      FROM order_items
      GROUP BY item_name
    `,
        [],
        (err2, items) => {
          if (err2) return res.status(500).json(err2);

          res.json({
            summary: result[0],
            items,
          });
        },
      );
    },
  );
});

// ================= REPORTS API =================
app.get("/api/reports", (req, res) => {
  db.all(
    `
    SELECT COUNT(*) as total_orders,
           SUM(total_amount) as total_revenue
    FROM orders
  `,
    [],
    (err, result) => {
      if (err) {
        console.log("ERROR:", err);
        return res.status(500).json(err);
      }

      db.all(
        `
      SELECT item_name, SUM(qty) as total_sold
      FROM order_items
      GROUP BY item_name
    `,
        [],
        (err2, items) => {
          if (err2) {
            console.log("ERROR2:", err2);
            return res.status(500).json(err2);
          }

          res.json({
            summary: result[0] || {},
            items: items || [],
          });
        },
      );
    },
  );
});
