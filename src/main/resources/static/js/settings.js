(() => {
    const themeSelect = document.getElementById("themeSelect");

    if (!themeSelect) {
        return;
    }

    const savedTheme = localStorage.getItem("theme") || "dark";

    themeSelect.value = savedTheme;

    themeSelect.addEventListener("change", () => {
        const selectedTheme = themeSelect.value;

        document.body.classList.remove("dark-theme", "light-theme");
        document.body.classList.add(`${selectedTheme}-theme`);

        localStorage.setItem("theme", selectedTheme);
    });
})();