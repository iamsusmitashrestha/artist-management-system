import {
  API_BASE_URL,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from "../constants/common.js";
import { formatDOB } from "../utils/common.js";

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    });
  } else {
    console.error("Logout button not found!");
  }

  const userRole = localStorage.getItem("userRole");

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

  let currentPage = DEFAULT_PAGE;
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  async function fetchUsers(page) {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users`, {
        params: { page, limit: DEFAULT_PAGE_SIZE },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      renderUsers(data.data);
      document.getElementById("pageNumber").textContent = page;

      prevButton.disabled = currentPage === 1;
      nextButton.disabled = data.data.length < DEFAULT_PAGE_SIZE;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  function renderUsers(users) {
    const container = document.getElementById("userContainer");
    container.innerHTML = "";
    // Create table element
    const table = document.createElement("table");
    table.classList.add("user-table");

    // Create table header
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

    // Create table body
    const tbody = document.createElement("tbody");

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.phone || "N/A"}</td>
      <td>${user.address || "N/A"}</td>
      <td>${formatDOB(user.dob)}</td>
      <td>${user.gender || "N/A"}</td>
      <td>${user.role}</td>
    `;
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchUsers(currentPage);
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    fetchUsers(currentPage);
  });

  fetchUsers(currentPage);
});
