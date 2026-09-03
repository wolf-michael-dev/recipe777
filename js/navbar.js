// Hilfsfunktion: Berechnet Position und slidet den Indikator
function slideTo(item) {
  const indicator = document.getElementById("nav-indicator");
  if (!item || !indicator) return;

  let width = item.offsetWidth;
  let left = item.offsetLeft;

  // Im Android-Design ist die Pille fest 56px breit und im Item zentriert
  if (document.body.classList.contains("theme-android")) {
    const pillWidth = 56;
    left = left + (width - pillWidth) / 2;
    width = pillWidth;
  }

  indicator.style.width = `${width}px`;
  indicator.style.transform = `translateX(${left}px)`;
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const isInPagesDir = window.location.pathname.includes("/pages/");
  const navPath = isInPagesDir ? "../navbar.html" : "navbar.html";

  fetch(navPath)
    .then((res) => {
      if (!res.ok) throw new Error("navbar.html konnte nicht geladen werden");
      return res.text();
    })
    .then((html) => {
      container.innerHTML = html;

      // Pfade korrigieren
      if (isInPagesDir) {
        document.getElementById("nav-recipes")?.setAttribute("href", "recipes.html");
        document.getElementById("nav-profile")?.setAttribute("href", "profile.html");
        document.getElementById("nav-home")?.setAttribute("href", "../index.html");
      }

      // Aktiven Tab anhand der URL ermitteln
      const path = window.location.pathname;
      let activeId = "nav-home";
      if (path.includes("recipes")) activeId = "nav-recipes";
      else if (path.includes("profile")) activeId = "nav-profile";

      const activeItem = document.getElementById(activeId);
      if (activeItem) {
        activeItem.classList.add("active");
        
        // Initial-Position ohne Animation setzen (damit es beim Laden nicht reinfliegt)
        const indicator = document.getElementById("nav-indicator");
        if (indicator) {
          indicator.style.transition = "none";
          slideTo(activeItem);
          
          // Animation nach einem kurzen Moment aktivieren
          setTimeout(() => {
            indicator.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          }, 50);
        }
      }

      // Klick-Logik für den Slide-Effekt
      const navItems = document.querySelectorAll(".nav-item");
      navItems.forEach(item => {
        item.addEventListener("click", (e) => {
          e.preventDefault(); // Verhindert sofortiges Laden der neuen Seite
          
          // Alte Markierung entfernen, neue setzen
          document.querySelector(".nav-item.active")?.classList.remove("active");
          item.classList.add("active");
          
          // Indikator zum neuen Item schieben
          slideTo(item);
          
          // Warten, bis die Animation fertig ist (250ms), dann weiterleiten
          setTimeout(() => {
            window.location.href = item.getAttribute("href");
          }, 250);
        });
      });

      // Beim Drehen des Smartphones (Resize) die Position korrigieren
      window.addEventListener("resize", () => {
        slideTo(document.querySelector(".nav-item.active"));
      });
    })
    .catch((err) => console.error(err));
});