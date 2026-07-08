const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const assetModal = document.getElementById("assetModal");
const newAssetButton = document.getElementById("newAssetButton");
const saveAssetButton = document.getElementById("saveAssetButton");
const cancelAssetButton = document.getElementById("cancelAssetButton");

const newHostname = document.getElementById("newHostname");
const newIpAddress = document.getElementById("newIpAddress");
const newOperatingSystem = document.getElementById("newOperatingSystem");
const newOwner = document.getElementById("newOwner");
const newCriticality = document.getElementById("newCriticality");
const newAssetStatus = document.getElementById("newAssetStatus");

const searchInput = document.getElementById("searchInput");
const criticalityFilter = document.getElementById("criticalityFilter");
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

let allAssets = [];

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    if (!sideMenu.contains(event.target) && !menuButton.contains(event.target)) {
        sideMenu.classList.remove("open");
    }
});

newAssetButton.addEventListener("click", () => {
    assetModal.classList.add("show");
});

cancelAssetButton.addEventListener("click", () => {
    assetModal.classList.remove("show");
});

window.addEventListener("click", (event) => {
    if (event.target === assetModal) {
        assetModal.classList.remove("show");
    }
});

saveAssetButton.addEventListener("click", async () => {
    const asset = {
        hostname: newHostname.value,
        ipAddress: newIpAddress.value,
        operatingSystem: newOperatingSystem.value,
        owner: newOwner.value,
        criticality: newCriticality.value,
        status: newAssetStatus.value
    };

    await fetch("/api/assets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(asset)
    });

    assetModal.classList.remove("show");

    newHostname.value = "";
    newIpAddress.value = "";
    newOperatingSystem.value = "";
    newOwner.value = "";

    await loadAssets();
});

searchInput.addEventListener("input", filterAssets);
criticalityFilter.addEventListener("change", filterAssets);
statusFilter.addEventListener("change", filterAssets);

async function loadAssets() {
    const response = await fetch("/api/assets");
    allAssets = await response.json();

    displayAssets(allAssets);
}

function filterAssets() {
    const search = searchInput.value.toLowerCase();
    const criticality = criticalityFilter.value;
    const status = statusFilter.value;

    const filteredAssets = allAssets.filter(asset => {
        const matchesSearch =
            asset.hostname.toLowerCase().includes(search) ||
            asset.ipAddress.toLowerCase().includes(search) ||
            asset.operatingSystem.toLowerCase().includes(search) ||
            asset.owner.toLowerCase().includes(search);

        const matchesCriticality =
            criticality === "" || asset.criticality === criticality;

        const matchesStatus =
            status === "" || asset.status === status;

        return matchesSearch && matchesCriticality && matchesStatus;
    });

    displayAssets(filteredAssets);
}

function displayAssets(assets) {
    const tableBody = document.querySelector("#assetTable tbody");

    tableBody.innerHTML = "";

    assets.forEach(asset => {
        const row = document.createElement("tr");

        row.style.cursor = "pointer";

        row.addEventListener("click", () => {
            window.location.href = `/assets/${asset.id}`;
        });

        row.innerHTML = `
            <td>${asset.id}</td>
            <td>${asset.hostname}</td>
            <td>${asset.ipAddress}</td>
            <td>${asset.operatingSystem}</td>
            <td>${asset.owner}</td>
            <td>
                <span class="badge ${asset.criticality.toLowerCase()}">
                    ${asset.criticality}
                </span>
            </td>
            <td>
                <span class="status-badge">
                    ${asset.status}
                </span>
            </td>
            <td>
                <button class="delete-button" data-id="${asset.id}">
                    Delete
                </button>
            </td>
        `;
        row.style.cursor = "pointer";

        row.addEventListener("click", () => {
            window.location.href = `/assets/${asset.id}`;
        });

        tableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", async (event) => {
            event.stopPropagation();

            const assetId = button.getAttribute("data-id");

            await fetch(`/api/assets/${assetId}`, {
                method: "DELETE"
            });

            await loadAssets();
        });
    });
}

loadAssets();