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

