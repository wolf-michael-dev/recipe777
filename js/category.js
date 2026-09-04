document.addEventListener("DOMContentLoaded", async () => {
  const listContainer = document.getElementById("recipe-list");
  const headerTitle = document.querySelector(".header-title");
  
  // 1. Auslesen, welche Kategorie angeklickt wurde (z.B. "?cat=mains")
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get("cat");
  
  // Titel dynamisch setzen (Kann später auch aus dem Übersetzungs-Wörterbuch kommen)
  if (categoryId === "mains") headerTitle.textContent = "Главные блюда";
  if (categoryId === "salads") headerTitle.textContent = "Салаты";

  listContainer.innerHTML = "<p style='text-align: center; color: #9ca3af;'>Lade Rezepte...</p>";

  try {
    const response = await fetch("http://localhost:3000/api/recipes");
    if (!response.ok) throw new Error("Netzwerkfehler");
    
    let recipes = await response.json();
    
    // 2. Rezepte filtern, falls eine Kategorie in der URL steht
    if (categoryId) {
      recipes = recipes.filter(recipe => recipe.category === categoryId);
    }
    
    // 3. HTML mit dem neuen schwebenden Badge aufbauen
    listContainer.innerHTML = recipes.map(recipe => `
      <a href="recipe-detail.html?id=${recipe.id}" class="list-card">
        <div class="list-card-image-wrapper">
          <img src="${recipe.imageUrl || '../assets/images/default.webp'}" alt="${recipe.title}" class="list-card-img" />
          <span class="image-badge">🌿 6</span> <!-- Später dynamisch aus der DB -->
        </div>
        <div class="list-card-info">
          <div class="list-card-text">
            <h3 class="list-card-title">${recipe.title}</h3>
            <span class="list-card-meta">⏱ ${recipe.prepTime} Min. • 👤 4 Pers.</span>
          </div>
          <div class="list-card-arrow">❯</div>
        </div>
      </a>
    `).join("");

  } catch (error) {
    console.error("Fehler:", error);
    listContainer.innerHTML = "<p style='text-align: center; color: #ef4444;'>Keine Verbindung zur Datenbank.</p>";
  }
});