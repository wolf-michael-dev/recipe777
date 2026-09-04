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
