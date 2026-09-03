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
    catSalads: "Salate",
    catBaking: "Gebäck",
    catMains: "Hauptgerichte",
    quoteHeading: "Gedanke des Tages",
    btnExpand: "Zutaten & Details ansehen ⬇",
    btnCollapse: "Zutaten & Details schließen ⬆"
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
    catSalads: "Salads",
    catBaking: "Bakery",
    catMains: "Main Dishes",
    quoteHeading: "Thought of the Day",
    btnExpand: "View Ingredients & Details ⬇",
    btnCollapse: "Close Ingredients & Details ⬆"
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
    catSalads: "Салаты",
    catBaking: "Выпечка",
    catMains: "Главные блюда",
    quoteHeading: "Мысль дня",
    btnExpand: "Посмотреть ингредиенты и детали ⬇",
    btnCollapse: "Скрыть ингредиенты и детали ⬆"
  }
};

const dailyVerses = [
  {
    de: { text: "„Wir wissen aber, dass denen, die Gott lieben, alle Dinge zum Besten dienen.“", ref: "Römer 8:28" },
    en: { text: "“And we know that in all things God works for the good of those who love him.”", ref: "Romans 8:28" },
    ru: { text: "«Любящим Бога, призванным по Его изволению, все содействует ко благу.»", ref: "Римлянам 8:28" }
  },
  {
    de: { text: "„Der Herr ist mein Hirte, mir wird nichts mangeln.“", ref: "Psalm 23:1" },
    en: { text: "“The Lord is my shepherd, I lack nothing.”", ref: "Psalm 23:1" },
    ru: { text: "«Господь — Пастырь мой; я ни в чем не буду нуждаться.»", ref: "Псалом 22:1" }
  },
  {
    de: { text: "„Alle eure Dinge lasst in der Liebe geschehen!“", ref: "1. Korinther 16:14" },
    en: { text: "“Do everything in love.”", ref: "1 Corinthians 16:14" },
    ru: { text: "«Все у вас да будет с любовью.»", ref: "1 Коринфянам 16:14" }
  },
  {
    de: { text: "„Befiehl dem Herrn deine Wege und hoffe auf ihn, er wird's wohlmachen.“", ref: "Psalm 37:5" },
    en: { text: "“Commit your way to the Lord; trust in him and he will do this.”", ref: "Psalm 37:5" },
    ru: { text: "«Предай Господу путь твой и уповай на Него, и Он совершит.»", ref: "Псалом 36:5" }
  },
  {
    de: { text: "„Gott ist unsere Zuversicht und Stärke, eine Hilfe in den großen Nöten.“", ref: "Psalm 46:2" },
    en: { text: "“God is our refuge and strength, an ever-present help in trouble.”", ref: "Psalm 46:1" },
    ru: { text: "«Бог нам прибежище и сила, скорый помощник в бедах.»", ref: "Псалом 45:2" }
  }
];

// 2. Sprache ermitteln
const userLang = navigator.language.slice(0, 2).toLowerCase();
const lang = translations[userLang] ? userLang : "en";
const text = translations[lang];

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

// 3. Betriebssystem erkennen (Material You vs. Apple)
function applyOSTheme() {
  const urlParams = new URLSearchParams(window.location.search);
  const forceTheme = urlParams.get('theme');

  if (forceTheme === 'apple') {
    document.body.classList.add("theme-apple");
    return;
  }
  if (forceTheme === 'android') {
    document.body.classList.add("theme-android");
    return;
  }

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/iPad|iPhone|iPod|Macintosh/.test(userAgent)) {
    document.body.classList.add("theme-apple");
  } else {
    document.body.classList.add("theme-android");
  }
}

// 4. Skript ausführen, sobald die Seite geladen ist
document.addEventListener("DOMContentLoaded", () => {
  applyOSTheme();
  document.documentElement.lang = text.langCode;

  // Statische Texte setzen
  setText("welcome-message", text.welcome);
  setText("card-badge", text.badge);
  setText("card-title", text.recipeTitle);
  setText("btn-fav", text.btnFav);
  setText("btn-options", text.btnOptions);
  setText("btn-share", text.btnShare);
  setText("categories-title", text.categoriesTitle);
  setText("cat-seafood", text.catFish);
  setText("cat-salads", text.catSalads);
  setText("cat-baking", text.catBaking);
  setText("cat-mains", text.catMains);
  setText("thought-heading", text.quoteHeading);

  // Dynamischen Vers des Tages berechnen
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const verseIndex = dayOfYear % dailyVerses.length;
  const verseOfTheDay = dailyVerses[verseIndex][lang]; 

  setText("thought-quote", verseOfTheDay.text);
  setText("thought-ref", verseOfTheDay.ref);
});

// Öffnet oder schließt die Rezept-Details (Akkordeon)
// Akkordeon-Buttons isoliert steuern und übersetzen
// Akkordeon-Buttons isoliert steuern und sanft übersetzen
  const expandBtns = document.querySelectorAll(".expand-btn");
  
  expandBtns.forEach((btn) => {
    // Initiale Übersetzung beim Laden der Seite setzen
    btn.textContent = text.btnExpand;

    // Klick-Event für genau diesen einen Button
    btn.addEventListener("click", () => {
      const details = btn.nextElementSibling;
      const isOpen = details.classList.contains("open");

      // 1. Button-Text sanft ausblenden
      btn.style.opacity = "0";

      // 2. Warten bis er unsichtbar ist (150ms), dann Text tauschen
      setTimeout(() => {
        if (isOpen) {
          details.classList.remove("open");
          btn.textContent = text.btnExpand; // Text wieder auf Zuklappen ändern
        } else {
          details.classList.add("open");
          btn.textContent = text.btnCollapse; // Text auf Aufklappen ändern
        }
        
        // 3. Neuen Text sanft wieder einblenden
        btn.style.opacity = "1";
      }, 150); 
    });
  });

// Horizontales Scrollen per Mausrad für das Desktop-Karussell
  const carousel = document.querySelector(".carousel-container");
  if (carousel) {
    carousel.addEventListener("wheel", (evt) => {
      // Verhindert, dass die ganze Seite nach unten scrollt
      evt.preventDefault();
      
      // Scrollt stattdessen sanft zur Seite (300px entspricht etwa einer Karte)
      carousel.scrollBy({
        left: evt.deltaY > 0 ? 300 : -300,
        behavior: "smooth"
      });
    }, { passive: false }); // Wichtig, damit preventDefault() im Browser erlaubt ist
  }