// =========================
// THEME MANAGEMENT
// =========================

const themeToggle = document.getElementById("themeToggle");


// =========================
// LOAD SAVED THEME
// =========================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    if (themeToggle) {
        themeToggle.textContent = "☀️ Light Mode";
    }

}


// =========================
// TOGGLE THEME
// =========================

if (themeToggle) {

    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");


        if (document.body.classList.contains("dark-mode")) {

            themeToggle.textContent = "☀️ Light Mode";

            localStorage.setItem("theme", "dark");

        } else {

            themeToggle.textContent = "🌙 Dark Mode";

            localStorage.setItem("theme", "light");

        }

    });

}