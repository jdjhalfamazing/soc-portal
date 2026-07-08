const savedTheme = localStorage.getItem("theme") || "dark";

document.body.classList.remove("dark-theme", "light-theme");
document.body.classList.add(savedTheme + "-theme");