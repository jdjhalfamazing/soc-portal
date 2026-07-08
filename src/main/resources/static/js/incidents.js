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

userMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle("show");
});

document.addEventListener("click", () => {
    userDropdown.classList.remove("show");
});

let allIncidents = [];

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
        sideMenu.classList.remove("open");
    }
});

newIncidentButton.addEventListener("click", () => {
    incidentModal.classList.add("show");
});

cancelIncidentButton.addEventListener("click", () => {
    incidentModal.classList.remove("show");
});

window.addEventListener("click", (event) => {
    if (event.target === incidentModal) {
        incidentModal.classList.remove("show");
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

    await fetch("/api/incidents", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(incident)
    });

    incidentModal.classList.remove("show");

    incidentNumber.value = "";
    incidentTitle.value = "";
    assignedTo.value = "";
    incidentDescription.value = "";

    await loadIncidents();
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

        const matchesPriority =
            priority === "" || incident.priority === priority;

        const matchesStatus =
            status === "" || incident.status === status;

        return matchesSearch && matchesPriority && matchesStatus;
    });

    displayIncidents(filteredIncidents);
}

function displayIncidents(incidents) {
    const tableBody = document.querySelector("#incidentTable tbody");

    tableBody.innerHTML = "";

    incidents.forEach(incident => {
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
                <select class="status-select" data-id="${incident.id}">
                    <option ${incident.status === "Open" ? "selected" : ""}>Open</option>
                    <option ${incident.status === "Investigating" ? "selected" : ""}>Investigating</option>
                    <option ${incident.status === "Closed" ? "selected" : ""}>Closed</option>
                </select>
            </td>
            <td>${incident.assignedTo}</td>
            <td>
                <button class="delete-button" data-id="${incident.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", async () => {
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
        });
    });

    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", async () => {
            const incidentId = button.getAttribute("data-id");

            await fetch(`/api/incidents/${incidentId}`, {
                method: "DELETE"
            });

            await loadIncidents();
        });
    });
}

loadIncidents();