document.addEventListener("DOMContentLoaded", async () => {
  const listContainer = document.getElementById("recipe-list");
  const headerTitle = document.getElementById("cat-title");

  // 1. Kategorie aus der URL auslesen (?cat=soups)
  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get("cat");

  // 2. Passende Rezepte vom Backend laden
  const apiUrl = currentCategory
    ? `http://localhost:3000/api/recipes?cat=${currentCategory}`
    : "http://localhost:3000/api/recipes";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Fehler beim Abruf");
    const recipes = await response.json();

    if (recipes.length === 0) {
      listContainer.innerHTML = "<p style='text-align: center; color: #9ca3af; margin-top: 40px;'>Noch keine Rezepte in dieser Kategorie vorhanden.</p>";
      return;
    }

    // 3. Karten dynamisch rendern
    listContainer.innerHTML = recipes
      .map(
        (recipe) => `
        <a href="recipe-detail.html?id=${recipe.id}" class="list-card">
          <div class="list-card-image-wrapper">
            <img 
              src="${recipe.imageUrl || '../assets/images/torte.webp'}" 
              alt="${recipe.title}" 
              class="list-card-img" 
            />
          </div>
          <div class="list-card-info">
            <div class="list-card-text">
              <h3 class="list-card-title">${recipe.title}</h3>
              <span class="list-card-meta">⏱ ${recipe.prepTime} Min. • 👤 ${recipe.portions || 4} Pers.</span>
            </div>
            <div class="list-card-arrow">❯</div>
          </div>
        </a>
      `
      )
      .join("");
  } catch (err) {
    console.error(err);
    listContainer.innerHTML = "<p style='text-align: center; color: #ef4444;'>Verbindungsfehler zum Backend.</p>";
  }
});