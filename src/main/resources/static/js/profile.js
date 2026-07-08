const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");

menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
});

document.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    userDropdown.classList.remove("show");
});

userMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    userDropdown.classList.toggle("show");
});