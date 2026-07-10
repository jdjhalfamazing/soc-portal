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

async function loadIncidentDetails() {
    const response = await fetch(`/api/incidents/${incidentId}`);

    if (!response.ok) {
        throw new Error(`Failed to load incident: ${response.status}`);
    }

    const incident = await response.json();

    document.getElementById("incidentId").textContent = incident.id;
    document.getElementById("incidentNumber").textContent =
        incident.incidentNumber || "N/A";
    document.getElementById("incidentTitle").textContent =
        incident.title || "N/A";
    document.getElementById("incidentPriority").textContent =
        incident.priority || "N/A";
    document.getElementById("incidentStatus").textContent =
        incident.status || "N/A";
    document.getElementById("assignedTo").textContent =
        incident.assignedTo || "Unassigned";
    document.getElementById("incidentDescription").textContent =
        incident.description || "No description provided.";
}

loadIncidentDetails().catch(error => {
    console.error(error);
});