// =========================
// GET APPLICATIONS
// =========================

const applications = JSON.parse(
    localStorage.getItem("applications")
) || [];


// =========================
// BASIC COUNTS
// =========================

const totalApplications = applications.length;

const interviews = applications.filter(
    application => application.status === "Interview"
).length;

const offers = applications.filter(
    application => application.status === "Offer"
).length;


// =========================
// CALCULATE RATES
// =========================

const interviewRate = totalApplications > 0
    ? Math.round((interviews / totalApplications) * 100)
    : 0;

const offerRate = totalApplications > 0
    ? Math.round((offers / totalApplications) * 100)
    : 0;


// =========================
// UPDATE ANALYTICS CARDS
// =========================

document.getElementById("analyticsTotal").textContent =
    totalApplications;

document.getElementById("analyticsInterviewRate").textContent =
    `${interviewRate}%`;

document.getElementById("analyticsOfferRate").textContent =
    `${offerRate}%`;


// =========================
// STATUS COUNTS
// =========================

const statusCounts = {
    Applied: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0
};


applications.forEach(application => {

    if (statusCounts[application.status] !== undefined) {
        statusCounts[application.status]++;
    }

});


// =========================
// STATUS DOUGHNUT CHART
// =========================

const statusCanvas = document.getElementById("statusChart");

if (statusCanvas) {

    new Chart(statusCanvas, {

        type: "doughnut",

        data: {

            labels: Object.keys(statusCounts),

            datasets: [
                {
                    label: "Applications",
                    data: Object.values(statusCounts)
                }
            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });

}


// =========================
// APPLICATIONS OVER TIME
// =========================

// Group applications by date

const applicationsByDate = {};

applications.forEach(application => {

    if (!application.date) {
        return;
    }

    if (!applicationsByDate[application.date]) {
        applicationsByDate[application.date] = 0;
    }

    applicationsByDate[application.date]++;

});


// Sort dates

const sortedDates = Object.keys(applicationsByDate).sort();


// Get application counts

const timelineCounts = sortedDates.map(
    date => applicationsByDate[date]
);


// =========================
// TIMELINE LINE CHART
// =========================

const timelineCanvas = document.getElementById("timelineChart");

if (timelineCanvas) {

    new Chart(timelineCanvas, {

        type: "line",

        data: {

            labels: sortedDates,

            datasets: [
                {
                    label: "Applications",

                    data: timelineCounts,

                    tension: 0.3,

                    fill: false,

                    borderWidth: 2,

                    pointRadius: 4

                }
            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        stepSize: 1
                    }

                }

            },

            plugins: {

                legend: {
                    display: true
                }

            }

        }

    });

}