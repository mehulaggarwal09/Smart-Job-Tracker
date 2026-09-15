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

} else {

    if (themeToggle) {
        themeToggle.textContent = "🌙 Dark Mode";
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


// =========================
// MOBILE MENU
// =========================

const sidebar = document.querySelector(".sidebar");

if (sidebar) {

    // Prevent duplicate menu button
    let menuButton = document.querySelector(".mobile-menu-btn");

    if (!menuButton) {

        menuButton = document.createElement("button");

        menuButton.className = "mobile-menu-btn";
        menuButton.id = "mobileMenuBtn";

        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        menuButton.innerHTML = "☰";

        document.body.appendChild(menuButton);

    }


    // =========================
    // CREATE OVERLAY
    // =========================

    let overlay = document.querySelector(".sidebar-overlay");

    if (!overlay) {

        overlay = document.createElement("div");

        overlay.className = "sidebar-overlay";
        overlay.id = "sidebarOverlay";

        document.body.appendChild(overlay);

    }


    // =========================
    // OPEN MENU
    // =========================

    menuButton.addEventListener("click", function () {

        sidebar.classList.add("active");

        overlay.classList.add("active");

        menuButton.innerHTML = "✕";

        menuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

    });


    // =========================
    // CLOSE MENU
    // =========================

    function closeMobileMenu() {

        sidebar.classList.remove("active");

        overlay.classList.remove("active");

        menuButton.innerHTML = "☰";

        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    }


    // =========================
    // CLOSE ON OVERLAY CLICK
    // =========================

    overlay.addEventListener("click", function () {

        closeMobileMenu();

    });


    // =========================
    // CLOSE AFTER NAVIGATION
    // =========================

    const navLinks = sidebar.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 768) {

                closeMobileMenu();

            }

        });

    });


    // =========================
    // HANDLE WINDOW RESIZE
    // =========================

    window.addEventListener("resize", function () {

        if (window.innerWidth > 768) {

            closeMobileMenu();

        }

    });

}