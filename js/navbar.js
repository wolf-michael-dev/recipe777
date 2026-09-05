// Erkennt OS oder liest URL-Parameter (?theme=apple oder ?theme=android)
function applyOSTheme() {
  // Alte Klassen entfernen, falls sie hart ins HTML geschrieben wurden
  document.body.classList.remove("theme-apple", "theme-android");

  const urlParams = new URLSearchParams(window.location.search);
  const forceTheme = urlParams.get("theme");

  if (forceTheme === "apple") {
    document.body.classList.add("theme-apple");
    return;
  }
  if (forceTheme === "android") {
    document.body.classList.add("theme-android");
    return;
  }

  // Automatische Erkennung
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/iPad|iPhone|iPod|Macintosh/.test(userAgent)) {
    document.body.classList.add("theme-apple");
  } else {
    document.body.classList.add("theme-android");
  }
}

function slideTo(item) {
  const indicator = document.getElementById("nav-indicator");
  if (!item || !indicator) return;

  let width = item.offsetWidth;
  let left = item.offsetLeft;

  if (document.body.classList.contains("theme-android")) {
    const pillWidth = 56;
    left = left + (width - pillWidth) / 2;
    width = pillWidth;
  }

  indicator.style.width = `${width}px`;
  indicator.style.transform = `translate(${left}px, -50%)`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Theme auf jeder Seite zwingend setzen
  applyOSTheme();

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

      // Pfade anpassen
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

      // Aktiven Tab ermitteln
      const path = window.location.pathname;
      let activeId = "nav-home";
      if (
        path.includes("recipes") ||
        path.includes("category") ||
        path.includes("recipe-detail")
      ) {
        activeId = "nav-recipes";
      } else if (
        path.includes("profile") ||
        path.includes("login") ||
        path.includes("admin")
      ) {
        activeId = "nav-profile";
      }

      const activeItem = document.getElementById(activeId);
      if (activeItem) {
        activeItem.classList.add("active");

        const indicator = document.getElementById("nav-indicator");
        if (indicator) {
          indicator.style.transition = "none";
          slideTo(activeItem);

          setTimeout(() => {
            indicator.style.transition =
              "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
          }, 50);
        }
      }

      // Klick-Logik
      const navItems = document.querySelectorAll(".nav-item");
      navItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();

          document
            .querySelector(".nav-item.active")
            ?.classList.remove("active");
          item.classList.add("active");

          slideTo(item);

          setTimeout(() => {
            window.location.href = item.getAttribute("href");
          }, 250);
        });
      });

      window.addEventListener("resize", () => {
        slideTo(document.querySelector(".nav-item.active"));
      });
    })
    .catch((err) => console.error(err));
});
