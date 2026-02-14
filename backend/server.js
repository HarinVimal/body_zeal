require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// ================== MIDDLEWARE ==================
app.use(
  cors({
    origin: [
      process.env.CLIENT_ORIGIN_1 || "http://localhost:3000",
      process.env.CLIENT_ORIGIN_2 || "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// ================== ENSURE UPLOADS FOLDER ==================
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ================== STATIC UPLOADS ==================
app.use("/uploads", express.static(uploadDir));

// ================== DB ==================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Error:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected");
});

// ================== MULTER ==================
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

/* =================================================
   ================= ADMIN STATS ===================
   ================================================= */
app.get("/admin/stats", (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS total FROM reviews", (err, r1) => {
    if (err) return res.status(500).json({ error: "DB error" });
    stats.totalReviews = r1[0].total;

    db.query("SELECT COUNT(*) AS total FROM gallery", (err2, r2) => {
      if (err2) return res.status(500).json({ error: "DB error" });
      stats.images = r2[0].total;
      res.json(stats);
    });
  });
});

/* =================================================
   =========== ADMIN REVIEWS (RAW LIST) =============
   ================================================= */
app.get("/admin/reviews", (req, res) => {
  db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

/* =================================================
   =========== ADMIN REVIEWS ANALYTICS ===============
   ================================================= */
app.get("/admin/reviews/analytics", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS totalReviews,
      AVG(rating) AS avgRating,
      SUM(rating <= 2) AS flaggedReviews,
      SUM(rating = 5) AS r5,
      SUM(rating = 4) AS r4,
      SUM(rating = 3) AS r3,
      SUM(rating = 2) AS r2,
      SUM(rating = 1) AS r1
    FROM reviews
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Analytics error:", err);
      return res.status(500).json({ error: "Analytics failed" });
    }

    const r = result[0];

    const promoters = r.r4 + r.r5;
    const detractors = r.r1 + r.r2;
    const totalForNps = promoters + detractors;

    const nps =
      totalForNps === 0
        ? 0
        : Math.round(((promoters - detractors) / totalForNps) * 100);

    res.json({
      totalReviews: r.totalReviews || 0,
      avgRating: Number(r.avgRating) || 0,
      flaggedReviews: r.flaggedReviews || 0,
      nps,
      ratingDistribution: {
        5: r.r5 || 0,
        4: r.r4 || 0,
        3: r.r3 || 0,
        2: r.r2 || 0,
        1: r.r1 || 0,
      },
    });
  });
});

/* =================================================
   ================= ADMIN GALLERY =================
   ================================================= */
app.get("/admin/gallery", (req, res) => {
  db.query("SELECT * FROM gallery ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

app.post("/admin/gallery", upload.single("image"), (req, res) => {
  const { branch } = req.body;

  if (!req.file || !branch) {
    return res.status(400).json({ error: "Image and branch required" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  db.query(
    "INSERT INTO gallery (image_url, branch) VALUES (?, ?)",
    [imageUrl, branch],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload failed" });
      }

      res.json({
        id: result.insertId,
        image_url: imageUrl,
        branch,
      });
    }
  );
});

// DELETE GALLERY IMAGE
app.delete("/admin/gallery/:id", (req, res) => {
  const imageId = req.params.id;

  db.query("SELECT image_url FROM gallery WHERE id=?", [imageId], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (rows.length === 0)
      return res.status(404).json({ error: "Image not found" });

    const imagePath = path.join(__dirname, rows[0].image_url);

    db.query("DELETE FROM gallery WHERE id=?", [imageId], (err2) => {
      if (err2)
        return res.status(500).json({ error: "Delete failed" });

      // Delete file from uploads folder
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({ success: true });
    });
  });
});

/* =================================================
   ================= USER CONTACT ==================
   ================================================= */
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query(
    "INSERT INTO contact_messages (full_name,email,message) VALUES (?,?,?)",
    [name, email, message],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true });
    }
  );
});

/* =================================================
   ================= USER REVIEWS ==================
   ================================================= */
const bannedWords = ["spam", "scam", "fake", "abuse"];

function containsBannedWords(text) {
  const t = text.toLowerCase();
  return bannedWords.some((w) => t.includes(w));
}

function excessiveLinks(text) {
  return (text.match(/https?:\/\//g) || []).length > 1;
}

function excessiveEmojis(text) {
  return (text.match(/[\u{1F600}-\u{1F6FF}]/gu) || []).length > 5;
}

app.post("/api/reviews", (req, res) => {
  const { name, rating, message } = req.body;

  if (!name || !rating || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (
    rating <= 2 ||
    message.length < 20 ||
    containsBannedWords(message) ||
    excessiveLinks(message) ||
    excessiveEmojis(message)
  ) {
    return res.json({ success: true });
  }

  db.query(
    "INSERT INTO reviews (name, rating, message) VALUES (?,?,?)",
    [name, rating, message],
    (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true });
    }
  );
});

/* =================================================
   ================= USER GALLERY ==================
   ================================================= */
app.get("/gallery", (req, res) => {
  const { branch } = req.query;

  let sql = "SELECT * FROM gallery";
  let values = [];

  if (branch) {
    sql += " WHERE branch=?";
    values.push(branch);
  }

  sql += " ORDER BY created_at DESC";

  db.query(sql, values, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

/* =================================================
   ============== MEMBERSHIP PLANS =================
   ================================================= */
app.get("/membership", (req, res) => {
  db.query("SELECT * FROM membership_plans", (err, rows) => {
    if (err) {
      console.error("Membership fetch error:", err);
      return res.status(500).json({ error: "DB error" });
    }

    const data = {};
    rows.forEach((row) => {
      const memberships = Array.isArray(row.memberships)
        ? row.memberships
        : [];
      const addons = Array.isArray(row.addons) ? row.addons : [];
      data[row.branch] = { memberships, addons };
    });

    res.json(data);
  });
});

app.put("/admin/membership/:branch", (req, res) => {
  const { memberships, addons } = req.body;
  const branch = req.params.branch;

  if (!Array.isArray(memberships) || !Array.isArray(addons)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  db.query(
    `UPDATE membership_plans SET memberships=?, addons=? WHERE branch=?`,
    [JSON.stringify(memberships), JSON.stringify(addons), branch],
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ success: true });
    }
  );
});

app.post("/admin/membership", (req, res) => {
  const { branch, memberships, addons } = req.body;

  if (!branch || !Array.isArray(memberships) || !Array.isArray(addons)) {
    return res.status(400).json({ error: "Invalid data" });
  }

  db.query(
    "INSERT INTO membership_plans (branch, memberships, addons) VALUES (?, ?, ?)",
    [branch, JSON.stringify(memberships), JSON.stringify(addons)],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Insert failed" });
      res.json({ success: true, id: result.insertId });
    }
  );
});

/* =================================================
   ============ USER TESTIMONIALS ==================
   ================================================= */
app.get("/api/testimonials", (req, res) => {
  const sql = `
    SELECT id, name, rating, message, created_at
    FROM reviews
    WHERE rating >= 3
      AND LENGTH(message) > 20
    ORDER BY created_at DESC
    LIMIT 20
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Testimonials fetch error:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(rows);
  });
});

/* =================================================
   ================= PROGRAMS ======================
   ================================================= */

// GET ALL PROGRAMS WITH BRANCHES
app.get("/api/programs-with-branches", (req, res) => {
  db.query("SELECT * FROM programs ORDER BY id ASC", (err, programs) => {
    if (err) return res.status(500).json({ error: "DB error" });

    if (programs.length === 0) return res.json([]);

    const programIds = programs.map((p) => p.id);

    db.query(
      "SELECT * FROM program_branches WHERE program_id IN (?)",
      [programIds],
      (err2, branches) => {
        if (err2) return res.status(500).json({ error: "DB error" });

        const result = programs.map((p) => ({
          id: p.id,
          title: p.title,
          img: p.img,
          short_text: p.short_text,
          branches: branches
            .filter((b) => b.program_id === p.id)
            .map((b) => ({
              id: b.id,
              branch_name: b.branch_name,
              img: b.img,
              detailed_text: b.detailed_text,
            })),
        }));

        res.json(result);
      }
    );
  });
});

// ADD NEW PROGRAM WITH BRANCHES
app.post("/admin/programs", (req, res) => {
  const { title, img, short_text, branches } = req.body;

  if (!title || !Array.isArray(branches)) {
    return res.status(400).json({ error: "Title and branches required" });
  }

  db.query(
    "INSERT INTO programs (title, img, short_text) VALUES (?, ?, ?)",
    [title, img || null, short_text || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Insert program failed" });

      const programId = result.insertId;

      if (branches.length === 0)
        return res.json({ success: true, id: programId });

      const values = branches.map((b) => [
        programId,
        b.branch_name,
        b.img || null,
        b.detailed_text || null,
      ]);

      db.query(
        "INSERT INTO program_branches (program_id, branch_name, img, detailed_text) VALUES ?",
        [values],
        (err2) => {
          if (err2)
            return res.status(500).json({ error: "Insert branches failed" });
          res.json({ success: true, id: programId });
        }
      );
    }
  );
});

// UPDATE PROGRAM AND BRANCHES
app.put("/admin/programs/:id", (req, res) => {
  const programId = req.params.id;
  const { title, img, short_text, branches } = req.body;

  if (!title || !Array.isArray(branches)) {
    return res.status(400).json({ error: "Title and branches required" });
  }

  db.query(
    "UPDATE programs SET title=?, img=?, short_text=? WHERE id=?",
    [title, img || null, short_text || null, programId],
    (err) => {
      if (err)
        return res.status(500).json({ error: "Update program failed" });

      db.query(
        "DELETE FROM program_branches WHERE program_id=?",
        [programId],
        (err2) => {
          if (err2)
            return res
              .status(500)
              .json({ error: "Delete old branches failed" });

          if (branches.length === 0) return res.json({ success: true });

          const values = branches.map((b) => [
            programId,
            b.branch_name,
            b.img || null,
            b.detailed_text || null,
          ]);

          db.query(
            "INSERT INTO program_branches (program_id, branch_name, img, detailed_text) VALUES ?",
            [values],
            (err3) => {
              if (err3)
                return res
                  .status(500)
                  .json({ error: "Insert updated branches failed" });
              res.json({ success: true });
            }
          );
        }
      );
    }
  );
});

// DELETE PROGRAM
app.delete("/admin/programs/:id", (req, res) => {
  const programId = req.params.id;

  db.query("DELETE FROM programs WHERE id=?", [programId], (err) => {
    if (err) return res.status(500).json({ error: "Delete program failed" });
    res.json({ success: true });
  });
});
// DELETE SINGLE BRANCH
app.delete("/admin/programs/branch/:id", (req, res) => {
  const branchId = req.params.id;

  db.query(
    "DELETE FROM program_branches WHERE id=?",
    [branchId],
    (err) => {
      if (err) {
        console.error("Delete branch error:", err);
        return res.status(500).json({ error: "Delete branch failed" });
      }

      res.json({ success: true });
    }
  );
});


// ADD A NEW BRANCH TO AN EXISTING PROGRAM
app.post("/admin/programs/:id/branch", (req, res) => {
  const programId = req.params.id;
  const { branch_name, img, detailed_text } = req.body;

  if (!branch_name)
    return res.status(400).json({ error: "Branch name required" });

  db.query(
    "INSERT INTO program_branches (program_id, branch_name, img, detailed_text) VALUES (?, ?, ?, ?)",
    [programId, branch_name, img || null, detailed_text || null],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add branch" });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// ================= TRAINER APPLICATION =================
app.post("/api/trainers/apply", (req, res) => {
  const {
    name,
    email,
    phone,
    experience,
    specialization,
    message,
  } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !experience ||
    !specialization ||
    !message
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO trainer_applications
    (name, email, phone, experience, specialization, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, phone, experience, specialization, message],
    (err, result) => {
      if (err) {
        console.error("Trainer application error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "Application submitted successfully",
        id: result.insertId,
      });
    }
  );
});

// ADMIN: GET ALL TRAINER APPLICATIONS
app.get("/admin/trainers", (req, res) => {
  const sql = `
    SELECT id, name, email, phone, experience, specialization, message, status, created_at
    FROM trainer_applications
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch trainers error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ADMIN: UPDATE STATUS
app.put("/admin/trainers/:id/status", (req, res) => {
  const trainerId = req.params.id;
  const { status } = req.body;

  const validStatus = ["pending", "reviewed", "approved", "rejected"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.query(
    "UPDATE trainer_applications SET status=? WHERE id=?",
    [status, trainerId],
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ success: true });
    }
  );
});

// ================= SERVER ========================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
