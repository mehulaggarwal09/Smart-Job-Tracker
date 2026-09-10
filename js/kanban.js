// =========================
// Get Applications
// =========================

function getApplications() {
    return JSON.parse(
        localStorage.getItem("applications")
    ) || [];
}


// =========================
// Display Kanban Board
// =========================

function displayKanbanBoard() {

    const applications = getApplications();

    const columns =
        document.querySelectorAll(".kanban-cards");


    // Clear columns

    columns.forEach(function (column) {
        column.innerHTML = "";
    });


    // Add applications

    applications.forEach(function (application) {

        const column =
            document.querySelector(
                `.kanban-cards[data-status="${application.status}"]`
            );


        if (!column) {
            return;
        }


        const card =
            document.createElement("div");

        card.className = "kanban-card";

        card.draggable = true;

        card.dataset.id = application.id;


        // Drag Start

        card.addEventListener(
            "dragstart",
            function (event) {

                event.dataTransfer.setData(
                    "text/plain",
                    application.id
                );

            }
        );


        // Card Content

        card.innerHTML = `

            <h3>
                ${application.company}
            </h3>

            <p class="kanban-role">
                ${application.role}
            </p>

            <p>
                📍 ${application.location || "Not specified"}
            </p>

            <p>
                💰 ${application.salary || "Not specified"}
            </p>

            <p>
                📅 ${application.date || "Not specified"}
            </p>

            ${
                application.notes
                    ? `
                        <p class="application-notes">
                            📝 ${application.notes}
                        </p>
                    `
                    : ""
            }

            ${
                application.jobUrl
                    ? `
                        <a
                            href="${application.jobUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="view-job-btn"
                        >
                            🔗 View Job
                        </a>
                    `
                    : ""
            }

        `;


        column.appendChild(card);

    });


    updateKanbanCounts();

}


// =========================
// Update Column Counts
// =========================

function updateKanbanCounts() {

    const applications =
        getApplications();

    const columns =
        document.querySelectorAll(".kanban-column");


    columns.forEach(function (column) {

        const status =
            column.querySelector(
                ".kanban-cards"
            ).dataset.status;


        const count =
            applications.filter(
                function (application) {

                    return application.status === status;

                }
            ).length;


        column.querySelector(
            ".kanban-count"
        ).textContent = count;

    });

}


// =========================
// Drag & Drop
// =========================

const kanbanColumns =
    document.querySelectorAll(".kanban-cards");


kanbanColumns.forEach(function (column) {


    // Allow Drop

    column.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

        }
    );


    // Drop

    column.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();


            const applicationId =
                Number(
                    event.dataTransfer.getData(
                        "text/plain"
                    )
                );


            const newStatus =
                column.dataset.status;


            let applications =
                getApplications();


            const application =
                applications.find(
                    function (application) {

                        return application.id === applicationId;

                    }
                );


            if (!application) {
                return;
            }


            // Update Status

            application.status =
                newStatus;


            // Save

            localStorage.setItem(
                "applications",
                JSON.stringify(applications)
            );


            // Refresh Board

            displayKanbanBoard();

        }
    );

});


// =========================
// Run
// =========================

displayKanbanBoard();