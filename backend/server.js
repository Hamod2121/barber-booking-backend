// dotenv للّوكال فقط (Railway يقرأ Variables مباشرة)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();

// ✅ Railway يعطيك PORT
const PORT = process.env.PORT || 5000;

// ✅ Origins المسموح بها (محلي)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const corsOptions = {
  origin: (origin, cb) => {
    // يسمح للطلبات بدون origin (مثل Postman / health checks)
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) return cb(null, true);

    // رفض بدل ما يطيّح السيرفر
    return cb(null, false);
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-admin-key"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ preflight لكل المسارات (تجنب مشكلة "*")
app.options(/.*/, cors(corsOptions));

// ✅ Admin Key من variables
const ADMIN_KEY = process.env.ADMIN_KEY;
if (!ADMIN_KEY) throw new Error("Missing ADMIN_KEY in environment variables");

// ✅ DB Path (على Railway تقدر تستخدم Volume)
const DB_PATH = process.env.SQLITE_DB_PATH || "./bookings.db";

// تأكد إن مجلد قاعدة البيانات موجود
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
