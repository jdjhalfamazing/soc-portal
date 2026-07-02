const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const vulnerabilityModal = document.getElementById("vulnerabilityModal");
const newVulnerabilityButton = document.getElementById("newVulnerabilityButton");
const saveVulnerabilityButton = document.getElementById("saveVulnerabilityButton");
const cancelVulnerabilityButton = document.getElementById("cancelVulnerabilityButton");

const newCve = document.getElementById("newCve");
const newHostname = document.getElementById("newHostname");
const newSeverity = document.getElementById("newSeverity");
const newCvssScore = document.getElementById("newCvssScore");
const newStatus = document.getElementById("newStatus");
const newAssignedTo = document.getElementById("newAssignedTo");

const searchInput = document.getElementById("searchInput");
const severityFilter = document.getElementById("severityFilter");
const statusFilter = document.getElementById("statusFilter");

let allVulnerabilities = [];

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
        sideMenu.classList.remove("open");
    }
});

newVulnerabilityButton.addEventListener("click", () => {
    vulnerabilityModal.classList.add("show");
});

cancelVulnerabilityButton.addEventListener("click", () => {
    vulnerabilityModal.classList.remove("show");
});

window.addEventListener("click", (event) => {
    if (event.target === vulnerabilityModal) {
        vulnerabilityModal.classList.remove("show");
    }
});

saveVulnerabilityButton.addEventListener("click", async () => {
    const vulnerability = {
        cve: newCve.value,
        hostname: newHostname.value,
        severity: newSeverity.value,
        cvssScore: Number(newCvssScore.value),
        status: newStatus.value,
        assignedTo: newAssignedTo.value
    };

    await fetch("/api/vulnerabilities", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vulnerability)
    });

    vulnerabilityModal.classList.remove("show");

    newCve.value = "";
    newHostname.value = "";
    newCvssScore.value = "";
    newAssignedTo.value = "";

    await loadVulnerabilities();
});

searchInput.addEventListener("input", filterVulnerabilities);
severityFilter.addEventListener("change", filterVulnerabilities);
statusFilter.addEventListener("change", filterVulnerabilities);

async function loadVulnerabilities() {
    const response = await fetch("/api/vulnerabilities");
    allVulnerabilities = await response.json();

    displayVulnerabilities(allVulnerabilities);
}

function filterVulnerabilities() {
    const search = searchInput.value.toLowerCase();
    const severity = severityFilter.value;
    const status = statusFilter.value;

    const filtered = allVulnerabilities.filter(vuln => {
        const matchesSearch =
            vuln.cve.toLowerCase().includes(search) ||
            vuln.hostname.toLowerCase().includes(search) ||
            vuln.assignedTo.toLowerCase().includes(search);

        const matchesSeverity =
            severity === "" || vuln.severity === severity;

        const matchesStatus =
            status === "" || vuln.status === status;

        return matchesSearch && matchesSeverity && matchesStatus;
    });

    displayVulnerabilities(filtered);
}

function displayVulnerabilities(vulnerabilities) {
    const tableBody = document.querySelector("#vulnerabilityTable tbody");

    tableBody.innerHTML = "";

    vulnerabilities.forEach(vuln => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${vuln.id}</td>
            <td>${vuln.cve}</td>
            <td>${vuln.hostname}</td>
            <td>
                <span class="badge ${vuln.severity.toLowerCase()}">
                    ${vuln.severity}
                </span>
            </td>
            <td>${vuln.cvssScore}</td>
            <td>
                <span class="status-badge">
                    ${vuln.status}
                </span>
            </td>
            <td>${vuln.assignedTo}</td>
            <td>
                <button class="delete-button" data-id="${vuln.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", async () => {
            const vulnId = button.getAttribute("data-id");

            await fetch(`/api/vulnerabilities/${vulnId}`, {
                method: "DELETE"
            });

            await loadVulnerabilities();
        });
    });
}

loadVulnerabilities();