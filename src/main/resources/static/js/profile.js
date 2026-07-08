const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");
const notificationButton = document.getElementById("notificationButton");
const notificationDropdown = document.getElementById("notificationDropdown");
const clearNotificationsButton = document.getElementById("clearNotificationsButton");
const notificationCount = document.getElementById("notificationCount");

notificationButton.addEventListener("click", (event) => {
    event.stopPropagation();
    notificationDropdown.classList.toggle("show");
});

clearNotificationsButton.addEventListener("click", (event) => {
    event.stopPropagation();

    document.querySelectorAll(".notification-item").forEach(item => {
        item.remove();
    });

    notificationCount.textContent = "0";
    notificationCount.style.display = "none";
});

document.addEventListener("click", () => {
    notificationDropdown.classList.remove("show");
});

menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    sideMenu.classList.toggle("open");
});

userMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle("show");
});

document.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    userDropdown.classList.remove("show");
});