import {
  API_BASE_URL,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "../constants/common.js";
import { clearError, formatDOB, showError } from "../utils/common.js";
// import { showToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
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
    artist: ["songs-tab"],
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
      nextButtons[type].disabled = data.data.length < DEFAULT_PAGE_SIZE;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
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
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.address}</td>
        <td>${formatDOB(item.dob)}</td>
        <td>${item.gender || "N/A"}</td>
        <td>${item.firstReleaseYear || "N/A"}</td>
        <td>${item.noOfAlbumsReleased}</td>
      `;
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

  fetchData("users");
  fetchData("artists");

  // Create user
  const modal = document.getElementById("userModal");
  const createBtn = document.getElementById("createBtn");
  const closeBtn = document.querySelector(".close");
  const submitBtn = document.getElementById("submitBtn");

  createBtn.onclick = function () {
    modal.style.display = "flex";
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  const saveButton = document.getElementById("saveBtn");

  saveButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let valid = true;

    // Collect form data
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const phone = document.getElementById("phone");
    const role = document.getElementById("role");
    const dob = document.getElementById("dob");
    const address = document.getElementById("address");
    const gender = document.getElementById("gender");

    if (firstName.value.trim() === "") {
      showError(firstName, "First name is required.");
      valid = false;
    } else clearError(firstName);

    if (lastName.value.trim() === "") {
      showError(lastName, "Last name is required.");
      valid = false;
    } else clearError(lastName);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.value)) {
      showError(email, "Enter a valid email.");
      valid = false;
    } else clearError(email);

    if (password.value.length < 6) {
      showError(password, "Password must be at least 6 characters.");
      valid = false;
    } else clearError(password);

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone.value)) {
      showError(phone, "Enter a valid 10-digit phone number.");
      valid = false;
    } else clearError(phone);

    if (role.value === "") {
      showError(role, "Please select a role.");
      valid = false;
    } else clearError(role);

    if (!valid) return;

    // Prepare request payload
    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
      role: role.value,
      dob: dob.value,
      address: address.value,
      gender: gender.value,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      modal.style.display = "none";

      // if (response.status === statusCodes.CREATED) {
      //   showToast("User created successfully", RESPONSE_TYPE.SUCCESS);
      // }
    } catch (error) {
      console.log("Something went wrong");
      // showToast("Something went wrong");
    }
  });
});
