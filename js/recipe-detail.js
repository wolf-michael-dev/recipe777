document.addEventListener("DOMContentLoaded", async () => {
  // 1. Rezept-ID aus der URL auslesen (z.B. ?id=5)
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!recipeId) {
    document.getElementById("detail-title").textContent = "Rezept nicht gefunden";
    return;
  }

  try {
    // 2. Daten von deinem eigenen Node.js Backend laden (anstatt Firebase)
    // Dieser Endpunkt (/api/recipes/:id) muss später in deiner server.js definiert werden
    const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
    
    if (!response.ok) throw new Error("Netzwerkfehler");
    const recipe = await response.json();

    // 3. HTML mit den Datenbank-Werten befüllen
    document.getElementById("detail-title").textContent = recipe.title;
    document.getElementById("detail-time").textContent = `${recipe.prepTime} Min.`;
    
    // Bild setzen (Falls imageUrl in der DB vorhanden ist)
    const imgEl = document.getElementById("detail-img");
    if (recipe.imageUrl) {
      imgEl.src = recipe.imageUrl;
    } else {
      imgEl.style.backgroundColor = "#2a2d33"; // Fallback, falls kein Bild vorhanden
    }

    // 4. Zutaten-Grid dynamisch aufbauen (Zutaten sind als Array in der DB gespeichert)
    const ingredientsContainer = document.getElementById("detail-ingredients");
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      ingredientsContainer.innerHTML = recipe.ingredients.map(ing => `
        <div class="ingredient-item">${ing}</div>
      `).join("");
    }

    // 5. Zubereitungsschritte dynamisch aufbauen
    // Angenommen, du speicherst 'instructions' als Array von Objekten in SQLite: 
    // [{ title: "Vorbereitung", text: "..." }, ...]
    const instructionsContainer = document.getElementById("detail-instructions");
    if (recipe.instructions && Array.isArray(recipe.instructions)) {
      instructionsContainer.innerHTML = recipe.instructions.map((step, index) => `
        <div class="instruction-step">
          <div class="step-number">${index + 1}</div>
          <div class="step-text">
            <strong>${step.title}</strong>
            ${step.text}
          </div>
        </div>
      `).join("");
    }

  } catch (error) {
    console.error("Fehler beim Laden des Rezepts aus der Datenbank:", error);
    document.getElementById("detail-title").textContent = "Fehler beim Laden";
  }
});