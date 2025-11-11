// Utility
function showMessage(msg, type = "success") {
  const el = document.getElementById("message");
  el.textContent = msg;
  el.className = type;
  setTimeout(() => {
    el.textContent = "";
    el.className = "";
  }, 3000);
}

// Authentication state
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Page state management
function showLoginPage() {
  document.getElementById("login-page").style.display = "flex";
  document.getElementById("signup-page").style.display = "none";
  document.getElementById("main-content").style.display = "none";
  document.getElementById("main-nav").style.display = "none";
}

function showSignupPage() {
  console.log("showSignupPage called");
  document.getElementById("login-page").style.display = "none";
  document.getElementById("signup-page").style.display = "flex";
  document.getElementById("main-content").style.display = "none";
  document.getElementById("main-nav").style.display = "none";
}

function showMainContent() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("signup-page").style.display = "none";
  document.getElementById("main-content").style.display = "block";
  document.getElementById("main-nav").style.display = "flex";
  updateAuthUI();
}

function updateAuthUI() {
  const authButtons = document.querySelector(".auth-buttons");
  const userWelcome = document.getElementById("user-welcome");
  const welcomeUsername = document.getElementById("welcome-username");
  const logoutBtn = document.getElementById("logout-btn");

  if (currentUser) {
    authButtons.style.display = "none";
    userWelcome.style.display = "flex";
    logoutBtn.style.display = "block";
    welcomeUsername.textContent = currentUser.username;
  } else {
    authButtons.style.display = "flex";
    userWelcome.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

// Form switching functions
function showSignupForm() {
  console.log("showSignupForm called");
  showSignupPage();
}

function showLoginForm() {
  console.log("showLoginForm called");
  showLoginPage();
}

// Main authentication functions
async function handleMainLogin(e) {
  e.preventDefault();
  const username = document.getElementById("main-login-username").value;
  const password = document.getElementById("main-login-password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      showMainContent();
      showMessage("Login successful!");
      // Initialize CRUD data
      fetchResources();
      fetchUsers();
      fetchReviews();
    } else {
      showMessage(data.error, "error");
    }
  } catch (err) {
    showMessage("Login failed", "error");
  }
}

async function handleMainSignup(e) {
  e.preventDefault();
  const username = document.getElementById("main-signup-username").value;
  const password = document.getElementById("main-signup-password").value;
  const isAdmin = parseInt(
    document.getElementById("main-signup-isAdmin").value
  );

  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, isAdmin }),
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      showMainContent();
      showMessage("Registration successful!");
      // Initialize CRUD data
      fetchResources();
      fetchUsers();
      fetchReviews();
    } else {
      showMessage(data.error, "error");
    }
  } catch (err) {
    showMessage("Registration failed", "error");
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  showLoginPage();
  showMessage("Logged out successfully");
}

// Modal functions (for backup)
function showLoginModal() {
  document.getElementById("login-modal").style.display = "block";
}

function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
  document.getElementById("login-form").reset();
}

function showRegisterModal() {
  document.getElementById("register-modal").style.display = "block";
}

function closeRegisterModal() {
  document.getElementById("register-modal").style.display = "none";
  document.getElementById("register-form").reset();
}

// Close modals when clicking outside
window.onclick = function (event) {
  const loginModal = document.getElementById("login-modal");
  const registerModal = document.getElementById("register-modal");
  if (event.target === loginModal) {
    closeLoginModal();
  }
  if (event.target === registerModal) {
    closeRegisterModal();
  }
};

// Legacy authentication functions (for modals)
async function login(e) {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateAuthUI();
      closeLoginModal();
      showMessage("Login successful!");
    } else {
      showMessage(data.error, "error");
    }
  } catch (err) {
    showMessage("Login failed", "error");
  }
}

async function register(e) {
  e.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  const isAdmin = parseInt(document.getElementById("register-isAdmin").value);

  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, isAdmin }),
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateAuthUI();
      closeRegisterModal();
      showMessage("Registration successful!");
    } else {
      showMessage(data.error, "error");
    }
  } catch (err) {
    showMessage("Registration failed", "error");
  }
}

// Attach event listeners
document
  .getElementById("main-login-form")
  .addEventListener("submit", handleMainLogin);
document
  .getElementById("main-signup-form")
  .addEventListener("submit", handleMainSignup);
document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("register-form").addEventListener("submit", register);

// Add event listeners for navigation and UI elements
document.addEventListener("DOMContentLoaded", function () {
  // Signup/Login navigation
  const showSignupLink = document.getElementById("show-signup-link");
  const showLoginLink = document.getElementById("show-login-link");

  if (showSignupLink) {
    showSignupLink.addEventListener("click", function (e) {
      e.preventDefault();
      showSignupForm();
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      showLoginForm();
    });
  }

  // Modal controls
  const showLoginModalBtn = document.getElementById("show-login-modal-btn");
  const showRegisterModalBtn = document.getElementById(
    "show-register-modal-btn"
  );
  const closeLoginModalBtn = document.getElementById("close-login-modal");
  const closeRegisterModalBtn = document.getElementById("close-register-modal");
  const logoutBtn = document.getElementById("logout-btn");

  if (showLoginModalBtn) {
    showLoginModalBtn.addEventListener("click", showLoginModal);
  }

  if (showRegisterModalBtn) {
    showRegisterModalBtn.addEventListener("click", showRegisterModal);
  }

  if (closeLoginModalBtn) {
    closeLoginModalBtn.addEventListener("click", closeLoginModal);
  }

  if (closeRegisterModalBtn) {
    closeRegisterModalBtn.addEventListener("click", closeRegisterModal);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // User management features
  setupUserSearch();
  setupRefreshUsers();
  setupUserCancel();

  // Resource management features
  setupResourceSearch();
  setupRefreshResources();
  setupClearFilters();
  setupResourceCancel();

  // Initialize map if user is logged in
  if (currentUser) {
    setTimeout(() => {
      initializeResourceMap();
    }, 100);
  }

  // Navbar navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
      const section = this.getAttribute("data-section");
      document.querySelectorAll(".crud-section").forEach((sec) => {
        sec.style.display = sec.id === section ? "" : "none";
      });

      // Initialize map when resources section is shown
      if (section === "resources-section" && currentUser) {
        setTimeout(() => {
          initializeResourceMap();
        }, 100);
      }
    });
  });
});

// Initialize page state
if (currentUser) {
  showMainContent();
  fetchResources();
  fetchUsers();
  fetchReviews();
  // Initialize map after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeResourceMap();
  }, 100);
} else {
  showLoginPage();
}

// ========== RESOURCES CRUD ==========
let resourceMap, resourceMarker;

async function fetchResources() {
  try {
    const res = await fetch("/resources");
    const data = await res.json();
    renderResourceList(data);
    updateResourceMap(data);
  } catch (err) {
    showMessage("Failed to fetch resources", "error");
  }
}

function renderResourceList(resources) {
  const list = document.getElementById("resource-list");
  if (!resources || resources.length === 0) {
    list.innerHTML = '<div class="empty-state">No resources found</div>';
    return;
  }

  list.innerHTML = resources
    .map(
      (r) => `
    <div class="resource-card" data-resource-id="${r.id}">
      <div class="resource-header">
        <div class="resource-info">
          <div class="resource-name">${r.name}</div>
          <div class="resource-category">${r.category}</div>
          <div class="resource-location">${r.region}, ${r.country}</div>
        </div>
        <div class="resource-actions">
          <button class="action-btn edit-btn" data-action="edit" data-resource-id="${
            r.id
          }">Edit</button>
          <button class="action-btn delete-btn" data-action="delete" data-resource-id="${
            r.id
          }">Delete</button>
        </div>
      </div>
      ${
        r.description
          ? `<div class="resource-description">${r.description}</div>`
          : ""
      }
      <div class="resource-meta">
        <div class="resource-coordinates">${
          r.lat
            ? `📍 ${r.lat.toFixed(6)}, ${r.lon.toFixed(6)}`
            : "📍 No coordinates set"
        }</div>
        <div class="resource-recommendations">${
          r.recommendations || 0
        } recommendations</div>
      </div>
    </div>
  `
    )
    .join("");

  setupResourceActionListeners();

  // Update region filter options
  updateRegionFilter(resources);
}

// Function to update region filter dropdown with unique regions
function updateRegionFilter(resources) {
  const regionFilter = document.getElementById("region-filter");
  if (!regionFilter) return;

  // Get unique regions from resources
  const regions = [
    ...new Set(
      resources.map((r) => r.region).filter((region) => region && region.trim())
    ),
  ];

  // Sort regions alphabetically
  regions.sort();

  // Keep the "All Regions" option and add unique regions
  regionFilter.innerHTML = '<option value="">All Regions</option>';

  regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionFilter.appendChild(option);
  });
}

function setupResourceActionListeners() {
  const resourceList = document.getElementById("resource-list");
  if (!resourceList) return;

  resourceList.addEventListener("click", function (e) {
    const target = e.target;
    if (!target.classList.contains("action-btn")) return;

    const action = target.getAttribute("data-action");
    const resourceId = target.getAttribute("data-resource-id");

    if (action === "edit") {
      editResource(parseInt(resourceId));
    } else if (action === "delete") {
      deleteResource(parseInt(resourceId));
    }
  });
}

async function addOrUpdateResource(e) {
  e.preventDefault();
  const id = document.getElementById("resource-id").value;
  const resource = {
    name: document.getElementById("resource-name").value,
    category: document.getElementById("resource-category").value,
    country: document.getElementById("resource-country").value,
    region: document.getElementById("resource-region").value,
    lat: parseFloat(document.getElementById("resource-lat").value) || null,
    lon: parseFloat(document.getElementById("resource-lon").value) || null,
    description: document.getElementById("resource-description").value,
    recommendations:
      parseInt(document.getElementById("resource-recommendations").value) || 0,
  };

  try {
    let resp;
    if (id) {
      resp = await fetch(`/resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
      });
    } else {
      resp = await fetch("/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
      });
    }

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.error || "Failed to save resource");
    }

    showMessage(
      id ? "Resource updated successfully!" : "Resource created successfully!"
    );
    resetResourceForm();
    fetchResources();
  } catch (err) {
    showMessage(err.message, "error");
  }
}

function resetResourceForm() {
  document.getElementById("resource-form").reset();
  document.getElementById("resource-id").value = "";
  document.getElementById("resource-form-title").textContent =
    "Add New Resource";
  document.getElementById("resource-cancel").style.display = "none";
  document.querySelector("#resource-form .submit-btn").textContent =
    "Add Resource";

  // Clear map marker
  if (resourceMarker) {
    resourceMap.removeLayer(resourceMarker);
    resourceMarker = null;
  }
}

async function editResource(id) {
  try {
    const res = await fetch(`/resources/${id}`);
    if (!res.ok) throw new Error("Failed to fetch resource");

    const r = await res.json();
    document.getElementById("resource-id").value = r.id;
    document.getElementById("resource-name").value = r.name;
    document.getElementById("resource-category").value = r.category;
    document.getElementById("resource-country").value = r.country;
    document.getElementById("resource-region").value = r.region;
    document.getElementById("resource-lat").value = r.lat;
    document.getElementById("resource-lon").value = r.lon;
    document.getElementById("resource-description").value = r.description;
    document.getElementById("resource-recommendations").value =
      r.recommendations;
    document.getElementById("resource-form-title").textContent =
      "Edit Resource";
    document.getElementById("resource-cancel").style.display = "block";
    document.querySelector("#resource-form .submit-btn").textContent =
      "Update Resource";

    // Update map marker
    updateMapMarker(r.lat, r.lon);

    // Scroll to form
    document
      .getElementById("resource-form")
      .scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    showMessage("Failed to load resource data", "error");
  }
}

async function deleteResource(id) {
  if (
    !confirm(
      "Are you sure you want to delete this resource? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    const resp = await fetch(`/resources/${id}`, { method: "DELETE" });
    if (!resp.ok) throw new Error("Failed to delete resource");

    showMessage("Resource deleted successfully!");
    fetchResources();
  } catch (err) {
    showMessage("Failed to delete resource", "error");
  }
}

// Map functionality
function initializeResourceMap() {
  if (resourceMap) return; // Already initialized

  resourceMap = L.map("resource-map").setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(resourceMap);

  // Add click handler to set coordinates
  resourceMap.on("click", function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    document.getElementById("resource-lat").value = lat.toFixed(6);
    document.getElementById("resource-lon").value = lng.toFixed(6);

    updateMapMarker(lat, lng);

    // Reverse geocode to get location details
    reverseGeocode(lat, lng);
  });
}

function updateMapMarker(lat, lng) {
  if (resourceMarker) {
    resourceMap.removeLayer(resourceMarker);
  }

  if (lat && lng) {
    resourceMarker = L.marker([lat, lng]).addTo(resourceMap);
    resourceMap.setView([lat, lng], 15);
  }
}

// Reverse geocoding function to get location details from coordinates
async function reverseGeocode(lat, lng) {
  // Show loading indicator
  const regionInput = document.getElementById("resource-region");
  const countryInput = document.getElementById("resource-country");

  if (regionInput) {
    regionInput.placeholder = "Detecting location...";
    regionInput.disabled = true;
  }
  if (countryInput) {
    countryInput.placeholder = "Detecting location...";
    countryInput.disabled = true;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (data.address) {
      // Extract city/region and country
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        data.address.state ||
        data.address.region ||
        "";

      const country = data.address.country || "";

      // Update the form fields
      if (city && regionInput) {
        regionInput.value = city;
      }
      if (country && countryInput) {
        countryInput.value = country;
      }

      // Show a brief success message
      showMessage(`Location detected: ${city}, ${country}`, "success");
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    // Don't show error to user as this is a convenience feature
  } finally {
    // Reset input fields
    if (regionInput) {
      regionInput.placeholder = "Enter region or city";
      regionInput.disabled = false;
    }
    if (countryInput) {
      countryInput.placeholder = "Enter country";
      countryInput.disabled = false;
    }
  }
}

function updateResourceMap(resources) {
  if (!resourceMap) return;

  // Clear existing markers
  resourceMap.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      resourceMap.removeLayer(layer);
    }
  });

  // Add markers for all resources
  resources.forEach((resource) => {
    if (resource.lat && resource.lon) {
      const marker = L.marker([resource.lat, resource.lon])
        .bindPopup(
          `
          <strong>${resource.name}</strong><br>
          ${resource.category}<br>
          ${resource.region}, ${resource.country}
        `
        )
        .addTo(resourceMap);
    }
  });
}

// Search and filter functionality
function setupResourceSearch() {
  const searchInput = document.getElementById("resource-search");
  const categoryFilter = document.getElementById("category-filter");
  const regionFilter = document.getElementById("region-filter");

  if (searchInput) {
    searchInput.addEventListener("input", filterResources);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterResources);
  }

  if (regionFilter) {
    regionFilter.addEventListener("change", filterResources);
  }
}

function filterResources() {
  const searchTerm = document
    .getElementById("resource-search")
    .value.toLowerCase();
  const categoryFilter = document.getElementById("category-filter").value;
  const regionFilter = document.getElementById("region-filter").value;
  const resourceCards = document.querySelectorAll(".resource-card");

  let visibleCount = 0;

  resourceCards.forEach((card) => {
    const name = card.querySelector(".resource-name").textContent.toLowerCase();
    const category = card.querySelector(".resource-category").textContent;
    const location = card
      .querySelector(".resource-location")
      .textContent.toLowerCase();
    const region = card
      .querySelector(".resource-location")
      .textContent.split(",")[0]
      .trim();

    const matchesSearch =
      name.includes(searchTerm) || location.includes(searchTerm);
    const matchesCategory = !categoryFilter || category === categoryFilter;
    const matchesRegion = !regionFilter || region === regionFilter;

    if (matchesSearch && matchesCategory && matchesRegion) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Show message if no results found
  const resourceList = document.getElementById("resource-list");
  const existingMessage = resourceList.querySelector(".no-results-message");

  if (visibleCount === 0 && resourceCards.length > 0) {
    if (!existingMessage) {
      const noResultsMessage = document.createElement("div");
      noResultsMessage.className = "empty-state no-results-message";
      noResultsMessage.textContent =
        "No resources match your current filters. Try adjusting your search criteria.";
      resourceList.appendChild(noResultsMessage);
    }
  } else if (existingMessage) {
    existingMessage.remove();
  }
}

// Refresh resources button
function setupRefreshResources() {
  const refreshBtn = document.getElementById("refresh-resources");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", fetchResources);
  }
}

// Clear filters button
function setupClearFilters() {
  const clearFiltersBtn = document.getElementById("clear-filters");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAllFilters);
  }
}

function clearAllFilters() {
  // Clear search input
  const searchInput = document.getElementById("resource-search");
  if (searchInput) {
    searchInput.value = "";
  }

  // Reset category filter
  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter) {
    categoryFilter.value = "";
  }

  // Reset region filter
  const regionFilter = document.getElementById("region-filter");
  if (regionFilter) {
    regionFilter.value = "";
  }

  // Re-apply filters to show all resources
  filterResources();

  showMessage("All filters cleared", "success");
}

// Resource form cancel button
function setupResourceCancel() {
  const cancelBtn = document.getElementById("resource-cancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", resetResourceForm);
  }
}

// Initialize resource management
document
  .getElementById("resource-form")
  .addEventListener("submit", addOrUpdateResource);

// Add event listeners for coordinate fields to trigger reverse geocoding
document.addEventListener("DOMContentLoaded", function () {
  const latInput = document.getElementById("resource-lat");
  const lonInput = document.getElementById("resource-lon");

  if (latInput && lonInput) {
    // Debounce function to avoid too many API calls
    let geocodeTimeout;

    function triggerGeocoding() {
      const lat = parseFloat(latInput.value);
      const lon = parseFloat(lonInput.value);

      if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
        clearTimeout(geocodeTimeout);
        geocodeTimeout = setTimeout(() => {
          reverseGeocode(lat, lon);
        }, 1000); // Wait 1 second after user stops typing
      }
    }

    latInput.addEventListener("input", triggerGeocoding);
    lonInput.addEventListener("input", triggerGeocoding);
  }
});

// ========== USERS CRUD ==========
async function fetchUsers() {
  try {
    const res = await fetch("/users");
    const data = await res.json();
    renderUserList(data);
  } catch (err) {
    showMessage("Failed to fetch users", "error");
  }
}

function renderUserList(users) {
  const list = document.getElementById("user-list");
  if (!users || users.length === 0) {
    list.innerHTML = '<div class="empty-state">No users found</div>';
    return;
  }

  list.innerHTML = users
    .map(
      (u) => `
    <div class="user-card" data-user-id="${u.id}">
      <div class="user-info">
        <div class="user-name">${u.username}</div>
        <div class="user-role ${u.isAdmin ? "admin" : "regular"}">
          ${u.isAdmin ? "Administrator" : "Regular User"}
        </div>
      </div>
      <div class="user-actions">
        <button class="action-btn edit-btn" data-action="edit" data-user-id="${
          u.id
        }">Edit</button>
        <button class="action-btn delete-btn" data-action="delete" data-user-id="${
          u.id
        }">Delete</button>
      </div>
    </div>
  `
    )
    .join("");

  // Add event listeners for edit and delete buttons
  setupUserActionListeners();
}

function setupUserActionListeners() {
  const userList = document.getElementById("user-list");
  if (!userList) return;

  userList.addEventListener("click", function (e) {
    const target = e.target;
    if (!target.classList.contains("action-btn")) return;

    const action = target.getAttribute("data-action");
    const userId = target.getAttribute("data-user-id");

    if (action === "edit") {
      editUser(parseInt(userId));
    } else if (action === "delete") {
      deleteUser(parseInt(userId));
    }
  });
}

async function addOrUpdateUser(e) {
  e.preventDefault();
  const id = document.getElementById("user-id").value;
  const user = {
    username: document.getElementById("user-username").value,
    password: document.getElementById("user-password").value,
    isAdmin: parseInt(document.getElementById("user-isAdmin").value),
  };

  try {
    let resp;
    if (id) {
      resp = await fetch(`/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
    } else {
      resp = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
    }

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.error || "Failed to save user");
    }

    showMessage(
      id ? "User updated successfully!" : "User created successfully!"
    );
    resetUserForm();
    fetchUsers();
  } catch (err) {
    showMessage(err.message, "error");
  }
}

function resetUserForm() {
  document.getElementById("user-form").reset();
  document.getElementById("user-id").value = "";
  document.getElementById("user-form-title").textContent = "Add New User";
  document.getElementById("user-cancel").style.display = "none";
  document.querySelector("#user-form .submit-btn").textContent = "Add User";
}

async function editUser(id) {
  console.log("editUser called with id:", id);
  try {
    const res = await fetch(`/users/${id}`);
    if (!res.ok) throw new Error("Failed to fetch user");

    const u = await res.json();
    console.log("User data received:", u);

    document.getElementById("user-id").value = u.id;
    document.getElementById("user-username").value = u.username;
    document.getElementById("user-password").value = ""; // Don't show password
    document.getElementById("user-isAdmin").value = u.isAdmin;
    document.getElementById("user-form-title").textContent = "Edit User";
    document.getElementById("user-cancel").style.display = "block";
    document.querySelector("#user-form .submit-btn").textContent =
      "Update User";

    // Scroll to form
    document.getElementById("user-form").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    console.error("Error in editUser:", err);
    showMessage("Failed to load user data", "error");
  }
}

async function deleteUser(id) {
  console.log("deleteUser called with id:", id);
  if (
    !confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    )
  ) {
    return;
  }

  try {
    const resp = await fetch(`/users/${id}`, { method: "DELETE" });
    if (!resp.ok) throw new Error("Failed to delete user");

    showMessage("User deleted successfully!");
    fetchUsers();
  } catch (err) {
    console.error("Error in deleteUser:", err);
    showMessage("Failed to delete user", "error");
  }
}

// User search functionality
function setupUserSearch() {
  const searchInput = document.getElementById("user-search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const userCards = document.querySelectorAll(".user-card");

      userCards.forEach((card) => {
        const username = card
          .querySelector(".user-name")
          .textContent.toLowerCase();
        const role = card.querySelector(".user-role").textContent.toLowerCase();

        if (username.includes(searchTerm) || role.includes(searchTerm)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
}

// Refresh users button
function setupRefreshUsers() {
  const refreshBtn = document.getElementById("refresh-users");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", fetchUsers);
  }
}

// User form cancel button
function setupUserCancel() {
  const cancelBtn = document.getElementById("user-cancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", resetUserForm);
  }
}

// Initialize user management
document
  .getElementById("user-form")
  .addEventListener("submit", addOrUpdateUser);

// ========== REVIEWS CRUD ==========
async function fetchReviews() {
  const res = await fetch("/reviews");
  const data = await res.json();
  renderReviewList(data);
}

function renderReviewList(reviews) {
  const list = document.getElementById("review-list");
  list.innerHTML =
    reviews
      .map(
        (r) => `
    <div>
      <b>Resource:</b> ${r.resource_id} <b>User:</b> ${r.user_id}<br>
      ${r.review}
      <button onclick="editReview(${r.id})">Edit</button>
      <button onclick="deleteReview(${r.id})">Delete</button>
    </div>
  `
      )
      .join("") || "<i>No reviews</i>";
}

async function addOrUpdateReview(e) {
  e.preventDefault();
  const id = document.getElementById("review-id").value;
  const review = {
    resource_id: parseInt(document.getElementById("review-resource_id").value),
    review: document.getElementById("review-review").value,
    user_id: parseInt(document.getElementById("review-user_id").value),
  };
  try {
    let resp;
    if (id) {
      resp = await fetch(`/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
    } else {
      resp = await fetch("/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
    }
    if (!resp.ok) throw new Error("Failed to save review");
    showMessage("Review saved!");
    document.getElementById("review-form").reset();
    document.getElementById("review-id").value = "";
    document.getElementById("review-cancel").style.display = "none";
    fetchReviews();
  } catch (err) {
    showMessage(err.message, "error");
  }
}

async function editReview(id) {
  const res = await fetch(`/reviews/${id}`);
  const r = await res.json();
  document.getElementById("review-id").value = r.id;
  document.getElementById("review-resource_id").value = r.resource_id;
  document.getElementById("review-review").value = r.review;
  document.getElementById("review-user_id").value = r.user_id;
  document.getElementById("review-cancel").style.display = "";
}

async function deleteReview(id) {
  if (!confirm("Delete this review?")) return;
  const resp = await fetch(`/reviews/${id}`, { method: "DELETE" });
  if (resp.ok) {
    showMessage("Review deleted!");
    fetchReviews();
  } else {
    showMessage("Failed to delete", "error");
  }
}
document.getElementById("review-form").onsubmit = addOrUpdateReview;
document.getElementById("review-cancel").onclick = function () {
  document.getElementById("review-form").reset();
  document.getElementById("review-id").value = "";
  this.style.display = "none";
};

// Initial fetch
fetchResources();
fetchUsers();
fetchReviews();
