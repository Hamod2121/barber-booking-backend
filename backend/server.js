require("dotenv").config(); // أول سطر (للـ local فقط)

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Railway يعطيك PORT جاهز
const PORT = process.env.PORT || 5000;

// ✅ Admin Key من variables
const ADMIN_KEY = process.env.ADMIN_KEY;
if (!ADMIN_KEY) throw new Error("Missing ADMIN_KEY in environment variables");

// ✅ DB Path (على Railway نستخدم Volume)
const DB_PATH = process.env.SQLITE_DB_PATH || "./bookings.db";

// تأكد إن مجلد /data موجود (للوكال + الرايلوي)
const dir = path.dirname(DB_PATH);
if (dir && dir !== "." && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Database
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

function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) return res.status(401).json({ message: "Unauthorized" });
  next();
}

app.get("/", (req, res) => res.send("Backend is running ✅ Try /bookings"));

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

app.get("/bookings", requireAdmin, (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(rows);
  });
});

app.delete("/bookings/:id", requireAdmin, (req, res) => {
  db.run("DELETE FROM bookings WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: "DB error" });
    if (this.changes === 0) return res.status(404).json({ message: "Booking not found" });
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log("Running on port:", PORT));
