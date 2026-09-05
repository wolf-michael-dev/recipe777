document.addEventListener("DOMContentLoaded", async () => {
  const listContainer = document.getElementById("dynamic-category-list");

  try {
    // Ruft die Kategorien aus deinem lokalen Backend ab
    const response = await fetch("https://recipe777-test.loca.lt/api/categories");
    if (!response.ok) throw new Error("Netzwerkfehler");
    
    const categories = await response.json();
    
    // Baut für jeden Datenbankeintrag eine Kachel
    listContainer.innerHTML = categories.map(cat => `
      <a href="category.html?cat=${cat.id}" class="list-item">
        <div class="item-info">
          <h3 class="item-title">${cat.title}</h3>
          <span class="item-count" style="color: ${cat.color};">Rezepte ansehen</span>
        </div>
        <!-- Die Farbe wird dynamisch als Hex-Code mit Transparenz (z.B. + '26' für 15% Deckkraft) gesetzt -->
        <div class="item-icon" style="background-color: ${cat.color}26; color: ${cat.color};">
          ${cat.icon}
        </div>
      </a>
    `).join("");

  } catch (error) {
    console.error("Fehler:", error);
    listContainer.innerHTML = "<p style='text-align: center; color: #ef4444;'>Keine Verbindung zur Datenbank.</p>";
  }
});