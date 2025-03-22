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

      // const tabName = button.dataset.tabTarget.replace("#", "");
      // if (tabName === "artists-tab" && !isArtistsFetched) {
      //   fetchData("artists");
      //   isArtistsFetched = true;
      // }
    });
  });

  let currentPage = { users: DEFAULT_PAGE, artists: DEFAULT_PAGE };
  let isArtistsFetched = false;

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
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
});
