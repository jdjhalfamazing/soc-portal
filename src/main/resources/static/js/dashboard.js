const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

let allAlerts = [];

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
        sideMenu.classList.remove("open");
    }
});

async function loadDashboard() {
    const response = await fetch("/api/alerts");
    allAlerts = await response.json();
    const incidentResponse = await fetch("/api/incidents");
    const incidents = await incidentResponse.json();
    const assetResponse = await fetch("/api/assets");
    const assets = await assetResponse.json();

    displayAssetSummary(assets);

    displayLatestIncidents(incidents);

    displaySummary(allAlerts);
    displayLatestAlerts(allAlerts);
}

function displaySummary(alerts) {
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    let total = alerts.length;
    let open = 0;
    let investigating = 0;
    let closed = 0;

    alerts.forEach(alert => {
        if (alert.severity === "Critical") critical++;
        else if (alert.severity === "High") high++;
        else if (alert.severity === "Medium") medium++;
        else if (alert.severity === "Low") low++;

        if (alert.status === "Open") open++;
        else if (alert.status === "Investigating") investigating++;
        else if (alert.status === "Closed") closed++;
    });

    document.getElementById("criticalCount").textContent = critical;
    document.getElementById("highCount").textContent = high;
    document.getElementById("mediumCount").textContent = medium;
    document.getElementById("lowCount").textContent = low;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("openCount").textContent = open;
    document.getElementById("investigatingCount").textContent = investigating;
    document.getElementById("closedCount").textContent = closed;
}

function displayLatestAlerts(alerts) {
    const tableBody = document.querySelector("#alertsTable tbody");

    tableBody.innerHTML = "";

    const latestAlerts = alerts.slice(-5).reverse();

    latestAlerts.forEach(alert => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${alert.id}</td>
            <td>
                <span class="badge ${alert.severity.toLowerCase()}">
                    ${alert.severity}
                </span>
            </td>
            <td>${alert.host}</td>
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

function displayLatestIncidents(incidents) {
    const tableBody = document.querySelector("#incidentsTable tbody");

    tableBody.innerHTML = "";

    const latestIncidents = incidents.slice(-5).reverse();

    latestIncidents.forEach(incident => {
        const row = document.createElement("tr");

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
            <td>${incident.assignedTo}</td>
        `;

        tableBody.appendChild(row);
    });
}
function displayAssetSummary(assets) {
    let active = 0;

    assets.forEach(asset => {
        if (asset.status === "Active") {
            active++;
        }
    });

    document.getElementById("assetCount").textContent = assets.length;
    document.getElementById("activeAssetCount").textContent = active;
}

loadDashboard();