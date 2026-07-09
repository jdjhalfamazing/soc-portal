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

async function loadAuditLogs() {
    const response = await fetch("/api/audit-logs");
    const logs = await response.json();

    const tableBody = document.querySelector("#auditLogTable tbody");
    tableBody.innerHTML = "";

    logs.reverse().forEach(log => {
        const row = document.createElement("tr");
        const date = new Date(log.timestamp).toLocaleString();

        row.innerHTML = `
            <td>${date}</td>
            <td>${log.username}</td>
            <td>${log.action}</td>
            <td>${log.module}</td>
            <td>${log.details}</td>
        `;

        tableBody.appendChild(row);
    });
}

loadAuditLogs();