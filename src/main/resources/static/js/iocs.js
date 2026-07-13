const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");

const iocModal = document.getElementById("iocModal");
const iocModalTitle = document.getElementById("iocModalTitle");
const newIocButton = document.getElementById("newIocButton");
const saveIocButton = document.getElementById("saveIocButton");
const cancelIocButton = document.getElementById("cancelIocButton");

const newIocValue = document.getElementById("newIocValue");
const newIocType = document.getElementById("newIocType");
const newThreatLevel = document.getElementById("newThreatLevel");
const newIocStatus = document.getElementById("newIocStatus");
const newIocSource = document.getElementById("newIocSource");
const newIocDescription = document.getElementById("newIocDescription");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const threatLevelFilter = document.getElementById("threatLevelFilter");
const statusFilter = document.getElementById("statusFilter");

let allIocs = [];
let editingIocId = null;

// =========================
// Shared menus
// =========================

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

// =========================
// Modal helpers
// =========================

function resetIocForm() {
    editingIocId = null;

    iocModalTitle.textContent = "Create IOC";
    saveIocButton.textContent = "Save IOC";

    newIocValue.value = "";
    newIocType.value = "IP Address";
    newThreatLevel.value = "Critical";
    newIocStatus.value = "Active";
    newIocSource.value = "";
    newIocDescription.value = "";
}

newIocButton.addEventListener("click", () => {
    resetIocForm();
    iocModal.classList.add("show");
});

cancelIocButton.addEventListener("click", () => {
    iocModal.classList.remove("show");
    resetIocForm();
});

window.addEventListener("click", (event) => {
    if (event.target === iocModal) {
        iocModal.classList.remove("show");
        resetIocForm();
    }
});

// =========================
// Create and update
// =========================

saveIocButton.addEventListener("click", async () => {
    const indicator = {
        value: newIocValue.value.trim(),
        type: newIocType.value,
        threatLevel: newThreatLevel.value,
        status: newIocStatus.value,
        source: newIocSource.value.trim(),
        description: newIocDescription.value.trim()
    };

    if (!indicator.value) {
        alert("Indicator value is required.");
        return;
    }

    const url = editingIocId === null
        ? "/api/iocs"
        : `/api/iocs/${editingIocId}`;

    const method = editingIocId === null ? "POST" : "PUT";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(indicator)
        });

        if (!response.ok) {
            throw new Error(`Failed to save IOC: ${response.status}`);
        }

        iocModal.classList.remove("show");
        resetIocForm();

        await loadIocs();

        if (typeof loadNotifications === "function") {
            await loadNotifications();
        }
    } catch (error) {
        console.error(error);
        alert("Unable to save the IOC.");
    }
});

// =========================
// Search and filters
// =========================

searchInput.addEventListener("input", filterIocs);
typeFilter.addEventListener("change", filterIocs);
threatLevelFilter.addEventListener("change", filterIocs);
statusFilter.addEventListener("change", filterIocs);

async function loadIocs() {
    try {
        const response = await fetch("/api/iocs");

        if (!response.ok) {
            throw new Error(`Failed to load IOCs: ${response.status}`);
        }

        allIocs = await response.json();
        displayIocs(allIocs);
    } catch (error) {
        console.error(error);
    }
}

function filterIocs() {
    const search = searchInput.value.trim().toLowerCase();
    const type = typeFilter.value;
    const threatLevel = threatLevelFilter.value;
    const status = statusFilter.value;

    const filteredIocs = allIocs.filter(ioc => {
        const value = (ioc.value || "").toLowerCase();
        const iocType = (ioc.type || "").toLowerCase();
        const source = (ioc.source || "").toLowerCase();
        const description = (ioc.description || "").toLowerCase();

        const matchesSearch =
            value.includes(search) ||
            iocType.includes(search) ||
            source.includes(search) ||
            description.includes(search);

        const matchesType = type === "" || ioc.type === type;
        const matchesThreatLevel =
            threatLevel === "" || ioc.threatLevel === threatLevel;
        const matchesStatus = status === "" || ioc.status === status;

        return matchesSearch &&
            matchesType &&
            matchesThreatLevel &&
            matchesStatus;
    });

    displayIocs(filteredIocs);
}

// =========================
// Display
// =========================

function displayIocs(iocs) {
    const tableBody = document.querySelector("#iocTable tbody");
    tableBody.innerHTML = "";

    if (iocs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8">No indicators of compromise found.</td>
            </tr>
        `;
        return;
    }

    iocs.forEach(ioc => {
        const row = document.createElement("tr");
        row.style.cursor = "pointer";

        row.addEventListener("click", () => {
            window.location.href = `/iocs/${ioc.id}`;
        });

        const threatClass = (ioc.threatLevel || "low").toLowerCase();

        row.innerHTML = `
            <td>${ioc.id}</td>
            <td>${ioc.value || ""}</td>
            <td>${ioc.type || ""}</td>
            <td>
                <span class="badge ${threatClass}">
                    ${ioc.threatLevel || ""}
                </span>
            </td>
            <td>
                <span class="status-badge">
                    ${ioc.status || ""}
                </span>
            </td>
            <td>${ioc.source || "Unknown"}</td>
            <td>${ioc.description || "No description"}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-button" data-id="${ioc.id}">
                        Edit
                    </button>

                    <button class="delete-button" data-id="${ioc.id}">
                        Delete
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });

    attachEditListeners();
    attachDeleteListeners();
}

function attachEditListeners() {
    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();

            const iocId = Number(button.getAttribute("data-id"));
            const ioc = allIocs.find(item => item.id === iocId);

            if (!ioc) {
                return;
            }

            editingIocId = ioc.id;

            iocModalTitle.textContent = "Edit IOC";
            saveIocButton.textContent = "Update IOC";

            newIocValue.value = ioc.value || "";
            newIocType.value = ioc.type || "IP Address";
            newThreatLevel.value = ioc.threatLevel || "Critical";
            newIocStatus.value = ioc.status || "Active";
            newIocSource.value = ioc.source || "";
            newIocDescription.value = ioc.description || "";

            iocModal.classList.add("show");
        });
    });
}

function attachDeleteListeners() {
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", async (event) => {
            event.stopPropagation();

            const iocId = button.getAttribute("data-id");

            try {
                const response = await fetch(`/api/iocs/${iocId}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error(`Failed to delete IOC: ${response.status}`);
                }

                await loadIocs();

                if (typeof loadNotifications === "function") {
                    await loadNotifications();
                }
            } catch (error) {
                console.error(error);
                alert("Unable to delete the IOC.");
            }
        });
    });
}

loadIocs();