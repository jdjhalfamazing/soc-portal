const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
        sideMenu.classList.remove("open");
    }
});

async function loadAssetDetails() {

    // Load Asset
    const response = await fetch(`/api/assets/${assetId}`);
    const asset = await response.json();

    document.getElementById("hostname").textContent = asset.hostname;
    document.getElementById("ipAddress").textContent = asset.ipAddress;
    document.getElementById("operatingSystem").textContent = asset.operatingSystem;
    document.getElementById("owner").textContent = asset.owner;
    document.getElementById("criticality").textContent = asset.criticality;
    document.getElementById("status").textContent = asset.status;

    // Load Vulnerabilities
    const vulnerabilityResponse = await fetch("/api/vulnerabilities");
    const vulnerabilities = await vulnerabilityResponse.json();

    const tableBody = document.querySelector("#assetVulnerabilityTable tbody");

    tableBody.innerHTML = "";

    const assetVulnerabilities = vulnerabilities.filter(vuln =>
        vuln.hostname === asset.hostname
    );

    assetVulnerabilities.forEach(vuln => {

        const row = document.createElement("tr");

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

            <td>${vuln.assignedTo}</td>
        `;

        tableBody.appendChild(row);

    });

    // Load Related Alerts
    const alertResponse = await fetch("/api/alerts");
    const alerts = await alertResponse.json();

    const alertTableBody = document.querySelector("#assetAlertsTable tbody");

    alertTableBody.innerHTML = "";

    const relatedAlerts = alerts.filter(alert =>
        alert.host === asset.hostname
    );

    relatedAlerts.forEach(alert => {

        const row = document.createElement("tr");

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

        alertTableBody.appendChild(row);

    });

}

loadAssetDetails();