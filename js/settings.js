// =========================
// SETTINGS - DATA MANAGEMENT
// =========================


// GET APPLICATIONS FROM LOCAL STORAGE
function getApplications() {
    return JSON.parse(localStorage.getItem("applications")) || [];
}


// =========================
// EXPORT DATA
// =========================

const exportBtn = document.getElementById("exportBtn");

if (exportBtn) {

    exportBtn.addEventListener("click", function () {

        const applications = getApplications();

        if (applications.length === 0) {
            alert("There are no applications to export.");
            return;
        }

        const data = JSON.stringify(applications, null, 2);

        const blob = new Blob(
            [data],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "jobtrack-applications.json";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        alert("Applications exported successfully!");
    });
}


// =========================
// IMPORT DATA
// =========================

const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

if (importBtn && importFile) {

    importBtn.addEventListener("click", function () {
        importFile.click();
    });


    importFile.addEventListener("change", function () {

        const file = importFile.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();


        reader.onload = function (event) {

            try {

                const importedData = JSON.parse(event.target.result);


                // CHECK IF DATA IS AN ARRAY
                if (!Array.isArray(importedData)) {

                    alert("Invalid file. Please select a valid JobTrack JSON file.");

                    return;
                }


                // CONFIRM BEFORE REPLACING DATA
                const confirmImport = confirm(
                    "Importing this file will replace your current applications.\n\nDo you want to continue?"
                );


                if (!confirmImport) {
                    importFile.value = "";
                    return;
                }


                // SAVE IMPORTED DATA
                localStorage.setItem(
                    "applications",
                    JSON.stringify(importedData)
                );


                alert(
                    `${importedData.length} applications imported successfully!`
                );


                // REFRESH PAGE
                window.location.reload();

            } catch (error) {

                alert(
                    "Invalid JSON file. Please select a valid JobTrack backup."
                );

            }

        };


        reader.readAsText(file);

    });
}


// =========================
// CLEAR ALL DATA
// =========================

const clearDataBtn = document.getElementById("clearDataBtn");

if (clearDataBtn) {

    clearDataBtn.addEventListener("click", function () {

        const applications = getApplications();


        if (applications.length === 0) {

            alert("There are no applications to delete.");

            return;
        }


        const confirmClear = confirm(
            "WARNING!\n\nThis will permanently delete ALL your job applications.\n\nAre you sure you want to continue?"
        );


        if (!confirmClear) {
            return;
        }


        const finalConfirm = confirm(
            "This action cannot be undone.\n\nDo you really want to delete all applications?"
        );


        if (!finalConfirm) {
            return;
        }


        localStorage.removeItem("applications");


        alert("All applications have been deleted.");


        window.location.reload();

    });
}