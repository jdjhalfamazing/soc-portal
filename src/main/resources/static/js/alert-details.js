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

async function loadAlertDetails() {

    const response = await fetch(`/api/alerts/${alertId}/details`);
    const data = await response.json();

    const alert = data.alert;
    const relatedAsset = data.relatedAsset;

    document.getElementById("alertId").textContent = alert.id;
    document.getElementById("severity").textContent = alert.severity;
    document.getElementById("host").textContent = alert.host;
    document.getElementById("title").textContent = alert.title;
    document.getElementById("status").textContent = alert.status;

    const assetLink = document.getElementById("relatedAssetLink");

    if (relatedAsset) {
        assetLink.textContent = relatedAsset.hostname;
        assetLink.href = `/assets/${relatedAsset.id}`;
    } else {
        assetLink.textContent = "No Related Asset";
        assetLink.removeAttribute("href");
    }
}

loadAlertDetails();