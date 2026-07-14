const notificationButton = document.getElementById("notificationButton");
const notificationDropdown = document.getElementById("notificationDropdown");
const notificationList = document.getElementById("notificationList");
const clearNotificationsButton = document.getElementById("clearNotificationsButton");
const notificationCount = document.getElementById("notificationCount");

if (notificationButton && notificationDropdown) {
    notificationButton.addEventListener("click", (event) => {
        event.stopPropagation();
        notificationDropdown.classList.toggle("show");
    });
}

if (clearNotificationsButton) {
    clearNotificationsButton.addEventListener("click", async (event) => {
        event.stopPropagation();

        try {
            const response = await fetch("/api/notifications", {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(`Failed to clear notifications: ${response.status}`);
            }

            await loadNotifications();
        } catch (error) {
            console.error(error);
        }
    });
}

document.addEventListener("click", (event) => {
    if (
        notificationDropdown &&
        notificationButton &&
        !notificationDropdown.contains(event.target) &&
        !notificationButton.contains(event.target)
    ) {
        notificationDropdown.classList.remove("show");
    }
});

async function loadNotifications() {
    if (!notificationList || !notificationCount) {
        return;
    }

    try {
        const response = await fetch("/api/notifications");

        if (!response.ok) {
            throw new Error(`Failed to load notifications: ${response.status}`);
        }

        const notifications = await response.json();

        notificationList.innerHTML = "";

        notificationCount.textContent = notifications.length;

        if (notifications.length === 0) {
            notificationCount.style.display = "none";
        } else {
            notificationCount.style.display = "inline-block";
        }

        notifications.forEach(notification => {
            const item = document.createElement("div");

            item.className =
                `notification-item ${notification.type || "info"}`;

            item.innerHTML = `
                <strong>${notification.title || "Notification"}</strong>
                <p>${notification.message || ""}</p>
            `;

            notificationList.appendChild(item);
        });
    } catch (error) {
        console.error(error);
    }
}

if (notificationList && notificationCount) {
    loadNotifications();
    setInterval(loadNotifications, 5000);
}