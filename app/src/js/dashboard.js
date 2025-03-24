import {
  API_BASE_URL,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  RESPONSE_TYPE,
  ROLES,
} from "../constants/common.js";
import { formatDOB, handleError, showToast } from "../utils/common.js";
import { validateUserForm } from "./validation.js";

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const artistModalTitle = document.getElementById("artistModalTitle");
  const userModalTitle = document.getElementById("userModalTitle");
  const password = document.querySelector(".password");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    });
  }

  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("authToken");

  // Define tab visibility based on roles
  const tabConfig = {
    super_admin: ["users-tab", "artists-tab"],
    artist_manager: ["artists-tab"],
  };

  const allowedTabs = tabConfig[userRole] || [];

  // Hide all tabs initially
  document.querySelectorAll(".tab").forEach((button) => {
    const tabTarget = button.dataset.tabTarget.replace("#", "");
    if (!allowedTabs.includes(tabTarget)) {
      button.style.display = "none";
      document.getElementById(tabTarget)?.classList.add("hidden");
    }
  });

  // Get visible tabs after filtering
  const visibleTabs = document.querySelectorAll(
    ".tab:not([style*='display: none'])"
  );
  const visiblePanels = document.querySelectorAll(".tabPanel:not(.hidden)");

  function activateTab(index) {
    visibleTabs.forEach((tab) => tab.classList.remove("active"));
    visiblePanels.forEach((panel) => panel.classList.remove("active"));

    visibleTabs[index].classList.add("active");
    visiblePanels[index].classList.add("active");
  }

  // Activate the first visible tab by default
  if (visibleTabs.length > 0) {
    activateTab(0);
  }

  // Add event listener for tab switching
  visibleTabs.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      activateTab(index);
    });
  });

  let currentPage = { users: DEFAULT_PAGE, artists: DEFAULT_PAGE };

  const prevButtons = {
    users: document.getElementById("prevUsersPage"),
    artists: document.getElementById("prevArtistsPage"),
  };

  const nextButtons = {
    users: document.getElementById("nextUsersPage"),
    artists: document.getElementById("nextArtistsPage"),
  };

  const pageNumberDisplays = {
    users: document.getElementById("usersPageNumber"),
    artists: document.getElementById("artistsPageNumber"),
  };

  const containers = {
    users: document.getElementById("userContainer"),
    artists: document.getElementById("artistContainer"),
  };

  async function fetchData(type) {
    try {
      const page = currentPage[type];
      const { data } = await axios.get(`${API_BASE_URL}/${type}`, {
        params: { page, limit: DEFAULT_PAGE_SIZE },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (type === "users") {
        renderUsersTable(type, data.data);
      }

      if (type === "artists") {
        renderArtistsTable(type, data.data);
      }

      pageNumberDisplays[type].textContent = page;
      prevButtons[type].disabled = currentPage[type] === 1;
      nextButtons[type].disabled =
        page * DEFAULT_PAGE_SIZE >= data.meta.total || data.data.length === 0;
    } catch (error) {
      handleError(error);
    }
  }

  function renderUsersTable(type, data) {
    const container = containers[type];
    container.innerHTML = "";
    const table = document.createElement("table");
    table.classList.add(`${type}-table`);

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Address</th>
        <th>DOB</th>
        <th>Gender</th>
        <th>Role</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.firstName} ${item.lastName}</td>
        <td>${item.email}</td>
        <td>${item.phone || "N/A"}</td>
        <td>${item.address || "N/A"}</td>
        <td>${formatDOB(item.dob)}</td>
        <td>${item.gender || "N/A"}</td>
        <td>${item.role}</td>
        <td>
          <button id="editBtn" data-id="${item.id}">Edit</button>
          <button id="deleteBtn" data-id="${item.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  function renderArtistsTable(type, data) {
    const container = containers[type];
    container.innerHTML = "";
    const table = document.createElement("table");
    table.classList.add(`${type}-table`);

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th>DOB</th>
        <th>Gender</th>
        <th>First Release Year</th>
        <th>No. of Albums released</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.forEach((item) => {
      const row = document.createElement("tr");

      if (userRole === ROLES.SUPER_ADMIN) {
        row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.address}</td>
        <td>${formatDOB(item.dob)}</td>
        <td>${item.gender || "N/A"}</td>
        <td>${item.firstReleaseYear || "N/A"}</td>
        <td>${item.noOfAlbumsReleased}</td>
        <td>
          <button id="viewSongsBtn" data-id="${item.id}">View songs</button>
          </td>
      `;
      }

      if (userRole === ROLES.ARTIST_MANAGER) {
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.address}</td>
          <td>${formatDOB(item.dob)}</td>
          <td>${item.gender || "N/A"}</td>
          <td>${item.firstReleaseYear || "N/A"}</td>
          <td>${item.noOfAlbumsReleased}</td>
          <td>
            <button id="editArtistBtn" data-id="${item.id}">Edit</button>
            <button id="deleteArtistBtn" data-id="${item.id}">Delete</button>
            <button id="viewSongsBtn" data-id="${item.id}">View songs</button>
          </td>
        `;
      }
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  Object.keys(prevButtons).forEach((type) => {
    prevButtons[type].addEventListener("click", () => {
      if (currentPage[type] > 1) {
        currentPage[type]--;
        fetchData(type);
      }
    });

    nextButtons[type].addEventListener("click", () => {
      currentPage[type]++;
      fetchData(type);
    });
  });

  if (userRole === ROLES.SUPER_ADMIN) {
    fetchData("users");
    fetchData("artists");
    document.getElementById("createArtistBtn").style.display = "none";
  } else if (userRole === ROLES.ARTIST_MANAGER) {
    fetchData("artists");
  }

  // Create user
  const modal = document.getElementById("userModal");
  const createBtn = document.getElementById("createBtn");

  const closeBtn = document.querySelector(".close");
  const saveButton = document.getElementById("saveBtn");
  let editingUserId = null;

  createBtn.onclick = function () {
    clearUserForm();
    modal.style.display = "flex";
    editingUserId = null;
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "editBtn") {
      userModalTitle.textContent = "Edit User";
      password.style.display = "none";
      const userId = event.target.dataset.id;
      fetchUserDetails(userId);
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "deleteBtn") {
      const userId = event.target.dataset.id;
      deleteUser(userId);
    }
  });

  // Delete user
  async function deleteUser(userId) {
    try {
      if (confirm("Are you sure you want to delete this user?")) {
        await axios.delete(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        showToast("User deleted successfully", RESPONSE_TYPE.SUCCESS);
        fetchData("users");
      }
    } catch (error) {
      handleError(error);
    }
  }

  async function fetchUserDetails(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const user = response.data;
      firstName.value = user.firstName || "";
      lastName.value = user.lastName || "";
      email.value = user.email || "";
      phone.value = user.phone || "";
      dob.value = user.dob ? user.dob.split("T")[0] : "";
      gender.value = user.gender || "";
      address.value = user.address || "";
      role.value = user.role || "";
      editingUserId = userId;
      userModal.style.display = "flex";
    } catch (error) {
      handleError(error);
    }
  }

  function clearUserForm() {
    firstName.value = "";
    lastName.value = "";
    email.value = "";
    phone.value = "";
    dob.value = "";
    gender.value = "";
    address.value = "";
    password.value = "";
    role.value = "";
  }

  saveButton.addEventListener("click", async (event) => {
    event.preventDefault();

    // Collect form data
    const fields = {
      firstName: document.getElementById("firstName"),
      lastName: document.getElementById("lastName"),
      email: document.getElementById("email"),
      password: document.getElementById("password"),
      phone: document.getElementById("phone"),
      role: document.getElementById("role"),
      dob: document.getElementById("dob"),
      address: document.getElementById("address"),
      gender: document.getElementById("gender"),
    };

    if (!validateUserForm(fields, !!editingUserId)) return;

    const userData = {
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      email: fields.email.value,
      phone: fields.phone.value,
      role: fields.role.value,
      dob: fields.dob.value,
      address: fields.address.value,
      gender: fields.gender.value,
    };

    if (!editingUserId && fields.password.value) {
      userData.password = fields.password.value;
    }

    try {
      if (editingUserId) {
        // Update existing user
        await axios.put(`${API_BASE_URL}/users/${editingUserId}`, userData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        showToast("User updated successfully", RESPONSE_TYPE.SUCCESS);
      } else {
        // Create new user
        await axios.post(`${API_BASE_URL}/users`, userData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        showToast("User created successfully", RESPONSE_TYPE.SUCCESS);
      }

      userModal.style.display = "none";
      fetchData("users");
    } catch (error) {
      handleError(error);
    }
  });

  // create ARtist
  const artistModal = document.getElementById("artistModal");
  const createArtistBtn = document.getElementById("createArtistBtn");
  const closeArtistBtn = document.querySelector(".closeArtist");
  const saveArtistBtn = document.getElementById("saveArtistBtn");
  let editingArtistId = null;

  const artistName = document.getElementById("artistName");
  const artistEmail = document.getElementById("artistEmail");
  const artistGender = document.getElementById("artistGender");
  const artistAddress = document.getElementById("artistAddress");
  const artistDOB = document.getElementById("artistDOB");
  const firstReleaseYear = document.getElementById("firstReleaseYear");
  const albumsReleased = document.getElementById("albumsReleased");

  // Open Artist Modal
  createArtistBtn.onclick = function () {
    clearArtistForm();
    artistModal.style.display = "flex";
    editingArtistId = null;
  };

  // Close Artist Modal
  closeArtistBtn.onclick = function () {
    artistModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === artistModal) {
      artistModal.style.display = "none";
    }
  };

  // Clear Artist Form
  function clearArtistForm() {
    artistName.value = "";
    artistEmail.value = "";
    artistGender.value = "";
    artistAddress.value = "";
    artistDOB.value = "";
    firstReleaseYear.value = "";
    albumsReleased.value = "";
  }

  document.addEventListener("click", async function (event) {
    if (event.target && event.target.id === "editArtistBtn") {
      artistModalTitle.textContent = "Edit Artist";
      const artistId = event.target.dataset.id;
      await fetchArtistDetails(artistId);
    }
  });

  async function fetchArtistDetails(artistId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/artists/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const artist = response.data;

      artistName.value = artist.name || "";
      artistEmail.value = artist.email || "";

      artistGender.value = artist.gender || "";
      artistAddress.value = artist.address || "";
      artistDOB.value = artist.dob ? artist.dob.split("T")[0] : "";
      firstReleaseYear.value = artist.firstReleaseYear || "";
      albumsReleased.value = artist.noOfAlbumsReleased || "";

      editingArtistId = artistId;
      artistModal.style.display = "flex";
    } catch (error) {
      handleError(error);
    }
  }

  // Save Artist
  saveArtistBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    let valid = true;

    const artistData = {
      name: artistName.value.trim(),
      gender: artistGender.value,
      address: artistAddress.value.trim(),
      dob: artistDOB.value,
      email: artistEmail.value.trim(),
      firstReleaseYear: firstReleaseYear.value,
      noOfAlbumsReleased: albumsReleased.value,
    };

    for (const key in artistData) {
      if (!artistData[key]) {
        valid = false;
        alert(`${key} is required`);
        break;
      }
    }

    if (!valid) return;

    try {
      if (editingArtistId) {
        await axios.put(
          `${API_BASE_URL}/artists/${editingArtistId}`,
          artistData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast("Artist updated successfully", RESPONSE_TYPE.SUCCESS);
      } else {
        await axios.post(`${API_BASE_URL}/artists`, artistData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("Artist created successfully!", RESPONSE_TYPE.SUCCESS);
      }

      artistModal.style.display = "none";
      fetchData("artists");
    } catch (error) {
      handleError(error);
    }
  });

  document.addEventListener("click", async function (event) {
    if (event.target.id === "deleteArtistBtn") {
      const artistId = event.target.dataset.id;

      if (confirm("Are you sure you want to delete this artist?")) {
        try {
          await axios.delete(`${API_BASE_URL}/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          showToast("Artist deleted successfully!", RESPONSE_TYPE.SUCCESS);
          fetchData("artists");
        } catch (error) {
          handleError(error);
        }
      }
    }
  });

  document.addEventListener("click", async function (event) {
    if (event.target && event.target.id === "viewSongsBtn") {
      const artistId = event.target.dataset.id;
      window.location.href = `song.html?artistId=${artistId}`;
    }
  });
});

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    passwordField.type =
      passwordField.type === "password" ? "text" : "password";
    this.src =
      passwordField.type === "password"
        ? "https://cdn-icons-png.flaticon.com/512/159/159604.png"
        : "https://cdn-icons-png.flaticon.com/512/565/565655.png";
  });
