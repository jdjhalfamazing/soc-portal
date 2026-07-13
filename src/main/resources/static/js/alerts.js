const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const modal = document.getElementById("alertModal");
const newAlertButton = document.getElementById("newAlertButton");
const cancelButton = document.getElementById("cancelButton");
const saveAlertButton = document.getElementById("saveAlertButton");

const newSeverity = document.getElementById("newSeverity");
const newHost = document.getElementById("newHost");
const newIndicator = document.getElementById("newIndicator");
const newTitle = document.getElementById("newTitle");
const newStatus = document.getElementById("newStatus");

const searchInput = document.getElementById("searchInput");
const severityFilter = document.getElementById("severityFilter");
const statusFilter = document.getElementById("statusFilter");

const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");

let allAlerts = [];
let editingAlertId = null;

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
    editingAlertId = null;

    saveAlertButton.textContent = "Save Alert";

    newSeverity.value = "Critical";
    newHost.value = "";
    newIndicator.value = "";
    newTitle.value = "";
    newStatus.value = "Open";

    modal.classList.add("show");
});

cancelButton.addEventListener("click", () => {
    modal.classList.remove("show");
    editingAlertId = null;
    saveAlertButton.textContent = "Save Alert";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.remove("show");
        editingAlertId = null;
        saveAlertButton.textContent = "Save Alert";
    }
});

saveAlertButton.addEventListener("click", async () => {
    const alert = {
        severity: newSeverity.value,
        host: newHost.value,
        indicator: newIndicator.value.trim(),
        title: newTitle.value,
        status: newStatus.value
    };

    if (editingAlertId === null) {
        await fetch("/api/alerts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(alert)
        });
    } else {
        await fetch(`/api/alerts/${editingAlertId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(alert)
        });
    }

    modal.classList.remove("show");

    editingAlertId = null;
    saveAlertButton.textContent = "Save Alert";

    newHost.value = "";
    newIndicator.value = "";
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
            (alert.indicator || "").toLowerCase().includes(search) ||
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

        row.style.cursor = "pointer";

        row.addEventListener("click", () => {
            window.location.href = `/alerts/${alert.id}`;
        });

        row.innerHTML = `
            <td>${alert.id}</td>
            <td><span class="badge ${alert.severity.toLowerCase()}">${alert.severity}</span></td>
            <td>${alert.host}</td>
            <td>${alert.indicator || "None"}</td>
            <td>${alert.title}</td>
            <td>
                <select class="status-select" data-id="${alert.id}">
                    <option ${alert.status === "Open" ? "selected" : ""}>Open</option>
                    <option ${alert.status === "Investigating" ? "selected" : ""}>Investigating</option>
                    <option ${alert.status === "Closed" ? "selected" : ""}>Closed</option>
                </select>
            </td>
          <td>
    <div class="action-buttons">
        <button class="edit-button" data-id="${alert.id}">
            Edit
        </button>

        <button class="delete-button" data-id="${alert.id}">
            Delete
        </button>
    </div>
</td>
        `;

        tableBody.appendChild(row);
    });

    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", (event) => {

            event.stopPropagation();

            const alertId = Number(button.getAttribute("data-id"));
            const alert = allAlerts.find(item => item.id === alertId);

            editingAlertId = alert.id;

            newSeverity.value = alert.severity;
            newHost.value = alert.host;
            newIndicator.value = alert.indicator || "";
            newTitle.value = alert.title;
            newStatus.value = alert.status;

            saveAlertButton.textContent = "Update Alert";

            modal.classList.add("show");
        });
    });

    document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", async (event) => {

            event.stopPropagation();
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
        button.addEventListener("click", async (event) => {

            event.stopPropagation();
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