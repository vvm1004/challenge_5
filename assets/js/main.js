// ==================== Initial Variables ====================
const toggleBtn = document.getElementById("toggle-mode");
const body = document.body;
const modeText = toggleBtn?.querySelector("span");
const modeIcon = toggleBtn?.querySelector("img");

let darkMode = false;

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const errorBox = document.getElementById("error");

// ==================== Event Listeners ====================

// Toggle light/dark mode when button is clicked
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        body.classList.toggle("dark-mode-body");
        darkMode = !darkMode;

        if (darkMode) {
            modeText.textContent = "LIGHT";
            modeIcon.src = "./assets/icons/icon-sun.svg";
            modeIcon.alt = "Sun Icon";
            toggleDarkStyles(true);
        } else {
            modeText.textContent = "DARK";
            modeIcon.src = "./assets/icons/icon-moon.svg";
            modeIcon.alt = "Moon Icon";
            toggleDarkStyles(false);
        }
    });
}

// Handle search button click
searchBtn.addEventListener("click", () => {
    const username = searchInput.value.trim();
    if (!username) return;
    updateProfileFromUsername(username);
});

// Handle Enter key press in search input
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// ==================== Main Logic Functions ====================

// Fetch GitHub user data by username
async function updateProfileFromUsername(username) {
    try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        updateProfile(data);
        errorBox.style.display = "none";
    } catch (err) {
        errorBox.style.display = "block";
    }
}

// Update UI with GitHub user data
function updateProfile(data) {
    document.getElementById("avatar").src = data.avatar_url;
    document.getElementById("bio").textContent = data.bio || "This profile has no bio";

    document.querySelectorAll(".profile-card__name").forEach(el => {
        el.textContent = data.name || data.login;
    });

    document.querySelectorAll(".profile-card__username").forEach(el => {
        el.textContent = "@" + data.login;
        el.href = data.html_url;
    });

    const joinDate = new Date(data.created_at);
    document.querySelectorAll(".profile-card__date").forEach(el => {
        el.textContent = `Joined ${joinDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })}`;
    });

    document.getElementById("repos").textContent = data.public_repos;
    document.getElementById("followers").textContent = data.followers;
    document.getElementById("following").textContent = data.following;

    // Update additional fields
    applyTextOrUnavailable("location", data.location);
    applyTextOrUnavailable("twitter", data.twitter_username ? "@" + data.twitter_username : null);
    applyTextOrUnavailable("website", data.blog);
    applyTextOrUnavailable("company", data.company);
}

// ==================== Utility Functions ====================

// Toggle styles for dark mode
function toggleDarkStyles(enable) {
    const darkTextElements = document.querySelectorAll(".profile-card__link span, .header__text, .header__icon span, .search-box input, .profile-card__name, .profile-card__stat strong");
    const darkBackgroundElements = document.querySelectorAll(".search-box, .profile-card");
    const darkModeBodyElements = document.querySelectorAll(".profile-card__stats");

    darkTextElements.forEach(el => {
        if (el.classList.contains("not-available")) return;
        el.classList.toggle("whiteText", enable);
    });

    darkBackgroundElements.forEach(el => {
        el.classList.toggle("dark-background", enable);
    });

    darkModeBodyElements.forEach(el => {
        el.classList.toggle("dark-mode-body", enable);
    });

    const icons = document.querySelectorAll(".icon");
    icons.forEach(icon => {
        if (icon.classList.contains("not-available-icon")) return;
        icon.classList.toggle("whiteImg", enable);
    });
}

// Display value or fallback to "Not Available"
function applyTextOrUnavailable(id, value) {
    const el = document.getElementById(id);
    const icon = el?.previousElementSibling;

    if (!value) {
        el.textContent = "Not Available";
        el.classList.add("not-available");
        if (icon && icon.classList.contains("icon")) {
            icon.classList.add("not-available-icon");
        }
    } else {
        el.textContent = value;
        el.classList.remove("not-available");
        if (icon && icon.classList.contains("icon")) {
            icon.classList.remove("not-available-icon");
        }
    }
}

// ==================== Initial Load ====================

// Load default user profile on startup
updateProfileFromUsername("octocat");
