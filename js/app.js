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

if (openModalBtn && modal) {
    openModalBtn.addEventListener("click", function () {
        modal.style.display = "flex";
    });
}


// =========================
// CLOSE MODAL
// =========================

if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });
}


// =========================
// CLOSE MODAL OUTSIDE CLICK
// =========================

window.addEventListener("click", function (event) {

    if (modal && event.target === modal) {
        modal.style.display = "none";
    }

});


// =========================
// ADD APPLICATION
// =========================

if (applicationForm) {

    applicationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const applications = getApplications();


        // =========================
        // GET FORM VALUES
        // =========================

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


        // =========================
        // SAVE APPLICATION
        // =========================

        applications.push(newApplication);

        saveApplications(applications);


        // =========================
        // RESET FORM
        // =========================

        applicationForm.reset();


        // =========================
        // CLOSE MODAL
        // =========================

        if (modal) {
            modal.style.display = "none";
        }


        // =========================
        // UPDATE DASHBOARD
        // =========================

        updateDashboard();

        displayFollowUps();

    });

}


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


    // =========================
    // UPDATE DASHBOARD
    // =========================

    const totalApplicationsElement =
        document.getElementById("totalApplications");

    const totalInterviewsElement =
        document.getElementById("totalInterviews");

    const totalOffersElement =
        document.getElementById("totalOffers");

    const totalRejectedElement =
        document.getElementById("totalRejected");

    const responseRateElement =
        document.getElementById("responseRate");

    const interviewRateElement =
        document.getElementById("interviewRate");


    if (totalApplicationsElement) {
        totalApplicationsElement.textContent =
            totalApplications;
    }


    if (totalInterviewsElement) {
        totalInterviewsElement.textContent =
            totalInterviews;
    }


    if (totalOffersElement) {
        totalOffersElement.textContent =
            totalOffers;
    }


    if (totalRejectedElement) {
        totalRejectedElement.textContent =
            totalRejected;
    }


    if (responseRateElement) {
        responseRateElement.textContent =
            `${responseRate}%`;
    }


    if (interviewRateElement) {
        interviewRateElement.textContent =
            `${interviewRate}%`;
    }

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


    // =========================
    // NO FOLLOW-UPS
    // =========================

    if (followUps.length === 0) {

        container.innerHTML = `
            <p class="empty-state">
                No follow-ups scheduled.
            </p>
        `;

        return;
    }


    // =========================
    // CLEAR CONTAINER
    // =========================

    container.innerHTML = "";


    // =========================
    // DISPLAY FOLLOW-UPS
    // =========================

    followUps.forEach(application => {

        let reminderClass = "";

        let reminderText = "";


        // =========================
        // OVERDUE
        // =========================

        if (application.daysDifference < 0) {

            reminderClass = "overdue";


            const daysOverdue =
                Math.abs(
                    application.daysDifference
                );


            reminderText =
                `Overdue by ${daysOverdue} day${daysOverdue > 1 ? "s" : ""}`;

        }


        // =========================
        // TODAY
        // =========================

        else if (
            application.daysDifference === 0
        ) {

            reminderClass = "today";

            reminderText =
                "Follow up today";

        }


        // =========================
        // UPCOMING
        // =========================

        else {

            reminderClass = "upcoming";


            reminderText =
                `In ${application.daysDifference} day${application.daysDifference > 1 ? "s" : ""}`;

        }


        // =========================
        // CREATE FOLLOW-UP CARD
        // =========================

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