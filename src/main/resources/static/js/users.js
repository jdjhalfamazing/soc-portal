const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

const userMenuButton = document.getElementById("userMenuButton");
const userDropdown = document.getElementById("userDropdown");

const modal = document.getElementById("userModal");
const newUserButton = document.getElementById("newUserButton");
const cancelUserButton = document.getElementById("cancelUserButton");
const saveUserButton = document.getElementById("saveUserButton");
const userModalTitle = document.getElementById("userModalTitle");

const newUsername = document.getElementById("newUsername");
const newFullName = document.getElementById("newFullName");
const newEmail = document.getElementById("newEmail");
const newDepartment = document.getElementById("newDepartment");
const newPassword = document.getElementById("newPassword");
const newRole = document.getElementById("newRole");
const newUserStatus = document.getElementById("newUserStatus");

const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const statusFilter = document.getElementById("statusFilter");

let allUsers = [];
let editingUserId = null;

menuButton.addEventListener("click", e => {
    e.stopPropagation();
    sideMenu.classList.toggle("open");
});

userMenuButton.addEventListener("click", e => {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
});

document.addEventListener("click", e => {
    if (!sideMenu.contains(e.target) && !menuButton.contains(e.target))
        sideMenu.classList.remove("open");

    if (!userDropdown.contains(e.target) && !userMenuButton.contains(e.target))
        userDropdown.classList.remove("show");
});

newUserButton.addEventListener("click", () => {

    editingUserId = null;

    userModalTitle.textContent = "Create User";
    saveUserButton.textContent = "Save User";

    newUsername.value = "";
    newFullName.value = "";
    newEmail.value = "";
    newDepartment.value = "";
    newPassword.value = "";
    newRole.value = "ANALYST";
    newUserStatus.value = "Active";

    modal.classList.add("show");
});

cancelUserButton.addEventListener("click", () => {
    modal.classList.remove("show");
});

window.addEventListener("click", e => {
    if (e.target === modal)
        modal.classList.remove("show");
});

saveUserButton.addEventListener("click", async () => {
    const user = {
        username: newUsername.value.trim(),
        fullName: newFullName.value.trim(),
        email: newEmail.value.trim(),
        department: newDepartment.value.trim(),
        password: newPassword.value,
        role: newRole.value,
        status: newUserStatus.value
    };

    if (!user.username || !user.fullName || !user.email) {
        alert("Username, full name, and email are required.");
        return;
    }

    if (editingUserId === null && !user.password) {
        alert("A password is required for new users.");
        return;
    }

    const url = editingUserId === null
        ? "/api/users"
        : `/api/users/${editingUserId}`;

    const method = editingUserId === null ? "POST" : "PUT";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("User save failed:", response.status, errorText);

            alert(`Unable to save user. Server returned ${response.status}.`);
            return;
        }

        modal.classList.remove("show");
        editingUserId = null;

        await loadUsers();

        if (typeof loadNotifications === "function") {
            await loadNotifications();
        }
    } catch (error) {
        console.error("User save error:", error);
        alert("Unable to connect to the server.");
    }
});

searchInput.addEventListener("input", filterUsers);
roleFilter.addEventListener("change", filterUsers);
statusFilter.addEventListener("change", filterUsers);

async function loadUsers() {

    const response = await fetch("/api/users");

    allUsers = await response.json();

    displayUsers(allUsers);
}

function filterUsers() {

    const search = searchInput.value.toLowerCase();

    const role = roleFilter.value;

    const status = statusFilter.value;

    const filtered = allUsers.filter(user => {

        const matchesSearch =
            user.username.toLowerCase().includes(search) ||
            user.fullName.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search);

        const matchesRole =
            role === "" || user.role === role;

        const matchesStatus =
            status === "" || user.status === status;

        return matchesSearch && matchesRole && matchesStatus;

    });

    displayUsers(filtered);

}

function displayUsers(users) {

    const tbody = document.querySelector("#userTable tbody");

    tbody.innerHTML = "";

    users.forEach(user => {

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.department}</td>
        <td>${user.role}</td>
        <td>${user.status}</td>
        <td>${user.createdDate ?? ""}</td>
        <td>${user.lastLogin ?? "Never"}</td>
        <td>
    <div class="action-buttons">
        <button class="edit-button" data-id="${user.id}">
            Edit
        </button>

        <button class="delete-button" data-id="${user.id}">
            Delete
        </button>
    </div>
</td>
        `;

        tbody.appendChild(row);

    });

    document.querySelectorAll(".edit-button").forEach(button => {

        button.addEventListener("click", e => {

            e.stopPropagation();

            const user = allUsers.find(
                u => u.id == button.dataset.id
            );

            editingUserId = user.id;

            userModalTitle.textContent = "Edit User";
            saveUserButton.textContent = "Update User";

            newUsername.value = user.username;
            newFullName.value = user.fullName;
            newEmail.value = user.email;
            newDepartment.value = user.department;
            newPassword.value = "";
            newRole.value = user.role;
            newUserStatus.value = user.status;

            modal.classList.add("show");

        });

    });

    document.querySelectorAll(".delete-button").forEach(button => {

        button.addEventListener("click", async e => {

            e.stopPropagation();

            await fetch(`/api/users/${button.dataset.id}`, {
                method: "DELETE"
            });

            loadUsers();

            if (typeof loadNotifications === "function")
                loadNotifications();

        });

    });

}

loadUsers();