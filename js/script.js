// js/script.js

// 1. Übersetzungs-Wörterbuch (sauberes UTF-8)
const translations = {
  de: {
    langCode: "de",
    welcome: "Was kochst du heute?",
    badge: "Empfehlung",
    recipeTitle: "Festliche Erdbeer-Mascarpone-Torte zum 18. Geburtstag",
    btnFav: "Favoriten",
    btnOptions: "Optionen",
    btnShare: "Teilen",
    categoriesTitle: "Kategorien",
    catFish: "Fisch & Meeresfrüchte",
    catSalads: "Salate"
  },
  en: {
    langCode: "en",
    welcome: "What are you cooking today?",
    badge: "Special Offer",
    recipeTitle: "Festive Strawberry Mascarpone Cake for 18th Birthday",
    btnFav: "Favorites",
    btnOptions: "Options",
    btnShare: "Share",
    categoriesTitle: "Categories",
    catFish: "Fish & Seafood",
    catSalads: "Salads"
  },
  ru: {
    langCode: "ru",
    welcome: "Что приготовим сегодня?",
    badge: "Предложение",
    recipeTitle: "Праздничный клубнично-маскарпоневый торт на 18-летие",
    btnFav: "Избранное",
    btnOptions: "Опции",
    btnShare: "Поделиться",
    categoriesTitle: "Категории",
    catFish: "Рыба и Морепродукты",
    catSalads: "Салаты"
  }
};

// 2. Sprache ermitteln (Fallback auf Englisch)
const userLang = navigator.language.slice(0, 2).toLowerCase();
const lang = translations[userLang] ? userLang : "en";
const text = translations[lang];

// 3. Hilfsfunktion zum sicheren Setzen von Element-Texten
const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

// 4. Texte im DOM aktualisieren
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.lang = text.langCode;

  setText("welcome-message", text.welcome);
  setText("card-badge", text.badge);
  setText("card-title", text.recipeTitle);
  setText("btn-fav", text.btnFav);
  setText("btn-options", text.btnOptions);
  setText("btn-share", text.btnShare);
  setText("categories-title", text.categoriesTitle);
  setText("cat-fish", text.catFish);
  setText("cat-salads", text.catSalads);
  // Vorhandene IDs
  setText("categories-title", text.categoriesTitle);
  
  // Neue Kategorien
  setText("cat-seafood", text.catFish);
  setText("cat-salads", text.catSalads);
  setText("cat-baking", text.catBaking);
  setText("cat-mains", text.catMains);

  // Gedanke des Tages
  setText("thought-heading", text.quoteHeading);
  setText("thought-quote", text.quoteBody);
  setText("thought-ref", text.quoteRef);
  
});


// 5. Betriebssystem erkennen (Material You vs. Apple Cupertino)
function applyOSTheme() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/android/i.test(userAgent)) {
    document.body.classList.add("theme-android");
  } else if (/iPad|iPhone|iPod|Macintosh/.test(userAgent)) {
    document.body.classList.add("theme-apple");
  } else {
    // Fallback für Windows/Linux-Desktops
    document.body.classList.add("theme-android"); 
  }
}

// Direkt beim Laden ausführen
document.addEventListener("DOMContentLoaded", () => {
  applyOSTheme();
});