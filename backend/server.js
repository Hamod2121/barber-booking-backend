// لازم أول سطر
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

// ===== Admin Key (من env) =====
const ADMIN_KEY = process.env.ADMIN_KEY;
if (!ADMIN_KEY) {
  throw new Error("Missing ADMIN_KEY in environment variables");
}

const app = express();
app.use(cors());
app.use(express.json());

// ===== Database =====
const path = require("path");

const DB_PATH =
  process.env.SQLITE_DB_PATH || path.join(__dirname, "bookings.db");

const db = new sqlite3.Database(DB_PATH);


// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    service TEXT,
    date TEXT,
    time TEXT
  )
`);

// ===== Logger (بدون طباعة الرمز) =====
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Backend is running ✅ Try /bookings");
});

// ===== Save booking (Public) =====
app.post("/bookings", (req, res) => {
  const { name, phone, service, date, time } = req.body;

  db.run(
    "INSERT INTO bookings (name, phone, service, date, time) VALUES (?,?,?,?,?)",
    [name, phone, service, date, time],
    function (err) {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// ===== Admin Middleware =====
function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// ===== Get all bookings (Protected) =====
app.get("/bookings", requireAdmin, (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});

// ===== Delete booking by id (Protected) =====
app.delete("/bookings/:id", requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM bookings WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ message: "DB error" });

    if (this.changes === 0) {
      return res.status(404).json({ message: "Booking not found", id });
    }

    res.json({ success: true, deleted: this.changes, id });
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    path: req.path,
  });
});

// ===== Listen (محلي + نشر) =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});

