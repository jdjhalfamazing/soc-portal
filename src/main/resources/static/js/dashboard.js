let alertChart;
let incidentChart;
let vulnerabilityChart;
let assetChart;
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
    const vulnerabilityResponse = await fetch("/api/vulnerabilities");
    const vulnerabilities = await vulnerabilityResponse.json();

    displayVulnerabilitySummary(vulnerabilities);

    displayAssetSummary(assets);

    displayLatestIncidents(incidents);

    displaySummary(allAlerts);
    displayLatestAlerts(allAlerts);
    renderAlertChart(allAlerts);
    renderIncidentChart(incidents);
    renderVulnerabilityChart(vulnerabilities);
    renderAssetChart(assets);
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

function displayVulnerabilitySummary(vulnerabilities) {
    let critical = 0;
    let open = 0;

    vulnerabilities.forEach(vuln => {
        if (vuln.severity === "Critical") {
            critical++;
        }

        if (vuln.status === "Open") {
            open++;
        }
    });

    document.getElementById("criticalVulnerabilityCount").textContent = critical;
    document.getElementById("openVulnerabilityCount").textContent = open;
}

function renderAlertChart(alerts) {
    if (alertChart) alertChart.destroy();

    let critical = 0, high = 0, medium = 0, low = 0;

    alerts.forEach(alert => {
        if (alert.severity === "Critical") critical++;
        else if (alert.severity === "High") high++;
        else if (alert.severity === "Medium") medium++;
        else if (alert.severity === "Low") low++;
    });

    alertChart = new Chart(document.getElementById("alertChart"), {
        type: "doughnut",
        data: {
            labels: ["Critical", "High", "Medium", "Low"],
            datasets: [{
                data: [critical, high, medium, low]
            }]
        }
    });
}

function renderIncidentChart(incidents) {
    if (incidentChart) incidentChart.destroy();

    let open = 0, investigating = 0, closed = 0;

    incidents.forEach(incident => {
        if (incident.status === "Open") open++;
        else if (incident.status === "Investigating") investigating++;
        else if (incident.status === "Closed") closed++;
    });

    incidentChart = new Chart(document.getElementById("incidentChart"), {
        type: "doughnut",
        data: {
            labels: ["Open", "Investigating", "Closed"],
            datasets: [{
                data: [open, investigating, closed]
            }]
        }
    });
}

function renderVulnerabilityChart(vulnerabilities) {
    if (vulnerabilityChart) vulnerabilityChart.destroy();

    let critical = 0, high = 0, medium = 0, low = 0;

    vulnerabilities.forEach(vuln => {
        if (vuln.severity === "Critical") critical++;
        else if (vuln.severity === "High") high++;
        else if (vuln.severity === "Medium") medium++;
        else if (vuln.severity === "Low") low++;
    });

    vulnerabilityChart = new Chart(document.getElementById("vulnerabilityChart"), {
        type: "doughnut",
        data: {
            labels: ["Critical", "High", "Medium", "Low"],
            datasets: [{
                data: [critical, high, medium, low]
            }]
        }
    });
}

function renderAssetChart(assets) {
    if (assetChart) assetChart.destroy();

    let active = 0, offline = 0, retired = 0;

    assets.forEach(asset => {
        if (asset.status === "Active") active++;
        else if (asset.status === "Offline") offline++;
        else if (asset.status === "Retired") retired++;
    });

    assetChart = new Chart(document.getElementById("assetChart"), {
        type: "doughnut",
        data: {
            labels: ["Active", "Offline", "Retired"],
            datasets: [{
                data: [active, offline, retired]
            }]
        }
    });
}

loadDashboard();

