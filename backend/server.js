const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "gozcu-super-secure-secret-key-2024-change-in-production";

// Trust proxy (Nginx için gerekli - sadece bir proxy katmanı)
app.set("trust proxy", 1);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://gozcu.tech"],
    credentials: true,
  })
);

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://lvfvugeqesuaauxizsyz.supabase.co https://www.google-analytics.com https://analytics.google.com;"
  );
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
// Not: express-rate-limit trust proxy validation hatası veriyor
// Geçici olarak devre dışı bırakıldı - Nginx seviyesinde rate limiting kullanılabilir
// TODO: express-rate-limit güncellemesi veya alternatif çözüm
/*
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection.remoteAddress
    );
  },
});
app.use("/api/", limiter);
*/

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o700 });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeExt = path.extname(file.originalname).toLowerCase();
    const safeFilename = `file-${uniqueSuffix}${safeExt}`;
    cb(null, safeFilename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Sadece 1 dosya
  },
  fileFilter: (req, file, cb) => {
    // Güvenli dosya uzantıları
    const allowedExtensions = /\.(jpeg|jpg|png|gif|pdf|doc|docx)$/i;
    const allowedMimeTypes =
      /^(image\/(jpeg|jpg|png|gif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document))$/;

    const extname = allowedExtensions.test(file.originalname);
    const mimetype = allowedMimeTypes.test(file.mimetype);

    // Dosya adında zararlı karakterler var mı?
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
    const hasDangerousChars = dangerousChars.test(file.originalname);

    if (mimetype && extname && !hasDangerousChars) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Güvenli olmayan dosya türü! Sadece resim ve belge dosyaları yüklenebilir."
        )
      );
    }
  },
});

// Database connection
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Veritabanı bağlantı hatası:", err.message);
  } else {
    console.log("SQLite veritabanına bağlandı.");
  }
});

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    let completed = 0;
    const total = 6;

    const checkComplete = () => {
      completed++;
      if (completed === total) {
        // Create default admin user
        const hashedPassword = bcrypt.hashSync("Gozcu2024!Secure", 12);
        db.run(
          `
          INSERT OR IGNORE INTO users (username, email, password, role, permissions)
          VALUES ('admin', 'admin@gozcu.tech', ?, 'super_admin', '["all"]')
        `,
          [hashedPassword],
          (err) => {
            if (err) {
              console.error("Admin user creation error:", err);
            } else {
              console.log("✅ Admin user created");
            }
          }
        );

        // Insert default settings
        const defaultSettings = [
          ["general", "siteName", "Gözcu Yazılım Teknoloji AR-GE Ltd. Şti."],
          [
            "general",
            "siteDescription",
            "Modern, güvenilir ve ölçeklenebilir yazılım çözümleri.",
          ],
          ["contact", "email", "info@gozcu.tech"],
          ["contact", "phone", "+90 555 111 22 33"],
          ["contact", "address", "İstanbul, Türkiye"],
          ["social", "github", "https://github.com/gozcu"],
          ["social", "linkedin", "https://linkedin.com/company/gozcu"],
          ["analytics", "googleAnalyticsId", "GA_MEASUREMENT_ID"],
          ["stats", "totalProjects", "50"],
          ["stats", "totalBlogs", "8"],
          ["stats", "totalVisitors", "1247"],
          ["stats", "totalRevenue", "45600"],
        ];

        let settingsCompleted = 0;
        defaultSettings.forEach(([section, key, value]) => {
          db.run(
            `
            INSERT OR IGNORE INTO settings (section, key, value)
            VALUES (?, ?, ?)
          `,
            [section, key, value],
            (err) => {
              if (err) {
                console.error("Settings insertion error:", err);
              }
              settingsCompleted++;
              if (settingsCompleted === defaultSettings.length) {
                console.log("✅ Default settings inserted");
                resolve();
              }
            }
          );
        });
      }
    };

    // Users table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'editor',
        status TEXT DEFAULT 'active',
        permissions TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `,
      (err) => {
        if (err) {
          console.error("Users table error:", err);
          reject(err);
        } else {
          console.log("✅ Users table created");
          checkComplete();
        }
      }
    );

    // Blogs table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        category TEXT,
        author TEXT,
        status TEXT DEFAULT 'draft',
        read_time TEXT,
        featured_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error("Blogs table error:", err);
          reject(err);
        } else {
          console.log("✅ Blogs table created");
          checkComplete();
        }
      }
    );

    // Projects table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        project TEXT NOT NULL,
        description TEXT,
        category TEXT,
        year TEXT,
        duration TEXT,
        team TEXT,
        technologies TEXT DEFAULT '[]',
        features TEXT DEFAULT '[]',
        challenge TEXT,
        solution TEXT,
        result TEXT,
        logo TEXT,
        status TEXT DEFAULT 'planning',
        featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error("Projects table error:", err);
          reject(err);
        } else {
          console.log("✅ Projects table created");
          checkComplete();
        }
      }
    );

    // Settings table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(section, key)
      )
    `,
      (err) => {
        if (err) {
          console.error("Settings table error:", err);
          reject(err);
        } else {
          console.log("✅ Settings table created");

          // Plans table
          db.run(
            `
            CREATE TABLE IF NOT EXISTS plans (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT,
              price TEXT NOT NULL,
              period TEXT DEFAULT 'monthly',
              features TEXT DEFAULT '[]',
              popular BOOLEAN DEFAULT 0,
              button_text TEXT DEFAULT 'Seç',
              button_link TEXT,
              status TEXT DEFAULT 'active',
              sort_order INTEGER DEFAULT 0,
              plan_type TEXT DEFAULT 'web',
              server_type TEXT DEFAULT 'linux',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `,
            (err) => {
              if (err) {
                console.error("Plans table error:", err);
                reject(err);
              } else {
                console.log("✅ Plans table created");
                checkComplete();
              }
            }
          );
        }
      }
    );

    // Files table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        path TEXT NOT NULL,
        size INTEGER,
        mime_type TEXT,
        uploaded_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
      )
    `,
      (err) => {
        if (err) {
          console.error("Files table error:", err);
          reject(err);
        } else {
          console.log("✅ Files table created");
          checkComplete();
        }
      }
    );
  });
};

// Initialize database
initDatabase()
  .then(() => {
    console.log("✅ Database initialization completed");
  })
  .catch((err) => {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Erişim token'ı gerekli" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Geçersiz token" });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Authentication routes
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Kullanıcı adı ve şifre gerekli" });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND status = "active"',
    [username],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Veritabanı hatası" });
      }

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ error: "Kullanıcı adı veya şifre hatalı" });
      }

      // Update last login
      db.run("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", [
        user.id,
      ]);

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: JSON.parse(user.permissions),
        },
      });
    }
  );
});

app.post("/api/auth/logout", authenticateToken, (req, res) => {
  res.json({ message: "Başarıyla çıkış yapıldı" });
});

app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Users routes
app.get("/api/users", (req, res) => {
  const { search, role, status } = req.query;
  let query =
    "SELECT id, username, email, role, status, permissions, created_at, last_login FROM users";
  let params = [];
  let conditions = [];

  if (search) {
    conditions.push("(username LIKE ? OR email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (role && role !== "all") {
    conditions.push("role = ?");
    params.push(role);
  }

  if (status && status !== "all") {
    conditions.push("status = ?");
    params.push(status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası" });
    }
    res.json(
      users.map((user) => ({
        ...user,
        permissions: JSON.parse(user.permissions),
      }))
    );
  });
});

app.post("/api/users", authenticateToken, (req, res) => {
  const { username, email, password, role, status, permissions } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Kullanıcı adı, e-posta ve şifre gerekli" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    "INSERT INTO users (username, email, password, role, status, permissions) VALUES (?, ?, ?, ?, ?, ?)",
    [
      username,
      email,
      hashedPassword,
      role || "editor",
      status || "active",
      JSON.stringify(permissions || []),
    ],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res
            .status(400)
            .json({ error: "Kullanıcı adı veya e-posta zaten kullanılıyor" });
        }
        return res.status(500).json({ error: "Veritabanı hatası" });
      }
      res.json({ id: this.lastID, message: "Kullanıcı başarıyla oluşturuldu" });
    }
  );
});

// Blogs routes
app.get("/api/blog", (req, res) => {
  const { search, category, status } = req.query;
  let query = "SELECT * FROM blogs";
  let params = [];
  let conditions = [];

  if (search) {
    conditions.push("(title LIKE ? OR excerpt LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category && category !== "all") {
    conditions.push("category = ?");
    params.push(category);
  }

  if (status && status !== "all") {
    conditions.push("status = ?");
    params.push(status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, blogs) => {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası" });
    }
    res.json(blogs);
  });
});

app.post("/api/blog", authenticateToken, (req, res) => {
  const {
    title,
    excerpt,
    content,
    category,
    author,
    readTime,
    status,
    featured_image,
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Başlık ve içerik gerekli" });
  }

  db.run(
    "INSERT INTO blogs (title, excerpt, content, category, author, read_time, status, featured_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      title,
      excerpt,
      content,
      category,
      author,
      readTime,
      status || "draft",
      featured_image,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Veritabanı hatası" });
      }
      res.json({
        id: this.lastID,
        message: "Blog yazısı başarıyla oluşturuldu",
      });
    }
  );
});

app.put("/api/blog/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    title,
    excerpt,
    content,
    category,
    author,
    readTime,
    status,
    featured_image,
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Başlık ve içerik gerekli" });
  }

  db.run(
    "UPDATE blogs SET title = ?, excerpt = ?, content = ?, category = ?, author = ?, read_time = ?, status = ?, featured_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [
      title,
      excerpt,
      content,
      category,
      author,
      readTime,
      status || "draft",
      featured_image,
      id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Veritabanı hatası" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Blog yazısı bulunamadı" });
      }
      res.json({ message: "Blog yazısı başarıyla güncellendi" });
    }
  );
});

// Projects routes
app.get("/api/projects", (req, res) => {
  const { search, category, status } = req.query;
  let query = "SELECT * FROM projects";
  let params = [];
  let conditions = [];

  if (search) {
    conditions.push("(company LIKE ? OR project LIKE ? OR description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (category && category !== "all") {
    conditions.push("category = ?");
    params.push(category);
  }

  if (status && status !== "all") {
    conditions.push("status = ?");
    params.push(status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, projects) => {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası" });
    }
    res.json(
      projects.map((project) => ({
        ...project,
        technologies: JSON.parse(project.technologies),
        features: JSON.parse(project.features),
        featured: Boolean(project.featured),
      }))
    );
  });
});

app.post("/api/projects", authenticateToken, (req, res) => {
  const {
    company,
    project,
    description,
    category,
    year,
    duration,
    team,
    technologies,
    features,
    challenge,
    solution,
    result,
    logo,
    status,
  } = req.body;

  if (!company || !project) {
    return res.status(400).json({ error: "Şirket adı ve proje adı gerekli" });
  }

  db.run(
    "INSERT INTO projects (company, project, description, category, year, duration, team, technologies, features, challenge, solution, result, logo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      company,
      project,
      description,
      category,
      year,
      duration,
      team,
      JSON.stringify(technologies || []),
      JSON.stringify(features || []),
      challenge,
      solution,
      result,
      logo,
      status || "planning",
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Veritabanı hatası" });
      }
      res.json({ id: this.lastID, message: "Proje başarıyla oluşturuldu" });
    }
  );
});

// Settings routes
app.get("/api/settings", (req, res) => {
  db.all("SELECT section, key, value FROM settings", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası" });
    }

    const settings = {};
    rows.forEach((row) => {
      if (!settings[row.section]) {
        settings[row.section] = {};
      }
      settings[row.section][row.key] = row.value;
    });

    res.json(settings);
  });
});

app.put("/api/settings", authenticateToken, (req, res) => {
  const settings = req.body;

  const updatePromises = Object.keys(settings).map((section) => {
    return Object.keys(settings[section]).map((key) => {
      return new Promise((resolve, reject) => {
        db.run(
          "INSERT OR REPLACE INTO settings (section, key, value) VALUES (?, ?, ?)",
          [section, key, settings[section][key]],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });
  });

  Promise.all(updatePromises.flat())
    .then(() => {
      res.json({ message: "Ayarlar başarıyla güncellendi" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Veritabanı hatası" });
    });
});

// Plans routes
app.get("/api/plans", (req, res) => {
  const { status } = req.query;
  let query = "SELECT * FROM plans";
  let params = [];

  if (status && status !== "all") {
    query += " WHERE status = ?";
    params.push(status);
  }

  query += " ORDER BY sort_order ASC, created_at DESC";

  db.all(query, params, (err, plans) => {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası" });
    }
    res.json(
      plans.map((plan) => ({
        ...plan,
        features: JSON.parse(plan.features),
        popular: Boolean(plan.popular),
      }))
    );
  });
});

app.post("/api/plans", authenticateToken, (req, res) => {
  const {
    name,
    description,
    price,
    period,
    features,
    popular,
    button_text,
    button_link,
    status,
    sort_order,
    plan_type,
    server_type,
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Paket adı ve fiyat gereklidir" });
  }

  const featuresJson = JSON.stringify(features || []);
  const popularBool = popular ? 1 : 0;
  const sortOrder = sort_order || 0;

  db.run(
    `INSERT INTO plans (name, description, price, period, features, popular, button_text, button_link, status, sort_order, plan_type, server_type) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      description,
      price,
      period || "monthly",
      featuresJson,
      popularBool,
      button_text || "Seç",
      button_link,
      status || "active",
      sortOrder,
      plan_type || "web",
      server_type || "linux",
    ],
    function (err) {
      if (err) {
        console.error("Plan oluşturma hatası:", err);
        return res
          .status(500)
          .json({ error: "Veritabanı hatası: " + err.message });
      }
      res.json({
        id: this.lastID,
        message: "Paket başarıyla oluşturuldu",
      });
    }
  );
});

app.put("/api/plans/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    period,
    features,
    popular,
    button_text,
    button_link,
    status,
    sort_order,
    plan_type,
    server_type,
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Paket adı ve fiyat gereklidir" });
  }

  const featuresJson = JSON.stringify(features || []);
  const popularBool = popular ? 1 : 0;
  const sortOrder = sort_order || 0;

  db.run(
    `UPDATE plans SET 
     name = ?, description = ?, price = ?, period = ?, features = ?, 
     popular = ?, button_text = ?, button_link = ?, status = ?, sort_order = ?, 
     plan_type = ?, server_type = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [
      name,
      description,
      price,
      period || "monthly",
      featuresJson,
      popularBool,
      button_text || "Seç",
      button_link,
      status || "active",
      sortOrder,
      plan_type || "web",
      server_type || "linux",
      id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Veritabanı hatası" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Paket bulunamadı" });
      }
      res.json({ message: "Paket başarıyla güncellendi" });
    }
  );
});

app.delete("/api/plans/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM plans WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Veritabanı hatası" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Paket bulunamadı" });
    }
    res.json({ message: "Paket başarıyla silindi" });
  });
});

// File upload routes
app.post(
  "/api/files/upload",
  authenticateToken,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Dosya yüklenmedi" });
    }

    const { filename, originalname, path, size, mimetype } = req.file;

    db.run(
      "INSERT INTO files (filename, original_name, path, size, mime_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)",
      [filename, originalname, path, size, mimetype, req.user.id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Veritabanı hatası" });
        }
        res.json({
          id: this.lastID,
          filename,
          originalname,
          path,
          size,
          mimetype,
          message: "Dosya başarıyla yüklendi",
        });
      }
    );
  }
);

// File upload endpoint
app.post(
  "/api/upload",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Dosya yüklenmedi" });
    }

    res.json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  }
);

// Dashboard routes
app.get("/api/dashboard/stats", authenticateToken, (req, res) => {
  const stats = {};

  // Get counts
  db.get("SELECT COUNT(*) as count FROM blogs", (err, result) => {
    if (err) return res.status(500).json({ error: "Veritabanı hatası" });
    stats.totalBlogs = result.count;

    db.get("SELECT COUNT(*) as count FROM projects", (err, result) => {
      if (err) return res.status(500).json({ error: "Veritabanı hatası" });
      stats.totalProjects = result.count;

      db.get("SELECT COUNT(*) as count FROM users", (err, result) => {
        if (err) return res.status(500).json({ error: "Veritabanı hatası" });
        stats.totalUsers = result.count;

        res.json(stats);
      });
    });
  });
});

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Serve static files from dist directory (frontend build)
app.use(express.static(path.join(__dirname, "../dist")));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SPA routing - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't interfere with API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Sunucu hatası" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gözcu CMS Backend API ${PORT} portunda çalışıyor`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Sunucu kapatılıyor...");
  db.close((err) => {
    if (err) {
      console.error("Veritabanı kapatma hatası:", err.message);
    } else {
      console.log("✅ Veritabanı bağlantısı kapatıldı.");
    }
    process.exit(0);
  });
});
