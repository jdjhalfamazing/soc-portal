const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const modal = document.getElementById("alertModal");
const newAlertButton = document.getElementById("newAlertButton");
const cancelButton = document.getElementById("cancelButton");
const saveAlertButton = document.getElementById("saveAlertButton");

const newSeverity = document.getElementById("newSeverity");
const newHost = document.getElementById("newHost");
const newTitle = document.getElementById("newTitle");
const newStatus = document.getElementById("newStatus");

const searchInput = document.getElementById("searchInput");
const severityFilter = document.getElementById("severityFilter");
const statusFilter = document.getElementById("statusFilter");

const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");

let allAlerts = [];

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

newAlertButton.addEventListener("click", () => {
    modal.classList.add("show");
});

cancelButton.addEventListener("click", () => {
    modal.classList.remove("show");
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

saveAlertButton.addEventListener("click", async () => {
    const alert = {
        severity: newSeverity.value,
        host: newHost.value,
        title: newTitle.value,
        status: newStatus.value
    };

    await fetch("/api/alerts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(alert)
    });

    modal.classList.remove("show");

    newHost.value = "";
    newTitle.value = "";

    await loadAlerts();

    if (typeof loadNotifications === "function") {
        await loadNotifications();
    }
});

searchInput.addEventListener("input", filterAlerts);
severityFilter.addEventListener("change", filterAlerts);
statusFilter.addEventListener("change", filterAlerts);

async function loadAlerts() {
    const response = await fetch("/api/alerts");
    allAlerts = await response.json();

    displayAlerts(allAlerts);
}

function filterAlerts() {
    const search = searchInput.value.toLowerCase();
    const severity = severityFilter.value;
    const status = statusFilter.value;

    const filteredAlerts = allAlerts.filter(alert => {
        const matchesSearch =
            alert.host.toLowerCase().includes(search) ||
            alert.title.toLowerCase().includes(search) ||
            alert.severity.toLowerCase().includes(search) ||
            alert.status.toLowerCase().includes(search);

        const matchesSeverity = severity === "" || alert.severity === severity;
        const matchesStatus = status === "" || alert.status === status;

        return matchesSearch && matchesSeverity && matchesStatus;
    });

    displayAlerts(filteredAlerts);
}

function displayAlerts(alerts) {
    const tableBody = document.querySelector("#alertsTable tbody");
    tableBody.innerHTML = "";

    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
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

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${alert.id}</td>
            <td><span class="badge ${alert.severity.toLowerCase()}">${alert.severity}</span></td>
            <td>${alert.host}</td>
            <td>${alert.title}</td>
            <td>
                <select class="status-select" data-id="${alert.id}">
                    <option ${alert.status === "Open" ? "selected" : ""}>Open</option>
                    <option ${alert.status === "Investigating" ? "selected" : ""}>Investigating</option>
                    <option ${alert.status === "Closed" ? "selected" : ""}>Closed</option>
                </select>
            </td>
            <td>
                <button class="delete-button" data-id="${alert.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", async () => {
            const alertId = select.getAttribute("data-id");

            await fetch(`/api/alerts/${alertId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: select.value
                })
            });

            await loadAlerts();

            if (typeof loadNotifications === "function") {
                await loadNotifications();
            }
        });
    });

    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", async () => {
            const alertId = button.getAttribute("data-id");

            await fetch(`/api/alerts/${alertId}`, {
                method: "DELETE"
            });

            await loadAlerts();

            if (typeof loadNotifications === "function") {
                await loadNotifications();
            }
        });
    });

    document.getElementById("criticalCount").textContent = critical;
    document.getElementById("highCount").textContent = high;
    document.getElementById("mediumCount").textContent = medium;
    document.getElementById("lowCount").textContent = low;

    document.getElementById("totalCount").textContent = alerts.length;
    document.getElementById("openCount").textContent = open;
    document.getElementById("investigatingCount").textContent = investigating;
    document.getElementById("closedCount").textContent = closed;
}

loadAlerts();