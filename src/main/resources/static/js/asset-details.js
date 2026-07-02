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
    const response = await fetch(`/api/assets/${assetId}`);
    const asset = await response.json();

    document.getElementById("hostname").textContent = asset.hostname;
    document.getElementById("ipAddress").textContent = asset.ipAddress;
    document.getElementById("operatingSystem").textContent = asset.operatingSystem;
    document.getElementById("owner").textContent = asset.owner;
    document.getElementById("criticality").textContent = asset.criticality;
    document.getElementById("status").textContent = asset.status;
}

loadAssetDetails();