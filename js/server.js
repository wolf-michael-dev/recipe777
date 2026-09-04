// Füge dies zu deinem db.exec() Block in der server.js hinzu:
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      icon TEXT,
      color TEXT
    )
  `);

// Neuer Endpunkt: GET /api/categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await db.all("SELECT * FROM categories");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Laden der Kategorien" });
  }
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ordner für Bild-Uploads statisch bereitstellen
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

// Multer-Konfiguration für Bilder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

let db;

// Datenbank & Tabellen initialisieren
async function initDB() {
  db = await open({
    filename: path.join(__dirname, "recipes.db"),
    driver: sqlite3.Database,
  });

  // Tabellen für Kategorien & Rezepte
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      icon TEXT,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      prepTime INTEGER,
      portions INTEGER DEFAULT 4,
      category TEXT,
      imageUrl TEXT,
      ingredients TEXT,
      instructions TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Standard-Kategorien einfügen, falls leer
  const catCount = await db.get("SELECT COUNT(*) as count FROM categories");
  if (catCount.count === 0) {
    await db.run(
      `INSERT INTO categories (id, title, icon, color) VALUES 
      ('mains', 'Hauptgerichte', '🍴', '#f59e0b'),
      ('soups', 'Suppen & Eintöpfe', '🥣', '#ef4444'),
      ('seafood', 'Fisch & Meeresfrüchte', '🐟', '#0fb8cc'),
      ('salads', 'Salate', '🥗', '#22c55e'),
      ('baking', 'Gebäck & Desserts', '🍰', '#ec4899')`
    );
    console.log("-> Standard-Kategorien angelegt.");
  }

  // Erstes Test-Rezept einfügen, falls leer
  const recipeCount = await db.get("SELECT COUNT(*) as count FROM recipes");
  if (recipeCount.count === 0) {
    await db.run(
      `INSERT INTO recipes (title, prepTime, portions, category, imageUrl, ingredients, instructions) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "Traditioneller Borschtsch",
        45,
        4,
        "soups",
        null,
        JSON.stringify(["500g Rote Bete", "300g Weißkohl", "3 Kartoffeln", "1 Zwiebel", "Schmand zum Servieren"]),
        JSON.stringify([
          { title: "Gemüse vorbereiten", text: "Rote Bete und Kartoffeln schälen und in feine Streifen schneiden." },
          { title: "Kochen", text: "Alles in der Brühe ca. 30 Minuten sanft köcheln lassen." }
        ])
      ]
    );
    console.log("-> Erstes Test-Rezept angelegt.");
  }
}

initDB().catch((err) => console.error("DB-Fehler:", err));

// ==========================================
// API ROUTEN
// ==========================================

// 1. Kategorien abrufen (für recipes.html)
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await db.all("SELECT * FROM categories");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Laden der Kategorien" });
  }
});

// 2. Rezepte abrufen (optional gefiltert: /api/recipes?cat=soups)
app.get("/api/recipes", async (req, res) => {
  try {
    const { cat } = req.query;
    let query = "SELECT * FROM recipes";
    let params = [];

    if (cat) {
      query += " WHERE category = ?";
      params.push(cat);
    }

    const rows = await db.all(query, params);
    const recipes = rows.map((r) => ({
      ...r,
      ingredients: JSON.parse(r.ingredients || "[]"),
      instructions: JSON.parse(r.instructions || "[]"),
    }));

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Laden der Rezepte" });
  }
});

// 3. Einzelnes Rezept laden (für recipe-detail.html?id=1)
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await db.get("SELECT * FROM recipes WHERE id = ?", [req.params.id]);
    if (!recipe) {
      return res.status(404).json({ error: "Rezept nicht gefunden" });
    }

    res.json({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients || "[]"),
      instructions: JSON.parse(recipe.instructions || "[]"),
    });
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Laden des Rezepts" });
  }
});

// 4. Neues Rezept mit Bild anlegen
app.post("/api/recipes", upload.single("image"), async (req, res) => {
  try {
    const { title, prepTime, portions, category, ingredients, instructions } = req.body;
    const imageUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

    const result = await db.run(
      `INSERT INTO recipes (title, prepTime, portions, category, imageUrl, ingredients, instructions) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        Number(prepTime) || 30,
        Number(portions) || 4,
        category || "mains",
        imageUrl,
        ingredients ? JSON.stringify(JSON.parse(ingredients)) : "[]",
        instructions ? JSON.stringify(JSON.parse(instructions)) : "[]",
      ]
    );

    res.status(201).json({
      id: result.lastID,
      imageUrl,
      message: "Rezept erfolgreich gespeichert!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Erstellen des Rezepts" });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});