document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("adminToken");

  // Nicht eingeloggt -> sofort wegschicken
  if (!token) {
    alert("Zugriff verweigert: Nur für Administratoren!");
    window.location.href = "login.html";
    return;
  }

  const categorySelect = document.getElementById("category");
  const form = document.getElementById("recipe-form");
  const submitBtn = document.getElementById("submit-btn");

  // Kategorien für das Dropdown laden
  try {
    const res = await fetch("http://localhost:3000/api/categories");
    const categories = await res.json();
    categorySelect.innerHTML = categories
      .map((c) => `<option value="${c.id}">${c.title}</option>`)
      .join("");
  } catch (err) {
    console.error("Kategorien konnten nicht geladen werden", err);
  }

  // Formular absenden mit Token-Validierung
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gespeichert...";

    const title = document.getElementById("title").value;
    const prepTime = document.getElementById("prepTime").value;
    const portions = document.getElementById("portions").value;
    const category = categorySelect.value;
    const imageFile = document.getElementById("image").files[0];

    const rawIngredients = document.getElementById("ingredients").value;
    const ingredientsArray = rawIngredients
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const rawInstructions = document.getElementById("instructions").value;
    const instructionsArray = rawInstructions
      .split("\n")
      .map((text, idx) => ({ title: `Schritt ${idx + 1}`, text: text.trim() }))
      .filter((step) => step.text.length > 0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("prepTime", prepTime);
    formData.append("portions", portions);
    formData.append("category", category);
    formData.append("ingredients", JSON.stringify(ingredientsArray));
    formData.append("instructions", JSON.stringify(instructionsArray));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:3000/api/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Admin-Token mitsenden
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert("Sitzung abgelaufen oder ungültig. Bitte neu anmelden.");
          localStorage.removeItem("adminToken");
          window.location.href = "login.html";
          return;
        }
        throw new Error("Fehler beim Speichern");
      }

      const data = await response.json();
      window.location.href = `recipe-detail.html?id=${data.id}`;
    } catch (err) {
      alert("Fehler beim Speichern des Rezepts");
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.textContent = "Speichern";
    }
  });
});