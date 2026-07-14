(() => {
    const menuButton = document.getElementById("menuButton");
    const sideMenu = document.getElementById("sideMenu");

    const userMenuButton = document.getElementById("userMenuButton");
    const userDropdown = document.getElementById("userDropdown");

    if (menuButton && sideMenu) {
        menuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            sideMenu.classList.toggle("open");
        });
    }

    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener("click", (event) => {
            event.stopPropagation();
            userDropdown.classList.toggle("show");
        });
    }

    document.addEventListener("click", (event) => {
        if (
            sideMenu &&
            menuButton &&
            !sideMenu.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            sideMenu.classList.remove("open");
        }

        if (
            userDropdown &&
            userMenuButton &&
            !userDropdown.contains(event.target) &&
            !userMenuButton.contains(event.target)
        ) {
            userDropdown.classList.remove("show");
        }
    });
})();