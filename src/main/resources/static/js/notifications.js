const notificationButton = document.getElementById("notificationButton");
const notificationDropdown = document.getElementById("notificationDropdown");
const notificationList = document.getElementById("notificationList");
const clearNotificationsButton = document.getElementById("clearNotificationsButton");
const notificationCount = document.getElementById("notificationCount");

notificationButton.addEventListener("click", (event) => {
    event.stopPropagation();
    notificationDropdown.classList.toggle("show");
});

clearNotificationsButton.addEventListener("click", async (event) => {
    event.stopPropagation();

    await fetch("/api/notifications", {
        method: "DELETE"
    });

    await loadNotifications();
});

async function loadNotifications() {
    const response = await fetch("/api/notifications");
    const notifications = await response.json();

    notificationList.innerHTML = "";
    notificationCount.textContent = notifications.length;

    notifications.forEach(notification => {
        const item = document.createElement("div");
        item.className = `notification-item ${notification.type}`;

        item.innerHTML = `
            <strong>${notification.title}</strong>
            <p>${notification.message}</p>
        `;

        notificationList.appendChild(item);
    });
}

loadNotifications();
setInterval(loadNotifications, 5000);