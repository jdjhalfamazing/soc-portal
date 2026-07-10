const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");

menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    sideMenu.classList.toggle("open");
});

userMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle("show");
});

document.addEventListener("click", (event) => {
    if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
        sideMenu.classList.remove("open");
    }

    if (!userDropdown.contains(event.target) && !userMenuButton.contains(event.target)) {
        userDropdown.classList.remove("show");
    }
});

async function loadAssetDetails() {
    const response = await fetch(`/api/assets/${assetId}/relationships`);

    if (!response.ok) {
        throw new Error(`Failed to load asset relationships: ${response.status}`);
    }

    const relationships = await response.json();

    const asset = relationships.asset;
    const vulnerabilities = relationships.vulnerabilities || [];
    const alerts = relationships.alerts || [];
    const incidents = relationships.incidents || [];

    displayAssetInformation(asset);
    displayVulnerabilities(vulnerabilities);
    displayAlerts(alerts);
    displayIncidents(incidents);
}

function displayAssetInformation(asset) {
    document.getElementById("hostname").textContent = asset.hostname;
    document.getElementById("ipAddress").textContent = asset.ipAddress;
    document.getElementById("operatingSystem").textContent = asset.operatingSystem;
    document.getElementById("owner").textContent = asset.owner;
    document.getElementById("criticality").textContent = asset.criticality;
    document.getElementById("status").textContent = asset.status;
}

function displayVulnerabilities(vulnerabilities) {
    const tableBody = document.querySelector("#assetVulnerabilityTable tbody");
    tableBody.innerHTML = "";

    if (vulnerabilities.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">No related vulnerabilities found.</td>
            </tr>
        `;
        return;
    }

    vulnerabilities.forEach(vuln => {
        const row = document.createElement("tr");

        row.style.cursor = "pointer";

        row.addEventListener("click", () => {
            window.location.href = `/vulnerabilities/${vuln.id}`;
        });

        row.innerHTML = `
            <td>${vuln.id}</td>
            <td>${vuln.cve}</td>
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
            <td>${vuln.assignedTo || "Unassigned"}</td>
        `;

        tableBody.appendChild(row);
    });
}

function displayAlerts(alerts) {
    const tableBody = document.querySelector("#assetAlertsTable tbody");
    tableBody.innerHTML = "";

    if (alerts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No related alerts found.</td>
            </tr>
        `;
        return;
    }

    alerts.forEach(alert => {
        const row = document.createElement("tr");

        row.style.cursor = "pointer";

        row.addEventListener("click", () => {
            window.location.href = `/alerts/${alert.id}`;
        });

        row.innerHTML = `
            <td>${alert.id}</td>
            <td>
                <span class="badge ${alert.severity.toLowerCase()}">
                    ${alert.severity}
                </span>
            </td>
            <td>${alert.title}</td>
            <td>
                <span class="status-badge">
                    ${alert.status}
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function displayIncidents(incidents) {
    const tableBody = document.querySelector("#assetIncidentsTable tbody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    if (incidents.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">No related incidents found.</td>
            </tr>
        `;
        return;
    }

    incidents.forEach(incident => {
        const row = document.createElement("tr");

        row.style.cursor = "pointer";

        row.addEventListener("click", () => {
            window.location.href = `/incidents/${incident.id}`;
        });

        row.innerHTML = `
            <td>${incident.id}</td>
            <td>${incident.incidentNumber}</td>
            <td>${incident.title}</td>
            <td>
                <span class="badge ${incident.priority.toLowerCase()}">
                    ${incident.priority}
                </span>
            </td>
            <td>
                <span class="status-badge">
                    ${incident.status}
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

loadAssetDetails().catch(error => {
    console.error(error);
});