const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const incidentModal = document.getElementById("incidentModal");
const newIncidentButton = document.getElementById("newIncidentButton");
const saveIncidentButton = document.getElementById("saveIncidentButton");
const cancelIncidentButton = document.getElementById("cancelIncidentButton");

const incidentNumber = document.getElementById("incidentNumber");
const incidentTitle = document.getElementById("incidentTitle");
const incidentPriority = document.getElementById("incidentPriority");
const incidentStatus = document.getElementById("incidentStatus");
const assignedTo = document.getElementById("assignedTo");
const incidentDescription = document.getElementById("incidentDescription");

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");

const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");

let allIncidents = [];
let editingIncidentId = null;

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

newIncidentButton.addEventListener("click", () => {
    editingIncidentId = null;
    saveIncidentButton.textContent = "Save Incident";

    incidentNumber.value = "";
    incidentTitle.value = "";
    incidentPriority.value = "Critical";
    incidentStatus.value = "Open";
    assignedTo.value = "";
    incidentDescription.value = "";

    incidentModal.classList.add("show");
});

cancelIncidentButton.addEventListener("click", () => {
    incidentModal.classList.remove("show");
    editingIncidentId = null;
    saveIncidentButton.textContent = "Save Incident";
});

window.addEventListener("click", (event) => {
    if (event.target === incidentModal) {
        incidentModal.classList.remove("show");
        editingIncidentId = null;
        saveIncidentButton.textContent = "Save Incident";
    }
});

saveIncidentButton.addEventListener("click", async () => {
    const incident = {
        incidentNumber: incidentNumber.value,
        title: incidentTitle.value,
        priority: incidentPriority.value,
        status: incidentStatus.value,
        assignedTo: assignedTo.value,
        description: incidentDescription.value
    };

    if (editingIncidentId === null) {
        await fetch("/api/incidents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(incident)
        });
    } else {
        await fetch(`/api/incidents/${editingIncidentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(incident)
        });
    }

    incidentModal.classList.remove("show");

    editingIncidentId = null;
    saveIncidentButton.textContent = "Save Incident";

    incidentNumber.value = "";
    incidentTitle.value = "";
    assignedTo.value = "";
    incidentDescription.value = "";

    await loadIncidents();

    if (typeof loadNotifications === "function") {
        await loadNotifications();
    }
});

searchInput.addEventListener("input", filterIncidents);
priorityFilter.addEventListener("change", filterIncidents);
statusFilter.addEventListener("change", filterIncidents);

async function loadIncidents() {
    const response = await fetch("/api/incidents");
    allIncidents = await response.json();

    displayIncidents(allIncidents);
}

function filterIncidents() {
    const search = searchInput.value.toLowerCase();
    const priority = priorityFilter.value;
    const status = statusFilter.value;

    const filteredIncidents = allIncidents.filter(incident => {
        const matchesSearch =
            incident.incidentNumber.toLowerCase().includes(search) ||
            incident.title.toLowerCase().includes(search) ||
            incident.priority.toLowerCase().includes(search) ||
            incident.status.toLowerCase().includes(search) ||
            incident.assignedTo.toLowerCase().includes(search);

        const matchesPriority = priority === "" || incident.priority === priority;
        const matchesStatus = status === "" || incident.status === status;

        return matchesSearch && matchesPriority && matchesStatus;
    });

    displayIncidents(filteredIncidents);
}

function displayIncidents(incidents) {
    const tableBody = document.querySelector("#incidentTable tbody");
    tableBody.innerHTML = "";

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
            <td><span class="badge ${incident.priority.toLowerCase()}">${incident.priority}</span></td>
            <td>
                <select class="status-select" data-id="${incident.id}">
                    <option ${incident.status === "Open" ? "selected" : ""}>Open</option>
                    <option ${incident.status === "Investigating" ? "selected" : ""}>Investigating</option>
                    <option ${incident.status === "Closed" ? "selected" : ""}>Closed</option>
                </select>
            </td>
            <td>${incident.assignedTo}</td>
          <td>
    <div class="action-buttons">
        <button class="edit-button" data-id="${incident.id}">
            Edit
        </button>

        <button class="delete-button" data-id="${incident.id}">
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
            const incidentId = Number(button.getAttribute("data-id"));
            const incident = allIncidents.find(item => item.id === incidentId);

            editingIncidentId = incident.id;

            incidentNumber.value = incident.incidentNumber;
            incidentTitle.value = incident.title;
            incidentPriority.value = incident.priority;
            incidentStatus.value = incident.status;
            assignedTo.value = incident.assignedTo;
            incidentDescription.value = incident.description;

            saveIncidentButton.textContent = "Update Incident";

            incidentModal.classList.add("show");
        });
    });

    document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", async (event) => {
            event.stopPropagation();
            const incidentId = select.getAttribute("data-id");

            await fetch(`/api/incidents/${incidentId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: select.value
                })
            });

            await loadIncidents();

            if (typeof loadNotifications === "function") {
                await loadNotifications();
            }
        });
    });

    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", async (event) => {
            event.stopPropagation();
            const incidentId = button.getAttribute("data-id");

            await fetch(`/api/incidents/${incidentId}`, {
                method: "DELETE"
            });

            await loadIncidents();

            if (typeof loadNotifications === "function") {
                await loadNotifications();
            }
        });
    });
}

loadIncidents();