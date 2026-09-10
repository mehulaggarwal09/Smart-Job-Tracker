// =========================
// THEME TOGGLE
// =========================

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");

    if (themeToggle) {
        themeToggle.textContent = "☀️ Light Mode";
    }
}

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


// =========================
// MOBILE MENU
// =========================

const sidebar = document.querySelector(".sidebar");

if (sidebar) {

    // Create hamburger button
    const menuButton = document.createElement("button");

    menuButton.className = "mobile-menu-btn";
    menuButton.id = "mobileMenuBtn";
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.innerHTML = "☰";

    document.body.appendChild(menuButton);


    // Create overlay
    const overlay = document.createElement("div");

    overlay.className = "sidebar-overlay";
    overlay.id = "sidebarOverlay";

    document.body.appendChild(overlay);


    // Open menu
    menuButton.addEventListener("click", function () {

        sidebar.classList.add("mobile-open");
        overlay.classList.add("active");

        menuButton.innerHTML = "✕";
        menuButton.setAttribute("aria-label", "Close navigation menu");
    });


    // Close menu
    function closeMobileMenu() {

        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("active");

        menuButton.innerHTML = "☰";
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }


    overlay.addEventListener("click", closeMobileMenu);


    // Close menu after clicking navigation item
    const navItems = sidebar.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            if (window.innerWidth <= 600) {
                closeMobileMenu();
            }

        });

    });


    // Reset mobile menu on desktop resize
    window.addEventListener("resize", function () {

        if (window.innerWidth > 600) {
            closeMobileMenu();
        }

    });

}