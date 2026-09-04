document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("Zugriff verweigert: Nur für Administratoren!");
    window.location.href = "login.html";
    return;
  }

  const categorySelect = document.getElementById("category");
  const form = document.getElementById("recipe-form");
  const submitBtn = document.getElementById("submit-btn");
  const adminRecipeList = document.getElementById("admin-recipe-list");
  const headerTitle = document.querySelector("h1");

  // Prüfen, ob wir im Bearbeiten-Modus sind
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("edit");

  // 1. Kategorien laden
  try {
    const res = await fetch("http://localhost:3000/api/categories");
    const categories = await res.json();
    categorySelect.innerHTML = categories
      .map((c) => `<option value="${c.id}">${c.title}</option>`)
      .join("");
  } catch (err) {
    console.error("Kategorien konnten nicht geladen werden", err);
  }

  // 2. Falls Bearbeiten: Bestehende Daten in Felder eintragen
  if (editId) {
    if (headerTitle) headerTitle.textContent = "Rezept bearbeiten";
    submitBtn.textContent = "Änderungen speichern";

    try {
      const res = await fetch(`http://localhost:3000/api/recipes/${editId}`);
      const recipe = await res.json();

      document.getElementById("title").value = recipe.title;
      document.getElementById("prepTime").value = recipe.prepTime;
      document.getElementById("portions").value = recipe.portions || 4;
      categorySelect.value = recipe.category;
      document.getElementById("ingredients").value = recipe.ingredients.join(", ");
      document.getElementById("instructions").value = recipe.instructions
        .map((step) => step.text)
        .join("\n");
    } catch (e) {
      alert("Fehler beim Laden des Rezepts zum Bearbeiten");
    }
  }

  // 3. Bestehende Rezepte für die Liste laden
  async function loadAdminRecipes() {
    if (!adminRecipeList) return;
    try {
      const res = await fetch("http://localhost:3000/api/recipes");
      const recipes = await res.json();

      if (recipes.length === 0) {
        adminRecipeList.innerHTML = "<p style='color: #9ca3af;'>Keine Rezepte vorhanden.</p>";
        return;
      }

      adminRecipeList.innerHTML = recipes
        .map(
          (r) => `
        <div style="background: #17191d; border: 1px solid rgba(255,255,255,0.06); padding: 14px 16px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="font-size: 1rem; color: #fff; display: block;">${r.title}</strong>
            <span style="font-size: 0.8rem; color: #9ca3af;">${r.prepTime} Min. • ${r.category}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="add-recipe.html?edit=${r.id}" style="background: rgba(15, 184, 204, 0.15); border: 1px solid rgba(15, 184, 204, 0.3); color: #0fb8cc; padding: 8px 12px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 0.85rem;">
              Bearbeiten
            </a>
            <button onclick="deleteRecipe(${r.id})" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 8px 12px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">
              Löschen
            </button>
          </div>
        </div>
      `
        )
        .join("");
    } catch (err) {
      adminRecipeList.innerHTML = "<p style='color: #ef4444;'>Fehler beim Laden der Rezepte.</p>";
    }
  }

  loadAdminRecipes();

  // 4. Löschen-Funktion
  window.deleteRecipe = async (id) => {
    if (!confirm("Möchtest du dieses Rezept wirklich dauerhaft löschen?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        loadAdminRecipes();
      } else {
        alert("Löschen fehlgeschlagen.");
      }
    } catch (err) {
      alert("Serverfehler beim Löschen.");
    }
  };

  // 5. Speichern oder Aktualisieren absenden
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gespeichert...";

    const title = document.getElementById("title").value;
    const prepTime = document.getElementById("prepTime").value;
    const portions = document.getElementById("portions").value;
    const category = categorySelect.value;
    const imageFile = document.getElementById("image").files[0];

    const rawIngredients = document.getElementById("ingredients").value;
    const ingredientsArray = rawIngredients
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const rawInstructions = document.getElementById("instructions").value;
    const instructionsArray = rawInstructions
      .split("\n")
      .map((text, idx) => ({ title: `Schritt ${idx + 1}`, text: text.trim() }))
      .filter((step) => step.text.length > 0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("prepTime", prepTime);
    formData.append("portions", portions);
    formData.append("category", category);
    formData.append("ingredients", JSON.stringify(ingredientsArray));
    formData.append("instructions", JSON.stringify(instructionsArray));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const endpoint = editId
      ? `http://localhost:3000/api/recipes/${editId}`
      : "http://localhost:3000/api/recipes";

    const httpMethod = editId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method: httpMethod,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error("Fehler beim Speichern");

      alert(editId ? "Rezept erfolgreich aktualisiert!" : "Rezept erfolgreich erstellt!");
      window.location.href = `recipe-detail.html?id=${editId || (await response.json()).id}`;
    } catch (err) {
      alert("Fehler beim Speichern des Rezepts");
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.textContent = editId ? "Änderungen speichern" : "Speichern";
    }
  });
});