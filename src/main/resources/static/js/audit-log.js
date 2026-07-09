const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");

const searchInput = document.getElementById("searchInput");
const actionFilter = document.getElementById("actionFilter");
const moduleFilter = document.getElementById("moduleFilter");

let allLogs = [];

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

searchInput.addEventListener("input", filterLogs);
actionFilter.addEventListener("change", filterLogs);
moduleFilter.addEventListener("change", filterLogs);

async function loadAuditLogs() {
    const response = await fetch("/api/audit-logs");
    allLogs = await response.json();

    displayLogs(allLogs.reverse());
}

function filterLogs() {
    const search = searchInput.value.toLowerCase();
    const action = actionFilter.value;
    const module = moduleFilter.value;

    const filtered = allLogs.filter(log => {
        const matchesSearch =
            log.username.toLowerCase().includes(search) ||
            log.action.toLowerCase().includes(search) ||
            log.module.toLowerCase().includes(search) ||
            log.details.toLowerCase().includes(search);

        const matchesAction = action === "" || log.action === action;
        const matchesModule = module === "" || log.module === module;

        return matchesSearch && matchesAction && matchesModule;
    });

    displayLogs(filtered);
}

function displayLogs(logs) {
    const tableBody = document.querySelector("#auditLogTable tbody");
    tableBody.innerHTML = "";

    logs.forEach(log => {
        const row = document.createElement("tr");
        const date = new Date(log.timestamp).toLocaleString();

        row.innerHTML = `
            <td>${date}</td>
            <td>${log.username}</td>
            <td><span class="status-badge">${log.action}</span></td>
            <td>${log.module}</td>
            <td>${log.details}</td>
        `;

        tableBody.appendChild(row);
    });
}

loadAuditLogs();