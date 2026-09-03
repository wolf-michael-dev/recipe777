// js/navbar.js
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

      // Pfade korrigieren, falls man sich im Unterordner pages/ befindet
      if (isInPagesDir) {
        document
          .getElementById("nav-recipes")
          ?.setAttribute("href", "recipes.html");
        document
          .getElementById("nav-profile")
          ?.setAttribute("href", "profile.html");
        document
          .getElementById("nav-home")
          ?.setAttribute("href", "../index.html");
      }

      // Aktiven Tab optisch hervorheben
      const path = window.location.pathname;
      if (path.includes("recipes")) {
        document.getElementById("nav-recipes")?.classList.add("active");
      } else if (path.includes("profile")) {
        document.getElementById("nav-profile")?.classList.add("active");
      } else {
        document.getElementById("nav-home")?.classList.add("active");
      }
    })
    .catch((err) => console.error(err));
});