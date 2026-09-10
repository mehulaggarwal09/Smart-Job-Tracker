// =========================
// GET APPLICATIONS
// =========================

function getApplications() {
    let applications =
        JSON.parse(localStorage.getItem("applications")) || [];

    let dataChanged = false;

    applications = applications.map(function (application) {

        if (!application.id) {
            application.id = Date.now() + Math.random();
            dataChanged = true;
        }

        return application;
    });

    if (dataChanged) {
        localStorage.setItem(
            "applications",
            JSON.stringify(applications)
        );
    }

    return applications;
}


// =========================
// DISPLAY APPLICATIONS
// =========================

function displayFilteredApplications(applications) {

    const container =
        document.querySelector("#applicationsContainer");

    if (!container) {
        return;
    }

    if (applications.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No Applications Found</h3>
                <p>
                    Try searching with a different company or role.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = applications.map(function (application) {

        return `
            <div class="application-card">

                <h3>
                    ${application.company || "Unknown Company"}
                </h3>

                <p class="application-role">
                    ${application.role || "Unknown Role"}
                </p>

                <div class="application-details">

                    <span>
                        📍 ${application.location || "Not specified"}
                    </span>

                    <span>
                        💰 ${application.salary || "Not specified"}
                    </span>

                    <span class="status-badge">
                        ${application.status || "Applied"}
                    </span>

                    <span>
                        📅 ${application.date || "Not specified"}
                    </span>

                    ${
                        application.followUpDate
                            ? `
                                <span>
                                    🔔 Follow-up:
                                    ${application.followUpDate}
                                </span>
                            `
                            : ""
                    }

                </div>

                ${
                    application.notes
                        ? `
                            <p class="application-notes">
                                📝 ${application.notes}
                            </p>
                        `
                        : ""
                }

                <div class="application-actions">

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

                    <button
                        class="edit-btn"
                        onclick="editApplication(${application.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteApplication(${application.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


// =========================
// ELEMENTS
// =========================

const searchInput =
    document.querySelector("#searchInput");

const statusFilter =
    document.querySelector("#statusFilter");

const sortApplications =
    document.querySelector("#sortApplications");

const addApplicationBtn =
    document.querySelector("#addApplicationBtn");

const applicationModal =
    document.querySelector("#applicationModal");

const closeModalBtn =
    document.querySelector("#closeModalBtn");

const applicationForm =
    document.querySelector("#applicationForm");

const editModal =
    document.querySelector("#editApplicationModal");

const closeEditModalBtn =
    document.querySelector("#closeEditModalBtn");

const editApplicationForm =
    document.querySelector("#editApplicationForm");


// =========================
// OPEN ADD MODAL
// =========================

if (addApplicationBtn && applicationModal) {

    addApplicationBtn.addEventListener("click", function () {

        applicationModal.style.display = "flex";

    });
}


// =========================
// CLOSE ADD MODAL
// =========================

if (closeModalBtn && applicationModal) {

    closeModalBtn.addEventListener("click", function () {

        applicationModal.style.display = "none";

    });
}


// =========================
// ADD APPLICATION
// =========================

if (applicationForm) {

    applicationForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const company =
            document.querySelector("#company").value.trim();

        const role =
            document.querySelector("#role").value.trim();

        const location =
            document.querySelector("#location").value.trim();

        const salary =
            document.querySelector("#salary").value.trim();

        const status =
            document.querySelector("#status").value;

        const date =
            document.querySelector("#date").value;

        const followUpDate =
            document.querySelector("#followUpDate").value;

        const jobUrl =
            document.querySelector("#jobUrl").value.trim();

        const notes =
            document.querySelector("#notes").value.trim();


        let applications = getApplications();


        // DUPLICATE CHECK

        const duplicateApplication =
            applications.find(function (application) {

                const existingCompany =
                    (application.company || "")
                        .toLowerCase()
                        .trim();

                const existingRole =
                    (application.role || "")
                        .toLowerCase()
                        .trim();

                return (
                    existingCompany === company.toLowerCase().trim() &&
                    existingRole === role.toLowerCase().trim()
                );

            });


        if (duplicateApplication) {

            const confirmDuplicate = confirm(
                "You already have this company and role saved.\n\nDo you want to add it anyway?"
            );

            if (!confirmDuplicate) {
                return;
            }
        }


        // CREATE APPLICATION

        const application = {

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


        applications.push(application);


        // SAVE

        localStorage.setItem(
            "applications",
            JSON.stringify(applications)
        );


        // CLOSE MODAL

        if (applicationModal) {
            applicationModal.style.display = "none";
        }


        // RESET FORM

        applicationForm.reset();


        // REFRESH

        filterAndSortApplications();

    });
}


// =========================
// FILTER + SORT
// =========================

function filterAndSortApplications() {

    if (!searchInput || !statusFilter || !sortApplications) {
        return;
    }


    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedStatus =
        statusFilter.value;

    const selectedSort =
        sortApplications.value;


    const applications =
        getApplications();


    // FILTER

    let filteredApplications =
        applications.filter(function (application) {

            const company =
                (application.company || "").toLowerCase();

            const role =
                (application.role || "").toLowerCase();


            const matchesSearch =
                company.includes(searchText) ||
                role.includes(searchText);


            const matchesStatus =
                selectedStatus === "All" ||
                application.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    // SORT

    filteredApplications.sort(function (a, b) {

        if (selectedSort === "newest") {

            const dateA =
                a.date ? new Date(a.date).getTime() : 0;

            const dateB =
                b.date ? new Date(b.date).getTime() : 0;

            return dateB - dateA;
        }


        if (selectedSort === "oldest") {

            const dateA =
                a.date ? new Date(a.date).getTime() : 0;

            const dateB =
                b.date ? new Date(b.date).getTime() : 0;

            return dateA - dateB;
        }


        if (selectedSort === "company") {

            return (a.company || "")
                .toLowerCase()
                .localeCompare(
                    (b.company || "").toLowerCase()
                );
        }


        return 0;

    });


    displayFilteredApplications(
        filteredApplications
    );
}


// =========================
// SEARCH
// =========================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterAndSortApplications
    );
}


// =========================
// STATUS FILTER
// =========================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        filterAndSortApplications
    );
}


// =========================
// SORT
// =========================

if (sortApplications) {

    sortApplications.addEventListener(
        "change",
        filterAndSortApplications
    );
}


// =========================
// DELETE APPLICATION
// =========================

function deleteApplication(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmDelete) {
        return;
    }


    let applications =
        getApplications();


    applications =
        applications.filter(function (application) {

            return application.id !== id;

        });


    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );


    filterAndSortApplications();
}


// =========================
// EDIT APPLICATION
// =========================

function editApplication(id) {

    const applications =
        getApplications();


    const application =
        applications.find(function (application) {

            return application.id === id;

        });


    if (!application) {
        return;
    }


    document.querySelector("#editCompany").value =
        application.company || "";

    document.querySelector("#editRole").value =
        application.role || "";

    document.querySelector("#editLocation").value =
        application.location || "";

    document.querySelector("#editSalary").value =
        application.salary || "";

    document.querySelector("#editStatus").value =
        application.status || "Applied";

    document.querySelector("#editDate").value =
        application.date || "";

    document.querySelector("#editFollowUpDate").value =
        application.followUpDate || "";

    document.querySelector("#editJobUrl").value =
        application.jobUrl || "";

    document.querySelector("#editNotes").value =
        application.notes || "";


    editModal.dataset.applicationId =
        application.id;


    editModal.style.display = "flex";
}


// =========================
// CLOSE EDIT MODAL
// =========================

if (closeEditModalBtn && editModal) {

    closeEditModalBtn.addEventListener(
        "click",
        function () {

            editModal.style.display = "none";

        }
    );
}


// =========================
// EDIT APPLICATION FORM
// =========================

if (editApplicationForm) {

    editApplicationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const id =
                Number(editModal.dataset.applicationId);


            let applications =
                getApplications();


            const application =
                applications.find(function (application) {

                    return application.id === id;

                });


            if (!application) {
                return;
            }


            application.company =
                document.querySelector(
                    "#editCompany"
                ).value.trim();


            application.role =
                document.querySelector(
                    "#editRole"
                ).value.trim();


            application.location =
                document.querySelector(
                    "#editLocation"
                ).value.trim();


            application.salary =
                document.querySelector(
                    "#editSalary"
                ).value.trim();


            application.status =
                document.querySelector(
                    "#editStatus"
                ).value;


            application.date =
                document.querySelector(
                    "#editDate"
                ).value;


            application.followUpDate =
                document.querySelector(
                    "#editFollowUpDate"
                ).value;


            application.jobUrl =
                document.querySelector(
                    "#editJobUrl"
                ).value.trim();


            application.notes =
                document.querySelector(
                    "#editNotes"
                ).value.trim();


            // SAVE

            localStorage.setItem(
                "applications",
                JSON.stringify(applications)
            );


            // CLOSE

            editModal.style.display = "none";


            // RESET

            editApplicationForm.reset();


            // REFRESH

            filterAndSortApplications();

        }
    );
}


// =========================
// PAGE LOAD
// =========================

filterAndSortApplications();