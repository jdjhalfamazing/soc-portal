async function loadIocDetails() {
    const response = await fetch(`/api/iocs/${iocId}`);

    if (!response.ok) {
        throw new Error(`Failed to load IOC: ${response.status}`);
    }

    const ioc = await response.json();

    document.getElementById("iocIdDisplay").textContent = ioc.id;
    document.getElementById("iocValue").textContent = ioc.value || "N/A";
    document.getElementById("iocType").textContent = ioc.type || "N/A";
    document.getElementById("threatLevel").textContent =
        ioc.threatLevel || "N/A";
    document.getElementById("iocStatus").textContent =
        ioc.status || "N/A";
    document.getElementById("iocSource").textContent =
        ioc.source || "Unknown";
    document.getElementById("iocDescription").textContent =
        ioc.description || "No description provided.";
}

loadIocDetails().catch(error => {
    console.error(error);
});