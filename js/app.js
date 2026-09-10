// =========================
// APPLICATION STORAGE
// =========================

function getApplications() {
    return JSON.parse(
        localStorage.getItem("applications")
    ) || [];
}

function saveApplications(applications) {
    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}


// =========================
// MODAL ELEMENTS
// =========================

const modal = document.getElementById("applicationModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const applicationForm = document.getElementById("applicationForm");


// =========================
// OPEN MODAL
// =========================

openModalBtn.addEventListener("click", function () {
    modal.style.display = "flex";
});


// =========================
// CLOSE MODAL
// =========================

closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});


// Close when clicking outside modal

window.addEventListener("click", function (event) {

    if (event.target === modal) {
        modal.style.display = "none";
    }

});


// =========================
// ADD APPLICATION
// =========================

applicationForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const applications = getApplications();


    // Get form values

    const company =
        document.getElementById("company").value.trim();

    const role =
        document.getElementById("role").value.trim();

    const location =
        document.getElementById("location").value.trim();

    const salary =
        document.getElementById("salary").value.trim();

    const status =
        document.getElementById("status").value;

    const date =
        document.getElementById("date").value;

    const followUpDate =
        document.getElementById("followUpDate").value;

    const jobUrl =
        document.getElementById("jobUrl").value.trim();

    const notes =
        document.getElementById("notes").value.trim();


    // =========================
    // DUPLICATE CHECK
    // =========================

    const duplicateApplication = applications.find(
        application =>
            application.company.toLowerCase() === company.toLowerCase() &&
            application.role.toLowerCase() === role.toLowerCase()
    );


    if (duplicateApplication) {

        const confirmDuplicate = confirm(
            `You already have an application for ${company} - ${role}.\n\nDo you want to add it anyway?`
        );


        if (!confirmDuplicate) {
            return;
        }

    }


    // =========================
    // CREATE APPLICATION
    // =========================

    const newApplication = {

        id: Date.now(),

        company: company,

        role: role,

        location: location,

        salary: salary,

        status: status,

        date: date,

        followUpDate: followUpDate,

        jobUrl: jobUrl,

        notes: notes

    };


    // Save application

    applications.push(newApplication);

    saveApplications(applications);


    // Reset form

    applicationForm.reset();


    // Close modal

    modal.style.display = "none";


    // Update dashboard

    updateDashboard();

    displayFollowUps();

});


// =========================
// DASHBOARD STATISTICS
// =========================

function updateDashboard() {

    const applications = getApplications();

    const totalApplications =
        applications.length;


    const totalInterviews =
        applications.filter(
            application =>
                application.status === "Interview"
        ).length;


    const totalOffers =
        applications.filter(
            application =>
                application.status === "Offer"
        ).length;


    const totalRejected =
        applications.filter(
            application =>
                application.status === "Rejected"
        ).length;


    const respondedApplications =
        applications.filter(
            application =>
                application.status !== "Applied"
        ).length;


    const responseRate =
        totalApplications > 0
            ? Math.round(
                (respondedApplications /
                    totalApplications) * 100
            )
            : 0;


    const interviewRate =
        totalApplications > 0
            ? Math.round(
                (totalInterviews /
                    totalApplications) * 100
            )
            : 0;


    // Update dashboard

    document.getElementById(
        "totalApplications"
    ).textContent = totalApplications;


    document.getElementById(
        "totalInterviews"
    ).textContent = totalInterviews;


    document.getElementById(
        "totalOffers"
    ).textContent = totalOffers;


    document.getElementById(
        "totalRejected"
    ).textContent = totalRejected;


    document.getElementById(
        "responseRate"
    ).textContent = `${responseRate}%`;


    document.getElementById(
        "interviewRate"
    ).textContent = `${interviewRate}%`;

}


// =========================
// FOLLOW-UP REMINDERS
// =========================

function displayFollowUps() {

    const container =
        document.getElementById(
            "followUpContainer"
        );


    if (!container) {
        return;
    }


    const applications =
        getApplications();


    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const followUps = applications
        .filter(
            application =>
                application.followUpDate
        )
        .map(application => {

            const followUpDate =
                new Date(
                    application.followUpDate +
                    "T00:00:00"
                );


            followUpDate.setHours(0, 0, 0, 0);


            const difference =
                Math.ceil(
                    (followUpDate - today) /
                    (1000 * 60 * 60 * 24)
                );


            return {
                ...application,
                daysDifference: difference
            };

        })
        .sort(
            (a, b) =>
                a.daysDifference -
                b.daysDifference
        );


    if (followUps.length === 0) {

        container.innerHTML = `
            <p class="empty-state">
                No follow-ups scheduled.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    followUps.forEach(application => {

        let reminderClass = "";

        let reminderText = "";


        if (application.daysDifference < 0) {

            reminderClass = "overdue";


            const daysOverdue =
                Math.abs(
                    application.daysDifference
                );


            reminderText =
                `Overdue by ${daysOverdue} day${daysOverdue > 1 ? "s" : ""}`;

        }

        else if (
            application.daysDifference === 0
        ) {

            reminderClass = "today";

            reminderText =
                "Follow up today";

        }

        else {

            reminderClass = "upcoming";


            reminderText =
                `In ${application.daysDifference} day${application.daysDifference > 1 ? "s" : ""}`;

        }


        const reminder =
            document.createElement("div");


        reminder.className =
            `follow-up-card ${reminderClass}`;


        reminder.innerHTML = `

            <div class="follow-up-info">

                <h3>
                    ${application.company}
                </h3>

                <p>
                    ${application.role}
                </p>

                <span>
                    Follow-up:
                    ${application.followUpDate}
                </span>

            </div>


            <div class="follow-up-status">

                ${reminderText}

            </div>

        `;


        container.appendChild(reminder);

    });

}


// =========================
// INITIAL LOAD
// =========================

updateDashboard();

displayFollowUps();

// =========================
// DARK / LIGHT MODE
// =========================

const themeToggle = document.getElementById("themeToggle");

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


    // Load saved theme

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent =
            "☀️ Light Mode";

    }

}