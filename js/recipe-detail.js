document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!recipeId) {
    document.getElementById("detail-title").textContent =
      "Kein Rezept ausgewählt";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/recipes/${recipeId}`,
    );
    if (!response.ok) throw new Error("Rezept konnte nicht geladen werden");

    const recipe = await response.json();

    // Titel & Meta-Werte setzen
    document.getElementById("detail-title").textContent = recipe.title;
    document.getElementById("detail-time").textContent =
      `${recipe.prepTime} Min.`;
    document.getElementById("detail-portions").textContent =
      `${recipe.portions || 4} Pers.`;

    // Bild setzen
    const imgEl = document.getElementById("detail-img");
    imgEl.src = recipe.imageUrl || "../assets/images/torte.webp";

    // Zutaten-Raster aufbauen
    const ingredientsContainer = document.getElementById("detail-ingredients");
    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      ingredientsContainer.innerHTML = recipe.ingredients
        .map((ing) => `<div class="ingredient-item">${ing}</div>`)
        .join("");
    }

    // Zubereitungsschritte aufbauen
    const instructionsContainer = document.getElementById(
      "detail-instructions",
    );
    if (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) {
      instructionsContainer.innerHTML = recipe.instructions
        .map(
          (step, index) => `
          <div class="instruction-step">
            <div class="step-number">${index + 1}</div>
            <div class="step-text">
              <strong>${step.title || `Schritt ${index + 1}`}</strong>
              ${step.text}
            </div>
          </div>
        `,
        )
        .join("");
    }
  } catch (error) {
    console.error("Fehler beim Laden:", error);
    document.getElementById("detail-title").textContent =
      "Fehler beim Laden des Rezepts";
  }
});

// Erstellungsdatum formatiert anzeigen (z. B. 04.09.2026)
    if (recipe.createdAt) {
      const date = new Date(recipe.createdAt);
      document.getElementById("detail-date").textContent = date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } else {
      document.getElementById("detail-date").textContent = "Unbekannt";
    }

    // Admin-Buttons aktivieren
    const token = localStorage.getItem("adminToken");
    const editBtn = document.getElementById("edit-btn");
    const deleteBtn = document.getElementById("delete-btn");

    if (token) {
      if (editBtn) {
        editBtn.style.display = "flex";
        editBtn.href = `add-recipe.html?edit=${recipe.id}`;
      }
      if (deleteBtn) {
        deleteBtn.style.display = "flex";
        deleteBtn.onclick = async () => {
          if (!confirm("Rezept wirklich löschen?")) return;
          const res = await fetch(`http://localhost:3000/api/recipes/${recipe.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) window.location.href = "recipes.html";
        };
      }
    }